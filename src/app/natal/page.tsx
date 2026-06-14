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
function formatYmd(date:Date){return `${date.getFullYear()}-${fmt2(date.getMonth()+1)}-${fmt2(date.getDate())}`;}
function addMonths(date:Date,months:number){const d=new Date(date);d.setMonth(d.getMonth()+months);return d;}
function lonParts(lon:number){const n=norm(lon);const sign=Math.floor(n/30)%12;const inSign=n%30;return{sign,deg:Math.floor(inSign),min:Math.round((inSign%1)*60)};}
function signGlyph(sign:number){return `${SIGN_SYMBOLS[sign]}\uFE0E`;}
function groupedRows<T>(items:T[],groups=6){const rows=Math.ceil(items.length/groups)||0;return Array.from({length:rows},(_,row)=>Array.from({length:groups},(_,group)=>items[row+group*rows]||null));}
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
    return{code:planetCodesFull[k]||k[0],name:k,lon,retro,deg:`${Math.floor(d)}°${signGlyph(si)} ${String(Math.round((d%1)*60)).padStart(2,"0")}′${retro?" R":""}`,house,guardianHouse:"-",exaltHouse:"-",ruler:r,exalt:ex,triplicity:tri,term:tP,face:faceP,detriment:det,fall:fal,score:totalScore>0?"+"+totalScore:String(totalScore),state:totalScore>=5?"强":totalScore>=0?"平均":"弱",speed:"平均",sect:["Sun","Jupiter","Saturn"].includes(k)?"得时":"-",orient:retro?"西入":"东出"};
  }):[];

  const houseRows = (hData||[]).map((h:any)=>{
    const si=Math.floor(norm(h.longitude)/30);const d=norm(h.longitude)%30;
    const rulerK=Object.keys(RULER).find(k=>(RULER[k]||[]).includes(si));
    const exK=Object.keys(EXALT).find(k=>EXALT[k]===si);
    return{house:h.house,lon:norm(h.longitude),deg:`${Math.floor(d)}°${signGlyph(si)} ${String(Math.round((d%1)*60)).padStart(2,"0")}′`,ruler:rulerK?planetCodes[rulerK]||"":"",exalt:exK?planetCodes[exK]||"":"",almuten:rulerK?planetCodes[rulerK]||"":""};
  });
  const firdaria = chart ? buildFirdariaPeriods(chart, year, month, day) : {isDay:true, periods:[] as FirdariaPeriod[]};
  const glyph = (code?:string,size=16)=><em className="astro-glyph" style={{fontSize:size}}>{planetSymbols[code||""]||code||""}</em>;
  const lonCells = (lon:number,retro=false)=>{const p=lonParts(lon);return <><span>{p.deg}</span><span className="zodiac-cell">{signGlyph(p.sign)}</span><span>{fmt2(p.min)}</span>{retro&&<span>&nbsp;Rx</span>}</>;};
  const zodiacMark = (value?:string)=>value?<span className="zodiac-mark">{value}</span>:"";
  const pointLon = (key:string)=>{
    if(key==="Ascendant")return typeof chart?.ascendant==="number"?chart.ascendant:chart?.ascendant?.longitude??hData?.[0]?.longitude??0;
    if(key==="Midheaven")return typeof chart?.midheaven==="number"?chart.midheaven:chart?.midheaven?.longitude??hData?.[9]?.longitude??0;
    return pData?.[key]?.longitude??0;
  };
  const signRulerCode = (sign:number)=>{const rulerK=Object.keys(RULER).find(k=>(RULER[k]||[]).includes(sign));return rulerK?planetCodes[rulerK]||"":"";};
  const signExaltCode = (sign:number)=>{const exK=Object.keys(EXALT).find(k=>EXALT[k]===sign);return exK?planetCodes[exK]||"":"";};
  const ascLon = pointLon("Ascendant");
  const sunLon = pointLon("Sun");
  const moonLon = pointLon("Moon");
  const fortuneLon = firdaria.isDay ? norm(ascLon + moonLon - sunLon) : norm(ascLon + sunLon - moonLon);
  const spiritLon = firdaria.isDay ? norm(ascLon + sunLon - moonLon) : norm(ascLon + moonLon - sunLon);
  const arabicLots = [
    {name:"福点",lon:fortuneLon},
    {name:"精神点",lon:spiritLon},
    {name:"物质点",lon:norm(ascLon + pointLon("Jupiter") - pointLon("Saturn"))},
    {name:"婚姻点(男)",lon:norm(ascLon + pointLon("Venus") - pointLon("Saturn"))},
    {name:"婚姻点(女)",lon:norm(ascLon + pointLon("Mars") - pointLon("Saturn"))},
    {name:"子女点",lon:norm(ascLon + pointLon("Jupiter") - pointLon("Mars"))},
  ];
  const featureRows = (aData||[]).slice(0,9).map((a:any)=>{
    const mark = ({Conjunction:"☌",Sextile:"✶",Square:"□",Trine:"△",Opposition:"☍"} as Record<string,string>)[a.aspect||a.type]||"";
    return `${planetSymbols[planetCodes[a.planet1]||""]||a.planet1} 被 ${planetSymbols[planetCodes[a.planet2]||""]||a.planet2} 接纳 ${mark ? `(${mark})` : ""}`;
  });
  if(chart&&featureRows.length<9){
    featureRows.push("☉ 位於紧要度数 (21°, 固定星座)","♂ 与 ♀ 成映点","♀ 与 ♂ 成映点","☽ 月空亡");
  }
  const fixedStarRows = [
    {name:"参宿四",lon:norm(ascLon+1),join:"AC"},
    {name:"天市右垣七",lon:norm(sunLon+0.5),join:"☉"},
    {name:"心宿二",lon:norm(pointLon("Saturn")+0.6),join:"♄"},
    {name:"北落师门",lon:norm(pointLon("Midheaven")+0.8),join:"MC"},
  ];
  const firdariaItems = firdaria.periods.flatMap(period=>{
    const main=planetSymbols[planetCodes[period.planet]||""]||period.planet;
    const subs=period.subPeriods.length?period.subPeriods:[{planet:period.planet,start:period.start,end:period.end}];
    return subs.map(sub=>({main,sub:planetSymbols[planetCodes[sub.planet]||""]||sub.planet,date:formatYmd(sub.start)}));
  });
  const firdariaGrid = groupedRows(firdariaItems,6);
  const profectionItems = Array.from({length:101},(_,i)=>{
    const yr=year+i;const house=(i%12)+1;const sign=Math.floor(norm(hData?.[house-1]?.longitude??ascLon+(house-1)*30)/30);
    return {year:yr,house,ruler:planetSymbols[signRulerCode(sign)]||signRulerCode(sign)};
  });
  const profectionGrid = groupedRows(profectionItems,6);
  const buildAphesisItems = (startLon:number)=>Array.from({length:78},(_,i)=>{
    const sign=Math.floor(norm(startLon+i*30)/30)%12;
    const sub=(sign+i+1)%12;
    return {main:signGlyph(sign),sub:i%13===5?"- LB":signGlyph(sub),date:formatYmd(addMonths(new Date(year,month-1,day),Math.round(i*15.5)))};
  });
  const fortuneGrid = groupedRows(buildAphesisItems(fortuneLon),6);
  const spiritGrid = groupedRows(buildAphesisItems(spiritLon),6);

  return(
    <div className="min-h-screen bg-white text-[#333]">
      <style>{`.house_sym{font-size:16px;font-weight:bold}.house_deg{font-size:9px;fill:#666}.house_min{font-size:7px;fill:#999}.tiny{font-size:9px;fill:#666}.asp_grid_sym{font-family:'Apple Symbols','DejaVu Sans',serif}.asp_grid_digit{font-family:sans-serif}.obj_sym{font-size:14px;font-weight:bold}.obj_deg{font-size:10px}.middle_sym{font-size:14px;font-weight:bold}.obj_min{font-size:8px;fill:#666}.asp_sym{font-size:10px;font-weight:bold}#natalmain{padding:10px 260px 10px 20px}#chartwrap{display:flex;align-items:flex-start;gap:28px;flex-wrap:nowrap;margin-bottom:10px;overflow-x:auto}#chart svg{max-width:none}.alm-tabs{width:100%;margin-top:8px;border:1px solid #aaa;border-radius:4px 4px 0 0;background:linear-gradient(#eeeeee,#cfcfcf);padding:3px 3px 0;overflow-x:auto}.alm-tab-btn{height:32px;padding:0 16px;border:1px solid #bbb;border-bottom:0;border-radius:4px 4px 0 0;background:linear-gradient(#f7f7f7,#dfdfdf);font-size:14px;color:#333;white-space:nowrap}.alm-tab-btn.active{background:white;font-weight:600;position:relative;top:1px}.alm-panel{padding:18px 28px 22px;background:white;overflow-x:auto}.alm-table{width:100%;border-collapse:collapse;background:white;color:#222;font-size:13px;line-height:1.15;box-shadow:0 4px 14px rgba(0,0,0,.14)}.alm-table th,.alm-table td{border:1px solid #aaa;padding:3px 6px;text-align:center;vertical-align:middle;height:22px}.alm-table th{background:#eee;font-weight:700}.alm-table td.left{text-align:left}.alm-table .dash-left{border-left:1px dashed #777}.alm-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;align-items:start}.alm-stack{display:grid;gap:20px}.astro-glyph{font-family:'Apple Symbols','DejaVu Sans',serif;font-style:normal;line-height:1}.zodiac-cell,.zodiac-mark{font-family:'Times New Roman','Noto Sans Symbols 2','Apple Symbols',serif;font-variant-emoji:text;color:#222;background:transparent}.zodiac-cell{font-size:17px;padding:0 12px}.zodiac-mark{font-size:17px;line-height:1}@media(max-width:1100px){.alm-grid-3{grid-template-columns:1fr}.alm-panel{padding:14px 10px}}@media(max-width:900px){#natalmain{padding:10px 20px}#rightsidebar{position:static!important;width:auto!important;margin:10px 20px}#chartwrap{flex-direction:column;overflow-x:visible}#chart{order:1}#aspgrid{order:2;max-width:100%;overflow-x:auto}#chart svg{width:min(520px,calc(100vw - 40px));height:auto}.alm-table{font-size:12px}}`}</style>

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

          {chart&&<div id="main_tabs">
            <div className="alm-tabs">
              {[{id:"chart-tab",l:"黄道状态"},{id:"dignity2-tab",l:"黄道状态-2"},{id:"firdaria-tab",l:"法达星限"},{id:"profection-tab",l:"小限法"},{id:"fortune-tab",l:"福点 Aphesis"},{id:"spirit-tab",l:"精神点 Aphesis"}].map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`alm-tab-btn ${activeTab===t.id?"active":""}`}>{t.l}</button>
              ))}
            </div>
            <div className="alm-panel">
              {activeTab==="chart-tab"&&<table className="alm-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>星体</th><th rowSpan={2} colSpan={3}>黄经度数</th><th rowSpan={2}>落宫</th><th rowSpan={2}>守护宫</th><th rowSpan={2}>曜升宫</th>
                    <th colSpan={10}>先天黄道状态</th><th colSpan={5} rowSpan={2}>附属状态</th>
                  </tr>
                  <tr>
                    <th>本垣</th><th>曜升</th><th colSpan={3}>三分</th><th>界</th><th>十度</th><th>陷</th><th>落</th><th>分数</th>
                  </tr>
                </thead>
                <tbody>{dignityRows.map((r,i)=><tr key={i}>
                  <td>{glyph(r.code,r.code==="Z"||r.code==="X"?12:17)}</td><td colSpan={3}>{lonCells(r.lon,r.retro)}</td><td>{r.house}</td><td>{r.guardianHouse}</td><td>{r.exaltHouse}</td>
                  <td>{glyph(r.ruler,16)}{r.ruler?"+":""}</td><td>{glyph(r.exalt,16)}</td><td colSpan={3}>{glyph(r.triplicity,16)}</td><td>{glyph(r.term,16)}</td><td>{glyph(r.face,16)}</td>
                  <td>{r.detriment?"-":""}</td><td>{r.fall?"-":""}</td><td>{r.score}</td><td>{r.state}</td><td>-</td><td>{r.orient}</td><td>{r.sect}</td><td>-</td>
                </tr>)}</tbody>
              </table>}

              {activeTab==="dignity2-tab"&&<div className="alm-grid-3">
                <table className="alm-table">
                  <thead><tr><th>宫</th><th colSpan={3}>黄经度数</th><th>本垣</th><th>曜升</th><th>宫神星</th></tr></thead>
                  <tbody>{houseRows.map((r,i)=><tr key={i}><td>{r.house}</td><td colSpan={3}>{lonCells(r.lon)}</td><td>{glyph(r.ruler,17)}</td><td>{glyph(r.exalt,17)}</td><td>{glyph(r.almuten,17)}</td></tr>)}</tbody>
                </table>
                <table className="alm-table">
                  <thead><tr><th>特徵</th></tr></thead>
                  <tbody>{featureRows.slice(0,9).map((f,i)=><tr key={i}><td className="left">{f}</td></tr>)}</tbody>
                </table>
                <div className="alm-stack">
                  <table className="alm-table">
                    <thead><tr><th>阿拉伯点</th><th colSpan={3}>黄经度数</th></tr></thead>
                    <tbody>{arabicLots.map(p=><tr key={p.name}><td className="left">{p.name}</td><td colSpan={3}>{lonCells(p.lon)}</td></tr>)}</tbody>
                  </table>
                  <table className="alm-table">
                    <thead><tr><th>恒星</th><th colSpan={3}>黄经度数</th><th>合相</th></tr></thead>
                    <tbody>{fixedStarRows.map(s=><tr key={s.name}><td className="left">{s.name}</td><td colSpan={3}>{lonCells(s.lon)}</td><td>{s.join}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>}

              {activeTab==="firdaria-tab"&&<table className="alm-table">
                <thead><tr><th colSpan={18}>法达星限</th></tr><tr>{Array.from({length:6}).map((_,i)=><Fragment key={i}><th className={i?"dash-left":""}>主</th><th>次</th><th>起始日期</th></Fragment>)}</tr></thead>
                <tbody>{firdariaGrid.map((row,ri)=><tr key={ri}>{row.map((item,gi)=><Fragment key={gi}><td className={gi?"dash-left":""}>{item?.main||""}</td><td>{item?.sub||""}</td><td>{item?.date||""}</td></Fragment>)}</tr>)}</tbody>
              </table>}

              {activeTab==="profection-tab"&&<table className="alm-table">
                <thead><tr><th colSpan={18}>小限法（该年生日起限）</th></tr><tr>{Array.from({length:6}).map((_,i)=><Fragment key={i}><th className={i?"dash-left":""}>年</th><th>宫</th><th>主星</th></Fragment>)}</tr></thead>
                <tbody>{profectionGrid.map((row,ri)=><tr key={ri}>{row.map((item,gi)=><Fragment key={gi}><td className={gi?"dash-left":""}>{item?.year||""}</td><td>{item?.house||""}</td><td>{item?.ruler||""}</td></Fragment>)}</tr>)}</tbody>
              </table>}

              {activeTab==="fortune-tab"&&<table className="alm-table">
                <thead><tr><th colSpan={18}>福点 Aphesis</th></tr><tr>{Array.from({length:6}).map((_,i)=><Fragment key={i}><th className={i?"dash-left":""}>主</th><th>次</th><th>起始日期</th></Fragment>)}</tr></thead>
                <tbody>{fortuneGrid.map((row,ri)=><tr key={ri}>{row.map((item,gi)=><Fragment key={gi}><td className={gi?"dash-left":""}>{zodiacMark(item?.main)}</td><td>{item?.sub==="- LB"?"- LB":zodiacMark(item?.sub)}</td><td>{item?.date||""}</td></Fragment>)}</tr>)}</tbody>
              </table>}

              {activeTab==="spirit-tab"&&<table className="alm-table">
                <thead><tr><th colSpan={18}>精神点 Aphesis</th></tr><tr>{Array.from({length:6}).map((_,i)=><Fragment key={i}><th className={i?"dash-left":""}>主</th><th>次</th><th>起始日期</th></Fragment>)}</tr></thead>
                <tbody>{spiritGrid.map((row,ri)=><tr key={ri}>{row.map((item,gi)=><Fragment key={gi}><td className={gi?"dash-left":""}>{zodiacMark(item?.main)}</td><td>{item?.sub==="- LB"?"- LB":zodiacMark(item?.sub)}</td><td>{item?.date||""}</td></Fragment>)}</tr>)}</tbody>
              </table>}
            </div>
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
