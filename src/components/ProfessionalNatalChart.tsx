"use client";

import { useState } from 'react';

const L: any = {
  planet:{zh:"星体",en:"Planet",id:"Planet"},
  sign:{zh:"星座",en:"Sign",id:"Zodiak"},
  degree:{zh:"度数",en:"Degree",id:"Derajat"},
  house:{zh:"宫位",en:"House",id:"Rumah"},
  dignity:{zh:"尊贵",en:"Dignity",id:"Dignitas"},
  retro:{zh:"逆行",en:"Retrograde",id:"Retrograde"},
  calc:{zh:"生成星盘",en:"Generate Chart",id:"Buat Bagan"},
  calc2:{zh:"计算中...",en:"Calculating...",id:"Menghitung..."},
  birth:{zh:"出生信息",en:"Birth Data",id:"Data Kelahiran"},
  year:{zh:"年",en:"Year",id:"Tahun"},
  month:{zh:"月",en:"Month",id:"Bulan"},
  day:{zh:"日",en:"Day",id:"Hari"},
  hour:{zh:"时",en:"Hour",id:"Jam"},
  minute:{zh:"分",en:"Minute",id:"Menit"},
  city:{zh:"出生城市",en:"Birth City",id:"Kota Lahir"},
  sys:{zh:"分宫制",en:"House System",id:"Sistem Rumah"},
  chart:{zh:"星盘图",en:"Chart",id:"Bagan"},
  planets:{zh:"行星",en:"Planets",id:"Planet"},
  houses:{zh:"宫位",en:"Houses",id:"Rumah"},
  aspects:{zh:"相位",en:"Aspects",id:"Aspek"},
  elements:{zh:"元素",en:"Elements",id:"Elemen"},
  ai:{zh:"AI 深度解读",en:"AI Deep Reading",id:"Pembacaan AI"},
  ai2:{zh:"获取解读",en:"Get Reading",id:"Dapatkan Pembacaan"},
  asc:{zh:"上升",en:"Ascendant",id:"Ascendant"},
  sun:{zh:"太阳",en:"Sun",id:"Matahari"},
  moon:{zh:"月亮",en:"Moon",id:"Bulan"},
  mean:{zh:"含义",en:"Meaning",id:"Arti"},
  cusp:{zh:"宫头星座",en:"Cusp Sign",id:"Tanda Cusp"},
  p1:{zh:"星体1",en:"Planet 1",id:"Planet 1"},
  p2:{zh:"星体2",en:"Planet 2",id:"Planet 2"},
  orb:{zh:"容许度",en:"Orb",id:"Orb"},
  elem:{zh:"四元素分布",en:"Element Distribution",id:"Distribusi Elemen"},
  mode:{zh:"三模式分布",en:"Mode Distribution",id:"Distribusi Mode"},
  fire:{zh:"火象",en:"Fire",id:"Api"},
  earth:{zh:"土象",en:"Earth",id:"Tanah"},
  air:{zh:"风象",en:"Air",id:"Udara"},
  water:{zh:"水象",en:"Water",id:"Air"},
  cardi:{zh:"开创",en:"Cardinal",id:"Kardinal"},
  fixed:{zh:"固定",en:"Fixed",id:"Tetap"},
  mutable:{zh:"变动",en:"Mutable",id:"Mutable"},
  err:{zh:"计算失败",en:"Calculation failed",id:"Gagal"},
};

