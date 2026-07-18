"use client";

import { useState, useMemo } from "react";

// ─── Constants ───
const HS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]; // Heavenly Stems
const EB = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]; // Earthly Branches
const JZ = Array.from({length:60},(_,i)=>HS[i%10]+EB[i%12]);

// Fixed mappings for Earth Plate
const STEM_ORDER = ["戊","己","庚","辛","壬","癸","丁","丙","乙"]; // 9-stem rotation order
const NINE_STARS = ["天蓬","天任","天冲","天辅","天英","天芮","天柱","天心","天禽"]; // palace 1-9
const EIGHT_GATES_MAP: Record<number,string> = {1:"休",8:"生",3:"伤",4:"杜",9:"景",2:"死",7:"惊",6:"开",5:"死"};
const DEITIES_ORDER = ["值符","螣蛇","太阴","六合","白虎","玄武","九地","九天"];
const BRANCH_PALACE: Record<string,number> = {"子":1,"丑":8,"寅":8,"卯":3,"辰":4,"巳":4,"午":9,"未":2,"申":2,"酉":7,"戌":6,"亥":6};

const PL: Record<number,{n:string,t:string,e:string,d:string}> = {
  1:{n:"坎一宫",t:"☵",e:"水",d:"北"},2:{n:"坤二宫",t:"☷",e:"土",d:"西南"},
  3:{n:"震三宫",t:"☳",e:"木",d:"东"},4:{n:"巽四宫",t:"☴",e:"木",d:"东南"},
  5:{n:"中五宫",t:"中",e:"土",d:"中"},6:{n:"乾六宫",t:"☰",e:"金",d:"西北"},
  7:{n:"兑七宫",t:"☱",e:"金",d:"西"},8:{n:"艮八宫",t:"☶",e:"土",d:"东北"},
  9:{n:"离九宫",t:"☲",e:"火",d:"南"},
};

// Solar terms for 2026 (simplified — moon calendar dates)
const TERMS: {m:number;d:number;ju:number;yy:"yang"|"yin"}[] = [
  {m:1,d:21,ju:1,yy:"yang"},{m:2,d:4,ju:8,yy:"yang"},{m:2,d:19,ju:9,yy:"yang"},
  {m:3,d:6,ju:1,yy:"yang"},{m:3,d:21,ju:3,yy:"yang"},{m:4,d:5,ju:4,yy:"yang"},
  {m:4,d:20,ju:5,yy:"yang"},{m:5,d:6,ju:6,yy:"yang"},{m:5,d:21,ju:7,yy:"yang"},
  {m:6,d:6,ju:8,yy:"yang"},{m:6,d:21,ju:9,yy:"yin"},{m:7,d:7,ju:8,yy:"yin"},
  {m:7,d:23,ju:7,yy:"yin"},{m:8,d:8,ju:5,yy:"yin"},{m:8,d:23,ju:3,yy:"yin"},
  {m:9,d:8,ju:8,yy:"yin"},{m:9,d:23,ju:6,yy:"yin"},{m:10,d:8,ju:5,yy:"yin"},
  {m:10,d:23,ju:4,yy:"yin"},{m:11,d:7,ju:3,yy:"yin"},{m:11,d:22,ju:2,yy:"yin"},
  {m:12,d:7,ju:1,yy:"yin"},{m:12,d:22,ju:1,yy:"yang"},
];

