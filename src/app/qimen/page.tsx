"use client";

import { useState, useMemo } from "react";

// ─── Constants ───
const HS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EB = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const JZ = Array.from({length:60},(_,i)=>HS[i%10]+EB[i%12]);

const STEM_ORDER = ["戊","己","庚","辛","壬","癸","丁","丙","乙"];
const NINE_STARS = ["天蓬","天任","天冲","天辅","天英","天芮","天柱","天心","天禽"];
const EIGHT_GATES_MAP: Record<number,string> = {1:"休",8:"生",3:"伤",4:"杜",9:"景",2:"死",7:"惊",6:"开",5:"死"};
const DEITIES_ORDER = ["值符","螣蛇","太阴","六合","白虎","玄武","九地","九天"];
const BRANCH_PALACE: Record<string,number> = {"子":1,"丑":8,"寅":8,"卯":3,"辰":4,"巳":4,"午":9,"未":2,"申":2,"酉":7,"戌":6,"亥":6};

// Element colors
const EL_COLORS: Record<string, {border:string; bg:string; text:string}> = {
  "水": {border:"border-blue-500", bg:"bg-blue-50", text:"text-blue-700"},
  "木": {border:"border-emerald-500", bg:"bg-emerald-50", text:"text-emerald-700"},
  "火": {border:"border-red-500", bg:"bg-red-50", text:"text-red-700"},
  "土": {border:"border-amber-500", bg:"bg-amber-50", text:"text-amber-700"},
  "金": {border:"border-gray-400", bg:"bg-gray-50", text:"text-gray-700"},
};

const PL: Record<number,{n:string;t:string;e:string;d:string;num:number}> = {
  1:{n:"坎",t:"☵",e:"水",d:"北",num:1}, 2:{n:"坤",t:"☷",e:"土",d:"西南",num:2},
  3:{n:"震",t:"☳",e:"木",d:"东",num:3}, 4:{n:"巽",t:"☴",e:"木",d:"东南",num:4},
  5:{n:"中",t:"◎",e:"土",d:"中",num:5}, 6:{n:"乾",t:"☰",e:"金",d:"西北",num:6},
  7:{n:"兑",t:"☱",e:"金",d:"西",num:7}, 8:{n:"艮",t:"☶",e:"土",d:"东北",num:8},
  9:{n:"离",t:"☲",e:"火",d:"南",num:9},
};

const TERMS: {m:number;d:number;ju:number;yy:"yang"|"yin";name:string}[] = [
  {m:1,d:21,ju:1,yy:"yang",name:"大寒"},{m:2,d:4,ju:8,yy:"yang",name:"立春"},{m:2,d:19,ju:9,yy:"yang",name:"雨水"},
  {m:3,d:6,ju:1,yy:"yang",name:"惊蛰"},{m:3,d:21,ju:3,yy:"yang",name:"春分"},{m:4,d:5,ju:4,yy:"yang",name:"清明"},
  {m:4,d:20,ju:5,yy:"yang",name:"谷雨"},{m:5,d:6,ju:6,yy:"yang",name:"立夏"},{m:5,d:21,ju:7,yy:"yang",name:"小满"},
  {m:6,d:6,ju:8,yy:"yang",name:"芒种"},{m:6,d:21,ju:9,yy:"yin",name:"夏至"},{m:7,d:7,ju:8,yy:"yin",name:"小暑"},
  {m:7,d:23,ju:7,yy:"yin",name:"大暑"},{m:8,d:8,ju:5,yy:"yin",name:"立秋"},{m:8,d:23,ju:3,yy:"yin",name:"处暑"},
  {m:9,d:8,ju:8,yy:"yin",name:"白露"},{m:9,d:23,ju:6,yy:"yin",name:"秋分"},{m:10,d:8,ju:5,yy:"yin",name:"寒露"},
  {m:10,d:23,ju:4,yy:"yin",name:"霜降"},{m:11,d:7,ju:3,yy:"yin",name:"立冬"},{m:11,d:22,ju:2,yy:"yin",name:"小雪"},
  {m:12,d:7,ju:1,yy:"yin",name:"大雪"},{m:12,d:22,ju:1,yy:"yang",name:"冬至"},
];

