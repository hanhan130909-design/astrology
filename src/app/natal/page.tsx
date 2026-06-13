"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProfessionalNatalChart from '@/components/ProfessionalNatalChart';
import { useAuth } from '@/contexts/AuthContext';
import { saveChartToCloud, loadChartsFromCloud, deleteChartFromCloud, syncLocalChartsToCloud } from '@/lib/chartSync';

// ─── Constants ───
const MONTHS_ZH = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const AMPM = ['AM','PM'];
const HOUSE_SYSTEMS = [
  { id:'P', name:{zh:'阿卡比特制 (Porphyry)',en:'Alcabitus (Porphyry)',id:'Alcabitus (Porphyry)'} },
  { id:'R', name:{zh:'雷吉奥蒙塔努斯 (Regiomontanus)',en:'Regiomontanus',id:'Regiomontanus'} },
  { id:'K', name:{zh:'科赫 (Koch)',en:'Koch',id:'Koch'} },
  { id:'C', name:{zh:'坎帕努斯 (Campanus)',en:'Campanus',id:'Campanus'} },
  { id:'E', name:{zh:'等宫制 (Equal)',en:'Equal House',id:'Equal House'} },
  { id:'W', name:{zh:'整宫制 (Whole Sign)',en:'Whole Sign',id:'Whole Sign'} },
];

const T = {
  zh:{siteTitle:'星缘 - 古典占星图在线',quickChart:'快速制图',name:'名字:',birthTime:'出生时间:',place:'地点:',
    search:'搜寻',longitude:'经度:',latitude:'纬度:',timezone:'时区:',houseSys:'分宫制:',
    draw:'绘制星盘',calculating:'计算中...',zodiacState:'黄道状态',zodiacState2:'黄道状态-2',
    firdaria:'法达星限',profections:'小限法',lotFortune:'福点 Aphesis',lotSpirit:'精神点 Aphesis',
    features:'特徵',notes:'笔记',comments:'评注',
    body:'星体',eclDegree:'黄经度数',house:'落宫',rulingHouse:'守护宫',exaltHouse:'曜升宫',
    essentialDignity:'先天黄道状态',subState:'附属状态',score:'分数',
    saved:'已储存',myCharts:'我的({0})'},
  en:{siteTitle:'Starry Fate - Classical Astrology Chart Online',quickChart:'Quick Chart',name:'Name:',birthTime:'Birth Time:',place:'Place:',
    search:'Search',longitude:'Longitude:',latitude:'Latitude:',timezone:'Time Zone:',houseSys:'House System:',
    draw:'Draw Chart',calculating:'Calculating...',zodiacState:'Essential Dignity',zodiacState2:'Essential Dignity-2',
    firdaria:'Firdaria',profections:'Profections',lotFortune:'Lot of Fortune',lotSpirit:'Lot of Spirit',
    features:'Features',notes:'Notes',comments:'Comments',
    body:'Body',eclDegree:'Ecliptic Degree',house:'House',rulingHouse:'Ruling House',exaltHouse:'Exaltation House',
    essentialDignity:'Essential Dignity',subState:'Sub State',score:'Score',
    saved:'Saved',myCharts:'My({0})'},
  id:{siteTitle:'Starry Fate - Bagan Astrologi Klasik Online',quickChart:'Bagan Cepat',name:'Nama:',birthTime:'Waktu Lahir:',place:'Tempat:',
    search:'Cari',longitude:'Bujur:',latitude:'Lintang:',timezone:'Zona Waktu:',houseSys:'Sistem Rumah:',
    draw:'Gambar Bagan',calculating:'Menghitung...',zodiacState:'Status Zodiak',zodiacState2:'Status Zodiak-2',
    firdaria:'Firdaria',profections:'Profections',lotFortune:'Lot of Fortune',lotSpirit:'Lot of Spirit',
    features:'Fitur',notes:'Catatan',comments:'Komentar',
    body:'Badan',eclDegree:'Derajat Ekliptika',house:'Rumah',rulingHouse:'Rumah Penguasa',exaltHouse:'Rumah Keagungan',
    essentialDignity:'Martabat Esensial',subState:'Status Sub',score:'Skor',
    saved:'Tersimpan',myCharts:'Saya({0})'},
};

