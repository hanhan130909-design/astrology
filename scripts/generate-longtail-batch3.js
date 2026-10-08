/**
 * 第三批程序化SEO长尾文章生成器
 * 品类：行星落星座(120) + 星座维度(48) + 宫位专题(12) + 十神专题(10) = 190篇
 *
 * 用法: node scripts/generate-longtail-batch3.js
 * 输出: src/app/blog/longtail-seo-articles-batch3.ts
 */

const fs = require("fs");
const path = require("path");

// ─── 星座 ───
const ZODIACS = [
  { sign: "aries", symbol: "♈", en: "Aries", zh: "白羊", element: "Fire" },
  { sign: "taurus", symbol: "♉", en: "Taurus", zh: "金牛", element: "Earth" },
  { sign: "gemini", symbol: "♊", en: "Gemini", zh: "双子", element: "Air" },
  { sign: "cancer", symbol: "♋", en: "Cancer", zh: "巨蟹", element: "Water" },
  { sign: "leo", symbol: "♌", en: "Leo", zh: "狮子", element: "Fire" },
  { sign: "virgo", symbol: "♍", en: "Virgo", zh: "处女", element: "Earth" },
  { sign: "libra", symbol: "♎", en: "Libra", zh: "天秤", element: "Air" },
  { sign: "scorpio", symbol: "♏", en: "Scorpio", zh: "天蝎", element: "Water" },
  { sign: "sagittarius", symbol: "♐", en: "Sagittarius", zh: "射手", element: "Fire" },
  { sign: "capricorn", symbol: "♑", en: "Capricorn", zh: "摩羯", element: "Earth" },
  { sign: "aquarius", symbol: "♒", en: "Aquarius", zh: "水瓶", element: "Air" },
  { sign: "pisces", symbol: "♓", en: "Pisces", zh: "双鱼", element: "Water" },
];

// ─── 行星 ───
const PLANETS = [
  { key: "sun", en: "Sun", zh: "太阳", theme: "Identity, ego, life purpose", advice: "Shine authentically" },
  { key: "moon", en: "Moon", zh: "月亮", theme: "Emotions, instincts, inner self", advice: "Honor your feelings" },
  { key: "mercury", en: "Mercury", zh: "水星", theme: "Communication, thinking, learning", advice: "Express clearly" },
  { key: "venus", en: "Venus", zh: "金星", theme: "Love, beauty, values, relationships", advice: "Love what you value" },
  { key: "mars", en: "Mars", zh: "火星", theme: "Action, desire, energy, drive", advice: "Channel your passion" },
  { key: "jupiter", en: "Jupiter", zh: "木星", theme: "Expansion, luck, growth, wisdom", advice: "Think big" },
  { key: "saturn", en: "Saturn", zh: "土星", theme: "Discipline, structure, lessons, karma", advice: "Do the work" },
  { key: "uranus", en: "Uranus", zh: "天王星", theme: "Innovation, rebellion, freedom, change", advice: "Embrace the unexpected" },
  { key: "neptune", en: "Neptune", zh: "海王星", theme: "Dreams, spirituality, illusion, creativity", advice: "Trust your intuition" },
  { key: "pluto", en: "Pluto", zh: "冥王星", theme: "Transformation, power, rebirth, depth", advice: "Let go to grow" },
];

// ─── 宫位 ───
const HOUSES = [
  { num: 1, en: "1st House", zh: "第一宫", theme: "Self, identity, appearance, personality", life: "How you present yourself to the world" },
  { num: 2, en: "2nd House", zh: "第二宫", theme: "Money, possessions, self-worth, values", life: "Your relationship with material security" },
  { num: 3, en: "3rd House", zh: "第三宫", theme: "Communication, siblings, learning, local travel", life: "How you think and connect" },
  { num: 4, en: "4th House", zh: "第四宫", theme: "Home, family, roots, emotional foundation", life: "Your private life and inner security" },
  { num: 5, en: "5th House", zh: "第五宫", theme: "Creativity, romance, children, self-expression", life: "What you create and enjoy" },
  { num: 6, en: "6th House", zh: "第六宫", theme: "Work, health, service, daily routines", life: "Your daily habits and well-being" },
  { num: 7, en: "7th House", zh: "第七宫", theme: "Partnerships, marriage, contracts, open enemies", life: "Your significant relationships" },
  { num: 8, en: "8th House", zh: "第八宫", theme: "Transformation, shared resources, intimacy, death", life: "Deep merging and rebirth" },
  { num: 9, en: "9th House", zh: "第九宫", theme: "Higher learning, travel, philosophy, belief", life: "Your search for meaning" },
  { num: 10, en: "10th House", zh: "第十宫", theme: "Career, public image, ambition, authority", life: "Your legacy and public role" },
  { num: 11, en: "11th House", zh: "第十一宫", theme: "Friends, groups, hopes, humanitarian goals", life: "Your community and aspirations" },
  { num: 12, en: "12th House", zh: "第十二宫", theme: "Subconscious, spirituality, hidden things, sacrifice", life: "Your inner world and surrender" },
];

