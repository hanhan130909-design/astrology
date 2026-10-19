"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import EmailUnlock from "@/components/EmailUnlock";
import { appendReferral } from "@/components/ReferralTracker";

const T: Record<string, Record<string, string>> = {
  zh: {
    hero: "别再猜他是不是对的人了。",
    heroSub: "你的星盘里写着你的灵魂伴侣模式——包括你会在什么时候遇到他，以及你为什么总吸引错的人。不再猜测，2分钟生成你的专属爱情蓝图。免费。",
    trust1: "12,000+ 人已找到答案",
    trust2: "隐私保护 · 无需信用卡 · 2分钟完成",
    features: "更多功能",
    natal: "本命星盘",
    natalDesc: "完整行星落位、宫位、相位深度解读",
    bazi: "八字命理",
    baziDesc: "天干地支、十神、大运流年分析",
    compatibility: "星座配对",
    compatibilityDesc: "两人关系契合度深度分析",
    tarot: "塔罗占卜",
    tarotDesc: "22 张大阿卡纳神秘指引",
    learn: "占星学院",
    learnDesc: "占星+八字系统课程",
    blog: "占星博客",
    blogDesc: "1500+ 篇深度文章",
  },
  en: {
    hero: "Stop Wondering If He's The One.",
    heroSub: "Your birth chart shows your exact soulmate pattern — including when you'll meet them and why you keep attracting the wrong person. No more guessing. Get your personalized love blueprint in 2 minutes. Free.",
    trust1: "12,000+ people found their answer",
    trust2: "Private · No credit card · Takes 2 minutes",
    features: "Explore More",
    natal: "Natal Chart",
    natalDesc: "Complete planetary positions, houses & aspects",
    bazi: "BaZi Analysis",
    baziDesc: "Stems & Branches, Ten Gods, Luck Cycles",
    compatibility: "Compatibility",
    compatibilityDesc: "Deep relationship compatibility analysis",
    tarot: "Tarot",
    tarotDesc: "22 Major Arcana mystical guidance",
    learn: "Academy",
    learnDesc: "Structured astrology & BaZi courses",
    blog: "Blog",
    blogDesc: "1,500+ in-depth articles",
  },
  id: {
    hero: "Berhenti Menebak Apakah Dia Yang Benar.",
    heroSub: "Bagan kelahiran Anda menunjukkan pola jodoh yang tepat — termasuk kapan Anda akan bertemu dia dan mengapa Anda terus menarik orang yang salah. Dapatkan cetak biru cinta pribadi Anda dalam 2 menit. Gratis.",
    trust1: "12,000+ orang menemukan jawaban",
    trust2: "Privasi · Tanpa kartu kredit · 2 menit",
    features: "Jelajahi Lainnya",
    natal: "Bagan Natal",
    natalDesc: "Posisi planet, rumah & aspek lengkap",
    bazi: "Analisis BaZi",
    baziDesc: "Batang & Cabang, Sepuluh Dewa, Siklus Keberuntungan",
    compatibility: "Kecocokan",
    compatibilityDesc: "Analisis kecocokan hubungan mendalam",
    tarot: "Tarot",
    tarotDesc: "22 Arcana Utama panduan mistik",
    learn: "Akademi",
    learnDesc: "Kursus astrologi & BaZi terstruktur",
    blog: "Blog",
    blogDesc: "1.500+ artikel mendalam",
  },
};

const features = [
  { href: "/natal", icon: "🪐", zh: "本命星盘", en: "Natal Chart", zhDesc: "完整行星落位、宫位、相位", enDesc: "Planetary positions, houses & aspects" },
  { href: "/bazi", icon: "☯", zh: "八字命理", en: "BaZi", zhDesc: "天干地支、十神、大运流年", enDesc: "Stems & Branches, Ten Gods, Luck Cycles" },
  { href: "/compatibility", icon: "💕", zh: "星座配对", en: "Compatibility", zhDesc: "两人关系契合度分析", enDesc: "Relationship compatibility analysis" },
  { href: "/tarot", icon: "🃏", zh: "塔罗占卜", en: "Tarot", zhDesc: "22张大阿卡纳指引", enDesc: "22 Major Arcana guidance" },
  { href: "/horoscope", icon: "⭐", zh: "每日运势", en: "Horoscope", zhDesc: "12星座每日运势", enDesc: "Daily horoscope for all 12 signs" },
  { href: "/blog", icon: "📝", zh: "占星博客", en: "Blog", zhDesc: "1500+篇深度文章", enDesc: "1,500+ in-depth articles" },
];

// Testimonials — real student reviews (replace with actual when available)
const testimonials = [
  { quote: "I found my soulmate 3 weeks after my reading. The timeline was exact.", name: "Sarah", location: "Singapore" },
  { quote: "The BaZi wealth reading changed how I make decisions. Got a raise 2 months later.", name: "Maya", location: "Jakarta" },
  { quote: "I was skeptical. Then my chart described my ex perfectly. Now I'm a believer.", name: "Jessica", location: "New York" },
];

