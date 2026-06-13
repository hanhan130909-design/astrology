"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProfessionalNatalChart from '@/components/ProfessionalNatalChart';
import { ArrowLeft, Save, Star, Loader2, X, Check, Share2, Copy, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveChartToCloud, loadChartsFromCloud, deleteChartFromCloud, syncLocalChartsToCloud } from '@/lib/chartSync';

// ─── Constants ───
const MONTHS = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const SIGN_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGN_CN = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const PLANET_SYMBOLS: Record<string,string> = {Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇',North_Node:'☊',South_Node:'☋'};
const PLANET_COLORS: Record<string,string> = {Sun:'#d4a017',Moon:'#666',Mercury:'#b8860b',Venus:'#228b22',Mars:'#c00',Jupiter:'#d4a017',Saturn:'#4169e1',Uranus:'#4169e1',Neptune:'#7b68ee',Pluto:'#8b4513',North_Node:'#666',South_Node:'#999'};
const PLANETS_CN: Record<string,string> = {Sun:'太阳',Moon:'月亮',Mercury:'水星',Venus:'金星',Mars:'火星',Jupiter:'木星',Saturn:'土星',Uranus:'天王星',Neptune:'海王星',Pluto:'冥王星',North_Node:'北交',South_Node:'南交'};
const PLANET_ORDER = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','North_Node'];

function norm(v:number){return((v%360)+360)%360;}
function fmt2(n:number){return String(Math.trunc(n)).padStart(2,'0');}

function PlutoGlyph({className=''}:{className?:string}){
  return <svg aria-label="冥王" viewBox="-10 -14 20 28" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
    <circle cx="0" cy="-8.2" r="3.2"/><path d="M -7 -2.2 Q 0 5 7 -2.2"/><path d="M 0 2.8 V 12"/><path d="M -5 8 H 5"/>
  </svg>;
}

// ─── Aspect Grid SVG ───
function AspectGrid({chart}:{chart:any}){
  const bodies=[{k:'Sun',g:'Q'},{k:'Moon',g:'W'},{k:'Mercury',g:'E'},{k:'Venus',g:'R'},{k:'Mars',g:'T'},{k:'Jupiter',g:'Y'},{k:'Saturn',g:'U'},{k:'Uranus',g:'I'},{k:'Neptune',g:'O'},{k:'Pluto',g:'P'},{k:'North_Node',g:'<'},{k:'Ascendant',g:'AC'},{k:'Midheaven',g:'MC'}];
  const map=new Map<string,{mark:string;value:string;color:string}>();
  (chart?.aspects||[]).forEach((a:any)=>{
    const t=a.type||a.aspect;
    const c=t==='Conjunction'?'brown':t==='Sextile'?'#008000':t==='Square'?'red':t==='Trine'?'blue':t==='Opposition'?'red':'#666';
    const m=t==='Conjunction'?'q':t==='Sextile'?'e':t==='Square'?'r':t==='Trine'?'t':t==='Opposition'?'w':'?';
    const orb=Math.abs(a.orb??0);const d=Math.floor(orb);const min=Math.round((orb-d)*60);
    map.set(`${a.planet1}-${a.planet2}`,{mark:m,value:`${d}°${String(min).padStart(2,'0')}′ ${(a.orb??0)>=0?'A':'S'}`,color:c});
    map.set(`${a.planet2}-${a.planet1}`,{mark:m,value:`${d}°${String(min).padStart(2,'0')}′ ${(a.orb??0)>=0?'A':'S'}`,color:c});
  });
  const cellW=34.6,startX=34.6,startY=34.6;
  return <svg viewBox="0 0 450 450" className="w-[400px]">
    {bodies.map((b,ri)=><g key={b.k}>
      <text x={startX+ri*cellW} y={startY-8.6} textAnchor="middle" fontSize="14" fill="#333" fontFamily="Apple Symbols,DejaVu Sans,serif">{b.k==='Pluto'?'P':b.g}</text>
      <rect x={startX+ri*cellW} y={startY} width={cellW} height={450-startY-ri*cellW} fill="none" stroke="grey" strokeWidth="1.5"/>
      <text x={startX/2} y={startY+ri*cellW+cellW/2} textAnchor="middle" fontSize="14" fill="#333" fontFamily="Apple Symbols,DejaVu Sans,serif">{b.k==='Pluto'?'P':b.g}</text>
      <line x1={startX+ri*cellW} x2={0} y1={startY+ri*cellW} y2={startY+ri*cellW} stroke="grey" strokeWidth="1.5"/>
      {bodies.map((cb,ci)=>{
        if(ci>ri)return null;
        const a=map.get(`${b.k}-${cb.k}`);
        const x=startX+ri*cellW,y=startY+ci*cellW;
        return<g key={`${b.k}-${cb.k}`}>
          <rect x={x} y={y} width={cellW} height={cellW} fill="none" stroke="grey" strokeWidth="1"/>
          {a&&<>
            <text x={x+cellW/2} y={y+cellW/2-3} textAnchor="middle" fontSize="13" fontWeight="bold" fill={a.color} fontFamily="Apple Symbols,DejaVu Sans,serif">{a.mark}</text>
            <text x={x+cellW/2} y={y+cellW/2+10} textAnchor="middle" fontSize="6" fill={a.color}>{a.value}</text>
          </>}
          {ci===ri&&!a&&<text x={x+cellW/2} y={y+cellW/2+4} textAnchor="middle" fontSize="16" fill="#333" fontFamily="Apple Symbols,DejaVu Sans,serif">{b.k==='Pluto'?'P':b.g}</text>}
        </g>;
      })}
    </g>)}
  </svg>;
}

// ─── Main ───
export default function NatalPage(){
  const now=new Date();
  const [lang,setLang]=useState<'zh'|'en'|'id'>('zh');
  const [chartType,setChartType]=useState('natal');
  const [name,setName]=useState('');
  const [month,setMonth]=useState(now.getMonth()+1);
  const [day,setDay]=useState(now.getDate());
  const [year,setYear]=useState(now.getFullYear());
  const [hour,setHour]=useState(12);
  const [minute,setMinute]=useState(0);
  const [city,setCity]=useState('台北市');
  const [latDeg,setLatDeg]=useState(25);const [latMin,setLatMin]=useState(3);const [latDir,setLatDir]=useState('N');
  const [lngDeg,setLngDeg]=useState(121);const [lngMin,setLngMin]=useState(30);const [lngDir,setLngDir]=useState('E');
  const [tz,setTz]=useState(8);const [houseSys,setHouseSys]=useState('B');
  const [chart,setChart]=useState<any>(null);const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [activeTab,setActiveTab]=useState('dignity');
  const [saved,setSaved]=useState<any[]>([]);const [saveMsg,setSaveMsg]=useState<string|null>(null);
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const {user,isFirebaseReady}=useAuth();

  const lat=(latDeg+latMin/60)*(latDir==='S'?-1:1);
  const lng=(lngDeg+lngMin/60)*(lngDir==='W'?-1:1);

  useEffect(()=>{
    if(user&&isFirebaseReady)loadChartsFromCloud(user.uid).then(setSaved).catch(()=>{});
    else try{const s=localStorage.getItem('natal_charts');if(s)setSaved(JSON.parse(s));}catch{}
  },[user,isFirebaseReady]);

  const calculate=async()=>{
    if(!lat||!lng){setError('请输入经纬度');return;}
    setLoading(true);setError(null);
    try{
      const body={year,month,day,hour,minute,latitude:lat,longitude:lng,timezone:tz,houseSystem:houseSys};
      const res=await fetch('/api/chart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await res.json();
      if(data.error)throw new Error(data.error);
      setChart(data.data||data);setActiveTab('dignity');
    }catch(e:any){setError(e.message);}finally{setLoading(false);}
  };

  const handleSave=async()=>{
    if(!chart)return;
    const nc:any={name:name||`${year}-${month}-${day}`,birthData:{name,year,month,day,hour,minute,lat,lng,tz,houseSys},chartData:chart,ts:Date.now()};
    if(user&&isFirebaseReady){try{await saveChartToCloud(nc,user.uid);setSaved(await loadChartsFromCloud(user.uid));}catch{const ns=[nc,...saved.slice(0,9)];setSaved(ns);localStorage.setItem('natal_charts',JSON.stringify(ns));}}
    else{const ns=[nc,...saved.slice(0,9)];setSaved(ns);localStorage.setItem('natal_charts',JSON.stringify(ns));}
    setSaveMsg('已储存');setTimeout(()=>setSaveMsg(null),3000);
  };

  const handleDelete=async(ts:number)=>{const ns=saved.filter((c:any)=>c.ts!==ts);setSaved(ns);localStorage.setItem('natal_charts',JSON.stringify(ns));};

  const handleCopyLink=()=>{navigator.clipboard.writeText(window.location.href).then(()=>{setSaveMsg('链接已复制！');setTimeout(()=>setSaveMsg(null),2000);});};
  const handleExportImage=async()=>{
    const el=document.getElementById('chart-export-area');if(!el)return;
    try{const{default:h}=await import('html2canvas');const c=await h(el,{backgroundColor:'#0f0f1a',scale:2});const a=document.createElement('a');a.download=`chart-${year}-${month}-${day}.png`;a.href=c.toDataURL('image/png');a.click();setSaveMsg('已下载');setTimeout(()=>setSaveMsg(null),2000);}catch{}
  };

  const pData=chart?.planets,hData=chart?.houses,aData=chart?.aspects;

  // dignity table
  const dignities=PLANET_ORDER.filter(k=>pData?.[k]).map(k=>{
    const p=pData[k];const lon=norm(p.longitude??0);const si=Math.floor(lon/30);const deg=lon%30;
    const d=norm(deg);const m=Math.round((deg%1)*60);
    let house='-';if(hData)for(let i=0;i<hData.length;i++){const c=norm(hData[i].longitude),n=norm(hData[(i+1)%hData.length].longitude);if(c<=n?lon>=c&&lon<n:lon>=c||lon<n){house=String(hData[i].house);break;}}
    const rules:Record<string,number[]>={Sun:[4],Moon:[3],Mercury:[2,5],Venus:[1,6],Mars:[0,7],Jupiter:[8,11],Saturn:[9,10],Uranus:[10],Neptune:[11],Pluto:[7]};
    const ex:Record<string,number>={Sun:0,Moon:1,Mercury:5,Venus:11,Mars:9,Jupiter:3,Saturn:6,Uranus:7,Neptune:4,Pluto:7};
    let dign='中度',score=0;
    if((rules[k]||[]).includes(si)){dign='得令';score=5;}else if(ex[k]===si){dign='曜升';score=4;}
    return[k,`${Math.floor(d)}°${SIGN_SYMBOLS[si]} ${String(m).padStart(2,'0')}′${p.retrograde?' R':''}`,house,dign,String(score)];
  });

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#ccc] font-sans">
      {/* Top nav bar */}
      <div id="cssmenu" className="bg-[#333] text-sm">
        <div className="flex items-center px-4 py-0">
          <span className="text-[#ddd] px-3 py-2">{user?.displayName||'未登入'}</span>
          <Link href="/" className="text-[#ddd] px-3 py-2 hover:bg-[#444]">快速制图</Link>
          <Link href="/" className="text-[#ddd] px-3 py-2 hover:bg-[#444]">宫神星网</Link>
        </div>
      </div>

      <div className="flex">
        {/* Left: Chart + Data */}
        <div className="flex-1 p-4">
          {/* Birth info + Saved */}
          <div className="mb-4">
            {saved.length>0&&<div className="mb-2 flex flex-wrap gap-1.5">
              {saved.map((c:any)=><button key={c.ts} onClick={()=>{const d=c.birthData;setName(d.name||'');setYear(d.year);setMonth(d.month);setDay(d.day);setHour(d.hour);setMinute(d.minute||0);setLatDeg(Math.trunc(Math.abs(d.lat)));setLatMin(Math.round((Math.abs(d.lat)%1)*60));setLatDir(d.lat>=0?'N':'S');setLngDeg(Math.trunc(Math.abs(d.lng)));setLngMin(Math.round((Math.abs(d.lng)%1)*60));setLngDir(d.lng>=0?'E':'W');setTz(d.tz||8);setHouseSys(d.houseSys||'B');setChart(c.chartData);}} className="border border-[#666] px-2 py-0.5 text-xs hover:bg-[#444]">{c.name} <button onClick={(e)=>{e.stopPropagation();handleDelete(c.ts);}} className="ml-1 text-[#999] hover:text-red-400">✕</button></button>)}
            </div>}

            {chart&&<div className="mb-3 text-sm leading-relaxed">
              <strong>{name||'Quick Chart'}</strong><br/>
              {year}-{fmt2(month)}-{fmt2(day)} {hour}:{fmt2(minute)}<br/>
              {city}<br/>{lngDeg} {lngDir} {fmt2(lngMin)}&nbsp;&nbsp;{latDeg} {latDir} {fmt2(latMin)}<br/>
              时区: GMT {tz>=0?'+':''}{tz}.00<br/>回归黄道 阿卡比特制<br/>时主星: ☉
            </div>}

            <div id="aspgrid" className="mb-4"><AspectGrid chart={chart}/></div>
          </div>

          {/* Chart wheel + tabs */}
          {chart&&<>
            <div id="chart-export-area" className="flex justify-center mb-4">
              <ProfessionalNatalChart planets={pData} houses={hData||[]} aspects={aData||[]} ascendant={chart?.ascendant} midheaven={chart?.midheaven} size={500} showDegrees showAspectLines/>
            </div>

            <div className="flex gap-2 mb-4">
              <button onClick={handleSave} className="border border-[#666] px-3 py-1 text-xs hover:bg-[#444]">储存</button>
              <button onClick={handleCopyLink} className="border border-[#666] px-3 py-1 text-xs hover:bg-[#444]">复制链接</button>
              <button onClick={handleExportImage} className="border border-[#666] px-3 py-1 text-xs hover:bg-[#444]">导出图片</button>
              {saveMsg&&<span className="text-green-400 text-xs ml-2">{saveMsg}</span>}
              {error&&<span className="text-red-400 text-xs ml-2">{error}</span>}
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-[#555] mb-2">
              {[{id:'dignity',l:'黄道状态'},{id:'dignity2',l:'黄道状态-2'},{id:'firdaria',l:'法达星限'},{id:'profection',l:'小限法'},{id:'fortune',l:'福点 Aphesis'},{id:'spirit',l:'精神点 Aphesis'}].map(t=>
                <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`px-4 py-1.5 text-xs border border-[#555] border-b-0 rounded-t ${activeTab===t.id?'bg-[#2a2a3e] font-bold text-white':''}`}>{t.l}</button>
              )}
            </div>

            {/* Dignity table */}
            {(activeTab==='dignity'||activeTab==='dignity2')&&
              <table className="w-full border-collapse text-xs border border-[#555]">
                <thead><tr className="bg-[#2a2a3e]">{['星体','黄经度数','落宫','先天黄道状态','分数'].map(h=><th key={h} className="border border-[#555] px-3 py-2 text-left">{h}</th>)}</tr></thead>
                <tbody>{dignities.map((r,i)=><tr key={i} className="hover:bg-[#2a2a3e]">{r.map((c,j)=><td key={j} className="border border-[#555] px-3 py-1.5">{j===0?<span className="font-bold">{c}</span>:c}</td>)}</tr>)}</tbody>
              </table>
            }

            {/* Feature list for dignity2 */}
            {activeTab==='dignity2'&&chart&&
              <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                <div>
                  <div className="font-bold mb-1">宫位</div>
                  <table className="w-full border-collapse border border-[#555]">
                    <thead><tr className="bg-[#2a2a3e]"><th className="border border-[#555] px-2 py-1">宫</th><th className="border border-[#555] px-2 py-1">度数</th></tr></thead>
                    <tbody>{(hData||[]).map((h:any)=>{const si=Math.floor(norm(h.longitude)/30);const d=norm(h.longitude)%30;return<tr key={h.house}><td className="border border-[#555] px-2 py-1">{h.house}</td><td className="border border-[#555] px-2 py-1">{Math.floor(d)}°{SIGN_SYMBOLS[si]} {Math.round((d%1)*60)}′</td></tr>;})}</tbody>
                  </table>
                </div>
                <div>
                  <div className="font-bold mb-1">特徵</div>
                  <div className="space-y-0.5">{(chart?.features||['暂无显著特征']).map((f:string,i:number)=><div key={i} className="py-0.5">{f}</div>)}</div>
                </div>
              </div>
            }

            {['firdaria','profection','fortune','spirit'].includes(activeTab)&&
              <div className="text-center text-sm text-[#888] py-8">此功能开发中</div>
            }
          </>}
        </div>

        {/* Right Sidebar Form */}
        <div className="w-[240px] border-l border-[#555] bg-[#4a4a4a] text-white p-3 min-h-screen shrink-0">
          <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <strong className="text-sm">快速制图</strong>
            <span className="text-lg">{sidebarOpen?'−':'+'}</span>
          </div>
          {sidebarOpen&&<div className="space-y-3">
            <div>
              <label className="text-xs font-bold block mb-0.5">名字:</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full border border-[#888] bg-[#555] text-white px-2 py-1 text-sm"/>
            </div>
            <div>
              <label className="text-xs font-bold block mb-0.5">出生时间:</label>
              <div className="flex flex-wrap gap-1">
                <select value={month} onChange={e=>setMonth(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>
                <select value={day} onChange={e=>setDay(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select>
                <input type="text" value={year} onChange={e=>setYear(parseInt(e.target.value)||now.getFullYear())} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5 w-14"/>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <select value={hour} onChange={e=>setHour(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{h}</option>)}</select>
                <span>:</span>
                <select value={minute} onChange={e=>setMinute(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{String(m).padStart(2,'0')}</option>)}</select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold block mb-0.5">地点:</label>
              <div className="flex gap-1">
                <input type="text" value={city} onChange={e=>setCity(e.target.value)} className="flex-1 border border-[#888] bg-[#555] text-white px-2 py-1 text-sm"/>
                <button onClick={async()=>{try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);const d=await r.json();if(d?.[0]){const la=parseFloat(d[0].lat),lo=parseFloat(d[0].lon);setLatDeg(Math.trunc(Math.abs(la)));setLatMin(Math.round((Math.abs(la)%1)*60));setLatDir(la>=0?'N':'S');setLngDeg(Math.trunc(Math.abs(lo)));setLngMin(Math.round((Math.abs(lo)%1)*60));setLngDir(lo>=0?'E':'W');setTz(Math.round(lo/15));}}catch{}}} className="border border-[#888] bg-[#666] px-2 py-0.5 text-xs hover:bg-[#777]">搜寻</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold block mb-0.5">经度:</label>
              <div className="flex gap-1">
                <input type="text" value={lngDeg} onChange={e=>setLngDeg(parseInt(e.target.value)||0)} className="border border-[#888] bg-[#555] text-white px-1 py-0.5 w-10 text-sm"/>
                <select value={lngDir} onChange={e=>setLngDir(e.target.value)} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{['E','W'].map(d=><option key={d} value={d}>{d}</option>)}</select>
                <input type="text" value={lngMin} onChange={e=>setLngMin(parseInt(e.target.value)||0)} className="border border-[#888] bg-[#555] text-white px-1 py-0.5 w-8 text-sm"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold block mb-0.5">纬度:</label>
              <div className="flex gap-1">
                <input type="text" value={latDeg} onChange={e=>setLatDeg(parseInt(e.target.value)||0)} className="border border-[#888] bg-[#555] text-white px-1 py-0.5 w-10 text-sm"/>
                <select value={latDir} onChange={e=>setLatDir(e.target.value)} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{['N','S'].map(d=><option key={d} value={d}>{d}</option>)}</select>
                <input type="text" value={latMin} onChange={e=>setLatMin(parseInt(e.target.value)||0)} className="border border-[#888] bg-[#555] text-white px-1 py-0.5 w-8 text-sm"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold block mb-0.5">时区:</label>
              <select value={tz} onChange={e=>setTz(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5 w-full">
                {[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12].map(z=><option key={z} value={z}>GMT {z>=0?'+':''}{z}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-0.5">宫位制:</label>
              <select value={houseSys} onChange={e=>setHouseSys(e.target.value)} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5 w-full">
                {[{v:'B',l:'阿卡比特制'},{v:'P',l:'普拉西德制'},{v:'K',l:'Koch制'},{v:'R',l:'苪氏分宫制'},{v:'C',l:'Campanus制'},{v:'E',l:'等宫制'},{v:'W',l:'整宫制'}].map(h=><option key={h.v} value={h.v}>{h.l}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={calculate} disabled={loading} className="flex-1 border border-[#888] bg-[#666] py-1 text-sm hover:bg-[#777] disabled:opacity-50 font-bold">
                {loading?'计算中...':'更新星图'}
              </button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}