// ─── Core Qi Men Calculation ───
function calcQiMen(y:number,m:number,d:number,h:number) {
  // 1. Solar term → 局 and 阳/阴遁
  const term = (()=>{const dv=m*100+d;for(let i=TERMS.length-1;i>=0;i--)if(dv>=TERMS[i].m*100+TERMS[i].d)return TERMS[i];return TERMS[0];})();
  const {ju, yy} = term;
  const isYang = yy === "yang";

  // 2. Hour pillar
  const dbIdx = ((y % 10) + m + d + 5) % 12; // simplified day branch
  const db = EB[dbIdx];
  const ds = HS[(dbIdx * 2) % 10]; // simplified day stem
  const hbIdx = Math.floor(((h + 1) % 24) / 2);
  const hb = EB[hbIdx];
  const hs = HS[(HS.indexOf(ds) * 2 + hbIdx) % 10];
  const hourPillar = hs + hb;

  // 3. 旬首 (甲X where X is the stem at the start of this 旬)
  const hourIdx = JZ.indexOf(hourPillar);
  const xunIdx = Math.floor(hourIdx / 10) * 10;
  const xunShou = JZ[xunIdx]; // 甲子/甲戌/甲申/...
  const xsBranch = xunShou[1];

  // 4. 元 (上中下)
  const yuanIdx = Math.floor(dbIdx / 5) % 3;
  const yuan = ["上元","中元","下元"][yuanIdx];

  // 5. Earth Plate (地盘) — 9 stems in palace order
  const earth: Record<number,string> = {};
  // Yang dun: clockwise fill; Yin dun: counter-clockwise
  const palaceSeq = isYang ? [1,8,3,4,9,2,7,6,5] : [9,8,7,6,5,4,3,2,1];
  const startStemIdx = (ju - 1) % 9;
  for (let i = 0; i < 9; i++) {
    const pal = palaceSeq[i];
    const si = isYang ? (startStemIdx + i) % 9 : (startStemIdx - i + 9) % 9;
    earth[pal] = STEM_ORDER[si];
  }

  // 6. 值符 star and 值使 gate
  // 旬首 falls on the earth plate at the palace determined by its branch
  const zfPalace = BRANCH_PALACE[xsBranch] || 5;
  // The star at this palace on the earth plate is 值符
  const zfStar = NINE_STARS[zfPalace - 1];
  const zfGate = EIGHT_GATES_MAP[zfPalace];

  // 7. Heaven Plate (天盘): rotate stars so 值符 moves to hour palace
  const hourPalace = BRANCH_PALACE[hb] || 5;
  const heaven: Record<number,string> = {};
  const zfStarIdx = zfPalace - 1; // index of 值符 star in NINE_STARS
  for (let pal = 1; pal <= 9; pal++) {
    const originalStarIdx = pal - 1;
    const shift = (originalStarIdx - zfStarIdx + 9) % 9;
    const targetPal = ((hourPalace - 1 + shift) % 9) + 1;
    heaven[targetPal] = NINE_STARS[originalStarIdx];
  }

  // 8. Human Plate (人盘): rotate gates based on hour offset
  const branchDiff = (EB.indexOf(hb) - EB.indexOf(xsBranch) + 12) % 12;
  const human: Record<number,string> = {};
  const gatePalaces = [8,4,1,6,9,2,3,7,5]; // 生,杜,休,开,景,死,伤,惊,中 — original earth palace for each gate (indexed by gate order)
  // Actually simpler: map each earth palace's original gate to a new palace
  const gateOrder = ["休","生","伤","杜","景","死","惊","开"];
  const gateEarthPalace: Record<string,number> = {};
  for (const [pal, gate] of Object.entries(EIGHT_GATES_MAP)) {
    if (gate !== "死" || +pal !== 5) gateEarthPalace[gate] = +pal;
  }
  // Actually let me use a cleaner approach for gate rotation
  const gateShift = branchDiff;
  for (let pal = 1; pal <= 9; pal++) {
    if (pal === 5) { human[5] = "—"; continue; }
    const origGate = EIGHT_GATES_MAP[pal];
    if (!origGate || origGate === "死") { human[pal] = "—"; continue; }
    const origIdx = gateOrder.indexOf(origGate);
    const newIdx = (origIdx + gateShift) % 8;
    const newGate = gateOrder[newIdx];
    // Find which palace this gate ends up at
    for (let np = 1; np <= 9; np++) {
      if (np === 5) continue;
      if (EIGHT_GATES_MAP[np] === newGate || (newGate === "死" && np === 5)) {
        human[pal] = newGate;
        break;
      }
    }
    if (!human[pal]) human[pal] = newGate;
  }

  // 9. Spirit Plate (神盘): Deities in order starting from 值符
  const spirit: Record<number,string> = {};
  const deityStartPal = hourPalace;
  for (let i = 0; i < 8; i++) {
    const pal = isYang ? ((deityStartPal - 1 + i) % 9) + 1 : ((deityStartPal - 1 - i + 9) % 9) + 1;
    if (pal === 5) continue; // 中五宫 has no deity
    spirit[pal] = DEITIES_ORDER[i];
  }

  return {
    term, ju, isYang, yuan, hourPillar, xunShou,
    zfStar, zfGate, zfPalace,
    earth, heaven, human, spirit,
  };
}

