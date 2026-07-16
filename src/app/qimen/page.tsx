"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// ── 24 Solar Terms (approximate dates for 2026) ──
const SOLAR_TERMS_2026 = [
  { name: "冬至", nameEn: "Winter Solstice", month: 1, day: 5, dun: 1, yinYang: "yang" },  // 冬至一阳生 → 阳遁
  { name: "小寒", nameEn: "Minor Cold", month: 1, day: 5, dun: 2, yinYang: "yang" },
  { name: "大寒", nameEn: "Major Cold", month: 1, day: 20, dun: 3, yinYang: "yang" },
  { name: "立春", nameEn: "Spring Begins", month: 2, day: 4, dun: 8, yinYang: "yang" },
  { name: "雨水", nameEn: "Rain Water", month: 2, day: 19, dun: 9, yinYang: "yang" },
  { name: "惊蛰", nameEn: "Awakening", month: 3, day: 5, dun: 1, yinYang: "yang" },
  { name: "春分", nameEn: "Spring Equinox", month: 3, day: 20, dun: 3, yinYang: "yang" },
  { name: "清明", nameEn: "Clear Bright", month: 4, day: 5, dun: 4, yinYang: "yang" },
  { name: "谷雨", nameEn: "Grain Rain", month: 4, day: 20, dun: 5, yinYang: "yang" },
  { name: "立夏", nameEn: "Summer Begins", month: 5, day: 5, dun: 6, yinYang: "yang" },
  { name: "小满", nameEn: "Grain Full", month: 5, day: 21, dun: 7, yinYang: "yang" },
  { name: "芒种", nameEn: "Grain in Ear", month: 6, day: 6, dun: 8, yinYang: "yang" },
  { name: "夏至", nameEn: "Summer Solstice", month: 6, day: 21, dun: 9, yinYang: "yin" },  // 夏至一阴生 → 阴遁
  { name: "小暑", nameEn: "Minor Heat", month: 7, day: 7, dun: 8, yinYang: "yin" },
  { name: "大暑", nameEn: "Major Heat", month: 7, day: 23, dun: 7, yinYang: "yin" },
  { name: "立秋", nameEn: "Autumn Begins", month: 8, day: 7, dun: 2, yinYang: "yin" },
  { name: "处暑", nameEn: "End of Heat", month: 8, day: 23, dun: 1, yinYang: "yin" },
  { name: "白露", nameEn: "White Dew", month: 9, day: 8, dun: 9, yinYang: "yin" },
  { name: "秋分", nameEn: "Autumn Equinox", month: 9, day: 23, dun: 7, yinYang: "yin" },
  { name: "寒露", nameEn: "Cold Dew", month: 10, day: 8, dun: 6, yinYang: "yin" },
  { name: "霜降", nameEn: "Frost Fall", month: 10, day: 23, dun: 5, yinYang: "yin" },
  { name: "立冬", nameEn: "Winter Begins", month: 11, day: 7, dun: 4, yinYang: "yin" },
  { name: "小雪", nameEn: "Minor Snow", month: 11, day: 22, dun: 3, yinYang: "yin" },
  { name: "大雪", nameEn: "Major Snow", month: 12, day: 7, dun: 2, yinYang: "yin" },
  { name: "冬至", nameEn: "Winter Solstice", month: 12, day: 22, dun: 1, yinYang: "yang" },
];

// Heavenly Stems and Earthly Branches
const STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

// 8 Gates (八门) — fixed position on earth plate
const GATES = ["休","生","伤","杜","景","死","惊","开"];
const GATE_EN = ["Rest","Life","Injury","Obstruction","View","Death","Fright","Open"];

// 9 Stars (九星)
const STARS = ["天蓬","天芮","天冲","天辅","天禽","天心","天柱","天任","天英"];

// Palace positions (九宫): 1-9 in 洛书 layout
// 4 9 2
// 3 5 7
// 8 1 6
const PALACE_GRID = [4,9,2,3,5,7,8,1,6];

