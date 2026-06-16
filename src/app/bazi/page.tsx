"use client";

import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildBaziViewData } from "@/lib/baziViewData";
import { Sun, Moon, Calendar, Clock, MapPin, ChevronDown, Send, Loader2, Sparkles, Compass } from "lucide-react";

// ──────────────────────── 翻译 ────────────────────────
const T: Record<string, Record<string, string>> = {
  title: { zh: "八字排盘", en: "BaZi Chart", id: "Bagan BaZi", th: "ปาจื่อ", vi: "Bát Tự", ms: "Carta BaZi", ja: "八字", ko: "팔자" },
  subtitle: { zh: "输入出生信息，查看四柱八字、大运流年", en: "Enter birth info to view Four Pillars and Luck Cycles", id: "Masukkan data lahir untuk lihat BaZi", th: "กรอกข้อมูลเกิดเพื่อดูดวงปาจื่อ", vi: "Nhập thông tin sinh để xem Bát Tự", ms: "Masukkan data lahir untuk lihat BaZi", ja: "出生情報を入力して四柱八字を表示", ko: "출생 정보를 입력하여 사주팔자를 확인하세요" },
  year: { zh: "年", en: "Year", id: "Tahun", th: "ปี", vi: "Năm", ms: "Tahun", ja: "年", ko: "년" },
  month: { zh: "月", en: "Month", id: "Bulan", th: "เดือน", vi: "Tháng", ms: "Bulan", ja: "月", ko: "월" },
  day: { zh: "日", en: "Day", id: "Hari", th: "วัน", vi: "Ngày", ms: "Hari", ja: "日", ko: "일" },
  hour: { zh: "时", en: "Hr", id: "Jam", th: "ชม.", vi: "Giờ", ms: "Jam", ja: "時", ko: "시" },
  minute: { zh: "分", en: "Min", id: "Mnt", th: "นาที", vi: "Phút", ms: "Minit", ja: "分", ko: "분" },
  gender: { zh: "性别", en: "Gender", id: "Jenis Kelamin", th: "เพศ", vi: "Giới tính", ms: "Jantina", ja: "性別", ko: "성별" },
  male: { zh: "男", en: "Male", id: "Pria", th: "ชาย", vi: "Nam", ms: "Lelaki", ja: "男", ko: "남" },
  female: { zh: "女", en: "Female", id: "Wanita", th: "หญิง", vi: "Nữ", ms: "Perempuan", ja: "女", ko: "여" },
  calculate: { zh: "排八字", en: "Calculate", id: "Hitung", th: "คำนวณ", vi: "Tính", ms: "Kira", ja: "計算", ko: "계산" },
  calculating: { zh: "计算中...", en: "Calculating...", id: "Menghitung...", th: "กำลังคำนวณ...", vi: "Đang tính...", ms: "Mengira...", ja: "計算中...", ko: "계산 중..." },
  dayMaster: { zh: "日主", en: "Day Master", id: "Day Master", th: "เจ้าชะตา", vi: "Nhật Chủ", ms: "Day Master", ja: "日主", ko: "일주" },
  element: { zh: "五行", en: "Element", id: "Elemen", th: "ธาตุ", vi: "Ngũ Hành", ms: "Unsur", ja: "五行", ko: "오행" },
  yearPillar: { zh: "年柱", en: "Year Pillar", id: "Pilar Tahun", th: "เสาปี", vi: "Trụ Năm", ms: "Tiang Tahun", ja: "年柱", ko: "년주" },
  monthPillar: { zh: "月柱", en: "Month Pillar", id: "Pilar Bulan", th: "เสาเดือน", vi: "Trụ Tháng", ms: "Tiang Bulan", ja: "月柱", ko: "월주" },
  dayPillar: { zh: "日柱", en: "Day Pillar", id: "Pilar Hari", th: "เสาวัน", vi: "Trụ Ngày", ms: "Tiang Hari", ja: "日柱", ko: "일주" },
  timePillar: { zh: "时柱", en: "Time Pillar", id: "Pilar Jam", th: "เสาชั่วโมง", vi: "Trụ Giờ", ms: "Tiang Jam", ja: "時柱", ko: "시주" },
  hiddenStem: { zh: "藏干", en: "Hidden Stem", id: "Batang Tersembunyi", th: "ธาตุซ่อน", vi: "Tàng Can", ms: "Batang Tersembunyi", ja: "蔵干", ko: "장간" },
  tenGod: { zh: "十神", en: "Ten God", id: "Sepuluh Dewa", th: "เทพสิบ", vi: "Thập Thần", ms: "Sepuluh Dewa", ja: "十神", ko: "십신" },
  nayin: { zh: "纳音", en: "Na Yin", id: "Na Yin", th: "นาอิน", vi: "Nạp Âm", ms: "Na Yin", ja: "納音", ko: "납음" },
  extraPillars: { zh: "辅助柱", en: "Extra Pillars", id: "Pilar Tambahan", th: "เสาเสริม", vi: "Trụ Phụ", ms: "Tiang Tambahan", ja: "補助柱", ko: "보조주" },
  luckCycles: { zh: "大运", en: "Luck Cycles", id: "Siklus Keberuntungan", th: "ดวงใหญ่", vi: "Đại Vận", ms: "Kitaran Nasib", ja: "大運", ko: "대운" },
  yearlyLuck: { zh: "流年", en: "Yearly Luck", id: "Keberuntungan Tahunan", th: "ดวงปี", vi: "Lưu Niên", ms: "Nasib Tahunan", ja: "流年", ko: "세운" },
  monthlyLuck: { zh: "流月", en: "Monthly Luck", id: "Keberuntungan Bulanan", th: "ดวงเดือน", vi: "Lưu Nguyệt", ms: "Nasib Bulanan", ja: "流月", ko: "월운" },
  startLuck: { zh: "起运", en: "Luck Start", id: "Mulai Keberuntungan", th: "เริ่มดวง", vi: "Khởi Vận", ms: "Mula Nasib", ja: "起運", ko: "기운" },
  age: { zh: "岁", en: "yr", id: "thn", th: "ปี", vi: "t", ms: "thn", ja: "歳", ko: "세" },
  shensha: { zh: "神煞", en: "Shen Sha", id: "Shen Sha", th: "เสินซา", vi: "Thần Sát", ms: "Shen Sha", ja: "神煞", ko: "신살" },
  interactions: { zh: "合冲害", en: "Combinations & Clashes", id: "Kombinasi & Bentrokan", th: "合冲害", vi: "Hợp Xung Hại", ms: "Gabungan & Pertembungan", ja: "合冲害", ko: "합충해" },
  stems: { zh: "天干", en: "Stems", id: "Batang Langit", th: "ก้านฟ้า", vi: "Thiên Can", ms: "Batang Langit", ja: "天干", ko: "천간" },
  branches: { zh: "地支", en: "Branches", id: "Cabang Bumi", th: "กิ่งดิน", vi: "Địa Chi", ms: "Cabang Bumi", ja: "地支", ko: "지지" },
  lunarDate: { zh: "农历", en: "Lunar", id: "Imlek", th: "จันทรคติ", vi: "Âm Lịch", ms: "Lunar", ja: "旧暦", ko: "음력" },
  solarDate: { zh: "阳历", en: "Solar", id: "Masehi", th: "สุริยคติ", vi: "Dương Lịch", ms: "Solar", ja: "新暦", ko: "양력" },
  aiChat: { zh: "AI 八字解读", en: "AI BaZi Reading", id: "AI Bacaan BaZi", th: "AI วิเคราะห์ปาจื่อ", vi: "AI Đọc Bát Tự", ms: "AI Bacaan BaZi", ja: "AI八字解読", ko: "AI 팔자 해석" },
  aiPlaceholder: { zh: "输入你的问题，比如：我的财运如何？", en: "Ask a question, e.g. How is my career luck?", id: "Tanya, misal: Bagaimana karier saya?", th: "ถาม เช่น: การงานของฉันเป็นอย่างไร?", vi: "Hỏi, VD: Sự nghiệp của tôi thế nào?", ms: "Tanya, cth: Bagaimana kerjaya saya?", ja: "質問：私の仕事運は？", ko: "질문: 제 직장운은 어떤가요?" },
  aiSend: { zh: "发送", en: "Send", id: "Kirim", th: "ส่ง", vi: "Gửi", ms: "Hantar", ja: "送信", ko: "전송" },
  noData: { zh: "请输入出生信息并点击「排八字」查看命盘", en: "Enter birth data and click Calculate to view chart", id: "Masukkan data lahir dan klik Hitung", th: "กรอกข้อมูลเกิดแล้วกดคำนวณ", vi: "Nhập dữ liệu sinh và nhấn Tính", ms: "Masukkan data lahir dan klik Kira", ja: "出生情報を入力して計算をクリック", ko: "출생 정보를 입력하고 계산을 클릭하세요" },
};

