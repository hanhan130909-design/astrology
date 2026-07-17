import type { MetadataRoute } from "next";
import { destinyArticles } from "@/content/destiny-blog-articles";
import { moreSeoArticles } from "@/app/blog/more-seo-articles";
import { seoArticles } from "@/app/blog/seo-articles";
import { type IndexableArticle, isIndexableArticle } from "@/lib/blogIndexPolicy";
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
  const currentDate = new Date();
  const articles: IndexableArticle[] = [
    ...destinyArticles,
    ...seoArticles,
    ...moreSeoArticles,
  ];

  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: siteUrl(route),
    lastModified: currentDate,
    changeFrequency: route === "/transits" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.9,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles
    .filter(isIndexableArticle)
    .map((article) => ({
      url: siteUrl(`/blog/${article.slug}`),
      lastModified: article.date || currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...coreEntries, ...articleEntries];
}
