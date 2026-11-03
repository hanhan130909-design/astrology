/**
 * 合盘内容引擎
 *
 * 设计原则：
 * 1. 打分来自可解释的占星规则（元素、模式、极性、守护星），不是随机数；
 * 2. 正文由 12 份星座档案的字段组合而成，同一组关系只生成一个规范页
 *    （A-B 与 B-A 指向同一 URL），彻底消除反向重复；
 * 3. 每个配对至少 1200 英文词，覆盖元素化学、节奏、亲密、沟通冲突、
 *    破裂点、长期经营与三个 FAQ —— 取代原来 47 词的空壳页。
 */
import {
  elementLabel,
  elementQuality,
  modalityLabel,
  polarityLabel,
  type Element,
  type Modality,
  type ZodiacProfile,
  zodiacBySlug,
  zodiacProfiles,
} from '@/content/zodiacProfiles';

export interface CompatibilityScore {
  overall: number;
  element: number;
  modality: number;
  polarity: number;
  ruler: number;
  band: string;
  bandNote: string;
}

export interface CompatibilitySection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CompatibilityFaq {
  q: string;
  a: string;
}

export interface CompatibilityPage {
  slug: string;
  a: ZodiacProfile;
  b: ZodiacProfile;
  isSelf: boolean;
  h1: string;
  title: string;
  description: string;
  score: CompatibilityScore;
  sections: CompatibilitySection[];
  faqs: CompatibilityFaq[];
  related: Array<{ slug: string; label: string; overall: number }>;
  wordCount: number;
}

const ELEMENT_SCORE: Record<string, number> = {
  'fire|fire': 40,
  'earth|earth': 40,
  'air|air': 40,
  'water|water': 40,
  'air|fire': 34,
  'earth|water': 34,
  'earth|fire': 20,
  'air|water': 20,
  'fire|water': 14,
  'air|earth': 14,
};

const MODALITY_SCORE: Record<string, number> = {
  'cardinal|cardinal': 25,
  'fixed|fixed': 25,
  'mutable|mutable': 25,
  'cardinal|mutable': 20,
  'fixed|mutable': 16,
  'cardinal|fixed': 14,
};

const key = (...parts: string[]) => [...parts].sort().join('|');

export function scorePair(a: ZodiacProfile, b: ZodiacProfile): CompatibilityScore {
  const element = ELEMENT_SCORE[key(a.element, b.element)] ?? 20;
  const modality = MODALITY_SCORE[key(a.modality, b.modality)] ?? 16;
  const polarity = a.polarity === b.polarity ? 20 : 15;
  const ruler =
    a.ruler === b.ruler ? 5 : a.traditionalRuler === b.traditionalRuler ? 3 : 0;

  const raw = element + modality + polarity + ruler;
  const overall = Math.round(52 + ((raw - 43) / 47) * 44);

  const { band, bandNote } = bandFor(overall);
  return { overall, element, modality, polarity, ruler, band, bandNote };
}

function bandFor(overall: number): { band: string; bandNote: string } {
  if (overall >= 85) {
    return {
      band: 'Rare ease',
      bandNote:
        'One of the combinations that very little has to be negotiated about at the level of basic disposition.',
    };
  }
  if (overall >= 78) {
    return {
      band: 'Strong natural fit',
      bandNote:
        'The fundamentals line up. Most of the work here is maintenance rather than translation.',
    };
  }
  if (overall >= 70) {
    return {
      band: 'Easy start, real work later',
      bandNote:
        'Attraction arrives quickly and the differences surface once the relationship stops being new.',
    };
  }
  if (overall >= 62) {
    return {
      band: 'Workable with intention',
      bandNote:
        'Nothing is broken, but almost nothing is automatic either. This pairing rewards deliberate effort.',
    };
  }
  return {
    band: 'High friction, high growth',
    bandNote:
      'A demanding match. These two teach each other a great deal, and the lessons do not arrive gently.',
  };
}

/* ------------------------------------------------------------------ */
/* 元素化学：10 种组合各自独立叙述                                       */
/* ------------------------------------------------------------------ */

interface ElementPairText {
  headline: string;
  narrative: string[];
  strength: string;
  friction: string;
  advice: string;
}

