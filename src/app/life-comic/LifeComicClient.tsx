"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Sparkles, Loader2, Download, Copy, ArrowRight, Lock, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { track } from "@vercel/analytics";

type Panel = {
  id: string;
  title: string;
  caption: string;
  narration: string;
  scene: string;
  chartSource: string[];
  shot: string;
  seconds: number;
  sampleImage: string;
};

type Meta = {
  solarText: string;
  lunarText: string;
  animal: string;
  jieQi: string;
  pillars: Array<{ label: string; ganZhi: string; tenGod: string; naYin: string }>;
  dayMaster: string;
  element: string;
  interactions: { stems: string[]; branches: string[]; whole: string[] };
  shenSha: string[];
  daYun: string;
  liuNian: string;
  runtimeSeconds: number;
};

type Result = {
  meta: Meta;
  style: { aspect: string; watermark: string };
  compliance: { disclaimer: string };
  panels: Panel[];
  locked: { total: number; remaining: number };
};

const ELEMENT_COLOR: Record<string, string> = {
  木: "#4a9b58", 火: "#b82e2e", 土: "#9a7a43", 金: "#c08b2d", 水: "#2f66c9",
};

const CARD_W = 540;
const CARD_H = 590;
const PANEL_W = 160;
const PANEL_H = 284;
const PANEL_GAP = 10;
const PANEL_LEFT = 20;
const IMG_TOP = 100;
const CAPTION_TOP = 384;
const FOOTER_TOP = 460;

function fire(name: string, params: Record<string, string | number | boolean> = {}) {
  trackEvent(name, params);
  try {
    track(name, params);
  } catch {
    // Vercel Analytics 未就绪时不影响主流程
  }
}

function wrapCaption(caption: string): string[] {
  const chars = Array.from(caption);
  if (chars.length <= 9) return [caption];
  return [chars.slice(0, 9).join(""), chars.slice(9, 17).join("") + (chars.length > 17 ? "…" : "")];
}

/** 用浏览器 Canvas 画卡片，中文用访问者设备字体，避开服务端 SVG 缺中文字体的问题 */
async function drawCard(result: Result, accent: string): Promise<Blob> {
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W * scale;
  canvas.height = CARD_H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas_unavailable");
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, CARD_W, 6);
  ctx.fillStyle = accent;
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText("LUNAXSTAR · 人生小传", 20, 34);
  ctx.fillStyle = "#111111";
  ctx.font = '600 24px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText("我的人生，前 3 格", 20, 66);
  ctx.fillStyle = "#888888";
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(
    [result.meta.solarText.split(" ")[0], `日主 ${result.meta.dayMaster}`, result.meta.animal].join(" · "),
    20, 90,
  );

  for (let i = 0; i < result.panels.length; i++) {
    const p = result.panels[i];
    const x = PANEL_LEFT + i * (PANEL_W + PANEL_GAP);
    const img = new Image();
    img.src = p.sampleImage;
    await img.decode();
    ctx.drawImage(img, x, IMG_TOP, PANEL_W, PANEL_H);
    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, IMG_TOP + 0.5, PANEL_W - 1, PANEL_H - 1);

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.arc(x + 12, IMG_TOP + 16, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = '10px "PingFang SC", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(String(i + 1), x + 12, IMG_TOP + 20);
    ctx.textAlign = "left";

    ctx.fillStyle = accent;
    ctx.font = '10px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(`第 ${i + 1} 格`, x, CAPTION_TOP + 12);
    ctx.fillStyle = "#111111";
    ctx.font = '600 14px "PingFang SC", "Microsoft YaHei", sans-serif';
    wrapCaption(p.caption).forEach((line, j) => {
      ctx.fillText(line, x, CAPTION_TOP + 32 + j * 22);
    });
  }

  ctx.strokeStyle = "#eeeeee";
  ctx.beginPath();
  ctx.moveTo(20, FOOTER_TOP + 16);
  ctx.lineTo(CARD_W - 20, FOOTER_TOP + 16);
  ctx.stroke();
  ctx.fillStyle = "#111111";
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText("lunaxstar.com/life-comic", 20, FOOTER_TOP + 46);
  ctx.fillStyle = "#888888";
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText("也来生成属于你的那一张", 20, FOOTER_TOP + 72);
  ctx.fillStyle = "#aaaaaa";
  ctx.font = '11px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(
    `${result.style.watermark} · 内容由 AI 生成 · ${result.compliance.disclaimer}`,
    20, FOOTER_TOP + 104,
  );

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob_failed"))), "image/png");
  });
}

const fieldStyle: CSSProperties = {
  display: "flex", flexDirection: "column", gap: 6, minWidth: 0,
};
const labelStyle: CSSProperties = {
  fontSize: 12, color: "#666", fontWeight: 500,
};
const inputStyle: CSSProperties = {
  width: "100%", padding: "10px 12px", fontSize: 14,
  border: "1px solid #e5e5e5", borderRadius: 8,
  background: "#fff", color: "#111", outline: "none",
};

