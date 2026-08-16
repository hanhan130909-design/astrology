"use client";

import { useState, useMemo, useCallback } from "react";
import { calcQiMen, PALACE_META, STAR_ORIGINAL, DOOR_ORIGINAL, getGuaInfo, getGeJu } from "@/lib/qimenCalc";

type View = "合" | "地" | "天" | "人" | "神";

// 十二时辰（每时辰 2 小时，取该时辰起始小时）
const SHICHEN: { label: string; start: number; range: string }[] = [
  { label: "子时", start: 23, range: "23-01" },
  { label: "丑时", start: 1, range: "01-03" },
  { label: "寅时", start: 3, range: "03-05" },
  { label: "卯时", start: 5, range: "05-07" },
  { label: "辰时", start: 7, range: "07-09" },
  { label: "巳时", start: 9, range: "09-11" },
  { label: "午时", start: 11, range: "11-13" },
  { label: "未时", start: 13, range: "13-15" },
  { label: "申时", start: 15, range: "15-17" },
  { label: "酉时", start: 17, range: "17-19" },
  { label: "戌时", start: 19, range: "19-21" },
  { label: "亥时", start: 21, range: "21-23" },
];

// 热卜配色：白底，深灰文字，青色星(#0dc2b3)，红色门
const STAR_TEAL = "#0dc2b3";
const GATE_COLOR: Record<string, string> = {
  生门: "#e0392f", 死门: "#666666", 开门: "#e0392f",
  休门: "#e0392f", 景门: "#e0392f", 惊门: "#e0392f",
  伤门: "#e0392f", 杜门: "#e0392f",
};
const THREE_QI = new Set(["乙", "丙", "丁"]);

const TABS: { id: View; label: string }[] = [
  { id: "合", label: "综合" },
  { id: "地", label: "地盘" },
  { id: "天", label: "天盘" },
  { id: "人", label: "人盘" },
  { id: "神", label: "神盘" },
];

