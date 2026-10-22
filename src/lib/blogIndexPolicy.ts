export type IndexableArticle = {
  slug: string;
  sections?: string;
  content?: string | { en?: string };
  date?: string;
};

export const CORNERSTONE_SLUGS = [
  "what-does-my-birth-chart-mean",
  "bazi-calculator-what-is-day-master",
  "free-natal-chart-interpretation-guide",
  "what-is-chinese-astrology-bazi",
  "rising-sign-meaning-how-to-find",
  "chinese-zodiac-compatibility-love",
  "best-free-bazi-calculators-2026",
  "xuanseal-alternative-free",
  "free-astrology-sites-no-signup",
  "how-to-find-your-day-master-in-bazi",
] as const;

const cornerstoneSlugs = new Set<string>(CORNERSTONE_SLUGS);
const routeSafeSlugPattern = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
// Removed: /[木火土金水]\s+(?:element|sign)/i — was false-flagging normal astrology content like "火 element"
const rejectedBodyPatterns = [
  /every ending b\b/i,
];

function getEnglishBody(article: IndexableArticle): string | null {
  if (typeof article.sections === "string") return article.sections;
  if (typeof article.content === "string") return article.content;
  if (article.content && typeof article.content.en === "string") return article.content.en;
  // Fallback: check Chinese content too
  if (article.content && typeof article.content.zh === "string") return article.content.zh;
  if (article.content && typeof article.content === "object") {
    const vals = Object.values(article.content as Record<string, unknown>);
    for (const v of vals) if (typeof v === "string" && v.length > 100) return v;
  }
  return null;
}

export function isIndexableArticle(article: unknown): article is IndexableArticle {
  if (!article || typeof article !== "object") return false;

  const candidate = article as IndexableArticle;
  if (typeof candidate.slug !== "string" || !routeSafeSlugPattern.test(candidate.slug)) return false;

  const body = getEnglishBody(candidate)?.trim();
  
  // Reject known low-quality patterns only
  if (body && rejectedBodyPatterns.some((pattern) => pattern.test(body))) return false;

  // Index all articles with valid slug — even short ones can rank for long-tail keywords
  // Cornerstone articles still need substantial content
  if (cornerstoneSlugs.has(candidate.slug)) {
    return body ? body.length >= 500 : false;
  }
  
  return true;
}
