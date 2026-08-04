"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BlogSummary } from "./blogSummary";

const CATEGORIES = [
  { key: "all", zh: "全部", en: "All" },
  { key: "astrology", zh: "星座", en: "Zodiac" },
  { key: "bazi", zh: "八字", en: "BaZi" },
  { key: "tarot", zh: "塔罗", en: "Tarot" },
  { key: "compatibility", zh: "配对", en: "Compatibility" },
  { key: "chinese-culture", zh: "中国传统文化", en: "Chinese Culture" },
  { key: "guide", zh: "指南", en: "Guides" },
  { key: "horoscope", zh: "运势", en: "Horoscope" },
] as const;

const T: Record<string, Record<string, string>> = {
  zh: { title: "博客分类", subtitle: "按主题浏览文章", back: "返回博客" },
  en: { title: "Blog Categories", subtitle: "Browse articles by topic", back: "Back to Blog" },
};

function guessCategory(slug: string, category?: string): string {
  if (category) return category;
  const s = slug.toLowerCase();
  if (s.includes("bazi") || s.includes("day-master") || s.includes("stem") || s.includes("element")) return "bazi";
  if (s.includes("tarot") || s.includes("arcana") || s.includes("fool") || s.includes("magician")) return "tarot";
  if (s.includes("compatibility") || s.includes("love") || s.includes("match")) return "compatibility";
  if (s.includes("horoscope") || s.includes("daily") || s.includes("yearly")) return "horoscope";
  if (s.includes("chinese") || s.includes("culture") || s.includes("i-ching") || s.includes("feng-shui")) return "chinese-culture";
  if (s.includes("guide") || s.includes("how-to") || s.includes("meaning") || s.includes("personality")) return "guide";
  return "astrology";
}

export default function BlogCategoryClient({ articles }: { articles: BlogSummary[] }) {
  const { language } = useLanguage();
  const t = T[language] || T.zh;
  const lang = language || "zh";

  const [selected, setSelected] = useState("all");

  const filtered = useMemo(() => {
    if (selected === "all") return articles;
    return articles.filter((a) => guessCategory(a.slug, a.category) === selected);
  }, [selected, articles]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: articles.length };
    articles.forEach((a) => {
      const cat = guessCategory(a.slug, a.category);
      c[cat] = (c[cat] || 0) + 1;
    });
    return c;
  }, [articles]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-6 inline-block">
          ← {t.back}
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{t.subtitle}</p>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelected(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selected === cat.key
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {lang === "zh" ? cat.zh : cat.en}
              <span className="ml-1.5 text-xs opacity-60">{counts[cat.key] || 0}</span>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 60).map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block p-5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <div className="text-xs text-gray-400 mb-1">
                {guessCategory(article.slug, article.category)}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                {(article.title as any)[lang] || article.title.en}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                {(article.excerpt as any)[lang] || article.excerpt.en}
              </p>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">暂无该分类文章</p>
        )}
      </div>
    </div>
  );
}
