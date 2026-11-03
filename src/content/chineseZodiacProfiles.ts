/**
 * 12 生肖档案 —— 生肖合婚引擎的数据底座
 *
 * 与 zodiacProfiles.ts 同构：字段都是可拼进句子的动词/名词短语，
 * 保证 78 组配对（66 跨生肖 + 12 自配对）生成的正文互不重复。
 *
 * 生年五行取「本命五行」通行口径（非纳音）：
 *   子亥水、寅卯木、巳午火、申酉金、辰戌丑未土
 */

export type WuXing = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type TrineGroup = 'water' | 'wood' | 'fire' | 'metal';

export interface ChineseZodiacProfile {
  slug: string;
  name: string;
  /** 地支 */
  branch: string;
  branchPinyin: string;
  /** 本命五行 */
  element: WuXing;
  /** 阴阳 */
  polarity: 'yang' | 'yin';
  /** 所属三合局 */
  trine: TrineGroup;
  /** 三合局的另外两个生肖 */
  trineMates: [string, string];
  /** 六合生肖 */
  secretFriend: string;
  /** 六冲生肖 */
  clash: string;
  /** 六害生肖 */
  harm: string;
  /** 是否自刑（辰午酉亥） */
  selfPunish: boolean;
  /** 生肖时辰 */
  hours: string;
  /** 农历月（大致） */
  lunarMonth: string;
  /** 近六个生年 */
  years: number[];
  keywords: [string, string, string];

  /** 行动方式（接在生肖名之后，动词短语） */
  impulse: string;
  loveStyle: string;
  commStyle: string;
  conflictMove: string;
  need: string;
  growthEdge: string;
  avoid: string;
  feelsLoved: string;
}

const ZODIAC_ORDER = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
] as const;

/** 生年：以 2020 庚子鼠为锚点倒推，覆盖 1960–2032 */
export function birthYearsFor(slug: string): number[] {
  const index = ZODIAC_ORDER.indexOf(slug as (typeof ZODIAC_ORDER)[number]);
  if (index < 0) return [];
  const years: number[] = [];
  for (let year = 1960; year <= 2032; year += 1) {
    if (((year - 2020) % 12 + 12) % 12 === index) years.push(year);
  }
  return years;
}

/** 时辰：子时 23:00 起，每支两小时 */
function hoursFor(slug: string): string {
  const index = ZODIAC_ORDER.indexOf(slug as (typeof ZODIAC_ORDER)[number]);
  if (index < 0) return '';
  const start = (23 + index * 2) % 24;
  const end = (start + 2) % 24;
  const pad = (h: number) => `${String(h).padStart(2, '0')}:00`;
  return `${pad(start)}–${pad(end)}`;
}

