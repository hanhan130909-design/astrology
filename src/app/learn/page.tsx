"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Star, ChevronDown, Circle, Sparkles, Clock, TrendingUp, Award } from "lucide-react";
import { beginnerLessons } from "./course-data";
import { baziLessons, ziweiLessons } from "./course-bazi-ziwei";
import { baziGlossary, ziweiGlossary } from "./glossary-data";

const PLANET_DATA = {
  zh: {
    Sun: { name:"太阳", symbol:"☉", traits:["领导力","创造力","自信"], color:"text-amber-600", bg:"bg-amber-50" },
    Moon: { name:"月亮", symbol:"☽", traits:["情感","直觉","母性"], color:"text-blue-600", bg:"bg-blue-50" },
    Mercury: { name:"水星", symbol:"☿", traits:["沟通","智慧","机智"], color:"text-orange-500", bg:"bg-orange-50" },
    Venus: { name:"金星", symbol:"♀", traits:["爱","美","和谐"], color:"text-pink-600", bg:"bg-pink-50" },
    Mars: { name:"火星", symbol:"♂", traits:["行动","勇气","热情"], color:"text-red-600", bg:"bg-red-50" },
    Jupiter: { name:"木星", symbol:"♃", traits:["幸运","智慧","乐观"], color:"text-purple-600", bg:"bg-purple-50" },
    Saturn: { name:"土星", symbol:"♄", traits:["纪律","责任","耐心"], color:"text-gray-600", bg:"bg-gray-100" },
  },
  en: {
    Sun: { name:"Sun", symbol:"☉", traits:["Leadership","Creativity","Confidence"], color:"text-amber-600", bg:"bg-amber-50" },
    Moon: { name:"Moon", symbol:"☽", traits:["Emotion","Intuition","Nurturing"], color:"text-blue-600", bg:"bg-blue-50" },
    Mercury: { name:"Mercury", symbol:"☿", traits:["Communication","Wisdom","Wit"], color:"text-orange-500", bg:"bg-orange-50" },
    Venus: { name:"Venus", symbol:"♀", traits:["Love","Beauty","Harmony"], color:"text-pink-600", bg:"bg-pink-50" },
    Mars: { name:"Mars", symbol:"♂", traits:["Action","Courage","Passion"], color:"text-red-600", bg:"bg-red-50" },
    Jupiter: { name:"Jupiter", symbol:"♃", traits:["Luck","Wisdom","Optimism"], color:"text-purple-600", bg:"bg-purple-50" },
    Saturn: { name:"Saturn", symbol:"♄", traits:["Discipline","Responsibility","Patience"], color:"text-gray-600", bg:"bg-gray-100" },
  },
};

const T = {
  zh: {
    hero:"占星学院", heroSub:"从零基础到独立解盘 — 系统学习占星、八字、紫微斗数",
    knowledge:"知识速查", knowledgeSub:"行星、宫位、相位快速参考",
    courses:"系统课程", coursesSub:"按顺序学习，从入门到精通",
    glossary:"术语表", glossaryDesc:"中英对照，避免翻译歧义",
    planet:"行星速查", planetSub:"点击查看7大行星核心信息",
    startLearning:"开始学习",
    lessons:"课",
    free:"免费",
    popular:"热门推荐",
    viewAll:"查看全部",
    continueLearning:"继续学习",
    recentLessons:"最近学习",
    allCourses:"全部课程",
    courseAstro:"占星初阶",
    courseAstroDesc:"14节课 · 从零基础到独立解盘",
    courseBazi:"八字入门",
    courseBaziDesc:"7节课 · 天干地支到流年大运",
    courseZiwei:"紫微斗数",
    courseZiweiDesc:"5节课 · 十二宫到四化飞星",
    difficulty:"难度",
    beginner:"入门",
    intermediate:"进阶",
  },
  en: {
    hero:"Astrology Academy", heroSub:"From zero to independent chart reading — learn Astrology, BaZi & Zi Wei Dou Shu",
    knowledge:"Quick Reference", knowledgeSub:"Planets, houses & aspects at a glance",
    courses:"Structured Courses", coursesSub:"Learn step by step, from beginner to mastery",
    glossary:"Glossary", glossaryDesc:"Chinese terms with Pinyin & English",
    planet:"Planets", planetSub:"Tap to explore the 7 classical planets",
    startLearning:"Start Learning",
    lessons:"lessons",
    free:"Free",
    popular:"Popular",
    viewAll:"View All",
    continueLearning:"Continue Learning",
    recentLessons:"Recently Viewed",
    allCourses:"All Courses",
    courseAstro:"Beginner Astrology",
    courseAstroDesc:"14 lessons · From zero to chart reading",
    courseBazi:"BaZi Fundamentals",
    courseBaziDesc:"7 lessons · Stems & Branches to Luck Cycles",
    courseZiwei:"Zi Wei Dou Shu",
    courseZiweiDesc:"5 lessons · 12 Palaces to Transformations",
    difficulty:"Level",
    beginner:"Beginner",
    intermediate:"Intermediate",
  },
};

const PLANETS = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"];