// ─── Core Calculation ───
function calcQiMen(y:number,m:number,d:number,h:number) {
  const term = (()=>{const dv=m*100+d;for(let i=TERMS.length-1;i>=0;i--)if(dv>=TERMS[i].m*100+TERMS[i].d)return TERMS[i];return TERMS[0];})();
  const {ju, yy, name: termName} = term;
  const isYang = yy === "yang";

  const dbIdx = ((y % 10) + m + d + 5) % 12;
  const db = EB[dbIdx];
  const ds = HS[(dbIdx * 2) % 10];
  const hbIdx = Math.floor(((h + 1) % 24) / 2);
  const hb = EB[hbIdx];
  const hs = HS[(HS.indexOf(ds) * 2 + hbIdx) % 10];
  const hourPillar = hs + hb;

  const hourIdx = JZ.indexOf(hourPillar);
  const xunIdx = Math.floor(hourIdx / 10) * 10;
  const xunShou = JZ[xunIdx];
  const xsBranch = xunShou[1];

  const yuanIdx = Math.floor(dbIdx / 5) % 3;
  const yuan = ["上元","中元","下元"][yuanIdx];

  const earth: Record<number,string> = {};
  const palaceSeq = isYang ? [1,8,3,4,9,2,7,6,5] : [9,8,7,6,5,4,3,2,1];
  const startStemIdx = (ju - 1) % 9;
  for (let i = 0; i < 9; i++) {
    const pal = palaceSeq[i];
    const si = isYang ? (startStemIdx + i) % 9 : (startStemIdx - i + 9) % 9;
    earth[pal] = STEM_ORDER[si];
  }

  const zfPalace = BRANCH_PALACE[xsBranch] || 5;
  const zfStar = NINE_STARS[zfPalace - 1];
  const zfGate = EIGHT_GATES_MAP[zfPalace];

  const hourPalace = BRANCH_PALACE[hb] || 5;
  const heaven: Record<number,string> = {};
  const zfStarIdx = zfPalace - 1;
  for (let pal = 1; pal <= 9; pal++) {
    const originalStarIdx = pal - 1;
    const shift = (originalStarIdx - zfStarIdx + 9) % 9;
    const targetPal = ((hourPalace - 1 + shift) % 9) + 1;
    heaven[targetPal] = NINE_STARS[originalStarIdx];
  }

  const branchDiff = (EB.indexOf(hb) - EB.indexOf(xsBranch) + 12) % 12;
  const human: Record<number,string> = {};
  const gateOrder = ["休","生","伤","杜","景","死","惊","开"];
  const gateShift = branchDiff;
  for (let pal = 1; pal <= 9; pal++) {
    if (pal === 5) { human[5] = "—"; continue; }
    const origGate = EIGHT_GATES_MAP[pal];
    if (!origGate || origGate === "死") { human[pal] = "—"; continue; }
    const origIdx = gateOrder.indexOf(origGate);
    const newIdx = (origIdx + gateShift) % 8;
    human[pal] = gateOrder[newIdx];
  }

  const spirit: Record<number,string> = {};
  const deityStartPal = hourPalace;
  for (let i = 0; i < 8; i++) {
    const pal = isYang ? ((deityStartPal - 1 + i) % 9) + 1 : ((deityStartPal - 1 - i + 9) % 9) + 1;
    if (pal === 5) continue;
    spirit[pal] = DEITIES_ORDER[i];
  }

  // Calculate 地盘干 for each palace after rotation
  const earthAfter: Record<number,string> = {};
  for (let pal = 1; pal <= 9; pal++) {
    earthAfter[pal] = earth[pal];
  }

  return { termName, ju, isYang, yuan, hourPillar, xunShou, zfStar, zfGate, zfPalace, earth, heaven, human, spirit };
}

// ─── UI ───
const PALACE_ORDER = [4,9,2, 3,5,7, 8,1,6];

