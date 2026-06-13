"use client";

import { useEffect, useState } from "react";
import NatalChartWheel from "@/components/NatalChartWheel";
import { AspectMatrix } from "@/components/AlmutenChartLayout";

const MONTHS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
const SIGN_SYMBOLS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const DEFAULT_LAT = 25 + 3 / 60;
const DEFAULT_LNG = 121 + 30 / 60;
const DEFAULT_HOUSE_SYSTEM = "B";

function norm(v:number){return((v%360)+360)%360;}
function fmt2(n:number){return String(Math.trunc(n)).padStart(2,"0");}
function coordinateParts(value:number){
  let degrees = Math.trunc(Math.abs(value));
  let minutes = Math.round((Math.abs(value) % 1) * 60);
  if(minutes === 60){
    degrees += 1;
    minutes = 0;
  }
  return {degrees, minutes};
}

export default function NatalPage(){
  const now = new Date();
  const [name,setName] = useState("Quick Chart");
  const [month,setMonth] = useState(now.getMonth()+1);
  const [day,setDay] = useState(now.getDate());
  const [year,setYear] = useState(now.getFullYear());
  const [hour,setHour] = useState(now.getHours());
  const [minute,setMinute] = useState(now.getMinutes());
  const [city,setCity] = useState("台北市");
  const [glonDeg,setGlonDeg] = useState(121);
  const [glonMin,setGlonMin] = useState(30);
  const [glonDir,setGlonDir] = useState("E");
  const [glatDeg,setGlatDeg] = useState(25);
  const [glatMin,setGlatMin] = useState(3);
  const [glatDir,setGlatDir] = useState("N");
  const [tz,setTz] = useState(480);
  const [hsys,setHsys] = useState(DEFAULT_HOUSE_SYSTEM);
  const [chart,setChart] = useState<any>(null);
  const [loading,setLoading] = useState(false);
  const [activeTab,setActiveTab] = useState("chart-tab");
  const [sidebarOpen,setSidebarOpen] = useState(true);

  const lat = (glatDeg + glatMin / 60) * (glatDir === "S" ? -1 : 1);
  const lng = (glonDeg + glonMin / 60) * (glonDir === "W" ? -1 : 1);
  const tzHours = tz / 60;

  const requestChart = async(body:any)=>{
    setLoading(true);
    try{
      const r = await fetch("/api/chart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const d = await r.json();
      if(d.error) throw new Error(d.error);
      setChart(d.data || d);
    }catch{
    }finally{
      setLoading(false);
    }
  };

  const drawChart = async()=>{
    await requestChart({year,month,day,hour:Number(hour),minute:Number(minute),latitude:lat,longitude:lng,timezone:tzHours,houseSystem:hsys});
  };

  useEffect(()=>{
    const current = new Date();
    const currentTz = -current.getTimezoneOffset();
    const base = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
      hour: current.getHours(),
      minute: current.getMinutes(),
      timezone: currentTz / 60,
      houseSystem: DEFAULT_HOUSE_SYSTEM,
    };

    setYear(base.year);
    setMonth(base.month);
    setDay(base.day);
    setHour(base.hour);
    setMinute(base.minute);
    setTz(currentTz);

    const fallback = () => requestChart({...base, latitude: DEFAULT_LAT, longitude: DEFAULT_LNG});

    if(!navigator.geolocation){
      fallback();
      return;
    }

    let settled = false;
    const timer = window.setTimeout(()=>{
      if(settled) return;
      settled = true;
      fallback();
    },3000);

    navigator.geolocation.getCurrentPosition(
      position=>{
        if(settled) return;
        settled = true;
        window.clearTimeout(timer);

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const latParts = coordinateParts(latitude);
        const lngParts = coordinateParts(longitude);

        setCity("当前位置");
        setGlatDeg(latParts.degrees);
        setGlatMin(latParts.minutes);
        setGlatDir(latitude >= 0 ? "N" : "S");
        setGlonDeg(lngParts.degrees);
        setGlonMin(lngParts.minutes);
        setGlonDir(longitude >= 0 ? "E" : "W");
        requestChart({...base, latitude, longitude});
      },
      ()=>{
        if(settled) return;
        settled = true;
        window.clearTimeout(timer);
        fallback();
      },
      {enableHighAccuracy:false, maximumAge:600000, timeout:2500}
    );

    return ()=>window.clearTimeout(timer);
  },[]);

  const codeAddress = async()=>{
    try{
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
      const d = await r.json();
      if(d?.[0]){
        const la = parseFloat(d[0].lat);
        const lo = parseFloat(d[0].lon);
        setGlatDeg(Math.trunc(Math.abs(la)));
        setGlatMin(Math.round((Math.abs(la)%1)*60));
        setGlatDir(la>=0?"N":"S");
        setGlonDeg(Math.trunc(Math.abs(lo)));
        setGlonMin(Math.round((Math.abs(lo)%1)*60));
        setGlonDir(lo>=0?"E":"W");
        setTz(Math.round(lo/15)*60);
      }
    }catch{}
  };

  const pData = chart?.planets;
  const hData = chart?.houses;

  const dignRows = chart ? ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto","North_Node"].filter(k=>pData?.[k]).map(k=>{
    const p = pData[k];
    const lon = norm(p.longitude ?? 0);
    const si = Math.floor(lon/30);
    const d = lon % 30;
    let house = "-";
    if(hData) for(let i=0;i<hData.length;i++){
      const c = norm(hData[i].longitude);
      const n = norm(hData[(i+1)%hData.length].longitude);
      if(c<=n ? lon>=c && lon<n : lon>=c || lon<n){house = String(hData[i].house);break;}
    }
    const rules:Record<string,number[]> = {Sun:[4],Moon:[3],Mercury:[2,5],Venus:[1,6],Mars:[0,7],Jupiter:[8,11],Saturn:[9,10]};
    const ex:Record<string,number> = {Sun:0,Moon:1,Mercury:5,Venus:11,Mars:9,Jupiter:3,Saturn:6};
    let dign = "中度";
    let score = 0;
    if((rules[k]||[]).includes(si)){dign="得令";score=5;}
    else if(ex[k]===si){dign="曜升";score=4;}
    return [k,`${Math.floor(d)}°${SIGN_SYMBOLS[si]} ${String(Math.round((d%1)*60)).padStart(2,"0")}′${p.retrograde?" R":""}`,house,dign,String(score)];
  }) : [];

  return(
    <div className="min-h-screen bg-white text-[#333]">
      <style>{`.house_sym{font-size:16px;font-weight:bold}.house_deg{font-size:9px;fill:#666}.house_min{font-size:7px;fill:#999}.tiny{font-size:9px;fill:#666}.asp_grid_sym{font-family:'Apple Symbols','DejaVu Sans',serif}.asp_grid_digit{font-family:sans-serif}.obj_sym{font-size:14px;font-weight:bold}.obj_deg{font-size:10px}.middle_sym{font-size:14px;font-weight:bold}.obj_min{font-size:8px;fill:#666}.asp_sym{font-size:10px;font-weight:bold}#natalmain{padding:10px 260px 10px 20px}#chartwrap{display:flex;align-items:flex-start;gap:28px;flex-wrap:nowrap;margin-bottom:10px;overflow-x:auto}#chart svg{max-width:none}@media(max-width:900px){#natalmain{padding:10px 20px}#rightsidebar{position:static!important;width:auto!important;margin:10px 20px}#chartwrap{flex-direction:column;overflow-x:visible}#chart{order:1}#aspgrid{order:2;max-width:100%;overflow-x:auto}#chart svg{width:min(520px,calc(100vw - 40px));height:auto}}`}</style>

      <div id="cssmenu" style={{background:"#333",fontSize:"14px",display:"flex",alignItems:"center",padding:"0 16px"}}>
        <span style={{color:"#ccc",padding:"4px 12px"}}>hanhan <i>已登入</i></span>
        <span style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>文件 ▾</span>
        <span style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>工具 ▾</span>
        <span style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>设定 ▾</span>
        <span style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>快速制图</span>
        <span style={{flex:1}}/>
        <span style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>星缘</span>
      </div>

      <div style={{position:"relative"}}>
        <div id="natalmain">
          {chart&&<div id="nataldata" style={{margin:"5px 0"}}>
            <strong>{name}</strong><br/>
            {year}-{month}-{day} {hour}:{fmt2(minute)}<br/>{city}<br/>
            {glonDeg} {glonDir} {fmt2(glonMin)}&nbsp;&nbsp;{glatDeg} {glatDir} {fmt2(glatMin)}<br/>
            时区: GMT {tz>=0?"+":""}{tz/60}.00<br/>回归黄道 阿卡比特制<br/>时主星: <em>☉</em>
          </div>}

          {chart&&<div id="chartwrap">
            <div id="aspgrid"><AspectMatrix chart={chart}/></div>
            <div id="chart"><NatalChartWheel chart={chart}/></div>
          </div>}

          <div style={{clear:"both"}}/>

          {chart&&<div id="main_tabs" style={{width:"100%"}}>
            <div style={{display:"flex",borderBottom:"1px solid #aaa",marginBottom:8}}>
              {[{id:"chart-tab",l:"黄道状态"},{id:"dignity2-tab",l:"黄道状态-2"},{id:"firdaria-tab",l:"法达星限"},{id:"profection-tab",l:"小限法"},{id:"fortune-tab",l:"福点 Aphesis"},{id:"spirit-tab",l:"精神点 Aphesis"}].map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:"4px 16px",border:"1px solid #aaa",borderBottom:0,borderRadius:"4px 4px 0 0",fontSize:"13px",background:activeTab===t.id?"#fff":"#eee",fontWeight:activeTab===t.id?"bold":"normal",marginRight:-1}}>{t.l}</button>
              ))}
            </div>

            {activeTab==="chart-tab"&&<div className="list_table" style={{clear:"both",width:"100%"}}>
              <table width="100%" style={{borderCollapse:"collapse",fontSize:"12px"}}>
                <thead>
                  <tr style={{border:"1px solid #aaa"}}><th rowSpan={2} style={{border:"1px solid #aaa",padding:"6px 10px"}}>星体</th><th rowSpan={2} colSpan={4} style={{border:"1px solid #aaa",padding:"6px 10px"}}>黄经度数</th><th rowSpan={2} style={{border:"1px solid #aaa",padding:"6px 10px"}}>落宫</th><th rowSpan={2} style={{border:"1px solid #aaa",padding:"6px 10px"}}>先天黄道状态</th><th style={{border:"1px solid #aaa",padding:"6px 10px"}}>分数</th></tr>
                </thead>
                <tbody>
                  {dignRows.map((r,i)=><tr key={i} style={{border:"1px solid #aaa"}}>
                    <td align="center" style={{border:"1px solid #aaa",padding:"4px 10px"}}><em>{r[0]}</em></td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"4px 10px"}} colSpan={4}>{r[1]}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"4px 10px"}}>{r[2]}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"4px 10px"}}>{r[3]}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"4px 10px"}}>{r[4]}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>}

            {activeTab==="dignity2-tab"&&chart&&<div className="list_table" style={{display:"flex",gap:16,fontSize:"12px"}}>
              <div style={{width:"32%"}}>
                <table width="100%" style={{borderCollapse:"collapse"}}>
                  <thead><tr style={{border:"1px solid #aaa"}}><th style={{border:"1px solid #aaa",padding:"4px"}}>宫</th><th colSpan={3} style={{border:"1px solid #aaa",padding:"4px"}}>度数</th></tr></thead>
                  <tbody>{(hData||[]).map((h:any)=>{const si=Math.floor(norm(h.longitude)/30);const d=norm(h.longitude)%30;return <tr key={h.house} style={{border:"1px solid #aaa"}}><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}>{h.house}</td><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}>{Math.floor(d)}°</td><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}><em>{SIGN_SYMBOLS[si]}</em></td><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}>{Math.round((d%1)*60)}′</td></tr>;})}</tbody>
                </table>
              </div>
            </div>}

            {["firdaria-tab","profection-tab","fortune-tab","spirit-tab"].includes(activeTab)&&<div style={{textAlign:"center",color:"#999",padding:20}}>此功能开发中</div>}
          </div>}
        </div>

        <div id="rightsidebar" style={{position:"absolute",right:10,top:10,padding:5,width:240,textAlign:"left",border:"1px solid #D0D0D0",background:"#4a4a4a",color:"white",boxShadow:"0 0 8px #D0D0D0",fontSize:"13px",opacity:0.9}}>
          <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <strong>快速制图</strong>
            <span style={{float:"right",cursor:"pointer"}}>{sidebarOpen?"−":"+"}</span>
          </div>
          {sidebarOpen&&<div id="sidebar_form"><hr/>
            <label style={{fontWeight:"bold",fontSize:"12px"}}>名字:</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} size={25} style={{width:"100%",border:"1px solid #888",background:"#555",color:"white",padding:"2px 4px",marginBottom:6}}/>
            <label style={{fontWeight:"bold",fontSize:"12px"}}>出生时间:</label><br/>
            <select value={month} onChange={e=>setMonth(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>{MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>
            <select value={day} onChange={e=>setDay(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select>
            <input type="text" value={year} onChange={e=>setYear(parseInt(e.target.value)||now.getFullYear())} size={4} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:45}}/>
            &nbsp;
            <select value={hour} onChange={e=>setHour(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>
              {Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{h===0?"12 AM":h<12?`${h} AM`:h===12?"12 PM":`${h-12} PM`}</option>)}
            </select>
            :<select value={minute} onChange={e=>setMinute(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>
              {Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>地点:</label><br/>
            <input type="text" value={city} onChange={e=>setCity(e.target.value)} id="location" size={25} style={{border:"1px solid #888",background:"#555",color:"white",padding:"2px 4px"}}/>
            <input type="button" value="搜寻" onClick={codeAddress} style={{border:"1px solid #888",background:"#666",color:"white",padding:"1px 6px",cursor:"pointer"}}/>
            <p/>
            <label style={{fontWeight:"bold",fontSize:"12px"}}>经度:</label>
            <input type="text" value={glonDeg} onChange={e=>setGlonDeg(parseInt(e.target.value)||0)} size={3} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:35}}/>
            <select value={glonDir} onChange={e=>setGlonDir(e.target.value)} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}><option value="E">E</option><option value="W">W</option></select>
            <input type="text" value={glonMin} onChange={e=>setGlonMin(parseInt(e.target.value)||0)} size={2} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:30}}/>
            <br/>
            <label style={{fontWeight:"bold",fontSize:"12px"}}>纬度:</label>
            <input type="text" value={glatDeg} onChange={e=>setGlatDeg(parseInt(e.target.value)||0)} size={2} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:30}}/>
            <select value={glatDir} onChange={e=>setGlatDir(e.target.value)} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}><option value="N">N</option><option value="S">S</option></select>
            <input type="text" value={glatMin} onChange={e=>setGlatMin(parseInt(e.target.value)||0)} size={2} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px",width:30}}/>
            <br/>
            <label style={{fontWeight:"bold",fontSize:"12px"}}>时区:</label>
            <select value={tz} onChange={e=>setTz(Number(e.target.value))} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>
              {[-720,-660,-600,-540,-480,-420,-360,-300,-240,-180,-120,-60,0,60,120,180,240,300,360,420,480,540,600,660,720].map(v=><option key={v} value={v}>GMT {(v>=0?"+":"-")+String(Math.abs(v/60)).padStart(2,"0")}</option>)}
            </select>
            <br/><label style={{fontWeight:"bold",fontSize:"12px"}}>宫位制:</label>
            <select value={hsys} onChange={e=>setHsys(e.target.value)} style={{border:"1px solid #888",background:"#555",color:"white",padding:"1px 2px"}}>
              {[{v:"B",l:"阿卡比特制"},{v:"P",l:"普拉西德制"},{v:"K",l:"Koch制"},{v:"O",l:"Porphyrius制"},{v:"R",l:"苪氏分宫制"},{v:"C",l:"Campanus制"},{v:"E",l:"等宫制"},{v:"W",l:"整宫制"}].map(h=><option key={h.v} value={h.v}>{h.l}</option>)}
            </select>
            <div style={{textAlign:"center",marginTop:8}}>
              <input type="submit" value={loading?"计算中...":"更新星图"} onClick={drawChart} disabled={loading} style={{border:"1px solid #888",background:"#666",color:"white",padding:"2px 12px",cursor:"pointer"}}/>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}
