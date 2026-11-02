/**
 * 博客封面与分类主题 —— 差异化卡片视觉
 *
 * 之前所有卡片都是同一个 ✨ 渐变占位、灰色分类徽章。
 * 现在按「分类主题 + slug 哈希」确定性选出符号与渐变，
 * 无需图片资源，构建期零开销，视觉上每张卡片不同。
 *
 * 注意：gradient class 必须以完整字面量出现在本文件中，Tailwind JIT 才能扫描到。
 */

export interface BlogCoverTheme {
  symbol: string;
  gradient: string; // 卡片头图背景（浅色柔和渐变）
  badge: string; // 分类徽章底色
}

const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const WUXING = ['🌳', '🔥', '⛰️', '🌊', '⚙️'];
const ZODIAC_ANIMALS = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];

// 柔和浅色渐变（浅色主题安全）
const GRADIENTS = [
  'bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100',
  'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100',
  'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
  'bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100',
  'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100',
  'bg-gradient-to-br from-indigo-100 via-violet-50 to-purple-100',
  'bg-gradient-to-br from-cyan-100 via-sky-50 to-teal-100',
  'bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100',
];

interface CategoryTheme {
  symbols: string[];
  badges: string[]; // 每个分类给 2-3 个相邻色系，靠 slug 哈希选
}

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  astrology: { symbols: ZODIAC, badges: ['bg-purple-100 text-purple-700', 'bg-indigo-100 text-indigo-700'] },
  horoscope: { symbols: ZODIAC, badges: ['bg-amber-100 text-amber-700', 'bg-orange-100 text-orange-700'] },
  zodiac: { symbols: ZODIAC, badges: ['bg-sky-100 text-sky-700', 'bg-cyan-100 text-cyan-700'] },
  'zodiac-elements': { symbols: ['🔥', '🌳', '⚙️', '💧'], badges: ['bg-sky-100 text-sky-700', 'bg-emerald-100 text-emerald-700'] },
  'astrology-basics': { symbols: ['🌟', '✨', '🌌'], badges: ['bg-purple-100 text-purple-700', 'bg-violet-100 text-violet-700'] },
  natal: { symbols: ['🪐', ZODIAC[0], ZODIAC[9], '🌙'], badges: ['bg-indigo-100 text-indigo-700', 'bg-purple-100 text-purple-700'] },
  'natal-chart': { symbols: ['🪐', '🌙', '⭐'], badges: ['bg-indigo-100 text-indigo-700', 'bg-sky-100 text-sky-700'] },
  bazi: { symbols: WUXING, badges: ['bg-rose-100 text-rose-700', 'bg-red-100 text-red-700'] },
  'bazi-basics': { symbols: WUXING, badges: ['bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700'] },
  'chinese-astrology': { symbols: WUXING, badges: ['bg-red-100 text-red-700', 'bg-rose-100 text-rose-700'] },
  'chinese-culture': { symbols: ['🏮', '☯️', '📜'], badges: ['bg-red-100 text-red-700', 'bg-orange-100 text-orange-700'] },
  'chinese-zodiac-compatibility': { symbols: ZODIAC_ANIMALS, badges: ['bg-red-100 text-red-700', 'bg-rose-100 text-rose-700'] },
  tarot: { symbols: ['🔮', '🌙', '✨', '🃏'], badges: ['bg-fuchsia-100 text-fuchsia-700', 'bg-purple-100 text-purple-700'] },
  compatibility: { symbols: ['💞', '❤️', '💌'], badges: ['bg-pink-100 text-pink-700', 'bg-rose-100 text-rose-700'] },
  relationship: { symbols: ['💕', '🌹', '💬'], badges: ['bg-pink-100 text-pink-700', 'bg-fuchsia-100 text-fuchsia-700'] },
  career: { symbols: ['💼', '📈', '🏆'], badges: ['bg-emerald-100 text-emerald-700', 'bg-teal-100 text-teal-700'] },
  guide: { symbols: ['📖', '🧭', '🗺️'], badges: ['bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700'] },
  tutorial: { symbols: ['✍️', '📐', '🌟'], badges: ['bg-blue-100 text-blue-700', 'bg-sky-100 text-sky-700'] },
  comparison: { symbols: ['⚖️', '🔀'], badges: ['bg-slate-100 text-slate-700', 'bg-gray-100 text-gray-700'] },
  'free-resources': { symbols: ['🎁', '🆓', '🌟'], badges: ['bg-green-100 text-green-700', 'bg-emerald-100 text-emerald-700'] },
  community: { symbols: ['👥', '💬', '🌏'], badges: ['bg-teal-100 text-teal-700', 'bg-cyan-100 text-cyan-700'] },
};

/** 兜底主题：未登记分类使用 */
const FALLBACK: CategoryTheme = {
  symbols: ZODIAC,
  badges: ['bg-violet-100 text-violet-700', 'bg-purple-100 text-purple-700'],
};

function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * 取某篇文章的封面主题（确定性：同 slug 永远同一结果）。
 * 符号由分类专属符号池决定（如星座类从 12 星座符号中选），
 * 渐变与徽章色由 slug 哈希从分类色系中选。
 */
export function getBlogCoverTheme(slug: string, category: string): BlogCoverTheme {
  const theme = CATEGORY_THEMES[category] ?? FALLBACK;
  const h = fnv1a(`${category}:${slug}`);
  return {
    symbol: theme.symbols[h % theme.symbols.length],
    gradient: GRADIENTS[(h >>> 3) % GRADIENTS.length],
    badge: theme.badges[(h >>> 6) % theme.badges.length],
  };
}