export const chineseZodiacProfiles: ChineseZodiacProfile[] = [
  {
    slug: 'rat',
    name: 'Rat',
    branch: '子',
    branchPinyin: 'zǐ',
    element: 'water',
    polarity: 'yang',
    trine: 'water',
    trineMates: ['Dragon', 'Monkey'],
    secretFriend: 'Ox',
    clash: 'Horse',
    harm: 'Goat',
    selfPunish: false,
    hours: hoursFor('rat'),
    lunarMonth: 'eleventh lunar month',
    years: birthYearsFor('rat'),
    keywords: ['resourceful', 'alert', 'thrifty'],
    impulse: 'sizes up the situation first and then moves faster than anyone expected',
    loveStyle: 'practical devotion — noticing what is running out and quietly replacing it',
    commStyle: 'quick, specific and slightly guarded',
    conflictMove: 'calculates the cost of the argument before answering, and sometimes decides not to',
    need: 'a partner who is steady enough that it can stop scanning the room',
    growthEdge: 'trusting without keeping a backup plan',
    avoid: 'being made to feel that its caution is cheapness',
    feelsLoved: 'someone who remembers the small thing it mentioned once',
  },
  {
    slug: 'ox',
    name: 'Ox',
    branch: '丑',
    branchPinyin: 'chǒu',
    element: 'earth',
    polarity: 'yin',
    trine: 'metal',
    trineMates: ['Snake', 'Rooster'],
    secretFriend: 'Rat',
    clash: 'Goat',
    harm: 'Horse',
    selfPunish: false,
    hours: hoursFor('ox'),
    lunarMonth: 'twelfth lunar month',
    years: birthYearsFor('ox'),
    keywords: ['patient', 'dependable', 'immovable'],
    impulse: 'makes the decision slowly and then cannot be talked out of it',
    loveStyle: 'showing up every day, and meaning it as a declaration',
    commStyle: 'plain speech, few words, no decoration',
    conflictMove: 'stops responding and simply holds the position until the other person tires',
    need: 'a partner who values consistency over novelty',
    growthEdge: 'saying the feeling instead of demonstrating it for twenty years',
    avoid: 'being rushed, or being told it never changes',
    feelsLoved: 'someone who keeps a promise it did not have to keep',
  },
  {
    slug: 'tiger',
    name: 'Tiger',
    branch: '寅',
    branchPinyin: 'yín',
    element: 'wood',
    polarity: 'yang',
    trine: 'fire',
    trineMates: ['Horse', 'Dog'],
    secretFriend: 'Pig',
    clash: 'Monkey',
    harm: 'Snake',
    selfPunish: false,
    hours: hoursFor('tiger'),
    lunarMonth: 'first lunar month',
    years: birthYearsFor('tiger'),
    keywords: ['bold', 'independent', 'commanding'],
    impulse: 'commits to the direction before the plan exists',
    loveStyle: 'fierce protection and taking the partner along on everything',
    commStyle: 'direct statements delivered at full volume and full sincerity',
    conflictMove: 'escalates immediately and respects the person who does not flinch',
    need: 'room to lead and a partner with its own spine',
    growthEdge: 'asking before deciding on behalf of two people',
    avoid: 'being managed, or being doubted in front of others',
    feelsLoved: 'someone who chooses to follow rather than comply',
  },
  {
    slug: 'rabbit',
    name: 'Rabbit',
    branch: '卯',
    branchPinyin: 'mǎo',
    element: 'wood',
    polarity: 'yin',
    trine: 'wood',
    trineMates: ['Goat', 'Pig'],
    secretFriend: 'Dog',
    clash: 'Rooster',
    harm: 'Dragon',
    selfPunish: false,
    hours: hoursFor('rabbit'),
    lunarMonth: 'second lunar month',
    years: birthYearsFor('rabbit'),
    keywords: ['diplomatic', 'refined', 'conflict-averse'],
    impulse: 'finds the graceful route that keeps everyone’s dignity intact',
    loveStyle: 'attentiveness, aesthetics and never making the partner feel clumsy',
    commStyle: 'soft phrasing that leaves both of you a way out',
    conflictMove: 'goes quiet and hopes the moment passes without anyone being named',
    need: 'peace, and a partner who does not use its gentleness as leverage',
    growthEdge: 'naming the problem while it is still small',
    avoid: 'harshness, public correction, or an argument with no exit',
    feelsLoved: 'someone who is careful with its feelings without being asked',
  },
  {
    slug: 'dragon',
    name: 'Dragon',
    branch: '辰',
    branchPinyin: 'chén',
    element: 'earth',
    polarity: 'yang',
    trine: 'water',
    trineMates: ['Rat', 'Monkey'],
    secretFriend: 'Rooster',
    clash: 'Dog',
    harm: 'Rabbit',
    selfPunish: true,
    hours: hoursFor('dragon'),
    lunarMonth: 'third lunar month',
    years: birthYearsFor('dragon'),
    keywords: ['ambitious', 'proud', 'expansive'],
    impulse: 'sets a scale for the project that nobody else had considered necessary',
    loveStyle: 'generosity with a streak of wanting to be admired for it',
    commStyle: 'large statements, delivered as though the matter is already settled',
    conflictMove: 'refuses to be diminished and withdraws the warmth instead of arguing',
    need: 'respect, and a partner who is not competing for the spotlight',
    growthEdge: 'letting someone else be right in public',
    avoid: 'being treated as ordinary, or being corrected in front of an audience',
    feelsLoved: 'someone who takes its ambitions seriously',
  },
  {
    slug: 'snake',
    name: 'Snake',
    branch: '巳',
    branchPinyin: 'sì',
    element: 'fire',
    polarity: 'yin',
    trine: 'metal',
    trineMates: ['Rooster', 'Ox'],
    secretFriend: 'Monkey',
    clash: 'Pig',
    harm: 'Tiger',
    selfPunish: false,
    hours: hoursFor('snake'),
    lunarMonth: 'fourth lunar month',
    years: birthYearsFor('snake'),
    keywords: ['strategic', 'private', 'perceptive'],
    impulse: 'watches for a long time and then acts once, precisely',
    loveStyle: 'deep exclusivity — knowing the parts of you that are not for public use',
    commStyle: 'measured speech that discloses roughly a third of what it has worked out',
    conflictMove: 'goes still and silent, and remembers exactly what was said',
    need: 'loyalty that has been tested rather than assumed',
    growthEdge: 'saying the suspicion out loud instead of verifying it privately',
    avoid: 'being handled, or being told it is being dramatic',
    feelsLoved: 'someone who stays after seeing the difficult part',
  },
  {
    slug: 'horse',
    name: 'Horse',
    branch: '午',
    branchPinyin: 'wǔ',
    element: 'fire',
    polarity: 'yang',
    trine: 'fire',
    trineMates: ['Tiger', 'Dog'],
    secretFriend: 'Goat',
    clash: 'Rat',
    harm: 'Ox',
    selfPunish: true,
    hours: hoursFor('horse'),
    lunarMonth: 'fifth lunar month',
    years: birthYearsFor('horse'),
    keywords: ['free', 'direct', 'restless'],
    impulse: 'moves first and works out the route while already in motion',
    loveStyle: 'enthusiastic presence, shared movement, and no possession',
    commStyle: 'blunt honesty with no preamble',
    conflictMove: 'says the thing and then wants to be past it within the hour',
    need: 'freedom that is not treated as a threat',
    growthEdge: 'staying through the part that is not exciting',
    avoid: 'being fenced in, or being asked to account for its movements',
    feelsLoved: 'someone who runs alongside rather than holding the reins',
  },
  {
    slug: 'goat',
    name: 'Goat',
    branch: '未',
    branchPinyin: 'wèi',
    element: 'earth',
    polarity: 'yin',
    trine: 'wood',
    trineMates: ['Rabbit', 'Pig'],
    secretFriend: 'Horse',
    clash: 'Ox',
    harm: 'Rat',
    selfPunish: false,
    hours: hoursFor('goat'),
    lunarMonth: 'sixth lunar month',
    years: birthYearsFor('goat'),
    keywords: ['gentle', 'artistic', 'sensitive'],
    impulse: 'waits to feel settled before committing, and rarely feels fully settled',
    loveStyle: 'tenderness, aesthetic care and remembering what the partner likes',
    commStyle: 'indirect, imagistic, and easily bruised by bluntness',
    conflictMove: 'absorbs the blow and then worries at it for days',
    need: 'reassurance it does not have to ask for twice',
    growthEdge: 'deciding without requiring perfect certainty first',
    avoid: 'harshness, and being told it is over-sensitive',
    feelsLoved: 'someone who is consistently soft with it',
  },
  {
    slug: 'monkey',
    name: 'Monkey',
    branch: '申',
    branchPinyin: 'shēn',
    element: 'metal',
    polarity: 'yang',
    trine: 'water',
    trineMates: ['Rat', 'Dragon'],
    secretFriend: 'Snake',
    clash: 'Tiger',
    harm: 'Pig',
    selfPunish: false,
    hours: hoursFor('monkey'),
    lunarMonth: 'seventh lunar month',
    years: birthYearsFor('monkey'),
    keywords: ['inventive', 'adaptable', 'playful'],
    impulse: 'solves the problem sideways and enjoys that it was sideways',
    loveStyle: 'playfulness, practical fixes and keeping the partner entertained',
    commStyle: 'fast, witty, and prone to testing you with a joke',
    conflictMove: 'deflects with humour and comes back when the heat has gone',
    need: 'mental stimulation and a partner who is not easily offended',
    growthEdge: 'staying serious for as long as the situation requires',
    avoid: 'being bored, or being taken literally at its worst joke',
    feelsLoved: 'someone who laughs and then stays',
  },
  {
    slug: 'rooster',
    name: 'Rooster',
    branch: '酉',
    branchPinyin: 'yǒu',
    element: 'metal',
    polarity: 'yin',
    trine: 'metal',
    trineMates: ['Snake', 'Ox'],
    secretFriend: 'Dragon',
    clash: 'Rabbit',
    harm: 'Dog',
    selfPunish: true,
    hours: hoursFor('rooster'),
    lunarMonth: 'eighth lunar month',
    years: birthYearsFor('rooster'),
    keywords: ['precise', 'punctual', 'exacting'],
    impulse: 'fixes the detail that everyone else decided was close enough',
    loveStyle: 'acts of service performed to a standard, and expecting the standard to be noticed',
    commStyle: 'explicit, orderly, and unafraid to correct a factual error mid-sentence',
    conflictMove: 'produces evidence and waits for the record to be corrected',
    need: 'competence it can rely on and appreciation it does not have to request',
    growthEdge: 'letting a thing be done adequately rather than perfectly',
    avoid: 'being called a nag for caring about accuracy',
    feelsLoved: 'someone who notices the effort nobody else saw',
  },
  {
    slug: 'dog',
    name: 'Dog',
    branch: '戌',
    branchPinyin: 'xū',
    element: 'earth',
    polarity: 'yang',
    trine: 'fire',
    trineMates: ['Tiger', 'Horse'],
    secretFriend: 'Rabbit',
    clash: 'Dragon',
    harm: 'Rooster',
    selfPunish: false,
    hours: hoursFor('dog'),
    lunarMonth: 'ninth lunar month',
    years: birthYearsFor('dog'),
    keywords: ['loyal', 'principled', 'watchful'],
    impulse: 'checks whether the situation is fair before deciding whether to join it',
    loveStyle: 'unwavering presence and a strong sense of what it owes you',
    commStyle: 'honest to the point of discomfort, usually delivered gently',
    conflictMove: 'states the principle at stake and will not trade it for harmony',
    need: 'to be trusted, and to know where it stands',
    growthEdge: 'allowing a person to be flawed without downgrading the loyalty',
    avoid: 'being deceived, or being asked to compromise on something it considers right',
    feelsLoved: 'someone who tells it the truth even when the truth is inconvenient',
  },
  {
    slug: 'pig',
    name: 'Pig',
    branch: '亥',
    branchPinyin: 'hài',
    element: 'water',
    polarity: 'yin',
    trine: 'wood',
    trineMates: ['Rabbit', 'Goat'],
    secretFriend: 'Tiger',
    clash: 'Snake',
    harm: 'Monkey',
    selfPunish: true,
    hours: hoursFor('pig'),
    lunarMonth: 'tenth lunar month',
    years: birthYearsFor('pig'),
    keywords: ['generous', 'easygoing', 'appetite-for-life'],
    impulse: 'says yes first and works out the implications later',
    loveStyle: 'open-handed generosity and refusing to keep score',
    commStyle: 'relaxed, candid, and slightly too trusting',
    conflictMove: 'absorbs the hit, forgives quickly, and does not always raise it again',
    need: 'warmth without a hidden invoice',
    growthEdge: 'keeping a boundary after the first time it is crossed',
    avoid: 'being taken advantage of, or being told it is naive',
    feelsLoved: 'someone who is generous back without being prompted',
  },
];

