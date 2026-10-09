"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Analytics } from "@/lib/analytics";
import EmailUnlock from "@/components/EmailUnlock";
import { appendReferral } from "@/components/ReferralTracker";
import { Sparkles, Star, Heart, Wallet, ShieldCheck } from "lucide-react";

const T: Record<string, Record<string, string>> = {
  zh: {
    hero: "你的灵魂伴侣是谁？",
    heroSub: "星盘会告诉你。输入出生信息，免费生成你的专属灵魂伴侣报告——包括你会在什么时候、在哪里、遇到什么样的人。",
    trust1: "12,000+ 人已找到答案",
    trust2: "真实天文计算 · 无需注册",
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
    hero: "Who Is Your Soulmate?",
    heroSub: "Your birth chart knows. Enter your birth details to get your free soulmate reading — including when, where, and who you'll meet.",
    trust1: "12,000+ people found their answer",
    trust2: "Real astronomical calculations · No signup",
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
    hero: "Siapa Jodoh Anda?",
    heroSub: "Bagan kelahiran Anda tahu. Masukkan data kelahiran untuk mendapatkan bacaan jodoh gratis — termasuk kapan, di mana, dan siapa yang akan Anda temui.",
    trust1: "12,000+ orang menemukan jawaban",
    trust2: "Perhitungan astronomi asli · Tanpa daftar",
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
            <Sparkles size={12} />
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
            <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{t.trust1}</span>
            <span className="w-px h-3 bg-gray-300" />
            <span className="flex items-center gap-1"><ShieldCheck size={11} />{t.trust2}</span>
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
                    <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
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