const SIGN_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGN_CN = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const PLANET_SYMBOLS: Record<string,string> = {Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇',North_Node:'☊',South_Node:'☋'};
const PLANET_COLORS: Record<string,string> = {Sun:'#d4a017',Moon:'#666',Mercury:'#b8860b',Venus:'#228b22',Mars:'#c00',Jupiter:'#d4a017',Saturn:'#556b2f',Uranus:'#4169e1',Neptune:'#7b68ee',Pluto:'#8b4513',North_Node:'#666',South_Node:'#999'};
const PLANETS_CN: Record<string,string> = {Sun:'太阳',Moon:'月亮',Mercury:'水星',Venus:'金星',Mars:'火星',Jupiter:'木星',Saturn:'土星',Uranus:'天王星',Neptune:'海王星',Pluto:'冥王星',North_Node:'北交点',South_Node:'南交点'};
const ASPECT_GLYPHS: Record<string,{mark:string;color:string}> = {Conjunction:{mark:'☌',color:'#8b4513'},Sextile:{mark:'✶',color:'#228b22'},Square:{mark:'□',color:'#c00'},Trine:{mark:'△',color:'#228b22'},Opposition:{mark:'☍',color:'#c00'}};
const PLANET_ORDER = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','North_Node','South_Node'];
const TABLE_BODIES = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];

// ─── Helpers ───
function normalize(v:number){return((v%360)+360)%360;}
function fmt2(n:number){return String(Math.trunc(n)).padStart(2,'0');}
function pad(n:number,w:number=2){return String(Math.trunc(n)).padStart(w,'0');}

function findHouse(lon:number,houses:any[]):string{
  if(!houses.length)return'-';
  const l=normalize(lon);
  for(let i=0;i<houses.length;i++){
    const c=normalize(houses[i].longitude),n=normalize(houses[(i+1)%houses.length].longitude);
    if(c<=n?l>=c&&l<n:l>=c||l<n)return String(houses[i].house);
  }
  return'-';
}

function computeDignity(planetKey:string,signIdx:number):{label:string;score:number}{
  const rulership:Record<string,number[]>={Sun:[4],Moon:[3],Mercury:[2,5],Venus:[1,6],Mars:[0,7],Jupiter:[8,11],Saturn:[9,10],Uranus:[10],Neptune:[11],Pluto:[7]};
  const detriment:Record<string,number[]>={Sun:[10],Moon:[9],Mercury:[8,11],Venus:[0,7],Mars:[1,6],Jupiter:[2,5],Saturn:[3,4]};
  const exaltation:Record<string,number>={Sun:0,Moon:1,Mercury:5,Venus:11,Mars:9,Jupiter:3,Saturn:6,Uranus:7,Neptune:4,Pluto:7};
  const fall:Record<string,number>={Sun:6,Moon:7,Mercury:11,Venus:5,Mars:3,Jupiter:9,Saturn:0};
  const rules=rulership[planetKey]||[],dets=detriment[planetKey]||[];
  if(rules.includes(signIdx))return{label:'得令',score:5};
  if(exaltation[planetKey]===signIdx)return{label:'曜升',score:4};
  if(dets.includes(signIdx))return{label:'弱',score:-3};
  if(fall[planetKey]===signIdx)return{label:'落陷',score:-4};
  const fireS=[0,4,8],earthS=[1,5,9],airS=[2,6,10],waterS=[3,7,11];
  const triplicity:Record<string,number[]>={Sun:fireS,Moon:earthS,Mercury:airS,Venus:earthS,Mars:waterS,Jupiter:fireS,Saturn:airS,Uranus:airS,Neptune:waterS,Pluto:waterS};
  if((triplicity[planetKey]||[]).includes(signIdx))return{label:'三分',score:2};
  return{label:'中度',score:0};
}

