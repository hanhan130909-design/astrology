"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import NatalChartWheel from "@/components/NatalChartWheel";
import { AspectMatrix } from "@/components/AlmutenChartLayout";

type ToolMode = "horary" | "vedic" | "bazi" | "solar-arc" | "tertiary" | "tertiary-natal" | "secondary-natal";

const MODE_COPY: Record<ToolMode, { title: string; desc: string; button: string }> = {
  horary: { title: "卜卦盘", desc: "用提问当下的时间与地点起盘。默认取当前时间，可手动调整。", button: "起卦盘" },
  vedic: { title: "印度占星盘", desc: "基础恒星黄道盘，采用近似 Lahiri 岁差修正，并用整宫制显示。", button: "计算印度盘" },
  bazi: { title: "八字盘", desc: "按出生年月日时生成基础四柱。当前为快速排盘版，适合做入口和初步查看。", button: "排八字" },
  "solar-arc": { title: "太阳弧", desc: "按目标年份计算太阳弧推进，显示推进后行星黄经。", button: "计算太阳弧" },
  tertiary: { title: "三限法", desc: "按三限法的近似速度推进行星，用于查看阶段性趋势。", button: "计算三限盘" },
  "tertiary-natal": { title: "三限对本命盘", desc: "计算三限推进盘，并用于和本命盘位置对照。", button: "计算三限对照" },
  "secondary-natal": { title: "次限对本命盘", desc: "计算次限推进盘，并用于和本命盘位置对照。", button: "计算次限对照" },
};

const STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const SIGNS_CN = ["白羊","金牛","双子","巨蟹","狮子","处女","天秤","天蝎","射手","摩羯","水瓶","双鱼"];

function norm(v: number) { return ((v % 360) + 360) % 360; }
function fmt2(v: number) { return String(Math.trunc(v)).padStart(2, "0"); }
function sexagenary(index: number) { return `${STEMS[((index % 10) + 10) % 10]}${BRANCHES[((index % 12) + 12) % 12]}`; }
function lonText(lon: number) {
  const n = norm(lon);
  const sign = Math.floor(n / 30);
  const d = Math.floor(n % 30);
  const m = Math.round(((n % 30) - d) * 60);
  return `${SIGNS_CN[sign]} ${d}°${fmt2(m)}′`;
}

function transformChart(chart: any, offset: number) {
  if (!chart) return chart;
  const shift = (p: any) => {
    if (!p || typeof p.longitude !== "number") return p;
    const longitude = norm(p.longitude + offset);
    const signIdx = Math.floor(longitude / 30);
    return {
      ...p,
      longitude,
      sign_cn: `${SIGNS_CN[signIdx]}座`,
      degree: longitude % 30,
      formatted: `${Math.floor(longitude % 30)}°${fmt2(Math.round(((longitude % 30) % 1) * 60))}'`,
    };
  };
  return {
    ...chart,
    planets: Object.fromEntries(Object.entries(chart.planets || {}).map(([k, v]) => [k, shift(v)])),
    houses: (chart.houses || []).map(shift),
    ascendant: shift(chart.ascendant),
    midheaven: shift(chart.midheaven),
  };
}

function baziPillars(year: number, month: number, day: number, hour: number) {
  const yearIndex = year - 4;
  const yearStem = ((yearIndex % 10) + 10) % 10;
  const monthIndex = yearStem * 2 + month + 1;
  const dayBase = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000);
  const dayIndex = dayBase + 40;
  const hourBranch = Math.floor(((hour + 1) % 24) / 2);
  const hourIndex = (((dayIndex % 10) + 10) % 10) * 2 + hourBranch;
  return [
    { label: "年柱", value: sexagenary(yearIndex) },
    { label: "月柱", value: sexagenary(monthIndex) },
    { label: "日柱", value: sexagenary(dayIndex) },
    { label: "时柱", value: sexagenary(hourIndex) },
  ];
}

