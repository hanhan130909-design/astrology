import { NextRequest, NextResponse } from "next/server";
import { destinyArticles } from "@/content/destiny-blog-articles";
import { moreSeoArticles } from "@/app/blog/more-seo-articles";
import { seoArticles } from "@/app/blog/seo-articles";

// Simple slug → title mapping for search
interface ArticleIndex {
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content_en?: string;
  content_zh?: string;
  category?: string;
}

function buildIndex(): ArticleIndex[] {
  const all = [...destinyArticles, ...seoArticles, ...moreSeoArticles];
  const seen = new Set<string>();
  return all
    .filter((a: any) => {
      if (!a?.slug || seen.has(a.slug)) return false;
      seen.add(a.slug);
      return true;
    })
    .map((a: any) => ({
      slug: a.slug,
      title: typeof a.title === "object" ? a.title : { en: a.title || "", zh: a.title || "" },
      excerpt: typeof a.excerpt === "object" ? a.excerpt : { en: a.excerpt || "", zh: a.excerpt || "" },
      content_en: typeof a.content === "string" ? a.content : a.content?.en || "",
      content_zh: typeof a.sections === "string" ? a.sections : "",
      category: a.category || "",
    }));
}

// Simple text search with scoring
function searchArticles(query: string, articles: ArticleIndex[], lang: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return articles
    .map((a) => {
      const title = (a.title[lang] || a.title.en || "").toLowerCase();
      const excerpt = (a.excerpt[lang] || a.excerpt.en || "").toLowerCase();
      const content = (lang === "zh" ? a.content_zh : a.content_en || "").toLowerCase();

      let score = 0;
      // Exact title match = highest
      if (title === q) score += 100;
      // Title contains query
      else if (title.includes(q)) score += 50;
      // Query word in title
      else {
        const words = q.split(/\s+/);
        for (const w of words) {
          if (title.includes(w)) score += 20;
          if (excerpt.includes(w)) score += 5;
          if (content.includes(w)) score += 2;
        }
      }

      // Content match
      if (content.includes(q)) score += 10;

      return { ...a, score };
    })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

// Build index once at module load (cached across requests)
let cachedIndex: ArticleIndex[] | null = null;
function getIndex(): ArticleIndex[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const lang = searchParams.get("lang") || "zh";

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const articles = getIndex();
  const results = searchArticles(q, articles, lang);

  return NextResponse.json({
    results: results.map((r) => ({
      slug: r.slug,
      title: r.title[lang] || r.title.en,
      excerpt: (r.excerpt[lang] || r.excerpt.en || "").slice(0, 150),
      category: r.category,
      score: r.score,
    })),
    total: results.length,
  });
}