export default function LifeComicClient() {
  const [date, setDate] = useState("2004-06-09");
  const [time, setTime] = useState("16:10");
  const [gender, setGender] = useState<"0" | "1">("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [interested, setInterested] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function generate() {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
      setError("请填完整的出生日期和时间");
      return;
    }
    setError("");
    setLoading(true);
    setInterested(false);
    setCopied(false);
    fire("life_comic_form_submit");
    try {
      const res = await fetch("/api/life-comic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month, day, hour, minute, gender: Number(gender) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "generation_failed");
      setResult(data as Result);
      fire("life_comic_generate", { element: data.meta.element });
    } catch {
      setError("生成失败，请稍后再试");
      fire("life_comic_generate_error");
    } finally {
      setLoading(false);
    }
  }

  async function saveCard() {
    if (!result) return;
    setDownloading(true);
    fire("life_comic_share_click", { method: "download" });
    try {
      const blob = await drawCard(result, ELEMENT_COLOR[result.meta.element] || "#111111");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = "人生小传-前三格.png";
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
      fire("life_comic_share_success", { method: "download" });
    } catch {
      setError("保存失败，请换个浏览器再试");
      fire("life_comic_share_error", { method: "download" });
    } finally {
      setDownloading(false);
    }
  }

  async function copyText() {
    if (!result) return;
    const text = [
      "我的人生小传 · 前 3 格",
      ...result.panels.map((p, i) => `${i + 1}. ${p.caption}`),
      `日主 ${result.meta.dayMaster} · ${result.meta.animal}`,
      "你也来一张：https://lunaxstar.com/life-comic",
      result.compliance.disclaimer,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      fire("life_comic_share_click", { method: "copy" });
    } catch {
      setError("复制失败，请手动选择文字");
    }
  }

  function markInterest() {
    setInterested(true);
    fire("life_comic_interest", { element: result?.meta.element || "" });
  }

  const accent = result ? (ELEMENT_COLOR[result.meta.element] || "#111111") : "#111111";

  return (
    <div className="cx-page" style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 20px 80px" }}>
      <div className="cx-crumbs" style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
        <Link href="/">首页</Link> / 人生小传漫画
      </div>

      <div style={{ marginBottom: 26 }}>
        <div className="cx-chip" style={{ display: "inline-flex", marginBottom: 12 }}>
          免费看前 3 格 · 无需注册
        </div>
        <h1 className="cx-title" style={{ fontSize: 30, lineHeight: 1.3, margin: "0 0 10px" }}>
          把你的人生，写成一部漫画
        </h1>
        <p className="cx-sub" style={{ fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 640 }}>
          输入生日，用真实八字排盘生成 12 格人生小传。字幕、旁白、配色全部按你的出生信息实时生成，先看免费的前 3 格。
        </p>
        <p style={{ fontSize: 12, color: "#999", marginTop: 10, lineHeight: 1.6 }}>
          固定角色「小月」演绎 · 画面为示例插画 · 内容由 AI 生成 · 仅作文化娱乐参考
        </p>
      </div>

      <section className="cx-card cx-card-pad" style={{ marginBottom: 26 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="lc-date">出生日期（阳历）</label>
            <input id="lc-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="lc-time">出生时间</label>
            <input id="lc-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="lc-gender">性别</label>
            <select id="lc-gender" value={gender} onChange={(e) => setGender(e.target.value as "0" | "1")} style={inputStyle}>
              <option value="0">女</option>
              <option value="1">男</option>
            </select>
          </div>
          <div style={{ ...fieldStyle, justifyContent: "flex-end" }}>
            <button
              className="cx-btn cx-btn-accent"
              onClick={generate}
              disabled={loading}
              style={{ height: 41, justifyContent: "center", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? <Loader2 size={15} /> : <Sparkles size={15} />}
              {loading ? "生成中…" : "生成我的前 3 格"}
            </button>
          </div>
        </div>
        {error && <p style={{ color: "#b82e2e", fontSize: 13, margin: "12px 0 0" }}>{error}</p>}
      </section>

      {result && (
        <>
          <section className="cx-card cx-card-pad" style={{ marginBottom: 18, borderTop: `3px solid ${accent}` }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span className="cx-chip">{result.meta.dayMaster} · {result.meta.element}</span>
              <span className="cx-chip">{result.meta.animal}</span>
              <span className="cx-chip">{result.meta.solarText.split(" ")[0]}</span>
            </div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>
              <div>四柱：{result.meta.pillars.map((p) => `${p.ganZhi}（${p.tenGod}）`).join(" ｜ ")}</div>
              {result.meta.interactions.stems.length > 0 && (
                <div>天干：{result.meta.interactions.stems.join("、")}</div>
              )}
              {result.meta.shenSha.length > 0 && <div>神煞：{result.meta.shenSha.join("；")}</div>}
              {result.meta.daYun && <div>当前大运：{result.meta.daYun} · 流年 {result.meta.liuNian}</div>}
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 18 }}>
            {result.panels.map((p, i) => (
              <div key={p.id} className="cx-card" style={{ overflow: "hidden", borderTop: `2px solid ${accent}` }}>
                <div style={{ position: "relative", aspectRatio: "9 / 12", background: "#eee" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.sampleImage} alt={p.scene}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 22%" }}
                  />
                  <div style={{
                    position: "absolute", inset: "auto 0 0 0", padding: "26px 14px 14px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.72))", color: "#fff",
                  }}>
                    <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>第 {i + 1} 格 · {p.title}</div>
                    <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.4 }}>{p.caption}</div>
                  </div>
                  <div style={{ position: "absolute", right: 8, bottom: 6, fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
                    人生布局参考 · 文化娱乐研究
                  </div>
                </div>
                <div className="cx-card-pad" style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                  {p.narration}
                </div>
              </div>
            ))}
          </div>

          <section className="cx-card cx-card-pad" style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
              <h2 className="cx-card-title" style={{ fontSize: 16, margin: 0 }}>你的一张分享卡片</h2>
              <span style={{ fontSize: 12, color: "#999" }}>540 × 590 · 点保存后在本机生成</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, alignItems: "start" }}>
              <div style={{ width: "100%", maxWidth: 360 }}>
                <div style={{ borderTop: `6px solid ${accent}`, background: "#fff", paddingBottom: 8 }}>
                  <div style={{ padding: "12px 14px 8px" }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: accent }}>LUNAXSTAR · 人生小传</div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: "#111", marginTop: 4 }}>我的人生，前 3 格</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                      {result.meta.solarText.split(" ")[0]} · 日主 {result.meta.dayMaster} · {result.meta.animal}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7, padding: "0 14px" }}>
                    {result.panels.map((p, i) => (
                      <div key={p.id}>
                        <div style={{ position: "relative", aspectRatio: "160 / 284", background: "#eee" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.sampleImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{
                            position: "absolute", left: 6, top: 6, width: 18, height: 18,
                            borderRadius: "50%", background: "rgba(0,0,0,0.5)", color: "#fff",
                            fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                          }}>{i + 1}</div>
                        </div>
                        <div style={{ fontSize: 10, color: accent, marginTop: 5 }}>第 {i + 1} 格</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#111", lineHeight: 1.45 }}>
                          {wrapCaption(p.caption).map((line, j) => <div key={j}>{line}</div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid #eee", margin: "14px 14px 0", paddingTop: 10, fontSize: 11, color: "#888", lineHeight: 1.7 }}>
                    <div style={{ color: "#111", fontSize: 12 }}>lunaxstar.com/life-comic</div>
                    <div>也来生成属于你的那一张</div>
                    <div>{result.style.watermark} · 内容由 AI 生成 · {result.compliance.disclaimer}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="cx-stack" style={{ gap: 10, display: "flex", flexDirection: "column", marginBottom: 16 }}>
                  <button className="cx-btn cx-btn-primary" onClick={saveCard} disabled={downloading} style={{ justifyContent: "center" }}>
                    {downloading ? <Loader2 size={15} /> : <Download size={15} />} 保存这张卡片
                  </button>
                  <button className="cx-btn" onClick={copyText} style={{ justifyContent: "center" }}>
                    {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "已复制" : "复制分享文案"}
                  </button>
                  <button className="cx-btn" onClick={markInterest} disabled={interested} style={{ justifyContent: "center" }}>
                    {interested ? <Check size={15} /> : <Lock size={15} />}
                    {interested ? "已记下，完整版上线会开放" : `想要完整 ${result.locked.total} 格`}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: "#999", lineHeight: 1.8, margin: 0 }}>
                  卡片上的三句字幕来自你的四柱、十神、冲合、神煞与大运，换一个生日就会重写。
                  画面为固定角色的示例插画，完整版将按命盘实时出图。
                  内容由 AI 生成，{result.compliance.disclaimer}。
                </p>
              </div>
            </div>
          </section>

          <div style={{ fontSize: 12, color: "#999", lineHeight: 1.7, marginBottom: 30 }}>
            还有 {result.locked.remaining} 格与完整旁白未展示（{result.meta.runtimeSeconds} 秒竖屏动画版本正在制作）。
          </div>
        </>
      )}

      {!result && (
        <section className="cx-panel" style={{ marginTop: 26 }}>
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.9 }}>
            <div style={{ fontWeight: 500, color: "#111", marginBottom: 6 }}>这是怎么来的</div>
            先用站点现有的八字排盘算出四柱、十神、冲合、神煞与大运，再把每一组字段翻译成一格画面和一句字幕。
            所以同一个生日永远得到同一套文案，不同生日不会串。
            <div style={{ marginTop: 12, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/bazi" className="cx-chart-link">看完整八字排盘 <ArrowRight size={13} /></Link>
              <Link href="/compatibility/chinese" className="cx-chart-link">生肖配对矩阵 <ArrowRight size={13} /></Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
