"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const T: Record<string, Record<string, string>> = {
  zh: { brand:"星缘", horoscope:"运势", natal:"星盘", bazi:"八字", qimen:"奇门", compatibility:"配对", ai:"AI解读", learn:"学习", transits:"星象日历", community:"社区", tarot:"塔罗", strategy:"方法论" },
  en: { brand:"Starry Fate", horoscope:"Horoscope", natal:"Chart", bazi:"BaZi", qimen:"QiMen", compatibility:"Match", ai:"AI", learn:"Learn", transits:"Transits", community:"Community", tarot:"Tarot", strategy:"Strategy" },
  id: { brand:"Starry Fate", horoscope:"Horoskop", natal:"Bagan", bazi:"BaZi", qimen:"QiMen", compatibility:"Cocok", ai:"AI", learn:"Belajar", transits:"Transit", community:"Komunitas", tarot:"Tarot", strategy:"Strategi" },
  th: { brand:"สตาร์รี่เฟท", horoscope:"ดูดวง", natal:"ดวง", bazi:"ปาจื่อ", compatibility:"คู่", ai:"AI", learn:"เรียน", transits:"ดาว", community:"ชุมชน", tarot:"ไพ่", strategy:"กลยุทธ์" },
  vi: { brand:"Starry Fate", horoscope:"Tử vi", natal:"Bản đồ", bazi:"Bát Tự", compatibility:"Hợp", ai:"AI", learn:"Học", transits:"Quá cảnh", community:"Cộng đồng", tarot:"Tarot", strategy:"Chiến lược" },
  ms: { brand:"Starry Fate", horoscope:"Horoskop", natal:"Carta", bazi:"BaZi", compatibility:"Serasi", ai:"AI", learn:"Belajar", transits:"Transit", community:"Komuniti", tarot:"Tarot", strategy:"Strategi" },
  ja: { brand:"星縁", horoscope:"運勢", natal:"星図", bazi:"八字", compatibility:"相性", ai:"AI", learn:"学習", transits:"トランジット", community:"掲示板", tarot:"タロット", strategy:"戦略" },
  ko: { brand:"스타리 페이트", horoscope:"운세", natal:"차트", bazi:"팔자", compatibility:"궁합", ai:"AI", learn:"배우기", transits:"행성", community:"커뮤니티", tarot:"타로", strategy:"전략" },
};

const LANGUAGES = [
  { code:"zh", flag:"🇨🇳", label:"中文", short:"中" },
  { code:"en", flag:"🇺🇸", label:"EN", short:"EN" },
  { code:"id", flag:"🇮🇩", label:"ID", short:"ID" },
  { code:"th", flag:"🇹🇭", label:"ไทย", short:"TH" },
  { code:"vi", flag:"🇻🇳", label:"VN", short:"VN" },
  { code:"ms", flag:"🇲🇾", label:"MS", short:"MS" },
  { code:"ja", flag:"🇯🇵", label:"日本語", short:"JA" },
  { code:"ko", flag:"🇰🇷", label:"한국", short:"KO" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const t = T[language] || T.zh;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    if (dark) document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  if (pathname === "/bazi") return null;

  const links = [
    { name: t.horoscope, href: "/horoscope" },
    { name: t.natal, href: "/natal" },
    { name: t.bazi, href: "/bazi" },
    { name: t.qimen || "奇门", href: "/qimen" },
    { name: t.strategy, href: "/methodology" },
    { name: t.compatibility, href: "/compatibility" },
    { name: t.ai, href: "/ai-reading" },
    { name: t.tarot, href: "/tarot" },
    { name: t.transits, href: "/transits" },
    { name: t.learn, href: "/learn" },
    { name: t.community, href: "/community" },
  ];

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <nav className="sticky top-0 z-50 bg-white/92 backdrop-blur-sm" style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08)"}}>
      <div className="max-w-[1200px] mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Left: Logo + Desktop links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-[#171717] no-underline shrink-0">
            <svg width="20" height="20" viewBox="0 0 40 40" className="shrink-0">
              <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M20 1a19 19 0 0 1 0 38A19 19 0 0 1 1 20" fill="currentColor"/>
              <circle cx="20" cy="10.5" r="4" fill="#fff"/>
              <circle cx="20" cy="29.5" r="4" fill="currentColor"/>
            </svg>
            {t.brand}
          </Link>
          <div className="hidden lg:flex items-center gap-5">
            {links.map((item) => (
              <Link key={item.href} href={item.href}
                className="text-[13px] font-medium text-gray-500 hover:text-[#171717] transition-colors no-underline">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Language + PRO + Login + Hamburger */}
        <div className="flex items-center gap-2">
          {/* Desktop: full language bar */}
          <div className="hidden md:flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => setLanguage(l.code)} title={l.label}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  language === l.code ? "bg-white text-[#171717] shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}>
                <span>{l.flag}</span><span className="hidden lg:inline ml-1">{l.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile: dropdown language picker */}
          <div className="md:hidden relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="px-2 py-1.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
              {currentLang.flag} {currentLang.short} ▾
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 grid grid-cols-4 gap-1 z-50 min-w-[200px]">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                    className={`px-2 py-1.5 rounded text-xs font-medium text-center ${
                      language === l.code ? "bg-gray-100 text-[#171717]" : "text-gray-500 hover:bg-gray-50"
                    }`}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/shop" className="text-xs font-medium text-gray-400 hover:text-[#171717] no-underline shrink-0 hidden sm:inline">🎨 Shop</Link>
          <Link href="/pricing" className="text-xs font-medium text-gray-400 hover:text-[#171717] no-underline shrink-0 hidden sm:inline">PRO</Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-[#171717] shrink-0"
            aria-label="Toggle theme"
          >
            {isDark ? "☀" : "☾"}
          </button>

          {user ? (
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/profile" className="text-xs font-medium text-gray-600 hover:text-[#171717] no-underline">{user.displayName || user.email}</Link>
              <button onClick={logout} className="text-xs text-gray-400 hover:text-[#171717]">退出</button>
            </div>
          ) : (
            <Link href="/login" className="text-xs font-medium text-gray-400 hover:text-[#171717] no-underline shrink-0">登录</Link>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 ml-1" aria-label={menuOpen ? "关闭菜单" : "打开菜单"}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
              {menuOpen
                ? <path d="M4 4l10 10M14 4L4 14" />
                : <path d="M3 5h12M3 9h12M3 13h12" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3">
          <div className="grid grid-cols-2 gap-1">
            {links.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#171717] no-underline transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link href="/shop" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 no-underline sm:hidden">🎨 Shop</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 no-underline sm:hidden">PRO</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