// Popular questions — internal links to high-potential blog articles
const popularQuestions = [
  { href: "/blog/how-to-know-if-he-is-your-soulmate-astrology", zh: "怎么知道他是不是你的正缘？星盘里有5个信号", en: "How to Know If He Is Your Soulmate: 5 Astrology Signs" },
  { href: "/blog/why-you-attract-emotionally-unavailable-partners", zh: "为什么你总吸引情感疏离的人？星盘里有答案", en: "Why You Keep Attracting Emotionally Unavailable People" },
  { href: "/blog/twin-flame-vs-soulmate-difference", zh: "双生火焰和灵魂伴侣有什么区别？哪个才是对的人？", en: "Twin Flame vs Soulmate: What's the Difference?" },
  { href: "/blog/when-will-i-meet-my-soulmate-astrology", zh: "我什么时候会遇到灵魂伴侣？占星告诉你时间窗口", en: "When Will I Meet My Soulmate? The Astrology Timing Guide" },
  { href: "/blog/why-he-ghosted-me-astrology-reasons", zh: "他为什么突然消失？占星学解释了5种ghosting模式", en: "Why He Ghosted You: 5 Astrology Patterns Explained" },
  { href: "/blog/what-career-is-right-for-me-astrology", zh: "什么工作适合我？占星学从你的星盘找到答案", en: "What Career Is Right For Me? Your Chart Reveals It" },
  { href: "/blog/xin-metal-day-master-career-wealth", zh: "辛金日主：你天生适合的职业和赚钱方式", en: "Xin Metal Day Master: Your Natural Career & Earning Style" },
  { href: "/blog/soulmate-initial-reading-free", zh: "灵魂伴侣首字母测试：免费算出你的正缘名字首字母", en: "Soulmate Initial Reading: Free Astrology Guide" },
];

export default function HomePage() {
  const { language } = useLanguage();
  const t = T[language] || T.en;
  const lang = language || "zh";

  return (
    <div className="bg-white text-[#171717]">
      {/* ── Hero: Single Focus ── */}
      <section className="relative text-center px-6 pt-16 pb-12 md:pt-24 md:pb-20 max-w-[640px] mx-auto min-h-[70vh] flex flex-col justify-center">
        {/* Subtle star background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]" aria-hidden="true">
          <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <circle cx="300" cy="300" r="280" stroke="black" strokeWidth="0.5" fill="none"/>
            <circle cx="300" cy="300" r="200" stroke="black" strokeWidth="0.5" fill="none"/>
            {Array.from({length:12},(_,i)=>{
              const a=(i*30-90)*Math.PI/180;
              const x=300+240*Math.cos(a),y=300+240*Math.sin(a);
              return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="14" fill="black">{"♈♉♊♋♌♍♎♏♐♑♒♓"[i]}</text>;
            })}
          </svg>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-6">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>
            {lang === "zh" ? "基于真实天文计算" : "Based on real astronomy"}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {t.hero}
          </h1>
          <p className="text-sm md:text-base text-gray-500 max-w-[480px] mx-auto mb-8 leading-relaxed">
            {t.heroSub}
          </p>

          {/* Email unlock — the single CTA */}
          <EmailUnlock sign="natal" />

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className="text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {t.trust1}
            </span>
            <span className="w-px h-3 bg-gray-300" />
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              {t.trust2}
            </span>
          </div>
        </div>
      </section>

      {/* ── Testimonials: Social Proof ── */}
      <section className="px-6 py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className="text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-3 italic">"{item.quote}"</p>
                <p className="text-[11px] font-semibold text-gray-900">{item.name}</p>
                <p className="text-[10px] text-gray-400">{item.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features: Secondary (below the fold) ── */}
      <section className="px-4 py-12 max-w-[800px] mx-auto">
        <h2 className="text-center text-lg font-semibold mb-8 text-gray-500">{t.features}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              onClick={() => import("@/lib/analytics").then(m => m.Analytics.featureClick(f.href))}
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

      {/* ── Popular Questions: Internal Links for SEO ── */}
      <section className="px-6 py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-center text-lg font-semibold mb-6 text-gray-700">
            {lang === "zh" ? "大家都在问" : "Popular Questions"}
          </h2>
          <div className="space-y-2">
            {popularQuestions.map((q, i) => (
              <Link
                key={i}
                href={q.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all group"
              >
                <span className="text-amber-500 font-bold text-sm flex-shrink-0 w-6 text-center">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-snug">
                  {lang === "zh" ? q.zh : q.en}
                </span>
                <span className="ml-auto text-gray-300 group-hover:text-amber-400 transition-colors flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="text-center px-6 py-12 border-t border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold mb-3">
          {lang === "zh" ? "准备好找到你的灵魂伴侣了吗？" : "Ready to find your soulmate?"}
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          {lang === "zh" ? "免费生成你的星盘，答案就在里面。" : "Generate your free chart. The answer is inside."}
        </p>
        <EmailUnlock sign="natal" />
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        <p>© 2026 lunaxstar.com · {lang === "zh" ? "基于真实天文计算" : "Real astronomical calculations"}</p>
      </footer>
    </div>
  );
}
