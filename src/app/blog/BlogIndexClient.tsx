'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Clock, Tag, ChevronRight } from 'lucide-react';
import type { BlogSummary } from './blogSummary';

// Translation data
const t: Record<string, Record<string, string>> = {
  zh: {
    title: '星缘博客',
    subtitle: '免费占星知识与运势解读',
    featured: '精选文章',
    readMore: '阅读全文',
    minRead: '分钟阅读',
    by: '作者',
    back: '返回',
    tutorial: '教程',
    guide: '指南',
    analysis: '分析',
    horoscope: '运势',
    technology: '科技'},
  en: {
    title: 'Astro Blog',
    subtitle: 'Free Astrology Knowledge & Horoscope Insights',
    featured: 'Featured Articles',
    readMore: 'Read More',
    minRead: 'min read',
    by: 'By',
    back: 'Back',
    tutorial: 'Tutorial',
    guide: 'Guide',
    analysis: 'Analysis',
    horoscope: 'Horoscope',
    technology: 'Technology'},
  id: {
    title: 'Blog Astrologi',
    subtitle: 'Pengetahuan Astrologi & Ramalan Gratis',
    featured: 'Artikel Pilihan',
    readMore: 'Baca Selengkapnya',
    minRead: 'mnt baca',
    by: 'Oleh',
    back: 'Kembali',
    tutorial: 'Tutorial',
    guide: 'Panduan',
    analysis: 'Analisis',
    horoscope: 'Ramalan',
    technology: 'Teknologi'}};

// Category color mapping
const categoryColors: Record<string, string> = {
  tutorial: 'bg-gray-500/20 text-gray-400',
  guide: 'bg-gray-500/20 text-gray-400',
  analysis: 'bg-gray-500/20 text-gray-400',
  horoscope: 'bg-gray-500/20 text-gray-600',
  technology: 'bg-gray-500/20 text-gray-400'};

export default function BlogIndexClient({ articles }: { articles: BlogSummary[] }) {
  const { language } = useLanguage();
  const currentT = t[language] || t.en;

  // Pagination
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const pagedArticles = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'zh' ? 'zh-CN' : language === 'id' ? 'id-ID' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const getCategoryName = (article: BlogSummary) => {
    if (language === 'zh') return article.categoryZh;
    if (language === 'en') return article.categoryEn;
    if (language === 'id') return article.categoryId;
    return article.categoryEn;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}


      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 via-transparent to-gray-900/20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentT.title}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-4 mb-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="w-1 h-6 bg-gradient-to-b from-gray-500 to-gray-500 rounded-full inline-block" />
            {currentT.featured}
          </h3>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient Image Area */}
                <div className="aspect-video bg-gradient-to-br from-gray-50/30 via-gray-900/20 to-gray-50/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-60" />
                  <span className="text-5xl relative z-10">✨</span>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {getCategoryName(article)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime} {currentT.minRead}
                    </span>
                    <span>•</span>
                    <span>{formatDate(article.date)}</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-400 transition-colors line-clamp-2">
                    {article.title[language] || article.title.en}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt[language] || article.excerpt.en}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {currentT.by} {language === 'zh' ? article.author : language === 'id' ? article.authorId : article.authorEn}
                    </div>
                    {article.id.startsWith('destiny-') ? (
                      <Link
                        href={`/blog/${article.slug}`}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium transition-colors"
                      >
                        {currentT.readMore}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Snippet</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
              ← Prev
            </button>
            {Array.from({length: totalPages}, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2).map((p, i, arr) => (
              <span key={p}>
                {i > 0 && arr[i-1] !== p - 1 && <span className="px-1 text-gray-300">...</span>}
                <button onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-gray-900 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                  {p}
                </button>
              </span>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
              Next →
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-3">{articles.length} articles · Page {page} of {totalPages}</p>
        </div>
      </section>
    </div>
  );
}