const CITIES: any[] = [
  {id:"jakarta",name:{zh:"雅加达",en:"Jakarta",id:"Jakarta"},lat:-6.2088,lng:106.8456,tz:7},
  {id:"surabaya",name:{zh:"泗水",en:"Surabaya",id:"Surabaya"},lat:-7.2575,lng:112.7521,tz:7},
  {id:"bandung",name:{zh:"万隆",en:"Bandung",id:"Bandung"},lat:-6.9175,lng:107.6191,tz:7},
  {id:"medan",name:{zh:"棉兰",en:"Medan",id:"Medan"},lat:3.5952,lng:98.6722,tz:7},
  {id:"semarang",name:{zh:"三宝垄",en:"Semarang",id:"Semarang"},lat:-6.9666,lng:110.4196,tz:7},
  {id:"yogyakarta",name:{zh:"日惹",en:"Yogyakarta",id:"Yogyakarta"},lat:-7.7956,lng:110.3695,tz:7},
  {id:"denpasar",name:{zh:"巴厘岛",en:"Bali",id:"Denpasar"},lat:-8.4095,lng:115.1889,tz:8},
  {id:"makassar",name:{zh:"望加锡",en:"Makassar",id:"Makassar"},lat:-5.1477,lng:119.4327,tz:8},
  {id:"singapore",name:{zh:"新加坡",en:"Singapore",id:"Singapura"},lat:1.3521,lng:103.8198,tz:8},
  {id:"kualalumpur",name:{zh:"吉隆坡",en:"Kuala Lumpur",id:"Kuala Lumpur"},lat:3.1390,lng:101.6869,tz:8},
  {id:"bangkok",name:{zh:"曼谷",en:"Bangkok",id:"Bangkok"},lat:13.7563,lng:100.5018,tz:7},
  {id:"beijing",name:{zh:"北京",en:"Beijing",id:"Beijing"},lat:39.9042,lng:116.4074,tz:8},
  {id:"shanghai",name:{zh:"上海",en:"Shanghai",id:"Shanghai"},lat:31.2304,lng:121.4737,tz:8},
  {id:"tokyo",name:{zh:"东京",en:"Tokyo",id:"Tokyo"},lat:35.6762,lng:139.6503,tz:9},
  {id:"seoul",name:{zh:"首尔",en:"Seoul",id:"Seoul"},lat:37.5665,lng:126.9780,tz:9},
  {id:"newyork",name:{zh:"纽约",en:"New York",id:"New York"},lat:40.7128,lng:-74.0060,tz:-5},
  {id:"london",name:{zh:"伦敦",en:"London",id:"London"},lat:51.5074,lng:-0.1278,tz:0},
  {id:"sydney",name:{zh:"悉尼",en:"Sydney",id:"Sydney"},lat:-33.8688,lng:151.2093,tz:10},
];

const PC: any[] = [
  {id:"Sun",sym:"\u2609",color:"#FFD700",name:{zh:"太阳",en:"Sun",id:"Matahari"}},
  {id:"Moon",sym:"\u263D",color:"#C0C0C0",name:{zh:"月亮",en:"Moon",id:"Bulan"}},
  {id:"Mercury",sym:"\u263F",color:"#87CEEB",name:{zh:"水星",en:"Mercury",id:"Merkurius"}},
  {id:"Venus",sym:"\u2640",color:"#FFB6C1",name:{zh:"金星",en:"Venus",id:"Venus"}},
  {id:"Mars",sym:"\u2642",color:"#FF6347",name:{zh:"火星",en:"Mars",id:"Mars"}},
  {id:"Jupiter",sym:"\u2643",color:"#FFA500",name:{zh:"木星",en:"Jupiter",id:"Jupiter"}},
  {id:"Saturn",sym:"\u2644",color:"#87CEFA",name:{zh:"土星",en:"Saturn",id:"Saturnus"}},
  {id:"Uranus",sym:"\u2645",color:"#40E0D0",name:{zh:"天王星",en:"Uranus",id:"Uranus"}},
  {id:"Neptune",sym:"\u2646",color:"#6495ED",name:{zh:"海王星",en:"Neptune",id:"Neptunus"}},
  {id:"Pluto",sym:"\u2647",color:"#CD5C5C",name:{zh:"冥王星",en:"Pluto",id:"Pluto"}},
  {id:"North_Node",sym:"\u260A",color:"#9370DB",name:{zh:"北交点",en:"North Node",id:"Node Utara"}},
  {id:"South_Node",sym:"\u260B",color:"#708090",name:{zh:"南交点",en:"South Node",id:"Node Selatan"}},
];

const SC: any[] = [
  {n:{zh:"白羊",en:"Aries",id:"Aries"},sym:"\u2648",el:"fire",col:"#FF6B6B"},
  {n:{zh:"金牛",en:"Taurus",id:"Taurus"},sym:"\u2649",el:"earth",col:"#4ECDC4"},
  {n:{zh:"双子",en:"Gemini",id:"Gemini"},sym:"\u264A",el:"air",col:"#FFE66D"},
  {n:{zh:"巨蟹",en:"Cancer",id:"Cancer"},sym:"\u264B",el:"water",col:"#95E1D3"},
  {n:{zh:"狮子",en:"Leo",id:"Leo"},sym:"\u264C",el:"fire",col:"#F38181"},
  {n:{zh:"处女",en:"Virgo",id:"Virgo"},sym:"\u264D",el:"earth",col:"#AA96DA"},
  {n:{zh:"天秤",en:"Libra",id:"Libra"},sym:"\u264E",el:"air",col:"#FCBAD3"},
  {n:{zh:"天蝎",en:"Scorpio",id:"Scorpio"},sym:"\u264F",el:"water",col:"#8E44AD"},
  {n:{zh:"射手",en:"Sagittarius",id:"Sagittarius"},sym:"\u2650",el:"fire",col:"#E74C3C"},
  {n:{zh:"摩羯",en:"Capricorn",id:"Capricorn"},sym:"\u2651",el:"earth",col:"#3498DB"},
  {n:{zh:"水瓶",en:"Aquarius",id:"Aquarius"},sym:"\u2652",el:"air",col:"#1ABC9C"},
  {n:{zh:"双鱼",en:"Pisces",id:"Pisces"},sym:"\u2653",el:"water",col:"#9B59B6"},
];

