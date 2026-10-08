/**
 * 程序化SEO长尾文章生成器
 * 生成 12星座 × 12月 = 144篇月度运势文章
 * 每篇8语言、800+字、底部带内链和转化引导
 *
 * 用法: node scripts/generate-longtail-articles.js
 * 输出: src/app/blog/longtail-seo-articles.ts
 */

const fs = require("fs");
const path = require("path");

// ─── 星座数据 ───
const ZODIACS = [
  { sign: "aries", symbol: "♈", en: "Aries", zh: "白羊座", id: "Aries", th: "แกะ", vi: "Bạch Dương", ms: "Aries", ja: "牡羊座", ko: "양자리", dates: "3.21-4.19", element: "Fire", ruler: "Mars" },
  { sign: "taurus", symbol: "♉", en: "Taurus", zh: "金牛座", id: "Taurus", th: "วัว", vi: "Kim Ngưu", ms: "Taurus", ja: "牡牛座", ko: "황소자리", dates: "4.20-5.20", element: "Earth", ruler: "Venus" },
  { sign: "gemini", symbol: "♊", en: "Gemini", zh: "双子座", id: "Gemini", th: "เมถุน", vi: "Song Tử", ms: "Gemini", ja: "双子座", ko: "쌍둥이자리", dates: "5.21-6.21", element: "Air", ruler: "Mercury" },
  { sign: "cancer", symbol: "♋", en: "Cancer", zh: "巨蟹座", id: "Cancer", th: "กรกฎ", vi: "Cự Giải", ms: "Cancer", ja: "蟹座", ko: "게자리", dates: "6.22-7.22", element: "Water", ruler: "Moon" },
  { sign: "leo", symbol: "♌", en: "Leo", zh: "狮子座", id: "Leo", th: "สิงห์", vi: "Sư Tử", ms: "Leo", ja: "獅子座", ko: "사자자리", dates: "7.23-8.22", element: "Fire", ruler: "Sun" },
  { sign: "virgo", symbol: "♍", en: "Virgo", zh: "处女座", id: "Virgo", th: "กันย์", vi: "Xử Nữ", ms: "Virgo", ja: "乙女座", ko: "처녀자리", dates: "8.23-9.22", element: "Earth", ruler: "Mercury" },
  { sign: "libra", symbol: "♎", en: "Libra", zh: "天秤座", id: "Libra", th: "ตุลย์", vi: "Thiên Bình", ms: "Libra", ja: "天秤座", ko: "천칭자리", dates: "9.23-10.23", element: "Air", ruler: "Venus" },
  { sign: "scorpio", symbol: "♏", en: "Scorpio", zh: "天蝎座", id: "Scorpio", th: "พิจิก", vi: "Bọ Cạp", ms: "Scorpio", ja: "蠍座", ko: "전갈자리", dates: "10.24-11.22", element: "Water", ruler: "Pluto" },
  { sign: "sagittarius", symbol: "♐", en: "Sagittarius", zh: "射手座", id: "Sagittarius", th: "ธนู", vi: "Nhân Mã", ms: "Sagittarius", ja: "射手座", ko: "궁수자리", dates: "11.23-12.21", element: "Fire", ruler: "Jupiter" },
  { sign: "capricorn", symbol: "♑", en: "Capricorn", zh: "摩羯座", id: "Capricorn", th: "มังกร", vi: "Ma Kết", ms: "Capricorn", ja: "山羊座", ko: "염소자리", dates: "12.22-1.19", element: "Earth", ruler: "Saturn" },
  { sign: "aquarius", symbol: "♒", en: "Aquarius", zh: "水瓶座", id: "Aquarius", th: "กุมภ์", vi: "Bảo Bình", ms: "Aquarius", ja: "水瓶座", ko: "물병자리", dates: "1.20-2.18", element: "Air", ruler: "Uranus" },
  { sign: "pisces", symbol: "♓", en: "Pisces", zh: "双鱼座", id: "Pisces", th: "มีน", vi: "Song Ngư", ms: "Pisces", ja: "魚座", ko: "물고기자리", dates: "2.19-3.20", element: "Water", ruler: "Neptune" },
];

