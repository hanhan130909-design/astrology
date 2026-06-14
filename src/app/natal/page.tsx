"use client";

import { useEffect, useState, Fragment } from "react";
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
  if(minutes === 60){degrees += 1;minutes = 0;}
  return {degrees, minutes};
}


type FirdariaPeriod = {planet:string;years:number;start:Date;end:Date;subPeriods:{planet:string;start:Date;end:Date}[]};
const FIRDARIA_YEARS:Record<string,number>={Sun:10,Venus:8,Mercury:13,Moon:9,Saturn:11,Jupiter:12,Mars:7,North_Node:3,South_Node:2};
const FIRDARIA_DAY_ORDER=["Sun","Venus","Mercury","Moon","Saturn","Jupiter","Mars","North_Node","South_Node"];
const FIRDARIA_NIGHT_ORDER=["Moon","Saturn","Jupiter","Mars","Sun","Venus","Mercury","North_Node","South_Node"];
const FIRDARIA_CLASSICAL_DAY=["Sun","Venus","Mercury","Moon","Saturn","Jupiter","Mars"];
const FIRDARIA_CLASSICAL_NIGHT=["Moon","Saturn","Jupiter","Mars","Sun","Venus","Mercury"];
function addCalendarYears(date:Date,years:number){const d=new Date(date);d.setFullYear(d.getFullYear()+years);return d;}
function addFirdariaDays(date:Date,years:number){const d=new Date(date);d.setDate(d.getDate()+Math.round(years*365.2425));return d;}
function formatFirdariaDate(date:Date){return date.toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit"});}
function findHouseForLongitude(lon:number,houses:any[]){for(let i=0;i<houses.length;i++){const c=norm(houses[i].longitude),n=norm(houses[(i+1)%houses.length].longitude);if(c<=n?lon>=c&&lon<n:lon>=c||lon<n)return Number(houses[i].house);}return 0;}
function buildFirdariaPeriods(chart:any,year:number,month:number,day:number){
  const houses=chart?.houses||[];
  const sunLon=chart?.planets?.Sun?.longitude;
  const sunHouse=typeof sunLon==="number"?findHouseForLongitude(norm(sunLon),houses):0;
  const isDay=sunHouse>=7&&sunHouse<=12;
  const order=isDay?FIRDARIA_DAY_ORDER:FIRDARIA_NIGHT_ORDER;
  const subOrder=isDay?FIRDARIA_CLASSICAL_DAY:FIRDARIA_CLASSICAL_NIGHT;
  let start=new Date(year,month-1,day);
  const periods:FirdariaPeriod[]=order.map(planet=>{
    const years=FIRDARIA_YEARS[planet];
    const end=addCalendarYears(start,years);
    const subPeriods=planet.includes("Node")?[]:Array.from({length:7},(_,idx)=>{
      const subPlanet=subOrder[(subOrder.indexOf(planet)+idx+subOrder.length)%subOrder.length];
      const subStart=addFirdariaDays(start,idx*years/7);
      const subEnd=idx===6?end:addFirdariaDays(start,(idx+1)*years/7);
      return {planet:subPlanet,start:subStart,end:subEnd};
    });
    const period={planet,years,start,end,subPeriods};
    start=end;
    return period;
  });
  return {isDay,periods};
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
  const [openMenu,setOpenMenu] = useState<string|null>(null);

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
    }catch{}finally{setLoading(false);}
  };
  const drawChart = async()=>{await requestChart({year,month,day,hour:Number(hour),minute:Number(minute),latitude:lat,longitude:lng,timezone:tzHours,houseSystem:hsys});};

  useEffect(()=>{
    const current = new Date();const currentTz = -current.getTimezoneOffset();
    const base = {year:current.getFullYear(),month:current.getMonth()+1,day:current.getDate(),hour:current.getHours(),minute:current.getMinutes(),timezone:currentTz/60,houseSystem:DEFAULT_HOUSE_SYSTEM};
    setYear(base.year);setMonth(base.month);setDay(base.day);setHour(base.hour);setMinute(base.minute);setTz(currentTz);
    const fallback = () => requestChart({...base, latitude: DEFAULT_LAT, longitude: DEFAULT_LNG});
    if(!navigator.geolocation){fallback();return;}
    let settled = false;const timer = window.setTimeout(()=>{if(!settled){settled=true;fallback();}},3000);
    navigator.geolocation.getCurrentPosition(p=>{if(settled)return;settled=true;window.clearTimeout(timer);const lp=coordinateParts(p.coords.latitude);const lnp=coordinateParts(p.coords.longitude);setCity("当前位置");setGlatDeg(lp.degrees);setGlatMin(lp.minutes);setGlatDir(p.coords.latitude>=0?"N":"S");setGlonDeg(lnp.degrees);setGlonMin(lnp.minutes);setGlonDir(p.coords.longitude>=0?"E":"W");requestChart({...base,latitude:p.coords.latitude,longitude:p.coords.longitude});},()=>{if(!settled){settled=true;window.clearTimeout(timer);fallback();}},{enableHighAccuracy:false,maximumAge:600000,timeout:2500});
    return ()=>window.clearTimeout(timer);
  },[]);

  const codeAddress = async()=>{
    try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);const d=await r.json();if(d?.[0]){const la=parseFloat(d[0].lat),lo=parseFloat(d[0].lon);setGlatDeg(Math.trunc(Math.abs(la)));setGlatMin(Math.round((Math.abs(la)%1)*60));setGlatDir(la>=0?"N":"S");setGlonDeg(Math.trunc(Math.abs(lo)));setGlonMin(Math.round((Math.abs(lo)%1)*60));setGlonDir(lo>=0?"E":"W");setTz(Math.round(lo/15)*60);}}catch{}
  };
  const handleSave = ()=>{if(!chart)return;const s=JSON.parse(localStorage.getItem("natal_charts")||"[]");s.unshift({name,ts:Date.now(),birthData:{name,year,month,day,hour,minute,lat,lng,tz,hsys}});localStorage.setItem("natal_charts",JSON.stringify(s.slice(0,20)));alert("已储存");};
  const handleCopyLink = ()=>{navigator.clipboard.writeText(window.location.href).then(()=>alert("链接已复制"));};
  const handleExportImage = async()=>{const el=document.getElementById("chart");if(!el)return;try{const{default:h}=await import("html2canvas");const c=await h(el,{backgroundColor:"#0f0f1a",scale:2});const a=document.createElement("a");a.download=`chart-${year}-${month}-${day}.png`;a.href=c.toDataURL();a.click();}catch{}};

  const pData = chart?.planets;
  const hData = chart?.houses;
  const aData = chart?.aspects;

  // ─── Essential Dignity Data ───
  const RULER:Record<string,number[]>={Sun:[4],Moon:[3],Mercury:[2,5],Venus:[1,6],Mars:[0,7],Jupiter:[8,11],Saturn:[9,10],Uranus:[10],Neptune:[11],Pluto:[7]};
  const DETRIMENT:Record<string,number[]>={Sun:[10],Moon:[9],Mercury:[8,11],Venus:[0,7],Mars:[1,6],Jupiter:[2,5],Saturn:[3,4]};
  const EXALT:Record<string,number>={Sun:0,Moon:1,Mercury:5,Venus:11,Mars:9,Jupiter:3,Saturn:6,Uranus:7,Neptune:4,Pluto:7};
  const FALL:Record<string,number>={Sun:6,Moon:7,Mercury:11,Venus:5,Mars:3,Jupiter:9,Saturn:0};
  const TRIPLICITY:Record<string,number[]>={Sun:[0,4,8],Moon:[1,5,9],Mercury:[2,6,10],Venus:[1,5,9],Mars:[3,7,11],Jupiter:[0,4,8],Saturn:[2,6,10]};
  const TERMS:Record<number,{p:string;e:number}[]>={0:[{p:"Jupiter",e:6},{p:"Venus",e:12},{p:"Mercury",e:20},{p:"Mars",e:25},{p:"Saturn",e:30}],1:[{p:"Venus",e:8},{p:"Mercury",e:14},{p:"Jupiter",e:22},{p:"Saturn",e:27},{p:"Mars",e:30}],2:[{p:"Mercury",e:6},{p:"Jupiter",e:12},{p:"Venus",e:17},{p:"Mars",e:24},{p:"Saturn",e:30}],3:[{p:"Mars",e:7},{p:"Venus",e:13},{p:"Mercury",e:19},{p:"Jupiter",e:26},{p:"Saturn",e:30}],4:[{p:"Jupiter",e:6},{p:"Venus",e:11},{p:"Saturn",e:24},{p:"Mercury",e:30}],5:[{p:"Mercury",e:7},{p:"Venus",e:17},{p:"Jupiter",e:21},{p:"Mars",e:28},{p:"Saturn",e:30}],6:[{p:"Saturn",e:6},{p:"Mercury",e:14},{p:"Jupiter",e:21},{p:"Venus",e:28},{p:"Mars",e:30}],7:[{p:"Mars",e:7},{p:"Venus",e:11},{p:"Mercury",e:19},{p:"Jupiter",e:24},{p:"Saturn",e:30}],8:[{p:"Jupiter",e:12},{p:"Venus",e:17},{p:"Mercury",e:21},{p:"Saturn",e:26},{p:"Mars",e:30}],9:[{p:"Venus",e:7},{p:"Mercury",e:14},{p:"Jupiter",e:22},{p:"Saturn",e:26},{p:"Mars",e:30}],10:[{p:"Mercury",e:7},{p:"Venus",e:13},{p:"Jupiter",e:20},{p:"Mars",e:25},{p:"Saturn",e:30}],11:[{p:"Venus",e:12},{p:"Jupiter",e:16},{p:"Mercury",e:19},{p:"Mars",e:28},{p:"Saturn",e:30}]};
  const FACES:Record<number,string[]>={0:["Mars","Sun","Venus"],1:["Mercury","Moon","Saturn"],2:["Jupiter","Mars","Sun"],3:["Venus","Mercury","Moon"],4:["Saturn","Jupiter","Mars"],5:["Mercury","Saturn","Jupiter"],6:["Venus","Mars","Sun"],7:["Moon","Venus","Mercury"],8:["Saturn","Sun","Moon"],9:["Jupiter","Mercury","Saturn"],10:["Mars","Jupiter","Venus"],11:["Sun","Moon","Mercury"]};

  const planetCodes:Record<string,string>={Sun:"Q",Moon:"W",Mercury:"E",Venus:"R",Mars:"T",Jupiter:"Y",Saturn:"U",Uranus:"I",Neptune:"O",Pluto:"P",North_Node:"<",South_Node:">"};
  const planetCodesFull:Record<string,string>={...planetCodes,Ascendant:"Z",Midheaven:"X"};
  const planetSymbols:Record<string,string>={Q:"☉",W:"☽",E:"☿",R:"♀",T:"♂",Y:"♃",U:"♄",I:"♅",O:"♆",P:"♇","<":"☊",">":"☋",Z:"AC",X:"MC"};

  const dignityRows = chart ? ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto","North_Node","Ascendant","Midheaven"].filter(k=>{
    if(k==="Ascendant")return chart?.ascendant;
    if(k==="Midheaven")return chart?.midheaven;
    return pData?.[k];
  }).map(k=>{
    let lon:number,retro=false;
    if(k==="Ascendant"){lon=typeof chart.ascendant==='number'?chart.ascendant:chart.ascendant?.longitude??hData?.[0]?.longitude??0;}
    else if(k==="Midheaven"){lon=typeof chart.midheaven==='number'?chart.midheaven:chart.midheaven?.longitude??hData?.[9]?.longitude??0;}
    else{const p=pData[k];lon=norm(p.longitude??0);retro=p.retrograde??false;}
    const si=Math.floor(lon/30);const d=lon%30;
    let house="-";if(hData)for(let i=0;i<hData.length;i++){const c=norm(hData[i].longitude),n=norm(hData[(i+1)%hData.length].longitude);if(c<=n?lon>=c&&lon<n:lon>=c||lon<n){house=String(hData[i].house);break;}}
    const r=(RULER[k]||[]).includes(si)?planetCodes[Object.keys(RULER).find(rk=>(RULER[rk]||[]).includes(si))||k]||"":"";
    const ex=EXALT[k]===si?planetCodes[Object.keys(EXALT).find(ek=>EXALT[ek]===si)||""]||"":"";
    const tri=(TRIPLICITY[k]||[]).includes(si)?planetCodes[k]||"":"";
    const term=TERMS[si]?.find(t=>d<t.e);
    const tP=term?planetCodes[term.p]||"":"";
    const faceIdx=Math.floor(d/10);
    const face=FACES[si]?.[faceIdx]||"";
    const faceP=face?planetCodes[face]||"":"";
    const det=(DETRIMENT[k]||[]).includes(si)?"1":"";
    const fal=FALL[k]===si?"1":"";
    const rulerScore=r?5:0,exScore=ex?4:0,triScore=tri?3:0,termScore=tP?2:0,faceScore=faceP?1:0;
    const totalScore=rulerScore+exScore+triScore+termScore+faceScore-(det?4:0)-(fal?5:0);
    return{code:planetCodesFull[k]||k[0],name:k,deg:`${Math.floor(d)}°${SIGN_SYMBOLS[si]} ${String(Math.round((d%1)*60)).padStart(2,"0")}′${retro?" R":""}`,house,guardianHouse:"-",exaltHouse:"-",ruler:r,exalt:ex,triplicity:tri,term:tP,face:faceP,detriment:det,fall:fal,score:totalScore>0?"+"+totalScore:String(totalScore),state:totalScore>=5?"强":totalScore>=0?"平均":"弱",speed:"平均",sect:["Sun","Jupiter","Saturn"].includes(k)?"得时":"-",orient:retro?"西入":"东出"};
  }):[];

  const houseRows = (hData||[]).map((h:any)=>{
    const si=Math.floor(norm(h.longitude)/30);const d=norm(h.longitude)%30;
    const rulerK=Object.keys(RULER).find(k=>(RULER[k]||[]).includes(si));
    const exK=Object.keys(EXALT).find(k=>EXALT[k]===si);
    return{house:h.house,deg:`${Math.floor(d)}°${SIGN_SYMBOLS[si]} ${String(Math.round((d%1)*60)).padStart(2,"0")}′`,ruler:rulerK?planetCodes[rulerK]||"":"",exalt:exK?planetCodes[exK]||"":"",almuten:rulerK?planetCodes[rulerK]||"":""};
  });
  const firdaria = chart ? buildFirdariaPeriods(chart, year, month, day) : {isDay:true, periods:[] as FirdariaPeriod[]};

  return(
    <div className="min-h-screen bg-white text-[#333]">
      <style>{`.house_sym{font-size:16px;font-weight:bold}.house_deg{font-size:9px;fill:#666}.house_min{font-size:7px;fill:#999}.tiny{font-size:9px;fill:#666}.asp_grid_sym{font-family:'Apple Symbols','DejaVu Sans',serif}.asp_grid_digit{font-family:sans-serif}.obj_sym{font-size:14px;font-weight:bold}.obj_deg{font-size:10px}.middle_sym{font-size:14px;font-weight:bold}.obj_min{font-size:8px;fill:#666}.asp_sym{font-size:10px;font-weight:bold}#natalmain{padding:10px 260px 10px 20px}#chartwrap{display:flex;align-items:flex-start;gap:28px;flex-wrap:nowrap;margin-bottom:10px;overflow-x:auto}#chart svg{max-width:none}@media(max-width:900px){#natalmain{padding:10px 20px}#rightsidebar{position:static!important;width:auto!important;margin:10px 20px}#chartwrap{flex-direction:column;overflow-x:visible}#chart{order:1}#aspgrid{order:2;max-width:100%;overflow-x:auto}#chart svg{width:min(520px,calc(100vw - 40px));height:auto}}`}</style>

      <div id="cssmenu" style={{background:"#333",fontSize:"14px",display:"flex",alignItems:"center",padding:"0 16px"}}>
        <span style={{color:"#ccc",padding:"4px 12px"}}>hanhan <i>已登入</i></span>
        <span onClick={()=>window.location.href="/"} style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>返回首页</span>
        {[{id:"file",l:"文件",items:["列表","新增"]},{id:"tools",l:"工具",items:["星象日历","出生时间反推"]},{id:"settings",l:"设定",items:["修改密码","个人资料","选择语系"]}].map(m=>(
          <span key={m.id} style={{position:"relative"}}>
            <span onClick={()=>setOpenMenu(openMenu===m.id?null:m.id)} style={{color:"#ccc",padding:"4px 12px",cursor:"pointer"}}>{m.l} ▾</span>
            {openMenu===m.id&&<div style={{position:"absolute",top:"100%",left:0,background:"#444",color:"#ccc",minWidth:120,zIndex:50,border:"1px solid #555"}}>
              {m.items.map(item=><div key={item} style={{padding:"4px 12px",cursor:"pointer",fontSize:"13px"}} onMouseDown={()=>setOpenMenu(null)}>{item}</div>)}
            </div>}
          </span>
        ))}
        <a href="/natal" style={{color:"#ccc",padding:"4px 12px",textDecoration:"none",cursor:"pointer"}}>快速制图</a>
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

            {/* === 黄道状态 === */}
            {activeTab==="chart-tab"&&<div className="list_table" style={{clear:"both",width:"100%",fontSize:"11px",overflowX:"auto"}}>
              <table style={{borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{border:"1px solid #aaa"}}>
                    <th rowSpan={2} style={{border:"1px solid #aaa",padding:"4px 6px"}}>星体</th>
                    <th rowSpan={2} colSpan={3} style={{border:"1px solid #aaa",padding:"4px 6px"}}>黄经度数</th>
                    <th rowSpan={2} style={{border:"1px solid #aaa",padding:"4px 6px"}}>落宫</th>
                    <th rowSpan={2} style={{border:"1px solid #aaa",padding:"4px 6px"}}>守护宫</th>
                    <th rowSpan={2} style={{border:"1px solid #aaa",padding:"4px 6px"}}>曜升宫</th>
                    <th colSpan={10} style={{border:"1px solid #aaa",padding:"4px 6px"}}>先天黄道状态</th>
                    <th colSpan={4} rowSpan={2} style={{border:"1px solid #aaa",padding:"4px 6px"}}>附属状态</th>
                  </tr>
                  <tr style={{border:"1px solid #aaa"}}>
                    <th style={{border:"1px solid #aaa",padding:"2px 4px"}}>本垣</th><th style={{border:"1px solid #aaa",padding:"2px 4px"}}>曜升</th>
                    <th colSpan={3} style={{border:"1px solid #aaa",padding:"2px 4px"}}>三分</th><th style={{border:"1px solid #aaa",padding:"2px 4px"}}>界</th>
                    <th style={{border:"1px solid #aaa",padding:"2px 4px"}}>十度</th><th style={{border:"1px solid #aaa",padding:"2px 4px"}}>陷</th>
                    <th style={{border:"1px solid #aaa",padding:"2px 4px"}}>落</th><th style={{border:"1px solid #aaa",padding:"2px 4px"}}>分数</th>
                  </tr>
                </thead>
                <tbody>
                  {dignityRows.map((r,i)=><tr key={i} style={{border:"1px solid #aaa"}}>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}><em style={{fontSize:16}}>{planetSymbols[r.code]||r.code}</em></td>
                    <td align="center" colSpan={3} style={{border:"1px solid #aaa",padding:"3px 6px"}}>{r.deg}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{r.house}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{r.guardianHouse}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{r.exaltHouse}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}><em style={{fontSize:14}}>{planetSymbols[r.ruler]||r.ruler}</em>{r.ruler?"+":""}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}><em>{planetSymbols[r.exalt]||r.exalt}</em></td>
                    <td align="center" colSpan={3} style={{border:"1px solid #aaa",padding:"3px 6px"}}><em>{planetSymbols[r.triplicity]||r.triplicity}</em></td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}><em>{planetSymbols[r.term]||r.term}</em></td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}><em>{planetSymbols[r.face]||r.face}</em></td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{r.detriment?<em>{planetSymbols[planetCodes[(Object.keys(RULER).find(k=>(DETRIMENT[r.name]||[]).includes(Math.floor(norm(pData?.[r.name]?.longitude??0)/30)))||"")]]||""}</em>:""}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{r.fall?<em>{planetSymbols[planetCodes[(Object.keys(FALL).find(k=>FALL[k]===Math.floor(norm(pData?.[r.name]?.longitude??0)/30))||"")]]||""}</em>:""}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{r.score}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 4px",fontSize:"10px"}}>{r.state}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 4px",fontSize:"10px"}}>{r.speed}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 4px",fontSize:"10px"}}>{r.sect==="-"?r.orient:r.sect}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>}

            {/* === 黄道状态-2 === */}
            {activeTab==="dignity2-tab"&&chart&&<div className="list_table" style={{display:"flex",gap:16,fontSize:"11px",flexWrap:"wrap"}}>
              <div style={{minWidth:120}}>
                <table style={{borderCollapse:"collapse",width:"100%"}}>
                  <thead><tr style={{border:"1px solid #aaa"}}><th style={{border:"1px solid #aaa",padding:"4px"}}>宫</th><th colSpan={3} style={{border:"1px solid #aaa",padding:"4px"}}>黄经度数</th><th style={{border:"1px solid #aaa",padding:"4px"}}>本垣</th><th style={{border:"1px solid #aaa",padding:"4px"}}>曜升</th><th style={{border:"1px solid #aaa",padding:"4px"}}>宫神星</th></tr></thead>
                  <tbody>{houseRows.map((r,i)=><tr key={i} style={{border:"1px solid #aaa"}}><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}>{r.house}</td><td align="center" colSpan={3} style={{border:"1px solid #aaa",padding:"2px 4px"}}>{r.deg}</td><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}><em style={{fontSize:14}}>{planetSymbols[r.ruler]||r.ruler}</em></td><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}>{r.exalt?<em>{planetSymbols[r.exalt]||r.exalt}</em>:""}</td><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}>{r.almuten?<em>{planetSymbols[r.almuten]||r.almuten}</em>:""}</td></tr>)}</tbody>
                </table>
              </div>
              <div style={{flex:1,minWidth:180}}>
                <div style={{fontWeight:"bold",marginBottom:4}}>特征</div>
                <div style={{fontSize:"11px",lineHeight:1.6}}>此功能需要服务端计算完整接纳/映点/紧要度数数据。</div>
              </div>
              <div style={{minWidth:120}}>
                <div style={{fontWeight:"bold",marginBottom:4}}>阿拉伯点</div>
                <table style={{borderCollapse:"collapse",width:"100%",fontSize:"11px"}}>
                  <thead><tr style={{border:"1px solid #aaa"}}><th style={{border:"1px solid #aaa",padding:"2px 4px"}}>名称</th><th colSpan={3} style={{border:"1px solid #aaa",padding:"2px 4px"}}>度数</th></tr></thead>
                  <tbody>{["福点","精神点","物质点","婚姻点(男)","婚姻点(女)","子女点"].map(p=><tr key={p} style={{border:"1px solid #aaa"}}><td style={{border:"1px solid #aaa",padding:"2px 4px"}}>{p}</td><td align="center" colSpan={3} style={{border:"1px solid #aaa",padding:"2px 4px"}}>—</td></tr>)}</tbody>
                </table>
              </div>
              <div style={{minWidth:120}}>
                <div style={{fontWeight:"bold",marginBottom:4}}>恒星</div>
                <table style={{borderCollapse:"collapse",width:"100%",fontSize:"11px"}}>
                  <thead><tr style={{border:"1px solid #aaa"}}><th style={{border:"1px solid #aaa",padding:"2px 4px"}}>名称</th><th colSpan={3} style={{border:"1px solid #aaa",padding:"2px 4px"}}>度数</th><th style={{border:"1px solid #aaa",padding:"2px 4px"}}>合相</th></tr></thead>
                  <tbody>{["参宿五","五车二","参宿三","五车五","南河三","北落师门","天苑一"].map(s=><tr key={s} style={{border:"1px solid #aaa"}}><td style={{border:"1px solid #aaa",padding:"2px 4px"}}>{s}</td><td align="center" colSpan={3} style={{border:"1px solid #aaa",padding:"2px 4px"}}>—</td><td align="center" style={{border:"1px solid #aaa",padding:"2px 4px"}}>—</td></tr>)}</tbody>
                </table>
              </div>
            </div>}

            {/* === 法达星限 === */}
            {activeTab==="firdaria-tab"&&chart&&<div className="list_table" style={{clear:"both",width:"100%",fontSize:"11px",overflowX:"auto"}}>
              <div style={{fontWeight:"bold",marginBottom:8}}>法达星限</div>
              <table style={{borderCollapse:"collapse"}}>
                <thead><tr style={{border:"1px solid #aaa"}}><th colSpan={18} style={{border:"1px solid #aaa",padding:"4px 6px"}}>法达星限</th></tr></thead>
                <tbody>
                  <tr style={{border:"1px solid #aaa"}}><td colSpan={8} style={{border:"1px solid #aaa",padding:"4px 6px"}}>盘型：{firdaria.isDay?"日生盘（太阳在地平线上）":"夜生盘（太阳在地平线下）"}</td></tr>
                  <tr style={{border:"1px solid #aaa"}}><th style={{border:"1px solid #aaa",padding:"3px 6px"}}>主限</th><th style={{border:"1px solid #aaa",padding:"3px 6px"}}>年数</th><th style={{border:"1px solid #aaa",padding:"3px 6px"}}>主限起</th><th style={{border:"1px solid #aaa",padding:"3px 6px"}}>主限止</th><th style={{border:"1px solid #aaa",padding:"3px 6px"}}>副限</th><th style={{border:"1px solid #aaa",padding:"3px 6px"}}>副限起</th><th style={{border:"1px solid #aaa",padding:"3px 6px"}}>副限止</th></tr>
                  {firdaria.periods.flatMap((r,ri)=>{const code=planetCodes[r.planet]||r.planet;const subs=r.subPeriods.length?r.subPeriods:[{planet:r.planet,start:r.start,end:r.end}];return subs.map((s,si)=><tr key={`${ri}-${si}`} style={{border:"1px solid #aaa"}}>
                    {si===0&&<td rowSpan={subs.length} align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}><em style={{fontSize:16}}>{planetSymbols[code]||code}</em></td>}
                    {si===0&&<td rowSpan={subs.length} align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{r.years}年</td>}
                    {si===0&&<td rowSpan={subs.length} align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{formatFirdariaDate(r.start)}</td>}
                    {si===0&&<td rowSpan={subs.length} align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{formatFirdariaDate(r.end)}</td>}
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}><em>{planetSymbols[planetCodes[s.planet]||s.planet]||s.planet}</em></td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{formatFirdariaDate(s.start)}</td>
                    <td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{formatFirdariaDate(s.end)}</td>
                  </tr>);})}
                </tbody>
              </table>
            </div>}

            {/* === 小限法 === */}
            {activeTab==="profection-tab"&&chart&&<div className="list_table" style={{clear:"both",width:"100%",fontSize:"11px",overflowX:"auto"}}>
              <div style={{fontWeight:"bold",marginBottom:8}}>小限法 (该年生日起限)</div>
              <table style={{borderCollapse:"collapse"}}>
                <thead><tr style={{border:"1px solid #aaa"}}>
                  {["年","宫","主星","年","宫","主星","年","宫","主星","年","宫","主星","年","宫","主星","年","宫","主星"].map((h,i)=><th key={i} style={{border:"1px solid #aaa",padding:"3px 6px"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {Array.from({length:17},(_,row)=>{
                    const cols=[];
                    for(let c=0;c<6;c++){
                      const yr=year+row+c*17;
                      const h=((yr-year)%12)+1;
                      const si=Math.floor(norm(hData?.[h-1]?.longitude??0)/30);
                      const rulerK=Object.keys(RULER).find(k=>(RULER[k]||[]).includes(si));
                      cols.push({yr,h,ruler:rulerK?planetCodes[rulerK]||"":""});
                    }
                    return <tr key={row} style={{border:"1px solid #aaa"}}>
                      {cols.map((c,i)=><Fragment key={i}><td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{c.yr}</td><td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{c.h}</td><td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}><em>{planetSymbols[c.ruler]||c.ruler}</em></td></Fragment>)}
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>}

            {/* === 福点 Aphesis === */}
            {activeTab==="fortune-tab"&&chart&&<div className="list_table" style={{clear:"both",width:"100%",fontSize:"11px",overflowX:"auto"}}>
              <div style={{fontWeight:"bold",marginBottom:8}}>福点 Aphesis</div>
              <table style={{borderCollapse:"collapse"}}>
                <thead><tr style={{border:"1px solid #aaa"}}><th colSpan={18} style={{border:"1px solid #aaa",padding:"4px 6px"}}>福点 Aphesis</th></tr></thead>
                <tbody>
                  {Array.from({length:12},(_,i)=>{const d=new Date(year+i,month-1,day);return<tr key={i} style={{border:"1px solid #aaa"}}><td colSpan={2} align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>—</td><td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{d.toLocaleDateString("zh-CN")}</td><td colSpan={15} style={{border:"1px solid #aaa"}}></td></tr>;})}
                </tbody>
              </table>
            </div>}

            {/* === 精神点 Aphesis === */}
            {activeTab==="spirit-tab"&&chart&&<div className="list_table" style={{clear:"both",width:"100%",fontSize:"11px",overflowX:"auto"}}>
              <div style={{fontWeight:"bold",marginBottom:8}}>精神点 Aphesis</div>
              <table style={{borderCollapse:"collapse"}}>
                <thead><tr style={{border:"1px solid #aaa"}}><th colSpan={18} style={{border:"1px solid #aaa",padding:"4px 6px"}}>精神点 Aphesis</th></tr></thead>
                <tbody>
                  {Array.from({length:12},(_,i)=>{const d=new Date(year+i,month-1,day);return<tr key={i} style={{border:"1px solid #aaa"}}><td colSpan={2} align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>—</td><td align="center" style={{border:"1px solid #aaa",padding:"3px 6px"}}>{d.toLocaleDateString("zh-CN")}</td><td colSpan={15} style={{border:"1px solid #aaa"}}></td></tr>;})}
                </tbody>
              </table>
            </div>}
          </div>}

          {chart&&<div style={{marginTop:10,display:"flex",gap:8}}>
            <button onClick={handleSave} style={{border:"1px solid #aaa",padding:"4px 12px",fontSize:"12px",background:"#eee",cursor:"pointer"}}>储存星图</button>
            <button onClick={handleCopyLink} style={{border:"1px solid #aaa",padding:"4px 12px",fontSize:"12px",background:"#eee",cursor:"pointer"}}>复制链接</button>
            <button onClick={handleExportImage} style={{border:"1px solid #aaa",padding:"4px 12px",fontSize:"12px",background:"#eee",cursor:"pointer"}}>导出图片</button>
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
