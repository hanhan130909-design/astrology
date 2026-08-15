"use client";

import { useState, useMemo, useCallback } from "react";
import { calcQiMen, PALACE_META, getGuaInfo, getGeJu } from "@/lib/qimenCalc";

// 八神颜色
const GOD_COLOR: Record<string, string> = {
  值符: "text-rose-600", 螣蛇: "text-orange-500", 太阴: "text-indigo-500",
  六合: "text-emerald-600", 勾陈: "text-gray-600", 白虎: "text-gray-600",
  朱雀: "text-red-500", 玄武: "text-blue-600", 九地: "text-amber-600", 九天: "text-sky-600",
};
// 八门颜色
const GATE_COLOR: Record<string, string> = {
  生门: "text-emerald-600", 死门: "text-gray-400", 开门: "text-amber-600",
  休门: "text-blue-600", 景门: "text-red-500", 惊门: "text-orange-600",
  伤门: "text-rose-600", 杜门: "text-teal-600",
};
// 五行颜色
const ELEMENT_COLOR: Record<string, string> = {
  木: "text-emerald-600", 火: "text-red-600", 土: "text-amber-600",
  金: "text-gray-500", 水: "text-blue-600",
};

const THREE_QI = new Set(["乙", "丙", "丁"]); // 三奇

