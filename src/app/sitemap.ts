import type { MetadataRoute } from "next";
import { destinyArticles } from "@/content/destiny-blog-articles";
import { moreSeoArticles } from "@/app/blog/more-seo-articles";
import { seoArticles } from "@/app/blog/seo-articles";
import { type IndexableArticle, isIndexableArticle } from "@/lib/blogIndexPolicy";
import { createArticleSitemapEntry, deduplicateArticlesBySlug } from "@/lib/blogSitemap";
import { siteUrl } from "@/lib/seoMetadata";

const coreRoutes = [
  "/",
  "/natal",
  "/solar-return",
  "/bazi",
  "/transits",
  "/tarot",
  "/compatibility",
  "/blog",
  "/learn",
  "/community",
  "/qimen",
  "/shop",
  "/pricing",
] as const;

// Blog pagination pages (22 pages)
const blogPages = Array.from({ length: 22 }, (_, i) => `/blog?page=${i + 1}`);

// Learn lesson pages
const baziSlugs = Array.from({ length: 7 }, (_, i) => `/learn/bazi-${i + 1}`);
const ziweiSlugs = Array.from({ length: 5 }, (_, i) => `/learn/ziwei-${i + 1}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const articles: IndexableArticle[] = [
    ...destinyArticles,
    ...seoArticles,
    ...moreSeoArticles,
  ];

  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: siteUrl(route),
    changeFrequency: route === "/transits" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.9,
  }));

  // Extra pages with lower priority
  const extraEntries: MetadataRoute.Sitemap = [
    ...blogPages.map((route) => ({ url: siteUrl(route), changeFrequency: "daily" as const, priority: 0.6 })),
    ...baziSlugs.map((route) => ({ url: siteUrl(route), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...ziweiSlugs.map((route) => ({ url: siteUrl(route), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];

  const indexableArticles = deduplicateArticlesBySlug(articles)
    .filter(isIndexableArticle);
  const articleEntries = indexableArticles.map(createArticleSitemapEntry);

  return [...coreEntries, ...extraEntries, ...articleEntries];
}
