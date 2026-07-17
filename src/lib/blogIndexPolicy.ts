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
  if (typeof candidate.slug !== "string" || candidate.slug.trim() === "") return false;

  const body = getEnglishBody(candidate)?.trim();
  if (!body || rejectedBodyPatterns.some((pattern) => pattern.test(body))) return false;

  if (cornerstoneSlugs.has(candidate.slug)) return body.length >= 1000;

  const headingCount = body.match(/^##\s+.+$/gm)?.length ?? 0;
  return body.length >= 1200 && headingCount >= 2;
}