function computeFeatures(chart:any):string[]{
  const features:string[]=[];
  const planets=chart?.planets||{},aspects=chart?.aspects||[];
  const PLANET_RULERS:Record<string,string[]>={Aries:['Mars'],Taurus:['Venus'],Gemini:['Mercury'],Cancer:['Moon'],Leo:['Sun'],Virgo:['Mercury'],Libra:['Venus'],Scorpio:['Mars','Pluto'],Sagittarius:['Jupiter'],Capricorn:['Saturn'],Aquarius:['Saturn','Uranus'],Pisces:['Jupiter','Neptune']};
  for(const[key,p]of Object.entries(planets)){
    if(!p||(p as any).longitude==null)continue;
    const lon=normalize((p as any).longitude);
    const signIdx=Math.floor(lon/30);
    const signName=SIGN_NAMES[signIdx];
    const signRulers=PLANET_RULERS[signName]||[];
    for(const ruler of signRulers){
      if(ruler===key)continue;
      const rulerP=planets[ruler];if(!rulerP)continue;
      for(const asp of aspects||[]){
        if((asp.planet1===key&&asp.planet2===ruler)||(asp.planet1===ruler&&asp.planet2===key)){
          const symbol=PLANET_RULERS[signName].length>1&&ruler===PLANET_RULERS[signName][0]?'本垣':'曜升';
          const label=`${PLANET_SYMBOLS[key]||key} 被 ${PLANET_SYMBOLS[ruler]||ruler} 接纳 (${symbol})`;
          if(!features.includes(label))features.push(label);
        }
      }
    }
  }
  const criticalDegrees:Record<string,number[]>={cardinal:[0,13,26],fixed:[9,21],mutable:[4,17]};
  const signModes:Record<number,string>={};[0,4,8].forEach(i=>{signModes[i]='cardinal';signModes[i+1]='fixed';signModes[i+2]='mutable';signModes[i+3]='cardinal';});
  for(const[key,p]of Object.entries(planets)){
    if(!p||key==='North_Node'||key==='South_Node')continue;
    const lon=normalize((p as any).longitude??0);
    const signIdx=Math.floor(lon/30);const deg=lon%30;
    const mode=signModes[signIdx];const crits=criticalDegrees[mode]||[];
    const rounded=Math.round(deg);
    for(const c of crits){if(Math.abs(rounded-c)<=1){const modeCN=mode==='cardinal'?'开创':mode==='fixed'?'固定':'变动';features.push(`${PLANET_SYMBOLS[key]||key} 位于紧要度数 (${rounded}°, ${modeCN}星座)`);}}
  }
  return features.length>0?features:['暂无显著特征'];
}

