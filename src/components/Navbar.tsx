"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const T: Record<string, Record<string, string>> = {
  zh: { home:"首页", horoscope:"运势", natal:"星盘", compatibility:"配对", ai:"AI解读", learn:"学习", transits:"天象", community:"社区", tarot:"塔罗", yearly:"年度运势", academy:"学院", compare:"对比" },
  en: { home:"Home", horoscope:"Horoscope", natal:"Chart", compatibility:"Match", ai:"AI", learn:"Learn", transits:"Transits", community:"Community", tarot:"Tarot", yearly:"Yearly", academy:"Academy", compare:"Compare" },
  id: { home:"Beranda", horoscope:"Horoskop", natal:"Bagan", compatibility:"Cocok", ai:"AI", learn:"Belajar", transits:"Transit", community:"Komunitas", tarot:"Tarot", yearly:"Tahunan", academy:"Akademi", compare:"Banding" },
};

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = T[language] || T.zh;

  const links = [
    { name: t.home, href: "/" },
    { name: t.horoscope, href: "/horoscope" },
    { name: t.natal, href: "/natal" },
    { name: t.compatibility, href: "/compatibility" },
    { name: t.ai, href: "/ai-reading" },
    { name: t.tarot, href: "/tarot" },
    { name: t.transits, href: "/transits" },
    { name: t.learn, href: "/learn" },
    { name: t.community, href: "/community" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-xl">✨</span>
            <span className="text-base font-bold text-gray-800">星缘</span>
          </Link>
          <div className="hidden md:flex items-center gap-3 flex-wrap">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-gray-500 hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(["zh","en","id"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                language === l ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {{zh:"中",en:"EN",id:"ID"}[l]}
            </button>
          ))}
          <Link href="/login" className="ml-2 text-xs text-gray-400 hover:text-gray-600">登录</Link>
        </div>
      </div>
    </nav>
  );
}
