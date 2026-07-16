"use client";

import { useState, useMemo } from "react";

// ─── Constants ───
const STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const JIAZI = Array.from({length:60}, (_,i) => STEMS[i%10] + BRANCHES[i%12]);

// Stars, Gates, Deities — in fixed order
const NINE_STARS = ["天蓬","天芮","天冲","天辅","天禽","天心","天柱","天任","天英"];
const EIGHT_GATES = ["休","生","伤","杜","景","死","惊","开"];
const EIGHT_DEITIES = ["值符","螣蛇","太阴","六合","白虎","玄武","九地","九天"];

// Palace info: number → name, trigram, element, direction
const P: Record<number,{n:string,t:string,e:string,d:string}> = {
  1:{n:"坎一宫",t:"坎☵",e:"水",d:"北"}, 2:{n:"坤二宫",t:"坤☷",e:"土",d:"西南"},
  3:{n:"震三宫",t:"震☳",e:"木",d:"东"}, 4:{n:"巽四宫",t:"巽☴",e:"木",d:"东南"},
  5:{n:"中五宫",t:"中",e:"土",d:"中"}, 6:{n:"乾六宫",t:"乾☰",e:"金",d:"西北"},
  7:{n:"兑七宫",t:"兑☱",e:"金",d:"西"}, 8:{n:"艮八宫",t:"艮☶",e:"土",d:"东北"},
  9:{n:"离九宫",t:"离☲",e:"火",d:"南"},
};

// 24 Solar Terms (simplified for 2026)
const TERMS: {m:number,d:number,dun:number,direction:"yang"|"yin"}[] = [
  {m:1,d:21,dun:1,direction:"yang"},{m:2,d:4,dun:8,direction:"yang"},{m:2,d:19,dun:9,direction:"yang"},
  {m:3,d:6,dun:1,direction:"yang"},{m:3,d:21,dun:3,direction:"yang"},{m:4,d:5,dun:4,direction:"yang"},
  {m:4,d:20,dun:5,direction:"yang"},{m:5,d:6,dun:6,direction:"yang"},{m:5,d:21,dun:7,direction:"yang"},
  {m:6,d:6,dun:8,direction:"yang"},{m:6,d:21,dun:9,direction:"yin"},{m:7,d:7,dun:8,direction:"yin"},
  {m:7,d:23,dun:7,direction:"yin"},{m:8,d:8,dun:2,direction:"yin"},{m:8,d:23,dun:1,direction:"yin"},
  {m:9,d:8,dun:9,direction:"yin"},{m:9,d:23,dun:7,direction:"yin"},{m:10,d:8,dun:6,direction:"yin"},
  {m:10,d:23,dun:5,direction:"yin"},{m:11,d:7,dun:4,direction:"yin"},{m:11,d:22,dun:3,direction:"yin"},
  {m:12,d:7,dun:2,direction:"yin"},{m:12,d:22,dun:1,direction:"yang"},
];

// ─── Core calculations ───
function findTerm(m:number,d:number){for(let i=TERMS.length-1;i>=0;i--){const t=TERMS[i];if(m*100+d>=t.m*100+t.d)return TERMS[i];}return TERMS[0];}
function hourBranchIdx(h:number){return Math.floor(((h+1)%24)/2);}
function dayStemOfYear(y:number){return (y+5)%10;}