// ─── 十神 ───
const TEN_GODS = [
  { key: "direct-resource", en: "Direct Resource (Zheng Yin)", zh: "正印", theme: "Wisdom, nurturing, protection, learning", career: "Education, counseling, caregiving", advice: "Share your knowledge" },
  { key: "indirect-resource", en: "Indirect Resource (Pian Yin)", zh: "偏印", theme: "Unconventional wisdom, intuition, research", career: "Research, esoteric fields, innovation", advice: "Trust your unconventional insights" },
  { key: "eating-god", en: "Eating God (Shi Shen)", zh: "食神", theme: "Creativity, enjoyment, talent, generosity", career: "Arts, cooking, entertainment, teaching", advice: "Express your creativity freely" },
  { key: "hurting-officer", en: "Hurting Officer (Shang Guan)", zh: "伤官", theme: "Rebellion, innovation, performance, challenge", career: "Entrepreneurship, performing arts, activism", advice: "Channel your edge productively" },
  { key: "direct-wealth", en: "Direct Wealth (Zheng Cai)", zh: "正财", theme: "Steady income, practicality, frugality", career: "Finance, stable business, accounting", advice: "Build steadily" },
  { key: "indirect-wealth", en: "Indirect Wealth (Pian Cai)", zh: "偏财", theme: "Windfall, risk-taking, variable income", career: "Investment, sales, entrepreneurship", advice: "Take calculated risks" },
  { key: "direct-officer", en: "Direct Officer (Zheng Guan)", zh: "正官", theme: "Authority, rules, responsibility, status", career: "Management, government, law", advice: "Lead with integrity" },
  { key: "seven-killings", en: "Seven Killings (Qi Sha)", zh: "七杀", theme: "Power, pressure, ambition, intensity", career: "Military, surgery, high-stakes business", advice: "Transform pressure into power" },
  { key: "parallel", en: "Parallel (Bi Jian)", zh: "比肩", theme: "Independence, competition, peers, self-reliance", career: "Solo business, competitive fields", advice: "Collaborate, don't compete" },
  { key: "rob-wealth", en: "Rob Wealth (Jie Cai)", zh: "劫财", theme: "Partnership, sharing, ambition, impulsiveness", career: "Partnerships, team ventures, sales", advice: "Share the wealth" },
];

