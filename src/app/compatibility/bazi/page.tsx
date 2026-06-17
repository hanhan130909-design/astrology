"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildBaziViewData } from "@/lib/baziViewData";
import { ArrowLeft, Users, Heart, Sparkles } from "lucide-react";

const T: Record<string, Record<string, string>> = {
  title: { zh:"八字合盘", en:"BaZi Compatibility", id:"Kompatibilitas BaZi", th:"ความเข้ากันปาจื่อ", vi:"Tương Hợp Bát Tự", ms:"Keserasian BaZi", ja:"八字相性", ko:"사주 궁합" },
  subtitle: { zh:"输入两人出生信息，分析八字合盘", en:"Enter two birth charts for BaZi synastry analysis", id:"Masukkan dua data lahir untuk analisis", th:"กรอกข้อมูลเกิดสองคนเพื่อวิเคราะห์", vi:"Nhập hai lá số để phân tích", ms:"Masukkan dua data lahir", ja:"二人の出生情報で相性を分析", ko:"두 사람의 사주 궁합 분석" },
  person1: { zh:"本人", en:"Person 1", id:"Orang 1", th:"คนที่ 1", vi:"Người 1", ms:"Orang 1", ja:"本人", ko:"본인" },
  person2: { zh:"对方", en:"Person 2", id:"Orang 2", th:"คนที่ 2", vi:"Người 2", ms:"Orang 2", ja:"相手", ko:"상대" },
  year: { zh:"年", en:"Year", id:"Tahun", th:"ปี", vi:"Năm", ms:"Tahun", ja:"年", ko:"년" },
  month: { zh:"月", en:"Mo", id:"Bln", th:"เดือน", vi:"Tháng", ms:"Bln", ja:"月", ko:"월" },
  day: { zh:"日", en:"Day", id:"Hari", th:"วัน", vi:"Ngày", ms:"Hari", ja:"日", ko:"일" },
  hour: { zh:"时", en:"Hr", id:"Jam", th:"ชม", vi:"Giờ", ms:"Jam", ja:"時", ko:"시" },
  male: { zh:"男", en:"Male", id:"Pria", th:"ชาย", vi:"Nam", ms:"Lelaki", ja:"男", ko:"남" },
  female: { zh:"女", en:"Female", id:"Wanita", th:"หญิง", vi:"Nữ", ms:"Perempuan", ja:"女", ko:"여" },
  analyze: { zh:"分析合盘", en:"Analyze Compatibility", id:"Analisis", th:"วิเคราะห์", vi:"Phân tích", ms:"Analisis", ja:"分析", ko:"분석" },
  pillars: { zh:"四柱", en:"Four Pillars", id:"Empat Pilar", th:"สี่เสา", vi:"Tứ Trụ", ms:"Empat Tiang", ja:"四柱", ko:"사주" },
  dayMaster: { zh:"日主", en:"Day Master", id:"Day Master", th:"เจ้าชะตา", vi:"Nhật Chủ", ms:"Day Master", ja:"日主", ko:"일주" },
  compatibility: { zh:"合盘分析", en:"Compatibility Analysis", id:"Analisis Kompatibilitas", th:"วิเคราะห์ความเข้ากัน", vi:"Phân Tích Tương Hợp", ms:"Analisis Keserasian", ja:"相性分析", ko:"궁합 분석" },
  stemCombine: { zh:"天干合", en:"Stem Combinations", id:"Kombinasi Batang", th:"ก้านฟ้ารวม", vi:"Thiên Can Hợp", ms:"Gabungan Batang", ja:"天干合", ko:"천간합" },
  branchRelation: { zh:"地支关系", en:"Branch Relations", id:"Hubungan Cabang", th:"ความสัมพันธ์กิ่งดิน", vi:"Quan Hệ Địa Chi", ms:"Hubungan Cabang", ja:"地支関係", ko:"지지 관계" },
  elementMatch: { zh:"五行匹配", en:"Element Match", id:"Kecocokan Elemen", th:"ธาตุตรงกัน", vi:"Ngũ Hành Tương Hợp", ms:"Padanan Unsur", ja:"五行マッチ", ko:"오행 매칭" },
  tenGodMatch: { zh:"十神互动", en:"Ten God Interaction", id:"Interaksi Sepuluh Dewa", th:"ปฏิสัมพันธ์เทพสิบ", vi:"Tương Tác Thập Thần", ms:"Interaksi Sepuluh Dewa", ja:"十神相互作用", ko:"십신 상호작용" },
  overall: { zh:"综合评分", en:"Overall Score", id:"Skor Keseluruhan", th:"คะแนนรวม", vi:"Điểm Tổng", ms:"Skor Keseluruhan", ja:"総合評価", ko:"종합 점수" },
  excellent: { zh:"天作之合", en:"Excellent Match", id:"Sangat Cocok", th:"เข้ากันดีมาก", vi:"Rất Hợp", ms:"Sangat Serasi", ja:"最高の相性", ko:"천생연분" },
  good: { zh:"良好配对", en:"Good Match", id:"Cocok", th:"เข้ากันได้ดี", vi:"Hợp", ms:"Serasi", ja:"良い相性", ko:"좋은 궁합" },
  fair: { zh:"需要磨合", en:"Needs Work", id:"Perlu Usaha", th:"ต้องปรับตัว", vi:"Cần Điều Chỉnh", ms:"Perlu Usaha", ja:"要調整", ko:"조율 필요" },
  backHome: { zh:"返回首页", en:"Back to Home", id:"Kembali", th:"กลับหน้าแรก", vi:"Về Trang Chủ", ms:"Kembali", ja:"ホームに戻る", ko:"홈으로" },
};

