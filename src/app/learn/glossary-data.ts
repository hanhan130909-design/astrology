// BaZi + Zi Wei Dou Shu terminology glossary
// zh term → pinyin → English → short explanation (for non-Chinese readers)

export interface GlossaryTerm {
  zh: string;
  pinyin: string;
  en: string;
  description: {
    zh: string;
    en: string;
  };
}

export const baziGlossary: GlossaryTerm[] = [
  {
    zh: "八字", pinyin: "BaZi", en: "Eight Characters / Four Pillars of Destiny",
    description: {
      zh: "用出生年月日时四个时间单位的天干地支组合来分析命运的传统命理学。",
      en: "A traditional Chinese destiny analysis system using the Heavenly Stems and Earthly Branches of your birth year, month, day, and hour."
    }
  },
  {
    zh: "天干", pinyin: "Tiān Gān", en: "Heavenly Stems",
    description: {
      zh: "十天干：甲乙丙丁戊己庚辛壬癸，分阴阳五行，是八字的基本符号系统。",
      en: "The 10 celestial symbols: Jia, Yi, Bing, Ding, Wu, Ji, Geng, Xin, Ren, Gui. Each has a Yin-Yang polarity and Five Element correspondence."
    }
  },
  {
    zh: "地支", pinyin: "Dì Zhī", en: "Earthly Branches",
    description: {
      zh: "十二地支：子丑寅卯辰巳午未申酉戌亥，对应生肖、月份、时辰和五行，内含藏干。",
      en: "The 12 terrestrial symbols: Zi, Chou, Yin, Mao, Chen, Si, Wu, Wei, Shen, You, Xu, Hai. Each maps to a zodiac animal, month, hour, and element, with hidden Heavenly Stems inside."
    }
  },
  {
    zh: "五行", pinyin: "Wǔ Xíng", en: "Five Elements / Five Phases",
    description: {
      zh: "金木水火土，构成相生（木生火生土生金生水生木）和相克（木克土克水克火克金克木）的循环。",
      en: "Wood, Fire, Earth, Metal, Water — forming generating and controlling cycles that govern all interactions in BaZi."
    }
  },
  {
    zh: "日主", pinyin: "Rì Zhǔ", en: "Day Master",
    description: {
      zh: "日柱的天干，代表你本人的核心人格和五行属性。十神关系以日主为中心来计算。",
      en: "The Heavenly Stem of your Day Pillar — represents your core self and element type. All Ten God relationships are calculated relative to the Day Master."
    }
  },
  {
    zh: "十神", pinyin: "Shí Shén", en: "Ten Gods",
    description: {
      zh: "以日主为中心划分的十种角色关系：正印、偏印、正官、七杀、正财、偏财、食神、伤官、比肩、劫财。",
      en: "Ten role relationships centered on the Day Master: Resource (Zheng/Pian Yin), Officer (Zheng Guan / Qi Sha), Wealth (Zheng/Pian Cai), Output (Shi Shen / Shang Guan), Companion (Bi Jian / Jie Cai)."
    }
  },
  {
    zh: "大运", pinyin: "Dà Yùn", en: "Luck Cycle / 10-Year Major Cycle",
    description: {
      zh: "每十年一个运势周期，从起运年龄开始，依次排列。每个大运由一组干支代表。",
      en: "A 10-year fortune period. Each cycle is represented by a Stem-Branch pair, starting from your calculated cycle-start age and progressing sequentially."
    }
  },
  {
    zh: "流年", pinyin: "Liú Nián", en: "Annual Star / Yearly Influence",
    description: {
      zh: "每一年的干支组合，代表当年的运势影响。流年与大运、命盘互动产生具体事件。",
      en: "The Stem-Branch pair of a specific year, representing that year's influence. Annual stars interact with your Luck Cycle and natal chart to produce specific events."
    }
  },
  {
    zh: "阴阳", pinyin: "Yīn Yáng", en: "Yin & Yang",
    description: {
      zh: "万物的两个基本面向：阳为主动、外向、刚健；阴为被动、内向、柔顺。天干地支都有阴阳之分。",
      en: "The two fundamental polarities of all things: Yang = active, outward, assertive; Yin = passive, inward, receptive. Every Stem and Branch has a Yin-Yang classification."
    }
  },
  {
    zh: "六十甲子", pinyin: "Liù Shí Jiǎ Zǐ", en: "Sexagenary Cycle / 60-Year Cycle",
    description: {
      zh: "天干和地支按固定顺序两两配对，形成60个组合，用于纪年、纪月、纪日、纪时。",
      en: "The 60 unique Stem-Branch combinations formed by pairing 10 Stems × 12 Branches in fixed sequence. Used for counting years, months, days, and hours."
    }
  },
];

export const ziweiGlossary: GlossaryTerm[] = [
  {
    zh: "紫微斗数", pinyin: "Zǐ Wēi Dǒu Shù", en: "Purple Star Astrology / Zi Wei Dou Shu",
    description: {
      zh: "以紫微星为中心的星曜命理体系，用108颗星和12宫位绘制人生全息图。",
      en: "A star-based destiny system centered on the Purple Star (Zi Wei), using 108 stars placed across 12 Palaces to map a complete life hologram."
    }
  },
  {
    zh: "十二宫", pinyin: "Shí Èr Gōng", en: "The 12 Palaces",
    description: {
      zh: "命、兄弟、夫妻、子女、财帛、疾厄、迁移、交友、事业、田宅、福德、父母——各代表人生的一个领域。",
      en: "Self, Siblings, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Fortune, Parents — each represents a life domain."
    }
  },
  {
    zh: "主星", pinyin: "Zhǔ Xīng", en: "Major Stars",
    description: {
      zh: "14颗主星分属紫微星系（北斗）和天府星系（南斗），是命盘的核心配置。",
      en: "14 primary stars divided into the Zi Wei group (Northern Dipper) and Tian Fu group (Southern Dipper), forming the core of any chart."
    }
  },
  {
    zh: "辅星", pinyin: "Fǔ Xīng", en: "Supporting / Minor Stars",
    description: {
      zh: "左辅右弼文昌文曲天魁天钺等吉星，以及擎羊陀罗火星铃星地劫地空等煞星，辅助主星发挥作用。",
      en: "Lucky stars (Zuo Fu, You Bi, Wen Chang, etc.) and challenging stars (Qing Yang, Tuo Luo, etc.) that modify how the major stars express themselves."
    }
  },
  {
    zh: "四化", pinyin: "Sì Huà", en: "Four Transformations",
    description: {
      zh: "化禄（机遇财富）、化权（权威掌控）、化科（名声贵人）、化忌（挑战功课），改变星曜的原始表现。",
      en: "Prosperity (Hua Lu), Authority (Hua Quan), Reputation (Hua Ke), Obstacle (Hua Ji) — these modify a star's expression. Determined by birth year, decade, and year."
    }
  },
];