function PalaceColor({e}:{e:string}) { return EL_COLORS[e] || EL_COLORS["土"]; }

export default function QiMenPage() {
  const now = new Date();
  const [M, setM] = useState(now.getMonth() + 1);
  const [D, setD] = useState(now.getDate());
  const [H, setH] = useState(now.getHours());
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);

  const c = useMemo(() => calcQiMen(now.getFullYear(), M, D, H), [M, D, H]);

  const formatDate = () => {
    const d = new Date(now.getFullYear(), M - 1, D, H);
    return `${d.getFullYear()}年${M}月${D}日 ${H}:00`;
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[640px] mx-auto px-3 py-4">
        <h1 className="text-xl font-semibold tracking-[-0.5px] text-center mb-0.5">奇门遁甲排盘</h1>
        <p className="text-[11px] text-gray-400 text-center mb-4">Qi Men Dun Jia</p>

        {/* Controls */}
        <div className="flex gap-1.5 justify-center mb-4 flex-wrap">
          <select value={M} onChange={e => setM(+e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white">
            {Array.from({length:12}, (_,i) => i+1).map(m => <option key={m} value={m}>{m}月</option>)}
          </select>
          <select value={D} onChange={e => setD(+e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white">
            {Array.from({length:31}, (_,i) => i+1).map(d => <option key={d} value={d}>{d}日</option>)}
          </select>
          <select value={H} onChange={e => setH(+e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white">
            {Array.from({length:24}, (_,i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2,"0")}:00</option>)}
          </select>
        </div>

        {/* Header Info */}
        <div className="text-center mb-4">
          <div className="text-[13px] font-medium text-gray-600">{formatDate()}</div>
          <div className="flex justify-center gap-3 mt-1.5 text-[12px]">
            <span className={`px-2 py-0.5 rounded ${c.isYang ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"} font-medium`}>
              {c.isYang ? "阳遁" : "阴遁"}{c.ju}局
            </span>
            <span className="text-gray-500">{c.termName} · {c.yuan}</span>
            <span className="text-gray-400">{c.hourPillar}时</span>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[11px] text-gray-500">
            <span>值符：<b className="text-gray-700">{c.zfStar}</b></span>
            <span>值使：<b className="text-gray-700">{c.zfGate}</b></span>
            <span>{c.xunShou}旬</span>
          </div>
        </div>

        {/* Nine Palaces Grid */}
        <div className="grid grid-cols-3 gap-[3px] mb-6 bg-gray-200 rounded-lg overflow-hidden border-[3px] border-gray-200">
          {PALACE_ORDER.map(palace => {
            const pl = PL[palace];
            const isCenter = palace === 5;
            const clr = PalaceColor({e: pl.e});
            const heaven = c.heaven[palace] || "—";
            const human = c.human[palace] || "—";
            const spirit = c.spirit[palace] || "";
            const earth = c.earth[palace] || "—";
            const isValuePalace = palace === c.zfPalace;
            const isSelected = selectedPalace === palace;

            return (
              <div key={palace}
                onClick={() => setSelectedPalace(isSelected ? null : palace)}
                className={`relative aspect-square cursor-pointer transition-all
                  ${isCenter ? "bg-amber-50" : "bg-white"}
                  ${isValuePalace ? "shadow-[inset_0_0_0_2px_#ef4444]" : ""}
                  ${isSelected ? "ring-2 ring-gray-900 ring-offset-[-2px]" : ""}
                  p-1.5 flex flex-col`}>
                
                {/* Top: Palace label + Direction */}
                <div className="flex justify-between items-start">
                  <span className="text-[9px] text-gray-300 font-medium">{pl.t}</span>
                  <span className={`text-[9px] font-medium ${clr.text}`}>{pl.d}</span>
                </div>

                {/* Spirit (神) — top center */}
                {spirit && (
                  <div className={`text-[11px] font-bold text-center mt-0.5
                    ${spirit === "值符" ? "text-red-600" : 
                      spirit === "螣蛇" ? "text-orange-500" :
                      spirit === "白虎" ? "text-gray-600" :
                      spirit === "玄武" ? "text-blue-600" :
                      "text-purple-600"}`}>
                    {spirit}
                  </div>
                )}

                {/* Heaven Star (星) — middle */}
                <div className={`text-[12px] font-bold text-center mt-1 ${isCenter ? "" : "text-blue-700"}`}>
                  {heaven}
                </div>

                {/* Human Gate (门) + Earth Stem (干) — bottom */}
                <div className="flex items-center justify-between mt-auto">
                  <span className={`text-[14px] font-black 
                    ${human === "生" ? "text-emerald-600" :
                      human === "死" ? "text-gray-500" :
                      human === "开" ? "text-amber-600" :
                      human === "休" ? "text-blue-600" :
                      human === "景" ? "text-red-500" :
                      "text-red-600"}`}>
                    {human}
                  </span>
                  <span className="text-[13px] font-medium text-gray-800">{earth}</span>
                </div>

                {/* Bottom: Element + Palace name */}
                <div className="flex justify-between items-end">
                  <span className={`text-[9px] ${clr.text}`}>{pl.e}</span>
                  <span className="text-[9px] text-gray-300">{pl.n}宫</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mb-6 text-[10px] text-gray-400">
          <span>🟣 神盘</span><span>🔵 天盘·星</span><span>🔴 人盘·门</span><span>⚫ 地盘·干</span>
        </div>

        {/* Selected Palace Detail */}
        {selectedPalace && (() => {
          const p = PL[selectedPalace];
          const clr = PalaceColor({e: p.e});
          const item = (label:string, value:string) => (
            <div className="flex justify-between py-1 border-b border-gray-100 last:border-0">
              <span className="text-gray-500 text-xs">{label}</span>
              <span className="text-gray-800 text-xs font-medium">{value}</span>
            </div>
          );
          return (
            <div className={`rounded-xl border-2 p-4 mb-4 ${clr.border} ${clr.bg}`}>
              <h3 className={`text-sm font-semibold mb-2 ${clr.text}`}>
                {p.t} {p.n}宫 · {p.e} · {p.d}方
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0 text-xs">
                {item("神盘", c.spirit[selectedPalace] || "—")}
                {item("天盘星", c.heaven[selectedPalace] || "—")}
                {item("人盘门", c.human[selectedPalace] || "—")}
                {item("地盘干", c.earth[selectedPalace] || "—")}
              </div>
            </div>
          );
        })()}

        {/* Analysis Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left text-gray-500 font-medium">宫</th>
                <th className="p-2 text-left text-gray-500 font-medium">神</th>
                <th className="p-2 text-left text-gray-500 font-medium">星</th>
                <th className="p-2 text-left text-gray-500 font-medium">门</th>
                <th className="p-2 text-left text-gray-500 font-medium">干</th>
                <th className="p-2 text-left text-gray-500 font-medium">五行</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5,6,7,8,9].map(p => {
                const pl = PL[p];
                const clr = PalaceColor({e: pl.e});
                return (
                  <tr key={p} className={`border-t border-gray-100 hover:bg-gray-50 cursor-pointer ${p === c.zfPalace ? "bg-red-50/50" : ""}`}
                    onClick={() => setSelectedPalace(selectedPalace === p ? null : p)}>
                    <td className={`p-2 font-medium ${clr.text}`}>{pl.t}{pl.n}</td>
                    <td className="p-2 text-purple-700">{c.spirit[p] || "—"}</td>
                    <td className="p-2 text-blue-700">{c.heaven[p] || "—"}</td>
                    <td className="p-2 text-red-700 font-bold">{c.human[p] || "—"}</td>
                    <td className="p-2">{c.earth[p] || "—"}</td>
                    <td className={`p-2 ${clr.text}`}>{pl.e}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-center text-[10px] text-gray-300 mt-4">
          {c.isYang ? "顺" : "逆"}排 · {c.xunShou}旬 · 时柱{c.hourPillar}
        </p>
      </main>
    </div>
  );
}
