import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seoMetadata";

type SitemapArticle = {
  slug: string;
  date?: unknown;
};

export function getStableArticleDate(date: unknown): string | undefined {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return undefined;
  }

  return date;
}

export function deduplicateArticlesBySlug<T extends { slug: string }>(articles: readonly T[]): T[] {
  const seenSlugs = new Set<string>();

  return articles.filter((article) => {
    if (seenSlugs.has(article.slug)) return false;
    seenSlugs.add(article.slug);
    return true;
  });
}

export function createArticleSitemapEntry(
  article: SitemapArticle,
): MetadataRoute.Sitemap[number] {
  const lastModified = getStableArticleDate(article.date);

  return {
    url: siteUrl(`/blog/${article.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
    ...(lastModified ? { lastModified } : {}),
  };
}
