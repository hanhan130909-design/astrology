/**
 * 生肖合婚内容引擎
 *
 * 设计原则与 compatibilityEngine 一致：
 * 1. 分类来自可查证的合婚规则（六合 / 三合 / 六害 / 六冲 / 相刑 / 自刑），
 *    不做"同档同分"的扁平处理 —— 旧站 36 篇中性配对全部 72%，
 *    这正是那批页面没有价值的原因；
 * 2. 分档区间互不重叠，五行与阴阳只在档内调节，避免出现"六害比中性还高"
 *    这种自相矛盾的读数；
 * 3. 正文由 12 份生肖档案字段 + 关系模板 + 五行方向拼装，单页 ≥1200 词。
 */
import {
  chineseZodiacProfiles,
  chineseZodiacBySlug,
  elementRelation,
  trineLabel,
  wuXingHanzi,
  wuXingLabel,
  type ChineseZodiacProfile,
  type WuXing,
} from '@/content/chineseZodiacProfiles';

export type RelationKind = 'secret-friend' | 'trine' | 'neutral' | 'harm' | 'clash' | 'self';

export interface RelationInfo {
  kind: RelationKind;
  /** 中文关系名 */
  hanzi: string;
  label: string;
  /** 合化五行（仅六合） */
  combinesInto?: WuXing;
  /** 附带相刑 */
  punishes: boolean;
  /** 附带相破 */
  breaks: boolean;
  /** 自刑（仅自配对） */
  selfPunish: boolean;
  scoreRange: [number, number];
}

const SECRET_FRIEND_PAIRS: Array<[string, string, WuXing]> = [
  ['子', '丑', 'earth'],
  ['寅', '亥', 'wood'],
  ['卯', '戌', 'fire'],
  ['辰', '酉', 'metal'],
  ['巳', '申', 'water'],
  ['午', '未', 'earth'],
];

const CLASH_PAIRS: Array<[string, string]> = [
  ['子', '午'],
  ['丑', '未'],
  ['寅', '申'],
  ['卯', '酉'],
  ['辰', '戌'],
  ['巳', '亥'],
];

const HARM_PAIRS: Array<[string, string]> = [
  ['子', '未'],
  ['丑', '午'],
  ['寅', '巳'],
  ['卯', '辰'],
  ['申', '亥'],
  ['酉', '戌'],
];

/** 六破：子酉、午卯、辰丑、未戌、寅亥、巳申 */
const BREAK_PAIRS: Array<[string, string]> = [
  ['子', '酉'],
  ['午', '卯'],
  ['辰', '丑'],
  ['未', '戌'],
  ['寅', '亥'],
  ['巳', '申'],
];

/** 相刑：寅巳申三刑、丑戌未三刑、子卯相刑；辰午酉亥自刑 */
const PUNISH_PAIRS: Array<[string, string]> = [
  ['寅', '巳'],
  ['巳', '申'],
  ['寅', '申'],
  ['丑', '戌'],
  ['戌', '未'],
  ['丑', '未'],
  ['子', '卯'],
];

const hasPair = (list: Array<[string, string]>, x: string, y: string) =>
  list.some(([p, q]) => (p === x && q === y) || (p === y && q === x));

export function classifyRelation(
  a: ChineseZodiacProfile,
  b: ChineseZodiacProfile,
): RelationInfo {
  const punishes = a.branch !== b.branch && hasPair(PUNISH_PAIRS, a.branch, b.branch);
  const breaks = a.branch !== b.branch && hasPair(BREAK_PAIRS, a.branch, b.branch);

  if (a.slug === b.slug) {
    return {
      kind: 'self',
      hanzi: a.selfPunish ? '同气自刑' : '同气相求',
      label: a.selfPunish ? 'Same animal, self-punishing branch' : 'Same animal, doubled nature',
      punishes: false,
      breaks: false,
      selfPunish: a.selfPunish,
      scoreRange: [72, 82],
    };
  }

  const secret = SECRET_FRIEND_PAIRS.find(
    ([p, q]) =>
      (p === a.branch && q === b.branch) || (p === b.branch && q === a.branch),
  );
  if (secret) {
    return {
      kind: 'secret-friend',
      hanzi: '六合',
      label: 'Secret Friends',
      combinesInto: secret[2],
      punishes,
      breaks,
      selfPunish: false,
      scoreRange: [88, 100],
    };
  }

  if (a.trine === b.trine) {
    return {
      kind: 'trine',
      hanzi: '三合',
      label: 'Three Harmonies',
      punishes,
      breaks,
      selfPunish: false,
      scoreRange: [78, 88],
    };
  }

  if (hasPair(CLASH_PAIRS, a.branch, b.branch)) {
    return {
      kind: 'clash',
      hanzi: '六冲',
      label: 'Direct Clash',
      punishes,
      breaks,
      selfPunish: false,
      scoreRange: [30, 48],
    };
  }

  if (hasPair(HARM_PAIRS, a.branch, b.branch)) {
    return {
      kind: 'harm',
      hanzi: '六害',
      label: 'Mutual Harm',
      punishes,
      breaks,
      selfPunish: false,
      scoreRange: [48, 62],
    };
  }

  return {
    kind: 'neutral',
    hanzi: '无合无冲',
    label: 'No direct branch link',
    punishes,
    breaks,
    selfPunish: false,
    scoreRange: [62, 78],
  };
}

