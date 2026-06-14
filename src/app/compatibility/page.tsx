"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import SynastryChart from "@/components/SynastryChart";
import { ArrowLeft, HeartHandshake } from "lucide-react";

const translations: Record<string, Record<string, string>> = {
  zh: { siteName: "星缘", title: "💕 星座配对分析", subtitle: "看看你和伴侣有多般配" },
  en: { siteName: "Starry Fate", title: "💕 Compatibility Analysis", subtitle: "See how compatible you are with your partner" },
  id: { siteName: "Starry Fate", title: "💕 Analisis Kecocokan", subtitle: "Lihat seberapa cocok Anda dengan pasangan" },
  th: { siteName: "ดูดวง", title: "💕 วิเคราะห์ความเข้ากัน", subtitle: "ดูว่าคุณเข้ากับคู่ของคุณมากแค่ไหน" },
  vi: { siteName: "Xem Tử Vi", title: "💕 Phân Tích Tương Hợp", subtitle: "Xem bạn và đối phương có hợp nhau không" },
  ms: { siteName: "Xingyuan", title: "💕 Analisis Keserasian", subtitle: "Lihat sejauh mana keserasian anda dengan pasangan" },
  ja: { siteName: "星読み", title: "💕 相性診断", subtitle: "あなたとパートナーの相性を見てみましょう" },
  ko: { siteName: "별점보기", title: "💕 궁합 분석", subtitle: "당신과 파트너의 궁합을 확인하세요" },
};

export default function CompatibilityPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0f0f23] to-[#020617] text-gray-900">
      {/* 导航栏 - 统一主页风格 */}
      

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 rounded-full text-sm text-rose-300 mb-4">
            <HeartHandshake size={16} className="fill-rose-300" />
            {language === 'zh' ? '寻找灵魂伴侣' : language === 'id' ? 'Temukan Jodoh' : language === 'th' ? 'ค้นหาแฟนที่ใช่' : language === 'vi' ? 'Tìm ngườii yêu' : language === 'ms' ? 'Cari pasangan' : language === 'ja' ? '運命の相手を探す' : language === 'ko' ? '영혼의 반쪽을 찾다' : 'Find Your Soulmate'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <SynastryChart language={language as "id" | "en" | "zh"} />
      </main>
    </div>
  );
}