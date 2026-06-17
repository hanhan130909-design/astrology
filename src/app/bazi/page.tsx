"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildBaziViewData } from "@/lib/baziViewData";
import { ArrowLeft, Save, X, Trash2, Send, Loader2, Sparkles, Compass, ChevronDown } from "lucide-react";

// ──────────────────────── 翻译 ────────────────────────
const T: Record<string, Record<string, string>> = {
  title: { zh: "八字排盘", en: "BaZi Chart", id: "Bagan BaZi", th: "ปาจื่อ", vi: "Bát Tự", ms: "Carta BaZi", ja: "八字", ko: "팔자" },
  subtitle: { zh: "输入出生信息，查看四柱八字、大运流年", en: "Four Pillars & Luck Cycles", id: "Lihat BaZi", th: "ดูดวงปาจื่อ", vi: "Xem Bát Tự", ms: "Lihat BaZi", ja: "四柱八字を表示", ko: "사주팔자 확인" },
  year: { zh: "年", en: "Yr", id: "Thn", th: "ปี", vi: "Năm", ms: "Thn", ja: "年", ko: "년" },
  month: { zh: "月", en: "Mo", id: "Bln", th: "เดือน", vi: "Tháng", ms: "Bln", ja: "月", ko: "월" },
  day: { zh: "日", en: "Day", id: "Hari", th: "วัน", vi: "Ngày", ms: "Hari", ja: "日", ko: "일" },
  hour: { zh: "时", en: "Hr", id: "Jam", th: "ชม", vi: "Giờ", ms: "Jam", ja: "時", ko: "시" },
  minute: { zh: "分", en: "Min", id: "Mnt", th: "นาที", vi: "Phút", ms: "Minit", ja: "分", ko: "분" },
  gender: { zh: "性别", en: "Sex", id: "JK", th: "เพศ", vi: "GT", ms: "Jantina", ja: "性別", ko: "성별" },
  male: { zh: "男", en: "M", id: "Pria", th: "ช", vi: "Nam", ms: "L", ja: "男", ko: "남" },
  female: { zh: "女", en: "F", id: "Wanita", th: "ญ", vi: "Nữ", ms: "P", ja: "女", ko: "여" },
  dayMaster: { zh: "日主", en: "Day Master", id: "DM", th: "เจ้าชะตา", vi: "Nhật Chủ", ms: "DM", ja: "日主", ko: "일주" },
  element: { zh: "五行", en: "5E", id: "Elemen", th: "ธาตุ", vi: "Ngũ Hành", ms: "Unsur", ja: "五行", ko: "오행" },
  yearPillar: { zh: "年柱", en: "Year", id: "Tahun", th: "ปี", vi: "Năm", ms: "Tahun", ja: "年柱", ko: "년주" },
  monthPillar: { zh: "月柱", en: "Month", id: "Bulan", th: "เดือน", vi: "Tháng", ms: "Bulan", ja: "月柱", ko: "월주" },
  dayPillar: { zh: "日柱", en: "Day", id: "Hari", th: "วัน", vi: "Ngày", ms: "Hari", ja: "日柱", ko: "일주" },
  timePillar: { zh: "时柱", en: "Time", id: "Jam", th: "เวลา", vi: "Giờ", ms: "Jam", ja: "時柱", ko: "시주" },
  gan: { zh: "天干", en: "Stem", id: "Batang", th: "ก้านฟ้า", vi: "Thiên Can", ms: "Batang", ja: "天干", ko: "천간" },
  zhi: { zh: "地支", en: "Branch", id: "Cabang", th: "กิ่งดิน", vi: "Địa Chi", ms: "Cabang", ja: "地支", ko: "지지" },
  hiddenStem: { zh: "藏干", en: "Hidden", id: "Tersembunyi", th: "ธาตุซ่อน", vi: "Tàng Can", ms: "Tersembunyi", ja: "蔵干", ko: "장간" },
  tenGod: { zh: "十神", en: "10God", id: "10Dewa", th: "เทพสิบ", vi: "Thập Thần", ms: "10Dewa", ja: "十神", ko: "십신" },
  diShi: { zh: "星运", en: "Phase", id: "Fase", th: "ช่วง", vi: "Vận", ms: "Fasa", ja: "星運", ko: "성운" },
  xunKong: { zh: "自坐空亡", en: "Void", id: "Kosong", th: "ว่าง", vi: "Không Vong", ms: "Kosong", ja: "空亡", ko: "공망" },
  nayin: { zh: "纳音", en: "NaYin", id: "NaYin", th: "นาอิน", vi: "Nạp Âm", ms: "NaYin", ja: "納音", ko: "납음" },
  extraPillars: { zh: "胎元/命宫/身宫", en: "Extra Pillars", id: "Pilar Tambahan", th: "เสาเสริม", vi: "Trụ Phụ", ms: "Tiang Tambahan", ja: "補助柱", ko: "보조주" },
  natalInteraction: { zh: "原局交互", en: "Natal Interactions", id: "Interaksi Natal", th: "ปฏิสัมพันธ์เกิด", vi: "Tương Tác Gốc", ms: "Interaksi Asal", ja: "原局交互", ko: "원국 상호작용" },
  transitInteraction: { zh: "岁运与原局", en: "Transit vs Natal", id: "Transit vs Natal", th: "ดวงปี vs เกิด", vi: "Tuế Vận vs Gốc", ms: "Transit vs Asal", ja: "歳運vs原局", ko: "세운vs원국" },
  natalStem: { zh: "原局天干", en: "Natal Stems", id: "Batang Natal", th: "ก้านฟ้าเกิด", vi: "Thiên Can Gốc", ms: "Batang Asal", ja: "原局天干", ko: "원국 천간" },
  natalBranch: { zh: "原局地支", en: "Natal Branches", id: "Cabang Natal", th: "กิ่งดินเกิด", vi: "Địa Chi Gốc", ms: "Cabang Asal", ja: "原局地支", ko: "원국 지지" },
  transitStem: { zh: "岁运天干", en: "Transit Stems", id: "Batang Transit", th: "ก้านฟ้าปี", vi: "Thiên Can Tuế", ms: "Batang Transit", ja: "歳運天干", ko: "세운 천간" },
  transitBranch: { zh: "岁运地支", en: "Transit Branches", id: "Cabang Transit", th: "กิ่งดินปี", vi: "Địa Chi Tuế", ms: "Cabang Transit", ja: "歳運地支", ko: "세운 지지" },
  luckCycles: { zh: "大运", en: "Luck", id: "Siklus", th: "ดวงใหญ่", vi: "Đại Vận", ms: "Kitaran", ja: "大運", ko: "대운" },
  yearlyLuck: { zh: "流年", en: "Year", id: "Tahunan", th: "ดวงปี", vi: "Lưu Niên", ms: "Tahunan", ja: "流年", ko: "세운" },
  monthlyLuck: { zh: "流月", en: "Month", id: "Bulanan", th: "ดวงเดือน", vi: "Lưu Nguyệt", ms: "Bulanan", ja: "流月", ko: "월운" },
  dailyLuck: { zh: "流日", en: "Day", id: "Harian", th: "ดวงวัน", vi: "Lưu Nhật", ms: "Harian", ja: "流日", ko: "일운" },
  shensha: { zh: "神煞", en: "ShenSha", id: "ShenSha", th: "เสินซา", vi: "Thần Sát", ms: "ShenSha", ja: "神煞", ko: "신살" },
  shenshaPillar: { zh: "四柱神煞", en: "Pillar ShenSha", id: "SS Pilar", th: "SS เสา", vi: "TS Tứ Trụ", ms: "SS Tiang", ja: "四柱神煞", ko: "사주 신살" },
  shenshaLuck: { zh: "大运神煞", en: "Luck ShenSha", id: "SS Siklus", th: "SS ดวงใหญ่", vi: "TS Đại Vận", ms: "SS Kitaran", ja: "大運神煞", ko: "대운 신살" },
  shenshaYear: { zh: "流年神煞", en: "Year ShenSha", id: "SS Tahun", th: "SS ปี", vi: "TS Lưu Niên", ms: "SS Tahun", ja: "流年神煞", ko: "세운 신살" },
  startLuck: { zh: "起运", en: "Start", id: "Mulai", th: "เริ่ม", vi: "Khởi Vận", ms: "Mula", ja: "起運", ko: "기운" },
  age: { zh: "岁", en: "yr", id: "thn", th: "ปี", vi: "t", ms: "thn", ja: "歳", ko: "세" },
  lunarDate: { zh: "农历", en: "Lunar", id: "Imlek", th: "จันทรคติ", vi: "Âm Lịch", ms: "Lunar", ja: "旧暦", ko: "음력" },
  solarDate: { zh: "阳历", en: "Solar", id: "Masehi", th: "สุริยคติ", vi: "Dương Lịch", ms: "Solar", ja: "新暦", ko: "양력" },
  aiChat: { zh: "AI 八字解读", en: "AI BaZi", id: "AI BaZi", th: "AI ปาจื่อ", vi: "AI Bát Tự", ms: "AI BaZi", ja: "AI八字", ko: "AI 팔자" },
  aiPlaceholder: { zh: "输入问题追问…", en: "Ask follow-up…", id: "Tanya…", th: "ถาม…", vi: "Hỏi…", ms: "Tanya…", ja: "質問…", ko: "질문…" },
  backHome: { zh: "返回首页", en: "Back", id: "Kembali", th: "กลับ", vi: "Về", ms: "Kembali", ja: "戻る", ko: "홈" },
  savedCharts: { zh: "已保存", en: "Saved", id: "Tersimpan", th: "บันทึก", vi: "Đã Lưu", ms: "Disimpan", ja: "保存済", ko: "저장됨" },
  noSaved: { zh: "暂无", en: "None", id: "Kosong", th: "ไม่มี", vi: "Trống", ms: "Tiada", ja: "なし", ko: "없음" },
  saveChart: { zh: "保存", en: "Save", id: "Simpan", th: "บันทึก", vi: "Lưu", ms: "Simpan", ja: "保存", ko: "저장" },
  saveName: { zh: "名称", en: "Name", id: "Nama", th: "ชื่อ", vi: "Tên", ms: "Nama", ja: "名前", ko: "이름" },
};

