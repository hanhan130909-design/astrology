/**
 * /en 与 /id 多语言落地页（真路由，可索引）
 *
 * 背景：站点语言切换一直是客户端 localStorage 方案，无真实 URL，
 * 无法为 Google 提供可索引的多语言入口，hreflang 也无从谈起。
 * 本组件为英语（主 SEO 市场）与印尼语（本地市场）提供真实落地页，
 * 与首页互指 hreflang（x-default=/, en=/en, id=/id）。
 *
 * 注意：root layout 已渲染 <main>，本组件不得再包 <main>。
 */

"use client";

import { useEffect } from "react";

interface ToolCard {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}

const COPY = {
  en: {
    badge: "Free · No signup required",
    h1: "Find Your Soulmate Window & Money Pattern",
    sub: "Free birth chart and BaZi reading based on real astronomical calculations. Discover your soulmate timing, natural earning style, and hidden life patterns.",
    primaryCta: "Get My Free Birth Chart",
    secondaryCta: "Try BaZi Calculator",
    toolsTitle: "Free Astrology Tools",
    trust: ["Swiss Ephemeris precision", "No signup, no paywall", "AI-powered readings"],
    metaTitle: "LunaXStar - Free Birth Chart & BaZi Calculator",
    metaDescription:
      "Free birth chart and BaZi reading based on real astronomical calculations. Discover your soulmate timing, earning style, and life patterns. No signup required.",
  },
  id: {
    badge: "Gratis · Tanpa pendaftaran",
    h1: "Temukan Waktu Jodoh & Pola Rezeki Anda",
    sub: "Bagan lahir dan BaZi gratis berbasis perhitungan astronomi nyata. Temukan waktu jodoh, gaya penghasilan alami, dan pola hidup tersembunyi Anda.",
    primaryCta: "Buat Bagan Lahir Gratis",
    secondaryCta: "Coba Kalkulator BaZi",
    toolsTitle: "Alat Astrologi Gratis",
    trust: ["Akurasi Swiss Ephemeris", "Tanpa daftar, tanpa bayar", "Pembacaan berbantuan AI"],
    metaTitle: "LunaXStar - Bagan Lahir & Kalkulator BaZi Gratis",
    metaDescription:
      "Bagan lahir dan BaZi gratis berbasis perhitungan astronomi nyata. Temukan waktu jodoh, gaya penghasilan, dan pola hidup Anda. Tanpa pendaftaran.",
  },
} as const;

const TOOLS: Record<"en" | "id", ToolCard[]> = {
  en: [
    { href: "/natal", emoji: "🪐", title: "Natal Chart", desc: "Planets, houses & aspects — your complete birth chart" },
    { href: "/bazi", emoji: "🎯", title: "BaZi Calculator", desc: "Four Pillars: your Day Master, money style & luck cycles" },
    { href: "/compatibility", emoji: "💞", title: "Compatibility", desc: "Western synastry & BaZi match analysis" },
    { href: "/horoscope", emoji: "♈", title: "Daily Horoscope", desc: "All 12 signs, updated daily" },
    { href: "/tarot", emoji: "🔮", title: "Tarot Reading", desc: "78 classic cards with AI interpretation" },
    { href: "/transits", emoji: "📅", title: "Astrology Calendar", desc: "Moon phases, retrogrades & key transits" },
  ],
  id: [
    { href: "/natal", emoji: "🪐", title: "Bagan Lahir", desc: "Planet, rumah & aspek — bagan kelahiran lengkap Anda" },
    { href: "/bazi", emoji: "🎯", title: "Kalkulator BaZi", desc: "Empat Pilar: Day Master, gaya rezeki & siklus keberuntungan" },
    { href: "/compatibility", emoji: "💞", title: "Kecocokan", desc: "Analisis synastry Barat & kecocokan BaZi" },
    { href: "/horoscope", emoji: "♈", title: "Horoskop Harian", desc: "12 zodiak, diperbarui setiap hari" },
    { href: "/tarot", emoji: "🔮", title: "Bacaan Tarot", desc: "78 kartu klasik dengan interpretasi AI" },
    { href: "/transits", emoji: "📅", title: "Kalender Astrologi", desc: "Fase bulan, retrograde & transit penting" },
  ],
};

export const LANGS = { "x-default": "/", en: "/en", id: "/id" } as const;

export default function LanguageLanding({ lang }: { lang: "en" | "id" }) {
  const t = COPY[lang];
  const tools = TOOLS[lang];

  // root layout 硬编码 lang="en"，多语言落地页在此修正
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="px-4 pt-16 pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
            {t.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {t.h1}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{t.sub}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/natal"
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
            >
              {t.primaryCta}
            </a>
            <a
              href="/bazi"
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {t.secondaryCta}
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-xs text-gray-500 font-medium">
            {t.trust.map((item) => (
              <span key={item}>✓ {item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.toolsTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="group p-5 rounded-2xl border border-gray-200 hover:border-violet-300 hover:-translate-y-0.5 transition-all"
              >
                <span className="text-3xl" aria-hidden>
                  {tool.emoji}
                </span>
                <h3 className="font-bold text-gray-900 mt-3 mb-1">{tool.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
