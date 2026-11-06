// 人生小传漫画回归测试
// 锁四件事：
// 1. 12 格完整、时长稳定、屏幕字幕 ≤12 字；
// 2. 全片无 SOP 违禁词（转运/改运/化解/命盘/大师/看盘收费/包月）；
// 3. 字幕真正由命盘字段驱动 —— 换生日至少 8 格变化，同一生日必须完全一致；
// 4. 免费 3 格引用的示例图确实存在。
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === './baziViewData') {
      return nextResolve(new URL('../src/lib/baziViewData.js', import.meta.url).href, context);
    }
    if (specifier.startsWith('@/') && !specifier.endsWith('.json')) {
      return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    return nextResolve(specifier, context);
  },
});

const {
  buildLifeComic,
  FREE_PANEL_COUNT,
  TOTAL_PANEL_COUNT,
  FORBIDDEN_WORDS,
} = await import('../src/lib/chartComic.ts');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAMPLE = { year: 2004, month: 6, day: 9, hour: 16, minute: 10, gender: 0, currentYear: 2026 };
const OTHER = { year: 1993, month: 11, day: 7, hour: 21, minute: 15, gender: 0, currentYear: 2026 };

const a = buildLifeComic(SAMPLE);
const b = buildLifeComic(OTHER);
const a2 = buildLifeComic(SAMPLE);

// 1) 结构
assert.equal(a.panels.length, TOTAL_PANEL_COUNT, '必须生成 12 格');
assert.equal(a.meta.runtimeSeconds, 57, '总时长必须稳定');
assert.equal(new Set(a.panels.map((p) => p.id)).size, TOTAL_PANEL_COUNT, '格 id 不得重复');
assert.equal(a.meta.dayMaster, '己', '样例日主天干应为己（日柱己未另见 pillars）');
assert.equal(a.meta.interactions.stems.join('、'), '甲庚相冲、甲己合化土', '冲合必须来自真实排盘');

// 2) 合规
assert.deepEqual(a.compliance.violations, [], `样例含违禁词: ${a.compliance.violations}`);
assert.deepEqual(b.compliance.violations, [], `对照组含违禁词: ${b.compliance.violations}`);
assert.deepEqual(a.compliance.captionsOver12, [], `字幕超 12 字: ${a.compliance.captionsOver12}`);
assert.deepEqual(b.compliance.captionsOver12, [], `对照组字幕超 12 字: ${b.compliance.captionsOver12}`);
assert.ok(a.compliance.disclaimer.length > 0, '必须有娱乐属性声明');
assert.equal(a.compliance.aiGeneratedLabel, true, '必须标记 AI 生成');
assert.equal(FORBIDDEN_WORDS.length, 7, '违禁词清单不得被缩减');

// 3) 文案不是写死的
const changed = a.panels.filter((p, i) => p.caption !== b.panels[i].caption).length;
assert.ok(changed >= 8, `换生日字幕变化不足: ${changed}/12`);
assert.deepEqual(
  a.panels.map((p) => p.caption),
  a2.panels.map((p) => p.caption),
  '同一生日必须完全确定',
);
assert.ok(a.panels[2].caption.startsWith('甲申'), '年柱格字幕必须带该盘干支');
assert.ok(b.panels[2].caption.startsWith('癸酉'), '对照组年柱格必须换成自己的干支');

// 4) 免费 3 格的图存在且为压缩后的 webp
for (const p of a.panels.slice(0, FREE_PANEL_COUNT)) {
  assert.ok(p.sampleImage.startsWith('/life-comic/'), '示例图必须走站内静态资源');
  assert.ok(p.sampleImage.endsWith('.webp'), '示例图必须压缩为 webp');
  const file = path.join(ROOT, 'public', p.sampleImage.replace(/^\//, ''));
  assert.ok(fs.existsSync(file), `缺少示例图: ${file}`);
  assert.ok(fs.statSync(file).size < 150 * 1024, `示例图过大: ${file}`);
}

// 5) 12 格都带字段来源，方便内容审计
for (const p of a.panels) {
  assert.ok(p.chartSource.length > 0, `${p.id} 缺少命盘字段来源`);
  assert.ok(p.narration.length > 8, `${p.id} 旁白过短`);
}

console.log(
  `Life comic tests passed (${TOTAL_PANEL_COUNT} panels, ${changed}/${TOTAL_PANEL_COUNT} captions change across two births, ${a.compliance.violations.length} forbidden words, ${FREE_PANEL_COUNT} free assets verified)`,
);