const AC: any[] = [
  {n:{zh:"合相",en:"Conjunction",id:"Konjungsi"},a:0,orb:10,col:"#FFD700",sym:"\u260C"},
  {n:{zh:"六分",en:"Sextile",id:"Sextil"},a:60,orb:6,col:"#00FF88",sym:"\u26B9"},
  {n:{zh:"四分",en:"Square",id:"Kuadrat"},a:90,orb:8,col:"#FF4444",sym:"\u25A1"},
  {n:{zh:"三分",en:"Trine",id:"Trigon"},a:120,orb:8,col:"#4488FF",sym:"\u25B3"},
  {n:{zh:"二分",en:"Opposition",id:"Oposisi"},a:180,orb:10,col:"#FF8800",sym:"\u260D"},
];

const HN: any = {
  1:{zh:"第一宫",en:"1st House",id:"Rumah 1",d:{zh:"自我/上升点",en:"Self/Ascendant",id:"Diri/Ascendant"}},
  2:{zh:"第二宫",en:"2nd House",id:"Rumah 2",d:{zh:"财富/价值观",en:"Finance/Values",id:"Keuangan/Nilai"}},
  3:{zh:"第三宫",en:"3rd House",id:"Rumah 3",d:{zh:"沟通/学习",en:"Communication",id:"Komunikasi"}},
  4:{zh:"第四宫",en:"4th House",id:"Rumah 4",d:{zh:"家庭/根源",en:"Home/Roots",id:"Rumah/Akar"}},
  5:{zh:"第五宫",en:"5th House",id:"Rumah 5",d:{zh:"创造/恋爱",en:"Creativity/Love",id:"Kreativitas/Cinta"}},
  6:{zh:"第六宫",en:"6th House",id:"Rumah 6",d:{zh:"工作/健康",en:"Work/Health",id:"Pekerjaan/Kesehatan"}},
  7:{zh:"第七宫",en:"7th House",id:"Rumah 7",d:{zh:"伴侣/合作",en:"Partnership",id:"Kemitraan"}},
  8:{zh:"第八宫",en:"8th House",id:"Rumah 8",d:{zh:"转型/遗产",en:"Transformation",id:"Transformasi"}},
  9:{zh:"第九宫",en:"9th House",id:"Rumah 9",d:{zh:"旅行/智慧",en:"Travel/Wisdom",id:"Perjalanan/Hikmah"}},
  10:{zh:"第十宫",en:"10th House",id:"Rumah 10",d:{zh:"事业/名声",en:"Career/Fame",id:"Karier/Reputasi"}},
  11:{zh:"第十一宫",en:"11th House",id:"Rumah 11",d:{zh:"友谊/理想",en:"Friends/Hopes",id:"Pertemanan/Harapan"}},
  12:{zh:"第十二宫",en:"12th House",id:"Rumah 12",d:{zh:"秘密/潜意识",en:"Secrets/Subconscious",id:"Rahasia/Bawah Sadar"}},
};

const HS: any[] = [
  {id:"P",n:{zh:"Placidus分宫",en:"Placidus",id:"Placidus"}},
  {id:"E",n:{zh:"等宫制",en:"Equal House",id:"Rumah Sama"}},
  {id:"W",n:{zh:"整宫制",en:"Whole Sign",id:"Whole Sign"}},
];