// ─── 月份数据 ───
const MONTHS = [
  { num: 1, en: "January", zh: "1月", id: "Januari", th: "มกราคม", vi: "Tháng 1", ms: "Januari", ja: "1月", ko: "1월" },
  { num: 2, en: "February", zh: "2月", id: "Februari", th: "กุมภาพันธ์", vi: "Tháng 2", ms: "Februari", ja: "2月", ko: "2월" },
  { num: 3, en: "March", zh: "3月", id: "Maret", th: "มีนาคม", vi: "Tháng 3", ms: "Mac", ja: "3月", ko: "3월" },
  { num: 4, en: "April", zh: "4月", id: "April", th: "เมษายน", vi: "Tháng 4", ms: "April", ja: "4月", ko: "4월" },
  { num: 5, en: "May", zh: "5月", id: "Mei", th: "พฤษภาคม", vi: "Tháng 5", ms: "Mei", ja: "5月", ko: "5월" },
  { num: 6, en: "June", zh: "6月", id: "Juni", th: "มิถุนายน", vi: "Tháng 6", ms: "Jun", ja: "6月", ko: "6월" },
  { num: 7, en: "July", zh: "7月", id: "Juli", th: "กรกฎาคม", vi: "Tháng 7", ms: "Julai", ja: "7月", ko: "7월" },
  { num: 8, en: "August", zh: "8月", id: "Agustus", th: "สิงหาคม", vi: "Tháng 8", ms: "Ogos", ja: "8月", ko: "8월" },
  { num: 9, en: "September", zh: "9月", id: "September", th: "กันยายน", vi: "Tháng 9", ms: "September", ja: "9月", ko: "9월" },
  { num: 10, en: "October", zh: "10月", id: "Oktober", th: "ตุลาคม", vi: "Tháng 10", ms: "Oktober", ja: "10月", ko: "10월" },
  { num: 11, en: "November", zh: "11月", id: "November", th: "พฤศจิกายน", vi: "Tháng 11", ms: "November", ja: "11月", ko: "11월" },
  { num: 12, en: "December", zh: "12月", id: "Desember", th: "ธันวาคม", vi: "Tháng 12", ms: "Disember", ja: "12月", ko: "12월" },
];

// ─── 月度主题（按月份变化，避免内容重复）───
const MONTH_THEMES = {
  1: { focus: "New beginnings & planning", career: "Set intentions for the year", love: "Reflect on what you want", money: "Budget review", tip: "Slow start, strong finish" },
  2: { focus: "Relationships & connection", career: "Collaboration opportunities", love: "Deepen bonds", money: "Unexpected expenses", tip: "Communication is key" },
  3: { focus: "Growth & momentum", career: "Take initiative", love: "New possibilities", money: "Investment window", tip: "Plant seeds now" },
  4: { focus: "Action & breakthrough", career: "Major projects launch", love: "Passion peaks", money: "Financial decisions", tip: "Bold moves pay off" },
  5: { focus: "Creativity & expression", career: "Showcase your work", love: "Romance flourishes", money: "Earning potential rises", tip: "Let your light shine" },
  6: { focus: "Home & family", career: "Work-life balance", love: "Domestic harmony", money: "Home-related spending", tip: "Nurture your roots" },
  7: { focus: "Emotional depth", career: "Introspection & strategy", love: "Intense connections", money: "Shared resources", tip: "Go deep, not wide" },
  8: { focus: "Power & transformation", career: "Leadership moments", love: "Passion & power dynamics", money: "Major financial shifts", tip: "Own your authority" },
  9: { focus: "Service & refinement", career: "Details matter", love: "Practical romance", money: "Organize finances", tip: "Perfect your craft" },
  10: { focus: "Partnership & balance", career: "Key negotiations", love: "Commitment decisions", money: "Joint ventures", tip: "Find your equilibrium" },
  11: { focus: "Intensity & rebirth", career: "Strategic pivots", love: "Deep transformation", money: "Debt & shared wealth", tip: "Embrace the phoenix" },
  12: { focus: "Expansion & celebration", career: "Year-end rewards", love: "Joy & connection", money: "Bonus & generosity", tip: "Celebrate your wins" },
};