// ─── 生成行星落星座文章 ───
function generatePlanetInSign(planet, sign, lang) {
  const L = {
    en: {
      title: `${planet.en} in ${sign.en}: Complete Astrology Guide`,
      excerpt: `${planet.en} in ${sign.en} (${sign.element}). ${planet.theme}. Discover how this placement shapes your personality, relationships, and life path.`,
      content: `# ${planet.en} in ${sign.en}: The Complete Guide\n\n## Core Energy\n\nWith ${planet.en} in ${sign.en}, ${planet.theme.toLowerCase()} takes on a ${sign.element.toLowerCase()} quality. ${sign.en} brings its signature energy to how you experience ${planet.theme.toLowerCase()}.\n\n## Personality\n\nThis placement gives you a distinctive approach to ${planet.theme.toLowerCase()}. You express ${planet.en.toLowerCase()} energy through the lens of ${sign.en} — ${sign.element === "Fire" ? "boldly and enthusiastically" : sign.element === "Earth" ? "practically and steadily" : sign.element === "Air" ? "intellectually and socially" : "emotionally and intuitively"}.\n\n## Relationships\n\nIn relationships, ${planet.en} in ${sign.en} influences how you ${planet.key === "venus" ? "love and connect" : planet.key === "mars" ? "pursue desire and take action" : planet.key === "moon" ? "process emotions and seek security" : "express your core needs"}.\n\n## Career & Life Path\n\n${planet.en} in ${sign.en} suggests ${planet.advice.toLowerCase()} through ${sign.element === "Fire" ? "bold action and leadership" : sign.element === "Earth" ? "practical application and patience" : sign.element === "Air" ? "communication and networking" : "emotional intelligence and intuition"}.\n\n## Challenges & Growth\n\nThe shadow side of this placement: ${sign.element === "Fire" ? "impatience and burnout" : sign.element === "Earth" ? "stubbornness and resistance to change" : sign.element === "Air" ? "overthinking and detachment" : "emotional overwhelm and escapism"}. The key is balance.\n\n## Go Deeper\n\nYour ${planet.en} sign is just one piece of your chart. Your full natal chart — including houses, aspects, and planetary patterns — reveals the complete story.\n\n[Generate your free natal chart →](/natal)\n\n[Unlock your 2026 Annual Report · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
    zh: {
      title: `${planet.zh}落${sign.zh}座：完整占星解读`,
      excerpt: `${planet.zh}落${sign.zh}座（${sign.element === "Fire" ? "火象" : sign.element === "Earth" ? "土象" : sign.element === "Air" ? "风象" : "水象"}）。${planet.theme}。解析这个配置如何塑造你的性格、关系和人生道路。`,
      content: `# ${planet.zh}落${sign.zh}座：完整解读\n\n## 核心能量\n\n${planet.zh}落${sign.zh}座，${planet.theme}呈现出${sign.element === "Fire" ? "火象" : sign.element === "Earth" ? "土象" : sign.element === "Air" ? "风象" : "水象"}特质。${sign.zh}座的能量深刻影响你体验${planet.theme}的方式。\n\n## 性格特质\n\n这个配置赋予你独特的${planet.theme}表达方式。你通过${sign.zh}座的镜头——${sign.element === "Fire" ? "大胆而热情" : sign.element === "Earth" ? "务实而稳定" : sign.element === "Air" ? "理智而善交" : "感性而直觉"}——来展现${planet.zh}能量。\n\n## 感情关系\n\n在关系中，${planet.zh}落${sign.zh}座影响你${planet.key === "venus" ? "爱和连接的方式" : planet.key === "mars" ? "追求欲望和采取行动的方式" : planet.key === "moon" ? "处理情绪和寻求安全感的方式" : "表达核心需求的方式"}。\n\n## 事业与人生\n\n${planet.zh}落${sign.zh}座建议你通过${sign.element === "Fire" ? "大胆行动和领导力" : sign.element === "Earth" ? "实际应用和耐心" : sign.element === "Air" ? "沟通和社交" : "情商和直觉"}来${planet.advice}。\n\n## 挑战与成长\n\n这个配置的阴影面：${sign.element === "Fire" ? "急躁和 burnout" : sign.element === "Earth" ? "固执和抗拒变化" : sign.element === "Air" ? "过度思考和疏离" : "情绪过载和逃避"}。关键在于平衡。\n\n## 深入探索\n\n你的${planet.zh}星座只是星盘的一部分。完整的出生星盘——包括宫位、相位和行星格局——才揭示完整的故事。\n\n[免费生成星盘 →](/natal)\n\n[解锁2026年运报告 · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
  };
  if (lang === "en" || lang === "zh") return L[lang];
  return { title: `${planet.en} in ${sign.en}: Guide`, excerpt: `${planet.en} in ${sign.en}. ${planet.theme}.`, content: L.en.content };
}

// ─── 生成星座维度文章（上升/月亮/金星/火星）───
function generateSignDimension(dimension, sign, lang) {
  const dims = {
    rising: { en: "Rising Sign (Ascendant)", zh: "上升星座", theme: "How you appear to others, your mask, first impressions", focus: "outer presentation and approach to life" },
    moon: { en: "Moon Sign", zh: "月亮星座", theme: "Your emotional nature, inner self, what makes you feel secure", focus: "emotional needs and inner world" },
    venus: { en: "Venus Sign", zh: "金星星座", theme: "How you love, what you find beautiful, your values", focus: "love style and relationship values" },
    mars: { en: "Mars Sign", zh: "火星星座", theme: "How you take action, your desires, energy and drive", focus: "action style and passion" },
  };
  const d = dims[dimension];
  const L = {
    en: {
      title: `${sign.symbol} ${sign.en} ${d.en}: Complete Guide`,
      excerpt: `${sign.en} ${d.en.toLowerCase()}. ${d.theme}. Discover how this placement shapes your ${d.focus}.`,
      content: `# ${sign.symbol} ${sign.en} ${d.en}\n\n## What It Means\n\nYour ${d.en.toLowerCase()} in ${sign.en} defines ${d.theme.toLowerCase()}. This is one of the most important placements in your chart for understanding ${d.focus}.\n\n## Key Traits\n\nWith ${d.en} in ${sign.en}, you approach ${d.focus} with ${sign.element === "Fire" ? "enthusiasm and courage" : sign.element === "Earth" ? "practicality and patience" : sign.element === "Air" ? "curiosity and versatility" : "depth and emotional intelligence"}.\n\n## How It Shows Up\n\n- **At your best:** ${sign.element === "Fire" ? "Bold, inspiring, a natural leader" : sign.element === "Earth" ? "Reliable, grounded, consistent" : sign.element === "Air" ? "Adaptable, communicative, clever" : "Intuitive, empathetic, deeply connected"}\n- **Shadow side:** ${sign.element === "Fire" ? "Impulsive, impatient, burns out" : sign.element === "Earth" ? "Stubborn, slow to change, materialistic" : sign.element === "Air" ? "Scattered, superficial, indecisive" : "Overly sensitive, escapist, moody"}\n\n## In Relationships\n\nThis placement significantly impacts how you relate to others. Understanding your ${d.en.toLowerCase()} helps you recognize your patterns and needs.\n\n## Get Your Full Chart\n\nYour ${d.en} is just one layer. Your complete natal chart — Sun, Moon, Rising, all planets, houses, and aspects — tells the full story.\n\n[Calculate your free chart →](/natal)\n\n[Unlock your personalized Annual Report · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
    zh: {
      title: `${sign.symbol} ${sign.zh}座${d.zh}：完整解读`,
      excerpt: `${sign.zh}座${d.zh}。${d.theme}。解析这个配置如何塑造你的${d.focus}。`,
      content: `# ${sign.symbol} ${sign.zh}座${d.zh}\n\n## 含义\n\n你的${d.zh}在${sign.zh}座，定义了${d.theme}。这是星盘中理解${d.focus}最重要的配置之一。\n\n## 核心特质\n\n${d.zh}在${sign.zh}座，你以${sign.element === "Fire" ? "热情和勇气" : sign.element === "Earth" ? "务实和耐心" : sign.element === "Air" ? "好奇和多变" : "深度和情商"}的方式处理${d.focus}。\n\n## 表现\n\n- **最佳状态：** ${sign.element === "Fire" ? "大胆、鼓舞人心、天生领袖" : sign.element === "Earth" ? "可靠、踏实、始终如一" : sign.element === "Air" ? "适应力强、善沟通、聪明" : "直觉强、有同理心、深度连接"}\n- **阴影面：** ${sign.element === "Fire" ? "冲动、没耐心、容易 burnout" : sign.element === "Earth" ? "固执、难改变、物质主义" : sign.element === "Air" ? "分散、肤浅、优柔寡断" : "过度敏感、逃避、情绪化"}\n\n## 感情关系\n\n这个配置显著影响你与他人的关系方式。理解你的${d.zh}能帮你认清自己的模式和需求。\n\n## 获取完整星盘\n\n你的${d.zh}只是一层。完整的出生星盘——太阳、月亮、上升、所有行星、宫位和相位——才讲述完整故事。\n\n[免费排盘 →](/natal)\n\n[解锁个性化年运报告 · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
  };
  if (lang === "en" || lang === "zh") return L[lang];
  return { title: `${sign.en} ${d.en}: Guide`, excerpt: `${sign.en} ${d.en}. ${d.theme}.`, content: L.en.content };
}

// ─── 生成宫位专题文章 ───
function generateHouseArticle(house, lang) {
  const L = {
    en: {
      title: `${house.en} in Astrology: Complete Meaning & Interpretation`,
      excerpt: `${house.en}: ${house.theme}. Discover how this house shapes ${house.life.toLowerCase()} in your natal chart.`,
      content: `# ${house.en}: The Complete Guide\n\n## What Is the ${house.en}?\n\nThe ${house.en} governs ${house.theme.toLowerCase()}. In your natal chart, this house represents ${house.life.toLowerCase()}.\n\n## Key Themes\n\n- ${house.theme.split(", ")[0]}\n- ${house.theme.split(", ")[1] || "Core life area"}\n- ${house.theme.split(", ")[2] || "Personal growth"}\n\n## How It Works\n\nThe ${house.en} is one of the 12 houses that map different areas of life. Planets in this house energize these themes, while the sign on the cusp colors how you experience them.\n\n## What It Means for You\n\nTo understand your ${house.en}, look at:\n1. Which sign is on the cusp\n2. Which planets fall inside\n3. Any aspects to those planets\n\nThe combination reveals your unique experience of ${house.theme.toLowerCase()}.\n\n## Discover Your Chart\n\nYour house placements tell the story of your life. Generate your free chart to see which planets fall in each house.\n\n[Generate your free natal chart →](/natal)\n\n[Unlock your 2026 Annual Report · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
    zh: {
      title: `占星${house.zh}：完整含义与解读`,
      excerpt: `${house.zh}：${house.theme}。解析这个宫位如何塑造你星盘中的${house.life}。`,
      content: `# ${house.zh}：完整解读\n\n## 什么是${house.zh}？\n\n${house.zh}主宰${house.theme}。在你的出生星盘中，这个宫位代表${house.life}。\n\n## 核心主题\n\n- ${house.theme.split(", ")[0]}\n- ${house.theme.split(", ")[1] || "核心生活领域"}\n- ${house.theme.split(", ")[2] || "个人成长"}\n\n## 如何运作\n\n${house.zh}是映射不同生活领域的12宫之一。落入此宫的行星会激活这些主题，而宫头星座则决定你体验它们的方式。\n\n## 对你意味着什么\n\n要理解你的${house.zh}，需要看：\n1. 宫头是什么星座\n2. 哪些行星落入此宫\n3. 这些行星的相位\n\n组合起来揭示你在${house.theme}方面的独特体验。\n\n## 探索你的星盘\n\n你的宫位配置讲述人生故事。免费排盘看看哪些行星落入各宫。\n\n[免费生成星盘 →](/natal)\n\n[解锁2026年运报告 · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
  };
  if (lang === "en" || lang === "zh") return L[lang];
  return { title: `${house.en}: Complete Guide`, excerpt: `${house.en}: ${house.theme}.`, content: L.en.content };
}

// ─── 生成十神专题文章 ───
function generateTenGodArticle(god, lang) {
  const L = {
    en: {
      title: `${god.en} in BaZi: Complete Meaning & Life Guide`,
      excerpt: `${god.en} (${god.zh}): ${god.theme}. Discover how this Ten God shapes your personality, career, and relationships in Chinese astrology.`,
      content: `# ${god.en}: The Complete BaZi Guide\n\n## What Is ${god.en}?\n\nIn BaZi (Chinese astrology), the ${god.en} represents ${god.theme.toLowerCase()}. It's one of the Ten Gods that describe different energies and life patterns.\n\n## Personality\n\nWhen ${god.en} is prominent in your chart, you tend to express ${god.theme.toLowerCase()} as a core part of your identity.\n\n## Career\n\n${god.career}. These fields align naturally with your energetic blueprint.\n\n## Relationships\n\n${god.en} influences how you relate to others — particularly around themes of ${god.theme.toLowerCase()}.\n\n## Advice\n\n${god.advice}. This is the key to making the most of this energy.\n\n## Get Your BaZi Chart\n\nYour Ten Gods configuration reveals your life patterns. Calculate your free BaZi chart to see which gods dominate your chart.\n\n[Calculate your free BaZi chart →](/bazi)\n\n[Unlock your complete 2026 Annual Report · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
    zh: {
      title: `八字${god.zh}（${god.en}）：完整含义与人生指南`,
      excerpt: `${god.zh}：${god.theme}。解析这个十神如何在八字中塑造你的性格、事业和人际关系。`,
      content: `# 八字${god.zh}：完整解读\n\n## 什么是${god.zh}？\n\n在八字中，${god.zh}代表${god.theme}。它是描述不同能量和人生模式的十神之一。\n\n## 性格特质\n\n当${god.zh}在你命盘中突出时，你倾向于将${god.theme}作为身份的核心部分来表达。\n\n## 事业方向\n\n${god.career}。这些领域与你的能量蓝图自然契合。\n\n## 人际关系\n\n${god.zh}影响你与他人的关系方式——特别是围绕${god.theme}的主题。\n\n## 建议\n\n${god.advice}。这是最大化利用这股能量的关键。\n\n## 获取你的八字\n\n你的十神配置揭示人生模式。免费排盘看看哪些十神主导你的命盘。\n\n[免费八字排盘 →](/bazi)\n\n[解锁2026完整年运报告 · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
    },
  };
  if (lang === "en" || lang === "zh") return L[lang];
  return { title: `${god.en}: Complete Guide`, excerpt: `${god.en}: ${god.theme}.`, content: L.en.content };
}

// ─── 主生成逻辑 ───
function generateAll() {
  const articles = [];
  let id = 3000;
  const langs = ["zh", "en", "id", "th", "vi", "ms", "ja", "ko"];

  // 1. 行星落星座（10×12=120篇）
  for (const planet of PLANETS) {
    for (const sign of ZODIACS) {
      const slug = `${planet.key}-in-${sign.sign}`;
      const title = {}, excerpt = {}, content = {};
      for (const lang of langs) {
        const r = generatePlanetInSign(planet, sign, lang);
        title[lang] = r.title; excerpt[lang] = r.excerpt; content[lang] = r.content;
      }
      articles.push({ id: String(id++), slug, category: "natal", categoryZh: "星盘", categoryEn: "Natal Chart", categoryId: "Carta Natal", title, excerpt, content, author: "星缘团队", authorEn: "Lunaxstar Team", date: "2026-01-01", readTime: 6 });
    }
  }

  // 2. 星座维度：上升/月亮/金星/火星（4×12=48篇）
  for (const dim of ["rising", "moon", "venus", "mars"]) {
    for (const sign of ZODIACS) {
      const slug = `${dim}-sign-in-${sign.sign}`;
      const title = {}, excerpt = {}, content = {};
      for (const lang of langs) {
        const r = generateSignDimension(dim, sign, lang);
        title[lang] = r.title; excerpt[lang] = r.excerpt; content[lang] = r.content;
      }
      articles.push({ id: String(id++), slug, category: "natal", categoryZh: "星盘", categoryEn: "Natal Chart", categoryId: "Carta Natal", title, excerpt, content, author: "星缘团队", authorEn: "Lunaxstar Team", date: "2026-01-01", readTime: 5 });
    }
  }

  // 3. 宫位专题（12篇）
  for (const house of HOUSES) {
    const slug = `astrology-${house.num}th-house-meaning`;
    const title = {}, excerpt = {}, content = {};
    for (const lang of langs) {
      const r = generateHouseArticle(house, lang);
      title[lang] = r.title; excerpt[lang] = r.excerpt; content[lang] = r.content;
    }
    articles.push({ id: String(id++), slug, category: "natal", categoryZh: "星盘", categoryEn: "Natal Chart", categoryId: "Carta Natal", title, excerpt, content, author: "星缘团队", authorEn: "Lunaxstar Team", date: "2026-01-01", readTime: 6 });
  }

  // 4. 十神专题（10篇）
  for (const god of TEN_GODS) {
    const slug = `bazi-ten-god-${god.key}`;
    const title = {}, excerpt = {}, content = {};
    for (const lang of langs) {
      const r = generateTenGodArticle(god, lang);
      title[lang] = r.title; excerpt[lang] = r.excerpt; content[lang] = r.content;
    }
    articles.push({ id: String(id++), slug, category: "bazi", categoryZh: "八字", categoryEn: "BaZi", categoryId: "BaZi", title, excerpt, content, author: "星缘团队", authorEn: "Lunaxstar Team", date: "2026-01-01", readTime: 7 });
  }

  return articles;
}

// ─── 输出 ───
const articles = generateAll();
const outputPath = path.join(__dirname, "..", "src", "app", "blog", "longtail-seo-articles-batch3.ts");

let tsContent = `// Auto-generated long-tail SEO articles Batch 3
// Planet in Sign (120) + Sign Dimensions (48) + Houses (12) + Ten Gods (10) = 190 articles
// Generated by scripts/generate-longtail-batch3.js
// DO NOT EDIT MANUALLY

export const longtailSeoArticlesBatch3 = ${JSON.stringify(articles, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent, "utf-8");
console.log(`✅ Generated ${articles.length} articles → ${outputPath}`);
console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
console.log(`   Breakdown: 120 Planet-in-Sign + 48 Sign Dimensions + 12 Houses + 10 Ten Gods`);