const DIG: any = {
  Sun:{r:["Leo"],e:["Aries"],dt:["Aquarius"],f:["Libra"]},
  Moon:{r:["Cancer"],e:["Taurus"],dt:["Capricorn"],f:["Scorpio"]},
  Mercury:{r:["Gemini","Virgo"],e:["Virgo"],dt:["Sagittarius","Pisces"],f:["Pisces"]},
  Venus:{r:["Taurus","Libra"],e:["Pisces"],dt:["Aries","Scorpio"],f:["Virgo"]},
  Mars:{r:["Aries","Scorpio"],e:["Capricorn"],dt:["Taurus","Libra"],f:["Cancer"]},
  Jupiter:{r:["Sagittarius","Pisces"],e:["Cancer"],dt:["Gemini","Virgo"],f:["Capricorn"]},
  Saturn:{r:["Capricorn","Aquarius"],e:["Libra"],dt:["Cancer","Leo"],f:["Aries"]},
  Uranus:{r:["Aquarius"],e:["Scorpio"],dt:["Leo"],f:["Taurus"]},
  Neptune:{r:["Pisces"],e:["Cancer"],dt:["Virgo"],f:["Capricorn"]},
  Pluto:{r:["Scorpio"],e:["Aries"],dt:["Taurus"],f:["Libra"]},
};

// Helper functions
function tx(obj: any, lang: string): string {
  if (typeof obj === "string") return obj;
  return (obj as any)[lang] || (obj as any).zh || (obj as any).en || (obj as any).id || "";
}

function gs(sn: string): any {
  return SC.find((s: any) => s.n.en === sn || s.n.zh === sn) || SC[0];
}

function ds(deg: number): string {
  return Math.floor(deg) + "\u00B0" + Math.floor((deg % 1) * 60).toString().padStart(2, "0") + "\u2019";
}

function gd(pid: string, sign: string): any {
  const d = (DIG as any)[pid];
  if (!d) return null;
  if (d.r?.includes(sign)) return {t:{zh:"\u5E99\u65FA",en:"Rulership",id:"Penguasa"},c:"#10B981"};
  if (d.e?.includes(sign)) return {t:{zh:"\u65FA\u52E2",en:"Exaltation",id:"Eksaltasi"},c:"#3B82F6"};
  if (d.dt?.includes(sign)) return {t:{zh:"\u5931\u52E2",en:"Detriment",id:"Depresiasi"},c:"#EF4444"};
  if (d.f?.includes(sign)) return {t:{zh:"\u9677\u843D",en:"Fall",id:"Jatuh"},c:"#DC2626"};
  return null;
}

