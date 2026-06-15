"use client";

import { useEffect, useMemo, useState } from "react";
import { Solar } from "lunar-javascript";
import NatalChartWheel from "@/components/NatalChartWheel";
import { AspectMatrix } from "@/components/AlmutenChartLayout";
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

function baziPillars(year: number, month: number, day: number, hour: number, minute: number) {
  const lunar = Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar();
  const eightChar = lunar.getEightChar();
  const prevJieQi = lunar.getPrevJieQi();
  const nextJieQi = lunar.getNextJieQi();
  
  // Enhanced: Day Master + Five Elements + Hidden Stems
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const dayWuXing = eightChar.getDayWuXing();
  const dayShiShen = eightChar.getDayShiShenGan?.() || '';
  
  // Hidden stems (藏干)
  let hiddenStems: Record<string, string[]> = {};
  try { hiddenStems.year = eightChar.getYearHideGan?.() || []; } catch(e) {}
  try { hiddenStems.month = eightChar.getMonthHideGan?.() || []; } catch(e) {}
  try { hiddenStems.day = eightChar.getDayHideGan?.() || []; } catch(e) {}
  try { hiddenStems.time = eightChar.getTimeHideGan?.() || []; } catch(e) {}
  
  // NaYin (纳音) for each pillar
  const naYin = {
    year: eightChar.getYearNaYin?.() || '',
    month: eightChar.getMonthNaYin?.() || '',
    day: eightChar.getDayNaYin?.() || '',
    time: eightChar.getTimeNaYin?.() || '',
  };
  
  return {
    pillars: [
      { label: "年柱", value: eightChar.getYear(), naYin: naYin.year, hidden: hiddenStems.year || [] },
      { label: "月柱", value: eightChar.getMonth(), naYin: naYin.month, hidden: hiddenStems.month || [] },
      { label: "日柱", value: eightChar.getDay(), naYin: naYin.day, hidden: hiddenStems.day || [] },
      { label: "时柱", value: eightChar.getTime(), naYin: naYin.time, hidden: hiddenStems.time || [] },
    ],
    dayMaster: { stem: dayGan, element: dayWuXing, shiShen: dayShiShen },
    meta: {
      lunarDate: lunar.toString(),
      jieQi: lunar.getJieQi() || "-",
      prevJieQi: `${prevJieQi.getName()} ${prevJieQi.getSolar().toYmdHms()}`,
      nextJieQi: `${nextJieQi.getName()} ${nextJieQi.getSolar().toYmdHms()}`,
      basis: "年柱、月柱使用精确节气边界；日期时间按表单输入的当地钟表时间计算。",
    },
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

  const bazi = useMemo(() => baziPillars(year, month, day, hour, minute), [year, month, day, hour, minute]);
  const pillars = bazi.pillars;
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

  return (
    <main className="min-h-screen bg-white text-[#333]">
      <style>{`#legacy-main{padding:10px 260px 10px 20px}#legacy-wrap{display:flex;align-items:flex-start;gap:28px;flex-wrap:nowrap;margin-bottom:10px;overflow-x:auto}#legacy-wrap svg{max-width:none}.alm-tabs{width:100%;margin-top:8px;border:1px solid #aaa;border-radius:4px 4px 0 0;background:linear-gradient(#eeeeee,#cfcfcf);padding:3px 3px 0;overflow-x:auto}.alm-tab-btn{height:32px;padding:0 16px;border:1px solid #bbb;border-bottom:0;border-radius:4px 4px 0 0;background:linear-gradient(#f7f7f7,#dfdfdf);font-size:14px;color:#333;white-space:nowrap}.alm-tab-btn.active{background:white;font-weight:600;position:relative;top:1px}.alm-panel{padding:18px 28px 22px;background:white;overflow-x:auto}.alm-table{width:100%;border-collapse:collapse;background:white;color:#222;font-size:13px;line-height:1.15;box-shadow:0 4px 14px rgba(0,0,0,.14)}.alm-table th,.alm-table td{border:1px solid #aaa;padding:3px 6px;text-align:center;vertical-align:middle;height:22px}.alm-table th{background:#eee;font-weight:700}.alm-table td.left{text-align:left}.bazi-pill{font-size:30px;font-family:serif;font-weight:700}.bazi-mobile-grid{display:none}.legacy-form-row{display:inline}.legacy-form-control{border:1px solid #888;background:#555;color:white;padding:1px 2px}@media(max-width:900px){main{overflow-x:hidden}#cssmenu{display:flex!important;align-items:center!important;gap:0;overflow-x:auto!important;overflow-y:visible!important;white-space:nowrap!important;padding:6px 8px!important;-webkit-overflow-scrolling:touch;position:sticky;top:0;z-index:80}#cssmenu>span{flex:0 0 auto}#cssmenu>span>span,#cssmenu>span[style]{padding:8px 10px!important}#cssmenu div[style*="absolute"]{position:fixed!important;top:42px!important;left:8px!important;right:8px!important;max-height:70vh;overflow:auto;min-width:0!important;width:auto!important;box-shadow:0 6px 16px rgba(0,0,0,.3)}#legacy-main{padding:12px 12px 18px;display:flex;flex-direction:column}#legacy-sidebar{position:static!important;width:auto!important;margin:10px 12px 0!important;order:-1;box-sizing:border-box;border-radius:4px}#legacy-wrap{flex-direction:column;overflow-x:visible;gap:14px}#legacy-wrap>div{width:100%;overflow-x:auto}#legacy-wrap svg{width:min(520px,calc(100vw - 24px));height:auto}.alm-tabs{margin-top:12px;display:flex;gap:0;scrollbar-width:thin}.alm-tab-btn{height:38px;padding:0 14px;font-size:13px}.alm-panel{padding:12px 0 16px;overflow-x:auto}.alm-table{font-size:12px;min-width:520px}.alm-table th,.alm-table td{padding:5px 6px;height:28px}.bazi-summary-table{display:none}.bazi-mobile-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.bazi-mobile-card{border:1px solid #aaa;background:linear-gradient(#fff,#f2f2f2);box-shadow:0 2px 8px rgba(0,0,0,.12);padding:10px 8px;text-align:center}.bazi-mobile-label{font-size:12px;color:#555;margin-bottom:4px}.bazi-mobile-value{font-size:28px;font-family:serif;font-weight:700;line-height:1.15}.bazi-pill{font-size:24px}.legacy-form-row{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}.legacy-form-row.time{grid-template-columns:1fr auto 1fr}.legacy-form-control{min-height:34px;font-size:16px;padding:4px 6px;box-sizing:border-box;width:100%!important}#legacy-sidebar button{width:100%;min-height:36px;font-size:15px}.legacy-intro-card{margin:10px 0!important;padding:14px!important;max-width:none!important}}@media(max-width:420px){#legacy-main{padding-left:10px;padding-right:10px}.bazi-mobile-value{font-size:25px}.alm-table{min-width:470px}#legacy-wrap svg{width:calc(100vw - 20px)}}`}</style>

      <div id="cssmenu" style={{background:"#333",fontSize:"14px",display:"flex",alignItems:"center",padding:"0 16px"}}>
        <span style={{color:"#ccc",padding:"4px 12px"}}>hanhan <i>已登入</i></span>
        <span onClick={()=>window.location.href="/login"} style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>登出</span>
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
            {mode === "bazi" ? "四柱排盘" : `${lng.toFixed(2)} E　${lat.toFixed(2)} N`}<br/>
            时区: GMT {tz>=0?"+":""}{tz}.00<br/>
            {mode === "vedic" ? "恒星黄道 整宫制" : mode === "bazi" ? "干支四柱" : "回归黄道 阿卡比特制"}
          </div>

          {!chart&&<div className="legacy-intro-card" style={{border:"1px solid #d0d0d0",background:"#f7f7f7",padding:16,margin:"12px 0",maxWidth:760}}>
            <strong>{copy.title}</strong>
            <div style={{fontSize:13,color:"#555",marginTop:6}}>{copy.desc}</div>
            <button onClick={calculate} disabled={loading} style={{border:"1px solid #888",background:"#eee",padding:"4px 16px",marginTop:12,cursor:"pointer"}}>{loading ? "计算中..." : copy.button}</button>
            {error&&<div style={{color:"#b00020",fontSize:13,marginTop:8}}>{error}</div>}
          </div>}

          {chart&&mode!=="bazi"&&<div id="legacy-wrap">
            <div><AspectMatrix chart={chart}/></div>
            <div><NatalChartWheel chart={chart}/></div>
          </div>}

          {chart&&mode==="bazi"&&<>
            <div className="bazi-mobile-grid">
              {pillars.map(p => <div key={p.label} className="bazi-mobile-card"><div className="bazi-mobile-label">{p.label}</div><div className="bazi-mobile-value">{p.value}</div></div>)}
            </div>
            <div style={{marginTop:12,padding:'8px 12px',background:'#fef9e7',borderRadius:4,maxWidth:760}}>
              ☀️ <strong>日主 Day Master:</strong> {bazi.dayMaster.stem} ({bazi.dayMaster.element})
              {bazi.dayMaster.shiShen && <span> · 十神: {bazi.dayMaster.shiShen}</span>}
            </div>

            {/* Viral Share Buttons */}
            {mode === "bazi" && chart && <div style={{maxWidth:760,marginTop:12,display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              <span style={{fontSize:13,color:'#666',marginRight:4}}>📤 Share:</span>
              {[
                { label: '𝕏', color: '#000', url: (t: string) => `https://x.com/intent/tweet?text=${encodeURIComponent(t)}` },
                { label: 'WhatsApp', color: '#25D366', url: (t: string) => `https://wa.me/?text=${encodeURIComponent(t)}` },
                { label: 'Facebook', color: '#1877F2', url: (t: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://lunaxstar.com/bazi')}&quote=${encodeURIComponent(t)}` },
              ].map(btn => {
                const shareText = `My BaZi Day Master is ${bazi.dayMaster.stem} (${bazi.dayMaster.element})! Discover your cosmic blueprint for free at https://lunaxstar.com/bazi`;
                return (
                  <a key={btn.label} href={btn.url(shareText)} target="_blank" rel="noopener"
                    style={{padding:'4px 12px',background:btn.color,color:'white',borderRadius:4,fontSize:12,textDecoration:'none',fontWeight:600}}
                  >{btn.label}</a>
                );
              })}
              <button onClick={() => {
                navigator.clipboard.writeText(`https://lunaxstar.com/bazi`);
                alert('Link copied!');
              }} style={{padding:'4px 12px',background:'#666',color:'white',border:'none',borderRadius:4,fontSize:12,cursor:'pointer',fontWeight:600}}>
                📋 Copy Link
              </button>
            </div>}

            <table className="alm-table bazi-summary-table" style={{maxWidth:760,marginTop:8}}>
              <thead><tr>{pillars.map(p => <th key={p.label}>{p.label}</th>)}</tr></thead>
              <tbody><tr>{pillars.map(p => <td key={p.label} className="bazi-pill">{p.value}</td>)}</tr></tbody>
            </table>
          </>}

          {chart&&<div id="main_tabs">
            <div className="alm-tabs">
              {[{id:"chart-tab",l:mode==="bazi"?"四柱":"黄道状态"},{id:"table-tab",l:"数据表"},{id:"note-tab",l:"说明"}].map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`alm-tab-btn ${activeTab===t.id?"active":""}`}>{t.l}</button>
              ))}
            </div>
            <div className="alm-panel">
              {activeTab==="chart-tab"&&mode!=="bazi"&&<table className="alm-table">
                <thead><tr><th>星体</th><th>黄经度数</th><th>星座</th></tr></thead>
                <tbody>{planetRows.map(r=><tr key={r.key}><td>{r.name}</td><td>{lonText(r.lon)}</td><td>{SIGNS_CN[r.sign]}</td></tr>)}</tbody>
              </table>}
              {activeTab==="chart-tab"&&mode==="bazi"&&<table className="alm-table">
                <thead><tr><th>柱</th><th>干支</th><th>纳音</th><th>藏干</th><th>计算依据</th></tr></thead>
                <tbody>
                  {pillars.map(p=><tr key={p.label}>
                    <td>{p.label}</td>
                    <td className="bazi-pill">{p.value}</td>
                    <td style={{fontSize:13,color:'#666'}}>{p.naYin || '-'}</td>
                    <td style={{fontSize:13}}>{(p.hidden || []).join(' ') || '-'}</td>
                    <td>{p.label === "年柱" || p.label === "月柱" ? "精确节气" : "当地时间"}</td>
                  </tr>)}
                  <tr style={{background:'#fef9e7'}}>
                    <td colSpan={5}>
                      <strong>☀️ 日主 · Day Master:</strong> {bazi.dayMaster.stem} ({bazi.dayMaster.element}) 
                      {bazi.dayMaster.shiShen && <span> · 十神: {bazi.dayMaster.shiShen}</span>}
                    </td>
                  </tr>
                  <tr><td>农历</td><td colSpan={4}>{bazi.meta.lunarDate}</td></tr>
                  <tr><td>当天节气</td><td colSpan={4}>{bazi.meta.jieQi}</td></tr>
                  <tr><td>上一节气</td><td colSpan={4}>{bazi.meta.prevJieQi}</td></tr>
                  <tr><td>下一节气</td><td colSpan={4}>{bazi.meta.nextJieQi}</td></tr>
                </tbody>
              </table>}
              {activeTab==="table-tab"&&<table className="alm-table">
                <tbody>
                  <tr><th>工具</th><td>{copy.title}</td></tr>
                  <tr><th>时间</th><td>{year}-{month}-{day} {fmt2(hour)}:{fmt2(minute)}</td></tr>
                  <tr><th>地点</th><td>{mode==="bazi"?"-":`${lat}, ${lng}`}</td></tr>
                  {mode==="bazi"&&<>
                    <tr><th>四柱</th><td>{pillars.map(p=>`${p.label}:${p.value}`).join("　")}</td></tr>
                    <tr><th>日主</th><td>{bazi.dayMaster.stem} ({bazi.dayMaster.element}) {bazi.dayMaster.shiShen && `· ${bazi.dayMaster.shiShen}`}</td></tr>
                    <tr><th>纳音</th><td>{pillars.map(p=>`${p.label}:${p.naYin||'-'}`).join("　")}</td></tr>
                    <tr><th>藏干</th><td>{pillars.map(p=>`${p.label}:${(p.hidden||[]).join(' ')}`).join("　")}</td></tr>
                    <tr><th>上一节气</th><td>{bazi.meta.prevJieQi}</td></tr>
                    <tr><th>下一节气</th><td>{bazi.meta.nextJieQi}</td></tr>
                  </>}
                  <tr><th>说明</th><td className="left">{copy.desc}</td></tr>
                </tbody>
              </table>}
              {activeTab==="note-tab"&&<div style={{fontSize:13,lineHeight:1.7,color:"#333"}}>{mode==="bazi" ? bazi.meta.basis : `${copy.desc} 当前页面已统一为本命盘同款布局；可通过右侧快速制图表单重新计算。`}</div>}
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
            {mode!=="bazi"&&<>
              <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>纬度:</label>
              <input className="legacy-form-control" value={lat} onChange={e=>setLat(Number(e.target.value)||0)} style={{width:70}}/>
              <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>经度:</label>
              <input className="legacy-form-control" value={lng} onChange={e=>setLng(Number(e.target.value)||0)} style={{width:70}}/>
            </>}
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
