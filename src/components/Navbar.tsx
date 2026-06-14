"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const T: Record<string, Record<string, string>> = {
  zh: { home:"首页", horoscope:"运势", natal:"星盘", compatibility:"配对", ai:"AI解读", learn:"学习", transits:"天象", community:"社区", tarot:"塔罗" },
  en: { home:"Home", horoscope:"Horoscope", natal:"Chart", compatibility:"Match", ai:"AI", learn:"Learn", transits:"Transits", community:"Community", tarot:"Tarot" },
  id: { home:"Beranda", horoscope:"Horoskop", natal:"Bagan", compatibility:"Cocok", ai:"AI", learn:"Belajar", transits:"Transit", community:"Komunitas", tarot:"Tarot" },
};

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = T[language] || T.zh;

  const links = [
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
    <nav className="sticky top-0 z-50 bg-white/92 backdrop-blur-sm" style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08)"}}>
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[#171717] no-underline">
            ✨ 星缘
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-gray-500 hover:text-[#171717] transition-colors no-underline"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex gap-1 mr-3">
            {(["zh","en","id"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                  language === l ? "bg-gray-100 text-[#171717]" : "text-gray-400 hover:text-[#171717]"
                }`}
              >
                {{zh:"中",en:"EN",id:"ID"}[l]}
              </button>
            ))}
          </div>
          <Link href="/login" className="text-xs font-medium text-gray-400 hover:text-[#171717] no-underline">登录</Link>
        </div>
      </div>
    </nav>
  );
}