export interface ChineseCompatibilityScore {
  overall: number;
  /** 关系（合/冲/害/三合/同气）得分，满分 55 */
  relationPoints: number;
  element: number;
  polarity: number;
  relation: string;
  band: string;
  bandNote: string;
  /** 五行互动 */
  elementKind: 'generating' | 'same' | 'controlling';
  /** 相生/相克方向说明 */
  elementNote: string;
}

const ELEMENT_FACTOR = { generating: 1, same: 0.6, controlling: 0.25 } as const;

const RELATION_POINTS: Record<RelationKind, number> = {
  'secret-friend': 55,
  trine: 46,
  self: 36,
  neutral: 26,
  harm: 16,
  clash: 6,
};

export function scoreChinesePair(
  a: ChineseZodiacProfile,
  b: ChineseZodiacProfile,
  relation = classifyRelation(a, b),
): ChineseCompatibilityScore {
  const rel = elementRelation(a.element, b.element);
  const elementFactor = ELEMENT_FACTOR[rel.kind];
  const polarityFactor = a.polarity === b.polarity ? 0.55 : 1;
  const factor = 0.65 * elementFactor + 0.35 * polarityFactor;

  const [lo, hi] = relation.scoreRange;
  let overall = Math.round(lo + (hi - lo) * factor);
  // 相刑独立扣分：主关系之外的第二层冲突（寅巳申 / 丑戌未 / 子卯），
  // 与自刑（辰午酉亥同支）分开计算，让同档配对之间也能拉开差异。
  if (relation.punishes) overall -= 4;
  // 六破：比刑轻一级，合中带破（寅亥、巳申）也照扣，因为这正是"看着合却总差一点"的来源
  if (relation.breaks) overall -= 2;
  if (relation.selfPunish) overall -= 4;

  const element = Math.round(40 * elementFactor) + (rel.kind === 'generating' ? 10 : 0);
  const polarity = a.polarity === b.polarity ? 10 : 20;

  const { band, bandNote } = chineseBandFor(overall, relation.kind);

  return {
    overall,
    relationPoints: RELATION_POINTS[relation.kind],
    element: Math.min(50, element),
    polarity,
    relation: relation.hanzi,
    band,
    bandNote,
    elementKind: rel.kind,
    elementNote: describeElementRelation(a, b, rel),
  };
}

function describeElementRelation(
  a: ChineseZodiacProfile,
  b: ChineseZodiacProfile,
  rel: ReturnType<typeof elementRelation>,
): string {
  if (rel.kind === 'same') {
    return `Both are ${wuXingLabel[a.element]} (${wuXingHanzi[a.element]}) by birth year — the same substance doubled.`;
  }
  if (rel.kind === 'generating') {
    const source = rel.source === a.element ? a.name : b.name;
    const target = source === a.name ? b.name : a.name;
    return `${source} (${wuXingHanzi[rel.source as WuXing]}) generates ${target} (${wuXingHanzi[rel.target as WuXing]}) — a feeding relationship rather than a contest.`;
  }
  const source = rel.source === a.element ? a.name : b.name;
  const target = source === a.name ? b.name : a.name;
  return `${source} (${wuXingHanzi[rel.source as WuXing]}) controls ${target} (${wuXingHanzi[rel.target as WuXing]}) — the traditional 克 relation, which asks for conscious restraint rather than signalling doom.`;
}

function chineseBandFor(overall: number, kind: RelationKind): { band: string; bandNote: string } {
  if (kind === 'secret-friend') {
    return {
      band: 'Secret Friends',
      bandNote:
        'One of the six 六合 pairings — the branch-level bond the classical texts treat as the easiest foundation for a shared life.',
    };
  }
  if (kind === 'trine') {
    return {
      band: 'Three Harmonies',
      bandNote:
        'Two of the three animals in the same 三合 trine. The bond is structural rather than romantic: you naturally pull in the same direction.',
    };
  }
  if (kind === 'self') {
    return {
      band: overall >= 78 ? 'Doubled nature' : 'Doubled nature, with edge',
      bandNote:
        'Same animal, same instincts. Recognition is total; so is the shared blind spot.',
    };
  }
  if (kind === 'neutral') {
    return {
      band: 'No direct link',
      bandNote:
        'No 合 and no 冲 between the branches. This pairing is decided almost entirely by the two element natures and by what the two of you actually do with it.',
    };
  }
  if (kind === 'harm') {
    return {
      band: 'Mutual Harm',
      bandNote:
        'A 六害 pairing: not open warfare, but a slow pattern of one person’s instinct quietly costing the other something.',
    };
  }
  return {
    band: 'Direct Clash',
    bandNote:
      'A 六冲 pairing — the branches sit opposite each other. Classical practice does not call this doomed; it calls it expensive and worth the expense in some cases.',
  };
}

export interface ChineseSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ChineseFaq {
  q: string;
  a: string;
}

export interface ChineseCompatibilityPage {
  slug: string;
  a: ChineseZodiacProfile;
  b: ChineseZodiacProfile;
  isSelf: boolean;
  relation: RelationInfo;
  score: ChineseCompatibilityScore;
  h1: string;
  title: string;
  description: string;
  sections: ChineseSection[];
  faqs: ChineseFaq[];
  related: Array<{ slug: string; label: string; overall: number }>;
  wordCount: number;
}

