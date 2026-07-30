"use client";

import { useState, useMemo, useCallback } from "react";

// ─── Constants ───
const HS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EB = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const JZ = Array.from({length:60},(_,i)=>HS[i%10]+EB[i%12]);

const STEM_ORDER = ["戊","己","庚","辛","壬","癸","丁","丙","乙"];
const NINE_STARS = ["天蓬","天任","天冲","天辅","天英","天芮","天柱","天心","天禽"];
const EIGHT_GATES = ["休","生","伤","杜","景","死","惊","开"];
const GATE_EARTH: Record<string,number> = {"休":1,"生":8,"伤":3,"杜":4,"景":9,"死":2,"惊":7,"开":6};
const DEITIES_ORDER = ["值符","螣蛇","太阴","六合","白虎","玄武","九地","九天"];
const BRANCH_PALACE: Record<string,number> = {"子":1,"丑":8,"寅":8,"卯":3,"辰":4,"巳":4,"午":9,"未":2,"申":2,"酉":7,"戌":6,"亥":6};

// 五行 → 长生 state lookup per stem
const CHANGSHENG_ORDER = ["长生","沐浴","冠带","临官","帝旺","衰","病","死","墓","绝","胎","养"];
const CS_START: Record<string,number> = {"甲":0,"乙":7,"丙":4,"丁":1,"戊":4,"己":1,"庚":8,"辛":11,"壬":4,"癸":11};
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

// 入墓 branches per stem
const GRAVE: Record<string,string> = {"甲":"未","乙":"戌","丙":"戌","丁":"丑","戊":"戌","己":"丑","庚":"丑","辛":"辰","壬":"辰","癸":"未"};
// 击刑: branch pair clashes within same element
const JI_XING: Record<string,string[]> = {"寅":["巳"],"巳":["寅","申"],"申":["巳","寅"],"子":["卯"],"卯":["子"],"午":["午"],"酉":["酉"],"亥":["亥"]};

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

// ─── Calendar Helpers ───
function stemBranchYear(y:number):string { return HS[(y-4)%10] + EB[(y-4)%12]; }
function stemBranchMonth(y:number,m:number):string {
  const yb = EB.indexOf(stemBranchYear(y)[1]);
  const mb = (m-1)*2 + (yb>=2?2:0);
  return HS[(y*2+mb)%10] + EB[mb%12];
}
function stemBranchDay(y:number,m:number,d:number):string {
  const base = new Date(1900,0,31).getTime();
  const target = new Date(y,m-1,d).getTime();
  const diff = Math.floor((target-base)/86400000);
  return JZ[(diff+10)%60];
}
function stemBranchHour(dayStem:string,h:number):string {
  const hb = Math.floor(((h+1)%24)/2);
  return HS[(HS.indexOf(dayStem)*2+hb)%10] + EB[hb];
}
function kongWang(dayBranch:string):[string,string] {
  const idx = EB.indexOf(dayBranch);
  const xun = Math.floor(idx/10)*10;
  const missing = [EB[(xun+10)%12], EB[(xun+11)%12]];
  return [missing[0], missing[1]];
}
function maStar(branchTriad:string):string {
  for (const [k,v] of Object.entries(MA_STAR_BRANCH))
    if (k.includes(branchTriad)) return v;
  return "";
}