export default function QiMenPage() {
  const now = new Date();
  const [Y, setY] = useState(now.getFullYear());
  const [M, setM] = useState(now.getMonth() + 1);
  const [D, setD] = useState(now.getDate());
  const [H, setH] = useState(now.getHours());
  const [sel, setSel] = useState<number | null>(null);
  const [view, setView] = useState<View>("合");

  const c = useMemo(() => calcQiMen(Y, M, D, H), [Y, M, D, H]);

  const stepHour = useCallback((delta: number) => {
    const dt = new Date(Y, M - 1, D, H);
    dt.setHours(dt.getHours() + delta);
    setY(dt.getFullYear()); setM(dt.getMonth() + 1); setD(dt.getDate()); setH(dt.getHours());
  }, [Y, M, D, H]);

  const pillars = [
    { l: "年柱", v: c.yearPillar, k: c.kongWang[0] },
    { l: "月柱", v: c.monthPillar, k: c.kongWang[1] },
    { l: "日柱", v: c.dayPillar, k: c.kongWang[2] },
    { l: "时柱", v: c.timePillar, k: c.kongWang[3] },
  ];

  const maxDay = new Date(Y, M, 0).getDate();
  const shiIdx = Math.floor(((H + 1) % 24) / 2);

  return (
    <div className="min-h-screen text-[#333]" style={{ background: "#f6f6f6" }}>
      <main className="max-w-[520px] mx-auto px-4 py-4" style={{ background: "#ffffff" }}>

        {/* 起盘（选时间） */}
        <div className="flex items-center gap-1.5 mb-3 p-2 rounded-lg" style={{ background: "#f6f6f6" }}>
          <input type="number" value={Y} min={1900} max={2100}
            onChange={(e) => setY(Number(e.target.value) || 2026)}
            className="w-[66px] px-1.5 py-1 rounded border border-[#ddd] text-[13px] text-center" />
          <span className="text-[11px] text-[#999] shrink-0">年</span>
          <select value={M} onChange={(e) => { const m = Number(e.target.value); setM(m); const mx = new Date(Y, m, 0).getDate(); if (D > mx) setD(mx); }}
            className="px-1 py-1 rounded border border-[#ddd] text-[13px]">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}月</option>)}
          </select>
          <select value={Math.min(D, maxDay)} onChange={(e) => setD(Number(e.target.value))}
            className="px-1 py-1 rounded border border-[#ddd] text-[13px]">
            {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}日</option>)}
          </select>
          <select value={SHICHEN[shiIdx].start} onChange={(e) => setH(Number(e.target.value))}
            className="px-1 py-1 rounded border border-[#ddd] text-[13px]">
            {SHICHEN.map((s) => <option key={s.label} value={s.start}>{s.label}时 {s.range}</option>)}
          </select>
          <button onClick={() => { const n = new Date(); setY(n.getFullYear()); setM(n.getMonth() + 1); setD(n.getDate()); setH(n.getHours()); }}
            className="ml-auto px-2.5 py-1 rounded text-[12px] text-white shrink-0" style={{ background: "#0dc2b3" }}>现在</button>
        </div>

        {/* 盘式 */}
        <Section label="盘式">
          <span className="text-[13px] font-medium text-[#333]">转盘奇门-寄坤宫-拆补-值使门起</span>
        </Section>

        {/* 日期 */}
        <Section label="日期">
          <span className="text-[13px] text-[#333]">
            {Y}年{String(M).padStart(2, "0")}月{String(D).padStart(2, "0")}日 {String(H).padStart(2, "0")}时00分
            <span className="text-gray-400">（{c.lunarText}）</span>
          </span>
        </Section>

        {/* 四柱 */}
        <div className="mt-3 border border-[#eee] rounded-lg overflow-hidden">
          <table className="w-full text-center text-[12px]">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#eee]">
                <th className="py-1.5 text-[#999] font-normal w-[15%]">四柱</th>
                {pillars.map((x) => <th key={x.l} className="py-1.5 text-[#666] font-normal">{x.l}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#f0f0f0]">
                <td className="py-1.5 text-[#999]">干支</td>
                {pillars.map((x) => <td key={x.l} className="py-1.5 font-semibold text-[#333]">{x.v}</td>)}
              </tr>
              <tr>
                <td className="py-1.5 text-[#999]">空亡</td>
                {pillars.map((x) => <td key={x.l} className="py-1.5 text-[#999]">{x.k || "—"}</td>)}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 节气 */}
        <Section label="节气">
          <span className="text-[13px] text-[#333]">
            <span className="text-[#666]">{c.prevJqText.split(" ")[0]}</span> <b>{c.prevJqText.split(" ")[1]}</b>
            <span className="mx-2 text-[#ccc]">|</span>
            <span className="text-[#666]">{c.nextJqText.split(" ")[0]}</span> <b>{c.nextJqText.split(" ")[1]}</b>
          </span>
        </Section>

        {/* 旬首/局数/值符/值使/马星 */}
        <div className="mt-3">
          <div className="grid grid-cols-5 gap-1 text-center">
            {["旬首", "局数", "值符", "值使", "马星"].map((l) => (
              <div key={l} className="text-[11px] text-[#999]">{l}</div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 text-center mt-0.5">
            <div className="text-[13px] font-medium text-[#333]">{c.xunShou}{c.fuShou}</div>
            <div className="text-[13px] font-medium text-[#333]">{c.yuan}{c.yinYang}{c.ju}</div>
            <div className="text-[13px] font-medium" style={{ color: STAR_TEAL }}>{c.zhiFuStar}</div>
            <div className="text-[13px] font-medium text-[#e0392f]">{c.zhiShiDoor}</div>
            <div className="text-[13px] font-medium text-[#333]">{c.maStar}</div>
          </div>
          {(c.fuYin || c.fanYin) && (
            <div className="text-center text-[11px] text-[#e0392f] mt-1">{c.fuYin ? "伏吟" : ""}{c.fanYin ? "反吟" : ""}</div>
          )}
        </div>

        {/* 盘式切换 */}
        <div className="flex gap-1 mt-4 mb-2 border-b border-[#eee]">
          {TABS.map((t) => (
            <button key={t.id}
              onClick={() => setView(t.id)}
              className={`px-3 py-1.5 text-[12px] font-medium border-b-2 transition-colors ${
                view === t.id ? "border-[#0dc2b3] text-[#0dc2b3]" : "border-transparent text-[#999]"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* 九宫格 */}
        <div className="grid grid-cols-3 gap-px bg-[#e5e5e5] border border-[#e5e5e5] rounded-lg overflow-hidden">
          {PALACE_META.map((pl, palace) => {
            const isCenter = palace === 4;
            const isValue = palace === c.zhiFuPalace;
            const isZhiShi = palace === c.zhiShiPalace;
            const god = c.gods[palace] || "";
            const star = c.stars[palace] || "";
            const door = c.doors[palace] || "";
            const tian = c.tianPan[palace] || "";
            const di = c.diPan[palace] || "";
            const cs = c.changSheng[palace] || "";
            const starOrig = STAR_ORIGINAL[palace] || "";
            const doorOrig = DOOR_ORIGINAL[palace] || "";
            const conds = c.conds[palace] || [];
            const isSelected = sel === palace;

            return (
              <div key={palace}
                onClick={() => setSel(isSelected ? null : palace)}
                className={`relative aspect-square cursor-pointer flex flex-col p-1.5 bg-white
                  ${isSelected ? "z-10 outline outline-2 outline-[#0dc2b3]" : ""}`}
                style={{ background: isValue || isZhiShi ? "#fdf2f2" : isCenter ? "#fffbeb" : "#ffffff" }}>

                {/* 条件角标 */}
                {view === "合" && conds.length > 0 && (
                  <div className="absolute top-0.5 right-1 flex gap-0.5">
                    {conds.includes("入墓") && conds.includes("击刑")
                      ? <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#a21caf" }} title="刑+墓" />
                      : <>
                          {conds.includes("入墓") && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="入墓" />}
                          {conds.includes("门迫") && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" title="门迫" />}
                          {conds.includes("击刑") && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="击刑" />}
                        </>}
                  </div>
                )}

                {/* 综合盘：神·星·门·干（热卜布局） */}
                {view === "合" && (
                  <>
                    <div className="text-[12px] font-semibold text-[#333] leading-tight">{god || "·"}</div>
                    <div className="flex-1" />
                    <div className="flex justify-between items-end leading-none">
                      <span className="text-[13px] font-medium" style={{ color: STAR_TEAL }}>{star}</span>
                      <span className="text-[13px] text-[#333]">{tian}</span>
                    </div>
                    <div className="flex justify-between items-end leading-none mt-1">
                      <span className="text-[17px] font-bold" style={{ color: GATE_COLOR[door] || "#ccc" }}>{door}</span>
                      <span className={`text-[14px] font-semibold ${THREE_QI.has(di) ? "text-[#0aa88f]" : "text-[#333]"}`}>{di}</span>
                    </div>
                  </>
                )}

                {/* 地盘：三奇六仪 + 星门本位 */}
                {view === "地" && (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <span className={`text-[24px] font-bold ${THREE_QI.has(di) ? "text-[#0aa88f]" : "text-[#333]"}`}>{di || "·"}</span>
                    </div>
                    <div className="pb-0.5 space-y-0.5 text-center">
                      <div className="text-[9px] text-[#999]">{starOrig}</div>
                      <div className="text-[10px]" style={{ color: GATE_COLOR[doorOrig] || "#999" }}>{doorOrig || ""}</div>
                    </div>
                  </>
                )}

                {/* 天盘：九星 + 天盘干 */}
                {view === "天" && (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-[17px] font-semibold" style={{ color: STAR_TEAL }}>{star || "·"}</span>
                    </div>
                    <div className="flex items-end justify-between px-1 pb-0.5 leading-none">
                      <span className="text-[16px] font-bold text-[#333]">{tian || "·"}</span>
                      <span className="text-[10px] text-[#999]">{di || ""}</span>
                    </div>
                  </>
                )}

                {/* 人盘：八门落宫 */}
                {view === "人" && (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-[24px] font-bold" style={{ color: GATE_COLOR[door] || "#ccc" }}>{door || "·"}</span>
                    </div>
                  </>
                )}

                {/* 神盘：八神落宫 */}
                {view === "神" && (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-[19px] font-bold text-[#333]">{god || "·"}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 宫位详情 */}
        {sel !== null && (() => {
          const pl = PALACE_META[sel];
          const gua = getGuaInfo(pl.gua);
          const geJu = getGeJu(c.tianPan[sel], c.diPan[sel]);
          const condList = c.conds[sel] || [];
          return (
            <div className="mt-3 p-3 bg-[#fafafa] rounded-lg text-[12px] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[15px]">{pl.trigram}</span>
                <b>{pl.gua}宫</b>
                <span className="text-[#999]">{gua.xiang} · {pl.element} · {pl.direction}方</span>
              </div>
              {geJu && (
                <div>
                  <span className="text-[#999]">格局（{c.tianPan[sel]}+{c.diPan[sel]}）</span>
                  <b className={`ml-1 ${geJu.ji.includes("凶") ? "text-[#e0392f]" : "text-[#0aa88f]"}`}>{geJu.name}（{geJu.ji}）</b>
                  <div className="text-[#666]">{geJu.desc}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-x-2 gap-y-1 border-t border-[#eee] pt-2">
                <div>神 <b>{c.gods[sel] || "—"}</b></div>
                <div>星 <b style={{ color: STAR_TEAL }}>{c.stars[sel] || "—"}</b></div>
                <div>门 <b className="text-[#e0392f]">{c.doors[sel] || "—"}</b></div>
                <div>天盘干 <b>{c.tianPan[sel] || "—"}</b></div>
                <div>地盘干 <b>{c.diPan[sel] || "—"}</b></div>
                <div>长生 <span>{c.changSheng[sel] || "—"}</span></div>
                <div className="col-span-3">状态 <span className={condList.length ? "text-[#e0392f]" : "text-[#999]"}>{condList.join(" + ") || "正常"}</span></div>
              </div>
            </div>
          );
        })()}

        {/* 颜色说明 */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-[#999] mt-3">
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-rose-400 mr-1" />符使</span>
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1" />入墓</span>
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1" />击刑</span>
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1" />门迫</span>
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-fuchsia-600 mr-1" />刑+墓</span>
        </div>

        {/* 导航 */}
        <div className="flex justify-center gap-3 mt-3">
          <button onClick={() => stepHour(-2)} className="px-4 py-1.5 rounded-md bg-white border border-[#ddd] text-[12px] text-[#666] hover:bg-[#f5f5f5]">上一时辰</button>
          <button onClick={() => stepHour(2)} className="px-4 py-1.5 rounded-md border text-[12px] text-white hover:opacity-90" style={{ background: STAR_TEAL, borderColor: STAR_TEAL }}>下一时辰</button>
        </div>
      </main>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-baseline gap-2">
      <span className="text-[11px] text-[#999] shrink-0">{label}</span>
      <div>{children}</div>
    </div>
  );
}
