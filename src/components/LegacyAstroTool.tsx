"use client";

import { useEffect, useMemo, useState } from "react";
import NatalChartWheel from "@/components/NatalChartWheel";
import { AspectMatrix } from "@/components/AlmutenChartLayout";
import { buildBaziViewData } from "@/lib/baziViewData";
import { loadLatestBirthProfile, saveLatestBirthProfile } from "@/lib/latestBirthProfile";

type ToolMode = "horary" | "vedic" | "bazi" | "solar-arc" | "tertiary" | "tertiary-natal" | "secondary-natal";

const MODE_COPY: Record<ToolMode, { title: string; desc: string; button: string }> = {
  horary: { title: "卜卦盘", desc: "用提问当下的时间与地点起盘。默认取当前时间，可手动调整。", button: "起卦盘" },
  vedic: { title: "印度占星盘", desc: "基础恒星黄道盘，采用近似 Lahiri 岁差修正，并用整宫制显示。", button: "计算印度盘" },
  bazi: { title: "八字盘", desc: "按出生年月日时生成四柱，年柱和月柱按立春及节气精确切换。", button: "排八字" },
  "solar-arc": { title: "太阳弧", desc: "按目标年份计算太阳弧推进，显示推进后行星黄经。", button: "计算太阳弧" },
  tertiary: { title: "三限法", desc: "按三限法的近似速度推进行星，用于查看阶段性趋势。", button: "计算三限盘" },
  "tertiary-natal": { title: "三限对本命盘", desc: "计算三限推进盘，并用于和本命盘位置对照。", button: "计算三限对照" },
  "secondary-natal": { title: "次限对本命盘", desc: "计算次限推进盘，并用于和本命盘位置对照。", button: "计算次限对照" },
};

const SIGNS_CN = ["白羊","金牛","双子","巨蟹","狮子","处女","天秤","天蝎","射手","摩羯","水瓶","双鱼"];
const MONTHS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

