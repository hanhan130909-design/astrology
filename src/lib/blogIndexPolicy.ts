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

/**
 * 索引策略（2026-11 收紧）
 *
 * 背景：站内 1497 篇文章中位数仅 58 词、85% 不足 300 词，
 * 属于 Google 定义的低质/thin content。批量薄页会拉低整站质量评分，
 * 连带把优质页拖出排名。
 *
 * 新策略：只放行有实质内容的页面进索引，其余 noindex, follow
 * （保留链接权重流动，但不再占用抓取预算与质量分）。
 * - cornerstone 白名单：正文 ≥500 字符即放行（人工审核过的长文）
 * - 其余：正文 ≥ MIN_INDEXABLE_WORDS 词才放行
 */
export const MIN_INDEXABLE_WORDS = 450;

/**
 * 词数统计：连续字母数字串算 1 词，连续汉字串算 1 词
 * （与站点内容审计口径一致）
 */
export function countWords(text: string): number {
  const tokens = text.match(/[A-Za-z0-9\u4e00-\u9fa5]+/g);
  return tokens ? tokens.length : 0;
}

export function isIndexableArticle(article: unknown): article is IndexableArticle {
  if (!article || typeof article !== "object") return false;

  const candidate = article as IndexableArticle;
  if (typeof candidate.slug !== "string" || !routeSafeSlugPattern.test(candidate.slug)) return false;

  const body = getEnglishBody(candidate)?.trim();

  // Reject known low-quality patterns only
  // 注意：cornerstone 文章内容受信（长文、人工审核），跳过 reject 模式检查
  if (cornerstoneSlugs.has(candidate.slug)) {
    return body ? body.length >= 500 : false;
  }
  if (!body) return false;
  if (rejectedBodyPatterns.some((pattern) => pattern.test(body))) return false;

  // 薄内容收敛：不足 450 词不进索引（noindex, follow）
  return countWords(body) >= MIN_INDEXABLE_WORDS;
}

/** 诊断用：该文章是否属于薄内容（不索引） */
export function isThinContent(article: unknown): boolean {
  return !isIndexableArticle(article);
}
