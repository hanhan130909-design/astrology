"use client";

import { ArrowLeft, Save } from "lucide-react";
import ProfessionalNatalChart from "@/components/ProfessionalNatalChart";

type ChartData = {
  planets?: Record<string, any>;
  houses?: any[];
  aspects?: any[];
  ascendant?: any;
  midheaven?: any;
  birthInfo?: any;
};

type BirthForm = {
  name?: string;
  year: number; month: number; day: number;
  hour: number; minute: number;
  lat: number; lng: number; tz: number;
  houseSystem: string;
};

type Props = {
  chart: ChartData;
  form: BirthForm;
  chartType?: string;
  cityName?: string;
  onBack?: () => void;
  onSave?: () => void;
  saveMsg?: string | null;
};

// ─── Constants ───
const SIGN_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGN_CN = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

const PLANET_RULERS: Record<string, string[]> = {
  Aries: ['Mars'], Taurus: ['Venus'], Gemini: ['Mercury'], Cancer: ['Moon'],
  Leo: ['Sun'], Virgo: ['Mercury'], Libra: ['Venus'], Scorpio: ['Mars', 'Pluto'],
  Sagittarius: ['Jupiter'], Capricorn: ['Saturn'], Aquarius: ['Saturn', 'Uranus'], Pisces: ['Jupiter', 'Neptune'],
};

const TABLE_BODIES = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];
const planetsGlyphs: Record<string, string> = {
  Sun:"☉",Moon:"☽",Mercury:"☿",Venus:"♀",Mars:"♂",Jupiter:"♃",Saturn:"♄",Uranus:"♅",Neptune:"♆",Pluto:"♇",
  North_Node:"☊",Ascendant:"AC",Midheaven:"MC",
};

const aspectGlyphs: Record<string, { mark: string; className: string }> = {
  Conjunction:{mark:"☌",className:"text-[#8b4513]"}, Sextile:{mark:"✶",className:"text-blue-700"},
  Square:{mark:"□",className:"text-red-600"}, Trine:{mark:"△",className:"text-green-700"},
  Opposition:{mark:"☍",className:"text-red-600"},
};

const houseLabel: Record<string, string> = {
  P:"阿卡比特制",E:"等宫制",W:"整宫制",K:"Koch",R:"Regiomontanus",C:"Campanus",
};

function fmt2(n:number){return String(Math.trunc(n)).padStart(2,"0");}
function normalize(v:number){return((v%360)+360)%360;}

// ─── Feature computation ───
function computeFeatures(chart: ChartData): string[] {
  const features: string[] = [];
  const planets = chart.planets || {};
  const aspects = chart.aspects || [];
  const houses = chart.houses || [];

  // 1. Receptions
  for (const [key, p] of Object.entries(planets)) {
    if (!p || p.longitude == null) continue;
    const lon = normalize(p.longitude ?? 0);
    const signIdx = Math.floor(lon / 30);
    const signName = SIGN_NAMES[signIdx];
    const signRulers = PLANET_RULERS[signName] || [];
    
    for (const ruler of signRulers) {
      if (ruler === key) continue;
      const rulerP = planets[ruler];
      if (!rulerP) continue;
      // Check if ruler aspects the planet (within 8° orb)
      for (const asp of aspects) {
        if ((asp.planet1 === key && asp.planet2 === ruler) || (asp.planet1 === ruler && asp.planet2 === key)) {
          const symbol = PLANET_RULERS[signName].length > 1 && ruler === PLANET_RULERS[signName][0] ? '本垣' : '曜升';
          const label = `${planetsGlyphs[key]||key} 被 ${planetsGlyphs[ruler]||ruler} 接纳 (${symbol})`;
          if (!features.includes(label)) features.push(label);
        }
      }
    }
  }

  // 2. Critical degrees
  const criticalDegrees: Record<string, number[]> = {
    cardinal: [0, 13, 26],
    fixed: [9, 21],
    mutable: [4, 17],
  };
  const signModes: Record<number, string> = {};
  [0,4,8].forEach(i=>{signModes[i]='cardinal';signModes[i+1]='fixed';signModes[i+2]='mutable';signModes[i+3]='cardinal'});

  for (const [key, p] of Object.entries(planets)) {
    if (!p || key === 'North_Node' || key === 'South_Node') continue;
    const lon = normalize(p.longitude ?? 0);
    const signIdx = Math.floor(lon / 30);
    const deg = lon % 30;
    const mode = signModes[signIdx];
    const crits = criticalDegrees[mode] || [];
    const rounded = Math.round(deg);
    for (const c of crits) {
      if (Math.abs(rounded - c) <= 1) {
        const modeCN = mode==='cardinal'?'开创':mode==='fixed'?'固定':'变动';
        features.push(`${planetsGlyphs[key]||key} 位于紧要度数 (${rounded}°, ${modeCN}星座)`);
      }
    }
  }

  // 3. Void of Course Moon
  const moon = planets.Moon;
  if (moon) {
    const moonLon = normalize(moon.longitude ?? 0);
    const moonSign = Math.floor(moonLon / 30);
    let hasAspect = false;
    for (const asp of aspects) {
      if (asp.planet1 === 'Moon' || asp.planet2 === 'Moon') { hasAspect = true; break; }
    }
    // Simplified: Moon VoC if it makes no major aspects AND is in last 3° of sign
    if (!hasAspect || moonLon % 30 > 27) {
      const nextHouses = houses.filter((h:any)=>h.longitude && normalize(h.longitude)>moonLon && normalize(h.longitude)<moonLon+30);
      if (nextHouses.length === 0) features.push('☽ 月空亡');
    }
  }

  return features.length > 0 ? features : ['暂无显著特征'];
}

