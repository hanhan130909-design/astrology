// 生肖合盘引擎回归测试
//
// 锁三件事：
// 1. 分类正确性 —— 六合 / 六冲 / 六害 必须与地支表一致（这是内容的可信度基础）；
// 2. 分档区间不串 —— 旧的扁平打分（36 篇中性全 72%）正是要消灭的问题；
// 3. 词数与跳转映射不回退。
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith('@/') || specifier.endsWith('.json'))
      return nextResolve(specifier, context);
    return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context);
  },
});

const {
  allChinesePairSlugs,
  parseChinesePairSlug,
  getChineseCompatibilityPage,
  classifyRelation,
} = await import('../src/lib/chineseZodiacEngine.ts');
const { chineseZodiacProfiles, chineseZodiacBySlug } = await import(
  '../src/content/chineseZodiacProfiles.ts'
);

const slugs = allChinesePairSlugs();

// 1) 覆盖：66 跨生肖 + 12 自配对
assert.equal(slugs.length, 78, '生肖规范页必须是 78 个');
assert.equal(new Set(slugs).size, 78, 'slug 不得重复');
const selfPairs = slugs.filter((s) => s.split('-')[0] === s.split('-')[1]);
assert.equal(selfPairs.length, 12, '自配对必须 12 个');

// 2) 六合六组必须被识别
const SECRET = [
  ['rat', 'ox'],
  ['tiger', 'pig'],
  ['rabbit', 'dog'],
  ['dragon', 'rooster'],
  ['snake', 'monkey'],
  ['horse', 'goat'],
];
for (const [x, y] of SECRET) {
  const rel = classifyRelation(chineseZodiacBySlug.get(x), chineseZodiacBySlug.get(y));
  assert.equal(rel.kind, 'secret-friend', `${x}-${y} 应为六合，实际 ${rel.kind}`);
  assert.equal(rel.hanzi, '六合');
}

// 3) 六冲六组
const CLASH = [
  ['rat', 'horse'],
  ['ox', 'goat'],
  ['tiger', 'monkey'],
  ['rabbit', 'rooster'],
  ['dragon', 'dog'],
  ['snake', 'pig'],
];
for (const [x, y] of CLASH) {
  const rel = classifyRelation(chineseZodiacBySlug.get(x), chineseZodiacBySlug.get(y));
  assert.equal(rel.kind, 'clash', `${x}-${y} 应为六冲，实际 ${rel.kind}`);
}

// 4) 六害六组
const HARM = [
  ['rat', 'goat'],
  ['ox', 'horse'],
  ['tiger', 'snake'],
  ['rabbit', 'dragon'],
  ['monkey', 'pig'],
  ['rooster', 'dog'],
];
for (const [x, y] of HARM) {
  const rel = classifyRelation(chineseZodiacBySlug.get(x), chineseZodiacBySlug.get(y));
  assert.equal(rel.kind, 'harm', `${x}-${y} 应为六害，实际 ${rel.kind}`);
}

// 5) 三合：同局内任意两肖
for (const animal of chineseZodiacProfiles) {
  for (const mate of chineseZodiacProfiles) {
    if (mate.slug === animal.slug || mate.trine !== animal.trine) continue;
    const rel = classifyRelation(animal, mate);
    // 六合优先于三合（巳申同时是六合与相刑）
    if (rel.kind !== 'secret-friend') {
      assert.equal(rel.kind, 'trine', `${animal.slug}-${mate.slug} 应为三合`);
    }
  }
}

// 6) 分档区间与顺序：六合 > 三合 > 中性 > 六害 > 六冲，且区间不重叠
const byKind = {};
let minWords = Infinity;
for (const slug of slugs) {
  const parsed = parseChinesePairSlug(slug);
  assert.ok(parsed, `slug 必须可解析: ${slug}`);
  const page = getChineseCompatibilityPage(parsed[0], parsed[1]);
  assert.ok(page, `页面必须能生成: ${slug}`);

  const text = [
    ...page.sections.flatMap((s) => [...s.paragraphs, ...(s.bullets ?? [])]),
    ...page.faqs.map((f) => `${f.q} ${f.a}`),
  ].join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  minWords = Math.min(minWords, words);
  assert.ok(words >= 1250, `${slug} 词数不足: ${words}`);

  const kind = page.relation.kind;
  byKind[kind] = byKind[kind] ?? [];
  byKind[kind].push(page.score.overall);

  assert.ok(
    page.score.overall >= 25 && page.score.overall <= 100,
    `${slug} 分数越界: ${page.score.overall}`,
  );
  assert.ok(page.faqs.length >= 4, `${slug} FAQ 不足`);
  for (const faq of page.faqs) {
    assert.ok(faq.a.split(/\s+/).length >= 20, `${slug} FAQ 答案过短`);
  }
  for (const rel of page.related) {
    assert.ok(parseChinesePairSlug(rel.slug), `${slug} 的相关链接无效: ${rel.slug}`);
  }
  // 正文不得出现未替换的模板占位
  assert.ok(!/undefined|\$\{/.test(text), `${slug} 正文含未替换占位符`);
}

const range = (kind) => [Math.min(...byKind[kind]), Math.max(...byKind[kind])];
assert.deepEqual(byKind['secret-friend'].length, 6, '六合必须 6 组');
assert.deepEqual(byKind.trine.length, 12, '三合必须 12 组');
assert.deepEqual(byKind.clash.length, 6, '六冲必须 6 组');
assert.deepEqual(byKind.harm.length, 6, '六害必须 6 组');
assert.deepEqual(byKind.neutral.length, 36, '中性必须 36 组');
assert.deepEqual(byKind.self.length, 12, '自配对必须 12 组');

assert.ok(range('secret-friend')[0] > range('trine')[1], '六合必须整体高于三合');
assert.ok(range('trine')[0] > range('neutral')[1], '三合必须整体高于中性');
assert.ok(range('neutral')[0] > range('harm')[1], '中性必须整体高于六害');
assert.ok(range('harm')[0] > range('clash')[1], '六害必须整体高于六冲');

// 7) 同档内必须拉开差异（旧站 36 篇中性全 72%，这里不允许全同分）
assert.ok(
  new Set(byKind.neutral).size >= 6,
  `中性档必须至少 6 个不同分值，实际 ${new Set(byKind.neutral).size}`,
);

// 8) 跳转映射：66 条旧生肖 URL → 存在的规范页
const { chineseCompatibilityRedirects } = await import(
  '../src/content/chineseCompatibilityRedirects.ts'
);
assert.equal(Object.keys(chineseCompatibilityRedirects).length, 66, '生肖 301 必须 66 条');
for (const [from, to] of Object.entries(chineseCompatibilityRedirects)) {
  assert.match(from, /^\/blog\/[a-z]+-[a-z]+-chinese-zodiac-compatibility-\d+$/);
  assert.match(to, /^\/compatibility\/chinese\/[a-z]+-[a-z]+$/);
  const pairSlug = to.replace('/compatibility/chinese/', '');
  assert.ok(slugs.includes(pairSlug), `301 指向不存在的生肖页: ${to}`);
}

console.log(
  `Chinese compatibility tests passed (78 pages, min ${minWords} words, ` +
    `relations ${JSON.stringify(Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, range(k)])))}, ` +
    `66 redirects)`,
);
