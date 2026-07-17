import 'server-only';

import { destinyArticles } from '@/content/destiny-blog-articles';
import { moreSeoArticles } from './more-seo-articles';
import { seoArticles } from './seo-articles';
import {
  toBlogSummary,
  type BlogArticleForSummary,
  type BlogSummary,
} from './blogSummary';

type DefaultedSummaryField = 'author' | 'authorEn' | 'authorId' | 'date' | 'readTime';
type BlogArticleSource = Omit<BlogArticleForSummary, DefaultedSummaryField> &
  Partial<Pick<BlogArticleForSummary, DefaultedSummaryField>> & {
    wordCount?: number;
  };

const DEFAULT_READ_TIME = 5;

function normalizeReadTime(article: Pick<BlogArticleSource, 'readTime' | 'wordCount'>): number {
  if (typeof article.readTime === 'number' && Number.isFinite(article.readTime) && article.readTime > 0) {
    return article.readTime;
  }
  if (typeof article.wordCount === 'number' && Number.isFinite(article.wordCount) && article.wordCount > 0) {
    return Math.max(1, Math.ceil(article.wordCount / 200));
  }
  return DEFAULT_READ_TIME;
}

function normalizeSourceArticle(article: BlogArticleSource): BlogArticleForSummary {
  return {
    id: article.id,
    slug: article.slug,
    category: article.category,
    categoryZh: article.categoryZh,
    categoryEn: article.categoryEn,
    categoryId: article.categoryId,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author ?? '星缘团队',
    authorEn: article.authorEn ?? 'Lunaxstar Team',
    authorId: article.authorId ?? 'Tim Lunaxstar',
    date: article.date ?? '',
    readTime: normalizeReadTime(article),
    tags: article.tags,
  };
}

const normalizedDestinyArticles: BlogArticleForSummary[] = destinyArticles.map((a, i) => ({
  id: `destiny-${i}`,
  slug: a.slug,
  category: a.category,
  categoryZh: a.categoryLabel.zh,
  categoryEn: a.categoryLabel.en,
  categoryId: a.categoryLabel.id,
  title: a.title,
  excerpt: a.description,
  content: { en: a.sections, zh: a.sections, id: a.sections },
  author: '星缘团队',
  authorEn: 'Lunaxstar Team',
  authorId: 'Tim Lunaxstar',
  date: '2026-06-15',
  readTime: Math.ceil(a.wordCount / 200),
  tags: [a.categoryLabel.en, 'BaZi', 'Chinese Astrology'],
}));

