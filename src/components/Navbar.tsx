"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const navTranslations: Record<string, { name: string; href: string }[]> = {
  id: [
    { name: "首页", href: "/" },
    { name: "运势", href: "/horoscope" },
    { name: "星盘", href: "/chart" },
    { name: "配对", href: "/compatibility" },
    { name: "AI解读", href: "/ai-reading" },
    { name: "学习", href: "/learn" },
    { name: "天象", href: "/transits" },
    { name: "社区", href: "/community" },
  ],
  en: [
    { name: "Home", href: "/" },
    { name: "Horoscope", href: "/horoscope" },
    { name: "Chart", href: "/chart" },
    { name: "Compatibility", href: "/compatibility" },
    { name: "AI Reading", href: "/ai-reading" },
    { name: "Learn", href: "/learn" },
    { name: "Transits", href: "/transits" },
    { name: "Community", href: "/community" },
  ],
  zh: [
    { name: "首页", href: "/" },
    { name: "运势", href: "/horoscope" },
    { name: "星盘", href: "/chart" },
    { name: "配对", href: "/compatibility" },
    { name: "AI解读", href: "/ai-reading" },
    { name: "学习", href: "/learn" },
    { name: "天象", href: "/transits" },
    { name: "社区", href: "/community" },
  ],
};

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const navItems = navTranslations[language];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a1a]/90 border-b border-purple-900/30">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-lg font-bold text-amber-200">
                {language === "id" ? "Bintang Jodoh" : language === "en" ? "Star Destiny" : "星缘占星"}
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-purple-200/80 hover:text-amber-200 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage("id")}
              className={`px-2 py-1 rounded text-sm ${
                language === "id" ? "bg-amber-500/30 text-amber-200" : "text-purple-300"
              }`}
            >
              🇮🇩 ID
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded text-sm ${
                language === "en" ? "bg-amber-500/30 text-amber-200" : "text-purple-300"
              }`}
            >
              🇺🇸 EN
            </button>
            <button
              onClick={() => setLanguage("zh")}
              className={`px-2 py-1 rounded text-sm ${
                language === "zh" ? "bg-amber-500/30 text-amber-200" : "text-purple-300"
              }`}
            >
              🇨🇳 中
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}