import type { MetadataRoute } from "next";
import { destinyArticles } from "@/content/destiny-blog-articles";
import { moreSeoArticles } from "@/app/blog/more-seo-articles";
import { seoArticles } from "@/app/blog/seo-articles";
import { longtailSeoArticles } from "@/app/blog/longtail-seo-articles";
import { longtailSeoArticlesBatch2 } from "@/app/blog/longtail-seo-articles-batch2";
import { longtailSeoArticlesBatch3 } from "@/app/blog/longtail-seo-articles-batch3";
import { longtailSeoArticlesBatch4 } from "@/app/blog/longtail-seo-articles-batch4";
import { longtailSeoArticlesBatch5 } from "@/app/blog/longtail-seo-articles-batch5";
import { longtailSeoArticlesBatch6 } from "@/app/blog/longtail-seo-articles-batch6";
import { longtailSeoArticlesBatch7 } from "@/app/blog/longtail-seo-articles-batch7";
import { type IndexableArticle, isIndexableArticle } from "@/lib/blogIndexPolicy";
import { createArticleSitemapEntry, deduplicateArticlesBySlug } from "@/lib/blogSitemap";
import { allPairSlugs } from "@/lib/compatibilityEngine";
import { allChinesePairSlugs } from "@/lib/chineseZodiacEngine";
import { siteUrl } from "@/lib/seoMetadata";

export const coreRoutes = [
  "/",
  "/en",
  "/id",
  "/natal",
  "/solar-return",
  "/bazi",
  "/life-comic",
  "/transits",
  "/tarot",
  "/compatibility",
  "/compatibility/bazi",
  "/horoscope",
  "/chart",
  "/qimen",
  "/blog",
  "/learn",
  "/community",
  "/shop",
  "/pricing",
  "/referral",
  "/about",
  "/yearly-horoscope",
] as const;

// Blog pagination pages — 2026-11 内容收敛后只保留前 3 页
// （索引池已从 1538 篇收敛到 ~100 篇，深分页只是薄页集合，浪费抓取预算）
const blogPages = Array.from({ length: 3 }, (_, i) => `/blog?page=${i + 1}`);

// Learn lesson pages
const baziSlugs = Array.from({ length: 7 }, (_, i) => `/learn/bazi-${i + 1}`);
const ziweiSlugs = Array.from({ length: 5 }, (_, i) => `/learn/ziwei-${i + 1}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const articles: IndexableArticle[] = [
    ...destinyArticles,
    ...seoArticles,
    ...moreSeoArticles,
    ...longtailSeoArticles,
    ...longtailSeoArticlesBatch2,
    ...longtailSeoArticlesBatch3,
    ...longtailSeoArticlesBatch4,
    ...longtailSeoArticlesBatch5,
    ...longtailSeoArticlesBatch6,
    ...longtailSeoArticlesBatch7,
  ];

  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: siteUrl(route),
    changeFrequency: route === "/transits" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.9,
  }));

  // Extra pages with lower priority
  // 注意：siteUrl() 会剥掉 query，分页页必须手工拼 URL，否则 22 页全部坍缩成 /blog
  const extraEntries: MetadataRoute.Sitemap = [
    ...blogPages.map((route) => ({ url: `https://lunaxstar.com${route}`, changeFrequency: "daily" as const, priority: 0.6 })),
    ...baziSlugs.map((route) => ({ url: siteUrl(route), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...ziweiSlugs.map((route) => ({ url: siteUrl(route), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];

  // 配对页：78 个规范页（66 组无序组合 + 12 组同座自配对）
  const compatibilityEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl("/compatibility/pairs"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...allPairSlugs().map((slug) => ({
      url: siteUrl(`/compatibility/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  // 生肖配对页：78 个规范页（66 组跨生肖 + 12 组自配对）
  const chineseCompatibilityEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl("/compatibility/chinese"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...allChinesePairSlugs().map((slug) => ({
      url: siteUrl(`/compatibility/chinese/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  const indexableArticles = deduplicateArticlesBySlug(articles)
    .filter(isIndexableArticle);
  const articleEntries = indexableArticles.map(createArticleSitemapEntry);

  return [
    ...coreEntries,
    ...extraEntries,
    ...compatibilityEntries,
    ...chineseCompatibilityEntries,
    ...articleEntries,
  ];
}
