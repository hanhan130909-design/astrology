"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import AIReading from "@/components/AIReading";
import { useLanguage, translations } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, Star } from "lucide-react";

export default function AIPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const labels: Record<string, { back: string; title: string; subtitle: string }> = {
    id: { back: "← Beranda", title: "🤖 AI Pembacaan Bintang", subtitle: "Wawasan mendalam tentang diri Anda" },
    en: { back: "← Home", title: "🤖 AI Birth Chart Reading", subtitle: "Deep insights about yourself" },
    zh: { back: "← 返回首页", title: "🤖 AI 星盘解读", subtitle: "深入了解你自己" },
    th: { back: "← หน้าแรก", title: "🤖 AI ดูดวง", subtitle: "เข้าใจตัวเองลึกซึ้ง" },
    vi: { back: "← Trang chủ", title: "🤖 AI Xem Tử Vi", subtitle: "Hiểu sâu về bản thân" },
    ms: { back: "← Laman Utama", title: "🤖 AI Bacaan Bintang", subtitle: "Pemahaman mendalam" },
    ja: { back: "← ホーム", title: "🤖 AI 星読み", subtitle: "自分を深く知る" },
    ko: { back: "← 홈", title: "🤖 AI 점괘", subtitle: "자신을 깊이 이해하다" },
  };
  const currentLabels = labels[language] || labels['zh'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffffff] via-white to-[#ffffff] text-gray-900">
      {/* 导航栏 - 统一主页风格 */}
      

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-sm text-purple-700 mb-4">
            <Sparkles size={16} className="fill-purple-300" />
            {language === 'zh' ? 'AI 智能服务' : language === 'id' ? 'Layanan AI Cerdas' : 'AI Smart Service'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {currentLabels.title}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {currentLabels.subtitle}
          </p>
        </div>

        <AIReading />
      </main>
    </div>
  );
}