const t = (key: string, lang: string) => T[key]?.[lang] || T[key]?.en || key;

// ──────────────────────── 元素颜色 ────────────────────────
const ELEMENT_COLORS: Record<string, string> = {
  木: "#4CAF50", 火: "#F44336", 土: "#795548",
  金: "#FF9800", 水: "#2196F3",
};

const ZODIAC_ANIMALS: Record<string, string> = {
  子: "鼠", 丑: "牛", 寅: "虎", 卯: "兔", 辰: "龙",
  巳: "蛇", 午: "马", 未: "羊", 申: "猴", 酉: "鸡",
  戌: "狗", 亥: "猪",
};

// ──────────────────────── 主组件 ────────────────────────
export default function BaziPage() {
  const { language } = useLanguage();
  const lang = language || "zh";

  // 表单状态
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [gender, setGender] = useState(1);
  const [computed, setComputed] = useState(false);

  // 大运/流年 选中
  const [daYunIdx, setDaYunIdx] = useState(-1);
  const [liuNianIdx, setLiuNianIdx] = useState(-1);
  const [liuYueIdx, setLiuYueIdx] = useState(-1);

  // AI Chat
  const [chatMsgs, setChatMsgs] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // 展开/收起
  const [showForm, setShowForm] = useState(true);

  // 计算八字
  const bazi = useMemo(() => {
    try {
      return buildBaziViewData({ year, month, day, hour, minute, gender, name: "" });
    } catch (e) {
      console.error("bazi build error:", e);
      return null;
    }
  }, [year, month, day, hour, minute, gender]);

  const p = bazi?.pillars;
  const dayMaster = bazi?.dayMaster;
  const luck = bazi?.luck;
  const activeDaYun = luck?.daYun?.[daYunIdx >= 0 ? daYunIdx : luck.daYun?.findIndex((d: any) => d.active) ?? 0];
  const activeLiuNian = activeDaYun?.liuNian?.[liuNianIdx >= 0 ? liuNianIdx : activeDaYun?.liuNian?.findIndex((n: any) => n.active) ?? 0];
  const activeLiuYue = activeLiuNian?.liuYue?.[liuYueIdx >= 0 ? liuYueIdx : activeLiuNian?.liuYue?.findIndex((m: any) => m.active) ?? 0];

  const handleCalculate = () => setComputed(c => !c);

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading || !bazi) return;
    const q = chatInput.trim();
    setChatMsgs(prev => [...prev, { role: "user", content: q }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/bazi-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartData: bazi, question: q, language: lang }),
      });
      const data = await res.json();
      setChatMsgs(prev => [...prev, { role: "assistant", content: data.answer || "抱歉，暂无回复" }]);
    } catch {
      setChatMsgs(prev => [...prev, { role: "assistant", content: "AI服务暂时不可用，请稍后重试" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-500 mb-3">
            <Compass size={16} />
            <span>八字命理 · 四柱推命</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title", lang)}</h1>
          <p className="text-gray-500">{t("subtitle", lang)}</p>
        </div>

        {/* 表单 */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left flex items-center justify-between hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <div className="font-semibold text-gray-900">
                  {year}-{String(month).padStart(2, "0")}-{String(day).padStart(2, "0")} {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}
                </div>
                <div className="text-xs text-gray-500">{gender === 1 ? t("male", lang) : t("female", lang)}</div>
              </div>
            </div>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${showForm ? "rotate-180" : ""}`} />
          </button>

          {showForm && (
            <div className="mt-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t("year", lang)}</label>
                  <input
                    type="number" value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm"
                    min={1900} max={2100}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t("month", lang)}</label>
                  <select value={month} onChange={e => setMonth(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t("day", lang)}</label>
                  <select value={day} onChange={e => setDay(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t("gender", lang)}</label>
                  <select value={gender} onChange={e => setGender(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm">
                    <option value={1}>{t("male", lang)}</option>
                    <option value={0}>{t("female", lang)}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t("hour", lang)} (0-23)</label>
                  <select value={hour} onChange={e => setHour(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm">
                    {Array.from({ length: 24 }, (_, i) => i).map(h => (
                      <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t("minute", lang)}</label>
                  <select value={minute} onChange={e => setMinute(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm">
                    {[0, 15, 30, 45].map(m => (
                      <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleCalculate}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all text-sm"
              >
                {t("calculate", lang)}
              </button>
            </div>
          )}
        </div>

        {/* 结果区 */}
        {!bazi ? (
          <div className="text-center py-16 text-gray-400">
            <Compass size={48} className="mx-auto mb-4 opacity-30" />
            <p>{t("noData", lang)}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 日主卡片 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: dayMaster?.color || "#555" }}
              >
                {dayMaster?.stem || "?"}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">{t("dayMaster", lang)}</div>
                <div className="text-xl font-bold text-gray-900">
                  {dayMaster?.stem}{dayMaster?.branch}{dayMaster?.stem}造
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {bazi?.lunarText} · {bazi?.solarText}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl">{ZODIAC_ANIMALS[dayMaster?.branch || ""] || "?"}</div>
                <div className="text-xs text-gray-500 mt-1" style={{ color: dayMaster?.color }}>
                  {dayMaster?.element}
                </div>
              </div>
            </div>

            {/* 四柱表格 */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-gray-500 font-medium"></th>
                    <th className="p-3 text-gray-500 font-medium">{t("yearPillar", lang)}</th>
                    <th className="p-3 text-gray-500 font-medium">{t("monthPillar", lang)}</th>
                    <th className="p-3 text-gray-500 font-medium">{t("dayPillar", lang)}</th>
                    <th className="p-3 text-gray-500 font-medium">{t("timePillar", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-gray-500 bg-gray-50 font-medium">{t("stems", lang)}</td>
                    {["year", "month", "day", "time"].map(key => (
                      <td key={key} className="p-3">
                        <span className="text-3xl font-bold" style={{ color: p?.[key]?.color }}>
                          {p?.[key]?.gan || "-"}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-gray-500 bg-gray-50 font-medium">{t("branches", lang)}</td>
                    {["year", "month", "day", "time"].map(key => (
                      <td key={key} className="p-3 text-3xl font-bold text-gray-800">{p?.[key]?.zhi || "-"}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-gray-500 bg-gray-50 font-medium">{t("tenGod", lang)}</td>
                    {["year", "month", "day", "time"].map(key => (
                      <td key={key} className="p-3 text-gray-600">{p?.[key]?.tenGod || "-"}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-gray-500 bg-gray-50 font-medium">{t("hiddenStem", lang)}</td>
                    {["year", "month", "day", "time"].map(key => (
                      <td key={key} className="p-3 text-gray-600">{(p?.[key]?.hidden || []).join(" ") || "-"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-500 bg-gray-50 font-medium">{t("nayin", lang)}</td>
                    {["year", "month", "day", "time"].map(key => (
                      <td key={key} className="p-3 text-gray-600">{p?.[key]?.naYin || "-"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 辅助柱 */}
            {bazi?.extraPillars && (
              <div className="rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("extraPillars", lang)}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {bazi.extraPillars.map((ep: any) => (
                    <div key={ep.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <div className="text-xs text-gray-500">{ep.label}</div>
                      <div className="text-lg font-bold text-gray-800 mt-1">{ep.value || "-"}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{ep.naYin || ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 五行平衡 — 简化柱形 */}
            {(() => {
              const counts: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
              if (p) {
                Object.values(p).forEach((pillar: any) => {
                  if (pillar.element) counts[pillar.element] = (counts[pillar.element] || 0) + 1;
                });
              }
              const max = Math.max(...Object.values(counts), 1);
              return (
                <div className="rounded-2xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("element", lang)} 分布</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(counts).map(([el, count]) => (
                      <div key={el} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">{el}</div>
                        <div className="h-20 bg-gray-100 rounded-lg relative overflow-hidden">
                          <div
                            className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-all"
                            style={{ height: `${(count / max) * 100}%`, background: ELEMENT_COLORS[el] || "#999" }}
                          />
                        </div>
                        <div className="text-xs font-bold mt-1" style={{ color: ELEMENT_COLORS[el] }}>{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 大运 */}
            {luck?.daYun && luck.daYun.length > 0 && (
              <div className="rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {t("luckCycles", lang)}
                  <span className="text-xs text-gray-400 ml-2 font-normal">{luck.startText}</span>
                </h3>
                <div className="flex overflow-x-auto gap-2 pb-2">
                  {luck.daYun.map((dy: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => { setDaYunIdx(i); setLiuNianIdx(-1); setLiuYueIdx(-1); }}
                      className={`flex-shrink-0 px-4 py-3 rounded-xl text-center border min-w-[90px] transition-all ${
                        (daYunIdx >= 0 ? i === daYunIdx : dy.active)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-lg font-bold">{dy.ganZhi}</div>
                      <div className="text-xs mt-1 opacity-70">{dy.startAge}-{dy.endAge}{t("age", lang)}</div>
                    </button>
                  ))}
                </div>

                {/* 大运对应的流年 */}
                {activeDaYun?.liuNian && activeDaYun.liuNian.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-2">{t("yearlyLuck", lang)}</div>
                    <div className="flex overflow-x-auto gap-2 pb-2">
                      {activeDaYun.liuNian.map((ln: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => { setLiuNianIdx(i); setLiuYueIdx(-1); }}
                          className={`flex-shrink-0 px-3 py-2 rounded-lg text-center border text-xs min-w-[70px] transition-all ${
                            (liuNianIdx >= 0 ? i === liuNianIdx : ln.active)
                              ? "bg-gray-800 text-white border-gray-800"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-bold">{ln.ganZhi}</div>
                          <div className="opacity-70">{ln.year}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 流月 */}
                {activeLiuNian?.liuYue && activeLiuNian.liuYue.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-2">{t("monthlyLuck", lang)}</div>
                    <div className="flex overflow-x-auto gap-2 pb-2">
                      {activeLiuNian.liuYue.map((lm: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setLiuYueIdx(i)}
                          className={`flex-shrink-0 px-3 py-2 rounded-lg text-center border text-xs min-w-[60px] transition-all ${
                            (liuYueIdx >= 0 ? i === liuYueIdx : lm.active)
                              ? "bg-gray-700 text-white border-gray-700"
                              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-bold">{lm.ganZhi}</div>
                          <div className="opacity-70">{lm.month}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 神煞 */}
            {bazi?.shenSha?.natal && (
              <div className="rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("shensha", lang)}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {bazi.shenSha.natal.map((row: any) => (
                    <div key={row.key} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-500">{row.label}</div>
                      <div className="text-sm font-medium text-gray-800 mt-1">
                        {row.names.length ? row.names.join(" · ") : "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 合冲害 */}
            {bazi?.interactions?.natal && (
              <div className="rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("interactions", lang)}</h3>
                <div className="space-y-2 text-sm">
                  {bazi.interactions.natal.stems.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-gray-500">{t("stems", lang)}:</span>
                      {bazi.interactions.natal.stems.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{s}</span>
                      ))}
                    </div>
                  )}
                  {bazi.interactions.natal.branches.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-gray-500">{t("branches", lang)}:</span>
                      {bazi.interactions.natal.branches.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{s}</span>
                      ))}
                    </div>
                  )}
                  {bazi.interactions.natal.stems.length === 0 && bazi.interactions.natal.branches.length === 0 && (
                    <p className="text-gray-400">-</p>
                  )}
                </div>
              </div>
            )}

            {/* AI Chat */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-900 text-white px-5 py-3 flex items-center gap-2">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">{t("aiChat", lang)}</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-4 space-y-3 bg-gray-50">
                {chatMsgs.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">{t("aiPlaceholder", lang)}</p>
                )}
                {chatMsgs.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-gray-900 text-white rounded-br-md"
                        : "bg-white text-gray-700 border border-gray-200 rounded-bl-md"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-md">
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 p-3 bg-white border-t border-gray-200">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder={t("aiPlaceholder", lang)}
                  className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400"
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading}
                  className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                  {chatLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