// ─── Sub-components ───
function Select({value,onChange,options,className=''}:{value:any;onChange:(v:any)=>void;options:{label:string;value:any}[];className?:string}){
  return <select value={value} onChange={e=>onChange(e.target.value)} className={`border border-[#999] bg-white text-sm px-1 py-0 ${className}`}>
    {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
  </select>;
}

function PlutoGlyph({className=''}:{className?:string}){
  return <svg aria-label="冥王" viewBox="-10 -14 20 28" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
    <circle cx="0" cy="-8.2" r="3.2"/><path d="M -7 -2.2 Q 0 5 7 -2.2"/><path d="M 0 2.8 V 12"/><path d="M -5 8 H 5"/>
  </svg>;
}

// ─── Aspect Keyboard Grid ───
function AspectGrid({chart}:{chart:any}){
  const bodies=[{k:'Sun',g:'☉'},{k:'Moon',g:'☽'},{k:'Mercury',g:'☿'},{k:'Venus',g:'♀'},{k:'Mars',g:'♂'},{k:'Jupiter',g:'♃'},{k:'Saturn',g:'♄'},{k:'Uranus',g:'♅'},{k:'Neptune',g:'♆'},{k:'Pluto',g:'♇'},{k:'North_Node',g:'☊'},{k:'Ascendant',g:'AC'},{k:'Midheaven',g:'MC'}];
  const aspectMap=new Map<string,{mark:string;value:string;color:string}>();
  (chart?.aspects||[]).forEach((a:any)=>{
    const s=ASPECT_GLYPHS[a.aspect||a.type];if(!s||!a.planet1||!a.planet2)return;
    const orb=Math.abs(a.orb??0);const deg=Math.floor(orb);const min=Math.round((orb-deg)*60);
    const cell={...s,value:`${deg}°${String(min).padStart(2,'0')}′ ${(a.orb??0)>=0?'A':'S'}`};
    aspectMap.set(`${a.planet1}-${a.planet2}`,cell);aspectMap.set(`${a.planet2}-${a.planet1}`,cell);
  });
  return (
    <table className="border-collapse text-center leading-none" style={{fontSize:'11px'}}>
      <tbody>
        {bodies.map((b,ri)=><tr key={b.k}>
          <th className="h-[28px] w-[24px] pr-1 text-center font-normal text-black" style={{fontSize:'20px'}}>
            <span className="inline-flex items-center justify-center">{b.k==='Pluto'?<PlutoGlyph className="h-[18px] w-[13px]"/>:b.k==='Ascendant'||b.k==='Midheaven'?<span style={{fontSize:'9px'}}>{b.k==='Ascendant'?'AC':'MC'}</span>:b.g}</span>
          </th>
          {bodies.map((cb,ci)=>{
            if(ci>ri)return<td key={`${b.k}-${cb.k}`} className="h-[28px] w-[28px] p-0"/>;
            const a=aspectMap.get(`${b.k}-${cb.k}`);
            return <td key={`${b.k}-${cb.k}`} className="relative h-[28px] w-[28px] overflow-hidden border border-[#999] bg-[#fbfbfb] p-0 align-middle" style={{fontSize:'9px'}}>
              {a?<div className="absolute inset-[1px] flex flex-col items-center justify-center overflow-hidden">
                <span className="block h-[13px] max-w-full font-bold leading-[13px]" style={{fontSize:'13px',color:a.color}}>{a.mark}</span>
                <span className="block max-w-full whitespace-nowrap leading-[8px]" style={{fontSize:'6px',color:a.color}}>{a.value}</span>
              </div>:ci===ri?<span className="absolute inset-0 flex items-center justify-center overflow-hidden text-black" style={{fontSize:'15px'}}>{b.k==='Pluto'?<PlutoGlyph className="h-[16px] w-[11px]"/>:b.k==='Ascendant'||b.k==='Midheaven'?<span style={{fontSize:'8px'}}>{b.k==='Ascendant'?'AC':'MC'}</span>:b.g}</span>:''}
            </td>;
          })}
        </tr>)}
      </tbody>
    </table>
  );
}

// ─── Main Page ───
export default function NatalPage(){
  const [lang,setLang]=useState<'zh'|'en'|'id'>('zh');
  const t=T[lang];
  const now=new Date();

  // Form state — almuten-style: month/day as dropdowns, year as text, hour=12h+AM/PM, min as dropdown
  const [name,setName]=useState('');
  const [month,setMonth]=useState(now.getMonth()+1);
  const [day,setDay]=useState(now.getDate());
  const [year,setYear]=useState(now.getFullYear());
  const [hour12,setHour12]=useState(12);
  const [ampm,setAmpm]=useState('PM');
  const [minute,setMinute]=useState(0);
  const [city,setCity]=useState('');
  const [latDeg,setLatDeg]=useState(25);
  const [latMin,setLatMin]=useState(3);
  const [latDir,setLatDir]=useState('N');
  const [lngDeg,setLngDeg]=useState(121);
  const [lngMin,setLngMin]=useState(30);
  const [lngDir,setLngDir]=useState('E');
  const [tz,setTz]=useState(8);
  const [houseSys,setHouseSys]=useState('P');
  const [chart,setChart]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [activeTab,setActiveTab]=useState('dignity');
  const [saved,setSaved]=useState<any[]>([]);
  const [saveMsg,setSaveMsg]=useState<string|null>(null);
  const [showSaved,setShowSaved]=useState(false);
  const {user, isFirebaseReady}=useAuth();

  // Derive 24h hour and decimal lat/lng
  const hour24 = (hour12%12)+(ampm==='AM'?0:12);
  const lat = (latDeg+latMin/60)*(latDir==='S'?-1:1);
  const lng = (lngDeg+lngMin/60)*(lngDir==='W'?-1:1);

  useEffect(()=>{
    if(user&&isFirebaseReady)loadChartsFromCloud(user.uid).then(setSaved).catch(()=>{});
    else try{const s=localStorage.getItem('natal_charts');if(s)setSaved(JSON.parse(s));}catch{}
  },[user,isFirebaseReady]);

  useEffect(()=>{
    if(user&&isFirebaseReady)syncLocalChartsToCloud(user.uid).then(()=>loadChartsFromCloud(user.uid)).then(setSaved).catch(()=>{});
  },[user,isFirebaseReady]);

  const calculate=async()=>{
    if(!lat||!lng){setError('请输入经纬度');return;}
    setLoading(true);setError(null);
    try{
      const body={year,month,day,hour:hour24,minute,latitude:lat,longitude:lng,timezone:tz,houseSystem:houseSys};
      const res=await fetch('/api/chart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await res.json();
      if(data.error)throw new Error(data.error);
      setChart(data.data||data);
      setShowSaved(false);
    }catch(e:any){setError(e.message);}finally{setLoading(false);}
  };

  const handleSave=async()=>{
    if(!chart)return;
    const nc:any={name:name||`${year}-${month}-${day}`,birthData:{name,year,month,day,hour:hour24,minute,lat,lng,tz,houseSys},chartData:chart,ts:Date.now()};
    if(user&&isFirebaseReady){try{await saveChartToCloud(nc,user.uid);setSaved(await loadChartsFromCloud(user.uid));}catch{const ns=[nc,...saved.slice(0,9)];setSaved(ns);localStorage.setItem('natal_charts',JSON.stringify(ns));}}
    else{const ns=[nc,...saved.slice(0,9)];setSaved(ns);localStorage.setItem('natal_charts',JSON.stringify(ns));}
    setSaveMsg(t.saved);setTimeout(()=>setSaveMsg(null),3000);
  };

  const handleDelete=async(ts:number)=>{
    if(user&&isFirebaseReady)try{await deleteChartFromCloud(String(ts),user.uid);setSaved(await loadChartsFromCloud(user.uid));}catch{}
    const ns=saved.filter((c:any)=>c.ts!==ts);setSaved(ns);localStorage.setItem('natal_charts',JSON.stringify(ns));
  };

  const loadChart=(c:any)=>{const d=c.birthData;setName(d.name||'');setYear(d.year);setMonth(d.month);setDay(d.day);
    const h=d.hour;setHour12(h%12||12);setAmpm(h>=12?'PM':'AM');setMinute(d.minute||0);
    setLatDeg(Math.trunc(Math.abs(d.lat)));setLatMin(Math.round((Math.abs(d.lat)%1)*60));setLatDir(d.lat>=0?'N':'S');
    setLngDeg(Math.trunc(Math.abs(d.lng)));setLngMin(Math.round((Math.abs(d.lng)%1)*60));setLngDir(d.lng>=0?'E':'W');
    setTz(d.tz||8);setHouseSys(d.houseSys||'P');setChart(c.chartData);setShowSaved(false);};

  const pData=chart?.planets,hData=chart?.houses,aData=chart?.aspects;
  const birthInfo=chart?{date:`${year}-${fmt2(month)}-${fmt2(day)} ${hour12} ${ampm}:${pad(minute)}`,lat,lng,tz,houseSys}:null;

  const monthNames=lang==='zh'?MONTHS_ZH:lang==='id'?MONTHS_ID:MONTHS_EN;
  const days=Array.from({length:31},(_,i)=>i+1);
  const hours12=Array.from({length:12},(_,i)=>i+1);
  const minutes=Array.from({length:60},(_,i)=>i);
  const tzOptions=[-12,-11,-10,-9.5,-9,-8,-7,-6,-5,-4,-3.5,-3,-2,-1,0,1,2,3,3.5,4,4.5,5,5.5,5.75,6,6.5,7,8,8.75,9,9.5,10,10.5,11,12,13,14];

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans">
      {/* Header */}
      <div className="border-b border-[#ccc] px-2 py-1 flex items-center justify-between bg-white text-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-normal">{t.siteTitle}</h1>
          <Link href="/" className="text-[#666] hover:text-[#333] text-xs no-underline">返回首页</Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#666]">{user.displayName||user.email||'用户'}</span>
              <button onClick={()=>{}} className="text-xs text-[#999] hover:text-[#666]">登出</button>
            </div>
          ) : (
            <Link href="/login" className="text-[#666] text-xs">已经有帐号？登入</Link>
          )}
          {(['zh','en','id']as const).map(l=><button key={l} onClick={()=>setLang(l)} className={`text-xs ${lang===l?'font-bold text-[#333]':'text-[#888]'}`}>{l==='zh'?'简体中文':l==='en'?'English':'Indonesia'}</button>)}
          <button onClick={()=>setShowSaved(!showSaved)} className="text-xs text-[#666]">{t.myCharts.replace('{0}',String(saved.length))}</button>
        </div>
      </div>

      {/* Saved Charts */}
      {showSaved&&(
        <div className="border-b border-[#ddd] bg-[#fafafa] px-2 py-2">
          <div className="flex flex-wrap gap-2">
            {saved.length===0?<span className="text-xs text-[#999]">暂无</span>:
              saved.map((c:any)=><div key={c.ts} className="flex items-center gap-1 border border-[#ccc] bg-white px-2 py-1 text-xs">
                <button onClick={()=>loadChart(c)} className="hover:underline">{c.name}</button>
                <button onClick={()=>handleDelete(c.ts)} className="text-[#bbb] hover:text-red-500 ml-1">✕</button>
              </div>)
            }
          </div>
        </div>
      )}

      {/* Form */}
      <div className="border-b border-[#ccc] px-2 py-2 bg-white">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-bold">{t.quickChart}</span>
          <span className="text-[#888]">|</span>
          <label>{t.name}</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} className="border border-[#999] bg-white text-sm px-1 py-0 w-[120px]"/>
          <span className="text-[#888]">|</span>
          <label>{t.birthTime}</label>
          <Select value={month} onChange={(v:any)=>setMonth(Number(v))} options={monthNames.map((m,i)=>({label:m,value:i+1}))}/>
          <Select value={day} onChange={(v:any)=>setDay(Number(v))} options={days.map(d=>({label:String(d),value:d}))}/>
          <input type="text" value={year} onChange={e=>setYear(parseInt(e.target.value)||now.getFullYear())} className="border border-[#999] bg-white text-sm px-1 py-0 w-[50px]"/>
          <Select value={hour12} onChange={(v:any)=>setHour12(Number(v))} options={hours12.map(h=>({label:String(h),value:h}))}/>
          <Select value={ampm} onChange={setAmpm} options={AMPM.map(a=>({label:a,value:a}))}/>
          <span>:</span>
          <Select value={minute} onChange={(v:any)=>setMinute(Number(v))} options={minutes.map(m=>({label:pad(m),value:m}))}/>
          <span className="text-[#888]">|</span>
          <label>{t.place}</label>
          <input type="text" value={city} onChange={e=>setCity(e.target.value)} placeholder="城市名" className="border border-[#999] bg-white text-sm px-1 py-0 w-[100px]"/>
          <button onClick={async()=>{
            if(!city.trim())return;
            try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
              const d=await r.json();if(d&&d[0]){const la=parseFloat(d[0].lat),lo=parseFloat(d[0].lon);
                setLatDeg(Math.trunc(Math.abs(la)));setLatMin(Math.round((Math.abs(la)%1)*60));setLatDir(la>=0?'N':'S');
                setLngDeg(Math.trunc(Math.abs(lo)));setLngMin(Math.round((Math.abs(lo)%1)*60));setLngDir(lo>=0?'E':'W');
                setTz(Math.round(lo/15));}
            }catch{}
          }} className="border border-[#999] bg-[#eee] px-2 py-0 text-xs hover:bg-[#ddd]">{t.search}</button>
          <span className="text-[#888]">|</span>
          <label>{t.longitude}</label>
          <input type="text" value={lngDeg} onChange={e=>setLngDeg(parseInt(e.target.value)||0)} className="border border-[#999] bg-white text-sm px-1 py-0 w-[40px]"/>
          <Select value={lngDir} onChange={setLngDir} options={[{label:'E',value:'E'},{label:'W',value:'W'}]}/>
          <input type="text" value={lngMin} onChange={e=>setLngMin(parseInt(e.target.value)||0)} className="border border-[#999] bg-white text-sm px-1 py-0 w-[35px]"/>
          <span className="text-[#888]">|</span>
          <label>{t.latitude}</label>
          <input type="text" value={latDeg} onChange={e=>setLatDeg(parseInt(e.target.value)||0)} className="border border-[#999] bg-white text-sm px-1 py-0 w-[40px]"/>
          <Select value={latDir} onChange={setLatDir} options={[{label:'N',value:'N'},{label:'S',value:'S'}]}/>
          <input type="text" value={latMin} onChange={e=>setLatMin(parseInt(e.target.value)||0)} className="border border-[#999] bg-white text-sm px-1 py-0 w-[35px]"/>
          <span className="text-[#888]">|</span>
          <label>{t.timezone}</label>
          <Select value={tz} onChange={(v:any)=>setTz(Number(v))} options={tzOptions.map(z=>({label:`GMT ${z>=0?'+':''}${z}`,value:z}))}/>
          <span className="text-[#888]">|</span>
          <label>{t.houseSys}</label>
          <Select value={houseSys} onChange={setHouseSys} options={HOUSE_SYSTEMS.map(h=>({label:h.name[lang]||h.name.zh,value:h.id}))}/>
          <button onClick={calculate} disabled={loading} className="border border-[#999] bg-[#e8e8e8] px-3 py-0 text-sm hover:bg-[#ddd] disabled:opacity-50 font-bold ml-2">
            {loading?t.calculating:t.draw}
          </button>
          {error&&<span className="text-red-600 text-xs ml-2">{error}</span>}
          {saveMsg&&<span className="text-green-600 text-xs ml-2">{saveMsg}</span>}
        </div>
      </div>

      {/* Chart Result */}
      {chart&&(
        <div className="px-2 py-2">
          {/* Birth info + two charts */}
          <div className="flex gap-6">
            {/* Left: birth info + aspect grid */}
            <div>
              <div className="text-sm mb-3 leading-relaxed">
                <strong>{name||'Quick Chart'}</strong><br/>
                {year}-{fmt2(month)}-{fmt2(day)} {hour12} {ampm}:{pad(minute)}<br/>
                {city||`${latDeg}${latDir} ${lngDeg}${lngDir}`}<br/>
                {lngDeg} {lngDir} {pad(lngMin)} {latDeg} {latDir} {pad(latMin)}<br/>
                时区: GMT {tz>=0?'+':''}{tz}.00<br/>
                回归黄道 {HOUSE_SYSTEMS.find(h=>h.id===houseSys)?.name[lang]||'阿卡比特制'}<br/>
                时主星: ☉
              </div>
              <AspectGrid chart={chart}/>
            </div>

            {/* Right: Chart wheel */}
            <div className="flex justify-center">
              <ProfessionalNatalChart planets={pData} houses={hData||[]} aspects={aData||[]} ascendant={chart?.ascendant} midheaven={chart?.midheaven} size={500} showDegrees showAspectLines/>
            </div>
          </div>

          {/* Tab panel */}
          <div className="mt-4">
            <div className="flex border-b border-[#aaa]">
              {[
                {id:'dignity',label:t.zodiacState},{id:'dignity2',label:t.zodiacState2},
                {id:'firdaria',label:t.firdaria},{id:'profections',label:t.profections},
                {id:'lotFortune',label:t.lotFortune},{id:'lotSpirit',label:t.lotSpirit},
              ].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                  className={`px-4 py-1.5 text-sm border border-[#aaa] border-b-0 rounded-t ${activeTab===tab.id?'bg-white font-bold':''} ${tab.id==='dignity'?'-mr-px':'-ml-px'}`}
                >{tab.label}</button>
              ))}
              <div className="flex-1 border-b border-[#aaa]"/>
              {/* Save + Feature panel */}
              <div className="flex items-center gap-2 ml-auto pb-1">
                <button onClick={handleSave} className="text-xs text-[#666] border border-[#ccc] px-2 py-0.5 hover:bg-[#f5f5f5]">储存</button>
                <span className="text-[#888] text-xs">|</span>
                {[{id:'features',label:t.features},{id:'notes',label:t.notes},{id:'comments',label:t.comments}].map(ft=>(
                  <button key={ft.id} onClick={()=>setActiveTab(ft.id)}
                    className={`text-xs px-2 py-0.5 border border-[#aaa] ${activeTab===ft.id?'bg-white font-bold':''}`}
                  >{ft.label}</button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="border border-[#aaa] border-t-0 bg-white p-3">
              {(activeTab==='dignity'||activeTab==='dignity2')&&(
                <table className="w-full border-collapse text-center text-sm">
                  <thead>
                    <tr>{[t.body,t.eclDegree,t.house,t.rulingHouse,t.exaltHouse,t.essentialDignity,t.subState,t.score].map(h=><th key={h} className="border border-[#aaa] bg-[#eee] px-3 py-2 font-bold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {TABLE_BODIES.map(key=>{
                      const p=pData?.[key];if(!p)return null;
                      const lon=normalize(p.longitude??0);const si=Math.floor(lon/30);
                      const deg=lon%30;const house=findHouse(lon,hData||[]);
                      const d=computeDignity(key,si);
                      return <tr key={key}>
                        <td className="border border-[#aaa] px-3 py-1.5 font-bold">{key==='Pluto'?<PlutoGlyph className="mx-auto h-[16px] w-[11px]"/>:PLANET_SYMBOLS[key]}</td>
                        <td className="border border-[#aaa] px-3 py-1.5">{Math.floor(deg)}°{String(Math.round((deg%1)*60)).padStart(2,'0')}′ {SIGN_SYMBOLS[si]}{p.retrograde?' R':''}</td>
                        <td className="border border-[#aaa] px-3 py-1.5">{house}</td>
                        <td className="border border-[#aaa] px-3 py-1.5">{house}</td>
                        <td className="border border-[#aaa] px-3 py-1.5">-</td>
                        <td className="border border-[#aaa] px-3 py-1.5">{d.label}</td>
                        <td className="border border-[#aaa] px-3 py-1.5">{SIGN_CN[si]?.replace('座','')||'-'}</td>
                        <td className="border border-[#aaa] px-3 py-1.5 font-bold">{d.score}</td>
                      </tr>;
                    })}
                  </tbody>
                </table>
              )}
              {activeTab==='features'&&(
                <div className="text-sm">
                  {computeFeatures(chart).map((f,i)=><div key={i} className="py-0.5 border-b border-[#eee] last:border-0">{f}</div>)}
                </div>
              )}
              {['firdaria','profections','lotFortune','lotSpirit','notes','comments'].includes(activeTab)&&(
                <div className="text-sm text-[#999] py-4 text-center">此功能开发中</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
