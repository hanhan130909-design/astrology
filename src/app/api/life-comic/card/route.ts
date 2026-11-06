/**
 * GET /api/life-comic/card?year=2004&month=6&day=9&hour=16&minute=10&gender=0
 *
 * 生成一张 540×590 的可分享 PNG：三张完整 9:16 示例画面并排 +
 * 该生日专属的三句字幕。用 sharp 合成（SVG 叠层），不依赖浏览器截图。
 *
 * 早期版本把 9:16 图裁成 540×240 横条，第三格人脸会被切掉；
 * 改为三列竖图后保留完整构图，也不用猜裁切位置。
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { z } from "zod";
import { buildLifeComic, FREE_PANEL_COUNT, WATERMARK, DISCLAIMER } from "@/lib/chartComic";
import { siteUrl } from "@/lib/seoMetadata";

export const runtime = "nodejs";

const W = 540;
const HEADER = 100;
const PANEL_W = 160;
const PANEL_H = 284;
const PANEL_GAP = 10;
const PANEL_LEFT = 20;
const CAPTION_H = 76;
const FOOTER = 130;
const IMG_TOP = HEADER;
const CAPTION_TOP = HEADER + PANEL_H;
const FOOTER_TOP = CAPTION_TOP + CAPTION_H;
const H = FOOTER_TOP + FOOTER;

const QuerySchema = z.object({
  year: z.coerce.number().int().min(1900).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  hour: z.coerce.number().int().min(0).max(23),
  minute: z.coerce.number().int().min(0).max(59),
  gender: z.coerce.number().int().refine((v) => v === 0 || v === 1),
});

const ELEMENT_COLOR: Record<string, string> = {
  木: "#4a9b58", 火: "#b82e2e", 土: "#9a7a43", 金: "#c08b2d", 水: "#2f66c9",
};

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/** 字幕最多两行，每行 9 字（面板宽 160px / 14px 字） */
function wrapCaption(caption: string): string[] {
  const chars = Array.from(caption);
  if (chars.length <= 9) return [caption];
  return [chars.slice(0, 9).join(""), chars.slice(9, 17).join("") + (chars.length > 17 ? "…" : "")];
}

async function loadAsset(name: string): Promise<Buffer> {
  try {
    return readFileSync(join(process.cwd(), "public/life-comic", name));
  } catch {
    // Serverless 环境若没带上 public 文件，回源到本站静态资源
    const res = await fetch(siteUrl(`/life-comic/${name}`));
    if (!res.ok) throw new Error(`asset_unavailable: ${name}`);
    return Buffer.from(await res.arrayBuffer());
  }
}

function overlaySvg(accent: string, metaLine: string, captions: string[]): string {
  const columns = captions.map((caption, i) => {
    const x = PANEL_LEFT + i * (PANEL_W + PANEL_GAP);
    const lines = wrapCaption(caption);
    const texts = lines.map((line, j) =>
      `<text x="${x}" y="${CAPTION_TOP + 26 + j * 22}" font-size="14" font-weight="600" fill="#111111">${escapeXml(line)}</text>`,
    ).join("");
    return `
      <rect x="${x}" y="${IMG_TOP}" width="${PANEL_W}" height="${PANEL_H}" fill="none" stroke="#eeeeee" stroke-width="1"/>
      <circle cx="${x + 12}" cy="${IMG_TOP + 16}" r="10" fill="#000000" opacity="0.5"/>
      <text x="${x + 12}" y="${IMG_TOP + 20}" font-size="10" fill="#ffffff" text-anchor="middle">${i + 1}</text>
      <text x="${x}" y="${CAPTION_TOP + 12}" font-size="10" fill="${accent}">第 ${i + 1} 格</text>
      ${texts}
    `;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="0" y="0" width="${W}" height="6" fill="${accent}"/>
  <text x="20" y="34" font-size="12" letter-spacing="2" fill="${accent}">LUNAXSTAR · 人生小传</text>
  <text x="20" y="66" font-size="24" font-weight="600" fill="#111111">我的人生，前 3 格</text>
  <text x="20" y="90" font-size="12" fill="#888888">${escapeXml(metaLine)}</text>
  ${columns}
  <rect x="0" y="${FOOTER_TOP}" width="${W}" height="${FOOTER}" fill="#ffffff"/>
  <line x1="20" y1="${FOOTER_TOP + 16}" x2="${W - 20}" y2="${FOOTER_TOP + 16}" stroke="#eeeeee" stroke-width="1"/>
  <text x="20" y="${FOOTER_TOP + 46}" font-size="14" fill="#111111">lunaxstar.com/life-comic</text>
  <text x="20" y="${FOOTER_TOP + 72}" font-size="12" fill="#888888">也来生成属于你的那一张</text>
  <text x="20" y="${FOOTER_TOP + 104}" font-size="11" fill="#aaaaaa">${escapeXml(WATERMARK)} · 内容由 AI 生成 · ${escapeXml(DISCLAIMER)}</text>
</svg>`;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const parsed = QuerySchema.safeParse({
    year: q.get("year"), month: q.get("month"), day: q.get("day"),
    hour: q.get("hour"), minute: q.get("minute"), gender: q.get("gender"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_birth" }, { status: 400 });
  }

  try {
    const comic = buildLifeComic({
      ...parsed.data,
      gender: parsed.data.gender as 0 | 1,
    });
    const panels = comic.panels.slice(0, FREE_PANEL_COUNT);
    const accent = ELEMENT_COLOR[comic.meta.element] || "#111111";

    const images = await Promise.all(
      panels.map((p) =>
        loadAsset(p.sampleImage.split("/").pop() || "p01.webp")
          .then((buf) => sharp(buf).resize(PANEL_W, PANEL_H, { fit: "cover" }).png().toBuffer()),
      ),
    );

    const base = await sharp({
      create: { width: W, height: H, channels: 4, background: "#ffffff" },
    }).composite(images.map((input, i) => ({
      input, left: PANEL_LEFT + i * (PANEL_W + PANEL_GAP), top: IMG_TOP,
    }))).png().toBuffer();

    const metaLine = [
      comic.meta.solarText.split(" ")[0],
      `日主 ${comic.meta.dayMaster}`,
      comic.meta.animal,
    ].join(" · ");
    const overlay = Buffer.from(overlaySvg(accent, metaLine, panels.map((p) => p.caption)));
    const png = await sharp(base).composite([{ input: overlay, left: 0, top: 0 }]).png().toBuffer();

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="life-comic-card.png"',
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch (error) {
    console.error("life-comic card failed", error);
    return NextResponse.json({ error: "card_failed" }, { status: 500 });
  }
}
