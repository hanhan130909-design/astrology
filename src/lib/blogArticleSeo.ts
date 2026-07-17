import type { Metadata } from "next";
import { isIndexableArticle } from "@/lib/blogIndexPolicy";
import { siteUrl } from "@/lib/seoMetadata";

type LocalizedText = {
  en?: string;
  zh?: string;
};

type BlogMetadataArticle = {
  title?: string | LocalizedText;
  excerpt?: string | LocalizedText;
  description?: string | LocalizedText;
};

export type CornerstoneLink = {
  slug: string;
  label: string;
};

const BAZI_CORNERSTONES: readonly CornerstoneLink[] = [
  { slug: "what-is-chinese-astrology-bazi", label: "What Is Chinese Astrology (BaZi)?" },
  { slug: "bazi-calculator-what-is-day-master", label: "BaZi Day Master Guide" },
];

const COMPATIBILITY_CORNERSTONES: readonly CornerstoneLink[] = [
  { slug: "chinese-zodiac-compatibility-love", label: "Chinese Zodiac Love Compatibility" },
  { slug: "what-does-my-birth-chart-mean", label: "What Does My Birth Chart Mean?" },
];

const NATAL_CORNERSTONES: readonly CornerstoneLink[] = [
  { slug: "free-natal-chart-interpretation-guide", label: "Free Natal Chart Interpretation Guide" },
  { slug: "rising-sign-meaning-how-to-find", label: "Rising Sign Meaning and How to Find It" },
];

const SAFE_FALLBACK: CornerstoneLink = {
  slug: "what-does-my-birth-chart-mean",
  label: "What Does My Birth Chart Mean?",
};

const SAFE_ALTERNATE_FALLBACK: CornerstoneLink = {
  slug: "bazi-calculator-what-is-day-master",
  label: "BaZi Day Master Guide",
};

function localizedValue(value: string | LocalizedText | undefined, fallback = ""): string {
  if (typeof value === "string") return value;
  return value?.en || value?.zh || fallback;
}

export function createBlogArticleMetadata(article: unknown, slug: string): Metadata {
  const candidate = article as BlogMetadataArticle;
  const metaTitle = localizedValue(candidate?.title, "Article");
  const metaDescription = localizedValue(candidate?.excerpt)
    || localizedValue(candidate?.description);
  const canonical = siteUrl(`/blog/${slug}`);

  return {
    title: `${metaTitle} | 星缘 Blog`,
    description: metaDescription,
    robots: {
      index: isIndexableArticle(article),
      follow: true,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: canonical,
    },
    alternates: {
      canonical,
    },
  };
}

export function selectCornerstoneLink(
  currentSlug: string,
  candidates: readonly CornerstoneLink[],
): CornerstoneLink {
  const relatedLink = candidates.find((candidate) => candidate.slug !== currentSlug);
  if (relatedLink) return relatedLink;

  return currentSlug === SAFE_FALLBACK.slug ? SAFE_ALTERNATE_FALLBACK : SAFE_FALLBACK;
}

export function selectContextualCornerstone({
  slug,
  title,
  categoryLabel,
}: {
  slug: string;
  title?: unknown;
  categoryLabel?: unknown;
}): CornerstoneLink {
  const context = `${typeof title === "string" ? title : ""} ${
    typeof categoryLabel === "string" ? categoryLabel : ""
  }`;
  const candidates = /bazi|chinese|day master/i.test(context)
    ? BAZI_CORNERSTONES
    : /compatibility|relationship|love/i.test(context)
      ? COMPATIBILITY_CORNERSTONES
      : NATAL_CORNERSTONES;

  return selectCornerstoneLink(slug, candidates);
}
