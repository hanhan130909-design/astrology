// 生成旧配对博客 URL → 新规范配对页的 301 映射表
// 输出：src/content/compatibility-redirects.json
// 为什么需要：站内原有 144 篇 /blog/*-compatibility-N，每篇约 47 词，
// 且 A-B 与 B-A 互为重复。新结构把这 144 条收敛到 78 个规范页，
// 旧 URL 必须 301 到对应规范页，否则等于主动丢掉已有的索引信号。
import fs from 'node:fs';
import path from 'node:path';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith('@/') || specifier.endsWith('.json'))
      return nextResolve(specifier, context);
    return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context);
  },
});

const mods = [
  'seo-articles',
  'more-seo-articles',
  'longtail-seo-articles',
  'longtail-seo-articles-batch2',
  'longtail-seo-articles-batch3',
  'longtail-seo-articles-batch4',
  'longtail-seo-articles-batch5',
  'longtail-seo-articles-batch6',
  'longtail-seo-articles-batch7',
];

const SIGNS = new Set([
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
]);

const articles = [];
for (const name of mods) {
  const loaded = await import(`../src/app/blog/${name}.ts`);
  const key = Object.keys(loaded)[0];
  articles.push(...loaded[key]);
}

const ANIMALS = new Set([
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
]);

const map = {};
const chineseMap = {};
const unmatched = [];

for (const article of articles) {
  // 生肖：rat-ox-chinese-zodiac-compatibility-143
  const chinese = /^(rat|ox|tiger|rabbit|dragon|snake|horse|goat|monkey|rooster|dog|pig)-([a-z]+)-chinese-zodiac-compatibility-\d+$/.exec(
    article.slug,
  );
  if (chinese && ANIMALS.has(chinese[2])) {
    const [x, y] = [chinese[1], chinese[2]].sort();
    chineseMap[`/blog/${article.slug}`] = `/compatibility/chinese/${x}-${y}`;
    continue;
  }

  const match = /^(.+?)-compatibility-\d+$/.exec(article.slug);
  if (!match) continue;

  const parts = match[1].split('-');
  if (parts.length !== 2 || !SIGNS.has(parts[0]) || !SIGNS.has(parts[1])) {
    unmatched.push(article.slug);
    continue;
  }

  const [x, y] = [parts[0], parts[1]].sort();
  map[`/blog/${article.slug}`] = `/compatibility/${x}-${y}`;
}

const outPath = path.join(process.cwd(), 'src/content/compatibility-redirects.json');
fs.writeFileSync(outPath, `${JSON.stringify(map, null, 2)}\n`, 'utf8');

// 应用代码统一走 TS 版本（Node 22 的 JSON 导入需要 import attribute，
// 而 Next 打包器不支持该语法；TS 常量两边都能吃）
const tsPath = path.join(process.cwd(), 'src/content/compatibilityRedirects.ts');
const tsBody = `/**
 * 由 scripts/generate-compat-redirects.mjs 生成，勿手改。
 * 78 条旧配对博客 URL → 66 个规范配对页（/compatibility/[pair]）。
 * next.config.ts 的 redirects() 另从同名 JSON 读取。
 */
export const compatibilityRedirects: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;
fs.writeFileSync(tsPath, tsBody, 'utf8');

const cnJsonPath = path.join(process.cwd(), 'src/content/chinese-compatibility-redirects.json');
fs.writeFileSync(cnJsonPath, `${JSON.stringify(chineseMap, null, 2)}\n`, 'utf8');

const cnTsPath = path.join(process.cwd(), 'src/content/chineseCompatibilityRedirects.ts');
const cnTsBody = `/**
 * 由 scripts/generate-compat-redirects.mjs 生成，勿手改。
 * 66 条旧生肖配对博客 URL → 66 个规范配对页（/compatibility/chinese/[pair]）。
 */
export const chineseCompatibilityRedirects: Record<string, string> = ${JSON.stringify(chineseMap, null, 2)};
`;
fs.writeFileSync(cnTsPath, cnTsBody, 'utf8');

const targets = new Set(Object.values(map));
const chineseTargets = new Set(Object.values(chineseMap));
console.log(`星座配对旧 URL: ${Object.keys(map).length} 条 → ${targets.size} 个规范页`);
console.log(
  `生肖配对旧 URL: ${Object.keys(chineseMap).length} 条 → ${chineseTargets.size} 个规范页`,
);
if (unmatched.length) {
  console.log(`未能归类（需人工确认）: ${unmatched.length}`);
  unmatched.slice(0, 10).forEach((slug) => console.log('  ', slug));
}
console.log(
  `已写入 ${[
    outPath, tsPath, cnJsonPath, cnTsPath,
  ].map((f) => path.relative(process.cwd(), f)).join(' / ')}`,
);