// ============= ChartSVG Component =============
function ChartSVG({ chart, size = 500, lang }: { chart: any; size?: number; lang: string }) {
  const cx = size / 2;
  const ascLon = chart.ascendant || 0;
  const toAng = (lon: number) => { const n = ((lon - ascLon + 180) % 360 + 360) % 360; return (n * Math.PI) / 180; };
  const toXY = (a: number, r: number) => ({ x: cx + r * Math.cos(a), y: cx - r * Math.sin(a) });
  const rOut = cx - 8, rSO = cx - 8, rSI = cx - 52, rHO = cx - 52, rHI = cx - 92, rPL = cx - 118, rCN = 38;

  const sLines = SC.map((s: any, i: number) => { const a = toAng(i * 30); return { a, p1: toXY(a, rSI), p2: toXY(a, rSO) }; });
  const sSyms = SC.map((s: any, i: number) => { const a = toAng(i * 30 + 15); return { ...s, ...toXY(a, (rSO + rSI) / 2) }; });
  const hLines = (chart.houses || []).map((h: any, i: number) => {
    const a = toAng(h.longitude);
    const ia = [0, 3, 6, 9].includes(i);
    return { p1: toXY(a, rHI), p2: toXY(a, rHO), label: toXY(a, rHI - 15), h: h.house, ia };
  });
  const hLabs = (chart.houses || []).map((h: any, i: number) => {
    const next = chart.houses[(i + 1) % 12];
    const mid = (h.longitude + next.longitude) / 2;
    const pos = toXY(toAng(mid), rHI - 20);
    return { ...pos, h: h.house };
  });
  const plPos = PC.filter((p: any) => chart.planets?.[p.id] && !chart.planets[p.id].error).map((cfg: any) => {
    const p = chart.planets[cfg.id];
    const a = toAng(p.longitude);
    return { ...cfg, ...toXY(a, rPL), a, p };
  });
  const aspLines = (chart.aspects || []).slice(0, 20).map((asp: any) => {
    const p1 = plPos.find((p: any) => p.id === asp.planet1);
    const p2 = plPos.find((p: any) => p.id === asp.planet2);
    const ac = AC.find((a: any) => a.n.en === asp.type);
    if (!p1 || !p2) return null;
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, c: ac?.col || "#888" };
  }).filter(Boolean);

  const elCol: any = { fire: "#FF6B6B", earth: "#4ECDC4", air: "#FFE66D", water: "#95E1D3" };
  const ascA = toAng(ascLon);
  const mcA = chart.midheaven ? toAng(chart.midheaven) : null;

  return (
    <svg width={size} height={size} viewBox={"0 0 " + size + " " + size} className="mx-auto">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a3a"/><stop offset="100%" stopColor="#0a0a1a"/>
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx={cx} cy={cx} r={rOut} fill="url(#bgGrad)" stroke="#374151" strokeWidth="1.5"/>
      {SC.map((s: any, i: number) => {
        const sa = toAng(i * 30), ea = toAng((i + 1) * 30);
        const x1 = cx + rSO * Math.cos(sa), y1 = cx - rSO * Math.sin(sa);
        const x2 = cx + rSI * Math.cos(sa), y2 = cx - rSI * Math.sin(sa);
        const x3 = cx + rSI * Math.cos(ea), y3 = cx - rSI * Math.sin(ea);
        const x4 = cx + rSO * Math.cos(ea), y4 = cx - rSO * Math.sin(ea);
        return <path key={i} d={"M " + x1 + " " + y1 + " A " + rSO + " " + rSO + " 0 0 0 " + x4 + " " + y4 + " L " + x3 + " " + y3 + " A " + rSI + " " + rSI + " 0 0 1 " + x2 + " " + y2 + " Z"} fill={elCol[s.el]} opacity={0.08}/>;
      })}
      <circle cx={cx} cy={cx} r={rSO} fill="none" stroke="#4B5563" strokeWidth="1"/>
      <circle cx={cx} cy={cx} r={rSI} fill="none" stroke="#374151" strokeWidth="1"/>
      <circle cx={cx} cy={cx} r={rHI} fill="none" stroke="#4B5563" strokeWidth="1"/>
      <circle cx={cx} cy={cx} r={rCN} fill="#111827" stroke="#4B5563" strokeWidth="1.5"/>
      {sLines.map((l: any, i: number) => <line key={i} x1={l.p1.x} y1={l.p1.y} x2={l.p2.x} y2={l.p2.y} stroke="#4B5563" strokeWidth="1"/>)}
      {sSyms.map((s: any, i: number) => <text key={i} x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle" fill={s.col} fontSize="14" fontWeight="bold">{s.sym}</text>)}
      {hLines.map((l: any, i: number) => <line key={i} x1={l.p1.x} y1={l.p1.y} x2={l.p2.x} y2={l.p2.y} stroke={l.ia ? "#6366F1" : "#374151"} strokeWidth={l.ia ? 2 : 1} strokeDasharray={l.ia ? "none" : "4 4"}/>)}
      {hLabs.map((l: any, i: number) => <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fill="#6B7280" fontSize="10">{l.h}</text>)}
      {aspLines.map((l: any, i: number) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.c} strokeWidth="0.8" strokeOpacity={0.5}/>)}
      {plPos.map((p: any, i: number) => (
        <g key={i} filter="url(#glow)">
          <circle cx={p.x} cy={p.y} r={11} fill={p.color + "30"} stroke={p.color} strokeWidth="1.5"/>
          <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill={p.color} fontSize="11" fontWeight="bold">{p.sym}</text>
          {p.p.retrograde && <text x={p.x + 9} y={p.y - 9} fill="#FF6B6B" fontSize="9">R</text>}
        </g>
      ))}
      {(() => { const p = toXY(ascA, rHO + 6); return <text key="asc" x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="#FFD700" fontSize="10" fontWeight="bold" filter="url(#glow)">ASC</text>; })()}
      {mcA && (() => { const p = toXY(mcA, rHO + 6); return <text key="mc" x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="#A78BFA" fontSize="10" fontWeight="bold">MC</text>; })()}
      <text x={cx} y={cx} textAnchor="middle" dominantBaseline="middle" fill="#FFD700" fontSize="18" filter="url(#glow)">&#10022;</text>
    </svg>
  );
}

