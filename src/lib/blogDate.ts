/**
 * 确定性博客日期解析
 *
 * 问题背景：长尾批量生成的文章日期严重扎堆（如 2026-06-21 一天 120 篇），
 * 另有部分文章完全没有日期（JSON-LD 兜底 2026-01-01 同样扎堆）。
 *
 * 方案：全局贪心槽位分配（模块加载时预计算一次，跨构建完全一致）：
 * 1. 所有文章按原始日期分桶；destiny 文章统一锚定 2026-06-15；无日期锚定 2026-10-01。
 * 2. 真实小桶（≤2 篇）先登记占用、保持原日期不动。
 * 3. 大桶按桶大小降序处理：桶内文章按 slug 哈希探测序列
 *    （(hash + k) % MAX_SPREAD 往前第 k 天）找到第一个未满（< DAILY_CAP）的日期槽。
 * 4. 结果：任意单日 ≤ DAILY_CAP + 2（小桶保留叠加）篇。
 *
 * 消费方：getBlogSummaries()（列表/sitemap 排序来源）、
 *        /blog/[slug] JSON-LD datePublished。
 */

import { destinyArticles } from '../content/destiny-blog-articles';
import { seoArticles } from '../app/blog/seo-articles';
import { moreSeoArticles } from '../app/blog/more-seo-articles';
import { longtailSeoArticles } from '../app/blog/longtail-seo-articles';
import { longtailSeoArticlesBatch2 } from '../app/blog/longtail-seo-articles-batch2';
import { longtailSeoArticlesBatch3 } from '../app/blog/longtail-seo-articles-batch3';
import { longtailSeoArticlesBatch4 } from '../app/blog/longtail-seo-articles-batch4';
import { longtailSeoArticlesBatch5 } from '../app/blog/longtail-seo-articles-batch5';
import { longtailSeoArticlesBatch6 } from '../app/blog/longtail-seo-articles-batch6';
import { longtailSeoArticlesBatch7 } from '../app/blog/longtail-seo-articles-batch7';

const DAY_MS = 86400000;
const MAX_SPREAD = 180; // 大桶最多往前摊 180 天
const DAILY_CAP = 5; // 错开后任意单日最多篇数（真实小桶不受限）
const KEEP_THRESHOLD = 2; // 桶 ≤2 篇视为真实日期，保持不动
const NO_DATE_ANCHOR = '2026-10-01';
const DESTINY_ANCHOR = '2026-06-15';

/** FNV-1a 32-bit —— 确定性、跨进程一致 */
export function hashSlug(slug: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function toDateStr(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function minusDays(dateStr: string, days: number): string {
  return toDateStr(Date.parse(`${dateStr}T00:00:00Z`) - days * DAY_MS);
}

interface RawEntry {
  slug: string;
  rawDate: string; // '' = 无日期
}

const RAW_ARTICLES: RawEntry[] = [
  ...seoArticles,
  ...moreSeoArticles,
  ...longtailSeoArticles,
  ...longtailSeoArticlesBatch2,
  ...longtailSeoArticlesBatch3,
  ...longtailSeoArticlesBatch4,
  ...longtailSeoArticlesBatch5,
  ...longtailSeoArticlesBatch6,
  ...longtailSeoArticlesBatch7,
  ...destinyArticles.map((a) => ({ slug: a.slug, date: DESTINY_ANCHOR })),
].map((a) => ({ slug: a.slug, rawDate: a.date ?? '' }));

// ---- 预计算：slug → 最终日期 ----
const resolvedDates = new Map<string, string>();

// 分桶
const buckets = new Map<string, RawEntry[]>();
for (const entry of RAW_ARTICLES) {
  const key = entry.rawDate || '_none';
  (buckets.get(key) ?? buckets.set(key, []).get(key)!).push(entry);
}

// 第一遍：真实小桶（≤KEEP_THRESHOLD 且非 _none）先登记占用，保持原日期
const dailyLoad = new Map<string, number>();
const isKept = (key: string, size: number) => key !== '_none' && size <= KEEP_THRESHOLD;

for (const [key, members] of buckets.entries()) {
  if (!isKept(key, members.length)) continue;
  for (const entry of members) {
    resolvedDates.set(entry.slug, key);
    dailyLoad.set(key, (dailyLoad.get(key) ?? 0) + 1);
  }
}

// 第二遍：大桶按桶大小降序，探测未满的日期槽
for (const [key, members] of [...buckets.entries()]
  .filter(([key, members]) => !isKept(key, members.length))
  .sort((a, b) => b[1].length - a[1].length)) {
  const anchor = key === '_none' ? NO_DATE_ANCHOR : key;

  // 桶内顺序确定性（按 slug 排序）
  const ordered = [...members].sort((a, b) => (a.slug < b.slug ? -1 : 1));

  for (const entry of ordered) {
    // 探测序列：hash 偏移 + 线性探测，找到第一个未满的日期槽
    const h = hashSlug(entry.slug);
    let assigned = '';
    for (let k = 0; k < MAX_SPREAD; k++) {
      const candidate = minusDays(anchor, (h + k) % MAX_SPREAD);
      if ((dailyLoad.get(candidate) ?? 0) < DAILY_CAP) {
        assigned = candidate;
        break;
      }
    }
    if (!assigned) assigned = minusDays(anchor, h % MAX_SPREAD); // 极端兜底
    resolvedDates.set(entry.slug, assigned);
    dailyLoad.set(assigned, (dailyLoad.get(assigned) ?? 0) + 1);
  }
}

/**
 * 解析文章的最终展示日期（确定性：同 slug 永远同一结果）。
 * @param slug 文章 slug
 * @param rawDate 原始日期（YYYY-MM-DD），可为空
 */
export function resolveArticleDate(slug: string, rawDate?: string): string {
  return resolvedDates.get(slug) ?? rawDate ?? NO_DATE_ANCHOR;
}