function elementPairText(a: ZodiacProfile, b: ZodiacProfile): ElementPairText {
  const el = key(a.element, b.element);
  const A = a.name;
  const B = b.name;

  const table: Record<string, ElementPairText> = {
    'fire|fire': {
      headline: 'Two fires: double the heat, half the brakes',
      narrative: [
        `Fire feeds fire. ${A} and ${B} share the same raw material — ${elementQuality.fire} — so neither of you has to explain why a feeling deserves to be acted on. ${A} ${a.impulse}; ${B} ${b.impulse}. The recognition is instant, and so is the competition.`,
        'What makes a double-fire pairing unusually alive is the absence of a built-in dampener. There is no water sign in this pairing to say "let us sit with that for a day," and no earth sign to ask what it will cost. Decisions get made at the speed of whoever is more certain, which means the relationship moves quickly and sometimes in a direction nobody chose on purpose.',
      ],
      strength:
        'Momentum. When the two of you are pointed at the same thing, very little external friction can slow you down. This pairing tends to produce visible, energetic results.',
      friction:
        'Neither of you is naturally the one who de-escalates. The argument that begins over something small can escalate because both of you are willing to keep going, and nobody has the instinct to lower the temperature.',
      advice:
        'Give one of you formal authority over pacing — not over decisions, over rhythm. A shared rule like "the bigger conversation happens the next morning" gives this pairing the pause neither of you will invent spontaneously.',
    },
    'earth|earth': {
      headline: 'Two earths: a shared reality, slowly built',
      narrative: [
        `Earth and earth understand each other's currency: ${elementQuality.earth}. ${A} ${a.impulse}; ${B} ${b.impulse}. Nothing in this pairing needs to be translated, which is rarer and more valuable than it sounds.`,
        'The risk with a double-earth pairing is not conflict — it is inertia. Both of you are inclined to defend an arrangement because it works, even when it has stopped working. Shared stability can quietly become a shared refusal to examine anything, and by the time either of you notices, the routine is load-bearing.',
      ],
      strength:
        'Durability. This is one of the few combinations that can hold a difficult decade without the relationship changing shape. Trust is built in increments and it holds.',
      friction:
        'Both of you avoid the argument, so the disagreement goes underground and reappears later as distance rather than as a topic. Resentment accumulates in silence because neither party wants to disturb the surface.',
      advice:
        'Schedule the uncomfortable conversation rather than waiting to feel ready. Put it on a calendar the way you would put a repair on a calendar, and treat it as maintenance, not as conflict.',
    },
    'air|air': {
      headline: 'Two airs: a conversation that keeps finding new rooms',
      narrative: [
        `Air meets air in ${elementQuality.air}. ${A} ${a.impulse}; ${B} ${b.impulse}. The two of you will talk more in a month than some couples do in a year, and much of it will be genuinely interesting.`,
        'The characteristic vulnerability of a double-air pairing is that the emotional layer can be handled entirely through discussion. Talking about a feeling is not the same as feeling it, and both of you are fluent enough to substitute one for the other without noticing. The relationship can be extremely articulate and still be slightly under-loved.',
      ],
      strength:
        'Fascination. You keep each other mentally awake, which is a real form of long-term compatibility and one that many more "compatible" pairs lack entirely.',
      friction:
        'Avoidance by intellectualising. A real hurt gets analysed, contextualised, joked about and never actually felt, so it returns wearing a different costume.',
      advice:
        'Build in at least one channel that is not verbal. Cooking, walking, shared exercise — some recurring activity where you are together without a conversation doing the emotional work for you.',
    },
    'water|water': {
      headline: 'Two waters: depth without a shoreline',
      narrative: [
        `Water and water move in ${elementQuality.water}. ${A} ${a.impulse}; ${B} ${b.impulse}. The empathy in this pairing is not effortful — it is atmospheric. Each of you reads the other before the other has decided what they feel.`,
        `That same permeability is the danger. Two water signs can amplify each other's mood to the point where it becomes impossible to tell whose anxiety is in the room. Because neither of you is inclined to draw a hard line, the relationship can absorb an enormous amount of feeling without anyone setting a limit on it.`,
      ],
      strength:
        'Emotional accuracy. You will rarely have to explain yourself twice, and being understood without explanation is the thing this pairing does better than any other.',
      friction:
        'Merging. Boundaries weaken, individual friendships thin out, and a bad day can become a bad week for two people at once.',
      advice:
        'Keep at least one part of your life that is not shared and not reported on. A separate practice, a separate friend, a separate project — the boundary protects the intimacy rather than competing with it.',
    },
    'air|fire': {
      headline: 'Fire and air: the combination that makes itself bigger',
      narrative: [
        `This is the classic feed pairing. Air gives fire oxygen; fire gives air something to move. ${A} ${a.impulse}; ${B} ${b.impulse}. Between ${elementQuality.fire} and ${elementQuality.air} there is very little drag, which is why the relationship tends to escalate quickly in the good sense.`,
        'The air partner supplies language for what the fire partner is already doing, and the fire partner supplies momentum for what the air partner has only been theorising about. Each one makes the other more fully themselves, which is the actual definition of chemistry rather than a marketing version of it.',
      ],
      strength:
        'Energising each other. Ideas become plans in this pairing, and plans become things that happened. It is an unusually generative combination.',
      friction:
        'Nothing here is grounded. Logistics, money, the boring middle of a shared life — the details that earth signs handle by instinct can be skipped entirely by a fire-air pair until they become a crisis.',
      advice:
        'Assign the boring parts deliberately and out loud. One of you owns the calendar, the other owns the money, and you review both monthly. Do not assume enthusiasm will cover it.',
    },
    'earth|water': {
      headline: 'Earth and water: the pairing that actually holds',
      narrative: [
        `Earth gives water a bed to run in; water gives earth something to grow. ${A} ${a.impulse}; ${B} ${b.impulse}. This is one of the most quietly durable combinations in the zodiac, and it rarely looks dramatic from the outside.`,
        `The water partner provides emotional texture to a life that the earth partner is building the container for. Where earth can become arid and procedural, water softens it; where water can become formless and overwhelmed, earth gives it a shape and a schedule. Neither is doing the other a favour — each is supplying what the other genuinely lacks.`,
      ],
      strength:
        'Real security. This pairing produces a home, a routine, and a sense that the relationship can absorb bad news. That is rarer than passion and it lasts longer.',
      friction:
        'Earth can read water\'s emotional weather as a problem to be solved, and water can read earth\'s practicality as a refusal to care. Both readings are wrong and both are sincerely meant.',
      advice:
        'Separate "I am upset" from "fix this". The water partner should say which one it is; the earth partner should ask before reaching for a solution.',
    },
    'earth|fire': {
      headline: 'Fire and earth: speed against staying power',
      narrative: [
        `Fire and earth are the two elements least inclined to grant the other's premise. ${A} ${a.impulse}; ${B} ${b.impulse}. Fire experiences earth as obstruction; earth experiences fire as expense. Both are describing the same difference.`,
        'This pairing does not lack attraction — the square relationship between fire and earth is famously magnetic. What it lacks is a shared tempo. One of you wants to decide and move; the other wants to verify and then move. Neither is wrong, and the argument about it is nearly always an argument about timing wearing a costume.',
      ],
      strength:
        'Mutual correction. Fire gets a reality check that saves it from expensive mistakes; earth gets pulled out of a rut it did not notice it was in. Over years, this is genuinely valuable.',
      friction:
        'Contempt. If the fire partner decides the earth partner is boring, or the earth partner decides the fire partner is reckless, the pairing loses the respect it needs faster than it loses affection.',
      advice:
        'Give the impulsive one a small budget of unilateral decisions and give the cautious one a veto that is used rarely. Explicit asymmetry works better here than a promise to compromise.',
    },
    'air|water': {
      headline: 'Air and water: meaning versus feeling',
      narrative: [
        `Air and water are the two elements that live most comfortably in the invisible, and they still manage to miss each other. ${A} ${a.impulse}; ${B} ${b.impulse}. Air wants to understand the feeling; water wants the feeling to be met.`,
        'The characteristic failure of this pairing is a mismatch of response. One of you offers an explanation where the other needed company. The offer is sincere, it is simply in the wrong currency, and after enough repetitions both parties conclude they are not being heard when in fact they are being answered in a language they do not use.',
      ],
      strength:
        'Sensitivity with perspective. Water supplies the emotional read, air supplies the ability to step back and see the pattern. Together you can understand a situation that neither would grasp alone.',
      friction:
        'Being analysed. Water experiences air\'s clarity as distance; air experiences water\'s intensity as fog. Under stress, each becomes more extremely itself.',
      advice:
        'Air should ask "do you want me to help you think about it, or just sit with you?" and then honour the answer. Water should say which one it needs before the disappointment sets in.',
    },
    'water|fire': {
      headline: 'Fire and water: steam, or a doused flame',
      narrative: [
        `Fire and water are the hardest pairing to keep in productive balance, because each one eliminates the other's element if it gets enough of it. ${A} ${a.impulse}; ${B} ${b.impulse}. The attraction is often immediate and the friction arrives very soon after.`,
        'Water feels more than fire can metabolise, and fire acts faster than water can prepare for. The relationship usually contains genuine passion and genuine exhaustion in roughly equal measure, and the ratio is decided by how well the two of you handle the moments when one of you is completely right and the other is completely unable to hear it.',
      ],
      strength:
        'Transformation. This pairing changes people. Fire gives water the courage to act; water gives fire the depth to understand what it is acting on. Very few combinations produce this much personal movement.',
      friction:
        'Escalation and withdrawal in a loop. Fire pushes, water floods or disappears, fire reads the withdrawal as abandonment and pushes harder.',
      advice:
        'Agree on a hard stop before the argument reaches the point of no return. One phrase, respected by both, that ends the exchange for two hours. The phrase has to be agreed on in a good mood, not a bad one.',
    },
    'air|earth': {
      headline: 'Air and earth: the idea against the invoice',
      narrative: [
        `Air and earth square each other. ${A} ${a.impulse}; ${B} ${b.impulse}. One of you is oriented toward possibility, the other toward what already exists and has to be maintained.`,
        'This pairing frequently contains real respect and real frustration at the same time. The air partner brings perspective, humour and options; the earth partner brings follow-through, and each privately suspects the other could not function without them. That suspicion is usually correct and it is corrosive when it goes unspoken.',
      ],
      strength:
        'Complementary competence. Between the two of you, things get thought through and then actually done. Many partnerships have one or the other; this one has both, if the division of labour is respected.',
      friction:
        'Being managed. Air feels earth is limiting it; earth feels air is leaving the work to be picked up. The argument about the specific task is almost never about the task.',
      advice:
        'Name the contribution out loud at the moment it happens. This pairing survives on acknowledged usefulness more than on expressed affection.',
    },
  };

  return table[el] ?? table['air|earth'];
}

