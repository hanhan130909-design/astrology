import { NextRequest, NextResponse } from "next/server";

const BLOG_POSTS = [
  { id: "1", slug: "understanding-natal-chart", title: { zh: "如何解读本命盘", en: "Understanding Your Natal Chart", id: "Memahami Bagan Lahir" }, excerpt: { zh: "本命盘是占星学的基础。", en: "The natal chart is the foundation of astrology." }, category: "basics", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-01", readTime: 8, tags: { zh: "本命盘", en: "Natal Chart" } },
  { id: "2", slug: "mercury-retrograde-guide", title: { zh: "水星逆行完全指南", en: "Mercury Retrograde Guide", id: "Panduan Merkurius Retrograde" }, excerpt: { zh: "水星逆行每年发生3-4次。", en: "Mercury retrograde happens 3-4 times a year." }, category: "transits", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-05", readTime: 6, tags: { zh: "水星逆行", en: "Mercury Retrograde" } },
  { id: "3", slug: "love-compatibility", title: { zh: "星座爱情配对指南", en: "Zodiac Love Compatibility", id: "Kecocokan Cinta Zodiak" }, excerpt: { zh: "了解12星座之间的爱情化学反应。", en: "Understand romantic chemistry between zodiac signs." }, category: "relationships", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-08", readTime: 10, tags: { zh: "爱情", en: "Love" } },
  { id: "4", slug: "moon-phases", title: { zh: "月相与情绪周期", en: "Moon Phases and Emotions", id: "Fase Bulan dan Emosi" }, excerpt: { zh: "月亮影响我们的情绪和直觉。", en: "The Moon influences our emotions and intuition." }, category: "moon", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-10", readTime: 7, tags: { zh: "月亮", en: "Moon" } },
  { id: "5", slug: "career-astrology", title: { zh: "事业占星学", en: "Career Astrology", id: "Astrologi Karier" }, excerpt: { zh: "通过星盘分析了解你的职业天赋。", en: "Analyze your natal chart for career talents." }, category: "career", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-12", readTime: 9, tags: { zh: "事业", en: "Career" } },
  { id: "6", slug: "south-node-north-node", title: { zh: "南北交点：灵魂进化", en: "Nodes: Soul Evolution", id: "Node: Evolusi Jiwa" }, excerpt: { zh: "南北交点揭示了你灵魂进化的方向。", en: "Nodes reveal your soul evolution direction." }, category: "basics", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-13", readTime: 11, tags: { zh: "南北交", en: "Nodes" } },
  { id: "7", slug: "venus-retrograde", title: { zh: "金星逆行：爱情重新审视", en: "Venus Retrograde: Love Review", id: "Venus Retrograde: Tinjauan Cinta" }, excerpt: { zh: "金星逆行期间适合重新审视感情关系。", en: "Venus retrograde is good for reviewing relationships." }, category: "transits", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-14", readTime: 8, tags: { zh: "金星逆行", en: "Venus Retrograde" } },
  { id: "8", slug: "sun-sign-vs-moon-sign", title: { zh: "太阳星座vs月亮星座", en: "Sun Sign vs Moon Sign", id: "Sun Sign vs Moon Sign" }, excerpt: { zh: "太阳星座代表外性格，月亮星座代表内心世界。", en: "Sun sign is outer personality, Moon sign is inner world." }, category: "basics", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 7, tags: { zh: "太阳星座", en: "Sun Sign" } },
  { id: "9", slug: "twelve-houses-guide", title: { zh: "十二宫位详解", en: "Complete Guide to 12 Houses", id: "Panduan 12 Rumah" }, excerpt: { zh: "每个宫位代表人生不同领域。", en: "Each house represents different life areas." }, category: "basics", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 12, tags: { zh: "宫位", en: "Houses" } },
  { id: "10", slug: "mars-retrograde-2026", title: { zh: "火星逆行2026", en: "Mars Retrograde 2026", id: "Mars Retrograde 2026" }, excerpt: { zh: "火星逆行期间容易感到精力受阻。", en: "During Mars retrograde, energy may feel blocked." }, category: "transits", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 7, tags: { zh: "火星逆行", en: "Mars Retrograde" } },
  { id: "11", slug: "aspects-explained", title: { zh: "相位详解", en: "Aspects Explained", id: "Aspek Dijelaskan" }, excerpt: { zh: "相位是行星之间的角度关系。", en: "Aspects are angular relationships between planets." }, category: "basics", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 10, tags: { zh: "相位", en: "Aspects" } },
  { id: "12", slug: "jupiter-in-gemini-2026", title: { zh: "木星进入双子座2026", en: "Jupiter in Gemini 2026", id: "Jupiter di Gemini 2026" }, excerpt: { zh: "木星进入双子座带来学习好运。", en: "Jupiter in Gemini brings luck in learning." }, category: "transits", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 6, tags: { zh: "木星", en: "Jupiter" } },
  { id: "13", slug: "saturn-return-guide", title: { zh: "土星回归：29岁成人礼", en: "Saturn Return: 29-Year Initiation", id: "Saturn Return" }, excerpt: { zh: "土星回归大约每29年发生一次。", en: "Saturn return happens every 29 years." }, category: "transits", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 9, tags: { zh: "土星回归", en: "Saturn Return" } },
  { id: "14", slug: "lunar-eclipse-2026", title: { zh: "2026年日月食指南", en: "2026 Eclipse Guide", id: "Panduan Gerhana 2026" }, excerpt: { zh: "日月食是强大的占星事件。", en: "Eclipses are powerful astrological events." }, category: "transits", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 8, tags: { zh: "日月食", en: "Eclipses" } },
  { id: "15", slug: "composite-chart-relationships", title: { zh: "组合盘：关系第三实体", en: "Composite Charts", id: "Bagan Komposit" }, excerpt: { zh: "组合盘将两人的星盘叠加。", en: "Composite charts overlay two birth charts." }, category: "relationships", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 11, tags: { zh: "组合盘", en: "Composite" } },
  { id: "16", slug: "financial-astrology-basics", title: { zh: "金融占星入门", en: "Financial Astrology Basics", id: "Dasar Astrologi Keuangan" }, excerpt: { zh: "第二宫、第八宫对财运有重要影响。", en: "2nd and 8th houses influence wealth." }, category: "career", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 8, tags: { zh: "财运", en: "Wealth" } },
  { id: "17", slug: "progressed-chart-guide", title: { zh: "推运盘：内在成长", en: "Progressed Charts: Inner Growth", id: "Bagan Progresif" }, excerpt: { zh: "推运盘反映你的内在成长。", en: "Progressed charts reflect your inner growth." }, category: "basics", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 10, tags: { zh: "推运盘", en: "Progressed" } },
  { id: "18", slug: "retrograde-planets-natal", title: { zh: "出生图逆行行星", en: "Retrograde Planets in Natal", id: "Planet Retrograde" }, excerpt: { zh: "逆行行星代表需要内在整合。", en: "Retrograde planets need inner integration." }, category: "basics", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 9, tags: { zh: "逆行行星", en: "Retrograde" } },
  { id: "19", slug: "zodiac-health-connection", title: { zh: "星座与健康", en: "Zodiac & Health Connection", id: "Zodiak & Kesehatan" }, excerpt: { zh: "每个星座对应不同的身体部位。", en: "Each sign corresponds to different body parts." }, category: "wellness", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 7, tags: { zh: "健康", en: "Health" } },
  { id: "20", slug: "tarot-astrology-connection", title: { zh: "塔罗与占星：神秘学桥梁", en: "Tarot & Astrology: Mysticism Bridge", id: "Tarot & Astrologi" }, excerpt: { zh: "塔罗牌对应十二星座和行星。", en: "Tarot cards correspond to zodiac signs and planets." }, category: "tarot", author: { zh: "星缘团队", en: "Star Fate Team" }, publishedAt: "2026-04-15", readTime: 8, tags: { zh: "塔罗", en: "Tarot" } },
];

const CATEGORIES: Record<string, Array<{id: string; name: string}>> = {
  zh: [
    { id: "all", name: "全部" },
    { id: "basics", name: "占星基础" },
    { id: "transits", name: "行星运行" },
    { id: "relationships", name: "爱情关系" },
    { id: "moon", name: "月亮周期" },
    { id: "career", name: "事业财运" },
    { id: "wellness", name: "健康身心" },
    { id: "tarot", name: "塔罗占卜" },
  ],
  en: [
    { id: "all", name: "All" },
    { id: "basics", name: "Astrology Basics" },
    { id: "transits", name: "Planetary Transits" },
    { id: "relationships", name: "Love & Relationships" },
    { id: "moon", name: "Moon Phases" },
    { id: "career", name: "Career & Finance" },
    { id: "wellness", name: "Health & Wellness" },
    { id: "tarot", name: "Tarot Reading" },
  ],
};

function getText(obj: unknown, lang: string, fallback = ""): string {
  if (typeof obj === "string") return obj;
  if (obj && typeof obj === "object") {
    const r = obj as Record<string, string>;
    return r[lang] || r.zh || r.en || fallback;
  }
  return fallback;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "zh";
  const category = searchParams.get("category") || "all";
  const slug = searchParams.get("slug");
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");

  if (slug) {
    const post = BLOG_POSTS.find(p => p.slug === slug);
    if (!post) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      data: {
        ...post,
        title: getText(post.title, lang),
        excerpt: getText(post.excerpt, lang),
        author: getText(post.author, lang),
        tags: getText(post.tags, lang).split(","),
      }
    });
  }

  let filtered = BLOG_POSTS;
  if (category !== "all") filtered = filtered.filter(p => p.category === category);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data: paginated.map(p => ({
      ...p,
      title: getText(p.title, lang),
      excerpt: getText(p.excerpt, lang),
      author: getText(p.author, lang),
      tags: getText(p.tags, lang).split(","),
    })),
    categories: CATEGORIES[lang] || CATEGORIES.zh,
    pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
  });
}
