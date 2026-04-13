import { NextRequest, NextResponse } from "next/server";

// Blog posts data
const BLOG_POSTS = [
  {
    id: "1",
    slug: "understanding-natal-chart",
    title: { zh: "如何解读本命盘", en: "Understanding Your Natal Chart", id: "Memahami Chart Natal Anda" },
    excerpt: { zh: "本命盘是占星学的基础，它展示了出生时行星的位置...", en: "The natal chart is the foundation of astrology, showing planetary positions at birth...", id: "Chart natal adalah dasar astrologi, menunjukkan posisi planet saat lahir..." },
    content: { zh: "完整文章内容...", en: "Full article content...", id: "Konten artikel lengkap..." },
    category: "basics",
    author: "星缘团队",
    publishedAt: "2026-04-01",
    readTime: 8,
    image: "/blog/natal-chart.jpg",
    tags: ["本命盘", "占星基础", "星盘解读"],
  },
  {
    id: "2",
    slug: "mercury-retrograde-guide",
    title: { zh: "水星逆行完全指南", en: "Complete Guide to Mercury Retrograde", id: "Panduan Lengkap Merkurius Retrograde" },
    excerpt: { zh: "水星逆行每年发生3-4次，了解如何优雅应对...", en: "Mercury retrograde happens 3-4 times a year. Learn how to navigate it gracefully...", id: "Merkurius retrograde terjadi 3-4 kali setahun. Pelajari cara menghadapinya..." },
    content: { zh: "完整文章内容...", en: "Full article content...", id: "Konten artikel lengkap..." },
    category: "transits",
    author: "星缘团队",
    publishedAt: "2026-04-05",
    readTime: 6,
    image: "/blog/mercury.jpg",
    tags: ["水星逆行", "行星运行", "运势"],
  },
  {
    id: "3",
    slug: "love-compatibility",
    title: { zh: "星座爱情配对指南", en: "Zodiac Love Compatibility Guide", id: "Panduan Kecocokan Cinta Zodiak" },
    excerpt: { zh: "了解不同星座之间的爱情化学反应...", en: "Understand the romantic chemistry between different zodiac signs...", id: "Memahami kimia romantis antar zodiak..." },
    content: { zh: "完整文章内容...", en: "Full article content...", id: "Konten artikel lengkap..." },
    category: "relationships",
    author: "星缘团队",
    publishedAt: "2026-04-08",
    readTime: 10,
    image: "/blog/compatibility.jpg",
    tags: ["爱情", "配对", "星座"],
  },
  {
    id: "4",
    slug: "moon-phases",
    title: { zh: "月相与情绪周期", en: "Moon Phases and Emotional Cycles", id: "Fase Bulan dan Siklus Emosional" },
    excerpt: { zh: "月亮影响我们的情绪和直觉，了解月相变化...", en: "The Moon influences our emotions and intuition. Learn about lunar phases...", id: "Bulan mempengaruhi emosi dan intuisi kita. Pelajari tentang fase bulan..." },
    content: { zh: "完整文章内容...", en: "Full article content...", id: "Konten artikel lengkap..." },
    category: "moon",
    author: "星缘团队",
    publishedAt: "2026-04-10",
    readTime: 7,
    image: "/blog/moon.jpg",
    tags: ["月亮", "情绪", "月相"],
  },
];

const CATEGORIES = {
  zh: [
    { id: "all", name: "全部" },
    { id: "basics", name: "占星基础" },
    { id: "transits", name: "行星运行" },
    { id: "relationships", name: "爱情关系" },
    { id: "moon", name: "月亮周期" },
    { id: "career", name: "事业财运" },
  ],
  en: [
    { id: "all", name: "All" },
    { id: "basics", name: "Basics" },
    { id: "transits", name: "Transits" },
    { id: "relationships", name: "Relationships" },
    { id: "moon", name: "Moon" },
    { id: "career", name: "Career" },
  ],
  id: [
    { id: "all", name: "Semua" },
    { id: "basics", name: "Dasar" },
    { id: "transits", name: "Transit" },
    { id: "relationships", name: "Hubungan" },
    { id: "moon", name: "Bulan" },
    { id: "career", name: "Karir" },
  ],
};

// GET /api/blog - Get blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "zh";
    const category = searchParams.get("category") || "all";
    const slug = searchParams.get("slug");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    
    // Get single post by slug
    if (slug) {
      const post = BLOG_POSTS.find((p) => p.slug === slug);
      if (!post) {
        return NextResponse.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          ...post,
          title: post.title[lang as keyof typeof post.title] || post.title.zh,
          excerpt: post.excerpt[lang as keyof typeof post.excerpt] || post.excerpt.zh,
          content: post.content[lang as keyof typeof post.content] || post.content.zh,
        },
      });
    }
    
    // Filter posts
    let filtered = BLOG_POSTS;
    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }
    
    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    // Transform for language
    const posts = paginated.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title[lang as keyof typeof post.title] || post.title.zh,
      excerpt: post.excerpt[lang as keyof typeof post.excerpt] || post.excerpt.zh,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      image: post.image,
      tags: post.tags,
    }));
    
    return NextResponse.json({
      success: true,
      data: posts,
      categories: CATEGORIES[lang as keyof typeof CATEGORIES] || CATEGORIES.zh,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    });
  } catch (error) {
    console.error("Blog API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