// Palace names
const PALACES: Record<number, {name:string, trigram:string, element:string, direction:string}> = {
  1: {name:"坎一宫", trigram:"坎☵", element:"水", direction:"北"},
  2: {name:"坤二宫", trigram:"坤☷", element:"土", direction:"西南"},
  3: {name:"震三宫", trigram:"震☳", element:"木", direction:"东"},
  4: {name:"巽四宫", trigram:"巽☴", element:"木", direction:"东南"},
  5: {name:"中五宫", trigram:"中", element:"土", direction:"中"},
  6: {name:"乾六宫", trigram:"乾☰", element:"金", direction:"西北"},
  7: {name:"兑七宫", trigram:"兑☱", element:"金", direction:"西"},
  8: {name:"艮八宫", trigram:"艮☶", element:"土", direction:"东北"},
  9: {name:"离九宫", trigram:"离☲", element:"火", direction:"南"},
};

// Default earth plate arrangement (地盘) — stems fixed per palace
const FIXED_STEMS: Record<number, string[]> = {
  1: ["癸"],
  2: ["壬","癸"],
  3: ["庚"],
  4: ["辛"],
  5: ["戊"],
  6: ["丁","己"],
  7: ["丙"],
  8: ["乙"],
  9: ["戊"],
};

// Hour stem-branch cycle (60 Jia Zi starts at 甲子)
const JIAZI = Array.from({length:60}, (_,i) => STEMS[i%10] + BRANCHES[i%12]);

function getJiaZiIndex(stem: string, branch: string): number {
  for (let i = 0; i < 60; i++) {
    if (JIAZI[i] === stem + branch) return i;
  }
  return 0;
}

// Calculate hour pillar from day stem and hour (2-hour blocks, 子时=23:00-01:00)
function getHourStemBranch(dayStem: string, hour: number): [string, string] {
  const hourBranchIdx = Math.floor(((hour + 1) % 24) / 2);
  const dayStemIdx = STEMS.indexOf(dayStem);
  const hourStemIdx = (dayStemIdx * 2 + hourBranchIdx) % 10;
  return [STEMS[hourStemIdx], BRANCHES[hourBranchIdx]];
}

// Find which solar term a date falls in
function findSolarTerm(year: number, month: number, day: number) {
  // Simple: use month+day threshold comparisons
  const dateVal = month * 100 + day;
  const terms = SOLAR_TERMS_2026;
  for (let i = terms.length - 1; i >= 0; i--) {
    const t = terms[i];
    const tVal = t.month * 100 + t.day;
    if (dateVal >= tVal) return terms[i];
  }
  return terms[0]; // fallback
}

// Determine 上/中/下 元 based on the day's JiaZi index
function getYuan(jiaZiIndex: number): "上元" | "中元" | "下元" {
  // 甲子→戊辰为上元, 己巳→癸酉为中元, 甲戌→戊寅为下元, cycle repeats every 60
  const phaseOn = Math.floor(jiaZiIndex / 5) % 3;
  return phaseOn === 0 ? "上元" : phaseOn === 1 ? "中元" : "下元";
}

// Get 局 number — simplified: solar term dun + yuan offset
function getJuNumber(term: typeof SOLAR_TERMS_2026[0], jiaZiIndex: number): number {
  const baseNum = term.dun;
  const yuan = Math.floor((jiaZiIndex % 60) / 5) % 3; // 0=上,1=中,2=下
  // For simplicity, use the term's base dun number (full calculation is very complex)
  // Each yuan uses a different dun number in the full system
  return baseNum;
}

// Build earth plate for a given ju number and yin/yang mode
function buildEarthPlate(juNum: number, yinYang: string): Record<number, string[]> {
  // 阳遁顺排, 阴遁逆排
  const plate: Record<number, string[]> = {};
  const palaceOrder = [1,8,3,4,9,2,7,6,5]; // standard fill order (坎艮震巽离坤兑乾中)

  for (let i = 0; i < 9; i++) {
    const palace = palaceOrder[i];
    const stemIdx = yinYang === "yang"
      ? (juNum - 1 + i) % 9  // 阳遁: ju1→坎1=戊, ju2→坎1=己... clockwise (0-indexed from 戊)
      : (9 - (juNum - 1 + i) % 9) % 9; // 阴遁: counter-clockwise
    // Map 0→戊,1→己,2→庚,3→辛,4→壬,5→癸,6→丁,7→丙,8→乙
    const stemMap = ["戊","己","庚","辛","壬","癸","丁","丙","乙"];
    plate[palace] = [stemMap[stemIdx % 9]];
  }
  return plate;
}

