/**
 * POST /api/life-comic
 *
 * 输入出生信息 → 用站点现有排盘引擎生成 12 格脚本 → 只返回免费的前 3 格。
 * 后 9 格不下发到浏览器，避免把完整内容免费送出去。
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildLifeComic, FREE_PANEL_COUNT, TOTAL_PANEL_COUNT } from "@/lib/chartComic";

export const runtime = "nodejs";

const BodySchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  gender: z.union([z.literal(0), z.literal(1)]),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_birth", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const comic = buildLifeComic(parsed.data);

    if (comic.compliance.violations.length || comic.compliance.captionsOver12.length) {
      return NextResponse.json({ error: "content_policy_failed" }, { status: 500 });
    }

    return NextResponse.json(
      {
        meta: comic.meta,
        style: comic.style,
        compliance: comic.compliance,
        panels: comic.panels.slice(0, FREE_PANEL_COUNT),
        locked: {
          total: TOTAL_PANEL_COUNT,
          remaining: TOTAL_PANEL_COUNT - FREE_PANEL_COUNT,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("life-comic generation failed", error);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