// Course cards data for the course overview section
const courses = [
  { id:"astro", href:"/learn/astro-1", icon:"🪐", color:"bg-gray-900", lessons:14, key:"courseAstro", descKey:"courseAstroDesc" },
  { id:"bazi", href:"/learn/bazi-1", icon:"☯", color:"bg-purple-600", lessons:7, key:"courseBazi", descKey:"courseBaziDesc" },
  { id:"ziwei", href:"/learn/ziwei-1", icon:"◎", color:"bg-emerald-600", lessons:5, key:"courseZiwei", descKey:"courseZiweiDesc" },
];

export default function LearnPage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const t = T[lang] || T.zh;
  const pdata = PLANET_DATA[lang as keyof typeof PLANET_DATA] || PLANET_DATA.en;
  const [selectedPlanet, setSelectedPlanet] = useState("Sun");
  const [showBaziGlossary, setShowBaziGlossary] = useState(false);
  const [showZiweiGlossary, setShowZiweiGlossary] = useState(false);
  const [recentLessons, setRecentLessons] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("learn_recent") || "[]");
      setRecentLessons(saved.slice(0, 4));
    } catch {}
  }, []);

  const planet = pdata[selectedPlanet as keyof typeof pdata] || pdata.Sun;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-[#171717] dark:text-gray-100">
      {/* ── Hero ── */}
      <section className="text-center px-6 pt-12 pb-8 max-w-[640px] mx-auto">
        <div className="text-4xl mb-3">📚</div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">{t.hero}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[480px] mx-auto leading-relaxed">{t.heroSub}</p>
      </section>

      {/* ── Course Overview Cards ── */}
      <section className="px-4 pb-8 max-w-[960px] mx-auto">
        <h2 className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">{t.allCourses}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Link key={c.id} href={c.href}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all">
              <div className={`${c.color} h-2`} />
              <div className="p-5">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t[c.key as keyof typeof t]}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t[c.descKey as keyof typeof t]}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">{t.free}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">{c.lessons} {t.lessons}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">{t.beginner}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recently viewed ── */}
      {recentLessons.length > 0 && (
        <section className="px-4 pb-8 max-w-[960px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-gray-400" />
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t.recentLessons}</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentLessons.map((slug) => (
              <Link key={slug} href={`/learn/${slug}`}
                className="shrink-0 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {slug.replace("-", " #")}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Planet Quick Reference ── */}
      <section className="px-4 pb-10 max-w-[960px] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-gray-400" />
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t.planet}</h3>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{t.planetSub}</p>

        {/* Planet selector pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {PLANETS.map((p) => (
            <button key={p} onClick={() => setSelectedPlanet(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedPlanet === p
                  ? `${planet.color} ${planet.bg} ring-1 ring-current/20`
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100"
              }`}>
              {pdata[p as keyof typeof pdata]?.symbol} {pdata[p as keyof typeof pdata]?.name}
            </button>
          ))}
        </div>

        {/* Selected planet card */}
        <div className={`rounded-2xl p-6 ${planet.bg} border border-current/10`}>
          <div className="flex items-start gap-4">
            <div className={`text-5xl ${planet.color}`}>{planet.symbol}</div>
            <div>
              <h3 className={`text-xl font-bold ${planet.color} mb-2`}>{planet.name}</h3>
              <div className="flex gap-2 flex-wrap">
                {planet.traits.map((tr, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${planet.color} bg-white/60`}>
                    {tr}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Glossaries ── */}
      <section className="px-4 pb-10 max-w-[960px] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={14} className="text-gray-400" />
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t.glossary}</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* BaZi Glossary */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
            <button onClick={() => setShowBaziGlossary(!showBaziGlossary)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <span className="font-semibold text-sm">BaZi</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showBaziGlossary ? "rotate-180" : ""}`} />
            </button>
            {showBaziGlossary && (
              <div className="px-4 pb-4 space-y-2">
                {baziGlossary.map((term, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-semibold">{term.zh}</span>
                    <span className="text-gray-400 mx-1">·</span>
                    <span className="text-gray-500">{term.pinyin}</span>
                    <span className="text-gray-400 mx-1">·</span>
                    <span className="text-gray-600 dark:text-gray-400">{term.en}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Zi Wei Glossary */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
            <button onClick={() => setShowZiweiGlossary(!showZiweiGlossary)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <span className="font-semibold text-sm">Zi Wei Dou Shu</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showZiweiGlossary ? "rotate-180" : ""}`} />
            </button>
            {showZiweiGlossary && (
              <div className="px-4 pb-4 space-y-2">
                {ziweiGlossary.map((term, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-semibold">{term.zh}</span>
                    <span className="text-gray-400 mx-1">·</span>
                    <span className="text-gray-500">{term.pinyin}</span>
                    <span className="text-gray-400 mx-1">·</span>
                    <span className="text-gray-600 dark:text-gray-400">{term.en}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="text-center pb-12">
        <Link href="/learn/astro-1" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
          <Award size={16} />
          {t.startLearning}
        </Link>
      </div>
    </div>
  );
}
