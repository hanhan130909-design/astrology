/**
 * 12 星座结构化档案 —— 合盘引擎的数据底座
 *
 * 每个字段都不是标签，而是可拼进句子的动词短语/名词短语，
 * 保证 66 组配对生成的正文互不重复。
 */

export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';
export type Polarity = 'yang' | 'yin';

export interface ZodiacProfile {
  slug: string;
  name: string;
  glyph: string;
  dates: string;
  element: Element;
  modality: Modality;
  polarity: Polarity;
  /** 现代守护星 */
  ruler: string;
  /** 古典守护星（用于说明守护关系） */
  traditionalRuler: string;
  /** 三个核心关键词 */
  keywords: [string, string, string];
  /** 意象 */
  symbol: string;

  /** 行动方式（接在星座名之后，动词短语） */
  impulse: string;
  /** 表达爱的方式（名词短语） */
  loveLanguage: string;
  /** 说话风格（名词短语） */
  commStyle: string;
  /** 压力下的第一反应（动词短语） */
  conflictMove: string;
  /** 核心需求（名词短语，接 needs 之后） */
  need: string;
  /** 成长功课（动名词短语） */
  growthEdge: string;
  /** 最容易被伤到的点（动名词短语，接 hates 之后） */
  avoid: string;
  /** 在这个星座眼里"被爱"具体长什么样 */
  feelsLoved: string;
}