// ─── Core Calculation ───
function calcQiMen(y:number,m:number,d:number,h:number) {
  // Solar term
  const dv = m*100+d;
  let termIdx = TERMS.length-1;
  for (let i=TERMS.length-1;i>=0;i--) if(dv>=TERMS[i].m*100+TERMS[i].d){termIdx=i;break;}
  const term = TERMS[termIdx];
  const nextTerm = TERMS[(termIdx+1)%TERMS.length];
  const termRange = `${term.name}${term.m}.${String(term.d).padStart(2,"0")}~${nextTerm.name}${nextTerm.m}.${String(nextTerm.d).padStart(2,"0")}`;
  const {ju, yy, name: termName} = term;
  const isYang = yy === "yang";

  // 四柱
  const yz = stemBranchYear(y);
  const mz = stemBranchMonth(y,m);
  const dz = stemBranchDay(y,m,d);
  const ds = dz[0];
  const db = dz[1];
  const hz = stemBranchHour(ds,h);
  const kw = kongWang(db);
  const ma = maStar(db);

  // Hour pillar
  const dbIdx = EB.indexOf(db);
  const hbIdx = Math.floor(((h+1)%24)/2);
  const hb = EB[hbIdx];

  // 旬首
  const xunIdx = Math.floor(JZ.indexOf(hz)/10)*10;
  const xunShou = JZ[xunIdx];
  const xsBranch = xunShou[1];

  // 元
  const yuanIdx = Math.floor(dbIdx/5)%3;
  const yuan = ["上元","中元","下元"][yuanIdx];

  // Earth Plate
  const earth: Record<number,string> = {};
  const palaceSeq = isYang ? [1,8,3,4,9,2,7,6,5] : [9,8,7,6,5,4,3,2,1];
  const startStemIdx = (ju-1)%9;
  for (let i=0;i<9;i++) {
    const pal = palaceSeq[i];
    const si = isYang ? (startStemIdx+i)%9 : (startStemIdx-i+9)%9;
    earth[pal] = STEM_ORDER[si];
  }

  // 值符 star + 值使 gate
  const zfPalace = BRANCH_PALACE[xsBranch] || 5;
  const zfStar = NINE_STARS[zfPalace-1];
  const zfGate = EIGHT_GATES[zfPalace===5?1:zfPalace-1];

  // Heaven Plate
  const hourPalace = BRANCH_PALACE[hb] || 5;
  const heaven: Record<number,string> = {};
  const zfStarIdx = zfPalace-1;
  for (let pal=1;pal<=9;pal++) {
    const shift = (pal-1-zfStarIdx+9)%9;
    const targetPal = ((hourPalace-1+shift)%9)+1;
    heaven[targetPal] = NINE_STARS[pal-1];
  }

  // Human Plate (gates)
  const branchDiff = (EB.indexOf(hb)-EB.indexOf(xsBranch)+12)%12;
  const human: Record<number,string> = {};
  for (let pal=1;pal<=9;pal++) {
    if (pal===5){human[5]="—";continue;}
    const origGate = EIGHT_GATES[(pal===5?1:pal)-1];
    const origIdx = EIGHT_GATES.indexOf(origGate);
    const newIdx = (origIdx+branchDiff)%8;
    human[pal] = EIGHT_GATES[newIdx];
  }

  // Spirit Plate
  const spirit: Record<number,string> = {};
  for (let i=0;i<8;i++) {
    const pal = isYang ? ((hourPalace-1+i)%9)+1 : ((hourPalace-1-i+9)%9)+1;
    if (pal===5)continue;
    spirit[pal] = DEITIES_ORDER[i];
  }

  // 长生 state for earth stem in each palace
  const changSheng: Record<number,string> = {};
  for (let pal=1;pal<=9;pal++) {
    const stem = earth[pal];
    if (!stem||stem==="—") { changSheng[pal]="—"; continue; }
    const branchArr = CS_BRANCH[stem];
    if (!branchArr) { changSheng[pal]="—"; continue; }
    // Find which branch position this palace's element corresponds to
    const palBranch = Object.keys(BRANCH_PALACE).find(b=>BRANCH_PALACE[b]===pal)||"子";
    const idx = branchArr.indexOf(palBranch);
    changSheng[pal] = idx>=0 ? CHANGSHENG_ORDER[idx] : "—";
  }

  // Detect conditions: 入墓, 击刑, 门迫
  const conditions: Record<number,string[]> = {};
  for (let pal=1;pal<=9;pal++) {
    conditions[pal] = [];
    const stem = earth[pal];
    const gate = human[pal];
    // 门迫: gate element 克 palace element
    const gateEl: Record<string,string> = {"休":"水","生":"土","伤":"木","杜":"木","景":"火","死":"土","惊":"金","开":"金"};
    const palaceEl = PL[pal].e;
    const ge = gateEl[gate];
    if (ge && (
      (ge==="木"&&palaceEl==="土")||(ge==="土"&&palaceEl==="水")||
      (ge==="水"&&palaceEl==="火")||(ge==="火"&&palaceEl==="金")||
      (ge==="金"&&palaceEl==="木")
    )) conditions[pal].push("门迫");

    // 入墓
    if (stem && GRAVE[stem]) {
      const palBranch = Object.keys(BRANCH_PALACE).find(b=>BRANCH_PALACE[b]===pal);
      if (palBranch===GRAVE[stem]) conditions[pal].push("入墓");
    }
  }

  return { termName, termRange, ju, isYang, yuan,
    yz, mz, dz, hz, kw, ma, xunShou, zfStar, zfGate, zfPalace, hourPalace,
    earth, heaven, human, spirit, changSheng, conditions };
}