const t = (key: string, lang: string) => T[key]?.[lang] || T[key]?.en || key;

const ELEMENT_COLORS: Record<string, string> = { 木: "#4CAF50", 火: "#F44336", 土: "#795548", 金: "#FF9800", 水: "#2196F3" };
const ZODIAC: Record<string, string> = { 子:"鼠",丑:"牛",寅:"虎",卯:"兔",辰:"龙",巳:"蛇",午:"马",未:"羊",申:"猴",酉:"鸡",戌:"狗",亥:"猪" };

// ──────────────────────── 主组件 ────────────────────────
export default function BaziPage() {
  const { language } = useLanguage();
  const lang = language || "zh";

  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [gender, setGender] = useState(1);
  const [chartName, setChartName] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [showSaved, setShowSaved] = useState(false);

  // Tabs
  const [tab, setTab] = useState<"pillars"|"luck"|"shensha"|"ai">("pillars");

  // Selections
  const [daYunIdx, setDaYunIdx] = useState(-1);
  const [liuNianIdx, setLiuNianIdx] = useState(-1);
  const [liuYueIdx, setLiuYueIdx] = useState(-1);
  const [liuRiIdx, setLiuRiIdx] = useState(-1);
  const [luckTab, setLuckTab] = useState<"daYun"|"liuNian"|"liuYue"|"liuRi">("daYun");
  const [shenshaTab, setShenshaTab] = useState<"pillar"|"luck"|"year">("pillar");

  // Chat
  const [chatMsgs, setChatMsgs] = useState<{role:string;content:string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Saved
  type SC = { name:string;year:number;month:number;day:number;hour:number;minute:number;gender:number;savedAt:string };
  const [savedCharts, setSavedCharts] = useState<SC[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("bazi_saved")||"[]"); } catch { return []; }
  });
  const saveChart = () => {
    const name = chartName.trim() || `${year}-${month}-${day}`;
    const c: SC = { name, year, month, day, hour, minute, gender, savedAt: new Date().toISOString() };
    const u = [c, ...savedCharts.filter(x=>x.name!==name)].slice(0,20);
    setSavedCharts(u); localStorage.setItem("bazi_saved", JSON.stringify(u)); setChartName("");
  };
  const loadChart = (c: SC) => { setYear(c.year);setMonth(c.month);setDay(c.day);setHour(c.hour);setMinute(c.minute);setGender(c.gender);setShowSaved(false); };
  const deleteChart = (n: string) => { const u=savedCharts.filter(c=>c.name!==n); setSavedCharts(u); localStorage.setItem("bazi_saved",JSON.stringify(u)); };

  // Compute
  const bazi = useMemo(() => { try { return buildBaziViewData({ year, month, day, hour, minute, gender, name: "" }); } catch (e) { console.error(e); return null; } }, [year, month, day, hour, minute, gender]);
  const dm = bazi?.dayMaster;
  const luck = bazi?.luck;
  const pl = bazi?.pillarList || [];
  const PILLAR_KEYS = ["year","month","day","time"];

  // Selections
  const daYun = luck?.daYun?.[daYunIdx>=0?daYunIdx:luck.daYun?.findIndex((d:any)=>d.active)??0];
  const liuNian = daYun?.liuNian?.[liuNianIdx>=0?liuNianIdx:daYun?.liuNian?.findIndex((n:any)=>n.active)??0];
  const liuYue = liuNian?.liuYue?.[liuYueIdx>=0?liuYueIdx:liuNian?.liuYue?.findIndex((m:any)=>m.active)??0];
  const liuRi = liuYue?.liuRi?.[liuRiIdx>=0?liuRiIdx:liuYue?.liuRi?.findIndex((d:any)=>d.active)??0];

  // Transit interactions
  const transitInt = useMemo(() => {
    if (!bazi||!daYun||!liuNian) return null;
    const items = [...pl.map((p:any)=>({gan:p.gan,zhi:p.zhi})), {gan:daYun.gan,zhi:daYun.zhi}, {gan:liuNian.gan,zhi:liuNian.zhi}];
    const COMBINE_S: Record<string,string> = {"甲己":"甲己合土","乙庚":"乙庚合金","丙辛":"丙辛合水","丁壬":"丁壬合木","戊癸":"戊癸合火"};
    const CLASH_S: Record<string,string> = {"甲庚":"甲庚冲","乙辛":"乙辛冲","丙壬":"丙壬冲","丁癸":"丁癸冲"};
    const COMBINE_B: Record<string,string> = {"子丑":"子丑合","寅亥":"寅亥合","卯戌":"卯戌合","辰酉":"辰酉合","巳申":"巳申合","午未":"午未合"};
    const CLASH_B: Record<string,string> = {"子午":"子午冲","丑未":"丑未冲","寅申":"寅申冲","卯酉":"卯酉冲","辰戌":"辰戌冲","巳亥":"巳亥冲"};
    const HARM_B: Record<string,string> = {"子未":"子未害","丑午":"丑午害","寅巳":"寅巳害","卯辰":"卯辰害","申亥":"申亥害","酉戌":"酉戌害"};
    const natalStems: string[]=[], natalBranches: string[]=[], transitStems: string[]=[], transitBranches: string[]=[];
    for (let i=0;i<4;i++) for (let j=i+1;j<4;j++) {
      const a=items[i],b=items[j];
      const sc=COMBINE_S[a.gan+b.gan]||COMBINE_S[b.gan+a.gan]; if(sc)natalStems.push(sc);
      const scl=CLASH_S[a.gan+b.gan]||CLASH_S[b.gan+a.gan]; if(scl)natalStems.push(scl);
      const bc=COMBINE_B[a.zhi+b.zhi]||COMBINE_B[b.zhi+a.zhi]; if(bc)natalBranches.push(bc);
      const bcl=CLASH_B[a.zhi+b.zhi]||CLASH_B[b.zhi+a.zhi]; if(bcl)natalBranches.push(bcl);
      const bh=HARM_B[a.zhi+b.zhi]||HARM_B[b.zhi+a.zhi]; if(bh)natalBranches.push(bh);
    }
    for (let i=0;i<4;i++) for (let j=4;j<6;j++) {
      const a=items[i],b=items[j];
      const sc=COMBINE_S[a.gan+b.gan]||COMBINE_S[b.gan+a.gan]; if(sc)transitStems.push(sc);
      const scl=CLASH_S[a.gan+b.gan]||CLASH_S[b.gan+a.gan]; if(scl)transitStems.push(scl);
      const bc=COMBINE_B[a.zhi+b.zhi]||COMBINE_B[b.zhi+a.zhi]; if(bc)transitBranches.push(bc);
      const bcl=CLASH_B[a.zhi+b.zhi]||CLASH_B[b.zhi+a.zhi]; if(bcl)transitBranches.push(bcl);
      const bh=HARM_B[a.zhi+b.zhi]||HARM_B[b.zhi+a.zhi]; if(bh)transitBranches.push(bh);
    }
    return { natalStems:[...new Set(natalStems)], natalBranches:[...new Set(natalBranches)], transitStems:[...new Set(transitStems)], transitBranches:[...new Set(transitBranches)] };
  }, [bazi, daYun, liuNian]);

  // Chat
  const sendChat = async () => {
    if (!chatInput.trim()||chatLoading||!bazi) return;
    const q=chatInput.trim(); setChatMsgs(p=>[...p,{role:"user",content:q}]); setChatInput(""); setChatLoading(true);
    try {
      const res=await fetch("/api/bazi-chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chartData:{pillars:Object.values(bazi.pillars||{}).map((p:any)=>({label:p.label,gan:p.gan,zhi:p.zhi,tenGod:p.tenGod,hidden:p.hidden,naYin:p.naYin,element:p.element})),dayMaster:bazi.dayMaster,meta:bazi.meta,interactions:bazi.interactions,shenSha:bazi.shenSha},question:q,language:lang,history:chatMsgs.slice(-10).map(m=>({role:m.role,content:m.content}))})});
      const d=await res.json(); setChatMsgs(p=>[...p,{role:"assistant",content:d.answer||"..."}]);
    } catch { setChatMsgs(p=>[...p,{role:"assistant",content:"AI暂不可用"}]); } finally { setChatLoading(false); }
  };

  // Pillar cell helper
  const PCell = ({ children, className, color }: { children: React.ReactNode; className?: string; color?: string }) => (
    <td className={`p-1.5 text-center border border-gray-100 ${className||""}`} style={color?{color}:{}}>{children}</td>
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-3 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900"><ArrowLeft size={14}/>{t("backHome",lang)}</a>
          <button onClick={()=>setShowSaved(!showSaved)} className="text-xs text-gray-500 bg-gray-50 border px-2 py-1 rounded-lg"><Save size={12} className="inline mr-1"/>{savedCharts.length||""}</button>
        </div>
        {showSaved&&(
          <div className="mb-4 p-3 bg-gray-50 rounded-xl border">
            <div className="flex justify-between mb-2"><span className="text-xs font-semibold">{t("savedCharts",lang)}</span><button onClick={()=>setShowSaved(false)}><X size={14}/></button></div>
            {savedCharts.length===0?<p className="text-xs text-gray-400 py-2 text-center">{t("noSaved",lang)}</p>:savedCharts.map((c,i)=>(<div key={i} className="flex justify-between bg-white p-2 rounded-lg border mb-1"><button onClick={()=>loadChart(c)} className="text-left flex-1"><div className="text-xs font-medium">{c.name}</div><div className="text-[10px] text-gray-400">{c.year}-{c.month}-{c.day}</div></button><button onClick={e=>{e.stopPropagation();deleteChart(c.name);}} className="text-gray-400 hover:text-red-500"><Trash2 size={12}/></button></div>))}
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-[11px] text-gray-500 mb-2"><Compass size={13}/>八字命理 · 四柱推命</div>
          <h1 className="text-2xl font-bold">{t("title",lang)}</h1>
          <div className="flex justify-center gap-1 mt-2">{[{k:"木",c:"#e8f5e9",tc:"#2e7d32"},{k:"火",c:"#ffebee",tc:"#c62828"},{k:"土",c:"#fff3e0",tc:"#e65100"},{k:"金",c:"#fff8e1",tc:"#f57f17"},{k:"水",c:"#e3f2fd",tc:"#1565c0"}].map(el=>(<span key={el.k} className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{background:el.c,color:el.tc}}>{el.k}</span>))}</div>
        </div>

        {/* Form */}
        <div className="mb-4">
          <button onClick={()=>setShowForm(!showForm)} className="w-full p-3 rounded-xl bg-gray-50 border text-left flex justify-between items-center text-sm">
            <span>{year}-{String(month).padStart(2,"0")}-{String(day).padStart(2,"0")} {String(hour).padStart(2,"0")}:{String(minute).padStart(2,"0")} {gender===1?t("male",lang):t("female",lang)}</span>
            <ChevronDown size={16} className={`transition ${showForm?"rotate-180":""}`}/>
          </button>
          {showForm&&(
            <div className="mt-2 p-4 bg-gray-50 rounded-xl border">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[{l:t("year",lang),v:year,s:setYear,t:"number",min:1900,max:2100},{l:t("month",lang),v:month,s:setMonth,t:"select",opts:Array.from({length:12},(_,i)=>i+1)},{l:t("day",lang),v:day,s:setDay,t:"select",opts:Array.from({length:31},(_,i)=>i+1)},{l:t("gender",lang),v:gender,s:setGender,t:"select",opts:[{v:1,l:t("male",lang)},{v:0,l:t("female",lang)}]},{l:t("hour",lang),v:hour,s:setHour,t:"select",opts:Array.from({length:24},(_,i)=>i)},{l:t("minute",lang),v:minute,s:setMinute,t:"select",opts:[0,15,30,45]}].map((f,i)=>(<div key={i}><label className="text-[10px] text-gray-400">{f.l}</label>{f.t==="select"?<select value={f.v} onChange={e=>f.s(Number(e.target.value))} className="w-full p-1.5 rounded border text-xs">{(f.opts as any[]).map((o:any)=><option key={typeof o==="object"?o.v:o} value={typeof o==="object"?o.v:o}>{typeof o==="object"?o.l:o}</option>)}</select>:<input type="number" value={f.v} onChange={e=>f.s(Number(e.target.value))} min={f.min} max={f.max} className="w-full p-1.5 rounded border text-xs"/>}</div>))}
              </div>
              <div className="flex gap-2 mt-3"><input value={chartName} onChange={e=>setChartName(e.target.value)} placeholder={t("saveName",lang)} className="flex-1 p-2 rounded border text-xs"/><button onClick={saveChart} className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold"><Save size={12} className="inline mr-1"/>{t("saveChart",lang)}</button></div>
            </div>
          )}
        </div>

        {!bazi ? (
          <div className="text-center py-16 text-gray-400"><Compass size={48} className="mx-auto mb-4 opacity-30"/><p className="text-sm">输入出生信息查看命盘</p></div>
        ) : (
          <>
            {/* Day Master Card */}
            <div className="bg-gray-50 rounded-xl p-4 border flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{background:dm?.color||"#555"}}>{dm?.stem}</div>
              <div className="flex-1"><div className="text-xs text-gray-500">{t("dayMaster",lang)}</div><div className="text-lg font-bold">{dm?.stem}{dm?.branch}{dm?.stem}造</div><div className="text-[10px] text-gray-400">{bazi?.lunarText} · {bazi?.solarText}</div></div>
              <div className="text-right"><div className="text-3xl">{ZODIAC[dm?.branch||""]}</div><div className="text-[10px]" style={{color:dm?.color}}>{dm?.element}</div></div>
            </div>

            {/* Tab Bar */}
            <div className="flex border-b mb-4 overflow-x-auto">
              {["pillars","luck","shensha","ai"].map(k=>(
                <button key={k} onClick={()=>setTab(k as any)} className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${tab===k?"border-gray-900 text-gray-900":"border-transparent text-gray-400 hover:text-gray-600"}`}>
                  {{pillars:"四柱详情",luck:"大运流年",shensha:"神煞",ai:"AI解读"}[k]}
                </button>
              ))}
            </div>

            {/* TAB: Pillars */}
            {tab==="pillars"&&(<>
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-xs border-collapse">
                  <thead><tr className="bg-gray-50">
                    <th className="p-1.5 border text-gray-500 font-medium w-16"></th>
                    {PILLAR_KEYS.map(k=><th key={k} className="p-1.5 border text-gray-500 font-medium">{t(k+"Pillar",lang)}</th>)}
                  </tr></thead>
                  <tbody>
                    {[{label:t("gan",lang),field:"gan",style:(v:any)=>pl.find((p:any)=>p.key===v)?.color},{label:t("zhi",lang),field:"zhi"},{label:t("tenGod",lang),field:"tenGod"},{label:t("hiddenStem",lang),field:"hidden",format:(v:any)=>Array.isArray(v)?v.join(" "):v},{label:t("diShi",lang),field:"diShi"},{label:t("xunKong",lang),field:"xunKong"},{label:t("nayin",lang),field:"naYin"}].map((row,i)=>(
                      <tr key={i} className={i%2===0?"bg-white":"bg-gray-50/50"}>
                        <td className="p-1.5 border text-gray-500 font-medium">{row.label}</td>
                        {PILLAR_KEYS.map(k=>{const val=pl.find((p:any)=>p.key===k)?.[row.field]; return <PCell key={k} color={row.style?.(k)}>{row.format?row.format(val):(val||"-")}</PCell>;})}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Extra pillars */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs mb-4">
                {(bazi?.extraPillars||[]).map((ep:any)=>(<div key={ep.label} className="bg-gray-50 rounded-lg p-2 border"><div className="text-gray-400">{ep.label}</div><div className="font-bold text-sm">{ep.value||"-"}</div><div className="text-gray-400 text-[10px]">{ep.naYin||""}</div></div>))}
              </div>

              {/* 5E bar */}
              <div className="grid grid-cols-5 gap-1.5 mb-4">{(()=>{const cnt:Record<string,number>={木:0,火:0,土:0,金:0,水:0};pl.forEach((p:any)=>{if(p.element)cnt[p.element]++});const mx=Math.max(...Object.values(cnt),1);return Object.entries(cnt).map(([el,c])=>(<div key={el} className="text-center"><div className="text-[10px] text-gray-500">{el}</div><div className="h-12 bg-gray-100 rounded relative overflow-hidden"><div className="absolute bottom-0 left-0 right-0 rounded-b transition-all" style={{height:`${(c/mx)*100}%`,background:ELEMENT_COLORS[el]}}/></div><div className="text-xs font-bold mt-0.5" style={{color:ELEMENT_COLORS[el]}}>{c}</div></div>));})()}</div>

              {/* Interactions */}
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 border">
                  <div className="text-xs font-semibold mb-2">{t("natalInteraction",lang)}</div>
                  <div className="space-y-1 text-xs">
                    {bazi?.interactions?.natal?.stems?.length>0&&<div><span className="text-gray-400">{t("natalStem",lang)}：</span>{bazi.interactions.natal.stems.map((s:string,i:number)=><span key={i} className="px-1.5 py-0.5 bg-white rounded mr-1 border">{s}</span>)}</div>}
                    {bazi?.interactions?.natal?.branches?.length>0&&<div><span className="text-gray-400">{t("natalBranch",lang)}：</span>{bazi.interactions.natal.branches.map((s:string,i:number)=><span key={i} className="px-1.5 py-0.5 bg-white rounded mr-1 border">{s}</span>)}</div>}
                    {!bazi?.interactions?.natal?.stems?.length&&!bazi?.interactions?.natal?.branches?.length&&<span className="text-gray-400">-</span>}
                  </div>
                </div>
                {transitInt&&(
                  <div className="bg-gray-50 rounded-xl p-3 border">
                    <div className="text-xs font-semibold mb-2">{t("transitInteraction",lang)}</div>
                    <div className="space-y-1 text-xs">
                      {transitInt.transitStems.length>0&&<div><span className="text-gray-400">{t("transitStem",lang)}：</span>{transitInt.transitStems.map((s:string,i:number)=><span key={i} className="px-1.5 py-0.5 bg-white rounded mr-1 border">{s}</span>)}</div>}
                      {transitInt.transitBranches.length>0&&<div><span className="text-gray-400">{t("transitBranch",lang)}：</span>{transitInt.transitBranches.map((s:string,i:number)=><span key={i} className="px-1.5 py-0.5 bg-white rounded mr-1 border">{s}</span>)}</div>}
                      {!transitInt.transitStems.length&&!transitInt.transitBranches.length&&<span className="text-gray-400">-</span>}
                    </div>
                  </div>
                )}
              </div>
            </>)}

            {/* TAB: Luck Cycles */}
            {tab==="luck"&&(<>
              <div className="text-xs text-gray-500 mb-2">{t("startLuck",lang)}：{luck?.startText}</div>
              <div className="flex gap-1 mb-2 text-xs">
                {["daYun","liuNian","liuYue","liuRi"].map(k=>(<button key={k} onClick={()=>setLuckTab(k as any)} className={`px-2 py-1 rounded ${luckTab===k?"bg-gray-900 text-white":"bg-gray-100 text-gray-600"}`}>{{daYun:t("luckCycles",lang),liuNian:t("yearlyLuck",lang),liuYue:t("monthlyLuck",lang),liuRi:t("dailyLuck",lang)}[k]}</button>))}
              </div>

              {/* 大运 */}
              {luckTab==="daYun"&&luck?.daYun&&<div className="flex overflow-x-auto gap-1 pb-2 mb-3">{luck.daYun.map((d:any,i:number)=>(<button key={i} onClick={()=>{setDaYunIdx(i);setLiuNianIdx(-1);setLiuYueIdx(-1);setLiuRiIdx(-1);}} className={`shrink-0 px-3 py-2 rounded-lg text-center border text-xs min-w-[80px] ${(daYunIdx>=0?i===daYunIdx:d.active)?"bg-gray-900 text-white border-gray-900":"bg-white text-gray-600 border-gray-200"}`}><div className="font-bold text-sm">{d.ganZhi||"起运前"}</div><div className="text-[10px] opacity-70">{d.startAge}-{d.endAge}{t("age",lang)}</div><div className="text-[9px] opacity-50">{d.gan} {d.zhi} {d.xunKong||""}</div></button>))}</div>}

              {/* 流年 */}
              {luckTab==="liuNian"&&daYun?.liuNian&&<div className="flex overflow-x-auto gap-1 pb-2 mb-3">{daYun.liuNian.map((ln:any,i:number)=>(<button key={i} onClick={()=>{setLiuNianIdx(i);setLiuYueIdx(-1);setLiuRiIdx(-1);}} className={`shrink-0 px-2 py-1.5 rounded-lg text-center border text-xs min-w-[65px] ${(liuNianIdx>=0?i===liuNianIdx:ln.active)?"bg-gray-800 text-white border-gray-800":"bg-white text-gray-600 border-gray-200"}`}><div className="font-bold text-sm">{ln.ganZhi}</div><div className="text-[10px]">{ln.year}</div><div className="text-[9px] opacity-50">{ln.xunKong||""}</div></button>))}</div>}

              {/* 流月 */}
              {luckTab==="liuYue"&&liuNian?.liuYue&&<div className="flex overflow-x-auto gap-1 pb-2 mb-3">{liuNian.liuYue.map((lm:any,i:number)=>(<button key={i} onClick={()=>{setLiuYueIdx(i);setLiuRiIdx(-1);}} className={`shrink-0 px-2 py-1.5 rounded-lg text-center border text-xs min-w-[55px] ${(liuYueIdx>=0?i===liuYueIdx:lm.active)?"bg-gray-700 text-white border-gray-700":"bg-white text-gray-500 border-gray-200"}`}><div className="font-bold text-sm">{lm.ganZhi}</div><div className="text-[10px]">{lm.month}</div><div className="text-[9px] opacity-50">{lm.xunKong||""}</div></button>))}</div>}

              {/* 流日 */}
              {luckTab==="liuRi"&&liuYue?.liuRi&&<div className="flex overflow-x-auto gap-1 pb-2 mb-3 flex-wrap">{liuYue.liuRi.map((lr:any,i:number)=>(<button key={i} onClick={()=>setLiuRiIdx(i)} className={`shrink-0 px-2 py-1 rounded-lg text-center border text-xs min-w-[55px] ${(liuRiIdx>=0?i===liuRiIdx:lr.active)?"bg-gray-600 text-white border-gray-600":"bg-white text-gray-500 border-gray-200"}`}><div className="font-bold">{lr.ganZhi}</div><div className="text-[10px]">{lr.day}日</div><div className="text-[9px] opacity-50">{lr.xunKong||""}</div></button>))}</div>}

              {/* Selected Luck Detail */}
              {(daYun||liuNian||liuYue||liuRi)&&<div className="text-xs bg-gray-50 rounded-lg p-3 border space-y-1">
                {daYun&&<div>大运：<b>{daYun.ganZhi}</b>（{daYun.startAge}-{daYun.endAge}岁） {daYun.xunKong?`空亡:${daYun.xunKong}`:""}</div>}
                {liuNian&&<div>流年：<b>{liuNian.ganZhi}</b>（{liuNian.year}年 · {liuNian.age}岁） {liuNian.xunKong?`空亡:${liuNian.xunKong}`:""}</div>}
                {liuYue&&<div>流月：<b>{liuYue.ganZhi}</b>（{liuYue.month}） {liuYue.xunKong?`空亡:${liuYue.xunKong}`:""}</div>}
                {liuRi&&<div>流日：<b>{liuRi.ganZhi}</b>（{liuRi.day}日 · {liuRi.lunarDay}） {liuRi.xunKong?`空亡:${liuRi.xunKong}`:""}</div>}
              </div>}
            </>)}

            {/* TAB: ShenSha */}
            {tab==="shensha"&&(<>
              <div className="flex gap-1 mb-3 text-xs">
                {["pillar","luck","year"].map(k=>(<button key={k} onClick={()=>setShenshaTab(k as any)} className={`px-3 py-1.5 rounded-lg ${shenshaTab===k?"bg-gray-900 text-white":"bg-gray-100 text-gray-600"}`}>{{pillar:t("shenshaPillar",lang),luck:t("shenshaLuck",lang),year:t("shenshaYear",lang)}[k]}</button>))}
              </div>
              {bazi?.shenSha&&(
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(shenshaTab==="pillar"?bazi.shenSha.natal:shenshaTab==="luck"?bazi.shenSha.luck:bazi.shenSha.year).map((row:any,i:number)=>(<div key={i} className="bg-gray-50 rounded-lg p-2 border"><div className="text-[10px] text-gray-500">{row.label} {row.active?'●':''}</div><div className="text-xs font-medium text-gray-800 mt-0.5">{row.names.length?row.names.join(" · "):"-"}</div></div>))}
                </div>
              )}
            </>)}

            {/* TAB: AI Chat */}
            {tab==="ai"&&(
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-900 text-white px-4 py-2.5 flex items-center gap-2 text-xs"><Sparkles size={14}/>{t("aiChat",lang)}</div>
                <div className="max-h-[350px] overflow-y-auto p-3 space-y-2 bg-gray-50">
                  {chatMsgs.length===0&&<p className="text-xs text-gray-400 text-center py-6">{t("aiPlaceholder",lang)}</p>}
                  {chatMsgs.map((msg,i)=>(<div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${msg.role==="user"?"bg-gray-900 text-white":"bg-white text-gray-700 border"}`}>{msg.content}</div></div>))}
                  {chatLoading&&<div className="flex justify-start"><div className="bg-white border px-3 py-2 rounded-xl"><Loader2 size={14} className="animate-spin text-gray-400"/></div></div>}
                </div>
                <div className="flex gap-2 p-2 bg-white border-t">
                  <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder={t("aiPlaceholder",lang)} className="flex-1 p-2 bg-gray-50 border rounded-lg text-xs"/>
                  <button onClick={sendChat} disabled={chatLoading} className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs"><Send size={14}/></button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