/* ------------------------------------------------------------------ */
/* 模式节奏：6 种组合                                                   */
/* ------------------------------------------------------------------ */

function modalityPairText(a: ZodiacProfile, b: ZodiacProfile): ElementPairText {
  const md = key(a.modality, b.modality);
  const A = a.name;
  const B = b.name;
  // 混合模式：slug 排序后 A 不一定是 cardinal/fixed 方，必须按实际对象推导
  const C = a.modality === 'cardinal' ? a : b;
  const F = C === a ? b : a;
  const M = a.modality === 'mutable' ? a : b;
  const X = a.modality === 'fixed' ? a : b;

  const table: Record<string, ElementPairText> = {
    'cardinal|cardinal': {
      headline: 'Two cardinals: two people who both start things',
      narrative: [
        `Both ${A} and ${B} are cardinal signs, which means both of you initiate by default. ${A} ${a.impulse}; ${B} ${b.impulse}. In the first months this reads as compatibility, because nothing stalls.`,
        'The structural problem is authorship. A cardinal sign does not enjoy being carried along in someone else\'s plan, and a pairing of two cardinals means one of you is almost always in that position. The disagreements are rarely about the destination — they are about who decided.',
      ],
      strength:
        'Nothing is ever stuck. Two cardinals generate more forward motion than almost any other combination.',
      friction:
        'Territory. Small decisions become status questions, and a discussion about dinner can carry an unreasonable amount of weight.',
      advice:
        'Split domains and let each of you be genuinely sovereign inside yours. Alternating control per decision does not work for two cardinals; clear ownership does.',
    },
    'fixed|fixed': {
      headline: 'Two fixed signs: two immovable objects',
      narrative: [
        `Both ${A} and ${B} are fixed signs. ${A} ${a.impulse}; ${B} ${b.impulse}. Fixed energy is loyal, consistent and extremely difficult to redirect, and there are two of them in this relationship.`,
        'A double-fixed pairing is often very stable and occasionally completely stuck. Neither of you changes position to keep the peace, which means the peace is preserved by not raising things rather than by resolving them. The relationship can carry an unmentioned disagreement for years.',
      ],
      strength:
        'Commitment. Fixed signs do not leave easily, and there is a great deal of security in that.',
      friction:
        'Deadlock that nobody names. The issue is not the argument — it is that the argument never happens.',
      advice:
        'Use a third party or a written format for the big disagreements. Two fixed signs do better with structure than with spontaneity, and putting it in writing removes the performance element.',
    },
    'mutable|mutable': {
      headline: 'Two mutable signs: infinite flexibility, no fixed point',
      narrative: [
        `Both ${A} and ${B} are mutable signs, which makes this pairing unusually adaptable and unusually hard to pin down. ${A} ${a.impulse}; ${B} ${b.impulse}.`,
        'The strength is real: two mutable signs can survive relocation, career change and crisis with less friction than most. The weakness is equally real — nobody in this relationship is the anchor. Plans change, positions shift, and the thing you agreed on in March is quietly different by June without anyone having decided to change it.',
      ],
      strength:
        'Adaptability. This pairing bends instead of breaking, and it handles change better than most combinations.',
      friction:
        'Nothing holds. Commitments soften, boundaries drift, and the relationship can lack a shape both people recognise.',
      advice:
        'Write things down and review them. Two mutable signs need external structure — a shared calendar, a monthly conversation about the direction of the relationship — precisely because neither will impose it.',
    },
    'cardinal|mutable': {
      headline: 'Cardinal and mutable: a direction and a detour',
      narrative: [
        `${C.name} is cardinal and ${M.name} is mutable. ${C.name} ${C.impulse}; ${M.name} ${M.impulse}. One of you sets direction by instinct; the other adjusts by instinct.`,
        'In practice this works better than the scores suggest, because the roles do not compete. The cardinal partner supplies an axis and the mutable partner supplies flexibility around it. The risk is imbalance of another kind: the mutable partner can adapt so consistently that its own preferences never enter the record, and that accumulates into a quiet kind of resentment.',
      ],
      strength:
        'Direction plus adjustment. This pairing can hold a plan and still improvise when the plan meets reality.',
      friction:
        'The adaptable one disappears. Preferences get absorbed rather than stated, and the cardinal partner may genuinely not know what the other wants.',
      advice:
        'The mutable partner should state a preference at least once a day, even about something trivial. The cardinal partner should ask and then wait for the real answer rather than the convenient one.',
    },
    'cardinal|fixed': {
      headline: 'Cardinal and fixed: the starter against the keeper',
      narrative: [
        `${C.name} is cardinal and ${F.name} is fixed. ${C.name} ${C.impulse}; ${F.name} ${F.impulse}. One of you is built to begin; the other is built to hold whatever has been begun.`,
        'These two roles are genuinely complementary, which is why this pairing can be extremely effective — and they collide on exactly one axis: change. The cardinal partner initiates change as a way of life. The fixed partner experiences uninvited change as a small act of vandalism. Most of the arguments here are about the timing and the ownership of a change, not about the change itself.',
      ],
      strength:
        'Start plus staying power. Something gets imagined, and then it gets kept. Very few combinations cover both halves that well.',
      friction:
        'The fixed partner wins the long game by outlasting. The cardinal partner proposes, the fixed partner declines to move, and the proposal quietly dies — which the cardinal partner experiences as being unheard rather than overruled.',
      advice:
        'The cardinal partner should propose changes as questions with a review date rather than as announcements. The fixed partner should answer within that window instead of letting the proposal expire on its own.',
    },
    'fixed|mutable': {
      headline: 'Fixed and mutable: the wall and the water',
      narrative: [
        `${X.name} is fixed and ${M.name} is mutable. ${X.name} ${X.impulse}; ${M.name} ${M.impulse}. One of you returns to the same position; the other keeps revising.`,
        'This is a pairing of genuine complementarity that frequently turns into a power imbalance. The fixed partner experiences the mutable partner as unreliable, and the mutable partner experiences the fixed partner as immovable. Each diagnosis is accurate from where it is standing, and neither is a character flaw.',
      ],
      strength:
        'Genuine balance when it works. One holds the line, the other finds the workaround. Together they are more effective than either alone.',
      friction:
        'The fixed partner wins by simply not moving. Over time, the mutable partner notices that persistence is the deciding factor and stops bothering to argue.',
      advice:
        'The fixed partner should move first on something small and visible, on purpose, and say why. It buys an enormous amount of goodwill and costs almost nothing.',
    },
  };

  return table[md] ?? table['cardinal|mutable'];
}