// ─── Components ───

function PlutoGlyph({className=""}:{className?:string}){
  return <svg aria-label="冥王" viewBox="-10 -14 20 28" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
    <circle cx="0" cy="-8.2" r="3.2"/><path d="M -7 -2.2 Q 0 5 7 -2.2"/><path d="M 0 2.8 V 12"/><path d="M -5 8 H 5"/>
  </svg>;
}

function ChartInfoCard({form, cityName}:{form:BirthForm;cityName?:string}){
  const locStr = cityName || `(${form.lat.toFixed(2)}°, ${form.lng.toFixed(2)}°)`;
  const lngDir = form.lng>=0?"E":"W", latDir = form.lat>=0?"N":"S";
  const coordStr = `${Math.trunc(Math.abs(form.lng))} ${lngDir} ${Math.round((Math.abs(form.lng)%1)*60)}  ${Math.trunc(Math.abs(form.lat))} ${latDir} ${Math.round((Math.abs(form.lat)%1)*60)}`;
  return (
    <section className="w-[168px] rounded border border-[#c9c9c9] bg-white px-2 py-2 text-[12px] leading-[1.55] text-[#333] shadow-[0_2px_9px_rgba(0,0,0,0.18)]">
      <div className="mb-1 flex items-center gap-1 font-bold"><span className="text-[16px]">♟</span><span>{form.name||""}</span></div>
      <div>{fmt2(form.year)}-{fmt2(form.month)}-{fmt2(form.day)} {fmt2(form.hour)}:{fmt2(form.minute)}:00</div>
      <div>{locStr}</div>
      <div>{coordStr}</div>
      <div>时区: GMT {form.tz>=0?"+":""}{form.tz.toFixed(2)}</div>
      <div>回归黄道 {houseLabel[form.houseSystem]||form.houseSystem}</div>
      <div>时主星: ☉</div>
    </section>
  );
}

