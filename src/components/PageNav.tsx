"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageNavProps {
  title?: string;
  subtitle?: string;
}

const translations: Record<string, Record<string, string>> = {
  zh: { backToHome: "← 返回首页", siteName: "星缘占星" },
  id: { backToHome: "← Beranda", siteName: "Bintang Jodoh" },
  en: { backToHome: "← Home", siteName: "Star Destiny" },
};

export default function PageNav({ title, subtitle }: PageNavProps) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a1a]/90 border-b border-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：返回首页 + 标题 */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-300 hover:text-gray-600 transition-colors group"
            >
              <span className="text-xl">✨</span>
              <span className="text-sm group-hover:text-gray-600">{t.backToHome}</span>
            </Link>
            {title && (
              <div className="hidden sm:block border-l border-gray-700 pl-4">
                <h1 className="text-lg font-bold text-gray-100">{title}</h1>
                {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
              </div>
            )}
          </div>

          {/* 右侧：网站名 + 语言选择 */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-bold text-gray-600 hover:text-gray-100 transition">
              {t.siteName}
            </Link>
            <div className="flex items-center gap-1 bg-gray-900/50 rounded-lg p-1">
              <button
                onClick={() => setLanguage("zh")}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  language === "zh"
                    ? "bg-gray-500/30 text-gray-600"
                    : "text-gray-300 hover:text-gray-600"
                }`}
              >
                🇨🇳
              </button>
              <button
                onClick={() => setLanguage("id")}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  language === "id"
                    ? "bg-gray-500/30 text-gray-600"
                    : "text-gray-300 hover:text-gray-600"
                }`}
              >
                🇮🇩
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  language === "en"
                    ? "bg-gray-500/30 text-gray-600"
                    : "text-gray-300 hover:text-gray-600"
                }`}
              >
                🇺🇸
              </button>
            </div>
          </div>
        </div>
        {/* 移动端标题 */}
        {title && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-800/50">
            <h1 className="text-lg font-bold text-gray-100">{title}</h1>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        )}
      </div>
    </nav>
  );
}