const legacyArticles: BlogArticleForSummary[] = [
  {
    id: '1',
    slug: 'birth-chart-tutorial',
    category: 'tutorial',
    categoryZh: '教程',
    categoryEn: 'Tutorial',
    categoryId: 'Tutorial',
    title: {
      zh: '本命盘基础教程：读懂你的出生星图',
      en: 'Birth Chart Tutorial: Read Your Natal Chart',
      id: 'Tutorial Bagan Natal: Membaca Bagan Bintang Kelahiran Anda'},
    excerpt: {
      zh: '本命盘是占星学的核心工具，它记录了你出生时行星的位置。通过学习四元素、十二星座和十二宫位，你可以揭开星图的奥秘，了解自己的性格、天赋和人生轨迹。',
      en: 'A birth chart is the core tool of astrology, recording planetary positions at your birth. By learning the four elements, twelve zodiac signs, and twelve houses, you can unlock the mysteries of the star map and understand your personality, talents, and life path.',
      id: 'Bagan kelahiran adalah alat inti astrologi yang mencatat posisi planet saat kelahiran Anda. Dengan mempelajari empat elemen, dua belas tanda zodiak, dan dua belas rumah, Anda dapat membuka misteri peta bintang dan memahami kepribadian, bakat, dan jalur hidup Anda.'},
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 8,
    tags: ['本命盘', '星盘解读', '出生盘', '十二星座', '宫位']},
  {
    id: '2',
    slug: 'transit-chart-guide',
    category: 'guide',
    categoryZh: '指南',
    categoryEn: 'Guide',
    categoryId: 'Guide',
    title: {
      zh: '推运盘完全指南：预测你的流年运势',
      en: 'Transit Chart Guide: Predict Your Yearly Horoscope',
      id: 'Panduan Bagan Transit: Memprediksi Ramalan Tahunan Anda'},
    excerpt: {
      zh: '推运盘（Transit Chart）展示了当前行星位置与你出生星图的互动关系。通过解读行星相位和流年运势，你可以把握时机，提前规划人生重要决策。',
      en: 'A transit chart shows the interaction between current planetary positions and your birth chart. By interpreting planetary aspects and yearly horoscopes, you can seize opportunities and plan important life decisions in advance.',
      id: 'Bagan transit menunjukkan interaksi antara posisi planet saat ini dan bagan kelahiran Anda. Dengan menafsirkan aspek planet dan ramalan tahunan, Anda dapat memanfaatkan peluang dan merencanakan keputusan hidup penting sebelumnya.'},
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 10,
    tags: ['推运盘', '行运', '行星相位', '流年', 'Transit chart']},
  {
    id: '3',
    slug: 'composite-chart-analysis',
    category: 'analysis',
    categoryZh: '分析',
    categoryEn: 'Analysis',
    categoryId: 'Analysis',
    title: {
      zh: '合盘关系分析：揭秘你们的情感兼容性',
      en: 'Composite Chart Analysis: Reveal Your Relationship Compatibility',
      id: 'Analisis Bagan Komposit: Mengungkap Kompatibilitas Hubungan Anda'},
    excerpt: {
      zh: '合盘（Composite Chart）是关系占星学的精华，通过合并两个人的出生数据，揭示关系的本质、挑战和成长方向。了解月亮星座兼容性，让爱情更加和谐。',
      en: 'A composite chart is the essence of relationship astrology. By combining two people"s birth data, it reveals the relationship"s essence, challenges, and growth direction. Understand moon sign compatibility for more harmonious love.',
      id: 'Bagan komposit adalah inti astrologi hubungan. Dengan menggabungkan data kelahiran dua orang, ini mengungkap esensi hubungan, tantangan, dan arah pertumbuhan. Pahami kompatibilitas tanda bulan untuk cinta yang lebih harmonis.'},
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 9,
    tags: ['合盘', '组合盘', '关系占星', 'compatibility', 'synastry']},
  {
    id: '4',
    slug: 'zodiac-personality-analysis',
    category: 'analysis',
    categoryZh: '分析',
    categoryEn: 'Analysis',
    categoryId: 'Analysis',
    title: {
      zh: '十二星座性格解析：四元素深度解读',
      en: 'Zodiac Personality Analysis: Deep Dive into Four Elements',
      id: 'Analisis Kepribadian Zodiak: Membedah Empat Elemen Secara Mendalam'},
    excerpt: {
      zh: '火象星座热情冲动，土象星座踏实稳重，风象星座聪明善辩，水象星座情感丰富。深入了解四元素如何影响十二星座的性格特质和守护星。',
      en: 'Fire signs are passionate and impulsive, Earth signs are practical and stable, Air signs are intelligent and communicative, Water signs are emotionally rich. Deep dive into how the four elements influence zodiac personality traits and ruling planets.',
      id: 'Tanda api penuh gairah dan impulsif, tanda bumi praktis dan stabil, tanda udara cerdas dan komunikatif, tanda air kaya secara emosional. Membedah secara mendalam bagaimana empat elemen mempengaruhi sifat kepribadian zodiak dan planet penguasa.'},
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 12,
    tags: ['星座性格', '火象星座', '土象星座', '风象星座', '水象星座']},
  {
    id: '5',
    slug: 'ai-astrology-advantages',
    category: 'technology',
    categoryZh: '科技',
    categoryEn: 'Technology',
    categoryId: 'Technology',
    title: {
      zh: 'AI占星解读的优势：传统vs人工智能',
      en: 'AI Astrology Advantages: Traditional vs Artificial Intelligence',
      id: 'Keunggulan Astrologi AI: Tradisional vs Kecerdasan Buatan'},
    excerpt: {
      zh: 'AI占星结合了古老智慧与现代科技，提供24/7免费服务、客观解读和个性化分析。星缘使用LLaMA模型，让每个人都能获得专业的占星指导。',
      en: 'AI astrology combines ancient wisdom with modern technology, offering 24/7 free service, objective interpretation, and personalized analysis. Lunaxstar uses LLaMA models to make professional astrological guidance accessible to everyone.',
      id: 'Astrologi AI menggabungkan kebijaksanaan kuno dengan teknologi modern, menawarkan layanan gratis 24/7, interpretasi objektif, dan analisis personalisasi. Lunaxstar menggunakan model LLaMA untuk membuat panduan astrologi profesional dapat diakses oleh semua orang.'},
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 7,
    tags: ['AI占星', '免费解读', 'LLaMA占星', 'AI astrology', '人工智能']},
  {
    id: '6',
    slug: '2026-horoscope-predictions',
    category: 'horoscope',
    categoryZh: '运势',
    categoryEn: 'Horoscope',
    categoryId: 'Horoscope',
    title: {
      zh: '2026年星座运势：哪些星座将迎来最佳年份',
      en: '2026 Horoscope Predictions: Which Signs Will Have the Best Year',
      id: 'Ramalan Zodiak 2026: Tanda Zodiak Mana yang Akan Memiliki Tahun Terbaik'},
    excerpt: {
      zh: '2026年，木星进入处女座，土星在双鱼座，天王星在双子座。这将是非常特殊的一年！了解行星 alignments 如何影响你的星座，提前规划精彩一年。',
      en: 'In 2026, Jupiter enters Virgo, Saturn is in Pisces, and Uranus is in Gemini. This will be a very special year! Learn how planetary alignments affect your sign and plan an amazing year ahead.',
      id: 'Pada 2026, Jupiter memasuki Virgo, Saturnus di Pisces, dan Uranus di Gemini. Ini akan menjadi tahun yang sangat istimewa! Pelajari bagaimana penyelarasan planet mempengaruhi tanda Anda dan rencanakan tahun yang luar biasa ke depan.'},
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 11,
    tags: ['2026运势', '今年星座', '年度预测', 'yearly horoscope', '2026']},
];

export function getBlogSummaries(): BlogSummary[] {
  const sourceArticles = [
    ...seoArticles.map(normalizeSourceArticle),
    ...moreSeoArticles.map(normalizeSourceArticle),
    ...normalizedDestinyArticles,
    ...legacyArticles,
  ];

  return sourceArticles.map(toBlogSummary);
}