// ─── UI ───
const PALACE_ORDER = [4,9,2,3,5,7,8,1,6];

function conditionColor(conds:string[]):string {
  if (conds.length===0) return "";
  if (conds.includes("门迫")&&conds.includes("入墓")) return "text-red-600 bg-red-100 ring-1 ring-red-400";
  if (conds.includes("门迫")) return "text-orange-600 ring-1 ring-orange-400";
  if (conds.includes("入墓")) return "text-purple-600 ring-1 ring-purple-400";
  return "";
}

export default function QiMenPage() {
  const now = new Date();
  const [Y, setY] = useState(now.getFullYear());
  const [M, setM] = useState(now.getMonth()+1);
  const [D, setD] = useState(now.getDate());
  const [H, setH] = useState(now.getHours());
  const [selectedPalace, setSelectedPalace] = useState<number|null>(null);
  const [showEarthGods, setShowEarthGods] = useState(false);

  const c = useMemo(()=>calcQiMen(Y,M,D,H),[Y,M,D,H]);

  const adjustDate = useCallback((dir:1|-1)=>{
    const dt = new Date(Y,M-1,D,H);
    dt.setHours(dt.getHours()+dir*(showEarthGods?1:2));
    setY(dt.getFullYear()); setM(dt.getMonth()+1); setD(dt.getDate()); setH(dt.getHours());
  },[Y,M,D,H,showEarthGods]);

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[600px] mx-auto px-2 py-3">
        {/* Title */}
        <div className="text-center mb-3">
          <div className="text-xs text-gray-400">盘式</div>
          <div className="text-sm font-semibold">转盘奇门-寄坤宫-拆补-值使门起</div>
        </div>

        {/* Date */}
        <div className="text-center mb-3">
          <div className="text-xs text-gray-400">日期</div>
          <div className="text-sm font-medium">{Y}年{M}月{D}日{H}:00</div>
        </div>

        {/* 四柱 */}
        <div className="grid grid-cols-5 gap-1 mb-3 text-center text-xs">
          {[
            {l:"",v:""},{l:"年柱",v:c.yz},{l:"月柱",v:c.mz},{l:"日柱",v:c.dz},{l:"时柱",v:c.hz}
          ].map((x,i)=>(
            <div key={i} className={i===0?"text-gray-400":""}>{x.l||"四柱"}</div>
          ))}
          {[
            {l:"空亡",v:""},{l:"",v:c.kw[0]+c.kw[1]},{l:"",v:c.kw[0]+c.kw[1]},{
              l:"",v:c.kw[0]+c.kw[1]
            },{l:"",v:c.kw[0]+c.kw[1]}
          ].map((x,i)=>(
            <div key={i} className="text-gray-500">{x.v||"空亡"}</div>
          ))}
        </div>

        {/* Info bar */}
        <div className="space-y-1 text-xs mb-4">
          <div className="flex justify-center gap-4 text-gray-500">
            <span>节气 {c.termRange}</span>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <span>局数 <b>{c.termName}中元{c.isYang?"阳":"阴"}{c.ju}</b></span>
            <span>值符 <b className="text-red-600">{c.zfStar}</b></span>
            <span>旬首 <b>{c.xunShou}</b></span>
            <span>值使 <b>{c.zfGate}</b></span>
            <span>马星 <b className="text-blue-600">{c.ma}</b></span>
          </div>
        </div>

        {/* Nine Palaces Grid */}
        <div className="grid grid-cols-3 gap-[2px] mb-4 bg-gray-300 rounded-lg overflow-hidden border-[3px] border-gray-300">
          {PALACE_ORDER.map(palace=>{
            const pl = PL[palace];
            const isCenter = palace===5;
            const heaven = c.heaven[palace]||"—";
            const human = c.human[palace]||"—";
            const spirit = c.spirit[palace]||"";
            const earth = c.earth[palace]||"—";
            const cs = c.changSheng[palace]||"";
            const conds = c.conditions[palace]||[];
            const isValue = palace===c.zfPalace;
            const isSelected = selectedPalace===palace;

            // Deity color
            const deityColors: Record<string,string> = {
              "值符":"text-red-600","螣蛇":"text-orange-500","太阴":"text-indigo-500",
              "六合":"text-emerald-600","白虎":"text-gray-700","玄武":"text-blue-600",
              "九地":"text-amber-600","九天":"text-sky-600"
            };

            return (
              <div key={palace}
                onClick={()=>setSelectedPalace(isSelected?null:palace)}
                className={`relative aspect-square cursor-pointer bg-white p-1 flex flex-col
                  ${isCenter?"bg-amber-50":""} ${isValue?"shadow-[inset_0_0_0_2px_#ef4444]":""}
                  ${isSelected?"ring-2 ring-gray-900":""}`}>
                
                {/* Top row: trigram + direction */}
                <div className="flex justify-between text-[9px]">
                  <span className="text-gray-300">{pl.t}</span>
                  <span className="text-gray-400">{pl.d}</span>
                </div>

                {/* Spirit/Deity */}
                {spirit&&(
                  <div className={`text-[10px] font-bold text-center leading-tight ${deityColors[spirit]||"text-purple-600"}`}>
                    {spirit}
                  </div>
                )}

                {/* Heaven Star + Earth Stem in one row */}
                <div className="flex justify-between items-center mt-0.5 px-0.5">
                  <span className="text-[11px] font-semibold text-blue-700">{heaven}</span>
                  <span className="text-[12px] font-bold text-gray-800">{earth}</span>
                </div>

                {/* Human Gate */}
                <div className={`text-center text-[13px] font-black leading-tight ${
                  human==="生"?"text-emerald-600":human==="死"?"text-gray-500":
                  human==="开"?"text-amber-600":human==="休"?"text-blue-600":
                  human==="景"?"text-red-500":human==="惊"?"text-orange-600":
                  "text-red-600"}`}>
                  {human}
                </div>

                {/* 长生 + Conditions */}
                <div className="flex justify-between items-end mt-auto text-[8px]">
                  <span className="text-gray-400">{cs}</span>
                  {conds.length>0&&(
                    <span className={`px-0.5 rounded ${conditionColor(conds)}`}>
                      {conds.join("+")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Palace Detail */}
        {selectedPalace&&(()=>{
          const p=PL[selectedPalace];
          return (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-semibold mb-2">{p.t} {selectedPalace}宫 · {p.e} · {p.d}方</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-gray-400">神:</span> <b className="text-purple-600">{c.spirit[selectedPalace]||"—"}</b></div>
                <div><span className="text-gray-400">星:</span> <b className="text-blue-600">{c.heaven[selectedPalace]||"—"}</b></div>
                <div><span className="text-gray-400">门:</span> <b className="text-red-600">{c.human[selectedPalace]||"—"}</b></div>
                <div><span className="text-gray-400">干:</span> <b>{c.earth[selectedPalace]||"—"}</b></div>
                <div><span className="text-gray-400">长生:</span> {c.changSheng[selectedPalace]||"—"}</div>
                <div><span className="text-gray-400">状态:</span> {(c.conditions[selectedPalace]||[]).join("+")||"正常"}</div>
              </div>
            </div>
          );
        })()}

        {/* Color Legend */}
        <div className="flex justify-center gap-3 mb-3 text-[10px] text-gray-400 flex-wrap">
          <span className="text-red-500">●符使</span>
          <span className="text-purple-500">●入墓</span>
          <span className="text-orange-500">●门迫</span>
          <span className="text-gray-500">门迫+入墓</span>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-2">
          <button onClick={()=>adjustDate(-1)}
            className="px-4 py-1.5 border rounded-lg text-xs hover:bg-gray-50">上一局</button>
          <button onClick={()=>setShowEarthGods(!showEarthGods)}
            className={`px-3 py-1.5 border rounded-lg text-xs ${showEarthGods?"bg-gray-100":""}`}>
            地盘八神
          </button>
          <button onClick={()=>adjustDate(1)}
            className="px-4 py-1.5 border rounded-lg text-xs hover:bg-gray-50">下一局</button>
        </div>

        {showEarthGods&&(
          <div className="mb-3 text-center text-xs text-gray-500">
            地盘八神: {DEITIES_ORDER.join(" → ")}
          </div>
        )}

        <p className="text-center text-[9px] text-gray-300">点击宫位查看详细信息</p>
      </main>
    </div>
  );
}