function AspectMatrix({chart}:{chart:ChartData}){
  const map = new Map<string,{mark:string;value:string;className:string}>();
  (chart.aspects||[]).forEach(a=>{
    const s=aspectGlyphs[a.aspect||a.type];if(!s||!a.planet1||!a.planet2)return;
    const orb=Math.abs(a.orb??0);const deg=Math.floor(orb);const min=Math.round((orb-deg)*60);
    const cell={...s,value:`${deg}°${String(min).padStart(2,"0")}′ ${(a.orb??0)>=0?"A":"S"}`};
    map.set(`${a.planet1}-${a.planet2}`,cell);map.set(`${a.planet2}-${a.planet1}`,cell);
  });
  const bodies=[{label:"☉",key:"Sun"},{label:"☽",key:"Moon"},{label:"☿",key:"Mercury"},{label:"♀",key:"Venus"},{label:"♂",key:"Mars"},{label:"♃",key:"Jupiter"},{label:"♄",key:"Saturn"},{label:"♅",key:"Uranus"},{label:"♆",key:"Neptune"},{label:"pluto",key:"Pluto"},{label:"☊",key:"North_Node"},{label:"AC",key:"Ascendant"},{label:"MC",key:"Midheaven"}];
  return (
    <section className="mt-12 w-[430px]">
      <table className="border-collapse text-center leading-none">
        <tbody>
          {bodies.map((b,ri)=><tr key={b.key}>
            <th className="h-[31px] w-[26px] pr-1 text-center text-[22px] font-normal leading-none text-black"><span className="inline-flex h-[24px] w-[24px] items-center justify-center align-middle">{b.label==='pluto'?<PlutoGlyph className="h-[22px] w-[16px]"/>:b.key==='AC'||b.key==='MC'?<span className="text-[11px]">{b.key}</span>:b.label}</span></th>
            {bodies.map((cb,ci)=>{
              if(ci>ri)return<td key={`${b.key}-${cb.key}`} className="box-border h-[31px] w-[31px] p-0"/>;
              const a=map.get(`${b.key}-${cb.key}`);
              return <td key={`${b.key}-${cb.key}`} className="relative box-border h-[31px] w-[31px] overflow-hidden border border-[#999] bg-[#fbfbfb] p-0 text-center align-middle leading-none">
                {a?<div className="absolute inset-[1px] flex flex-col items-center justify-center overflow-hidden"><span className={`block h-[15px] max-w-full text-[15px] font-bold leading-[15px] ${a.className}`}>{a.mark}</span><span className={`block max-w-full whitespace-nowrap text-[7px] leading-[8px] ${a.className}`}>{a.value}</span></div>:ci===ri?<span className="absolute inset-0 flex items-center justify-center overflow-hidden text-[17px] leading-none text-black">{b.label==='pluto'?<PlutoGlyph className="h-[19px] w-[14px]"/>:b.key==='AC'||b.key==='MC'?<span className="text-[10px]">{b.key}</span>:b.label}</span>:""}
              </td>;
            })}
          </tr>)}
        </tbody>
      </table>
    </section>
  );
}

function ChartFeaturePanel({chart}:{chart:ChartData}){
  const features = computeFeatures(chart);
  return (
    <aside className="w-[240px] rounded border border-[#bababa] bg-[#f7f7f7] p-1 shadow-sm">
      <div className="mb-4 flex text-[13px]">
        {["特徵","笔记","评注"].map((tab,i)=>
          <button key={tab} className={`h-9 border border-[#aaa] px-4 ${i===0?"border-b-white bg-white font-bold text-[#333]":"bg-gradient-to-b from-[#f3f3f3] to-[#d4d4d4] text-[#555]"}`} type="button">{tab}</button>
        )}
      </div>
      <table className="w-full border-collapse bg-white text-[12px] text-black shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
        <thead><tr><th className="border border-[#aaa] bg-[#eeeeee] py-1 text-center font-bold">特徵</th></tr></thead>
        <tbody>{features.map(f=><tr key={f}><td className="border border-[#aaa] px-2 py-1">{f}</td></tr>)}</tbody>
      </table>
    </aside>
  );
}

