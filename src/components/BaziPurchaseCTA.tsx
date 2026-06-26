"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const T: Record<string, any> = {
  zh: {
    title: "🔮 解锁深度解读",
    line1: "免费排盘只是第一层——",
    line2: "AI 深度解读揭示你命盘的全部密码：日主性格、十年大运、财运事业感情专项。",
    btn1: "AI 单次解读 · $3.99",
    btn2: "完整年运报告 · $29.99",
  },
  en: {
    title: "🔮 Go Deeper With AI",
    line1: "Your free chart only scratches the surface —",
    line2: "Unlock your Day Master personality profile, 10-year luck cycles, and detailed career, wealth & relationship insights.",
    btn1: "AI Deep Reading · $3.99",
    btn2: "Annual Fortune Report · $29.99",
  },
  id: {
    title: "🔮 Buka Bacaan Mendalam",
    line1: "Bagan gratis Anda baru permukaan —",
    line2: "Bacaan AI mengungkap kepribadian Day Master, siklus 10 tahun, karier, rezeki & cinta.",
    btn1: "Bacaan AI · $3.99",
    btn2: "Buku Keberuntungan · $29.99",
  },
};

const GUMLINKS: Record<string, string> = {
  single: "https://hanhan55.gumroad.com/l/zgbent",
  fortune: "https://hanhan55.gumroad.com/l/zxccdv",
};

export default function BaziPurchaseCTA() {
  const { language } = useLanguage();
  const t = T[language] || T.en;

  return (
    <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
      <h4 className="text-sm font-bold text-gray-900 mb-2">{t.title}</h4>
      <p className="text-xs text-gray-600 mb-1">{t.line1}</p>
      <p className="text-xs text-gray-600 mb-4">{t.line2}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={GUMLINKS.single}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center px-4 py-2 bg-[#171717] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors"
        >
          {t.btn1}
        </a>
        <a
          href={GUMLINKS.fortune}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
        >
          {t.btn2}
        </a>
      </div>
    </div>
  );
}