// ─── 元素特质 ───
const ELEMENT_TRAITS = {
  Fire: { strength: "Courage, passion, initiative", shadow: "Impatience, burnout", advice: "Channel energy into focused action" },
  Earth: { strength: "Stability, reliability, practicality", shadow: "Stubbornness, resistance to change", advice: "Stay grounded but remain flexible" },
  Air: { strength: "Intellect, communication, adaptability", shadow: "Overthinking, detachment", advice: "Think less, connect more" },
  Water: { strength: "Intuition, empathy, depth", shadow: "Emotional overwhelm, escapism", advice: "Trust your feelings but don't drown in them" },
};

// ─── 生成单篇文章内容（指定语言）───
function generateArticleContent(zodiac, month, lang) {
  const t = MONTH_THEMES[month.num];
  const et = ELEMENT_TRAITS[zodiac.element];
  const z = zodiac;
  const m = month;

  const L = {
    en: {
      title: `${z.symbol} ${z.en} ${m.en} 2026 Horoscope: Complete Monthly Forecast`,
      excerpt: `${z.en} (${z.dates}). ${m.en} 2026 brings ${t.focus.toLowerCase()}. Discover your career, love, money, and health forecast for this month — plus key dates and actionable advice.`,
      h1: `${z.symbol} ${z.en} ${m.en} 2026: Your Complete Monthly Horoscope`,
      intro: `${m.en} 2026 is a month of ${t.focus.toLowerCase()} for ${z.en}. As a ${z.element.toLowerCase()} sign ruled by ${z.ruler}, you bring ${et.strength.toLowerCase()} to every situation — but this month also tests your ${et.shadow.toLowerCase()}. Here's what to expect across every area of life, and how to make the most of the energy.`,
      overview: `## Monthly Overview\n\nThe cosmic weather in ${m.en} emphasizes ${t.focus.toLowerCase()}. For ${z.en}, this means ${t.tip.toLowerCase()}. Your ruling planet ${z.ruler} is active, amplifying your natural strengths. The key is balance: lean into your ${et.strength.toLowerCase()} while being mindful of ${et.shadow.toLowerCase()}.`,
      career: `## Career & Work\n\n${t.career}. ${z.en} natives thrive when they can apply their ${et.strength.toLowerCase()} to professional challenges. This month, look for opportunities that let you ${t.tip.toLowerCase()}.\n\n- **Best days for action:** The first week of ${m.en}\n- **Watch for:** Miscommunication mid-month\n- **Opportunity:** A colleague or mentor offers valuable insight\n- **Advice:** ${et.advice}`,
      love: `## Love & Relationships\n\n${t.love}. For single ${z.en}, this month brings unexpected connections. For those in relationships, focus on deepening trust and intimacy.\n\n- **Single:** Be open to meeting someone through work or a friend\n- **In a relationship:** Plan something spontaneous together\n- **Key date:** Around the ${m.num}15th, emotions run high\n- **Advice:** ${et.advice}`,
      money: `## Money & Finances\n\n${t.money}. ${z.en} should pay extra attention to financial decisions this month.\n\n- **Income:** Potential for unexpected earnings\n- **Expenses:** ${t.money.includes("unexpected") ? "Budget for surprises" : "Review recurring expenses"}\n- **Investment:** Consider long-term over short-term\n- **Advice:** ${et.advice}`,
      health: `## Health & Wellbeing\n\nYour ${z.element.toLowerCase()} energy needs proper management this month. ${z.en} natives are prone to ${et.shadow.toLowerCase()} when stressed.\n\n- **Focus on:** ${z.element === "Fire" ? "Rest and hydration" : z.element === "Earth" ? "Movement and flexibility" : z.element === "Air" ? "Grounding practices" : "Emotional boundaries"}\n- **Avoid:** Overcommitting\n- **Best practice:** Daily movement + adequate sleep\n- **Advice:** ${et.advice}`,
      keydates: `## Key Dates to Watch\n\n- **${m.en} 3-5:** High energy, good for action\n- **${m.en} 12-14:** Emotional intensity, think before speaking\n- **${m.en} 20-22:** Social opportunities, networking favored\n- **${m.en} 28-30:** Reflection and planning for next month`,
      cta: `## Get Your Personalized Reading\n\nThis monthly horoscope is for all ${z.en} — but your individual birth chart tells a much more specific story. Your rising sign, moon sign, and planetary houses determine how this month's energy affects *you* personally.\n\n[Generate your free natal chart →](/natal)\n\nFor a deep, personalized reading of your entire 2026 — including career timing, relationship cycles, and wealth windows — unlock the AI Annual Report.\n\n[Unlock Your 2026 Annual Report · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
      related: `## Related Articles\n\n- [${z.en} Compatibility: Who Are You Most Compatible With?](/blog/${z.sign}-compatibility-guide)\n- [${z.en} Personality Traits: The Complete Guide](/blog/${z.sign}-personality-traits)\n- [All 12 Zodiac Signs: 2026 Yearly Horoscope](/blog/2026-yearly-horoscope-all-signs)`,
    },
    zh: {
      title: `${z.symbol} ${z.zh}2026年${m.zh}运势完整版`,
      excerpt: `${z.zh}（${z.dates}）。2026年${m.zh}主题是${t.focus}。本月事业、感情、财运、健康运势全解析，附关键日期和行动建议。`,
      h1: `${z.symbol} ${z.zh}2026年${m.zh}运势：完整月度指南`,
      intro: `2026年${m.zh}对${z.zh}来说是${t.focus}的一个月。作为${z.element === "Fire" ? "火象" : z.element === "Earth" ? "土象" : z.element === "Air" ? "风象" : "水象"}星座，守护星为${z.ruler}，你天生具备${et.strength}的特质——但本月也会考验你${et.shadow}的一面。以下是各领域运势详解，以及如何最大化利用本月能量。`,
      overview: `## 月度总览\n\n${m.zh}的宇宙能量强调${t.focus}。对${z.zh}来说，这意味着${t.tip}。你的守护星${z.ruler}活跃，放大你的天生优势。关键在于平衡：发挥${et.strength}，同时留意${et.shadow}。`,
      career: `## 事业与工作\n\n${t.career}。${z.zh}在工作中擅长发挥${et.strength}。本月寻找能让你${t.tip}的机会。\n\n- **最佳行动日：** ${m.zh}第一周\n- **注意：** 月中可能有沟通误会\n- **机会：** 同事或导师提供有价值的见解\n- **建议：** ${et.advice}`,
      love: `## 感情与人际关系\n\n${t.love}。单身的${z.zh}本月有意外邂逅。有伴的${z.zh}重点在加深信任和亲密感。\n\n- **单身：** 开放心态，可能通过工作或朋友认识新人\n- **有伴：** 一起做些 spontaneity 的事\n- **关键日：** ${m.zh}15日前后，情绪高涨\n- **建议：** ${et.advice}`,
      money: `## 财运\n\n${t.money}。${z.zh}本月需特别关注财务决策。\n\n- **收入：** 可能有意外之财\n- **支出：** ${t.money.includes("unexpected") ? "预留意外开支预算" : "检查固定支出"}\n- **投资：** 考虑长期而非短期\n- **建议：** ${et.advice}`,
      health: `## 健康\n\n本月你的${z.element === "Fire" ? "火象" : z.element === "Earth" ? "土象" : z.element === "Air" ? "风象" : "水象"}能量需要妥善管理。${z.zh}压力大时容易出现${et.shadow}。\n\n- **重点：** ${z.element === "Fire" ? "休息和补水" : z.element === "Earth" ? "运动和灵活性" : z.element === "Air" ? "接地练习" : "情绪边界"}\n- **避免：** 过度承诺\n- **最佳习惯：** 每日运动+充足睡眠\n- **建议：** ${et.advice}`,
      keydates: `## 关键日期\n\n- **${m.zh}3-5日：** 能量高，适合行动\n- **${m.zh}12-14日：** 情绪强烈，三思而后言\n- **${m.zh}20-22日：** 社交机会，利于人脉拓展\n- **${m.zh}28-30日：** 反思和规划下月`,
      cta: `## 获取你的专属解读\n\n这份月度运势是给所有${z.zh}的——但你的个人星盘讲述的故事要具体得多。你的上升星座、月亮星座和行星宫位决定了本月能量如何影响*你个人*。\n\n[免费生成你的本命星盘 →](/natal)\n\n想要深度、个性化的2026全年解读——包括事业时机、感情周期和财富窗口——解锁AI年度报告。\n\n[解锁2026年度报告 · $19.99](https://hanhan55.gumroad.com/l/zxccdv)`,
      related: `## 相关文章\n\n- [${z.zh}配对：你和谁最配？](/blog/${z.sign}-compatibility-guide)\n- [${z.zh}性格特质完整解析](/blog/${z.sign}-personality-traits)\n- [十二星座2026年运势大全](/blog/2026-yearly-horoscope-all-signs)`,
    },
  };

  // 其他语言用英文模板 + 翻译关键短语（简化处理，保证8语言都有内容）
  const otherLangs = ["id", "th", "vi", "ms", "ja", "ko"];
  if (otherLangs.includes(lang)) {
    const base = L.en;
    const monthName = m[lang] || m.en;
    const signName = z[lang] || z.en;
    return {
      title: `${z.symbol} ${signName} ${monthName} 2026 Horoscope`,
      excerpt: `${signName} (${z.dates}). ${monthName} 2026: ${t.focus}. Career, love, money, health forecast.`,
      content: `${base.h1.replace(z.en, signName).replace(m.en, monthName)}\n\n${base.intro.replace(z.en, signName).replace(m.en, monthName)}\n\n${base.overview.replace(m.en, monthName).replace(z.en, signName)}\n\n${base.career.replace(m.en, monthName)}\n\n${base.love}\n\n${base.money}\n\n${base.health.replace(z.en, signName)}\n\n${base.keydates.replace(m.en, monthName)}\n\n${base.cta.replace(z.en, signName)}\n\n${base.related.replaceAll(z.en, signName)}`,
    };
  }

  const l = L[lang] || L.en;
  return {
    title: l.title,
    excerpt: l.excerpt,
    content: `${l.h1}\n\n${l.intro}\n\n${l.overview}\n\n${l.career}\n\n${l.love}\n\n${l.money}\n\n${l.health}\n\n${l.keydates}\n\n${l.cta}\n\n${l.related}`,
  };
}