const LANG: Record<string, any> = {
  zh: { title:"奇门遁甲排盘", subtitle:"时空能量格局", calc:"生成奇门盘", date:"日期", time:"时间", yangDun:"阳遁", yinDun:"阴遁", solarTerm:"节气", juNum:"局数", yuan:"元", palace:"宫", gate:"门" },
  en: { title:"Qi Men Dun Jia Chart", subtitle:"Time-Space Energy Pattern", calc:"Generate Chart", date:"Date", time:"Time", yangDun:"Yang Dun", yinDun:"Yin Dun", solarTerm:"Solar Term", juNum:"Chart No.", yuan:"Phase", palace:"Palace", gate:"Gate" },
};

export default function QiMenPage() {
  const { language } = useLanguage();
  const t = LANG[language] || LANG.en;
  const now = new Date();

  const [year] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState(now.getHours());
  const [minute] = useState(0);

  const result = useMemo(() => {
    const term = findSolarTerm(year, month, day);
    const dayStemIdx = (year + month + day + 5) % 10;
    const dayStem = STEMS[dayStemIdx];
    const [hourStem, hourBranch] = getHourStemBranch(dayStem, hour);
    const jiaZiIdx = getJiaZiIndex(hourStem, hourBranch);
    const yuan = getYuan(jiaZiIdx);
    const juNum = getJuNumber(term, jiaZiIdx);
    const earthPlate = buildEarthPlate(juNum, term.yinYang);
    return { term, dayStem, hourStem, hourBranch, jiaZiIdx, yuan, juNum, yinYang: term.yinYang, earthPlate };
  }, [year, month, day, hour]);

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[960px] mx-auto px-4 py-8 md:py-16">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-[-1px] text-center mb-2">{t.title}</h1>
        <p className="text-sm text-gray-500 text-center mb-8">{t.subtitle}</p>

        {/* Input */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <select value={month} onChange={e => setMonth(+e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {Array.from({length:12}, (_,i)=>i+1).map(m => <option key={m} value={m}>{String(m).padStart(2,'0')}</option>)}
          </select>
          <select value={day} onChange={e => setDay(+e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {Array.from({length:31}, (_,i)=>i+1).map(d => <option key={d} value={d}>{String(d).padStart(2,'0')}</option>)}
          </select>
          <select value={hour} onChange={e => setHour(+e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {Array.from({length:24}, (_,i)=>i).map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>)}
          </select>
        </div>

        {/* Chart Info */}
        <div className="grid grid-cols-4 gap-2 mb-8 max-w-[500px] mx-auto text-center">
          <div className="bg-gray-50 rounded-lg p-3"><div className="text-[10px] text-gray-400">{t.solarTerm}</div><div className="text-sm font-bold">{result.term.name}</div></div>
          <div className="bg-gray-50 rounded-lg p-3"><div className="text-[10px] text-gray-400">{t.yuan}</div><div className="text-sm font-bold">{result.yuan}</div></div>
          <div className="bg-gray-50 rounded-lg p-3"><div className="text-[10px] text-gray-400">{t.juNum}</div><div className="text-sm font-bold">{result.yinYang === "yang" ? "阳" : "阴"}{result.juNum}</div></div>
          <div className="bg-gray-50 rounded-lg p-3"><div className="text-[10px] text-gray-400">时辰</div><div className="text-sm font-bold">{result.hourStem}{result.hourBranch}</div></div>
        </div>

        {/* 九宫 Grid */}
        <div className="grid grid-cols-3 gap-2 max-w-[420px] mx-auto">
          {[4,9,2,3,5,7,8,1,6].map(palace => {
            const p = PALACES[palace];
            const stems = result.earthPlate[palace] || [];
            return (
              <div key={palace} className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center text-center p-2 ${palace === 5 ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-[10px] text-gray-400">{p.name}</div>
                <div className="text-lg font-bold">{stems[0] || "—"}</div>
                <div className="text-[10px] text-gray-400">{p.trigram}</div>
                <div className="text-[9px] text-gray-300">{p.element}·{p.direction}</div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">奇门排盘 · 地盘九宫 | 天盘/人盘/神盘功能开发中</p>
      </main>
    </div>
  );
}
