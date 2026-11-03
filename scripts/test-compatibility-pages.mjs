// 合盘内容引擎回归测试
// 防止两类事故：
// 1. 模板硬编码星座属性（如把 fixed 写成 mutable）——2026-11 曾真实发生；
// 2. 词数/覆盖范围倒退（规范页 < 78 或单页 < 1200 词）。
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import fs from 'node:fs';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith('@/') || specifier.endsWith('.json'))
      return nextResolve(specifier, context);
    return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context);
  },
});

const { allPairSlugs, parsePairSlug, getCompatibilityPage } = await import(
  '../src/lib/compatibilityEngine.ts'
);
const { zodiacProfiles } = await import('../src/content/zodiacProfiles.ts');

const slugs = allPairSlugs();

// 1) 覆盖范围：66 组无序 + 12 组自配对
assert.equal(slugs.length, 78, '规范页必须是 78 个');
assert.equal(new Set(slugs).size, 78, 'slug 不得重复');
const cross = slugs.filter((s) => !s.split('-')[0].startsWith(s.split('-')[1]));
assert.equal(cross.length, 66, '跨星座组合 66 组');

// 2) 每页：词数、模式声明、分数、相关链接
let minWords = Infinity;
for (const slug of slugs) {
  const parsed = parsePairSlug(slug);
  assert.ok(parsed, `slug 必须可解析: ${slug}`);
  const page = getCompatibilityPage(parsed[0], parsed[1]);
  assert.ok(page, `页面必须能生成: ${slug}`);

  const text = [
    ...page.sections.flatMap((s) => [...s.paragraphs, ...(s.bullets ?? [])]),
    ...page.faqs.map((f) => `${f.q} ${f.a}`),
  ].join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  minWords = Math.min(minWords, words);
  assert.ok(words >= 1200, `${slug} 词数不足: ${words}`);

  // 模式声明正确性（硬编码事故的回归点）
  const rhythm = page.sections.find((s) => s.id === 'rhythm');
  assert.ok(rhythm, `${slug} 缺 rhythm 段`);
  const first = rhythm.paragraphs[0];
  const a = page.a;
  const b = page.b;
  if (a.modality === b.modality) {
    assert.ok(
      first.includes(`are ${a.modality} signs`),
      `${slug} 同模式声明错误: ${first.slice(0, 90)}`,
    );
  } else {
    const m = first.match(new RegExp(`${a.name} is (${a.modality}|${b.modality})`));
    assert.ok(m && m[1] === a.modality, `${slug} 混合模式声明错误: ${first.slice(0, 90)}`);
  }

  // 分数区间
  assert.ok(
    page.score.overall >= 52 && page.score.overall <= 96,
    `${slug} 分数越界: ${page.score.overall}`,
  );

  // 相关链接必须都能解析
  for (const rel of page.related) {
    assert.ok(parsePairSlug(rel.slug), `${slug} 的相关链接无效: ${rel.slug}`);
  }

  // FAQ 至少 3 条且非空
  assert.ok(page.faqs.length >= 3, `${slug} FAQ 不足`);
  for (const faq of page.faqs) {
    assert.ok(faq.a.split(/\s+/).length >= 25, `${slug} FAQ 答案过短`);
  }
}

// 3) 元素段标题必须与实际元素一致（防止元素模板串线）
for (const slug of slugs) {
  const [x, y] = parsePairSlug(slug);
  const page = getCompatibilityPage(x, y);
  const elementSection = page.sections.find((s) => s.id === 'element');
  const expected = `${cap(page.a.element)} and ${cap(page.b.element)}: the chemistry`;
  assert.equal(elementSection.heading, expected, `${slug} 元素标题不符`);
}

function cap(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// 4) 12 星座档案字段完备（避免 undefined 出现在正文里）
for (const z of zodiacProfiles) {
  for (const field of [
    'impulse',
    'loveLanguage',
    'commStyle',
    'conflictMove',
    'need',
    'growthEdge',
    'avoid',
    'feelsLoved',
  ]) {
    assert.ok(
      typeof z[field] === 'string' && z[field].length > 10,
      `${z.slug}.${field} 缺失或过短`,
    );
  }
}

// 5) 301 映射表：78 条旧 URL，全部指向存在的规范页
const { compatibilityRedirects: redirects } = await import(
  '../src/content/compatibilityRedirects.ts'
);
assert.equal(Object.keys(redirects).length, 78, '301 映射必须恰好 78 条');
for (const [from, to] of Object.entries(redirects)) {
  assert.match(from, /^\/blog\/[a-z]+-[a-z]+-compatibility-\d+$/, `旧路径格式异常: ${from}`);
  const pairSlug = to.replace('/compatibility/', '');
  assert.ok(slugs.includes(pairSlug), `301 指向不存在的规范页: ${to}`);
}

console.log(
  `Compatibility pages tests passed (78 pages, min ${minWords} words, 78 redirects verified)`,
);