export const chineseZodiacBySlug = new Map(chineseZodiacProfiles.map((z) => [z.slug, z]));

export const wuXingLabel: Record<WuXing, string> = {
  wood: 'Wood',
  fire: 'Fire',
  earth: 'Earth',
  metal: 'Metal',
  water: 'Water',
};

export const wuXingHanzi: Record<WuXing, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

export const trineLabel: Record<TrineGroup, { element: string; hanzi: string; members: string }> = {
  water: { element: 'Water', hanzi: '水局', members: 'Monkey · Rat · Dragon' },
  wood: { element: 'Wood', hanzi: '木局', members: 'Pig · Rabbit · Goat' },
  fire: { element: 'Fire', hanzi: '火局', members: 'Tiger · Horse · Dog' },
  metal: { element: 'Metal', hanzi: '金局', members: 'Snake · Rooster · Ox' },
};

/** 五行相生：木→火→土→金→水→木 */
export const GENERATES: Record<WuXing, WuXing> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

/** 五行相克：木→土→水→火→金→木 */
export const CONTROLS: Record<WuXing, WuXing> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

export type ElementRelation = 'generating' | 'same' | 'controlling';

export function elementRelation(a: WuXing, b: WuXing): {
  kind: ElementRelation;
  /** 施力方：谁生谁 / 谁克谁；同元素时为 null */
  source: WuXing | null;
  target: WuXing | null;
} {
  if (a === b) return { kind: 'same', source: null, target: null };
  if (GENERATES[a] === b) return { kind: 'generating', source: a, target: b };
  if (GENERATES[b] === a) return { kind: 'generating', source: b, target: a };
  if (CONTROLS[a] === b) return { kind: 'controlling', source: a, target: b };
  if (CONTROLS[b] === a) return { kind: 'controlling', source: b, target: a };
  return { kind: 'same', source: null, target: null };
}
