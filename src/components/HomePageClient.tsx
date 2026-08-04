"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Analytics } from "@/lib/analytics";

const T: Record<string, Record<string, string>> = {
  zh: {
    hero: "探索你的命运星图",
    heroSub: "西方占星 + 八字命理 + 奇门遁甲 · 8 种语言 · 完全免费 · 无需注册",
    cta: "免费生成星盘",
    ctaBazi: "八字排盘",
    ctaQimen: "奇门遁甲",
    stats: "1000+ 篇占星文章 · 8 种语言 · AI 智能解读",
    features: "全部功能",
    natal: "本命星盘",
    natalDesc: "完整行星落位、宫位、相位深度解读",
    bazi: "八字命理",
    baziDesc: "天干地支、十神、大运流年分析",
    qimen: "奇门遁甲",
    qimenDesc: "天地人神四层排盘，入墓门迫检测",
    compatibility: "星座配对",
    compatibilityDesc: "两人关系契合度深度分析",
    tarot: "塔罗占卜",
    tarotDesc: "22 张大阿卡纳神秘指引",
    transits: "行运追踪",
    transitsDesc: "实时追踪行星换座与重要相位",
    learn: "占星学院",
    learnDesc: "占星初阶 + 八字入门 + 紫微斗数，系统课程",
    community: "占星社区",
    communityDesc: "与占星爱好者交流讨论，8 语言翻译",
    blog: "占星博客",
    blogDesc: "1000+ 篇八字、星座、塔罗深度文章",
    bottom: "准备好探索你的命运了吗？",
    bottomCta: "立即免费开始",
  },
  en: {
    hero: "Discover Your Cosmic Blueprint",
    heroSub: "Western Astrology + Chinese BaZi + Qi Men Dun Jia · 8 Languages · Free Forever · No Signup",
    cta: "Free Birth Chart",
    ctaBazi: "BaZi Reading",
    ctaQimen: "Qi Men Dun Jia",
    stats: "1000+ Articles · 8 Languages · AI-Powered Reading",
    features: "All Features",
    natal: "Natal Chart",
    natalDesc: "Complete planetary positions, houses & aspects",
    bazi: "BaZi Analysis",
    baziDesc: "Stems & Branches, Ten Gods, Luck Cycles",
    qimen: "Qi Men Dun Jia",
    qimenDesc: "Four-layer plate: spirit, star, gate, stem",
    compatibility: "Compatibility",
    compatibilityDesc: "Deep relationship compatibility analysis",
    tarot: "Tarot",
    tarotDesc: "22 Major Arcana mystical guidance",
    transits: "Transits",
    transitsDesc: "Real-time planetary transit tracking",
    learn: "Academy",
    learnDesc: "Astrology, BaZi & Zi Wei Dou Shu courses",
    community: "Community",
    communityDesc: "Connect with astrology lovers worldwide",
    blog: "Blog",
    blogDesc: "1000+ articles on astrology, BaZi & tarot",
    bottom: "Ready to discover your destiny?",
    bottomCta: "Get Started Free",
  },
};

const features = [
  { href: "/natal", icon: "🪐", zh: "本命星盘", en: "Natal Chart", zhDesc: "完整行星落位、宫位、相位深度解读", enDesc: "Complete planetary positions, houses & aspects" },
  { href: "/bazi", icon: "☯", zh: "八字命理", en: "BaZi", zhDesc: "天干地支、十神、大运流年", enDesc: "Stems & Branches, Ten Gods, Luck Cycles" },
  { href: "/qimen", icon: "◎", zh: "奇门遁甲", en: "Qi Men", zhDesc: "天地人神四层盘，入墓门迫检测", enDesc: "Four-layer plate with condition detection" },
  { href: "/compatibility", icon: "💕", zh: "星座配对", en: "Compatibility", zhDesc: "深入分析两人关系契合度", enDesc: "Deep relationship analysis" },
  { href: "/tarot", icon: "🃏", zh: "塔罗占卜", en: "Tarot", zhDesc: "22 张大阿卡纳神秘指引", enDesc: "22 Major Arcana readings" },
  { href: "/transits", icon: "🔭", zh: "行运追踪", en: "Transits", zhDesc: "实时追踪行星换座与相位", enDesc: "Real-time planetary tracking" },
  { href: "/learn", icon: "📚", zh: "占星学院", en: "Academy", zhDesc: "占星+八字+紫微系统课程", enDesc: "Structured astrology courses" },
  { href: "/blog", icon: "📝", zh: "占星博客", en: "Blog", zhDesc: "1000+ 篇深度文章", enDesc: "1000+ in-depth articles" },
  { href: "/community", icon: "💬", zh: "社区", en: "Community", zhDesc: "占星爱好者交流讨论", enDesc: "Connect with astrology lovers" },
];

export default function HomePage() {
  const { language } = useLanguage();
  const t = T[language] || T.zh;
  const lang = language || "zh";

  return (
    <div className="bg-white text-[#171717]">
      {/* ── Hero ── */}
      <section className="relative text-center px-6 pt-16 pb-10 md:pt-24 md:pb-16 max-w-[720px] mx-auto">
        {/* Subtle background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]" aria-hidden="true">
          <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="380" stroke="black" strokeWidth="0.5" fill="none"/>
            <circle cx="400" cy="400" r="300" stroke="black" strokeWidth="0.5" fill="none"/>
            <circle cx="400" cy="400" r="220" stroke="black" strokeWidth="0.5" fill="none"/>
            {Array.from({length:12},(_,i)=>{
              const a=(i*30-90)*Math.PI/180;
              const x=400+340*Math.cos(a),y=400+340*Math.sin(a);
              return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="16" fill="black">{"♈♉♊♋♌♍♎♏♐♑♒♓"[i]}</text>;
            })}
          </svg>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          {t.hero}
        </h1>
        <p className="text-sm md:text-base text-gray-500 max-w-[500px] mx-auto mb-8 leading-relaxed">
          {t.heroSub}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link href="/natal" onClick={() => Analytics.ctaClick("free_chart", "homepage")} className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
            {t.cta}
          </Link>
          <Link href="/bazi" onClick={() => Analytics.ctaClick("bazi", "homepage")} className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
            {t.ctaBazi}
          </Link>
          <Link href="/qimen" onClick={() => Analytics.ctaClick("qimen", "homepage")} className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
            {t.ctaQimen}
          </Link>
        </div>

        <p className="text-xs text-gray-400">{t.stats}</p>
      </section>

      {/* ── Features Grid ── */}
      <section className="px-4 pb-12 max-w-[960px] mx-auto">
        <h2 className="text-center text-lg font-semibold mb-8 text-gray-500">{t.features}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              onClick={() => Analytics.featureClick(f.href)}
              className="group p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold text-sm text-gray-900 mb-0.5">
                {lang === "zh" ? f.zh : f.en}
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                {lang === "zh" ? f.zhDesc : f.enDesc}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="text-center px-6 py-12 border-t border-gray-100">
        <h2 className="text-xl font-bold mb-3">{t.bottom}</h2>
        <Link href="/natal" className="inline-flex items-center px-8 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
          {t.bottomCta}
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        <p>© 2026 lunaxstar.com · {lang === "zh" ? "基于真实天文计算" : "Real astronomical calculations"}</p>
      </footer>
    </div>
  );
}