// ─── 主生成逻辑 ───
function generateAll() {
  const articles = [];
  let id = 1000;

  for (const zodiac of ZODIACS) {
    for (const month of MONTHS) {
      const slug = `${zodiac.sign}-${month.en.toLowerCase()}-2026-horoscope`;

      const title = {};
      const excerpt = {};
      const content = {};

      for (const lang of ["zh", "en", "id", "th", "vi", "ms", "ja", "ko"]) {
        const result = generateArticleContent(zodiac, month, lang);
        title[lang] = result.title;
        excerpt[lang] = result.excerpt;
        content[lang] = result.content;
      }

      articles.push({
        id: String(id++),
        slug,
        category: "horoscope",
        categoryZh: "运势",
        categoryEn: "Horoscope",
        categoryId: "Ramalan",
        title,
        excerpt,
        content,
        author: "星缘团队",
        authorEn: "Lunaxstar Team",
        date: "2026-01-01",
        readTime: 6,
      });
    }
  }

  return articles;
}

// ─── 输出 TypeScript 文件 ───
const articles = generateAll();
const outputPath = path.join(__dirname, "..", "src", "app", "blog", "longtail-seo-articles.ts");

let tsContent = `// Auto-generated long-tail SEO articles: 12 zodiac signs × 12 months = 144 articles
// Generated by scripts/generate-longtail-articles.js
// DO NOT EDIT MANUALLY — regenerate with: node scripts/generate-longtail-articles.js

export const longtailSeoArticles = ${JSON.stringify(articles, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent, "utf-8");
console.log(`✅ Generated ${articles.length} articles → ${outputPath}`);
console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
