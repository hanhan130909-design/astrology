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
const rejectedBodyPatterns = [
  /[木火土金水]\s+(?:element|sign)/i,
  /every ending b\b/i,
  /complete Moon placement\.$/i,
];

function getEnglishBody(article: IndexableArticle): string | null {
  if (typeof article.sections === "string") return article.sections;
  if (typeof article.content === "string") return article.content;
  if (article.content && typeof article.content.en === "string") return article.content.en;
  return null;
}

export function isIndexableArticle(article: unknown): article is IndexableArticle {
  if (!article || typeof article !== "object") return false;

  const candidate = article as IndexableArticle;
  if (typeof candidate.slug !== "string" || !routeSafeSlugPattern.test(candidate.slug)) return false;

  const body = getEnglishBody(candidate)?.trim();
  if (!body) return false;

  // Cornerstone articles: require substantial content
  if (cornerstoneSlugs.has(candidate.slug)) return body.length >= 1000;
  
  // Reject known low-quality patterns
  if (rejectedBodyPatterns.some((pattern) => pattern.test(body))) return false;

  // Lower threshold — include all articles with meaningful content (>300 chars)
  // Previously: 1200 chars + 2 headings. This excluded 900+ articles.
  return body.length >= 300;
}