// ─── UI ───
const PALACE_ORDER = [4,9,2, 3,5,7, 8,1,6];

export default function QiMenPage() {
  const now = new Date();
  const [M, setM] = useState(now.getMonth() + 1);
  const [D, setD] = useState(now.getDate());
  const [H, setH] = useState(now.getHours());

  const c = useMemo(() => calcQiMen(now.getFullYear(), M, D, H), [M, D, H]);

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[560px] mx-auto px-3 py-4">
        <h1 className="text-xl font-semibold tracking-[-0.5px] text-center mb-1">奇门遁甲排盘</h1>
        <p className="text-[11px] text-gray-400 text-center mb-3">Qi Men Dun Jia · 天地人神四层盘</p>

        {/* Controls */}
        <div className="flex gap-2 justify-center mb-3 flex-wrap">
          <select value={M} onChange={e => setM(+e.target.value)} className="px-2 py-1.5 border rounded text-xs">
            {Array.from({length:12}, (_,i) => i+1).map(m => <option key={m} value={m}>{m}月</option>)}
          </select>
          <select value={D} onChange={e => setD(+e.target.value)} className="px-2 py-1.5 border rounded text-xs">
            {Array.from({length:31}, (_,i) => i+1).map(d => <option key={d} value={d}>{d}日</option>)}
          </select>
          <select value={H} onChange={e => setH(+e.target.value)} className="px-2 py-1.5 border rounded text-xs">
            {Array.from({length:24}, (_,i) => i).map(h => <option key={h} value={h}>{h}:00</option>)}
          </select>
        </div>

        {/* Chart header */}
        <div className="grid grid-cols-5 gap-1 mb-4 text-center text-[10px]">
          {[
            `${c.term.m}/${c.term.d}节`,
            `${c.isYang ? "阳" : "阴"}遁${c.ju}局`,
            c.yuan,
            `值符：${c.zfStar}`,
            `值使：${c.zfGate}`,
          ].map((v, i) => (
            <div key={i} className="bg-gray-50 rounded py-1.5 font-medium text-[11px]">{v}</div>
          ))}
        </div>

        {/* 九宫 Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {PALACE_ORDER.map(palace => {
            const pl = PL[palace];
            const isC = palace === 5;
            const earth = c.earth[palace] || "—";
            const heaven = c.heaven[palace] || "—";
            const human = c.human[palace] || "—";
            const spirit = c.spirit[palace] || "—";
            return (
              <div key={palace}
                className={`aspect-square rounded-lg border-2 p-1 flex flex-col justify-between items-center text-center ${
                  isC ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50"
                } ${palace === c.zfPalace ? "ring-1 ring-red-400" : ""}`}>
                {/* Palace label */}
                <div className="text-[9px] text-gray-400 leading-tight w-full text-center">
                  {pl.t}·{pl.d}
                </div>
                {/* Spirit (神) */}
                <div className="text-[10px] font-semibold text-purple-700 leading-tight">{spirit}</div>
                {/* Heaven (星) */}
                <div className="text-[11px] font-bold text-blue-700 leading-tight">{heaven}</div>
                {/* Human (门) + Earth (干) */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[12px] font-black text-red-700">{human}</span>
                  <span className="text-[11px] text-gray-600">{earth}</span>
                </div>
                {/* Palace name */}
                <div className="text-[9px] text-gray-300">{pl.e}·{pl.n}</div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-3 text-[9px] text-gray-400">
          <span>🟣 神</span><span>🔵 星</span><span>🔴 门</span><span>⚫ 干</span>
        </div>
        <p className="text-center text-[9px] text-gray-300 mt-2">
          {c.hourPillar}时 · {c.xunShou}旬 · {c.isYang ? "顺" : "逆"}排
        </p>
      </main>
    </div>
  );
}
