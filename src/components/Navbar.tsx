"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const T: Record<string, Record<string, string>> = {
  zh: { home:"首页", horoscope:"运势", natal:"星盘", compatibility:"配对", ai:"AI解读", learn:"学习", transits:"天象", community:"社区", tarot:"塔罗" },
  en: { home:"Home", horoscope:"Horoscope", natal:"Chart", compatibility:"Match", ai:"AI", learn:"Learn", transits:"Transits", community:"Community", tarot:"Tarot" },
  id: { home:"Beranda", horoscope:"Horoskop", natal:"Bagan", compatibility:"Cocok", ai:"AI", learn:"Belajar", transits:"Transit", community:"Komunitas", tarot:"Tarot" },
  th: { home:"หน้าแรก", horoscope:"ดูดวง", natal:"ดวง", compatibility:"คู่", ai:"AI", learn:"เรียน", transits:"ดาว", community:"ชุมชน", tarot:"ไพ่" },
  vi: { home:"Trang chủ", horoscope:"Tử vi", natal:"Bản đồ", compatibility:"Hợp", ai:"AI", learn:"Học", transits:"Quá cảnh", community:"Cộng đồng", tarot:"Tarot" },
  ms: { home:"Utama", horoscope:"Horoskop", natal:"Carta", compatibility:"Serasi", ai:"AI", learn:"Belajar", transits:"Transit", community:"Komuniti", tarot:"Tarot" },
  ja: { home:"ホーム", horoscope:"運勢", natal:"星図", compatibility:"相性", ai:"AI", learn:"学習", transits:"トランジット", community:"掲示板", tarot:"タロット" },
  ko: { home:"홈", horoscope:"운세", natal:"차트", compatibility:"궁합", ai:"AI", learn:"배우기", transits:"행성", community:"커뮤니티", tarot:"타로" },
};

const LANGUAGES = [
  { code:"zh", flag:"🇨🇳", label:"中文" },
  { code:"en", flag:"🇺🇸", label:"EN" },
  { code:"id", flag:"🇮🇩", label:"ID" },
  { code:"th", flag:"🇹🇭", label:"ไทย" },
  { code:"vi", flag:"🇻🇳", label:"VN" },
  { code:"ms", flag:"🇲🇾", label:"MS" },
  { code:"ja", flag:"🇯🇵", label:"日本語" },
  { code:"ko", flag:"🇰🇷", label:"한국" },
];

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
          {/* 8-language switcher — visible, labeled */}
          <div className="flex gap-0.5 mr-3 bg-gray-100 rounded-lg p-0.5">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                title={l.label}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  language === l.code
                    ? "bg-white text-[#171717] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span>{l.flag}</span>
                <span className="hidden lg:inline">{l.label}</span>
              </button>
            ))}
          </div>
          <Link href="/login" className="text-xs font-medium text-gray-400 hover:text-[#171717] no-underline shrink-0">登录</Link>
        </div>
      </div>
    </nav>
  );
}