function norm(v: number) { return ((v % 360) + 360) % 360; }
function fmt2(v: number) { return String(Math.trunc(v)).padStart(2, "0"); }
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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chart-tab");
  const [baziTab, setBaziTab] = useState("chart");
  const [baziNote, setBaziNote] = useState("");
  const [selectedDaYunIndex, setSelectedDaYunIndex] = useState<number | null>(null);
  const [selectedLiuNianIndex, setSelectedLiuNianIndex] = useState<number | null>(null);
  const [selectedLiuYueIndex, setSelectedLiuYueIndex] = useState<number | null>(null);

  // BaZi AI Chat state
  const [chatMessages, setChatMessages] = useState<{role: string; content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const bazi = useMemo(() => buildBaziViewData({ year, month, day, hour, minute, gender: 1, name: "韩韩" }), [year, month, day, hour, minute]);
  const pillars = bazi.pillarList;
  const isProgressed = ["solar-arc", "tertiary", "tertiary-natal", "secondary-natal"].includes(mode);

  useEffect(() => {
    if (mode === "horary") return;
    const latest = loadLatestBirthProfile();
    if (!latest) return;
    setYear(latest.year);
    setMonth(latest.month);
    setDay(latest.day);
    setHour(latest.hour);
    setMinute(latest.minute);
    setLat(latest.lat);
    setLng(latest.lng);
    setTz(latest.tz);
    if (mode === "bazi") setChart({ bazi: true });
  }, [mode]);

  // Referral tracking: check for ?ref= code in URL
  useEffect(() => {
    if (mode !== "bazi") return;
    setSelectedDaYunIndex(null);
    setSelectedLiuNianIndex(null);
    setSelectedLiuYueIndex(null);
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `click_${refCode}@ref`, action: 'click', code: refCode }),
      }).catch(() => {});
    }
  }, [mode]);

  const calculate = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode !== "horary") {
        saveLatestBirthProfile({ year, month, day, hour, minute, lat, lng, tz, houseSystem: mode === "vedic" ? "W" : "B" });
      }
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

  // BaZi AI Chat: send question
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const question = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', content: question }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/bazi-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartData: bazi, question }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'Sorry, I could not answer that.' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const runMenuAction = (action: string) => {
    setOpenMenu(null);
    const routes: Record<string, string> = {
      natal: "/natal",
      horary: "/horary",
      vedic: "/vedic",
      bazi: "/bazi",
      compare: "/compare",
      composite: "/composite",
      transits: "/transits",
      solarArc: "/solar-arc",
      progression: "/progression",
      secondaryNatal: "/secondary-to-natal",
      tertiary: "/tertiary",
      tertiaryNatal: "/tertiary-to-natal",
      solarReturn: "/solar-return",
      lunarReturn: "/lunar-return",
      profile: "/profile",
      calendar: "/transits",
    };
    if (routes[action]) window.location.href = routes[action];
    if (action === "new") {
      setChart(null);
      setSidebarOpen(true);
    }
    if (action === "rectify") setActiveTab("table-tab");
  };

  const planetRows = Object.entries(chart?.planets || {}).slice(0, 12).map(([key, value]: any) => ({
    key,
    name: value?.name_cn || key,
    lon: typeof value?.longitude === "number" ? value.longitude : 0,
    sign: typeof value?.longitude === "number" ? Math.floor(norm(value.longitude) / 30) : 0,
  }));

  if (mode === "bazi") {
    const defaultDaYunIndex = Math.max(0, bazi.luck.daYun.findIndex((item: any) => item.active));
    const activeDaYunIndex = selectedDaYunIndex ?? defaultDaYunIndex;
    const activeLuck = bazi.luck.daYun[activeDaYunIndex] || bazi.luck.current;
    const liuNianList = activeLuck?.liuNian || [];
    const defaultLiuNianIndex = Math.max(0, liuNianList.findIndex((item: any) => item.active));
    const activeLiuNianIndex = selectedLiuNianIndex ?? defaultLiuNianIndex;
    const activeYear = liuNianList[activeLiuNianIndex] || bazi.luck.currentYear;
    const liuYueList = activeYear?.liuYue || bazi.luck.currentMonths || [];
    const defaultLiuYueIndex = Math.max(0, liuYueList.findIndex((item: any) => item.active));
    const activeLiuYueIndex = selectedLiuYueIndex ?? defaultLiuYueIndex;
    const activeMonth = liuYueList[activeLiuYueIndex] || liuYueList[new Date().getMonth()] || liuYueList[0];
    const liuRiList = activeMonth?.liuRi || bazi.luck.currentDays || [];
    const tabItems = [
      { id: "info", label: "基本信息" },
      { id: "chart", label: "基本排盘" },
      { id: "detail", label: "专业细盘" },
      { id: "note", label: "断事笔记" },
    ];
    const relationLine = (items: string[]) => items.length ? items.join(" | ") : "-";
    const openDetailSection = (id: string) => {
      setBaziTab("detail");
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (id === "bazi-ai-section") document.getElementById("bazi-chat-input")?.focus();
      }, 80);
    };
    const ShenShaList = ({ title, rows }: { title: string; rows: any[] }) => (
      <section className="bazi-section">
        <h3>{title}</h3>
        <div className="bazi-shensha-list">
          {rows.map(row => (
            <div className="bazi-shensha-row" key={`${title}-${row.key}`}>
              <span className={`bazi-pill-label ${row.active ? "active" : ""}`}>{row.label}</span>
              <span>{row.names.length ? row.names.join("　") : "-"}</span>
            </div>
          ))}
        </div>
      </section>
    );

    return (
      <main className="bazi-page">
        <style>{`
          .bazi-page{min-height:100vh;background:#f5f5f3;color:#242424;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",serif}
          .bazi-phone{max-width:980px;margin:0 auto;background:#fff;min-height:100vh}
          .bazi-top{height:86px;background:#fff;display:grid;grid-template-columns:64px 1fr 64px;align-items:end;padding:0 10px 16px;border-bottom:1px solid #eee}
          .bazi-back,.bazi-more{border:0;background:transparent;font-size:34px;line-height:1;color:#333;cursor:pointer}
          .bazi-title{text-align:center;font-size:30px;font-weight:500;letter-spacing:1px}
          .bazi-tabs{height:66px;background:#050505;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;position:sticky;top:0;z-index:20}
          .bazi-tabs button{height:66px;border:0;background:transparent;color:#f6f6f6;font-size:25px;letter-spacing:1px;cursor:pointer}
          .bazi-tabs button.active{color:#b9a269}
          .bazi-hero{background:linear-gradient(135deg,#171713,#2a2924);color:#eee;padding:30px 38px;display:grid;grid-template-columns:104px 1fr auto;gap:22px;align-items:center}
          .bazi-avatar{width:92px;height:92px;border:2px solid #b9a269;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#d6bf78;font-size:44px}
          .bazi-name{font-size:27px;color:#cdb777;margin-bottom:8px}.bazi-meta{font-size:22px;line-height:1.6;color:#f4f4f4}.bazi-tools{display:flex;gap:12px;align-self:start}
          .bazi-icon-btn{width:52px;height:52px;border:0;border-radius:50%;background:#333;color:#d6bf78;font-size:24px;cursor:pointer}
          .bazi-edit-panel{padding:16px 34px;background:#fff9ec;border-bottom:1px solid #eadfc2;display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
          .bazi-edit-panel select,.bazi-edit-panel input{height:36px;border:1px solid #c9bea0;background:white;border-radius:4px;padding:0 8px;font-size:15px}.bazi-edit-panel button{border:0;background:#b9a269;color:white;border-radius:4px;font-weight:700}
          .bazi-board{overflow-x:auto;background:#fff}.bazi-grid{min-width:820px;display:grid;grid-template-columns:82px repeat(6,1fr);border-bottom:1px solid #eee}
          .bazi-cell{min-height:54px;padding:10px 8px;text-align:center;border-left:1px solid #eee;display:flex;align-items:center;justify-content:center;flex-direction:column}
          .bazi-row-label{color:#aaa;font-size:23px;align-items:flex-start;padding-left:26px;border-left:0}.bazi-head{color:#9d9d9d;font-size:23px;background:#fafafa}
          .bazi-god{font-size:22px;color:#444}.bazi-ganzhi{font-size:48px;font-weight:700;line-height:1.18;display:flex;flex-direction:column}.bazi-hidden{font-size:20px;line-height:1.45;color:#555}.bazi-muted{color:#9c9c9c}
          .bazi-luck-note{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:20px 38px;background:#f7f7f5;color:#333;font-size:20px;line-height:1.55;border-top:10px solid #f2f2f0}
          .bazi-scroll-strip{display:flex;overflow-x:auto;background:#fff;border-top:1px solid #eee;border-bottom:1px solid #eee}.bazi-strip-label{flex:0 0 70px;padding:16px 10px;color:#999;font-size:30px;font-weight:700;text-align:center;background:#fafafa}
          .bazi-strip-item{flex:0 0 92px;padding:16px 8px;text-align:center;border:0;border-left:1px solid #eee;background:#fff;color:#242424;font:inherit;font-size:21px;line-height:1.4;cursor:pointer}.bazi-strip-item.active{background:#efefef}.bazi-strip-item strong{display:block;font-size:23px}.bazi-strip-item .red{color:#b72d2d}.bazi-strip-item .small{font-size:16px;color:#666}
          .bazi-element-bar{display:grid;grid-template-columns:repeat(5,1fr);background:#b8a068;color:white;font-size:22px;text-align:center;padding:10px 0;margin-top:10px}.bazi-element-bar span{border-left:1px solid rgba(255,255,255,.35)}.bazi-element-bar span:first-child{border-left:0}
          .bazi-action-row{display:grid;grid-template-columns:1fr 160px;gap:16px;padding:24px 38px;background:#fff}.bazi-action-row button{height:56px;border:0;border-radius:28px;background:#f5f5f4;font-size:24px;font-weight:700;color:#202020}
          .bazi-section{background:#fff;padding:24px 38px;border-top:10px solid #f5f5f3}.bazi-section h3{font-size:28px;line-height:1.2;margin:0 0 22px;font-weight:800;color:#161616}.bazi-section h4{font-size:21px;margin:18px 0 10px;color:#b09a5b}
          .bazi-lines{font-size:22px;line-height:1.8;color:#3d3d3d}.bazi-lines b{color:#aa9557}.bazi-extra-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.bazi-extra-card{border:1px solid #eee;background:#fafafa;border-radius:6px;padding:12px;text-align:center}.bazi-extra-card strong{font-size:24px;display:block;margin-bottom:6px}
          .bazi-shensha-list{display:grid;gap:12px}.bazi-shensha-row{display:grid;grid-template-columns:108px 1fr;gap:14px;align-items:start;font-size:22px;line-height:1.55;color:#a89660}.bazi-pill-label{background:#f5f5f4;border-radius:22px;color:#222;font-weight:800;text-align:center;padding:4px 14px}.bazi-pill-label.active{background:#b8a068;color:white}
          .bazi-note-box{width:100%;min-height:260px;border:1px solid #ddd;border-radius:6px;padding:14px;font-size:18px;line-height:1.7;resize:vertical}.bazi-ai-chat{border:1px solid #dedede;border-radius:6px;overflow:hidden}.bazi-ai-title{padding:12px 16px;background:#111;color:white;font-size:16px;font-weight:700}.bazi-chat-body{max-height:260px;overflow:auto;padding:14px;background:#fafafa}.bazi-chat-msg{margin:0 0 10px}.bazi-chat-msg.user{text-align:right}.bazi-chat-bubble{display:inline-block;max-width:86%;padding:9px 13px;border-radius:12px;background:#fff;border:1px solid #ddd;font-size:14px;line-height:1.6;text-align:left;white-space:pre-wrap}.bazi-chat-msg.user .bazi-chat-bubble{background:#111;color:white;border-color:#111}.bazi-chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid #ddd}.bazi-chat-input input{flex:1;border:1px solid #ccc;border-radius:4px;padding:9px;font-size:14px}.bazi-chat-input button{border:0;background:#111;color:white;border-radius:4px;padding:0 16px}
          @media(max-width:700px){.bazi-phone{max-width:none}.bazi-top{height:74px}.bazi-title{font-size:25px}.bazi-tabs{height:58px}.bazi-tabs button{height:58px;font-size:20px}.bazi-hero{grid-template-columns:78px 1fr auto;padding:24px 22px;gap:14px}.bazi-avatar{width:70px;height:70px;font-size:34px}.bazi-name{font-size:22px}.bazi-meta{font-size:18px}.bazi-tools{flex-direction:column}.bazi-icon-btn{width:42px;height:42px;font-size:19px}.bazi-edit-panel{grid-template-columns:repeat(3,1fr);padding:12px}.bazi-grid{min-width:720px;grid-template-columns:68px repeat(6,1fr)}.bazi-row-label{font-size:19px;padding-left:14px}.bazi-head{font-size:19px}.bazi-ganzhi{font-size:41px}.bazi-god,.bazi-hidden{font-size:18px}.bazi-luck-note{padding:16px 22px;font-size:17px}.bazi-strip-label{flex-basis:58px;font-size:25px}.bazi-strip-item{flex-basis:82px;font-size:18px}.bazi-action-row{padding:18px 22px;grid-template-columns:1fr 110px}.bazi-action-row button{height:48px;font-size:20px}.bazi-section{padding:22px}.bazi-section h3{font-size:25px}.bazi-lines,.bazi-shensha-row{font-size:19px}.bazi-extra-grid{grid-template-columns:repeat(2,1fr)}}
        `}</style>
        <div className="bazi-phone">
          <div className="bazi-top">
            <button className="bazi-back" onClick={() => window.location.href = "/"}>‹</button>
            <div className="bazi-title">八字</div>
            <button className="bazi-more" onClick={() => setSidebarOpen(!sidebarOpen)}>•••</button>
          </div>
          <nav className="bazi-tabs">
            {tabItems.map(tab => <button key={tab.id} className={baziTab === tab.id ? "active" : ""} onClick={() => setBaziTab(tab.id)}>{tab.label}</button>)}
          </nav>

          <section className="bazi-hero">
            <div className="bazi-avatar">虎</div>
            <div>
              <div className="bazi-name">{bazi.name}</div>
              <div className="bazi-meta">农历：{bazi.lunarText}　{bazi.dayMaster.stem}造</div>
              <div className="bazi-meta">阳历：{bazi.solarText}</div>
            </div>
            <div className="bazi-tools">
              <button className="bazi-icon-btn" title="查看" onClick={() => setBaziTab("chart")}>⊙</button>
              <button className="bazi-icon-btn" title="编辑" onClick={() => setSidebarOpen(!sidebarOpen)}>✎</button>
            </div>
          </section>

          {sidebarOpen && (
            <section className="bazi-edit-panel">
              <select value={month} onChange={e => setMonth(Number(e.target.value))}>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
              <select value={day} onChange={e => setDay(Number(e.target.value))}>{Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}</select>
              <input value={year} onChange={e => setYear(parseInt(e.target.value) || now.getFullYear())} />
              <select value={hour} onChange={e => setHour(Number(e.target.value))}>{Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h}>{fmt2(h)}</option>)}</select>
              <select value={minute} onChange={e => setMinute(Number(e.target.value))}>{Array.from({ length: 60 }, (_, i) => i).map(m => <option key={m} value={m}>{fmt2(m)}</option>)}</select>
              <button onClick={calculate} disabled={loading}>{loading ? "计算中" : "重排"}</button>
            </section>
          )}

          {(baziTab === "chart" || baziTab === "info") && (
            <>
              <section className="bazi-board">
                <div className="bazi-grid">
                  <div className="bazi-cell bazi-head bazi-row-label">日期</div>
                  {["流年", "大运", ...pillars.map(p => p.label)].map((label) => <div className="bazi-cell bazi-head" key={label}>{label}</div>)}
                  <div className="bazi-cell bazi-row-label">主星</div>
                  {[activeYear?.ganZhi || "-", activeLuck?.ganZhi || "-", ...pillars.map(p => p.value)].map((value, i) => <div className="bazi-cell bazi-god" key={`god-${i}`}>{i < 2 ? "" : pillars[i - 2]?.tenGod}</div>)}
                  <div className="bazi-cell bazi-row-label">天干</div>
                  {[activeYear, activeLuck, ...pillars].map((p: any, i) => <div className="bazi-cell" key={`gan-${i}`}><span className="bazi-ganzhi" style={{ color: p?.color || "#333" }}>{p?.gan || "-"}</span></div>)}
                  <div className="bazi-cell bazi-row-label">地支</div>
                  {[activeYear, activeLuck, ...pillars].map((p: any, i) => <div className="bazi-cell" key={`zhi-${i}`}><span className="bazi-ganzhi" style={{ color: p?.color || "#333" }}>{p?.zhi || "-"}</span></div>)}
                  <div className="bazi-cell bazi-row-label">藏干</div>
                  {[activeYear, activeLuck, ...pillars].map((p: any, i) => <div className="bazi-cell bazi-hidden" key={`hidden-${i}`}>{i < 2 ? p?.xunKong || "-" : p.hidden?.join(" ") || "-"}</div>)}
                  <div className="bazi-cell bazi-row-label">星运</div>
                  {[activeYear, activeLuck, ...pillars].map((p: any, i) => <div className="bazi-cell bazi-hidden" key={`dishi-${i}`}>{i < 2 ? "" : p.diShi || "-"}</div>)}
                  <div className="bazi-cell bazi-row-label">纳音</div>
                  {[activeYear, activeLuck, ...pillars].map((p: any, i) => <div className="bazi-cell bazi-hidden" key={`nayin-${i}`}>{i < 2 ? "" : p.naYin || "-"}</div>)}
                </div>
              </section>

              <section className="bazi-luck-note">
                <div>
                  <div>起运：{bazi.luck.startText}</div>
                  <div>节气：{bazi.meta.prevJieQi} 之后，{bazi.meta.nextJieQi} 之前</div>
                </div>
                <div>
                  <div>{activeYear?.age || ""}岁</div>
                  <div>司令：{activeYear?.zhi || "-"}</div>
                </div>
              </section>

              <section className="bazi-scroll-strip">
                <div className="bazi-strip-label">大运</div>
                {bazi.luck.daYun.slice(0, 10).map((item: any, i: number) => (
                  <button className={`bazi-strip-item ${i === activeDaYunIndex ? "active" : ""}`} key={`dayun-${item.startYear}`} onClick={() => {
                    const firstYearIndex = item.liuNian?.findIndex((yearItem: any) => yearItem.active) ?? 0;
                    setSelectedDaYunIndex(i);
                    setSelectedLiuNianIndex(Math.max(0, firstYearIndex));
                    setSelectedLiuYueIndex(null);
                  }}>
                    <div>{item.startYear}</div>
                    <div className="small">{item.startAge}岁</div>
                    <strong>{item.gan}<span className="red">{item.zhi}</span></strong>
                  </button>
                ))}
              </section>
              <section className="bazi-scroll-strip">
                <div className="bazi-strip-label">流年</div>
                {liuNianList.slice(0, 10).map((item: any, i: number) => (
                  <button className={`bazi-strip-item ${i === activeLiuNianIndex ? "active" : ""}`} key={`liunian-${item.year}`} onClick={() => {
                    setSelectedLiuNianIndex(i);
                    setSelectedLiuYueIndex(null);
                  }}>
                    <div>{item.year}</div>
                    <strong>{item.gan}<span className="red">{item.zhi}</span></strong>
                    <div className="small">{item.xunKong}</div>
                  </button>
                ))}
              </section>
              <section className="bazi-scroll-strip">
                <div className="bazi-strip-label">流月</div>
                {liuYueList.map((item: any, i: number) => (
                  <button className={`bazi-strip-item ${i === activeLiuYueIndex ? "active" : ""}`} key={`liuyue-${i}`} onClick={() => setSelectedLiuYueIndex(i)}>
                    <div>{item.month || `${i + 1}月`}</div>
                    <strong>{item.gan}<span className="red">{item.zhi}</span></strong>
                    <div className="small">{item.xunKong}</div>
                  </button>
                ))}
              </section>
              <section className="bazi-scroll-strip">
                <div className="bazi-strip-label">流日</div>
                {liuRiList.map((item: any) => (
                  <button className={`bazi-strip-item ${item.active ? "active" : ""}`} key={`liuri-${activeYear?.year}-${activeLiuYueIndex}-${item.day}`}>
                    <div>{item.label}</div>
                    <strong>{item.gan}<span className="red">{item.zhi}</span></strong>
                    <div className="small">{item.xunKong}</div>
                  </button>
                ))}
              </section>
              <div className="bazi-element-bar"><span>水旺</span><span>木相</span><span>金休</span><span>土囚</span><span>火死</span></div>
              <div className="bazi-action-row">
                <button onClick={() => openDetailSection("bazi-ganzhi-section")}>智能干支图示 ›</button>
                <button onClick={() => openDetailSection("bazi-ai-section")}>AI指令 ›</button>
              </div>
            </>
          )}

          {baziTab === "info" && (
            <section className="bazi-section">
              <h3>基本信息</h3>
              <div className="bazi-lines">
                <div><b>日主：</b>{bazi.dayMaster.stem}（{bazi.dayMaster.element}）</div>
                <div><b>四柱：</b>{pillars.map(p => p.value).join("　")}</div>
                <div><b>当前大运：</b>{activeLuck ? `${activeLuck.ganZhi}（${activeLuck.startYear}-${activeLuck.endYear}）` : "-"}</div>
                <div><b>当前流年：</b>{activeYear ? `${activeYear.year} ${activeYear.ganZhi}` : "-"}</div>
                <div><b>农历：</b>{bazi.lunarText}</div>
              </div>
            </section>
          )}

          {baziTab === "detail" && (
            <>
              <section className="bazi-section" id="bazi-ganzhi-section">
                <h3>智能干支图示</h3>
                <div className="bazi-lines">
                  <div><b>岁运天干：</b>{relationLine(bazi.interactions.transit.stems)}</div>
                  <div><b>岁运地支：</b>{relationLine(bazi.interactions.transit.branches)}</div>
                  <div><b>岁运整柱：</b>{relationLine(bazi.interactions.transit.whole)}</div>
                  <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "18px 0" }} />
                  <div><b>原局天干：</b>{relationLine(bazi.interactions.natal.stems)}</div>
                  <div><b>原局地支：</b>{relationLine(bazi.interactions.natal.branches)}</div>
                  <div><b>原局整柱：</b>{relationLine(bazi.interactions.natal.whole)}</div>
                </div>
              </section>
              <ShenShaList title="四柱神煞" rows={bazi.shenSha.natal} />
              <ShenShaList title="大运神煞" rows={bazi.shenSha.luck} />
              <ShenShaList title="流年神煞" rows={bazi.shenSha.year} />
              <section className="bazi-section">
                <h3>胎命身息</h3>
                <div className="bazi-extra-grid">
                  {bazi.extraPillars.map((item: any) => (
                    <div className="bazi-extra-card" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <span className="bazi-muted">{item.naYin}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="bazi-section" id="bazi-ai-section">
                <h3>AI八字问答</h3>
                <div className="bazi-ai-chat">
                  <div className="bazi-ai-title">问你的八字盘</div>
                  <div className="bazi-chat-body">
                    {chatMessages.length === 0 && <div className="bazi-muted">可以问：我的日主性格？什么时候财运更强？适合什么方向？</div>}
                    {chatMessages.map((msg, i) => (
                      <div className={`bazi-chat-msg ${msg.role}`} key={i}><span className="bazi-chat-bubble">{msg.content}</span></div>
                    ))}
                    {chatLoading && <div className="bazi-muted">分析中...</div>}
                  </div>
                  <div className="bazi-chat-input">
                    <input id="bazi-chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="输入问题..." />
                    <button onClick={sendChat} disabled={chatLoading}>发送</button>
                  </div>
                </div>
              </section>
            </>
          )}

          {baziTab === "note" && (
            <section className="bazi-section">
              <h3>断事笔记</h3>
              <textarea className="bazi-note-box" value={baziNote} onChange={e => setBaziNote(e.target.value)} placeholder="记录断事、应期、事件验证..." />
            </section>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#333]">
      <style>{`#legacy-main{padding:10px 260px 10px 20px}#legacy-wrap{display:flex;align-items:flex-start;gap:28px;flex-wrap:nowrap;margin-bottom:10px;overflow-x:auto}#legacy-wrap svg{max-width:none}.alm-tabs{width:100%;margin-top:8px;border:1px solid #aaa;border-radius:4px 4px 0 0;background:linear-gradient(#eeeeee,#cfcfcf);padding:3px 3px 0;overflow-x:auto}.alm-tab-btn{height:32px;padding:0 16px;border:1px solid #bbb;border-bottom:0;border-radius:4px 4px 0 0;background:linear-gradient(#f7f7f7,#dfdfdf);font-size:14px;color:#333;white-space:nowrap}.alm-tab-btn.active{background:white;font-weight:600;position:relative;top:1px}.alm-panel{padding:18px 28px 22px;background:white;overflow-x:auto}.alm-table{width:100%;border-collapse:collapse;background:white;color:#222;font-size:13px;line-height:1.15;box-shadow:0 4px 14px rgba(0,0,0,.14)}.alm-table th,.alm-table td{border:1px solid #aaa;padding:3px 6px;text-align:center;vertical-align:middle;height:22px}.alm-table th{background:#eee;font-weight:700}.alm-table td.left{text-align:left}.bazi-pill{font-size:30px;font-family:serif;font-weight:700}.bazi-mobile-grid{display:none}.legacy-form-row{display:inline}.legacy-form-control{border:1px solid #888;background:#555;color:white;padding:1px 2px}@media(max-width:900px){main{overflow-x:hidden}#cssmenu{display:flex!important;align-items:center!important;gap:0;overflow-x:auto!important;overflow-y:visible!important;white-space:nowrap!important;padding:6px 8px!important;-webkit-overflow-scrolling:touch;position:sticky;top:0;z-index:80}#cssmenu>span{flex:0 0 auto}#cssmenu>span>span,#cssmenu>span[style]{padding:8px 10px!important}#cssmenu div[style*="absolute"]{position:fixed!important;top:42px!important;left:8px!important;right:8px!important;max-height:70vh;overflow:auto;min-width:0!important;width:auto!important;box-shadow:0 6px 16px rgba(0,0,0,.3)}#legacy-main{padding:12px 12px 18px;display:flex;flex-direction:column}#legacy-sidebar{position:static!important;width:auto!important;margin:10px 12px 0!important;order:-1;box-sizing:border-box;border-radius:4px}#legacy-wrap{flex-direction:column;overflow-x:visible;gap:14px}#legacy-wrap>div{width:100%;overflow-x:auto}#legacy-wrap svg{width:min(520px,calc(100vw - 24px));height:auto}.alm-tabs{margin-top:12px;display:flex;gap:0;scrollbar-width:thin}.alm-tab-btn{height:38px;padding:0 14px;font-size:13px}.alm-panel{padding:12px 0 16px;overflow-x:auto}.alm-table{font-size:12px;min-width:520px}.alm-table th,.alm-table td{padding:5px 6px;height:28px}.bazi-summary-table{display:none}.bazi-mobile-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.bazi-mobile-card{border:1px solid #aaa;background:linear-gradient(#fff,#f2f2f2);box-shadow:0 2px 8px rgba(0,0,0,.12);padding:10px 8px;text-align:center}.bazi-mobile-label{font-size:12px;color:#555;margin-bottom:4px}.bazi-mobile-value{font-size:28px;font-family:serif;font-weight:700;line-height:1.15}.bazi-pill{font-size:24px}.legacy-form-row{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}.legacy-form-row.time{grid-template-columns:1fr auto 1fr}.legacy-form-control{min-height:34px;font-size:16px;padding:4px 6px;box-sizing:border-box;width:100%!important}#legacy-sidebar button{width:100%;min-height:36px;font-size:15px}.legacy-intro-card{margin:10px 0!important;padding:14px!important;max-width:none!important}}@media(max-width:420px){#legacy-main{padding-left:10px;padding-right:10px}.bazi-mobile-value{font-size:25px}.alm-table{min-width:470px}#legacy-wrap svg{width:calc(100vw - 20px)}}`}</style>

      <div id="cssmenu" style={{background:"#333",fontSize:"14px",display:"flex",alignItems:"center",padding:"0 16px"}}>
        <span onClick={()=>window.location.href="/"} style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>返回首页</span>
        {[
          {id:"file",l:"文件",items:[{l:"列表",a:"natal"},{l:"新增",a:"new"}]},
          {id:"charts",l:"星盘",items:[
            {l:"本命盘",a:"natal"},{l:"卜卦盘",a:"horary"},{l:"印度占星盘",a:"vedic"},{l:"八字盘",a:"bazi"},{l:"比较盘",a:"compare"},{l:"组合盘",a:"composite"},{l:"流年星",a:"transits"},{l:"太阳弧",a:"solarArc"},{l:"次限法",a:"progression"},{l:"次限对本命盘",a:"secondaryNatal"},{l:"三限法",a:"tertiary"},{l:"三限对本命盘",a:"tertiaryNatal"},{l:"太阳返照",a:"solarReturn"},{l:"月亮返照",a:"lunarReturn"}
          ]},
          {id:"tools",l:"工具",items:[{l:"星象日历",a:"calendar"},{l:"出生时间反推",a:"rectify"}]},
          {id:"settings",l:"设定",items:[{l:"个人资料",a:"profile"}]}
        ].map(m=>(
          <span key={m.id} style={{position:"relative"}}>
            <span onClick={()=>setOpenMenu(openMenu===m.id?null:m.id)} style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>{m.l} ▾</span>
            {openMenu===m.id&&<div style={{position:"absolute",top:"100%",left:0,background:"#444",color:"#ccc",minWidth:m.id==="charts"?170:120,zIndex:50,border:"1px solid #555"}}>
              {m.items.map(item=><div key={item.a} style={{padding:"6px 18px",cursor:"pointer",fontSize:"13px",whiteSpace:"nowrap"}} onMouseDown={()=>runMenuAction(item.a)}>{item.l}</div>)}
            </div>}
          </span>
        ))}
        <span onClick={()=>setSidebarOpen(true)} style={{color:"#ccc",padding:"4px 12px",textDecoration:"none",cursor:"pointer"}}>快速制图</span>
        <span style={{flex:1}}/>
        <span style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>星缘</span>
      </div>

      <div style={{position:"relative"}}>
        <div id="legacy-main">
          <div style={{margin:"5px 0"}}>
            <strong>{copy.title}</strong><br/>
            {year}-{month}-{day} {hour}:{fmt2(minute)}{isProgressed ? `　目标年: ${targetYear}` : ""}<br/>
            {`${lng.toFixed(2)} E　${lat.toFixed(2)} N`}<br/>
            时区: GMT {tz>=0?"+":""}{tz}.00<br/>
            {mode === "vedic" ? "恒星黄道 整宫制" : "回归黄道 阿卡比特制"}
          </div>

          {!chart&&<div className="legacy-intro-card" style={{border:"1px solid #d0d0d0",background:"#f7f7f7",padding:16,margin:"12px 0",maxWidth:760}}>
            <strong>{copy.title}</strong>
            <div style={{fontSize:13,color:"#555",marginTop:6}}>{copy.desc}</div>
            <button onClick={calculate} disabled={loading} style={{border:"1px solid #888",background:"#eee",padding:"4px 16px",marginTop:12,cursor:"pointer"}}>{loading ? "计算中..." : copy.button}</button>
            {error&&<div style={{color:"#b00020",fontSize:13,marginTop:8}}>{error}</div>}
          </div>}

          {chart&&<div id="legacy-wrap">
            <div><AspectMatrix chart={chart}/></div>
            <div><NatalChartWheel chart={chart}/></div>
          </div>}

          {chart&&<div id="main_tabs">
            <div className="alm-tabs">
              {[{id:"chart-tab",l:"黄道状态"},{id:"table-tab",l:"数据表"},{id:"note-tab",l:"说明"}].map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`alm-tab-btn ${activeTab===t.id?"active":""}`}>{t.l}</button>
              ))}
            </div>
            <div className="alm-panel">
              {activeTab==="chart-tab"&&<table className="alm-table">
                <thead><tr><th>星体</th><th>黄经度数</th><th>星座</th></tr></thead>
                <tbody>{planetRows.map(r=><tr key={r.key}><td>{r.name}</td><td>{lonText(r.lon)}</td><td>{SIGNS_CN[r.sign]}</td></tr>)}</tbody>
              </table>}
              {activeTab==="table-tab"&&<table className="alm-table">
                <tbody>
                  <tr><th>工具</th><td>{copy.title}</td></tr>
                  <tr><th>时间</th><td>{year}-{month}-{day} {fmt2(hour)}:{fmt2(minute)}</td></tr>
                  <tr><th>地点</th><td>{`${lat}, ${lng}`}</td></tr>
                  <tr><th>说明</th><td className="left">{copy.desc}</td></tr>
                </tbody>
              </table>}
              {activeTab==="note-tab"&&<div style={{fontSize:13,lineHeight:1.7,color:"#333"}}>{`${copy.desc} 当前页面已统一为本命盘同款布局；可通过右侧快速制图表单重新计算。`}</div>}
            </div>
          </div>}
        </div>

        <div id="legacy-sidebar" style={{position:"absolute",right:10,top:10,padding:5,width:240,textAlign:"left",border:"1px solid #D0D0D0",background:"#4a4a4a",color:"white",boxShadow:"0 0 8px #D0D0D0",fontSize:"13px",opacity:0.9}}>
          <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <strong>快速制图</strong>
            <span style={{float:"right",cursor:"pointer"}}>{sidebarOpen?"−":"+"}</span>
          </div>
          {sidebarOpen&&<div><hr/>
            <label style={{fontWeight:"bold",fontSize:"12px"}}>出生时间:</label><br/>
            <span className="legacy-form-row">
              <select className="legacy-form-control" value={month} onChange={e=>setMonth(Number(e.target.value))}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>
              <select className="legacy-form-control" value={day} onChange={e=>setDay(Number(e.target.value))}>{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select>
              <input className="legacy-form-control" value={year} onChange={e=>setYear(parseInt(e.target.value)||now.getFullYear())} style={{width:45}}/>
            </span>
            <br/>
            <span className="legacy-form-row time">
              <select className="legacy-form-control" value={hour} onChange={e=>setHour(Number(e.target.value))}>{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{fmt2(h)}</option>)}</select>
              <span style={{alignSelf:"center"}}>:</span>
              <select className="legacy-form-control" value={minute} onChange={e=>setMinute(Number(e.target.value))}>{Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{fmt2(m)}</option>)}</select>
            </span>
            <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>纬度:</label>
            <input className="legacy-form-control" value={lat} onChange={e=>setLat(Number(e.target.value)||0)} style={{width:70}}/>
            <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>经度:</label>
            <input className="legacy-form-control" value={lng} onChange={e=>setLng(Number(e.target.value)||0)} style={{width:70}}/>
            <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>时区:</label>
            <input className="legacy-form-control" value={tz} onChange={e=>setTz(Number(e.target.value)||0)} style={{width:45}}/>
            {isProgressed&&<><br/><label style={{fontWeight:"bold",fontSize:"12px"}}>目标年:</label><input className="legacy-form-control" value={targetYear} onChange={e=>setTargetYear(Number(e.target.value)||targetYear)} style={{width:58}}/></>}
            <div style={{textAlign:"center",marginTop:8}}>
              <button onClick={calculate} disabled={loading} style={{border:"1px solid #888",background:"#666",color:"white",padding:"2px 12px",cursor:"pointer"}}>{loading?"计算中...":copy.button}</button>
            </div>
            {error&&<div style={{color:"#ffd0d0",fontSize:12,marginTop:6}}>{error}</div>}
          </div>}
        </div>
      </div>
    </main>
  );
}
