"use client";

import { useState, useMemo, useCallback } from "react";
import { calcQiMen, PALACE_META } from "@/lib/qimenCalc";

// 八神颜色
const GOD_COLOR: Record<string, string> = {
  值符: "text-red-600", 螣蛇: "text-orange-500", 太阴: "text-indigo-500",
  六合: "text-emerald-600", 勾陈: "text-gray-600", 白虎: "text-gray-600",
  朱雀: "text-rose-500", 玄武: "text-blue-600", 九地: "text-amber-600", 九天: "text-sky-600",
};
// 八门颜色
const GATE_COLOR = (g: string) =>
  g === "生门" ? "text-emerald-600" : g === "死门" ? "text-gray-500" :
  g === "开门" ? "text-amber-600" : g === "休门" ? "text-blue-600" :
  g === "景门" ? "text-red-500" : g === "惊门" ? "text-orange-600" :
  g === "伤门" ? "text-rose-600" : g === "杜门" ? "text-teal-600" : "text-gray-700";

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
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[440px] mx-auto px-3 py-4">

        {/* 盘式 + 公历/农历 */}
        <div className="text-center mb-3">
          <div className="text-[10px] text-gray-400 mb-0.5">盘式</div>
          <div className="text-sm font-semibold mb-2">转盘奇门 · 天禽寄坤宫 · 拆补法 · 值使门起</div>
          <div className="text-[13px] font-medium">
            {Y}年{M}月{D}日 {H}时
          </div>
          <div className="text-[11px] text-gray-500">{c.lunarText} · {c.yearPillar}年</div>
        </div>

        {/* 四柱 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-1.5 text-gray-400 font-normal w-[18%]">四柱</th>
                {pillars.map((x) => (
                  <th key={x.l} className="py-1.5 text-gray-500 font-normal">{x.l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-1.5 text-gray-400">干支</td>
                {pillars.map((x) => (
                  <td key={x.l} className="py-1.5 font-semibold text-[13px]">{x.v}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 text-gray-400">空亡</td>
                {pillars.map((x) => (
                  <td key={x.l} className="py-1.5 text-gray-400 text-[11px]">{x.k || "—"}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 局数信息 */}
        <div className="text-center text-[11px] mb-3 space-y-1.5">
          <div className="text-gray-500">节气 <b className="text-gray-700">{c.jieQi}</b> · {c.yuan}</div>
          <div className="flex justify-center gap-x-3 gap-y-1 flex-wrap text-gray-600">
            <span>局数 <b className="text-gray-900">{c.yinYang}遁{c.ju}局</b></span>
            <span>旬首 <b>{c.xunShou}</b></span>
            <span>值符 <b className="text-red-600">{c.zhiFuStar}</b></span>
            <span>值使 <b className="text-red-600">{c.zhiShiDoor}</b></span>
            <span>马星 <b className="text-blue-600">{c.maStar}</b></span>
            <span>天禽寄 <b className="text-gray-700">{c.tianQinDir}</b></span>
          </div>
        </div>

        {/* 九宫格 */}
        <div className="grid grid-cols-3 gap-[2px] mb-3 bg-gray-300 rounded-lg overflow-hidden border-[3px] border-gray-300">
          {PALACE_META.map((pl, palace) => {
            const isCenter = palace === 4;
            const isValue = palace === c.zhiFuPalace;
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
                className={`relative aspect-square cursor-pointer flex flex-col
                  ${isSelected ? "ring-[3px] ring-gray-800 z-10" : ""}`}
                style={{ background: isCenter ? "#fffbeb" : isValue ? "#fef2f2" : "#fff" }}>

                {/* 状态角标 */}
                {conds.length > 0 && (
                  <div className="absolute top-1 right-1 flex gap-0.5">
                    {conds.includes("入墓") && <span className="w-2 h-2 rounded-full bg-purple-500" title="入墓" />}
                    {conds.includes("门迫") && <span className="w-2 h-2 rounded-full bg-orange-500" title="门迫" />}
                  </div>
                )}

                {/* 卦 · 方位 · 洛书数 */}
                <div className="flex justify-between items-center text-[9px] px-1 pt-1">
                  <span className="text-gray-300">{pl.trigram}</span>
                  <span className="text-gray-400">{pl.direction}{pl.luoshu}</span>
                </div>

                {/* 八神 */}
                <div className={`text-center text-[11px] font-bold leading-tight ${GOD_COLOR[god] || "text-gray-300"}`}>
                  {god || "—"}
                </div>

                {/* 九星 + 五行 */}
                <div className="flex justify-between items-center px-1.5 mt-0.5">
                  <span className="text-[11px] font-semibold text-blue-600">{star}</span>
                  <span className="text-[9px] text-gray-300">{pl.element}</span>
                </div>

                {/* 八门（大字） */}
                <div className={`flex-1 flex items-center justify-center text-[19px] font-black ${GATE_COLOR(door)}`}>
                  {door}
                </div>

                {/* 天盘干 + 地盘干 + 长生 */}
                <div className="flex items-end justify-between px-1.5 pb-1">
                  <span className="text-[9px] text-gray-300">{cs || "·"}</span>
                  <span className="text-[10px] text-gray-500">{tian || "·"}</span>
                  <span className={`text-[16px] font-bold ${THREE_QI.has(di) ? "text-emerald-600" : "text-gray-800"}`}>{di}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 宫位详情 */}
        {sel !== null && (() => {
          const pl = PALACE_META[sel];
          return (
            <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <div className="font-semibold mb-2">{pl.trigram} {pl.gua}宫（洛书{pl.luoshu}）· {pl.element} · {pl.direction}方</div>
              <div className="grid grid-cols-3 gap-2">
                <div>神: <b className="text-purple-600">{c.gods[sel] || "—"}</b></div>
                <div>星: <b className="text-blue-600">{c.stars[sel] || "—"}</b></div>
                <div>门: <b className="text-red-600">{c.doors[sel] || "—"}</b></div>
                <div>天盘干: <b>{c.tianPan[sel] || "—"}</b></div>
                <div>地盘干: <b>{c.diPan[sel] || "—"}</b></div>
                <div>长生: {c.changSheng[sel] || "—"}</div>
                <div className="col-span-3">状态: {(c.conds[sel] || []).join(" + ") || "正常"}</div>
              </div>
            </div>
          );
        })()}

        {/* 图例 */}
        <div className="text-center text-[10px] text-gray-400 mb-3 space-y-1">
          <div>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 align-middle mr-1" /><span className="mr-3">值符宫</span>
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 align-middle mr-1" /><span className="mr-3">入墓</span>
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 align-middle mr-1" /><span>门迫</span>
          </div>
          <div className="text-gray-400">三奇（乙丙丁）绿色标示 · 天盘干/地盘干 = 十干格局</div>
        </div>

        {/* 导航 */}
        <div className="flex justify-center gap-4 mb-2">
          <button onClick={() => stepHour(-2)} className="px-4 py-1.5 border rounded-lg text-xs hover:bg-gray-50">上一时辰</button>
          <button onClick={() => stepHour(2)} className="px-4 py-1.5 border rounded-lg text-xs hover:bg-gray-50">下一时辰</button>
        </div>

        <p className="text-center text-[9px] text-gray-300">点击宫位查看详细信息 · 每时辰 2 小时</p>
      </main>
    </div>
  );
}
