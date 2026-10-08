/**
 * 第二批程序化SEO长尾文章生成器
 * 品类：10日主专题(10) + 星座配对(72) + 塔罗牌义(78) = 160篇
 *
 * 用法: node scripts/generate-longtail-batch2.js
 * 输出: src/app/blog/longtail-seo-articles-batch2.ts
 */

const fs = require("fs");
const path = require("path");

// ─── 10日主数据 ───
const DAY_MASTERS = [
  { key: "jia-wood", en: "Jia Wood", zh: "甲木", element: "Wood", polarity: "Yang", traits: "Pioneer, leader, towering tree", career: "Entrepreneurship, leadership, forestry", love: "Needs a partner who supports growth", advice: "Don't start too many things at once" },
  { key: "yi-wood", en: "Yi Wood", zh: "乙木", element: "Wood", polarity: "Yin", traits: "Diplomat, adaptable, resilient vine", career: "PR, partnerships, client relations", love: "Thrives in supportive relationships", advice: "Your softness is your strength" },
  { key: "bing-fire", en: "Bing Fire", zh: "丙火", element: "Fire", polarity: "Yang", traits: "Visionary, radiant, the sun", career: "Media, marketing, politics, CEO", love: "Passionate but needs space", advice: "Shine brightly but pace yourself" },
  { key: "ding-fire", en: "Ding Fire", zh: "丁火", element: "Fire", polarity: "Yin", traits: "Strategist, warm, candle flame", career: "Consulting, analysis, creative direction", love: "Deep, loyal connections", advice: "You don't need the spotlight" },
  { key: "wu-earth", en: "Wu Earth", zh: "戊土", element: "Earth", polarity: "Yang", traits: "Stabilizer, protector, the mountain", career: "Operations, real estate, infrastructure", love: "Reliable, steady partner", advice: "Move slowly but deliberately" },
  { key: "ji-earth", en: "Ji Earth", zh: "己土", element: "Earth", polarity: "Yin", traits: "Cultivator, nurturing, fertile soil", career: "HR, education, healthcare, coaching", love: "Nurtures and grows relationships", advice: "Don't neglect your own growth" },
  { key: "geng-metal", en: "Geng Metal", zh: "庚金", element: "Metal", polarity: "Yang", traits: "Enforcer, decisive, the sword", career: "Law, military, auditing, justice", love: "Direct, no games", advice: "Flexibility is not weakness" },
  { key: "xin-metal", en: "Xin Metal", zh: "辛金", element: "Metal", polarity: "Yin", traits: "Craftsman, refined, the jewel", career: "Design, fine arts, software architecture", love: "Appreciates beauty and quality", advice: "Your discerning eye is a gift" },
  { key: "ren-water", en: "Ren Water", zh: "壬水", element: "Water", polarity: "Yang", traits: "Big-picture thinker, the ocean", career: "Strategy, venture capital, philosophy", love: "Needs freedom and depth", advice: "Give yourself scope to dream" },
  { key: "gui-water", en: "Gui Water", zh: "癸水", element: "Water", polarity: "Yin", traits: "Intuitive, subtle, the mist", career: "Psychology, research, creative writing", love: "Deeply empathetic, intuitive", advice: "Trust your subtle perceptions" },
];

// ─── 星座数据（复用）───
const ZODIACS = [
  { sign: "aries", symbol: "♈", en: "Aries", zh: "白羊" },
  { sign: "taurus", symbol: "♉", en: "Taurus", zh: "金牛" },
  { sign: "gemini", symbol: "♊", en: "Gemini", zh: "双子" },
  { sign: "cancer", symbol: "♋", en: "Cancer", zh: "巨蟹" },
  { sign: "leo", symbol: "♌", en: "Leo", zh: "狮子" },
  { sign: "virgo", symbol: "♍", en: "Virgo", zh: "处女" },
  { sign: "libra", symbol: "♎", en: "Libra", zh: "天秤" },
  { sign: "scorpio", symbol: "♏", en: "Scorpio", zh: "天蝎" },
  { sign: "sagittarius", symbol: "♐", en: "Sagittarius", zh: "射手" },
  { sign: "capricorn", symbol: "♑", en: "Capricorn", zh: "摩羯" },
  { sign: "aquarius", symbol: "♒", en: "Aquarius", zh: "水瓶" },
  { sign: "pisces", symbol: "♓", en: "Pisces", zh: "双鱼" },
];

