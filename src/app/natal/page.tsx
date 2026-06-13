"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfessionalNatalChart from '@/components/ProfessionalNatalChart';
import { Save, Copy, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveChartToCloud, loadChartsFromCloud } from '@/lib/chartSync';

const MONTHS=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const SIGN_SYMBOLS=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const PLANET_ORDER=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','North_Node'];

function norm(v:number){return((v%360)+360)%360;}
function fmt2(n:number){return String(Math.trunc(n)).padStart(2,'0');}

export default function NatalPage(){
  const now=new Date();
  const[name,setName]=useState('');const[month,setMonth]=useState(now.getMonth()+1);
  const[day,setDay]=useState(now.getDate());const[year,setYear]=useState(now.getFullYear());
  const[hour,setHour]=useState(12);const[minute,setMinute]=useState(0);
  const[city,setCity]=useState('台北市');
  const[latDeg,setLatDeg]=useState(25);const[latMin,setLatMin]=useState(3);const[latDir,setLatDir]=useState('N');
  const[lngDeg,setLngDeg]=useState(121);const[lngMin,setLngMin]=useState(30);const[lngDir,setLngDir]=useState('E');
  const[tz,setTz]=useState(8);const[houseSys,setHouseSys]=useState('B');
  const[chart,setChart]=useState<any>(null);const[loading,setLoading]=useState(false);
  const[error,setError]=useState<string|null>(null);
  const[activeTab,setActiveTab]=useState('dignity');
  const[saved,setSaved]=useState<any[]>([]);const[saveMsg,setSaveMsg]=useState<string|null>(null);
  const[sidebarOpen,setSidebarOpen]=useState(true);
  const{user}=useAuth();

  const lat=(latDeg+latMin/60)*(latDir==='S'?-1:1);
  const lng=(lngDeg+lngMin/60)*(lngDir==='W'?-1:1);

  useEffect(()=>{try{const s=localStorage.getItem('natal_charts');if(s)setSaved(JSON.parse(s));}catch{}},[]);

  const calculate=async()=>{
    setLoading(true);setError(null);
    try{const b={year,month,day,hour,minute,latitude:lat,longitude:lng,timezone:tz,houseSystem:houseSys};
    const r=await fetch('/api/chart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
    const d=await r.json();if(d.error)throw new Error(d.error);setChart(d.data||d);setActiveTab('dignity');}
    catch(e:any){setError(e.message);}finally{setLoading(false);}
  };

  const handleSave=async()=>{
    if(!chart)return;
    const nc:any={name:name||`${year}-${month}-${day}`,birthData:{name,year,month,day,hour,minute,lat,lng,tz,houseSys},chartData:chart,ts:Date.now()};
    const ns=[nc,...saved.slice(0,9)];setSaved(ns);localStorage.setItem('natal_charts',JSON.stringify(ns));
    setSaveMsg('已储存');setTimeout(()=>setSaveMsg(null),3000);
  };
  const handleCopy=()=>{navigator.clipboard.writeText(window.location.href).then(()=>{setSaveMsg('已复制');setTimeout(()=>setSaveMsg(null),2000);});};
  const handleExport=async()=>{
    const el=document.getElementById('chart-area');if(!el)return;
    try{const{default:h}=await import('html2canvas');const c=await h(el,{backgroundColor:'#0f0f1a',scale:2});
    const a=document.createElement('a');a.download=`chart-${year}-${month}-${day}.png`;a.href=c.toDataURL();a.click();setSaveMsg('已下载');setTimeout(()=>setSaveMsg(null),2000);}catch{}
  };

  const pData=chart?.planets,hData=chart?.houses,aData=chart?.aspects;

  return(
    <div className="min-h-screen bg-white text-[#333] font-sans">
      {/* Top nav */}
      <div className="bg-[#333] text-sm flex items-center px-4 py-0">
        <span className="text-[#ccc] px-3 py-1.5">{user?.displayName||'未登入'}</span>
        <Link href="/" className="text-[#ccc] px-3 py-1.5 hover:bg-[#444]">快速制图</Link>
        <Link href="/" className="text-[#ccc] px-3 py-1.5 hover:bg-[#444]">宫神星网</Link>
      </div>

      <div className="flex">
        {/* Left: Chart + Data */}
        <div className="flex-1 p-4 min-w-0">
          {/* Saved */}
          {saved.length>0&&<div className="mb-2 flex flex-wrap gap-1">{saved.map((c:any)=><button key={c.ts} onClick={()=>{const d=c.birthData;setName(d.name||'');setYear(d.year);setMonth(d.month);setDay(d.day);setHour(d.hour);setMinute(d.minute||0);setLatDeg(Math.trunc(Math.abs(d.lat)));setLatMin(Math.round((Math.abs(d.lat)%1)*60));setLatDir(d.lat>=0?'N':'S');setLngDeg(Math.trunc(Math.abs(d.lng)));setLngMin(Math.round((Math.abs(d.lng)%1)*60));setLngDir(d.lng>=0?'E':'W');setTz(d.tz||8);setHouseSys(d.houseSys||'B');setChart(c.chartData);}} className="border border-[#ccc] px-2 py-0.5 text-xs hover:bg-[#eee]">{c.name}</button>)}</div>}

          {/* Birth info */}
          {chart&&<div className="mb-3 text-sm leading-relaxed">
            <strong>{name||'Quick Chart'}</strong><br/>
            {year}-{fmt2(month)}-{fmt2(day)} {hour}:{fmt2(minute)}<br/>
            {city}<br/>{lngDeg} {lngDir} {fmt2(lngMin)}&nbsp;&nbsp;{latDeg} {latDir} {fmt2(latMin)}<br/>
            时区: GMT {tz>=0?'+':''}{tz}.00<br/>回归黄道 阿卡比特制<br/>时主星: ☉
          </div>}

          {/* Chart */}
          {chart&&<>
            <div id="chart-area" className="flex justify-center mb-3">
              <ProfessionalNatalChart planets={pData} houses={hData||[]} aspects={aData||[]} ascendant={chart?.ascendant} midheaven={chart?.midheaven} size={500} showDegrees showAspectLines/>
            </div>

            <div className="flex gap-2 mb-3">
              <button onClick={handleSave} className="border border-[#aaa] px-3 py-1 text-xs hover:bg-[#f0f0f0]">储存星图</button>
              <button onClick={handleCopy} className="border border-[#aaa] px-3 py-1 text-xs hover:bg-[#f0f0f0]">复制链接</button>
              <button onClick={handleExport} className="border border-[#aaa] px-3 py-1 text-xs hover:bg-[#f0f0f0]">导出图片</button>
              {saveMsg&&<span className="text-green-600 text-xs ml-2">{saveMsg}</span>}
              {error&&<span className="text-red-600 text-xs ml-2">{error}</span>}
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-[#aaa] mb-2">
              {[{id:'dignity',l:'黄道状态'},{id:'dignity2',l:'黄道状态-2'},{id:'firdaria',l:'法达星限'},{id:'profection',l:'小限法'},{id:'fortune',l:'福点 Aphesis'},{id:'spirit',l:'精神点 Aphesis'}].map(t=>
                <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`px-4 py-1.5 text-xs border border-[#aaa] border-b-0 rounded-t ${activeTab===t.id?'bg-white font-bold':''}`}>{t.l}</button>
              )}
            </div>

            {/* Content */}
            {activeTab==='dignity'&&<table className="w-full border-collapse text-xs border border-[#aaa]">
              <thead><tr className="bg-[#eee]">{['星体','黄经度数','落宫','先天黄道状态','分数'].map(h=><th key={h} className="border border-[#aaa] px-3 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>{PLANET_ORDER.filter(k=>pData?.[k]).map(k=>{const p=pData[k];const lon=norm(p.longitude??0);const si=Math.floor(lon/30);const d=lon%30;const m=Math.round((d%1)*60);let house='-';if(hData)for(let i=0;i<hData.length;i++){const c=norm(hData[i].longitude),n=norm(hData[(i+1)%hData.length].longitude);if(c<=n?lon>=c&&lon<n:lon>=c||lon<n){house=String(hData[i].house);break;}}
              const rules:Record<string,number[]>={Sun:[4],Moon:[3],Mercury:[2,5],Venus:[1,6],Mars:[0,7],Jupiter:[8,11],Saturn:[9,10]};const ex:Record<string,number>={Sun:0,Moon:1,Mercury:5,Venus:11,Mars:9,Jupiter:3,Saturn:6};
              let dign='中度',score=0;if((rules[k]||[]).includes(si)){dign='得令';score=5;}else if(ex[k]===si){dign='曜升';score=4;}
              return<tr key={k} className="hover:bg-[#fafafa]"><td className="border border-[#aaa] px-3 py-1.5 font-bold">{k}</td><td className="border border-[#aaa] px-3 py-1.5">{Math.floor(d)}°{SIGN_SYMBOLS[si]} {String(m).padStart(2,'0')}′{p.retrograde?' R':''}</td><td className="border border-[#aaa] px-3 py-1.5">{house}</td><td className="border border-[#aaa] px-3 py-1.5">{dign}</td><td className="border border-[#aaa] px-3 py-1.5 font-bold">{score}</td></tr>;})}</tbody>
            </table>}

            {activeTab==='dignity2'&&<div className="grid grid-cols-2 gap-4 text-xs">
              <div><div className="font-bold mb-1">宫位</div><table className="w-full border-collapse border border-[#aaa]"><thead><tr className="bg-[#eee]"><th className="border border-[#aaa] px-2 py-1">宫</th><th className="border border-[#aaa] px-2 py-1">度数</th></tr></thead><tbody>{(hData||[]).map((h:any)=>{const si=Math.floor(norm(h.longitude)/30);const d=norm(h.longitude)%30;return<tr key={h.house}><td className="border border-[#aaa] px-2 py-1">{h.house}</td><td className="border border-[#aaa] px-2 py-1">{Math.floor(d)}°{SIGN_SYMBOLS[si]} {Math.round((d%1)*60)}′</td></tr>;})}</tbody></table></div>
              <div><div className="font-bold mb-1">特徵</div><div className="space-y-0.5">{(chart?.features||['暂无']).map((f:string,i:number)=><div key={i}>{f}</div>)}</div></div>
            </div>}

            {['firdaria','profection','fortune','spirit'].includes(activeTab)&&<div className="text-center text-sm text-[#999] py-8">此功能开发中</div>}
          </>}
        </div>

        {/* Right Sidebar */}
        <div className="w-[240px] border-l border-[#D0D0D0] bg-[#4a4a4a] text-white p-3 min-h-screen shrink-0" style={{boxShadow:'0 0 8px #D0D0D0'}}>
          <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <strong className="text-sm">快速制图</strong>
            <span>{sidebarOpen?'−':'+'}</span>
          </div>
          {sidebarOpen&&<div className="space-y-3">
            <div><label className="text-xs font-bold block mb-0.5">名字:</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full border border-[#888] bg-[#555] text-white px-2 py-1 text-sm"/></div>
            <div><label className="text-xs font-bold block mb-0.5">出生时间:</label>
              <div className="flex flex-wrap gap-1">
                <select value={month} onChange={e=>setMonth(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select>
                <select value={day} onChange={e=>setDay(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select>
                <input type="text" value={year} onChange={e=>setYear(parseInt(e.target.value)||now.getFullYear())} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5 w-14"/>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <select value={hour} onChange={e=>setHour(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{h}</option>)}</select>
                <span>:</span>
                <select value={minute} onChange={e=>setMinute(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{String(m).padStart(2,'0')}</option>)}</select>
              </div></div>
            <div><label className="text-xs font-bold block mb-0.5">地点:</label>
              <div className="flex gap-1"><input type="text" value={city} onChange={e=>setCity(e.target.value)} className="flex-1 border border-[#888] bg-[#555] text-white px-2 py-1 text-sm"/>
              <button onClick={async()=>{try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);const d=await r.json();if(d?.[0]){const la=parseFloat(d[0].lat),lo=parseFloat(d[0].lon);setLatDeg(Math.trunc(Math.abs(la)));setLatMin(Math.round((Math.abs(la)%1)*60));setLatDir(la>=0?'N':'S');setLngDeg(Math.trunc(Math.abs(lo)));setLngMin(Math.round((Math.abs(lo)%1)*60));setLngDir(lo>=0?'E':'W');setTz(Math.round(lo/15));}}catch{}}} className="border border-[#888] bg-[#666] px-2 py-0.5 text-xs hover:bg-[#777]">搜寻</button></div></div>
            <div><label className="text-xs font-bold block mb-0.5">经度:</label>
              <div className="flex gap-1"><input type="text" value={lngDeg} onChange={e=>setLngDeg(parseInt(e.target.value)||0)} className="border border-[#888] bg-[#555] text-white px-1 py-0.5 w-10 text-sm"/>
              <select value={lngDir} onChange={e=>setLngDir(e.target.value)} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{['E','W'].map(d=><option key={d} value={d}>{d}</option>)}</select>
              <input type="text" value={lngMin} onChange={e=>setLngMin(parseInt(e.target.value)||0)} className="border border-[#888] bg-[#555] text-white px-1 py-0.5 w-8 text-sm"/></div></div>
            <div><label className="text-xs font-bold block mb-0.5">纬度:</label>
              <div className="flex gap-1"><input type="text" value={latDeg} onChange={e=>setLatDeg(parseInt(e.target.value)||0)} className="border border-[#888] bg-[#555] text-white px-1 py-0.5 w-10 text-sm"/>
              <select value={latDir} onChange={e=>setLatDir(e.target.value)} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5">{['N','S'].map(d=><option key={d} value={d}>{d}</option>)}</select>
              <input type="text" value={latMin} onChange={e=>setLatMin(parseInt(e.target.value)||0)} className="border border-[#888] bg-[#555] text-white px-1 py-0.5 w-8 text-sm"/></div></div>
            <div><label className="text-xs font-bold block mb-0.5">时区:</label>
              <select value={tz} onChange={e=>setTz(Number(e.target.value))} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5 w-full">
                {[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12].map(z=><option key={z} value={z}>GMT {z>=0?'+':''}{z}</option>)}</select></div>
            <div><label className="text-xs font-bold block mb-0.5">宫位制:</label>
              <select value={houseSys} onChange={e=>setHouseSys(e.target.value)} className="border border-[#888] bg-[#555] text-white text-sm px-1 py-0.5 w-full">
                {[{v:'B',l:'阿卡比特制'},{v:'P',l:'普拉西德制'},{v:'K',l:'Koch制'},{v:'R',l:'苪氏分宫制'},{v:'C',l:'Campanus制'},{v:'E',l:'等宫制'},{v:'W',l:'整宫制'}].map(h=><option key={h.v} value={h.v}>{h.l}</option>)}</select></div>
            <button onClick={calculate} disabled={loading} className="w-full border border-[#888] bg-[#666] py-1.5 text-sm hover:bg-[#777] disabled:opacity-50 font-bold">{loading?'计算中...':'更新星图'}</button>
          </div>}
        </div>
      </div>
    </div>
  );
}