export default function LegacyAstroTool({ mode }: { mode: ToolMode }) {
  const copy = MODE_COPY[mode];
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(mode === "horary" ? now.getFullYear() : 1990);
  const [month, setMonth] = useState(mode === "horary" ? now.getMonth() + 1 : 6);
  const [day, setDay] = useState(mode === "horary" ? now.getDate() : 15);
  const [hour, setHour] = useState(mode === "horary" ? now.getHours() : 12);
  const [minute, setMinute] = useState(mode === "horary" ? now.getMinutes() : 0);
  const [lat, setLat] = useState(31.2304);
  const [lng, setLng] = useState(121.4737);
  const [tz, setTz] = useState(8);
  const [targetYear, setTargetYear] = useState(now.getFullYear());
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pillars = useMemo(() => baziPillars(year, month, day, hour), [year, month, day, hour]);
  const isProgressed = ["solar-arc", "tertiary", "tertiary-natal", "secondary-natal"].includes(mode);

  const calculate = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "bazi") {
        setChart({ bazi: true });
        return;
      }
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month, day, hour, minute, latitude: lat, longitude: lng, timezone: tz, houseSystem: mode === "vedic" ? "W" : "B" }),
      });
      const json = await res.json();
      if (!json.success && json.error) throw new Error(json.error);
      const base = json.data || json;
      const age = Math.max(0, targetYear - year);
      const offset = mode === "vedic" ? -24.1 : mode === "solar-arc" ? age : mode === "secondary-natal" ? age * 0.9856 : mode === "tertiary" || mode === "tertiary-natal" ? age * 13.1764 : 0;
      setChart(transformChart(base, offset));
    } catch (e: any) {
      setError(e?.message || "计算失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#222]">
      <div className="bg-[#aa2f35] text-white text-sm flex items-center px-4 h-10 gap-4">
        <Link href="/natal" className="hover:underline">本命盘</Link>
        <Link href="/chart" className="hover:underline">星盘中心</Link>
        <span className="ml-auto">星缘</span>
      </div>
      <section className="p-6">
        <h1 className="text-2xl font-semibold mb-2">{copy.title}</h1>
        <p className="text-sm text-gray-600 mb-5">{copy.desc}</p>

        <div className="border border-gray-300 bg-gray-50 p-4 mb-5 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
            <label>年<input className="w-full border px-2 py-1" value={year} onChange={e => setYear(Number(e.target.value) || year)} /></label>
            <label>月<input className="w-full border px-2 py-1" value={month} onChange={e => setMonth(Number(e.target.value) || month)} /></label>
            <label>日<input className="w-full border px-2 py-1" value={day} onChange={e => setDay(Number(e.target.value) || day)} /></label>
            <label>时<input className="w-full border px-2 py-1" value={hour} onChange={e => setHour(Number(e.target.value) || 0)} /></label>
            <label>分<input className="w-full border px-2 py-1" value={minute} onChange={e => setMinute(Number(e.target.value) || 0)} /></label>
            <label>时区<input className="w-full border px-2 py-1" value={tz} onChange={e => setTz(Number(e.target.value) || 0)} /></label>
            {mode !== "bazi" && <><label>纬度<input className="w-full border px-2 py-1" value={lat} onChange={e => setLat(Number(e.target.value) || 0)} /></label>
            <label>经度<input className="w-full border px-2 py-1" value={lng} onChange={e => setLng(Number(e.target.value) || 0)} /></label></>}
            {isProgressed && <label>目标年<input className="w-full border px-2 py-1" value={targetYear} onChange={e => setTargetYear(Number(e.target.value) || targetYear)} /></label>}
          </div>
          <button onClick={calculate} disabled={loading} className="mt-4 border border-gray-500 bg-white px-5 py-2 text-sm hover:bg-gray-100 disabled:opacity-60">{loading ? "计算中..." : copy.button}</button>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>

        {mode === "bazi" && chart && <table className="border-collapse border border-gray-400 text-center min-w-[420px]">
          <thead><tr>{pillars.map(p => <th key={p.label} className="border border-gray-400 bg-gray-100 px-8 py-2">{p.label}</th>)}</tr></thead>
          <tbody><tr>{pillars.map(p => <td key={p.label} className="border border-gray-400 px-8 py-5 text-3xl font-serif">{p.value}</td>)}</tr></tbody>
        </table>}

        {chart && mode !== "bazi" && <div className="flex flex-wrap gap-8 items-start">
          <div><NatalChartWheel chart={chart} /></div>
          <div className="min-w-[320px]">
            <AspectMatrix chart={chart} />
            <table className="mt-4 border-collapse border border-gray-300 text-sm w-full">
              <tbody>{Object.entries(chart.planets || {}).slice(0, 10).map(([k, v]: any) => <tr key={k}><td className="border px-2 py-1">{v.name_cn || k}</td><td className="border px-2 py-1">{lonText(v.longitude)}</td></tr>)}</tbody>
            </table>
          </div>
        </div>}
      </section>
    </main>
  );
}