// 配对评分逻辑（元素相容性）
const ELEMENT_COMPAT = {
  Fire: { Fire: 85, Earth: 65, Air: 90, Water: 50 },
  Earth: { Fire: 65, Earth: 80, Air: 55, Water: 75 },
  Air: { Fire: 90, Earth: 55, Air: 80, Water: 60 },
  Water: { Fire: 50, Earth: 75, Air: 60, Water: 85 },
};
const SIGN_ELEMENTS = { aries: "Fire", leo: "Fire", sagittarius: "Fire", taurus: "Earth", virgo: "Earth", capricorn: "Earth", gemini: "Air", libra: "Air", aquarius: "Air", cancer: "Water", scorpio: "Water", pisces: "Water" };

// ─── 塔罗牌数据（22大阿卡纳 + 56小阿卡纳简化为40张数字牌）───
const TAROT_MAJOR = [
  { num: 0, en: "The Fool", zh: "愚者", theme: "New beginnings, innocence, spontaneity" },
  { num: 1, en: "The Magician", zh: "魔术师", theme: "Manifestation, power, skill" },
  { num: 2, en: "The High Priestess", zh: "女祭司", theme: "Intuition, mystery, inner voice" },
  { num: 3, en: "The Empress", zh: "皇后", theme: "Abundance, nurturing, creativity" },
  { num: 4, en: "The Emperor", zh: "皇帝", theme: "Authority, structure, control" },
  { num: 5, en: "The Hierophant", zh: "教皇", theme: "Tradition, spirituality, guidance" },
  { num: 6, en: "The Lovers", zh: "恋人", theme: "Love, harmony, relationships" },
  { num: 7, en: "The Chariot", zh: "战车", theme: "Willpower, victory, determination" },
  { num: 8, en: "Strength", zh: "力量", theme: "Courage, patience, inner strength" },
  { num: 9, en: "The Hermit", zh: "隐士", theme: "Soul-searching, introspection, guidance" },
  { num: 10, en: "Wheel of Fortune", zh: "命运之轮", theme: "Change, cycles, destiny" },
  { num: 11, en: "Justice", zh: "正义", theme: "Fairness, truth, cause and effect" },
  { num: 12, en: "The Hanged Man", zh: "倒吊人", theme: "Pause, surrender, new perspective" },
  { num: 13, en: "Death", zh: "死神", theme: "Endings, transformation, transition" },
  { num: 14, en: "Temperance", zh: "节制", theme: "Balance, moderation, patience" },
  { num: 15, en: "The Devil", zh: "恶魔", theme: "Bondage, addiction, materialism" },
  { num: 16, en: "The Tower", zh: "高塔", theme: "Sudden change, upheaval, revelation" },
  { num: 17, en: "The Star", zh: "星星", theme: "Hope, inspiration, renewal" },
  { num: 18, en: "The Moon", zh: "月亮", theme: "Illusion, intuition, subconscious" },
  { num: 19, en: "The Sun", zh: "太阳", theme: "Joy, success, vitality" },
  { num: 20, en: "Judgement", zh: "审判", theme: "Reflection, reckoning, awakening" },
  { num: 21, en: "The World", zh: "世界", theme: "Completion, accomplishment, fulfillment" },
];

const TAROT_SUITS = [
  { suit: "wands", en: "Wands", zh: "权杖", element: "Fire", theme: "Passion, creativity, action" },
  { suit: "cups", en: "Cups", zh: "圣杯", element: "Water", theme: "Emotions, love, intuition" },
  { suit: "swords", en: "Swords", zh: "宝剑", element: "Air", theme: "Intellect, conflict, truth" },
  { suit: "pentacles", en: "Pentacles", zh: "星币", element: "Earth", theme: "Money, work, material" },
];