function ChartTables({chart}:{chart:ChartData}){
  const rows = TABLE_BODIES.map(key=>{
    const p = chart.planets?.[key]; if(!p)return null;
    const lon = normalize(p.longitude??0); const signIdx = Math.floor(lon/30);
    const deg = lon%30; const house = findHouse(lon,chart.houses||[]);
    const signCN = SIGN_CN[signIdx]?.replace("座","")||"-";
    const essentialDignity = computeDignity(key, signIdx);
    const score = essentialDignity.score;
    return [
      planetsGlyphs[key]||key[0],
      `${Math.floor(deg)}°${String(Math.round((deg%1)*60)).padStart(2,"0")}′ ${SIGN_SYMBOLS[signIdx]}${p.retrograde?" R":""}`,
      house||"-", house||"-",
      essentialDignity.label,
      signCN,
      p.name_cn||key,
      String(score),
    ];
  }).filter(Boolean) as string[][];

  return (
    <section className="mt-5 rounded-t border border-[#aaa] bg-[#d5d5d5] text-[#333]">
      <div className="flex h-10 items-end gap-0 px-1">
        {["黄道状态","黄道状态-2","法达星限","小限法","福点 Aphesis","精神点 Aphesis"].map((tab,i)=>
          <button key={tab} className={`h-9 rounded-t border border-[#aaa] px-4 text-[14px] ${i===0?"border-b-white bg-white font-bold":"bg-gradient-to-b from-[#eeeeee] to-[#cfcfcf]"}`} type="button">{tab}</button>
        )}
      </div>
      <div className="bg-white px-7 pb-7 pt-5">
        <table className="w-full border-collapse text-center text-[13px] text-black">
          <thead><tr>{["星体","黄经度数","落宫","守护宫","曜升宫","先天黄道状态","附属状态","分数"].map(h=><th key={h} className="border border-[#aaa] bg-[#eeeeee] px-3 py-3 font-bold">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} className="border border-[#aaa] px-3 py-2">{c==='♇'?<PlutoGlyph className="mx-auto h-[19px] w-[14px]"/>:c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function findHouse(lon:number,houses:any[]):string{
  if(!houses.length)return"";
  const l=normalize(lon);
  for(let i=0;i<houses.length;i++){
    const c=normalize(houses[i].longitude),n=normalize(houses[(i+1)%houses.length].longitude);
    if(c<=n?l>=c&&l<n:l>=c||l<n)return String(houses[i].house);
  }
  return"";
}

function computeDignity(planetKey:string,signIdx:number):{label:string;score:number}{
  const signName=SIGN_NAMES[signIdx];
  // Simplified essential dignity system
  const rulership:Record<string,number[]>={Sun:[4],Moon:[3],Mercury:[2,5],Venus:[1,6],Mars:[0,7],Jupiter:[8,11],Saturn:[9,10],Uranus:[10],Neptune:[11],Pluto:[7]};
  const detriment:Record<string,number[]>={Sun:[10],Moon:[9],Mercury:[8,11],Venus:[0,7],Mars:[1,6],Jupiter:[2,5],Saturn:[3,4]};
  const exaltation:Record<string,number>={Sun:0,Moon:1,Mercury:5,Venus:11,Mars:9,Jupiter:3,Saturn:6,Uranus:7,Neptune:4,Pluto:7};
  const fall:Record<string,number>={Sun:6,Moon:7,Mercury:11,Venus:5,Mars:3,Jupiter:9,Saturn:0};

  const rules=rulership[planetKey]||[]; const dets=detriment[planetKey]||[];
  if(rules.includes(signIdx))return{label:"得令",score:5};
  if(exaltation[planetKey]===signIdx)return{label:"曜升",score:4};
  if(dets.includes(signIdx))return{label:"弱",score:-3};
  if(fall[planetKey]===signIdx)return{label:"落陷",score:-4};
  // Check triplicity
  const fireSigns=[0,4,8],earthSigns=[1,5,9],airSigns=[2,6,10],waterSigns=[3,7,11];
  const triplicity:Record<string,number[]>={Sun:fireSigns,Moon:earthSigns,Mercury:airSigns,Venus:earthSigns,Mars:waterSigns,Jupiter:fireSigns,Saturn:airSigns,Uranus:airSigns,Neptune:waterSigns,Pluto:waterSigns};
  if((triplicity[planetKey]||[]).includes(signIdx))return{label:"三分",score:2};
  return{label:"中度",score:0};
}

// ─── Main ───
export default function AlmutenChartLayout({chart,form,chartType,onBack,onSave,saveMsg}:Props){
  const typeLabel = chartType==='transit'?'行运图':chartType==='solar'?'日返图':chartType==='lunar'?'月返图':chartType==='composite'?'组合图':'本命图';
  return (
    <div className="chart-tool-page min-h-screen overflow-auto bg-white font-sans text-[#222]">
      <div className="min-w-[1380px]">
        <div className="border-b border-[#d2d2d2] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack&&<button onClick={onBack} className="flex items-center gap-1 text-[#555] hover:text-[#222] transition-colors text-sm"><ArrowLeft size={16}/>返回修改</button>}
            <h1 className="text-[20px] font-normal text-[#333]">{form.name||""} - {typeLabel}</h1>
          </div>
          <div className="flex items-center gap-2">
            {saveMsg&&<span className="text-xs text-green-600 mr-2">{saveMsg}</span>}
            {onSave&&<button onClick={onSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#aaa] bg-white hover:bg-[#f5f5f5] text-sm text-[#555] transition-colors"><Save size={14}/>保存星盘</button>}
          </div>
        </div>

        <main className="px-5 pb-8 pt-2">
          <div className="grid grid-cols-[430px_690px_260px] items-start gap-7">
            <div className="pt-2">
              <ChartInfoCard form={form}/>
              <AspectMatrix chart={chart}/>
            </div>
            <div className="flex justify-center pt-0">
              <ProfessionalNatalChart planets={chart.planets} houses={chart.houses||[]} aspects={chart.aspects||[]} ascendant={chart.ascendant} midheaven={chart.midheaven} size={560} showDegrees showAspectLines/>
            </div>
            <div className="flex justify-end pt-1">
              <ChartFeaturePanel chart={chart}/>
            </div>
          </div>
          <ChartTables chart={chart}/>
        </main>
      </div>
    </div>
  );
}