/** 规范化 slug：字母序 */
export function chinesePairSlug(a: string, b: string): string {
  return [a, b].sort().join('-');
}

export function parseChinesePairSlug(slug: string): [string, string] | null {
  const parts = slug.split('-');
  if (parts.length !== 2) return null;
  const [x, y] = parts;
  if (!chineseZodiacBySlug.has(x) || !chineseZodiacBySlug.has(y)) return null;
  return x > y ? [y, x] : [x, y];
}

export function allChinesePairSlugs(): string[] {
  const out: string[] = [];
  for (let i = 0; i < chineseZodiacProfiles.length; i += 1) {
    for (let j = i; j < chineseZodiacProfiles.length; j += 1) {
      out.push(chinesePairSlug(chineseZodiacProfiles[i].slug, chineseZodiacProfiles[j].slug));
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 关系段落：按合婚规则逐类叙述                                          */
/* ------------------------------------------------------------------ */

interface RelationText {
  heading: string;
  paragraphs: string[];
  strength: string;
  friction: string;
  advice: string;
}

function relationText(
  a: ChineseZodiacProfile,
  b: ChineseZodiacProfile,
  relation: RelationInfo,
): RelationText {
  const A = a.name;
  const B = b.name;
  const branchPair = `${a.branch}${b.branch}`;
  const extraNotes: string[] = [];
  if (relation.punishes) {
    extraNotes.push(
      `${branchPair} is also a 相刑 pair — one of the three-punishment combinations — so the friction between these two branches is structural rather than accidental and does not resolve on goodwill alone.`,
    );
  }
  if (relation.breaks) {
    extraNotes.push(
      `${branchPair} is additionally one of the 六破 pairs. 破 is the mildest of the classical frictions, but on top of ${relation.hanzi} it explains the specific feeling these two often report: the bond is real and something still keeps snagging.`,
    );
  }
  const punishNote = extraNotes.length
    ? ` There is a second layer here that most compatibility charts skip: ${extraNotes.join(' ')}`
    : '';

  if (relation.kind === 'secret-friend') {
    const into = relation.combinesInto as WuXing;
    return {
      heading: `${a.branch}${b.branch}合化${wuXingHanzi[into]}: what 六合 actually means`,
      paragraphs: [
        `${A} (${a.branch}) and ${B} (${b.branch}) form one of the six 六合 pairs. In the classical system this is the closest thing the animal layer offers to a guaranteed foundation: two branches that pull toward each other instead of past each other. The pair 合化${wuXingHanzi[into]} — it combines into ${wuXingLabel[into]} — which is the quality the relationship produces when it is working.`,
        `Practically, 六合 does not mean the two of you are similar. It means you are *oriented* toward each other. ${A} ${a.impulse}; ${B} ${b.impulse}. Those two instincts are different, and the 合 is what keeps the difference from turning into a contest. Couples in this category tend to describe their relationship as "easy to come back to" rather than "easy" — the repair is quick even when the argument is real.`,
        punishNote,
      ].filter(Boolean) as string[],
      strength:
        'Repair speed. In a 六合 pairing the return to normal after a conflict is short, which matters far more over a decade than the absence of conflict.',
      friction:
        'The bond can be taken for granted precisely because it is structural. Neither of you has to work at staying oriented toward the other, so the daily maintenance quietly stops and the relationship runs on momentum for years.',
      advice:
        'Use the ease for something: agree on one shared project that neither of you would attempt alone. 六合 pairs do best when the bond has an outlet, otherwise the comfort curdles into complacency.',
    };
  }

  if (relation.kind === 'trine') {
    const group = trineLabel[a.trine];
    return {
      heading: `${a.branch}${b.branch}: two of the three ${group.hanzi} animals`,
      paragraphs: [
        `${A} (${a.branch}) and ${B} (${b.branch}) both belong to the ${group.hanzi} — the ${group.element} trine that also contains ${a.trineMates.join(' and ')} for ${A}, and ${b.trineMates.join(' and ')} for ${B}. In the 三合 model this is a structural alliance: three animals that hold the same elemental phase and reinforce each other's direction.`,
        `What 三合 gives you is sameness of purpose, not sameness of personality. ${A} ${a.impulse}; ${B} ${b.impulse}. You are heading the same way at different speeds, which is a much better failure mode than heading different ways at the same speed.`,
        `${group.element} is the shared note between you, and it is worth naming explicitly: this pairing tends to build something outside itself — a household, a business, a family culture — and to be at its best when that thing exists.`,
        punishNote,
      ].filter(Boolean) as string[],
      strength:
        'Aligned direction. Under pressure you naturally reach for the same solution, which removes an entire category of argument from the relationship.',
      friction:
        'A trine can become an echo chamber. Because you agree on the fundamentals, neither of you is positioned to notice the shared mistake until it is expensive.',
      advice:
        'Deliberately keep one person in your life who is not in this trine — someone whose instinct is different from both of yours — and actually listen to them on the big decisions.',
    };
  }

  if (relation.kind === 'clash') {
    return {
      heading: `${a.branch}${b.branch}冲: what a 六冲 pairing really costs`,
      paragraphs: [
        `${A} (${a.branch}) and ${B} (${b.branch}) sit directly opposite each other in the twelve branches — a 六冲. This is the pairing the old matchmaking almanacs warned about, and the warning is not superstition: the two branches are 180 degrees apart, so each one's natural move is the other one's least comfortable position.`,
        `What that looks like in a relationship is not constant fighting. It is a recurring mismatch of tempo and priority that neither party experiences as unreasonable. ${A} ${a.impulse}. ${B} ${b.impulse}. Both are coherent strategies. They simply cannot be executed at the same time in the same household without negotiation.`,
        `The honest read: 六冲 pairs are frequently the most alive and the most exhausting relationships in the whole system. The classical literature does not say "do not marry" — it says the pairing requires 通关, a bridge, and that bridge is usually a deliberate third thing: a shared practice, a mediator, a structure that neither person controls alone.`,
        punishNote,
      ].filter(Boolean) as string[],
      strength:
        'Catalytic effect. A 六冲 pairing changes both people faster than a harmonious one, because each is constantly confronted with a mode of being they would never have chosen.',
      friction:
        'Exhaustion by accumulation. No single argument is catastrophic; the problem is that the same negotiation has to happen every week for years, and neither of you ever gets to stop bracing.',
      advice:
        'Build the 通关 intentionally. Pick one recurring decision — money, family visits, the calendar — and give it a written rule that neither of you renegotiates in the moment. 冲 pairs survive on structure, not on spontaneity.',
    };
  }

  if (relation.kind === 'harm') {
    return {
      heading: `${a.branch}${b.branch}害: the quiet kind of incompatibility`,
      paragraphs: [
        `${A} (${a.branch}) and ${B} (${b.branch}) form one of the six 六害 pairs. 害 is the least dramatic and most under-diagnosed of the classical relations: it is not opposition and it is not attraction, it is a slow pattern in which one person's ordinary behaviour quietly costs the other something.`,
        `In practice a 六害 pairing usually looks fine from the outside and feels subtly draining from the inside. ${A} ${a.impulse}. ${B} ${b.impulse}. Neither is doing anything wrong. The cost is in the second-order effects — the thing one of you does to feel secure is the thing that makes the other feel managed.`,
        `The reason 害 is worth knowing about is that it responds very well to being named. Unlike 冲, which needs structure, 害 needs vocabulary: once the two of you can say "this is the pattern, not the person", the pattern loses most of its power.`,
        punishNote,
      ].filter(Boolean) as string[],
      strength:
        'Low drama, high stability. 六害 pairs rarely blow up, and the day-to-day of the relationship is usually calm and workable.',
      friction:
        'Resentment without an event. There is no fight to point at, which makes it hard to raise — and the absence of a fight is exactly why it goes unraised for years.',
      advice:
        'Schedule a monthly conversation whose only agenda is "what has been quietly costing you". 害 pairs do not need conflict resolution; they need a standing venue for the small stuff before it composts.',
    };
  }

  if (relation.kind === 'self') {
    return {
      heading: `Same animal: what doubles when ${a.branch} meets ${a.branch}`,
      paragraphs: [
        `Two ${A}s share the same branch, which in the classical system is neither 合 nor 冲 — it is 同气, the same qi repeated. Every instinct the first one has, the second one has too, and there is no counterweight anywhere in the pairing.`,
        `${A} ${a.impulse}. With a partner who works the same way, understanding is instant and correction is absent. That is the whole trade: nothing needs explaining, and nothing gets caught.`,
        a.selfPunish
          ? `${a.branch} is one of the four self-punishing branches (辰午酉亥), so this pairing carries 自刑 on top of the doubling — the same animal's excess turned inward. In practice that shows up as a shared tendency to overdo the thing ${A} already overdoes, and to be the last two people to notice.`
          : `${a.branch} is not a self-punishing branch, so the pairing avoids the 自刑 overlay. The risk here is simpler and softer: a relationship so comfortable that neither person is ever stretched by it.`,
        punishNote,
      ].filter(Boolean) as string[],
      strength:
        'Total recognition. Very little in this relationship needs translation, and that is a genuine and underestimated form of intimacy.',
      friction:
        'No corrective. Two people with the same reflexes will validate each other’s blind spots indefinitely, and the relationship can stagnate without a single argument to signal it.',
      advice:
        'Import the difference on purpose — a third perspective, a friend group with different instincts, a practice that is not shared. The relationship has to be given the friction it will not generate itself.',
    };
  }

  return {
    heading: `${a.branch} and ${b.branch}: no link, no obstacle`,
    paragraphs: [
      `${A} (${a.branch}) and ${B} (${b.branch}) hold no 合, no 冲 and no 害 between them. In the old almanac tables this is the blank cell — the pairing the manuals had nothing to say about, which is why so many of these couples were simply left to work it out.`,
      `That is not a bad starting position. A neutral branch relationship means the animal layer neither pushes you together nor pulls you apart, so the relationship is decided by the two element natures underneath and by what the two of you actually do. Nothing here is pre-scripted.`,
      `${A} ${a.impulse}; ${B} ${b.impulse}. The work in this pairing is not overcoming an inbuilt opposition — it is noticing that there is no inbuilt affinity either, and building one deliberately rather than waiting to feel it.`,
      punishNote,
    ].filter(Boolean) as string[],
    strength:
      'Freedom from script. Nobody can tell you what this pairing is supposed to be, and there is no inherited pattern to live up to or rebel against.',
    friction:
      'Nothing to fall back on. In a hard season there is no structural bond doing part of the work, so the relationship is entirely carried by what the two of you put into it.',
      advice:
        'Create a ritual the pairing can lean on later — a weekly thing, an annual trip, a shared ledger. Neutral pairs are the ones that most benefit from manufactured tradition.',
  };
}

/* ------------------------------------------------------------------ */
/* 五行段落                                                             */
/* ------------------------------------------------------------------ */

function elementSection(a: ChineseZodiacProfile, b: ChineseZodiacProfile): RelationText {
  const rel = elementRelation(a.element, b.element);
  const A = a.name;
  const B = b.name;

  if (rel.kind === 'generating') {
    const source = rel.source === a.element ? a : b;
    const target = source === a ? b : a;
    return {
      heading: `五行: ${wuXingHanzi[rel.source as WuXing]}生${wuXingHanzi[rel.target as WuXing]}`,
      paragraphs: [
        `${A} is ${wuXingLabel[a.element]} (${wuXingHanzi[a.element]}) and ${B} is ${wuXingLabel[b.element]} (${wuXingHanzi[b.element]}). ${wuXingHanzi[rel.source as WuXing]} generates ${wuXingHanzi[rel.target as WuXing]}: in the generating cycle, ${wuXingLabel[rel.source as WuXing].toLowerCase()} feeds ${wuXingLabel[rel.target as WuXing].toLowerCase()}, and the relationship has a natural flow of support running in one direction.`,
        `The direction matters more than the label. ${source.name} is the giving side here — its instinct is to supply, to make room, to put resources into ${target.name}. ${target.name} is the receiving side, and the classical caution is that the receiving side stops noticing. A generating relationship is warm, and it can run the giver down over years without anyone behaving badly.`,
        `The practical translation: ${source.name} needs to be able to say "I am running low" before it is empty, and ${target.name} needs to hear that as information rather than as an accusation. In a 相生 pairing, the whole risk sits in that one exchange.`,
      ],
      strength:
        'Natural nourishment. Support flows without negotiation, and the relationship usually feels generous in both directions even though the mechanism is one-way.',
      friction:
        'Silent depletion on the giving side, and unconscious entitlement on the receiving side. Neither is malicious, which is why it goes uncorrected.',
      advice:
        'Rotate the giving. Let the receiving partner carry a domain where they are unambiguously the one supplying — it resets the flow and makes the imbalance visible before it becomes a grievance.',
    };
  }

  if (rel.kind === 'same') {
    return {
      heading: `五行: ${wuXingHanzi[a.element]}${wuXingHanzi[b.element]}同气`,
      paragraphs: [
        `${A} and ${B} are both ${wuXingLabel[a.element]} (${wuXingHanzi[a.element]}) by birth year. Same substance, no generating and no controlling between you — which in the five-element model reads as instant comprehension and zero natural correction.`,
        `Two people of the same element understand each other's defaults without explanation. ${A} ${a.impulse}; ${B} ${b.impulse}. The tone is right from the first conversation. The difficulty is that an element does not balance itself: whatever ${wuXingLabel[a.element].toLowerCase()} overdoes, both of you overdo, and neither is positioned to notice.`,
        `Classical practice treats this as a competent pairing that needs an outside element to stay honest. Practically, that means at least one person in your shared life whose instinct is genuinely different, and who is allowed to say so.`,
      ],
      strength:
        'Immediate fluency. Very little has to be explained, and the relationship has a shared vocabulary from day one.',
      friction:
        'Amplification without correction. The same strength gets reinforced until it becomes the only move either of you has.',
      advice:
        'Name the element’s failure mode out loud, early, and agree on what it looks like when it is happening. Two ${wuXingLabel[a.element].toLowerCase()} people who can both recognise the pattern can interrupt it; one who can and one who cannot will not.',
    };
  }

  return {
    heading: `五行: ${wuXingHanzi[rel.source as WuXing]}克${wuXingHanzi[rel.target as WuXing]}`,
    paragraphs: [
      `${A} is ${wuXingLabel[a.element]} (${wuXingHanzi[a.element]}) and ${B} is ${wuXingLabel[b.element]} (${wuXingHanzi[b.element]}). ${wuXingHanzi[rel.source as WuXing]} controls ${wuXingHanzi[rel.target as WuXing]} — the 克 relation, which is the most misunderstood line in the whole system.`,
      `克 does not mean "one destroys the other". It means one has a natural authority over the other's domain: ${wuXingLabel[rel.source as WuXing].toLowerCase()} sets the terms that ${wuXingLabel[rel.target as WuXing].toLowerCase()} has to work within. In a relationship this shows up as an asymmetry of permission — one of you feels entitled to overrule the other on a specific category of decision, and both of you may accept that as normal long past the point where it is.`,
      `The direction here is ${rel.source === a.element ? A : B} over ${rel.source === a.element ? B : A}. Naming that out loud is most of the work. A 克 pairing that can discuss the asymmetry is often stronger than a comfortable one, because the power question gets settled instead of accumulating.`,
    ],
    strength:
      'Effective division of authority. When the asymmetry is acknowledged, 克 pairs make decisions fast and rarely duplicate each other.',
    friction:
      'Unspoken hierarchy. The controlling side stops asking; the controlled side stops raising. By the time it surfaces it has years of precedent behind it.',
    advice:
      'Give the controlled side one domain of real sovereignty and do not revisit it. 克 pairs do not need equality in everything — they need at least one place where the hierarchy is inverted and respected.',
  };
}

/* ------------------------------------------------------------------ */
/* 正文拼装                                                             */
/* ------------------------------------------------------------------ */

function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function scenario(a: ChineseZodiacProfile, b: ChineseZodiacProfile): string {
  const options = [
    `Money is where it surfaces first. ${a.name} treats spending as a way of creating room to move. ${b.name} treats it as evidence about the future. The amount is almost never the subject.`,
    `A holiday makes the difference concrete. ${a.name} books the flight and decides the rest on arrival. ${b.name} wants the days accounted for before the money leaves the account.`,
    `Meeting each other's families is the test. ${a.name} is reading the room. ${b.name} is reading the rules of the room. Both of you leave with a different account of how it went.`,
    `A bad week reveals the reflex. ${a.name} deals with it by doing something. ${b.name} deals with it by going quiet. Each method looks, from the outside, like not caring.`,
    `The recurring argument is about who decides. ${a.name} needs it settled to relax. ${b.name} needs to think to settle it. Early feels premature to one and considerate to the other.`,
  ];
  return options[hash(a.slug + b.slug) % options.length];
}

export function buildChineseCompatibilityPage(
  a: ChineseZodiacProfile,
  b: ChineseZodiacProfile,
): ChineseCompatibilityPage {
  const isSelf = a.slug === b.slug;
  const relation = classifyRelation(a, b);
  const score = scoreChinesePair(a, b, relation);
  const relText = relationText(a, b, relation);
  const elText = elementSection(a, b);
  const slug = chinesePairSlug(a.slug, b.slug);
  const A = a.name;
  const B = b.name;

  const sections: ChineseSection[] = [];

  sections.push({
    id: 'overview',
    heading: isSelf
      ? `${A} and ${A}: doubled nature, scored ${score.overall}`
      : `${A} and ${B}: ${relation.label}, scored ${score.overall}`,
    paragraphs: isSelf
      ? [
          `A same-animal pairing is not automatically easy and not automatically difficult. ${A} with ${A} means the same branch, the same element and the same polarity repeated — every instinct doubled, and no built-in counterweight.`,
          `The classical label for this is ${relation.hanzi}. ${relation.label}. ${score.bandNote}`,
          `The score of ${score.overall} out of 100 comes from three layers: the branch relation (${relation.hanzi}), the five-element interaction between the two birth years (${score.elementNote}) and the yin-yang pairing (${a.polarity === b.polarity ? 'both same polarity' : 'one yin, one yang'}).`,
        ]
      : [
          `${A} and ${B} are a ${relation.hanzi} pairing — ${relation.label.toLowerCase()} — with birth elements of ${wuXingLabel[a.element]} and ${wuXingLabel[b.element]}. That combination scores ${score.overall} out of 100 on this site's model.`,
          `${A} ${a.impulse}. ${B} ${b.impulse}. Everything that works in this relationship and everything that costs comes out of that difference in instinct, filtered through the branch relation between ${a.branch} and ${b.branch}.`,
          `The score is built from three layers, and it is worth knowing which one is doing the work: branch relation ${relation.hanzi} (the largest single factor), five-element interaction — ${score.elementNote} — and the yin-yang pairing, which here is ${a.polarity === b.polarity ? `both ${a.polarity}` : 'one yin and one yang'}.`,
        ],
  });

  sections.push({
    id: 'branches',
    heading: relText.heading,
    paragraphs: [
      ...relText.paragraphs,
      isSelf
        ? `For orientation: ${A} sits opposite ${a.clash} in the branch wheel, so a ${A}–${a.clash} pairing is the structural opposite of this one, and ${A} combines most easily with ${a.secretFriend} (六合) and with ${a.trineMates.join(' and ')} (三合). Those are the reference points the classical tables are built from, and knowing them makes this page readable rather than mystical.`
        : `For orientation: ${A} clashes with ${a.clash} and combines most easily with ${a.secretFriend} (六合) and ${a.trineMates.join(' / ')} (三合); ${B} clashes with ${b.clash} and combines most easily with ${b.secretFriend} and ${b.trineMates.join(' / ')}. Placing ${A} and ${B} against those reference points is how the classical tables arrive at ${relation.hanzi} for this pair — the label is a consequence, not an opinion.`,
    ],
    bullets: [`Where it is strong: ${relText.strength}`, `Where it costs: ${relText.friction}`],
  });

  sections.push({
    id: 'elements',
    heading: elText.heading,
    paragraphs: elText.paragraphs,
    bullets: [
      `${A}: ${wuXingLabel[a.element]} ${wuXingHanzi[a.element]} · ${a.branch} · ${a.polarity} · born ${a.years.slice(-3).join(' / ')}`,
      `${B}: ${wuXingLabel[b.element]} ${wuXingHanzi[b.element]} · ${b.branch} · ${b.polarity} · born ${b.years.slice(-3).join(' / ')}`,
    ],
  });

  sections.push({
    id: 'love',
    heading: isSelf ? 'Love, intimacy and the mirrored need' : 'Love and intimacy',
    paragraphs: isSelf
      ? [
          `${A} shows love through ${a.loveStyle}. Paired with the same instinct, that expression is understood without translation — a real advantage, and one most couples spend years trying to reach.`,
          `The catch is that a need met automatically stops being noticed. ${A} needs ${a.need}. When both partners need the same thing from the same direction, neither is supplying it from a surplus, and neither notices the shortage until something breaks.`,
          `${A} feels loved when ${a.feelsLoved}. In this pairing that is the default rather than the effort, so the work is not generosity — it is variety. Doing the thing that is not your instinct is what keeps a same-animal relationship from becoming a mirror.`,
        ]
      : [
          `${A} gives affection through ${a.loveStyle}. ${B} gives it through ${b.loveStyle}. These are different currencies, and the standard mistake in this pairing is deciding the other person is not trying when in fact they are paying in a denomination you have not learned to read.`,
          `${A} needs ${a.need}. ${B} needs ${b.need}. Both are legitimate, neither is negotiable, and the relationship works to exactly the degree that both get met without one being permanently deferred.`,
          `${A} feels loved when ${a.feelsLoved}. ${B} feels loved when ${b.feelsLoved}. If you remember one thing from this page, make it those two sentences — they are the operating manual, and they are never the same sentence twice.`,
        ],
  });

  sections.push({
    id: 'conflict',
    heading: 'Communication and conflict',
    paragraphs: isSelf
      ? [
          `${A} speaks in ${a.commStyle}. Two people speaking that way move information fast and nuance slowly. Under pressure ${A} ${a.conflictMove} — and with no different reflex in the room, the pattern repeats at double volume.`,
          `Same-animal conflict is unusually clean and unusually hard to end. Clean, because both of you understand what is meant. Hard, because you both make the same move at the same moment, and the move is not de-escalation.`,
          `${A} hates ${a.avoid}. From a partner with identical instincts, that wound lands more accurately than any other animal could manage, usually with no intent behind it.`,
        ]
      : [
          `${A} speaks in ${a.commStyle}. ${B} speaks in ${b.commStyle}. When things are good this is interesting; when things are hard, the same difference is why the two of you can argue about one thing for years without either person feeling heard.`,
          `Under pressure ${A} ${a.conflictMove}. ${B} ${b.conflictMove}. Neither response is manipulation — both are protective reflexes. But they are incompatible reflexes, and left alone they form a loop neither of you chose.`,
          `${A} hates ${a.avoid}. ${B} hates ${b.avoid}. Read those two lines against the paragraph above and you will recognise most of the arguments you have already had.`,
        ],
  });

  sections.push({
    id: 'breakdown',
    heading: 'Where it breaks',
    paragraphs: [
      relText.friction,
      isSelf
        ? 'The failure mode here is not dramatic. It is a slow consensus: two people agreeing, over years, that the way they already do things is the way things are. Nothing is ever decided against, so nothing is ever revisited.'
        : `The specific failure is cumulative rather than dramatic. A small mismatch gets tolerated, then normalised, then defended, and by the time it is raised the conversation is no longer about the original thing. With ${A} and ${B}, the mismatch is visible from the first month and simply goes unaddressed because neither of you wants to be the one who names it.`,
      scenario(a, b),
    ],
  });

  sections.push({
    id: 'lasting',
    heading: 'What makes it last',
    paragraphs: [
      relText.advice,
      elText.friction,
      `The rest is unglamorous and it works: say the appreciation out loud when it occurs, keep one domain where each of you is unambiguously in charge, and treat the recurring argument as a shared problem rather than a scoreboard. ${A} and ${B} do not need to become more alike. They need a division of labour that uses the difference instead of renegotiating it every week.`,
    ],
    bullets: isSelf
      ? [
          'Import a difference deliberately — a third perspective, a separate friend group, a practice that is not shared.',
          'State needs explicitly. A mirror will not notice the gap for you.',
        ]
      : [
          `Give ${A} a domain where its instinct is an asset rather than a problem.`,
          `Give ${B} the same, and never trade the two domains as leverage.`,
          'Agree in advance on what the recurring fight is actually about, so it can be recognised while it is happening.',
        ],
  });

  const faqs: ChineseFaq[] = [
    {
      q: isSelf
        ? `Is ${A} with ${A} a good match in Chinese astrology?`
        : `Are ${A} and ${B} compatible in Chinese astrology?`,
      a: isSelf
        ? `The pairing is ${relation.hanzi} (${relation.label.toLowerCase()}) and scores ${score.overall}/100 here: full recognition, no corrective. ${a.selfPunish ? `${a.branch} is also a self-punishing branch, which adds 自刑 — the animal's excess turned inward.` : 'It is not a self-punishing branch, so the risk is comfort rather than conflict.'} It works when both partners deliberately import a perspective neither of them supplies naturally.`
        : `They form a ${relation.hanzi} pairing (${relation.label.toLowerCase()}) and score ${score.overall}/100: ${relation.hanzi} contributes the largest share, then the five-element relation (${wuXingLabel[a.element]} and ${wuXingLabel[b.element]} — ${score.elementKind === 'generating' ? 'one generates the other' : score.elementKind === 'controlling' ? 'one controls the other' : 'the same element doubled'}), then the yin-yang pairing. The score describes the starting conditions, not the outcome.`,
    },
    {
      q: `What does ${relation.hanzi} mean for ${A} and ${B}?`,
      a:
        relation.kind === 'secret-friend'
          ? `${a.branch}${b.branch} is one of the six 六合 pairs and combines into ${wuXingLabel[relation.combinesInto as WuXing]}. In classical practice it is the friendliest branch relationship available: the two animals orient toward each other rather than past each other, and repair after conflict is quick.`
          : relation.kind === 'trine'
            ? `Both belong to the ${trineLabel[a.trine].hanzi} (${trineLabel[a.trine].element} trine: ${trineLabel[a.trine].members}). 三合 is a structural alliance — the same elemental phase pulling in the same direction — rather than a romantic bond.`
            : relation.kind === 'clash'
              ? `${a.branch} and ${b.branch} sit directly opposite each other in the twelve branches, which is 六冲. It does not mean the relationship is doomed; it means the two of you occupy opposite tempos and need 通关 — a deliberate bridge — to stop renegotiating the same thing forever.`
              : relation.kind === 'harm'
                ? `${a.branch}${b.branch} is one of the six 六害 pairs. 害 is a slow, quiet cost rather than an open conflict: one person's ordinary behaviour consistently takes something from the other. It responds well to being named, which is why it is worth knowing.`
                : relation.kind === 'self'
                  ? `Same branch — 同气, the same qi repeated. There is no 合 and no 冲, only doubling. ${a.selfPunish ? `${a.branch} is a self-punishing branch, so 自刑 applies on top.` : 'It is not a self-punishing branch.'}`
                  : `${a.branch} and ${b.branch} hold no 合, 冲 or 害 between them. The animal layer neither helps nor hinders, so the pairing is decided by the five-element relation and by what the two of you do with it.`,
    },
    {
      q: `Does the birth year element change the reading?`,
      a: `Yes, and this page already accounts for it. ${A} is ${wuXingLabel[a.element]} and ${B} is ${wuXingLabel[b.element]} by 本命五行, the element of the birth-year branch. ${score.elementNote} Two people with the same animal sign but different heavenly stems can therefore have genuinely different relationships — a Wood Dragon and a Fire Dragon are both Dragons, and they are not the same partner.`,
    },
    {
      q: 'What is the best way to work with a difficult pairing?',
      a: `${relText.advice} Beyond that, the two non-negotiables are stated needs — ${A} needs ${a.need}, ${B} needs ${b.need} — and a shared rule that the recurring argument is a problem you are both against, not a position you are both defending.`,
    },
    {
      q: isSelf
        ? `Does this apply to every ${A}–${A} couple, whatever the birth year?`
        : `Does this apply to every ${A}–${B} couple, whatever the birth year?`,
      a: `The branch relation does, but the reading is not uniform. The birth-year branch fixes the animal and the 本命五行, while the heavenly stem above it varies — a Wood ${A} and a Fire ${A} are both ${A} and are not the same partner. ${isSelf ? `Self-pairing is fixed at the branch level; the 自刑 question depends only on which branch it is.` : `Here ${A} is ${wuXingLabel[a.element]} and ${B} is ${wuXingLabel[b.element]}, which is why this page scores ${score.overall} rather than the flat figure a sun-sign-style table would give every ${A}–${B} couple.`} For the individual reading, the full Four Pillars are what matter — the animal layer is the first filter, not the verdict.`,
    },
  ];

  const related = chineseZodiacProfiles
    .filter((z) => z.slug !== b.slug)
    .map((z) => ({
      slug: chinesePairSlug(a.slug, z.slug),
      label: `${A} + ${z.name}`,
      overall: scoreChinesePair(a, z).overall,
    }))
    .sort((x, y) => y.overall - x.overall)
    .slice(0, 6);

  const wordCount = sections.reduce(
    (n, s) =>
      n +
      s.paragraphs.join(' ').split(/\s+/).filter(Boolean).length +
      (s.bullets ? s.bullets.join(' ').split(/\s+/).filter(Boolean).length : 0),
    faqs.reduce((n, f) => n + f.a.split(/\s+/).filter(Boolean).length, 0),
  );

  return {
    slug,
    a,
    b,
    isSelf,
    relation,
    score,
    h1: isSelf
      ? `${A} and ${A} Chinese Zodiac Compatibility: ${score.overall}/100`
      : `${A} and ${B} Chinese Zodiac Compatibility: ${score.overall}/100`,
    title: isSelf
      ? `${A} and ${A} Chinese Zodiac Compatibility — ${relation.hanzi} Reading`
      : `${A} and ${B} Chinese Zodiac Compatibility — ${relation.hanzi} (${relation.label})`,
    description: isSelf
      ? `A detailed ${A}–${A} same-animal compatibility reading: ${relation.hanzi}, the ${wuXingLabel[a.element]} element doubled, love, conflict and the specific risk of dating your own sign. Scored ${score.overall}/100.`
      : `How ${A} and ${B} fit together in the Chinese zodiac: ${relation.hanzi} (${relation.label.toLowerCase()}), ${wuXingLabel[a.element]} and ${wuXingLabel[b.element]} interaction, love, conflict and what makes it last. Scored ${score.overall}/100.`,
    sections,
    faqs,
    related,
    wordCount,
  };
}

export function getChineseCompatibilityPage(
  aSlug: string,
  bSlug: string,
): ChineseCompatibilityPage | null {
  const a = chineseZodiacBySlug.get(aSlug);
  const b = chineseZodiacBySlug.get(bSlug);
  if (!a || !b) return null;
  return buildChineseCompatibilityPage(a, b);
}
