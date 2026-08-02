"use client";

import { useState, useMemo, useCallback } from "react";

// ─── Constants ───
const HS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EB = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const JZ = Array.from({length:60},(_,i)=>HS[i%10]+EB[i%12]);
const STEM_ORDER = ["戊","己","庚","辛","壬","癸","丁","丙","乙"];
const NINE_STARS = ["天蓬","天任","天冲","天辅","天英","天芮","天柱","天心","天禽"];
const EIGHT_GATES = ["休","生","伤","杜","景","死","惊","开"];
const DEITIES_ORDER = ["值符","螣蛇","太阴","六合","白虎","玄武","九地","九天"];
const BRANCH_PALACE: Record<string,number> = {"子":1,"丑":8,"寅":8,"卯":3,"辰":4,"巳":4,"午":9,"未":2,"申":2,"酉":7,"戌":6,"亥":6};
const PL: Record<number,{t:string;e:string;d:string}> = {
  1:{t:"☵",e:"水",d:"北"},2:{t:"☷",e:"土",d:"西南"},3:{t:"☳",e:"木",d:"东"},4:{t:"☴",e:"木",d:"东南"},
  5:{t:"◎",e:"土",d:"中"},6:{t:"☰",e:"金",d:"西北"},7:{t:"☱",e:"金",d:"西"},8:{t:"☶",e:"土",d:"东北"},9:{t:"☲",e:"火",d:"南"},
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
const CHANGSHENG_ORDER = ["长生","沐浴","冠带","临官","帝旺","衰","病","死","墓","绝","胎","养"];
const CS_BRANCH: Record<string,string[]> = {
  "甲":["亥","子","丑","寅","卯","辰","巳","午","未","申","酉","戌"],
  "乙":["午","巳","辰","卯","寅","丑","子","亥","戌","酉","申","未"],
  "丙":["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"],
  "丁":["酉","申","未","午","巳","辰","卯","寅","丑","子","亥","戌"],
  "戊":["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"],
  "己":["酉","申","未","午","巳","辰","卯","寅","丑","子","亥","戌"],
  "庚":["巳","午","未","申","酉","戌","亥","子","丑","寅","卯","辰"],
  "辛":["子","亥","戌","酉","申","未","午","巳","辰","卯","寅","丑"],
  "壬":["申","酉","戌","亥","子","丑","寅","卯","辰","巳","午","未"],
  "癸":["卯","寅","丑","子","亥","戌","酉","申","未","午","巳","辰"],
};
const MA_STAR_BRANCH: Record<string,string> = {"申子辰":"寅","寅午戌":"申","巳酉丑":"亥","亥卯未":"巳"};
const GRAVE: Record<string,string> = {"甲":"未","乙":"戌","丙":"戌","丁":"丑","戊":"戌","己":"丑","庚":"丑","辛":"辰","壬":"辰","癸":"未"};

// ─── Calendar ───
function stemBranchYear(y:number):string { return HS[(y-4)%10]+EB[(y-4)%12]; }
function stemBranchMonth(y:number,m:number):string {
  const yb=EB.indexOf(stemBranchYear(y)[1]); const mb=(m-1)*2+(yb>=2?2:0);
  return HS[(y*2+mb)%10]+EB[mb%12];
}
function stemBranchDay(y:number,m:number,d:number):string {
  const base=new Date(1900,0,31).getTime(), target=new Date(y,m-1,d).getTime();
  return JZ[(Math.floor((target-base)/86400000)+10)%60];
}
function stemBranchHour(ds:string,h:number):string {
  return HS[(HS.indexOf(ds)*2+Math.floor(((h+1)%24)/2))%10]+EB[Math.floor(((h+1)%24)/2)];
}
function kongWang(db:string):[string,string] {
  const idx=EB.indexOf(db), xun=Math.floor(idx/10)*10;
  return [EB[(xun+10)%12],EB[(xun+11)%12]];
}
function maStar(db:string):string {
  for(const[k,v]of Object.entries(MA_STAR_BRANCH)) if(k.includes(db))return v; return "";
}

// ─── Core ───
function calcQiMen(y:number,m:number,d:number,h:number) {
  const dv=m*100+d; let ti=TERMS.length-1;
  for(let i=TERMS.length-1;i>=0;i--) if(dv>=TERMS[i].m*100+TERMS[i].d){ti=i;break;}
  const term=TERMS[ti], nt=TERMS[(ti+1)%TERMS.length];
  const termRange=`${term.name}${term.m}.${String(term.d).padStart(2,"0")}~${nt.name}${nt.m}.${String(nt.d).padStart(2,"0")}`;
  const {ju,yy}=term; const isYang=yy==="yang";
  const yz=stemBranchYear(y), mz=stemBranchMonth(y,m), dz=stemBranchDay(y,m,d);
  const ds=dz[0], db=dz[1], hz=stemBranchHour(ds,h);
  const kw=kongWang(db), ma=maStar(db);
  const hbIdx=Math.floor(((h+1)%24)/2), hb=EB[hbIdx];
  const xunIdx=Math.floor(JZ.indexOf(hz)/10)*10, xunShou=JZ[xunIdx], xsBranch=xunShou[1];
  const yuanIdx=Math.floor(EB.indexOf(db)/5)%3;
  const yuan=["上元","中元","下元"][yuanIdx];

  // Earth
  const earth:Record<number,string>={};
  const pseq=isYang?[1,8,3,4,9,2,7,6,5]:[9,8,7,6,5,4,3,2,1];
  for(let i=0;i<9;i++){const si=isYang?((ju-1)%9+i)%9:((ju-1)%9-i+9)%9; earth[pseq[i]]=STEM_ORDER[si];}

  // 值符值使
  const zfPalace=BRANCH_PALACE[xsBranch]||5, zfStar=NINE_STARS[zfPalace-1];
  const zfGate=EIGHT_GATES[zfPalace===5?1:zfPalace-1];
  const hp=BRANCH_PALACE[hb]||5;

  // Heaven
  const heaven:Record<number,string>={};
  for(let p=1;p<=9;p++){const s=(p-1-zfPalace+1+9)%9; heaven[((hp-1+s)%9)+1]=NINE_STARS[p-1];}

  // Human
  const bd=(EB.indexOf(hb)-EB.indexOf(xsBranch)+12)%12;
  const human:Record<number,string>={};
  for(let p=1;p<=9;p++){
    if(p===5){human[5]="";continue;}
    human[p]=EIGHT_GATES[(EIGHT_GATES.indexOf(EIGHT_GATES[p===5?1:p-1])+bd)%8];
  }

  // Spirit
  const spirit:Record<number,string>={};
  for(let i=0;i<8;i++){const p=isYang?((hp-1+i)%9)+1:((hp-1-i+9)%9)+1; if(p!==5)spirit[p]=DEITIES_ORDER[i];}

  // 长生
  const cs:Record<number,string>={};
  for(let p=1;p<=9;p++){
    const stem=earth[p]; if(!stem){cs[p]="";continue;}
    const ba=CS_BRANCH[stem]; if(!ba){cs[p]="";continue;}
    const pb=Object.keys(BRANCH_PALACE).find(b=>BRANCH_PALACE[b]===p)||"";
    const idx=ba.indexOf(pb); cs[p]=idx>=0?CHANGSHENG_ORDER[idx]:"";
  }

  // Conditions
  const conds:Record<number,string[]>={};
  const gateEl:Record<string,string>={"休":"水","生":"土","伤":"木","杜":"木","景":"火","死":"土","惊":"金","开":"金"};
  for(let p=1;p<=9;p++){
    conds[p]=[];
    const stem=earth[p], gate=human[p], ge=gateEl[gate], pe=PL[p].e;
    if(ge&&((ge==="木"&&pe==="土")||(ge==="土"&&pe==="水")||(ge==="水"&&pe==="火")||(ge==="火"&&pe==="金")||(ge==="金"&&pe==="木")))conds[p].push("门迫");
    if(stem&&GRAVE[stem]){
      const pb=Object.keys(BRANCH_PALACE).find(b=>BRANCH_PALACE[b]===p);
      if(pb===GRAVE[stem])conds[p].push("入墓");
    }
  }

  return {termRange,ju,isYang,yuan,yz,mz,dz,hz,kw,ma,xunShou,zfStar,zfGate,zfPalace,hp,earth,heaven,human,spirit,cs,conds};
}

const PALACE_ORDER=[4,9,2,3,5,7,8,1,6];

export default function QiMenPage() {
  const now=new Date();
  const [Y,setY]=useState(now.getFullYear());
  const [M,setM]=useState(now.getMonth()+1);
  const [D,setD]=useState(now.getDate());
  const [H,setH]=useState(now.getHours());
  const [sel,setSel]=useState<number|null>(null);
  const [showEG,setShowEG]=useState(false);

  const c=useMemo(()=>calcQiMen(Y,M,D,H),[Y,M,D,H]);
  const adj=useCallback((d:1|-1)=>{
    const dt=new Date(Y,M-1,D,H); dt.setHours(dt.getHours()+d*(showEG?1:2));
    setY(dt.getFullYear());setM(dt.getMonth()+1);setD(dt.getDate());setH(dt.getHours());
  },[Y,M,D,H,showEG]);

  const deityColor:Record<string,string>={
    "值符":"text-red-600","螣蛇":"text-orange-500","太阴":"text-indigo-500",
    "六合":"text-emerald-600","白虎":"text-gray-700","玄武":"text-blue-600",
    "九地":"text-amber-600","九天":"text-sky-600"
  };
  const gateColor=(g:string)=>g==="生"?"text-emerald-600":g==="死"?"text-gray-500":g==="开"?"text-amber-600":g==="休"?"text-blue-600":g==="景"?"text-red-500":g==="惊"?"text-orange-600":g==="伤"?"text-rose-600":"text-red-600";

  const pillars=[{l:"年柱",v:c.yz},{l:"月柱",v:c.mz},{l:"日柱",v:c.dz},{l:"时柱",v:c.hz}];

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[420px] mx-auto px-3 py-3">

        {/* Header: 盘式 + 日期 */}
        <div className="text-center mb-3">
          <div className="text-[10px] text-gray-400 mb-0.5">盘式</div>
          <div className="text-sm font-semibold mb-2">转盘奇门-寄坤宫-拆补-值使门起</div>
          <div className="text-[10px] text-gray-400 mb-0.5">日期</div>
          <div className="text-[15px] font-medium">{Y}年{M}月{D}日{H}:00 (四月{M>2?"初":"廿"}{D})</div>
        </div>

        {/* 四柱 Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-1.5 text-gray-400 font-normal w-[20%]">四柱</th>
                {pillars.map((x,i)=>(
                  <th key={i} className="py-1.5 text-gray-500 font-normal">{x.l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-1.5 text-gray-400">干支</td>
                {pillars.map((x,i)=>(
                  <td key={i} className="py-1.5 font-semibold text-[13px]">{x.v}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 text-gray-400">空亡</td>
                {[...Array(4)].map((_,i)=>(
                  <td key={i} className="py-1.5 text-gray-400 text-[11px]">{c.kw[0]}{c.kw[1]}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Info row */}
        <div className="text-center text-[10px] mb-3 space-y-1">
          <div className="text-gray-500">节气 {c.termRange}</div>
          <div className="flex justify-center gap-3 flex-wrap text-gray-600">
            <span>局数 <b>{c.isYang?"阳":"阴"}{c.ju}</b></span>
            <span>值符 <b className="text-red-600">{c.zfStar}</b></span>
            <span>旬首 <b>{c.xunShou}</b></span>
            <span>值使 <b>{c.zfGate}</b></span>
            <span>马星 <b className="text-blue-600">{c.ma}</b></span>
          </div>
        </div>

        {/* Nine Palaces Grid */}
        <div className="grid grid-cols-3 gap-[2px] mb-3 bg-gray-300 rounded-lg overflow-hidden border-[3px] border-gray-300">
          {PALACE_ORDER.map(palace=>{
            const pl=PL[palace];
            const isCenter=palace===5;
            const heaven=c.heaven[palace]||"";
            const human=c.human[palace]||"";
            const spirit=c.spirit[palace]||"";
            const earth=c.earth[palace]||"";
            const cs=c.cs[palace]||"";
            const conds=c.conds[palace]||[];
            const isValue=palace===c.zfPalace;
            const isSelected=sel===palace;

            return (
              <div key={palace}
                onClick={()=>setSel(isSelected?null:palace)}
                className={`relative aspect-square cursor-pointer flex flex-col
                  ${isSelected?"ring-[3px] ring-gray-800 z-10":""}`}
                style={{background:isCenter?"#fffbeb":isValue?"#fef2f2":"#fff"}}>

                {/* Condition dots — top-right corner */}
                {conds.length>0 && (
                  <div className="absolute top-1 right-1 flex gap-0.5">
                    {conds.includes("入墓") && <span className="w-2 h-2 rounded-full bg-purple-500" title="入墓"/>}
                    {conds.includes("门迫") && <span className="w-2 h-2 rounded-full bg-orange-500" title="门迫"/>}
                  </div>
                )}

                {/* Top label: trigram · direction · palace# */}
                <div className="flex justify-between items-center text-[9px] px-1 pt-1">
                  <span className="text-gray-300">{pl.t}</span>
                  <span className="text-gray-400">{pl.d}{palace}</span>
                </div>

                {/* Spirit — row */}
                <div className={`text-center text-[11px] font-bold leading-tight ${deityColor[spirit]||"text-gray-300"}`}>
                  {spirit||"—"}
                </div>

                {/* Star + Element */}
                <div className="flex justify-between items-center px-1.5 mt-0.5">
                  <span className="text-[11px] font-semibold text-blue-600">{heaven}</span>
                  <span className="text-[9px] text-gray-300">{pl.e}</span>
                </div>

                {/* Gate — large and centered */}
                <div className={`flex-1 flex items-center justify-center text-[20px] font-black ${gateColor(human)}`}>
                  {human}
                </div>

                {/* Stem + 长生 */}
                <div className="flex justify-between items-end px-1.5 pb-1">
                  <span className="text-[9px] text-gray-300">{cs||"·"}</span>
                  <span className="text-[16px] font-bold text-gray-800">{earth}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Palace Detail */}
        {sel&&(()=>{
          const p=PL[sel];
          return (
            <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <div className="font-semibold mb-2">{p.t} {sel}宫 · {p.e} · {p.d}方</div>
              <div className="grid grid-cols-3 gap-2">
                <div>神: <b className="text-purple-600">{c.spirit[sel]||"—"}</b></div>
                <div>星: <b className="text-blue-600">{c.heaven[sel]||"—"}</b></div>
                <div>门: <b className="text-red-600">{c.human[sel]||"—"}</b></div>
                <div>干: <b>{c.earth[sel]||"—"}</b></div>
                <div>长生: {c.cs[sel]||"—"}</div>
                <div>状态: {(c.conds[sel]||[]).join("+")||"正常"}</div>
              </div>
            </div>
          );
        })()}

        {/* Legend + Nav */}
        <div className="text-center text-[10px] text-gray-400 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 align-middle mr-1"/>
          <span className="mr-3">符使</span>
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 align-middle mr-1"/>
          <span className="mr-3">入墓</span>
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 align-middle mr-1"/>
          <span>门迫</span>
        </div>

        <div className="flex justify-center gap-4 mb-2">
          <button onClick={()=>adj(-1)} className="px-4 py-1.5 border rounded-lg text-xs hover:bg-gray-50">上一局</button>
          <button onClick={()=>setShowEG(!showEG)} className={`px-3 py-1.5 border rounded-lg text-xs ${showEG?"bg-gray-100":""}`}>地盘八神</button>
          <button onClick={()=>adj(1)} className="px-4 py-1.5 border rounded-lg text-xs hover:bg-gray-50">下一局</button>
        </div>

        {showEG&&(
          <div className="mb-2 text-center text-xs text-gray-500">
            地盘八神: {DEITIES_ORDER.join(" → ")}
          </div>
        )}

        <p className="text-center text-[9px] text-gray-300">点击宫位查看详细信息</p>
      </main>
    </div>
  );
}