export default function QiMenPage() {
  const now = new Date();
  const [Y, setY] = useState(now.getFullYear());
  const [M, setM] = useState(now.getMonth() + 1);
  const [D, setD] = useState(now.getDate());
  const [H, setH] = useState(now.getHours());
  const [sel, setSel] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen text-[#1f2937]" style={{ background: "#faf8f4" }}>
      <main className="max-w-[460px] mx-auto px-4 py-5">

        {/* ── 头部 ── */}
        <header className="text-center mb-4">
          <div className="inline-flex items-center gap-2 text-[11px] text-gray-400 mb-2">
            <span className="h-px w-6 bg-gray-300" />
            奇门遁甲 · 转盘排盘
            <span className="h-px w-6 bg-gray-300" />
          </div>
          <h1 className="text-lg font-semibold tracking-wide mb-1">{c.yinYang}遁{c.ju}局</h1>
          <p className="text-[13px] text-gray-700">
            {Y}年{M}月{D}日 {String(H).padStart(2, "0")}:00
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">{c.lunarText} · {c.yearPillar}年</p>
        </header>

        {/* ── 四柱 ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-2 text-gray-400 font-normal w-[18%]">四柱</th>
                {pillars.map((x) => (
                  <th key={x.l} className="py-2 text-gray-500 font-normal">{x.l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-2 text-gray-400">干支</td>
                {pillars.map((x) => (
                  <td key={x.l} className="py-2 font-semibold text-[14px] tracking-wide">{x.v}</td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-gray-400">空亡</td>
                {pillars.map((x) => (
                  <td key={x.l} className="py-2 text-gray-400 text-[11px]">{x.k || "—"}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── 局数信息徽章 ── */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-3">
          <Badge label={`${c.jieQi} · ${c.yuan}`} tone="gray" />
          <Badge label={`旬首 ${c.xunShou}`} tone="gray" />
          <Badge label={`值符 ${c.zhiFuStar}`} tone="red" />
          <Badge label={`值使 ${c.zhiShiDoor}`} tone="red" />
          <Badge label={`马星 ${c.maStar}`} tone="blue" />
          <Badge label={`天禽寄${c.tianQinDir}`} tone="gray" />
          {c.fuYin && <Badge label="伏吟" tone="red" />}
          {c.fanYin && <Badge label="反吟" tone="red" />}
        </div>

        {/* ── 九宫格 ── */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm grid grid-cols-3 gap-px bg-gray-200 mb-3">
          {PALACE_META.map((pl, palace) => {
            const isCenter = palace === 4;
            const isValue = palace === c.zhiFuPalace;
            const isKongWang = c.kongWangPalaces.includes(palace);
            const isMaStar = palace === c.maStarPalace;
            const isSelected = sel === palace;
            const god = c.gods[palace] || "";
            const star = c.stars[palace] || "";
            const door = c.doors[palace] || "";
            const tian = c.tianPan[palace] || "";
            const di = c.diPan[palace] || "";
            const cs = c.changSheng[palace] || "";
            const conds = c.conds[palace] || [];

            return (
              <div key={palace}
                onClick={() => setSel(isSelected ? null : palace)}
                className={`relative aspect-square cursor-pointer flex flex-col p-1 transition-colors
                  ${isSelected ? "z-10 ring-2 ring-inset ring-gray-700" : ""}`}
                style={{ background: isValue ? "#fef2f2" : isCenter ? "#fffbeb" : isMaStar ? "#f0f7ff" : isKongWang ? "#fafafa" : "#ffffff" }}>

                {/* 状态角标 */}
                {conds.length > 0 && (
                  <div className="absolute top-1 right-1 flex gap-0.5">
                    {conds.includes("入墓") && <Dot color="bg-purple-500" title="入墓" />}
                    {conds.includes("门迫") && <Dot color="bg-orange-500" title="门迫" />}
                    {conds.includes("击刑") && <Dot color="bg-red-500" title="击刑" />}
                  </div>
                )}

                {/* 卦 + 方位洛书 */}
                <div className="flex justify-between items-center leading-none">
                  <span className="text-[11px] text-gray-300">{pl.trigram}</span>
                  <span className="text-[8px] text-gray-300">{pl.direction}{pl.luoshu}</span>
                </div>

                {/* 八神 */}
                <div className={`text-center text-[11px] font-semibold leading-tight mt-0.5 ${GOD_COLOR[god] || "text-gray-200"}`}>
                  {god || "—"}
                </div>

                {/* 九星 + 五行 */}
                <div className="flex justify-between items-center px-1 mt-1">
                  <span className="text-[11px] font-semibold text-gray-700">{star}</span>
                  <span className={`text-[9px] font-medium ${ELEMENT_COLOR[pl.element] || ""}`}>{pl.element}</span>
                </div>

                {/* 八门（大字） */}
                <div className={`flex-1 flex items-center justify-center text-[23px] font-bold tracking-wide ${GATE_COLOR[door] || "text-gray-300"}`}>
                  {door || "·"}
                </div>

                {/* 天盘干 + 地盘干 + 长生 */}
                <div className="flex items-end justify-between px-1 pb-0.5 leading-none">
                  <span className="text-[8px] text-gray-300">{cs || ""}</span>
                  <span className="text-[10px] text-gray-400">{tian || ""}</span>
                  <span className={`text-[16px] font-bold ${THREE_QI.has(di) ? "text-emerald-600" : "text-gray-800"}`}>{di}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 宫位详情 ── */}
        {sel !== null && (() => {
          const pl = PALACE_META[sel];
          const gua = getGuaInfo(pl.gua);
          const geJu = getGeJu(c.tianPan[sel], c.diPan[sel]);
          const condList = c.conds[sel] || [];
          return (
            <div className="mb-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-xs space-y-3">
              {/* 卦象 */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl leading-none">{pl.trigram}</span>
                  <span className="font-semibold text-sm">{pl.gua}宫</span>
                  <span className="text-gray-400">洛书{pl.luoshu} · {pl.element} · {pl.direction}方</span>
                </div>
                {pl.gua !== "中" ? (
                  <div className="text-gray-500 leading-relaxed">
                    <Row k="卦象" v={`${gua.xiang}（${gua.meaning}）`} />
                    <Row k="家庭" v={gua.family} />
                    <Row k="身体" v={gua.body} />
                    <Row k="动物" v={gua.animal} />
                    <Row k="季节" v={gua.season} />
                  </div>
                ) : (
                  <div className="text-gray-400">中宫无卦，寄坤宫（天禽寄二宫）</div>
                )}
              </div>

              {/* 格局（十干克应） */}
              <div className="border-t border-gray-100 pt-2.5">
                {geJu ? (
                  <div>
                    <div className="mb-0.5">
                      <span className="text-gray-400">格局（{c.tianPan[sel]}+{c.diPan[sel]}）</span>
                      <b className={`ml-1.5 text-sm ${geJu.ji.includes("凶") ? "text-red-600" : "text-emerald-600"}`}>{geJu.name}</b>
                      <span className={`ml-1 ${geJu.ji.includes("凶") ? "text-red-400" : "text-emerald-500"}`}>（{geJu.ji}）</span>
                    </div>
                    <div className="text-gray-500">{geJu.desc}</div>
                  </div>
                ) : (
                  <div className="text-gray-400">格局（{c.tianPan[sel] || "—"}+{c.diPan[sel] || "—"}）：—</div>
                )}
              </div>

              {/* 神星门 */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 border-t border-gray-100 pt-2.5">
                <div>神 <b className="text-purple-600">{c.gods[sel] || "—"}</b></div>
                <div>星 <b className="text-gray-700">{c.stars[sel] || "—"}</b><span className="text-gray-400 ml-0.5">{c.starJixiong[sel] && `·${c.starJixiong[sel]}`}</span></div>
                <div>门 <b className="text-red-600">{c.doors[sel] || "—"}</b><span className="text-gray-400 ml-0.5">{c.doorJixiong[sel] && `·${c.doorJixiong[sel]}`}</span></div>
                <div>天盘干 <b>{c.tianPan[sel] || "—"}</b></div>
                <div>地盘干 <b>{c.diPan[sel] || "—"}</b></div>
                <div>长生 <span>{c.changSheng[sel] || "—"}</span></div>
                <div className="col-span-3">状态 <span className={condList.length ? "text-red-500" : "text-gray-400"}>{condList.join(" + ") || "正常"}</span></div>
              </div>
            </div>
          );
        })()}

        {/* ── 图例 ── */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[10px] text-gray-400 mb-3">
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-rose-400 mr-1" />值符宫</span>
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1" />入墓</span>
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1" />门迫</span>
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1" />击刑</span>
          <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />三奇</span>
        </div>

        {/* ── 导航 ── */}
        <div className="flex justify-center gap-3 mb-2">
          <button onClick={() => stepHour(-2)} className="px-5 py-2 rounded-full bg-white border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">← 上一时辰</button>
          <button onClick={() => stepHour(2)} className="px-5 py-2 rounded-full bg-gray-900 text-white text-xs hover:bg-gray-800 shadow-sm transition-colors">下一时辰 →</button>
        </div>

        <p className="text-center text-[10px] text-gray-300">点击宫位查看卦象与格局 · 每时辰 2 小时</p>
      </main>
    </div>
  );
}

// ── 小组件 ──
function Badge({ label, tone }: { label: string; tone: "gray" | "red" | "blue" }) {
  const cls = tone === "red"
    ? "bg-rose-50 text-rose-600 border-rose-100"
    : tone === "blue"
      ? "bg-blue-50 text-blue-600 border-blue-100"
      : "bg-white text-gray-600 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${cls}`}>{label}</span>
  );
}

function Dot({ color, title }: { color: string; title: string }) {
  return <span className={`w-1.5 h-1.5 rounded-full ${color}`} title={title} />;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 shrink-0">{k}</span>
      <span className="text-gray-600">{v}</span>
    </div>
  );
}