const ELEMENT_COLORS: Record<string, string> = {
  木: "#4CAF50", 火: "#F44336", 土: "#795548", 金: "#FF9800", 水: "#2196F3",
};

export default function BaziCompatibilityPage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const t = (k: string) => T[k]?.[lang] || T[k]?.en || k;

  const [p1, setP1] = useState({ year: 1990, month: 6, day: 15, hour: 12, minute: 0, gender: 1 });
  const [p2, setP2] = useState({ year: 1992, month: 3, day: 20, hour: 8, minute: 0, gender: 0 });

  const bazi1 = useMemo(() => {
    try { return buildBaziViewData({ ...p1, name: "" }); } catch { return null; }
  }, [p1.year, p1.month, p1.day, p1.hour, p1.minute, p1.gender]);

  const bazi2 = useMemo(() => {
    try { return buildBaziViewData({ ...p2, name: "" }); } catch { return null; }
  }, [p2.year, p2.month, p2.day, p2.hour, p2.minute, p2.gender]);

  // Compatibility analysis
  const analysis = useMemo(() => {
    if (!bazi1 || !bazi2) return null;
    const dm1 = bazi1.dayMaster;
    const dm2 = bazi2.dayMaster;
    
    // Element compatibility
    const elemScores: Record<string, Record<string, number>> = {
      木: { 木: 3, 火: 5, 土: 2, 金: 1, 水: 4 },
      火: { 木: 5, 火: 3, 土: 5, 金: 2, 水: 1 },
      土: { 木: 2, 火: 5, 土: 4, 金: 3, 水: 2 },
      金: { 木: 1, 火: 2, 土: 3, 金: 3, 水: 5 },
      水: { 木: 4, 火: 1, 土: 2, 金: 5, 水: 3 },
    };
    const elemScore = (elemScores[dm1?.element]?.[dm2?.element] || 3) * 15;
    
    // Stem combinations between day masters
    const stemCombines: Record<string, string> = {
      "甲己": "甲己合化土", "乙庚": "乙庚合化金", "丙辛": "丙辛合化水",
      "丁壬": "丁壬合化木", "戊癸": "戊癸合化火",
    };
    const stemPair = dm1?.stem + dm2?.stem;
    const stemPair2 = dm2?.stem + dm1?.stem;
    const stemCombine = stemCombines[stemPair] || stemCombines[stemPair2] || null;
    const stemScore = stemCombine ? 25 : 10;
    
    // Branch relations
    const branchClashes: Record<string, string> = {
      "子午": "子午冲", "丑未": "丑未冲", "寅申": "寅申冲",
      "卯酉": "卯酉冲", "辰戌": "辰戌冲", "巳亥": "巳亥冲",
    };
    const branchCombines: Record<string, string> = {
      "子丑": "子丑合", "寅亥": "寅亥合", "卯戌": "卯戌合",
      "辰酉": "辰酉合", "巳申": "巳申合", "午未": "午未合",
    };
    const bp = dm1?.branch + dm2?.branch;
    const bp2 = dm2?.branch + dm1?.branch;
    const branchClash = branchClashes[bp] || branchClashes[bp2] || null;
    const branchCombine = branchCombines[bp] || branchCombines[bp2] || null;
    const branchScore = branchCombine ? 25 : branchClash ? 5 : 15;
    
    // Count ten god interactions from both sides
    const tenGodHits: string[] = [];
    const pillars1 = bazi1.pillarList || [];
    const pillars2 = bazi2.pillarList || [];
    const beneficialRoles = ["正印", "偏印", "正官", "食神"];
    for (const p of pillars1) {
      if (beneficialRoles.some(r => p.tenGod?.includes(r))) tenGodHits.push(`${p.label}:${p.tenGod}`);
    }
    const tenGodScore = Math.min(30, tenGodHits.length * 7 + 5);
    
    const total = elemScore + stemScore + branchScore + tenGodScore;
    const verdict = total >= 75 ? "excellent" : total >= 55 ? "good" : "fair";
    return { elemScore, stemScore, branchScore, tenGodScore, total, verdict, stemCombine, branchClash, branchCombine, tenGodHits };
  }, [bazi1, bazi2]);

  const FieldSet = ({ p, setP, label }: { p: any; setP: any; label: string }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">{t("year")}</label>
          <input type="number" value={p.year} onChange={e => setP({ ...p, year: Number(e.target.value) })}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm" min={1900} max={2100} />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">{t("month")}</label>
          <select value={p.month} onChange={e => setP({ ...p, month: Number(e.target.value) })}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm">
            {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">{t("day")}</label>
          <select value={p.day} onChange={e => setP({ ...p, day: Number(e.target.value) })}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm">
            {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">{t("hour")}</label>
          <select value={p.hour} onChange={e => setP({ ...p, hour: Number(e.target.value) })}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm">
            {Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">{t("minute", lang)}</label>
          <select value={p.minute} onChange={e => setP({ ...p, minute: Number(e.target.value) })}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm">
            {[0,15,30,45].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">{lang==="zh"?"性别":"Sex"}</label>
          <select value={p.gender} onChange={e => setP({ ...p, gender: Number(e.target.value) })}
            className="w-full p-2 rounded-lg border border-gray-200 text-sm">
            <option value={1}>{t("male")}</option>
            <option value={0}>{t("female")}</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft size={16} /> {t("backHome")}
          </a>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-500 text-sm">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <FieldSet p={p1} setP={setP1} label={t("person1")} />
            {bazi1 && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-3">
                <span className="text-2xl font-bold" style={{color: ELEMENT_COLORS[bazi1.dayMaster.element]||"#555"}}>
                  {bazi1.dayMaster.stem}
                </span>
                <div>
                  <div className="text-xs text-gray-500">{t("dayMaster")}: {bazi1.dayMaster.stem}{bazi1.dayMaster.branch}</div>
                  <div className="text-xs text-gray-400">{bazi1.pillars?.year?.ganZhi} {bazi1.pillars?.month?.ganZhi} {bazi1.pillars?.day?.ganZhi} {bazi1.pillars?.time?.ganZhi}</div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <FieldSet p={p2} setP={setP2} label={t("person2")} />
            {bazi2 && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-3">
                <span className="text-2xl font-bold" style={{color: ELEMENT_COLORS[bazi2.dayMaster.element]||"#555"}}>
                  {bazi2.dayMaster.stem}
                </span>
                <div>
                  <div className="text-xs text-gray-500">{t("dayMaster")}: {bazi2.dayMaster.stem}{bazi2.dayMaster.branch}</div>
                  <div className="text-xs text-gray-400">{bazi2.pillars?.year?.ganZhi} {bazi2.pillars?.month?.ganZhi} {bazi2.pillars?.day?.ganZhi} {bazi2.pillars?.time?.ganZhi}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-2">{t("overall")}</div>
              <div className="text-5xl font-bold mb-2" style={{color: analysis.total >= 75 ? "#4CAF50" : analysis.total >= 55 ? "#FF9800" : "#F44336"}}>
                {analysis.total}
              </div>
              <div className="text-lg font-semibold text-gray-900">{t(analysis.verdict)}</div>
            </div>

            {/* Detail Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">{t("elementMatch")}</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.elemScore}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">{t("stemCombine")}</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.stemScore}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">{t("branchRelation")}</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.branchScore}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">{t("tenGodMatch")}</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.tenGodScore}</div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 text-sm">
              {analysis.stemCombine && (
                <div className="flex items-center gap-2"><Heart size={14} className="text-green-500"/><span className="text-green-700 font-medium">{analysis.stemCombine}</span><span className="text-gray-500">— 日主天干相合，天然吸引力强</span></div>
              )}
              {analysis.branchCombine && (
                <div className="flex items-center gap-2"><Heart size={14} className="text-green-500"/><span className="text-green-700 font-medium">{analysis.branchCombine}</span><span className="text-gray-500">— 日主地支相合，相处和谐</span></div>
              )}
              {analysis.branchClash && (
                <div className="flex items-center gap-2"><Sparkles size={14} className="text-orange-500"/><span className="text-orange-700 font-medium">{analysis.branchClash}</span><span className="text-gray-500">— 日主地支相冲，需互相包容</span></div>
              )}
              {analysis.tenGodHits.length > 0 && (
                <div className="flex items-start gap-2">
                  <Sparkles size={14} className="text-blue-500 mt-0.5"/>
                  <div>
                    <span className="text-blue-700 font-medium">十神互补：</span>
                    <span className="text-gray-500">{analysis.tenGodHits.slice(0,5).join("、")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