// ============= PlanetTable Component =============
function PlanetTable({ chart, lang }: { chart: any; lang: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.planet, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.sign, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.degree, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.house, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.dignity, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.retro, lang)}</th>
          </tr>
        </thead>
        <tbody>
          {PC.map((cfg: any) => {
            const p = chart.planets?.[cfg.id];
            if (!p || p.error) return null;
            const sg = gs(p.sign);
            const dn = gd(cfg.id, p.sign);
            const deg = p.degree || (p.longitude % 30);
            let hn = "-";
            if (chart.houses) {
              for (let i = 0; i < 12; i++) {
                const h: any = chart.houses[i], nh: any = chart.houses[(i + 1) % 12];
                const inH = h.longitude <= nh.longitude ? p.longitude >= h.longitude && p.longitude < nh.longitude : p.longitude >= h.longitude || p.longitude < nh.longitude;
                if (inH) { hn = String(h.house); break; }
              }
            }
            return (
              <tr key={cfg.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="py-2 px-3"><div className="flex items-center gap-2"><span style={{ color: cfg.color }} className="text-lg">{cfg.sym}</span><span className="text-white font-medium">{tx(cfg.name, lang)}</span></div></td>
                <td className="py-2 px-3"><div className="flex items-center gap-1"><span style={{ color: sg.col }}>{sg.sym}</span><span className="text-slate-300">{tx(sg.n, lang)}</span></div></td>
                <td className="py-2 px-3 text-slate-300 font-mono">{ds(deg)}</td>
                <td className="py-2 px-3 text-slate-400">{hn}</td>
                <td className="py-2 px-3">{dn && <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: dn.c + "20", color: dn.c }}>{tx(dn.t, lang)}</span>}</td>
                <td className="py-2 px-3">{p.retrograde && <span className="text-red-400 font-bold">R</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============= HouseTable Component =============
function HouseTable({ chart, lang }: { chart: any; lang: string }) {
  if (!chart.houses) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.house, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.mean, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.cusp, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.degree, lang)}</th>
          </tr>
        </thead>
        <tbody>
          {(chart.houses as any[]).map((h: any) => {
            const hi = (HN as any)[h.house];
            const sg = gs(h.sign);
            const deg = h.degree || (h.longitude % 30);
            const ia = [1, 4, 7, 10].includes(h.house);
            return (
              <tr key={h.house} className={"border-b border-slate-800 hover:bg-slate-800/30 " + (ia ? "bg-purple-900/10" : "")}>
                <td className="py-2 px-3"><span className={"font-bold " + (ia ? "text-purple-400" : "text-slate-300")}>{tx(hi, lang)}</span></td>
                <td className="py-2 px-3 text-slate-400 text-xs">{tx(hi.d, lang)}</td>
                <td className="py-2 px-3"><div className="flex items-center gap-1"><span style={{ color: sg.col }}>{sg.sym}</span><span className="text-slate-300">{tx(sg.n, lang)}</span></div></td>
                <td className="py-2 px-3 text-slate-300 font-mono">{ds(deg)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============= AspectTable Component =============
function AspectTable({ chart, lang }: { chart: any; lang: string }) {
  if (!chart.aspects) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.p1, lang)}</th>
            <th className="text-center py-2 px-3 text-slate-400">{tx(L.aspects, lang)}</th>
            <th className="text-left py-2 px-3 text-slate-400">{tx(L.p2, lang)}</th>
            <th className="text-right py-2 px-3 text-slate-400">{tx(L.orb, lang)}</th>
          </tr>
        </thead>
        <tbody>
          {(chart.aspects as any[]).map((asp: any, i: number) => {
            const p1: any = PC.find((p: any) => p.id === asp.planet1);
            const p2: any = PC.find((p: any) => p.id === asp.planet2);
            const ac: any = AC.find((a: any) => a.n.en === asp.type);
            return (
              <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
                <td className="py-2 px-3"><div className="flex items-center gap-2"><span style={{ color: p1?.color }}>{p1?.sym}</span><span className="text-slate-300">{tx(p1?.name || {}, lang)}</span></div></td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: (ac?.col || "#888") + "20", color: ac?.col || "#888" }}>
                    {ac?.sym} {tx(ac?.n || {}, lang)}
                  </span>
                </td>
                <td className="py-2 px-3"><div className="flex items-center gap-2"><span style={{ color: p2?.color }}>{p2?.sym}</span><span className="text-slate-300">{tx(p2?.name || {}, lang)}</span></div></td>
                <td className="py-2 px-3 text-right text-slate-400 font-mono text-xs">{asp.orb?.toFixed(2)}\u00B0</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============= Element & Mode Analysis Component =============
function ElemMode({ chart, lang }: { chart: any; lang: string }) {
  const cnt: any = { fire: 0, earth: 0, air: 0, water: 0, cardi: 0, fixed: 0, mutable: 0 };
  PC.slice(0, 10).forEach((cfg: any) => {
    const p = chart.planets?.[cfg.id];
    if (p && !p.error) {
      const sg = gs(p.sign);
      if (sg) {
        (cnt as any)[sg.el] = ((cnt as any)[sg.el] || 0) + 1;
        if (sg.el === "fire" || sg.el === "water") cnt.cardi++;
        else cnt.fixed++;
      }
    }
  });
  const els = [
    { k: "fire", c: "#EF4444", l: L.fire, s: "\u2648\u264C\u2650" },
    { k: "earth", c: "#84CC16", l: L.earth, s: "\u2649\u264D\u2651" },
    { k: "air", c: "#06B6D4", l: L.air, s: "\u264A\u264E\u2652" },
    { k: "water", c: "#8B5CF6", l: L.water, s: "\u264B\u264F\u2653" },
  ];
  const mods = [
    { k: "cardi", c: "#F59E0B", l: L.cardi },
    { k: "fixed", c: "#6366F1", l: L.fixed },
    { k: "mutable", c: "#10B981", l: L.mutable },
  ];
  const tot = cnt.fire + cnt.earth + cnt.air + cnt.water;
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">{tx(L.elem, lang)}</h4>
        {els.map((el: any) => (
          <div key={el.k} className="flex items-center gap-3 mb-2">
            <div className="w-16 text-xs text-slate-400">{tx(el.l, lang)}</div>
            <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: ((cnt as any)[el.k] / tot * 100) || 0, backgroundColor: el.c }}/>
            </div>
            <div className="w-6 text-xs text-slate-400 text-right">{(cnt as any)[el.k]}</div>
            <div className="text-xs text-slate-500">{el.s}</div>
          </div>
        ))}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">{tx(L.mode, lang)}</h4>
        {mods.map((m: any) => (
          <div key={m.k} className="flex items-center gap-3 mb-2">
            <div className="w-16 text-xs text-slate-400">{tx(m.l, lang)}</div>
            <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: ((cnt as any)[m.k] / tot * 100) || 0, backgroundColor: m.c }}/>
            </div>
            <div className="w-6 text-xs text-slate-400 text-right">{(cnt as any)[m.k]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= Main Component =============
export default function ProfessionalNatalChart({ language = "zh" }: { language?: string }) {
  const [form, setForm] = useState({ year: 1990, month: 6, day: 15, hour: 12, minute: 0 });
  const [cityId, setCityId] = useState("jakarta");
  const [hs, setHs] = useState("P");
  const [chart, setChart] = useState<any>(null);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState("chart");
  const [ai, setAi] = useState("");
  const [aiL, setAiL] = useState(false);
  const lang = language;
  const city = CITIES.find((c: any) => c.id === cityId) || CITIES[0];

  const calc = async () => {
    setLoad(true); setErr(null);
    try {
      const r = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: form.year, month: form.month, day: form.day, hour: form.hour, minute: form.minute, latitude: city.lat, longitude: city.lng, timezone: city.tz, houseSystem: hs }),
      });
      const raw = await r.json();
      if (raw.error) throw new Error(raw.error);
      // Unwrap API response: { success: true, data: { planets, houses, ascendant: {longitude}, midheaven: {longitude}, aspects } }
      const apiData = raw.data || raw;
      const chartData = {
        planets: apiData.planets,
        houses: apiData.houses,
        ascendant: apiData.ascendant?.longitude ?? apiData.ascendant ?? 0,
        midheaven: apiData.midheaven?.longitude ?? apiData.midheaven ?? 0,
        aspects: apiData.aspects,
      };
      setChart(chartData); setTab("chart");
    } catch (e: any) { setErr(e.message || tx(L.err, lang)); }
    finally { setLoad(false); }
  };

  const getAi = async () => {
    if (!chart) return;
    setAiL(true); setAi("");
    try {
      const r = await fetch("/api/ai-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "natal", birthData: { year: form.year, month: form.month, day: form.day, hour: form.hour, minute: form.minute }, planetPositions: chart.planets, houses: chart.houses, ascendant: chart.ascendant, midheaven: chart.midheaven, aspects: chart.aspects, language: lang }),
      });
      const d = await r.json();
      setAi(d.reading || d.content || "");
    } catch { setAi(lang === "zh" ? "AI\u89E3\u8BFB\u6682\u65F6\u4E0D\u53EF\u7528" : "AI reading unavailable"); }
    finally { setAiL(false); }
  };

  const tabs2 = [
    { id: "chart", l: L.chart },
    { id: "planets", l: L.planets },
    { id: "houses", l: L.houses },
    { id: "aspects", l: L.aspects },
    { id: "elements", l: L.elements },
  ];

  const sgSun: any = chart?.planets?.Sun ? gs(chart.planets.Sun.sign) : SC[0];
  const sgMoon: any = chart?.planets?.Moon ? gs(chart.planets.Moon.sign) : SC[0];

  return (
    <div className="space-y-6">
      {/* Birth Data Form */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>&#128308;</span>{tx(L.birth, lang)}</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <div><label className="text-xs text-slate-400 mb-1 block">{tx(L.year, lang)}</label>
            <select value={form.year} onChange={e => setForm({...form, year: +e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm">
              {Array.from({length: 100}, (_, i) => 2025 - i).map((y: number) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">{tx(L.month, lang)}</label>
            <select value={form.month} onChange={e => setForm({...form, month: +e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm">
              {Array.from({length: 12}, (_, i) => i + 1).map((m: number) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">{tx(L.day, lang)}</label>
            <select value={form.day} onChange={e => setForm({...form, day: +e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm">
              {Array.from({length: 31}, (_, i) => i + 1).map((d: number) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">{tx(L.hour, lang)}</label>
            <select value={form.hour} onChange={e => setForm({...form, hour: +e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm">
              {Array.from({length: 24}, (_, i) => i).map((h: number) => <option key={h} value={h}>{String(h).padStart(2,"0")}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">{tx(L.minute, lang)}</label>
            <select value={form.minute} onChange={e => setForm({...form, minute: +e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm">
              {Array.from({length: 60}, (_, i) => i).map((m: number) => <option key={m} value={m}>{String(m).padStart(2,"0")}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">{tx(L.city, lang)}</label>
            <select value={cityId} onChange={e => setCityId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm">
              {CITIES.map((c: any) => <option key={c.id} value={c.id}>{tx(c.name, lang)}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-400 mb-1 block">{tx(L.sys, lang)}</label>
            <select value={hs} onChange={e => setHs(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm">
              {HS.map((h: any) => <option key={h.id} value={h.id}>{tx(h.n, lang)}</option>)}
            </select>
          </div>
        </div>
        <button onClick={calc} disabled={load}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2">
          {load ? <><span className="animate-spin">&#10227;</span>{tx(L.calc2, lang)}</> : <><span>&#10022;</span>{tx(L.calc, lang)}</>}
        </button>
        {err && <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{err}</div>}
      </div>

      {chart && (
        <div className="space-y-4">
          {/* Quick Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
              <div className="text-xs text-slate-400 mb-1">{tx(L.asc, lang)}</div>
              <div className="font-bold text-white">{sgSun.sym} {tx(sgSun.n, lang)}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
              <div className="text-xs text-slate-400 mb-1">{tx(L.sun, lang)}</div>
              <div className="font-bold text-white">{sgSun.sym} {tx(sgSun.n, lang)}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
              <div className="text-xs text-slate-400 mb-1">{tx(L.moon, lang)}</div>
              <div className="font-bold text-white">{sgMoon.sym} {tx(sgMoon.n, lang)}</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700 overflow-x-auto">
            {tabs2.map((tb: any) => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                className={"flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap " + (tab === tb.id ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
                {tx(tb.l, lang)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
            {tab === "chart" && (
              <div>
                <ChartSVG chart={chart} size={500} lang={lang}/>
                <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
                  {AC.map((a: any) => (
                    <div key={a.n.en} className="flex items-center gap-1 justify-center">
                      <span style={{color:a.col}} className="font-bold">{a.sym}</span>
                      <span className="text-slate-400">{tx(a.n, lang)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "planets" && <PlanetTable chart={chart} lang={lang}/>}
            {tab === "houses" && <HouseTable chart={chart} lang={lang}/>}
            {tab === "aspects" && <AspectTable chart={chart} lang={lang}/>}
            {tab === "elements" && <ElemMode chart={chart} lang={lang}/>}
          </div>

          {/* AI Reading */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2"><span>&#128172;</span>{tx(L.ai, lang)}</h3>
              <button onClick={getAi} disabled={aiL}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl text-sm font-bold text-white transition-all">
                {aiL ? "..." : tx(L.ai2, lang)}
              </button>
            </div>
            {ai && <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{ai}</div>}
            {!ai && !aiL && (
              <p className="text-slate-500 text-sm">
                {lang === "zh" ? "\u70B9\u51FB\u300C\u83B7\u53D6\u89E3\u8BFB\u300D\u83B7\u53D6\u57FA\u4E8E\u60A8\u661F\u76D8\u7684AI\u4E2A\u6027\u5316\u5206\u6790" : lang === "id" ? "Klik \u0027Dapatkan Pembacaan\u0027 untuk analisis AI berdasarkan bagan Anda" : "Click \u0027Get Reading\u0027 for AI personalized analysis based on your chart"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