export const zodiacProfiles: ZodiacProfile[] = [
  {
    slug: 'aries',
    name: 'Aries',
    glyph: '♈',
    dates: 'March 21 – April 19',
    element: 'fire',
    modality: 'cardinal',
    polarity: 'yang',
    ruler: 'Mars',
    traditionalRuler: 'Mars',
    keywords: ['bold', 'direct', 'fast-starting'],
    symbol: 'the Ram',
    impulse: 'moves on instinct and explains the reasoning afterward',
    loveLanguage: 'open pursuit, immediate honesty and shared competition',
    commStyle: 'short declarative sentences with no cushioning',
    conflictMove: 'fires back within the same minute and expects the matter settled before it sleeps',
    need: 'a partner who answers momentum with momentum rather than a warning',
    growthEdge: 'learning that a pause is not a rejection',
    avoid: 'being asked to slow down before it has finished deciding',
    feelsLoved: 'someone who says yes before the plan is fully explained',
  },
  {
    slug: 'taurus',
    name: 'Taurus',
    glyph: '♉',
    dates: 'April 20 – May 20',
    element: 'earth',
    modality: 'fixed',
    polarity: 'yin',
    ruler: 'Venus',
    traditionalRuler: 'Venus',
    keywords: ['steady', 'sensual', 'immovable'],
    symbol: 'the Bull',
    impulse: 'takes the long route on purpose and refuses to be hurried off it',
    loveLanguage: 'physical consistency, good food, and showing up on time for years',
    commStyle: 'slow, concrete speech that avoids hypotheticals',
    conflictMove: 'goes quiet and simply stops moving until the pressure passes',
    need: 'predictability it can build a routine around',
    growthEdge: 'treating change as information rather than as a threat',
    avoid: 'having a settled arrangement rewritten without notice',
    feelsLoved: 'the same small kindness repeated without being asked',
  },
  {
    slug: 'gemini',
    name: 'Gemini',
    glyph: '♊',
    dates: 'May 21 – June 20',
    element: 'air',
    modality: 'mutable',
    polarity: 'yang',
    ruler: 'Mercury',
    traditionalRuler: 'Mercury',
    keywords: ['curious', 'verbal', 'restless'],
    symbol: 'the Twins',
    impulse: 'starts three conversations to see which one has voltage',
    loveLanguage: 'banter, shared curiosity and being told everything first',
    commStyle: 'quick associative leaps that skip the transitions',
    conflictMove: 'talks its way around the feeling and analyzes it instead of sitting in it',
    need: 'novelty and a partner who finds its tangents interesting',
    growthEdge: 'staying in one conversation long enough for it to get uncomfortable',
    avoid: 'being pinned to a decision made in a mood it has already left',
    feelsLoved: 'someone who asks a follow-up question instead of changing the subject',
  },
  {
    slug: 'cancer',
    name: 'Cancer',
    glyph: '♋',
    dates: 'June 21 – July 22',
    element: 'water',
    modality: 'cardinal',
    polarity: 'yin',
    ruler: 'the Moon',
    traditionalRuler: 'the Moon',
    keywords: ['protective', 'remembering', 'tidal'],
    symbol: 'the Crab',
    impulse: 'moves first toward whoever looks unprotected, including itself',
    loveLanguage: 'feeding people, remembering details, and building a room worth staying in',
    commStyle: 'indirect hints wrapped around a very clear feeling',
    conflictMove: 'retreats into the shell and waits to see who follows',
    need: 'emotional safety before logistics',
    growthEdge: 'saying the need out loud instead of testing whether it gets noticed',
    avoid: 'having a tender admission used as evidence later',
    feelsLoved: 'being checked on before it has to ask',
  },
  {
    slug: 'leo',
    name: 'Leo',
    glyph: '♌',
    dates: 'July 23 – August 22',
    element: 'fire',
    modality: 'fixed',
    polarity: 'yang',
    ruler: 'the Sun',
    traditionalRuler: 'the Sun',
    keywords: ['generous', 'warm', 'proud'],
    symbol: 'the Lion',
    impulse: 'walks in and gives the room a centre to orbit',
    loveLanguage: 'lavish public loyalty and making the partner the main character',
    commStyle: 'story-shaped speech with a dramatic beat and a real heart',
    conflictMove: 'holds its dignity in place and refuses to be smalled in front of others',
    need: 'to be visibly chosen',
    growthEdge: 'letting warmth exist without an audience',
    avoid: 'being corrected in public or treated as ordinary',
    feelsLoved: 'being praised for the effort nobody else saw',
  },
  {
    slug: 'virgo',
    name: 'Virgo',
    glyph: '♍',
    dates: 'August 23 – September 22',
    element: 'earth',
    modality: 'mutable',
    polarity: 'yin',
    ruler: 'Mercury',
    traditionalRuler: 'Mercury',
    keywords: ['precise', 'useful', 'self-critical'],
    symbol: 'the Maiden',
    impulse: 'fixes the thing that is about to break instead of announcing it',
    loveLanguage: 'practical service — the appointment booked, the meal planned, the detail remembered',
    commStyle: 'careful qualified sentences that flag every exception',
    conflictMove: 'produces a list of specifics and expects the same rigour in return',
    need: 'competence it can trust and quiet it can think in',
    growthEdge: 'offering affection before the conditions are perfectly met',
    avoid: 'being told its care is nagging',
    feelsLoved: 'someone who notices the invisible work and says so once',
  },
  {
    slug: 'libra',
    name: 'Libra',
    glyph: '♎',
    dates: 'September 23 – October 22',
    element: 'air',
    modality: 'cardinal',
    polarity: 'yang',
    ruler: 'Venus',
    traditionalRuler: 'Venus',
    keywords: ['fair', 'relational', 'aesthetic'],
    symbol: 'the Scales',
    impulse: 'starts by weighing both sides and then moves to make the room nicer',
    loveLanguage: 'courtship, fairness and being consulted as an equal',
    commStyle: 'diplomatic phrasing that leaves the door open a fraction longer than needed',
    conflictMove: 'smooths the surface fast and returns to the real issue three days later',
    need: 'reciprocity it can actually measure',
    growthEdge: 'tolerating being disliked for the sake of being honest',
    avoid: 'being forced into a corner with no graceful exit',
    feelsLoved: 'someone who chooses it and says the choice out loud',
  },
  {
    slug: 'scorpio',
    name: 'Scorpio',
    glyph: '♏',
    dates: 'October 23 – November 21',
    element: 'water',
    modality: 'fixed',
    polarity: 'yin',
    ruler: 'Pluto',
    traditionalRuler: 'Mars',
    keywords: ['intense', 'private', 'all-or-nothing'],
    symbol: 'the Scorpion',
    impulse: 'reads the room for what is being withheld before it says anything',
    loveLanguage: 'exclusive depth — knowing the parts of you that are not for public use',
    commStyle: 'sparse, exact speech that reveals roughly a third of what it knows',
    conflictMove: 'goes still and quiet, and remembers the detail you hoped it missed',
    need: 'loyalty that survives being tested',
    growthEdge: 'trusting without a verification round',
    avoid: 'being handled, managed, or half-told the truth',
    feelsLoved: 'someone who stays after seeing the difficult part',
  },
  {
    slug: 'sagittarius',
    name: 'Sagittarius',
    glyph: '♐',
    dates: 'November 22 – December 21',
    element: 'fire',
    modality: 'mutable',
    polarity: 'yang',
    ruler: 'Jupiter',
    traditionalRuler: 'Jupiter',
    keywords: ['expansive', 'blunt', 'seeking'],
    symbol: 'the Archer',
    impulse: 'aims at the horizon and fills in the details on the way',
    loveLanguage: 'taking the partner along, and refusing to shrink anyone small',
    commStyle: 'honest to the point of bruising, delivered with real optimism',
    conflictMove: 'names the uncomfortable truth out loud and then wants to move on',
    need: 'room to keep growing inside the relationship',
    growthEdge: 'staying for the part after the revelation',
    avoid: 'being made to feel that its freedom is a character flaw',
    feelsLoved: 'someone who packs a bag instead of asking for a promise',
  },
  {
    slug: 'capricorn',
    name: 'Capricorn',
    glyph: '♑',
    dates: 'December 22 – January 19',
    element: 'earth',
    modality: 'cardinal',
    polarity: 'yin',
    ruler: 'Saturn',
    traditionalRuler: 'Saturn',
    keywords: ['disciplined', 'durable', 'reserved'],
    symbol: 'the Goat',
    impulse: 'builds the structure first and allows itself feeling once the foundation holds',
    loveLanguage: 'long-term commitment expressed as reliability, not speeches',
    commStyle: 'measured, understated speech that leaves sentiment implied',
    conflictMove: 'withdraws into work and waits for the situation to become solvable',
    need: 'respect and a partner who takes the future seriously',
    growthEdge: 'showing the vulnerability that it currently only audits privately',
    avoid: 'being seen as cold when it is simply holding the line',
    feelsLoved: 'someone who stays through the unglamorous middle part',
  },
  {
    slug: 'aquarius',
    name: 'Aquarius',
    glyph: '♒',
    dates: 'January 20 – February 18',
    element: 'air',
    modality: 'fixed',
    polarity: 'yang',
    ruler: 'Uranus',
    traditionalRuler: 'Saturn',
    keywords: ['independent', 'principled', 'unconventional'],
    symbol: 'the Water Bearer',
    impulse: 'steps back to see the system, then refuses to participate in the broken part',
    loveLanguage: 'friendship first, plus genuine respect for the partner’s autonomy',
    commStyle: 'conceptual speech that prefers the principle to the personal detail',
    conflictMove: 'gets cool and abstract and reasons instead of feeling',
    need: 'space that is not treated as distance',
    growthEdge: 'letting one person matter more than the principle',
    avoid: 'being asked to perform emotion on a schedule',
    feelsLoved: 'someone who lets it be strange without making it a problem',
  },
  {
    slug: 'pisces',
    name: 'Pisces',
    glyph: '♓',
    dates: 'February 19 – March 20',
    element: 'water',
    modality: 'mutable',
    polarity: 'yin',
    ruler: 'Neptune',
    traditionalRuler: 'Jupiter',
    keywords: ['porous', 'compassionate', 'dreaming'],
    symbol: 'the Fishes',
    impulse: 'absorbs the mood of the room and responds to what nobody said',
    loveLanguage: 'merging, imaginative attention, and forgiving the same thing twice',
    commStyle: 'allusive speech that arrives sideways through image and metaphor',
    conflictMove: 'dissolves out of the argument and comes back hoping it evaporated',
    need: 'tenderness and permission to not have a firm opinion',
    growthEdge: 'keeping a boundary after the first time it is crossed',
    avoid: 'having its softness read as weakness or as a strategy',
    feelsLoved: 'someone who is gentle without being asked to be',
  },
];

export const zodiacBySlug = new Map(zodiacProfiles.map((z) => [z.slug, z]));

export const elementLabel: Record<Element, string> = {
  fire: 'Fire',
  earth: 'Earth',
  air: 'Air',
  water: 'Water',
};

export const modalityLabel: Record<Modality, string> = {
  cardinal: 'Cardinal',
  fixed: 'Fixed',
  mutable: 'Mutable',
};

export const polarityLabel: Record<Polarity, string> = {
  yang: 'Yang / active',
  yin: 'Yin / receptive',
};

/** 元素的搜索意图描述词，用于 H2 与摘要 */
export const elementQuality: Record<Element, string> = {
  fire: 'initiative, heat and self-expression',
  earth: 'stability, the body and material reality',
  air: 'language, ideas and perspective',
  water: 'feeling, memory and emotional depth',
};