/* ------------------------------------------------------------------ */
/* 正文拼装                                                             */
/* ------------------------------------------------------------------ */

function polarNote(a: ZodiacProfile, b: ZodiacProfile): string {
  if (a.polarity === b.polarity) {
    return `Both ${a.name} and ${b.name} are ${polarityLabel[a.polarity].toLowerCase()} signs, so you approach decisions from a similar angle of attack. Agreement comes easily; so does the shared blind spot, because neither of you naturally occupies the opposite posture.`;
  }
  return `${a.name} is ${polarityLabel[a.polarity].toLowerCase()} and ${b.name} is ${polarityLabel[b.polarity].toLowerCase()}. Opposite polarity usually produces attraction before it produces understanding: each of you is doing something the other finds slightly mysterious and slightly enviable. That draw is real, and it is not by itself a foundation.`;
}

function rulerNote(a: ZodiacProfile, b: ZodiacProfile): string {
  if (a.ruler === b.ruler) {
    return `Both signs answer to ${a.ruler}, which is a stronger link than most compatibility write-ups account for. You share a ruling impulse, so your disagreements tend to be about execution rather than about values.`;
  }
  return `${a.name} is ruled by ${a.ruler} (traditionally ${a.traditionalRuler}) and ${b.name} by ${b.ruler} (traditionally ${b.traditionalRuler}). Read those two planets as the two things this relationship is actually trying to accomplish, and you will see the shape of most of your arguments.`;
}

