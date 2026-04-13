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
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0f0f23] to-[#020617] text-white">
      {/* 导航栏 - 统一主页风格 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#020617]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-amber-200 transition-colors">
                <ArrowLeft size={20} />
                <span className="text-sm">{currentLabels.back}</span>
              </Link>
              <span className="text-slate-600 hidden sm:block">|</span>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
                {t.siteName}
              </span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-sm text-purple-300 mb-4">
            <Sparkles size={16} className="fill-purple-300" />
            {language === 'zh' ? 'AI 智能服务' : language === 'id' ? 'Layanan AI Cerdas' : 'AI Smart Service'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {currentLabels.title}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {currentLabels.subtitle}
          </p>
        </div>

        <AIReading />
      </main>
    </div>
  );
}