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
] as const;

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

  const indexableArticles = deduplicateArticlesBySlug(articles)
    .filter(isIndexableArticle);
  const articleEntries = indexableArticles.map(createArticleSitemapEntry);

  return [...coreEntries, ...articleEntries];
}
