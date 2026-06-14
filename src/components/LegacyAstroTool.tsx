"use client";

import { useMemo, useState } from "react";
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
const MONTHS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chart-tab");

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
      <style>{`#legacy-main{padding:10px 260px 10px 20px}#legacy-wrap{display:flex;align-items:flex-start;gap:28px;flex-wrap:nowrap;margin-bottom:10px;overflow-x:auto}#legacy-wrap svg{max-width:none}.alm-tabs{width:100%;margin-top:8px;border:1px solid #aaa;border-radius:4px 4px 0 0;background:linear-gradient(#eeeeee,#cfcfcf);padding:3px 3px 0;overflow-x:auto}.alm-tab-btn{height:32px;padding:0 16px;border:1px solid #bbb;border-bottom:0;border-radius:4px 4px 0 0;background:linear-gradient(#f7f7f7,#dfdfdf);font-size:14px;color:#333;white-space:nowrap}.alm-tab-btn.active{background:white;font-weight:600;position:relative;top:1px}.alm-panel{padding:18px 28px 22px;background:white;overflow-x:auto}.alm-table{width:100%;border-collapse:collapse;background:white;color:#222;font-size:13px;line-height:1.15;box-shadow:0 4px 14px rgba(0,0,0,.14)}.alm-table th,.alm-table td{border:1px solid #aaa;padding:3px 6px;text-align:center;vertical-align:middle;height:22px}.alm-table th{background:#eee;font-weight:700}.alm-table td.left{text-align:left}.bazi-pill{font-size:30px;font-family:serif;font-weight:700}@media(max-width:900px){#legacy-main{padding:10px 20px}#legacy-sidebar{position:static!important;width:auto!important;margin:10px 20px}#legacy-wrap{flex-direction:column;overflow-x:visible}#legacy-wrap svg{width:min(520px,calc(100vw - 40px));height:auto}.alm-table{font-size:12px}}`}</style>

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

          {!chart&&<div style={{border:"1px solid #d0d0d0",background:"#f7f7f7",padding:16,margin:"12px 0",maxWidth:760}}>
            <strong>{copy.title}</strong>
            <div style={{fontSize:13,color:"#555",marginTop:6}}>{copy.desc}</div>
            <button onClick={calculate} disabled={loading} style={{border:"1px solid #888",background:"#eee",padding:"4px 16px",marginTop:12,cursor:"pointer"}}>{loading ? "计算中..." : copy.button}</button>
            {error&&<div style={{color:"#b00020",fontSize:13,marginTop:8}}>{error}</div>}
          </div>}

          {chart&&mode!=="bazi"&&<div id="legacy-wrap">
            <div><AspectMatrix chart={chart}/></div>
            <div><NatalChartWheel chart={chart}/></div>
          </div>}

          {chart&&mode==="bazi"&&<table className="alm-table" style={{maxWidth:760,marginTop:16}}>
            <thead><tr>{pillars.map(p => <th key={p.label}>{p.label}</th>)}</tr></thead>
            <tbody><tr>{pillars.map(p => <td key={p.label} className="bazi-pill">{p.value}</td>)}</tr></tbody>
          </table>}

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
                <thead><tr><th>柱</th><th>干支</th></tr></thead>
                <tbody>{pillars.map(p=><tr key={p.label}><td>{p.label}</td><td className="bazi-pill">{p.value}</td></tr>)}</tbody>
              </table>}
              {activeTab==="table-tab"&&<table className="alm-table">
                <tbody>
                  <tr><th>工具</th><td>{copy.title}</td></tr>
                  <tr><th>时间</th><td>{year}-{month}-{day} {fmt2(hour)}:{fmt2(minute)}</td></tr>
                  <tr><th>地点</th><td>{mode==="bazi"?"-":`${lat}, ${lng}`}</td></tr>
                  <tr><th>说明</th><td className="left">{copy.desc}</td></tr>
                </tbody>
              </table>}
              {activeTab==="note-tab"&&<div style={{fontSize:13,lineHeight:1.7,color:"#333"}}>{copy.desc} 当前页面已统一为本命盘同款布局；可通过右侧快速制图表单重新计算。</div>}
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
            <select value={month} onChange={e=>setMonth(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>
            <select value={day} onChange={e=>setDay(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select>
            <input value={year} onChange={e=>setYear(parseInt(e.target.value)||now.getFullYear())} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:45}}/>
            <br/>
            <select value={hour} onChange={e=>setHour(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",marginTop:4}}>{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{fmt2(h)}</option>)}</select>
            :<select value={minute} onChange={e=>setMinute(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>{Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{fmt2(m)}</option>)}</select>
            {mode!=="bazi"&&<>
              <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>纬度:</label>
              <input value={lat} onChange={e=>setLat(Number(e.target.value)||0)} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:70}}/>
              <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>经度:</label>
              <input value={lng} onChange={e=>setLng(Number(e.target.value)||0)} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:70}}/>
            </>}
            <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>时区:</label>
            <input value={tz} onChange={e=>setTz(Number(e.target.value)||0)} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:45}}/>
            {isProgressed&&<><br/><label style={{fontWeight:"bold",fontSize:"12px"}}>目标年:</label><input value={targetYear} onChange={e=>setTargetYear(Number(e.target.value)||targetYear)} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:58}}/></>}
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