function calcChart(y:number,m:number,d:number,h:number){
  const term = findTerm(m,d);
  // Day stem-branch (simplified)
  const ds = STEMS[(y+m+d+5)%10];
  const dbIdx = (y+m+d)%12;
  const db = BRANCHES[dbIdx];
  // Hour stem-branch
  const hbIdx = hourBranchIdx(h);
  const hs = STEMS[(STEMS.indexOf(ds)*2+hbIdx)%10];
  const hb = BRANCHES[hbIdx];
  const hourJiaZi = hs+hb;
  const hourIdx = JIAZI.indexOf(hourJiaZi);
  // 旬首 (the 甲 stem of this 旬)
  const xunShouStemIdx = (Math.floor(hourIdx/10)*10);
  const xunShou = JIAZI[xunShouStemIdx]; // 甲X
  const xunShouBranch = xunShou[1];
  // 元 (上中下) based on day branch index
  const yuanIdx = Math.floor(dbIdx/5)%3;
  const yuan = ["上元","中元","下元"][yuanIdx];
  // 局数 = term.dun — simplified (each term has fixed dun)
  const juNum = term.dun;
  const isYang = term.direction==="yang";

  // ── Earth Plate (地盘) ──
  // Fill order: 坎1→坤2→震3→巽4→中5→乾6→兑7→艮8→离9
  // Yang: 戊 starts at juNum palace, fills clockwise 戊己庚辛壬癸丁丙乙
  // Yin: 戊 starts at juNum palace, fills counter-clockwise
  const stemOrder = ["戊","己","庚","辛","壬","癸","丁","丙","乙"];
  const earth: Record<number,string> = {};
  // Palace fill order for earth plate
  const earthFill = isYang
    ? [1,8,3,4,9,2,7,6,5] // yang:坎→艮→震→巽→离→坤→兑→乾→中
    : [9,8,7,6,5,4,3,2,1]; // yin: reverse
  const offset = (juNum-1)%9;
  for(let i=0;i<9;i++){
    const palace = earthFill[i];
    const si = isYang ? (offset+i)%9 : (9-offset-i%9+9)%9;
    earth[palace] = stemOrder[si];
  }

  // Find 旬首 in earth plate → 值符 star, 值使 gate
  const xunShouStem = xunShouBranch === "子" ? "甲子" : xunShou;
  let zhiFuPalace = 5;
  const earthEntries = Object.entries(earth);
  for(const [pa,st] of earthEntries){
    if(stemOrder.indexOf(st) === STEMS.indexOf("甲") && 
       BRANCHES[(stemOrder.indexOf(st)+1)%10] === xunShouBranch){
      zhiFuPalace = +pa;
      break;
    }
  }
  // Simplified: 旬首 stem = 甲, branch determines palace
  const branchToPalace: Record<string,number> = {"子":1,"丑":8,"寅":8,"卯":3,"辰":4,"巳":4,"午":9,"未":2,"申":2,"酉":7,"戌":6,"亥":6};
  zhiFuPalace = branchToPalace[xunShouBranch] || 5;

  // ── Heaven Plate (天盘): 9 Stars ──
  // Stars rotate: 值符 star goes to the hour's palace
  const starPalaces: Record<string,number> = {};
  // Fixed star-to-earth-palace mapping (simplified)
  const starPalaceMap: Record<number,number> = {1:1,8:2,3:3,4:4,5:5,6:6,7:7,2:8,9:9}; //坎1→天蓬,艮8→天任,震3→天冲,巽4→天辅,中5→天禽,乾6→天心,兑7→天柱,坤2→天芮,离9→天英
  // Actually: stars follow a fixed order on the 地盘
  const starOnEarth: Record<number,string> = {
    1:"天蓬",8:"天任",3:"天冲",4:"天辅",9:"天英",2:"天芮",7:"天柱",6:"天心",5:"天禽"
  };
  const zhiFuStar = starOnEarth[zhiFuPalace] || "天禽";
  // Rotate: 值符 star → hour palace
  const hourPalace = branchToPalace[hb] || 5;
  const starShift = NINE_STARS.indexOf(zhiFuStar) - NINE_STARS.indexOf(starOnEarth[hourPalace]||"天禽");
  for(const [pal,star] of Object.entries(starOnEarth)){
    const si = (NINE_STARS.indexOf(star) + starShift + 9) % 9;
    const targetPalace = Object.entries(starOnEarth).find(([,s])=>NINE_STARS.indexOf(s)===si)?.[0];
    starPalaces[targetPalace||pal] = star;
  }

  // ── Human Plate (人盘): 8 Gates ──
  // Gates rotate: 值使 gate moves based on hour branch offset from 旬首 branch
  const zhiFuGate = EIGHT_GATES[["休","生","伤","杜","景","死","惊","开"].indexOf(
    {1:"休",8:"生",3:"伤",4:"杜",9:"景",2:"死",7:"惊",6:"开",5:"死"}[zhiFuPalace]||"休")];
  const gatePalaces: Record<number,string> = {};
  const gateOnEarth: Record<number,string> = {1:"休",8:"生",3:"伤",4:"杜",9:"景",2:"死",7:"惊",6:"开",5:"死"};
  const branchDiff = (BRANCHES.indexOf(hb) - BRANCHES.indexOf(xunShouBranch) + 12) % 12;
  for(const [pal,gate] of Object.entries(gateOnEarth)){
    const gi = EIGHT_GATES.indexOf(gate);
    const targetGi = (gi + branchDiff) % 8;
    const targetGate = EIGHT_GATES[targetGi];
    // Find palace for this gate
    const targetPal = Object.entries(gateOnEarth).find(([,g])=>g===targetGate)?.[0];
    gatePalaces[targetPal||pal] = gate;
  }

  // ── Spirit Plate (神盘): 8 Deities ──
  const deityPalaces: Record<number,string> = {};
  const deityPalaceMap: Record<number,string> = {
    1:"值符",8:"螣蛇",3:"太阴",4:"六合",9:"白虎",2:"玄武",7:"九地",6:"九天"
  };
  for(const [pal,deity] of Object.entries(deityPalaceMap)){
    deityPalaces[pal] = deity;
  }

  return {term,yuan,juNum,isYang,hs,hb,hourJiaZi,xunShou,zhiFuStar,zhiFuGate,zhiFuPalace,
    earth,starPalaces,gatePalaces,deityPalaces};
}