function scenarioParagraph(a: ZodiacProfile, b: ZodiacProfile): string {
  const scenarios = [
    `A trip is the clearest test. ${a.name} books the flight and decides the rest on arrival. ${b.name} wants the days accounted for before the money leaves the account. Neither position is unreasonable, and the disagreement on day one sets the tone for the week.`,
    `Money is where the difference becomes concrete. ${a.name} treats spending as a way to create momentum. ${b.name} treats it as evidence about the future. The number is almost never the real subject.`,
    `Introducing each other to friends is revealing. ${a.name} conducts the evening. ${b.name} watches who is being left out of it. Both of you will leave with a different read on how it went, and both reads will be partly right.`,
    `A bad week shows the fault line. ${a.name} deals with it by doing something. ${b.name} deals with it by going inward. Each experience of the other's method looks, from the outside, like not caring.`,
    `The recurring argument is about how a decision gets made. ${a.name} needs it settled to relax. ${b.name} needs to think to settle it. Settling early feels premature to one and considerate to the other.`,
  ];
  const idx = hashCode(a.slug + b.slug) % scenarios.length;
  return scenarios[idx];
}

function hashCode(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** 规范化配对 slug：字母序，A-B 与 B-A 得到同一个 URL */
export function pairSlug(a: string, b: string): string {
  return [a, b].sort().join('-');
}

export function parsePairSlug(slug: string): [string, string] | null {
  const parts = slug.split('-');
  if (parts.length !== 2) return null;
  const [x, y] = parts;
  if (!zodiacBySlug.has(x) || !zodiacBySlug.has(y)) return null;
  if (x > y) return [y, x];
  return [x, y];
}

export const SELF_PAIR_ENABLED = true;

/** 66 组无序组合 + 12 组同座自配对 = 78 个规范页 */
export function allPairSlugs(): string[] {
  const out: string[] = [];
  for (let i = 0; i < zodiacProfiles.length; i += 1) {
    for (let j = i; j < zodiacProfiles.length; j += 1) {
      out.push(pairSlug(zodiacProfiles[i].slug, zodiacProfiles[j].slug));
    }
  }
  return out;
}

export function buildCompatibilityPage(a: ZodiacProfile, b: ZodiacProfile): CompatibilityPage {
  const isSelf = a.slug === b.slug;
  const score = scorePair(a, b);
  const el = elementPairText(a, b);
  const md = modalityPairText(a, b);
  const slug = pairSlug(a.slug, b.slug);

  const subject = isSelf ? `${a.name} and ${a.name}` : `${a.name} and ${b.name}`;

  const sections: CompatibilitySection[] = [];

  sections.push({
    id: 'overview',
    heading: isSelf
      ? `${a.name} with ${a.name}: what doubles, and what compounds`
      : `How ${a.name} and ${b.name} actually fit together`,
    paragraphs: isSelf
      ? [
          `A same-sign pairing is not a compatibility shortcut. ${a.name} with ${a.name} doubles every strength and every blind spot at once, and the result is a relationship with very high recognition and very low friction-reduction. You are not balancing each other. You are amplifying.`,
          `${a.name} ${a.impulse}. With a partner who works the same way, there is no one in the room to supply the missing move — no counterweight to the reflex, no second opinion that arrives from a genuinely different angle. What you get instead is speed and understanding, which are real advantages, and a shared failure mode, which is the cost.`,
          `The pairing scores ${score.overall} out of 100 on the elements-and-modality model used across this site: ${score.element}/40 for elemental chemistry, ${score.modality}/25 for rhythm, ${score.polarity}/20 for polarity and ${score.ruler}/5 for shared rulership. That places it in the "${score.band}" band. ${score.bandNote}`,
        ]
      : [
          `${a.name} and ${b.name} are a ${elementLabel[a.element].toLowerCase()}–${elementLabel[b.element].toLowerCase()} pairing with ${modalityLabel[a.modality].toLowerCase()} and ${modalityLabel[b.modality].toLowerCase()} modes. In plain terms: ${el.headline.toLowerCase()}.`,
          `${a.name} ${a.impulse}. ${b.name} ${b.impulse}. The gap between those two sentences is the entire relationship — everything that works here works because of it, and everything that hurts here hurts because of it.`,
          `This pairing scores ${score.overall} out of 100 on the model used across this site: ${score.element}/40 for elemental chemistry, ${score.modality}/25 for rhythm, ${score.polarity}/20 for polarity, and ${score.ruler}/5 for rulership overlap. That places it in the "${score.band}" band — ${score.bandNote.toLowerCase()}`,
        ],
  });

  sections.push({
    id: 'element',
    heading: `${elementLabel[a.element]} and ${elementLabel[b.element]}: the chemistry`,
    paragraphs: [el.narrative[0], el.narrative[1]],
    bullets: [`Where it is strong: ${el.strength}`, `Where it strains: ${el.friction}`],
  });

  sections.push({
    id: 'rhythm',
    heading: `${modalityLabel[a.modality]} and ${modalityLabel[b.modality]}: the rhythm of the thing`,
    paragraphs: [md.narrative[0], md.narrative[1], polarNote(a, b), rulerNote(a, b)],
  });

  sections.push({
    id: 'love',
    heading: isSelf ? 'Love, intimacy and what you both need' : 'Love and intimacy',
    paragraphs: isSelf
      ? [
          `${a.name} shows love through ${a.loveLanguage}. Paired with the same instinct, that expression is understood immediately and without translation, which is a genuine and underrated pleasure — very few couples get to skip the entire phase of learning each other's dialect.`,
          `The catch is that a need which is met automatically stops being noticed. ${a.name} needs ${a.need}. When both partners need the same thing, neither is in the position of supplying it from a surplus, and neither notices when it runs short until something breaks.`,
          `${a.name} feels loved when ${a.feelsLoved}. In this pairing that is the default rather than the effort, so the work is not generosity — it is variety. Deliberately doing the thing that is not your instinct is what keeps a same-sign relationship from becoming a mirror.`,
        ]
      : [
          `${a.name} expresses affection through ${a.loveLanguage}. ${b.name} expresses it through ${b.loveLanguage}. These are not the same currency, and the most common mistake in this pairing is assuming the other person is not trying when in fact they are paying in a denomination you have not learned to read.`,
          `${a.name} needs ${a.need}. ${b.name} needs ${b.need}. Both needs are legitimate, neither is negotiable, and the relationship works to the exact degree that both get met without one being permanently deferred in favour of the other.`,
          `${a.name} feels loved when ${a.feelsLoved}. ${b.name} feels loved when ${b.feelsLoved}. If you remember nothing else from this page, remember those two sentences — they are the operating manual, and they are almost never the same sentence twice.`,
        ],
  });

  sections.push({
    id: 'communication',
    heading: 'Communication and conflict',
    paragraphs: isSelf
      ? [
          `${a.name} speaks in ${a.commStyle}. With two of you doing that, information travels fast and nuance does not. Under pressure, ${a.name} ${a.conflictMove} — and in this pairing there is nobody whose reflex is to be different, so the pattern repeats at double volume.`,
          `A same-sign conflict is unusually clean and unusually hard to end. Clean, because you both understand what is being said without interpretation. Hard, because you both make the same move at the same moment, and the move is not de-escalation.`,
          `${a.name} hates ${a.avoid}. From a partner with the same instincts, that wound is delivered more accurately than any other sign could manage, usually without intent.`,
        ]
      : [
          `${a.name} speaks in ${a.commStyle}. ${b.name} speaks in ${b.commStyle}. When things are good, this difference is interesting. When things are difficult, the same difference is the reason the two of you keep talking past each other on the same point for years.`,
          `Under pressure, ${a.name} ${a.conflictMove}. ${b.name} ${b.conflictMove}. Neither response is a manipulation; both are protective reflexes. But they are incompatible reflexes, and left alone they form a loop that neither of you chose and neither of you can exit from inside it.`,
          `${a.name} hates ${a.avoid}. ${b.name} hates ${b.avoid}. Read those two lines against the paragraph above and you will recognise most of the arguments you have already had.`,
        ],
  });

  sections.push({
    id: 'breakdown',
    heading: 'Where this pairing breaks',
    paragraphs: [
      el.friction,
      `The specific failure mode is not dramatic. It is cumulative. A small mismatch is tolerated, then normalised, then defended, and by the time it is raised the conversation is no longer about the original thing. ${isSelf ? 'With a same-sign partner, the mismatch is invisible precisely because it is shared.' : `With ${a.name} and ${b.name}, the mismatch is visible from the first month and simply goes unaddressed because neither of you wants to be the one who names it.`}`,
      scenarioParagraph(a, b),
    ],
  });

  sections.push({
    id: 'lasting',
    heading: 'What actually makes it last',
    paragraphs: [
      el.advice,
      md.friction,
      `The rest is unglamorous and it works: say the appreciation out loud at the moment it occurs, keep one domain where each of you is unambiguously in charge, and treat the recurring argument as a shared problem rather than a scoreboard. ${a.name} and ${b.name} do not need to become more alike. They need a division of labour that uses the difference instead of negotiating it every time.`,
    ],
    bullets: isSelf
      ? [
          'Import a difference on purpose — a third perspective, a friend group, a practice that is not shared.',
          'State needs explicitly; a mirror will not notice the gap for you.',
        ]
      : [
          `Give ${a.name} a domain where ${a.impulse.split(' and ')[0]} is an asset rather than a problem.`,
          `Give ${b.name} the same, and do not trade the two domains as leverage.`,
          `Name the reflex before it fires: "${a.name} is about to ${a.conflictMove.split(' and ')[0]}" is a sentence that has ended real arguments.`,
        ],
  });

  const faqs: CompatibilityFaq[] = [
    {
      q: isSelf
        ? `Is ${a.name} with ${a.name} a good match?`
        : `Are ${a.name} and ${b.name} compatible?`,
      a: isSelf
        ? `It is a high-recognition, high-amplification match rather than a balanced one. The ${a.name}–${a.name} pairing scores ${score.overall}/100 here, landing in the "${score.band}" band. Everything ${a.name} does well is doubled, and so is everything it avoids. It works when both partners deliberately import a perspective neither of them supplies naturally.`
        : `They score ${score.overall}/100 in the ${score.band} band: ${score.element}/40 on element, ${score.modality}/25 on modality, ${score.polarity}/20 on polarity, ${score.ruler}/5 on rulership. That is a ${score.overall >= 78 ? 'structurally favourable' : score.overall >= 70 ? 'workable but demanding' : 'genuinely difficult'} combination — the score describes the starting conditions, not the outcome.`,
    },
    {
      q: `${elementLabel[a.element]} and ${elementLabel[b.element]} — what does that mean in practice?`,
      a: `${el.headline}. ${el.strength} The counterweight is this: ${el.friction.toLowerCase()}`,
    },
    {
      q: isSelf
        ? `What is the main risk in a ${a.name}–${a.name} relationship?`
        : `What is the biggest risk in a ${a.name}–${b.name} relationship?`,
      a: isSelf
        ? 'Sameness. Two people with the same reflexes will validate each other\'s blind spots indefinitely, because neither will ever be the one who notices. The relationship feels effortless and can stagnate without a single argument to signal it.'
        : `The loop, not the difference. ${a.name} ${a.conflictMove.split(' and ')[0]}; ${b.name} ${b.conflictMove.split(' and ')[0]}. Each reaction makes the other more likely, and the pair can repeat the same three moves for years without either person feeling like the author of it.`,
    },
    {
      q: 'How do you make this pairing work long term?',
      a: `${el.advice} Beyond that, the two non-negotiables are stated needs — ${a.name} needs ${a.need}, ${b.name} needs ${b.need} — and a shared rule that the recurring argument is a problem you are both against, rather than a position you are both defending.`,
    },
  ];

  const related = zodiacProfiles
    .filter((z) => z.slug !== b.slug)
    .map((z) => ({
      slug: pairSlug(a.slug, z.slug),
      label: `${a.name} + ${z.name}`,
      overall: scorePair(a, z).overall,
    }))
    .sort((x, y) => y.overall - x.overall)
    .slice(0, 6);

  const wordCount = sections.reduce(
    (n, s) =>
      n +
      s.paragraphs.join(' ').split(/\s+/).length +
      (s.bullets ? s.bullets.join(' ').split(/\s+/).length : 0),
    faqs.reduce((n, f) => n + f.a.split(/\s+/).length, 0),
  );

  return {
    slug,
    a,
    b,
    isSelf,
    h1: isSelf
      ? `${a.name} and ${a.name} Compatibility: ${score.overall}/100`
      : `${a.name} and ${b.name} Compatibility: ${score.overall}/100`,
    title: isSelf
      ? `${a.name} and ${a.name} Compatibility — Full Match Analysis`
      : `${a.name} and ${b.name} Compatibility — Full Match Analysis`,
    description: isSelf
      ? `A detailed ${a.name}–${a.name} same-sign compatibility reading: element, modality, love, conflict and the specific risk of dating your own sign. Scored ${score.overall}/100.`
      : `How ${a.name} and ${b.name} fit together: element chemistry, rhythm, love languages, the conflict loop that repeats, and what makes it last. Scored ${score.overall}/100, ${score.band.toLowerCase()}.`,
    score,
    sections,
    faqs,
    related,
    wordCount,
  };
}

export function getCompatibilityPage(aSlug: string, bSlug: string): CompatibilityPage | null {
  const a = zodiacBySlug.get(aSlug);
  const b = zodiacBySlug.get(bSlug);
  if (!a || !b) return null;
  return buildCompatibilityPage(a, b);
}
