"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ArrowLeft, Clock, Tag, ChevronRight, Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  image: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    title: "占星博客",
    subtitle: "探索占星学的奥秘",
    allCategories: "全部文章",
    readMore: "阅读更多",
    readTime: "分钟阅读",
    by: "作者",
    latest: "最新文章",
    popular: "热门文章",
    noPosts: "暂无文章",
    loadMore: "加载更多",
  },
  en: {
    title: "Astrology Blog",
    subtitle: "Explore the mysteries of astrology",
    allCategories: "All Posts",
    readMore: "Read More",
    readTime: "min read",
    by: "By",
    latest: "Latest Posts",
    popular: "Popular Posts",
    noPosts: "No posts yet",
    loadMore: "Load More",
  },
  id: {
    title: "Blog Astrologi",
    subtitle: "Jelajahi misteri astrologi",
    allCategories: "Semua Artikel",
    readMore: "Baca Selengkapnya",
    readTime: "menit baca",
    by: "Oleh",
    latest: "Artikel Terbaru",
    popular: "Artikel Populer",
    noPosts: "Belum ada artikel",
    loadMore: "Muat Lebih",
  },
  th: {
    title: "บล็อกดูดวง",
    subtitle: "สำรวจความลับของดวงดาว",
    allCategories: "บทความทั้งหมด",
    readMore: "อ่านเพิ่ม",
    readTime: "นาที",
    by: "โดย",
    latest: "บทความล่าสุด",
    popular: "บทความยอดนิยม",
    noPosts: "ยังไม่มีบทความ",
    loadMore: "โหลดเพิ่ม",
  },
  vi: {
    title: "Blog Chiêm Tinh",
    subtitle: "Khám phá bí ẩn của chiêm tinh",
    allCategories: "Tất cả bài viết",
    readMore: "Đọc thêm",
    readTime: "phút đọc",
    by: "Bởi",
    latest: "Bài mới nhất",
    popular: "Bài phổ biến",
    noPosts: "Chưa có bài viết",
    loadMore: "Tải thêm",
  },
  ms: {
    title: "Blog Astrologi",
    subtitle: "Terokai misteri astrologi",
    allCategories: "Semua Artikel",
    readMore: "Baca Lagi",
    readTime: "minit baca",
    by: "Oleh",
    latest: "Artikel Terkini",
    popular: "Artikel Popular",
    noPosts: "Tiada artikel",
    loadMore: "Muat Lagi",
  },
  ja: {
    title: "占星ブログ",
    subtitle: "占星術の神秘を探る",
    allCategories: "すべての記事",
    readMore: "続きを読む",
    readTime: "分で読める",
    by: "著者",
    latest: "最新記事",
    popular: "人気記事",
    noPosts: "記事はありません",
    loadMore: "もっと読む",
  },
  ko: {
    title: "점성 블로그",
    subtitle: "점성술의 신비를 탐구하다",
    allCategories: "모든 글",
    readMore: "더 읽기",
    readTime: "분 읽기",
    by: "작성자",
    latest: "최신 글",
    popular: "인기 글",
    noPosts: "글 없음",
    loadMore: "더 보기",
  },
};

export default function BlogPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, selectedCategory]);

  const fetchPosts = async (loadMore = false) => {
    try {
      setLoading(true);
      const currentPage = loadMore ? page + 1 : 1;
      
      const response = await fetch(
        `/api/blog?lang=${language}&category=${selectedCategory}&page=${currentPage}&limit=6`
      );
      const data = await response.json();
      
      if (data.success) {
        if (loadMore) {
          setPosts((prev) => [...prev, ...data.data]);
          setPage(currentPage);
        } else {
          setPosts(data.data);
          setPage(1);
        }
        
        setCategories(data.categories);
        setHasMore(currentPage < data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "zh" ? "zh-CN" : language === "id" ? "id-ID" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#030014]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">
                {language === "zh" ? "返回" : language === "id" ? "Kembali" : "Back"}
              </span>
            </Link>
            <h1 className="text-xl font-bold gradient-text">{t.title}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {loading && posts.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">{t.noPosts}</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-1"
                  >
                    {/* Image Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center">
                      <span className="text-4xl">✨</span>
                    </div>
                    
                    <div className="p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="text-purple-400">
                          {categories.find((c) => c.id === post.category)?.name || post.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime} {t.readTime}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-sm text-gray-500">
                          {t.by} {post.author}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                        >
                          {t.readMore}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => fetchPosts(true)}
                    disabled={loading}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      t.loadMore
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