// ─── 生成日主文章 ───
function generateDayMasterArticle(dm, lang) {
  const L = {
    en: {
      title: `${dm.en} Day Master: Complete Personality & Life Guide`,
      excerpt: `${dm.en} (${dm.polarity} ${dm.element}). Key traits: ${dm.traits}. Discover your career path, relationship style, wealth potential, and 2026 forecast based on your BaZi Day Master.`,
      content: `# ${dm.en} Day Master: The Complete Guide\n\n## Who You Are\n\nAs a ${dm.en} Day Master, you are ${dm.traits.toLowerCase()}. Your ${dm.element.toLowerCase()} energy, expressed through ${dm.polarity.toLowerCase()} polarity, defines how you show up in the world.\n\n## Career Path\n\n${dm.career}. You thrive when your work aligns with your elemental nature.\n\n## Love & Relationships\n\n${dm.love}. Understanding your Day Master helps you recognize what you truly need in a partner.\n\n## Wealth & Money\n\nYour relationship with money is shaped by your ${dm.element.toLowerCase()} energy. ${dm.advice}.\n\n## 2026 Forecast\n\n2026 is the Bing Wu Fire Horse year. For ${dm.en}, this brings ${dm.element === "Fire" ? "amplified energy and visibility" : dm.element === "Wood" ? "creative output and self-expression" : dm.element === "Earth" ? "support and nourishment" : dm.element === "Metal" ? "pressure that refines you" : "financial opportunities"}.\n\n## Get Your Full BaZi Reading\n\nYour Day Master is just the beginning. Your full BaZi chart includes your 10-Year Luck Cycles, Wealth Stars, and Relationship Palace — telling you exactly when to act and when to wait.\n\n[Calculate your free BaZi chart →](/bazi)\n\n[Unlock your complete 2026 Annual Report · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
    zh: {
      title: `${dm.zh}日主：性格与人生完整解析`,
      excerpt: `${dm.zh}（${dm.polarity === "Yang" ? "阳" : "阴"}${dm.element === "Wood" ? "木" : dm.element === "Fire" ? "火" : dm.element === "Earth" ? "土" : dm.element === "Metal" ? "金" : "水"}）。特质：${dm.traits}。解析你的事业方向、感情模式、财运潜力和2026年运势。`,
      content: `# ${dm.zh}日主完整解析\n\n## 你是谁\n\n作为${dm.zh}日主，你${dm.traits}。你的${dm.element === "Wood" ? "木" : dm.element === "Fire" ? "火" : dm.element === "Earth" ? "土" : dm.element === "Metal" ? "金" : "水"}性能量，通过${dm.polarity === "Yang" ? "阳" : "阴"}的方式表达，定义了你在世界中的存在方式。\n\n## 事业方向\n\n${dm.career}。当工作与你的五行本性一致时，你会如鱼得水。\n\n## 感情模式\n\n${dm.love}。理解你的日主能帮你认清在伴侣中真正需要什么。\n\n## 财运\n\n你与金钱的关系由你的${dm.element === "Wood" ? "木" : dm.element === "Fire" ? "火" : dm.element === "Earth" ? "土" : dm.element === "Metal" ? "金" : "水"}性能量塑造。${dm.advice}。\n\n## 2026年运势\n\n2026是丙午火马年。对${dm.zh}来说，这带来${dm.element === "Fire" ? "能量放大和曝光度" : dm.element === "Wood" ? "创意输出和自我表达" : dm.element === "Earth" ? "支持和滋养" : dm.element === "Metal" ? "淬炼你的压力" : "财务机会"}。\n\n## 获取你的完整八字解读\n\n日主只是开始。你的完整八字包含大运、财星和夫妻宫——告诉你何时该行动、何时该等待。\n\n[免费排盘 →](/bazi)\n\n[解锁2026完整年运报告 · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
  };

  if (lang === "en" || lang === "zh") return L[lang];
  // 其他语言用英文模板
  return {
    title: `${dm.en} Day Master: Complete Guide`,
    excerpt: `${dm.en} (${dm.polarity} ${dm.element}). ${dm.traits}. Career, love, wealth, 2026 forecast.`,
    content: L.en.content,
  };
}

// ─── 生成星座配对文章 ───
function generateCompatibilityArticle(z1, z2, lang) {
  const e1 = SIGN_ELEMENTS[z1.sign];
  const e2 = SIGN_ELEMENTS[z2.sign];
  const score = ELEMENT_COMPAT[e1][e2];
  const verdict = score >= 85 ? "Excellent match" : score >= 70 ? "Strong match" : score >= 55 ? "Workable with effort" : "Challenging but possible";

  const L = {
    en: {
      title: `${z1.symbol}${z1.en} + ${z2.symbol}${z2.en} Compatibility: Full Match Analysis`,
      excerpt: `${z1.en} and ${z2.en} compatibility score: ${score}/100. ${verdict}. Discover your love, communication, and long-term potential in this complete match analysis.`,
      content: `# ${z1.symbol} ${z1.en} + ${z2.symbol} ${z2.en}: Complete Compatibility Analysis\n\n## Compatibility Score: ${score}/100\n\n**Verdict:** ${verdict}\n\n${z1.en} is a ${e1.toLowerCase()} sign. ${z2.en} is a ${e2.toLowerCase()} sign. ${e1 === e2 ? "Sharing the same element creates natural understanding." : e1 === "Fire" && e2 === "Air" || e1 === "Air" && e2 === "Fire" ? "Fire and Air fuel each other — passion meets intellect." : e1 === "Earth" && e2 === "Water" || e1 === "Water" && e2 === "Earth" ? "Earth and Water nurture each other — stability meets emotion." : "Your elements have different rhythms, which can create both friction and fascination."}\n\n## Love & Romance\n\nIn romance, ${z1.en} brings ${e1 === "Fire" ? "passion and initiative" : e1 === "Earth" ? "stability and commitment" : e1 === "Air" ? "communication and variety" : "depth and emotional connection"}. ${z2.en} brings ${e2 === "Fire" ? "enthusiasm and warmth" : e2 === "Earth" ? "reliability and sensuality" : e2 === "Air" ? "intellectual stimulation" : "intuition and empathy"}.\n\n## Communication\n\n${score >= 70 ? "You understand each other's communication styles naturally." : "You may need to work on understanding each other's communication styles."} ${z1.en} tends to ${e1 === "Fire" ? "speak directly and act quickly" : e1 === "Earth" ? "be practical and deliberate" : e1 === "Air" ? "think out loud and love debate" : "process emotions deeply before speaking"}. ${z2.en} tends to ${e2 === "Fire" ? "be direct and impulsive" : e2 === "Earth" ? "be grounded and steady" : e2 === "Air" ? "be curious and versatile" : "be sensitive and intuitive"}.\n\n## Long-Term Potential\n\n${score >= 85 ? "This pairing has excellent long-term potential. Your energies complement each other beautifully." : score >= 70 ? "This is a strong match with good long-term potential if you keep communicating." : score >= 55 ? "Long-term success is possible but requires conscious effort and compromise." : "This pairing faces significant challenges. If both partners are willing to grow, it can work, but it won't be easy."}\n\n## Get Your Personalized Compatibility Reading\n\nSun sign compatibility is just the surface. Your full natal charts — including Moon signs, Venus, and the 7th house — reveal the real story of your relationship.\n\n[Calculate both charts for free →](/compatibility/bazi)\n\n[Unlock a deep relationship reading · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
    zh: {
      title: `${z1.symbol}${z1.zh}座 + ${z2.symbol}${z2.zh}座配对：完整合盘分析`,
      excerpt: `${z1.zh}座和${z2.zh}座配对评分：${score}/100。${verdict === "Excellent match" ? "天作之合" : verdict === "Strong match" ? "非常般配" : verdict === "Workable with effort" ? "需要磨合" : "充满挑战"}。完整解析你们的爱情、沟通和长期潜力。`,
      content: `# ${z1.symbol} ${z1.zh}座 + ${z2.symbol} ${z2.zh}座：完整配对分析\n\n## 配对评分：${score}/100\n\n**结论：**${verdict === "Excellent match" ? "天作之合" : verdict === "Strong match" ? "非常般配" : verdict === "Workable with effort" ? "需要磨合" : "充满挑战"}\n\n${z1.zh}座是${e1 === "Fire" ? "火象" : e1 === "Earth" ? "土象" : e1 === "Air" ? "风象" : "水象"}星座，${z2.zh}座是${e2 === "Fire" ? "火象" : e2 === "Earth" ? "土象" : e2 === "Air" ? "风象" : "水象"}星座。\n\n## 爱情与浪漫\n\n在爱情中，${z1.zh}座带来${e1 === "Fire" ? "热情和主动" : e1 === "Earth" ? "稳定和承诺" : e1 === "Air" ? "沟通和变化" : "深度和情感连接"}。${z2.zh}座带来${e2 === "Fire" ? "热情和温暖" : e2 === "Earth" ? "可靠和感性" : e2 === "Air" ? "智力刺激" : "直觉和共情"}。\n\n## 沟通模式\n\n${score >= 70 ? "你们天然理解彼此的沟通方式。" : "你们需要努力理解彼此的沟通方式。"}\n\n## 长期潜力\n\n${score >= 85 ? "这对组合有极好的长期潜力，能量完美互补。" : score >= 70 ? "这是一对强有力的组合，保持沟通就有好的长期潜力。" : score >= 55 ? "长期成功是可能的，但需要有意识的努力和妥协。" : "这对组合面临重大挑战。如果双方都愿意成长，可以成功，但不会容易。"}\n\n## 获取你的专属配对解读\n\n太阳星座配对只是表面。你们的完整星盘——包括月亮星座、金星和第7宫——才揭示关系的真正故事。\n\n[免费算合盘 →](/compatibility/bazi)\n\n[解锁深度关系解读 · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
  };

  if (lang === "en" || lang === "zh") return L[lang];
  return {
    title: `${z1.en} + ${z2.en} Compatibility: ${score}/100`,
    excerpt: `${z1.en} and ${z2.en}: ${score}/100. ${verdict}. Love, communication, long-term potential.`,
    content: L.en.content,
  };
}

// ─── 生成塔罗牌义文章 ───
function generateTarotArticle(card, isMajor, lang) {
  const cardName = isMajor ? `${card.num}. ${card.en}` : card.en;
  const L = {
    en: {
      title: `${cardName} Tarot Card Meaning: Upright & Reversed Guide`,
      excerpt: `${cardName} tarot card. Core theme: ${card.theme}. Discover the upright meaning, reversed meaning, love, career, and advice for this card.`,
      content: `# ${cardName}: Complete Tarot Meaning\n\n## Core Theme\n\n${card.theme}.\n\n## Upright Meaning\n\nWhen ${cardName} appears upright, it signals ${card.theme.toLowerCase()}. This is a time to embrace the energy of this card fully.\n\n## Reversed Meaning\n\nWhen reversed, ${cardName} suggests blocked or excessive energy. You may be resisting the natural flow, or the card's energy may be manifesting in an unhealthy way.\n\n## In Love Readings\n\nIn matters of the heart, ${cardName} indicates ${card.theme.toLowerCase()}. Pay attention to how this theme plays out in your relationships.\n\n## In Career Readings\n\nFor work and career, ${cardName} points to ${card.theme.toLowerCase()} in your professional life.\n\n## Advice\n\nThe message of ${cardName}: ${card.theme}. Trust the process and allow this energy to guide you.\n\n## Go Beyond Tarot\n\nTarot gives you a snapshot of the moment. Your birth chart reveals the underlying patterns that shape every chapter of your life.\n\n[Generate your free natal chart →](/natal)\n\n[Unlock your 2026 Annual Report · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
    zh: {
      title: `${card.zh}塔罗牌义：正位与逆位完整解读`,
      excerpt: `${card.zh}塔罗牌。核心主题：${card.theme}。解析正位含义、逆位含义、感情、事业和建议。`,
      content: `# ${card.zh}：完整塔罗牌义\n\n## 核心主题\n\n${card.theme}。\n\n## 正位含义\n\n当${card.zh}正位出现时，它预示着${card.theme}。这是完全拥抱这张牌能量的时刻。\n\n## 逆位含义\n\n当逆位时，${card.zh}暗示能量受阻或过度。你可能在抗拒自然流动，或者这张牌的能量以不健康的方式显现。\n\n## 感情解读\n\n在感情问题中，${card.zh}表示${card.theme}。留意这个主题如何在你的关系中展开。\n\n## 事业解读\n\n在工作和事业中，${card.zh}指向你职业生活中的${card.theme}。\n\n## 建议\n\n${card.zh}的启示：${card.theme}。相信过程，让这股能量引导你。\n\n## 超越塔罗\n\n塔罗给你当下的快照。你的出生星盘揭示塑造你人生每一个篇章的底层模式。\n\n[免费生成星盘 →](/natal)\n\n[解锁2026年运报告 · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
  };

  if (lang === "en" || lang === "zh") return L[lang];
  return {
    title: `${cardName} Tarot Meaning`,
    excerpt: `${cardName}: ${card.theme}. Upright, reversed, love, career.`,
    content: L.en.content,
  };
}

// ─── 主生成逻辑 ───
function generateAll() {
  const articles = [];
  let id = 2000;
  const langs = ["zh", "en", "id", "th", "vi", "ms", "ja", "ko"];

  // 1. 日主专题（10篇）
  for (const dm of DAY_MASTERS) {
    const slug = `bazi-day-master-${dm.key}`;
    const title = {}, excerpt = {}, content = {};
    for (const lang of langs) {
      const r = generateDayMasterArticle(dm, lang);
      title[lang] = r.title; excerpt[lang] = r.excerpt; content[lang] = r.content;
    }
    articles.push({ id: String(id++), slug, category: "bazi", categoryZh: "八字", categoryEn: "BaZi", categoryId: "BaZi", title, excerpt, content, author: "星缘团队", authorEn: "Lunaxstar Team", date: "2026-01-01", readTime: 7 });
  }

  // 2. 星座配对（72篇 = 12×11/2）
  for (let i = 0; i < ZODIACS.length; i++) {
    for (let j = i + 1; j < ZODIACS.length; j++) {
      const z1 = ZODIACS[i], z2 = ZODIACS[j];
      const slug = `${z1.sign}-${z2.sign}-compatibility`;
      const title = {}, excerpt = {}, content = {};
      for (const lang of langs) {
        const r = generateCompatibilityArticle(z1, z2, lang);
        title[lang] = r.title; excerpt[lang] = r.excerpt; content[lang] = r.content;
      }
      articles.push({ id: String(id++), slug, category: "compatibility", categoryZh: "配对", categoryEn: "Compatibility", categoryId: "Kecocokan", title, excerpt, content, author: "星缘团队", authorEn: "Lunaxstar Team", date: "2026-01-01", readTime: 6 });
    }
  }

  // 3. 塔罗大阿卡纳（22篇）
  for (const card of TAROT_MAJOR) {
    const slug = `tarot-${card.en.toLowerCase().replace(/\s+/g, "-")}`;
    const title = {}, excerpt = {}, content = {};
    for (const lang of langs) {
      const r = generateTarotArticle(card, true, lang);
      title[lang] = r.title; excerpt[lang] = r.excerpt; content[lang] = r.content;
    }
    articles.push({ id: String(id++), slug, category: "tarot", categoryZh: "塔罗", categoryEn: "Tarot", categoryId: "Tarot", title, excerpt, content, author: "星缘团队", authorEn: "Lunaxstar Team", date: "2026-01-01", readTime: 5 });
  }

  // 4. 塔罗小阿卡纳数字牌（4花色×10=40篇）
  for (const suit of TAROT_SUITS) {
    for (let num = 1; num <= 10; num++) {
      const card = { num, en: `${num} of ${suit.en}`, zh: `${num}${suit.zh}`, theme: `${suit.theme} — ${num === 1 ? "new beginnings" : num === 10 ? "completion" : "phase " + num}` };
      const slug = `tarot-${num}-of-${suit.suit}`;
      const title = {}, excerpt = {}, content = {};
      for (const lang of langs) {
        const r = generateTarotArticle(card, false, lang);
        title[lang] = r.title; excerpt[lang] = r.excerpt; content[lang] = r.content;
      }
      articles.push({ id: String(id++), slug, category: "tarot", categoryZh: "塔罗", categoryEn: "Tarot", categoryId: "Tarot", title, excerpt, content, author: "星缘团队", authorEn: "Lunaxstar Team", date: "2026-01-01", readTime: 5 });
    }
  }

  return articles;
}

// ─── 输出 ───
const articles = generateAll();
const outputPath = path.join(__dirname, "..", "src", "app", "blog", "longtail-seo-articles-batch2.ts");

let tsContent = `// Auto-generated long-tail SEO articles Batch 2
// Day Masters (10) + Zodiac Compatibility (72) + Tarot (62) = 144 articles
// Generated by scripts/generate-longtail-batch2.js
// DO NOT EDIT MANUALLY

export const longtailSeoArticlesBatch2 = ${JSON.stringify(articles, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent, "utf-8");
console.log(`✅ Generated ${articles.length} articles → ${outputPath}`);
console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
console.log(`   Breakdown: 10 Day Masters + 72 Compatibility + 22 Major Arcana + 40 Minor Arcana`);
