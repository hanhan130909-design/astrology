"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import SynastryChart from "@/components/SynastryChart";
import { HeartHandshake, ArrowRight, Star, CheckCircle } from "lucide-react";

const T: Record<string, Record<string, any>> = {
  zh: {
    title: "星座配对分析",
    subtitle: "探索你与Ta的灵魂契合度",
    badge: "寻找灵魂伴侣",
    intro: "基于出生信息的专业合盘分析，从太阳星座到完整星盘，揭示两人关系的深层能量互动。",
    quickTitle: "快速星座配对",
    quickDesc: "选择两人的太阳星座，查看基础配对指数",
    fullTitle: "完整合盘分析",
    fullDesc: "输入双方出生时间地点，获得精确的行星相位对比、关系宫位分析和契合度评分",
    cta: "开始配对分析",
    features: ["行星相位对比", "关系宫位分析", "契合度评分", "互动模式解读"],
  },
  en: {
    title: "Compatibility Analysis",
    subtitle: "Discover your cosmic connection",
    badge: "Find Your Soulmate",
    intro: "Professional synastry analysis based on birth data. From sun signs to full chart comparison, revealing the deep energetic dynamics of your relationship.",
    quickTitle: "Quick Zodiac Match",
    quickDesc: "Select both sun signs for basic compatibility rating",
    fullTitle: "Full Synastry Analysis",
    fullDesc: "Enter both birth times and locations for precise planetary aspect comparison, relationship house analysis, and compatibility scoring",
    cta: "Start Analysis",
    features: ["Planetary Aspect Comparison", "House Analysis", "Compatibility Score", "Dynamic Reading"],
  },
  id: {
    title: "Analisis Kecocokan",
    subtitle: "Temukan koneksi kosmik Anda",
    badge: "Temukan Jodoh",
    intro: "Analisis sinastri profesional berdasarkan data kelahiran. Dari zodiak hingga perbandingan bagan lengkap.",
    quickTitle: "Cocok Zodiak Cepat",
    quickDesc: "Pilih kedua zodiak untuk peringkat kecocokan dasar",
    fullTitle: "Analisis Sinastri Lengkap",
    fullDesc: "Masukkan waktu dan lokasi lahir untuk perbandingan aspek planet yang tepat",
    cta: "Mulai Analisis",
    features: ["Perbandingan Aspek", "Analisis Rumah", "Skor Kecocokan", "Bacaan Dinamis"],
  },
};

export default function CompatibilityPage() {
  const { language } = useLanguage();
  const t = T[language] || T.zh;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 rounded-full text-sm text-rose-600 mb-4">
            <HeartHandshake size={16} />
            {t.badge}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t.title}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t.subtitle}</p>
          <p className="text-gray-400 max-w-xl mx-auto mt-4 text-sm leading-relaxed">{t.intro}</p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
          {t.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-3 bg-rose-50 rounded-xl border border-rose-100">
              <CheckCircle size={16} className="text-rose-400 shrink-0" />
              <span className="text-sm text-gray-600">{f}</span>
            </div>
          ))}
        </div>

        {/* Quick Zodiac Match Section */}
        <div className="max-w-3xl mx-auto mb-16 p-8 bg-gradient-to-r from-purple-50 to-rose-50 rounded-2xl border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Star size={20} className="text-amber-500 fill-amber-500" />
            {t.quickTitle}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{t.quickDesc}</p>
          
          {/* Sun sign compatibility grid - simplified */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {["♈白羊","♉金牛","♊双子","♋巨蟹","♌狮子","♍处女","♎天秤","♏天蝎","♐射手","♑摩羯","♒水瓶","♓双鱼"].map((sign, i) => (
              <Link key={i} href={`/zodiac/${["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"][i]}`}
                className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-center text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                {sign}
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">点击星座查看详情，下方输入出生信息进行精确合盘</p>
        </div>

        {/* Full Synastry */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.fullTitle}</h2>
            <p className="text-gray-500">{t.fullDesc}</p>
          </div>
          <SynastryChart language={language as "id" | "en" | "zh"} />
        </div>

        {/* Link to compare */}
        <div className="text-center mt-16 pb-8">
          <Link href="/compare" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
            多人对比分析（3人以上）<ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