// ─── Component ───
const PALACES = [4,9,2,3,5,7,8,1,6]; // 洛书 display order

export default function QiMenPage(){
  const n=new Date();
  const [M,setM]=useState(n.getMonth()+1);
  const [D,setD]=useState(n.getDate());
  const [H,setH]=useState(n.getHours());

  const c=useMemo(()=>calcChart(n.getFullYear(),M,D,H),[M,D,H]);

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[520px] mx-auto px-3 py-4">
        <h1 className="text-xl font-semibold tracking-[-0.5px] text-center mb-1">奇门遁甲排盘</h1>
        <p className="text-[11px] text-gray-400 text-center mb-3">Qi Men Dun Jia · 专业四层盘</p>

        {/* Input */}
        <div className="flex gap-2 justify-center mb-4 flex-wrap">
          <select value={M} onChange={e=>setM(+e.target.value)} className="px-2 py-1.5 border rounded text-xs">{Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}月</option>)}</select>
          <select value={D} onChange={e=>setD(+e.target.value)} className="px-2 py-1.5 border rounded text-xs">{Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}日</option>)}</select>
          <select value={H} onChange={e=>setH(+e.target.value)} className="px-2 py-1.5 border rounded text-xs">{Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{h}:00</option>)}</select>
        </div>

        {/* Header info */}
        <div className="grid grid-cols-5 gap-1 mb-4 text-center text-[10px]">
          {[
            `节气 ${c.term.m}/${c.term.d}`,
            `${c.isYang?"阳":"阴"}遁${c.juNum}局`,
            c.yuan,
            `值符${c.zhiFuStar}`,
            `值使${c.zhiFuGate}`
          ].map((v,i)=><div key={i} className="bg-gray-50 rounded py-1.5 font-medium text-[11px]">{v}</div>)}
        </div>

        {/* 九宫 Grid — 4 layers per cell */}
        <div className="grid grid-cols-3 gap-1.5">
          {PALACES.map(palace=>{
            const p=P[palace];
            const earth=c.earth[palace]||"—";
            const star=c.starPalaces[palace]||"—";
            const gate=c.gatePalaces[palace]||"—";
            const deity=c.deityPalaces[palace]||"—";
            const isCenter=palace===5;
            return (
              <div key={palace} className={`aspect-square rounded-lg border-2 p-1 flex flex-col justify-between text-center ${isCenter?'border-amber-400 bg-amber-50':'border-gray-200 bg-gray-50'}`}>
                {/* Palace label */}
                <div className="text-[9px] text-gray-400 leading-tight">{p.t} {p.d}</div>
                {/* Deity (神) */}
                <div className="text-[10px] font-semibold text-purple-700 leading-tight">{deity}</div>
                {/* Star (星) */}
                <div className="text-[11px] font-bold leading-tight">{star}</div>
                {/* Gate (门) + Earth stem (干) */}
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[12px] font-black text-red-700">{gate}</span>
                  <span className="text-[11px] text-gray-600">{earth}</span>
                </div>
                {/* Palace name */}
                <div className="text-[9px] text-gray-300">{p.n}</div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-3 text-[9px] text-gray-400">
          <span>🟣 神盘</span><span>⭐ 天盘</span><span>🔴 人盘</span><span>⚫ 地盘</span>
        </div>
        <p className="text-center text-[9px] text-gray-300 mt-2">值符{c.zhiFuStar}值使{c.zhiFuGate} · 阳顺阴逆 · 九星八门八神</p>
      </main>
    </div>
  );
}
