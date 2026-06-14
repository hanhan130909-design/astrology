'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowLeft, Clock, Tag, ChevronRight } from 'lucide-react';

// Translation data
const t: Record<string, Record<string, string>> = {
  zh: {
    title: '星缘博客',
    subtitle: '免费占星知识与运势解读',
    featured: '精选文章',
    readMore: '阅读全文',
    minRead: '分钟阅读',
    by: '作者',
    back: '返回',
    tutorial: '教程',
    guide: '指南',
    analysis: '分析',
    horoscope: '运势',
    technology: '科技',
  },
  en: {
    title: 'Astro Blog',
    subtitle: 'Free Astrology Knowledge & Horoscope Insights',
    featured: 'Featured Articles',
    readMore: 'Read More',
    minRead: 'min read',
    by: 'By',
    back: 'Back',
    tutorial: 'Tutorial',
    guide: 'Guide',
    analysis: 'Analysis',
    horoscope: 'Horoscope',
    technology: 'Technology',
  },
  id: {
    title: 'Blog Astrologi',
    subtitle: 'Pengetahuan Astrologi & Ramalan Gratis',
    featured: 'Artikel Pilihan',
    readMore: 'Baca Selengkapnya',
    minRead: 'mnt baca',
    by: 'Oleh',
    back: 'Kembali',
    tutorial: 'Tutorial',
    guide: 'Panduan',
    analysis: 'Analisis',
    horoscope: 'Ramalan',
    technology: 'Teknologi',
  },
};

// Blog article interface
interface BlogArticle {
  id: string;
  slug: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  categoryId: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  author: string;
  authorEn: string;
  authorId: string;
  date: string;
  readTime: number;
  tags: string[];
}

// Blog articles data
const blogArticles: BlogArticle[] = [
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
      id: 'Tutorial Bagan Natal: Membaca Bagan Bintang Kelahiran Anda',
    },
    excerpt: {
      zh: '本命盘是占星学的核心工具，它记录了你出生时行星的位置。通过学习四元素、十二星座和十二宫位，你可以揭开星图的奥秘，了解自己的性格、天赋和人生轨迹。',
      en: 'A birth chart is the core tool of astrology, recording planetary positions at your birth. By learning the four elements, twelve zodiac signs, and twelve houses, you can unlock the mysteries of the star map and understand your personality, talents, and life path.',
      id: 'Bagan kelahiran adalah alat inti astrologi yang mencatat posisi planet saat kelahiran Anda. Dengan mempelajari empat elemen, dua belas tanda zodiak, dan dua belas rumah, Anda dapat membuka misteri peta bintang dan memahami kepribadian, bakat, dan jalur hidup Anda.',
    },
    content: {
      zh: '本命盘（Birth Chart/Natal Chart）是占星学最核心的工具。当你出生的那一刻，天空中行星的位置被永久记录，形成属于你的独特星图。\n\n四元素与性格\n占星学中的四元素——火、土、风、水，构成了性格的基础。火象星座（白羊、狮子、射手）充满热情和行动力；土象星座（金牛、处女、摩羯）踏实稳重；风象星座（双子、天秤、水瓶）善于沟通和思考；水象星座（巨蟹、天蝎、双鱼）情感丰富且直觉敏锐。\n\n十二宫位的意义\n本命盘的十二个宫位代表了生活的不同领域。第一宫代表自我形象，第七宫代表伴侣关系，第十宫代表事业成就。行星落在不同宫位，会影响该领域的发展。\n\n如何使用星缘免费解读\n在 lunaxstar.com 上，只需输入出生日期、时间和地点，就能生成完整的本命盘解读。我们的 AI 系统会分析你的太阳、月亮和上升星座，提供个性化的性格分析和人生建议。',
      en: 'The Birth Chart (Natal Chart) is the most fundamental tool in astrology. At the moment of your birth, the positions of planets in the sky are permanently recorded, forming a unique star map that belongs to you.\n\nThe Four Elements and Personality\nThe four elements in astrology—Fire, Earth, Air, and Water—form the foundation of personality. Fire signs (Aries, Leo, Sagittarius) are passionate and action-oriented; Earth signs (Taurus, Virgo, Capricorn) are practical and stable; Air signs (Gemini, Libra, Aquarius) excel at communication and thinking; Water signs (Cancer, Scorpio, Pisces) are emotionally rich and intuitively sharp.\n\nThe Meaning of Twelve Houses\nThe twelve houses of the natal chart represent different life areas. The 1st house represents self-image, the 7th house represents partnerships, and the 10th house represents career achievements. Planets in different houses influence development in those areas.\n\nHow to Use Lunaxstar for Free Interpretation\nOn lunaxstar.com, simply enter your birth date, time, and location to generate a complete natal chart interpretation. Our AI system analyzes your Sun, Moon, and Rising signs to provide personalized personality analysis and life guidance.',
    },
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 8,
    tags: ['本命盘', '星盘解读', '出生盘', '十二星座', '宫位'],
  },
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
      id: 'Panduan Bagan Transit: Memprediksi Ramalan Tahunan Anda',
    },
    excerpt: {
      zh: '推运盘（Transit Chart）展示了当前行星位置与你出生星图的互动关系。通过解读行星相位和流年运势，你可以把握时机，提前规划人生重要决策。',
      en: 'A transit chart shows the interaction between current planetary positions and your birth chart. By interpreting planetary aspects and yearly horoscopes, you can seize opportunities and plan important life decisions in advance.',
      id: 'Bagan transit menunjukkan interaksi antara posisi planet saat ini dan bagan kelahiran Anda. Dengan menafsirkan aspek planet dan ramalan tahunan, Anda dapat memanfaatkan peluang dan merencanakan keputusan hidup penting sebelumnya.',
    },
    content: {
      zh: '推运盘（Transit Chart）是占星预测的核心技术。它通过将当前的行星位置叠加在你的本命盘上，揭示天时对个人命运的影响。\n\n什么是推运盘？\n推运盘展示了「现在」与「出生时刻」的宇宙连接。当行星运行到特定位置，与你本命盘中的行星形成相位（合相、刑相、冲相、三合、六合），就会产生不同的能量影响。\n\n重要行星周期\n土星回归（约29.5年）标志着成年和责任；木星回归（约12年）带来扩张和好运；土星-冥王星合相（约37年）引发深层变革。了解这些周期，可以帮助你把握人生节奏。\n\n2026.年重要天象\n2026年，木星进入处女座，为细节工作和健康管理带来好运。土星在双鱼座持续影响灵性成长。天王星在双子座激发创新思维。使用星缘的推运盘功能，输入你的本命数据，就能看到这些行星对你个人的具体影响。\n\n如何解读推运盘\n重点关注个人行星（太阳、月亮、水星、金星、火星）与流年行星的相位。吉相位（三合、六合）带来机遇，凶相位（刑相、冲相）带来挑战，但都是成长的机会。',
      en: 'A Transit Chart is the core technique of astrological prediction. It reveals how celestial timing influences personal destiny by overlaying current planetary positions onto your natal chart.\n\nWhat is a Transit Chart?\nA transit chart shows the cosmic connection between "now" and "the moment of birth." When planets move to specific positions and form aspects (conjunction, square, opposition, trine, sextile) with planets in your natal chart, they create different energy influences.\n\nImportant Planetary Cycles\nSaturn Return (approximately 29.5 years) marks adulthood and responsibility; Jupiter Return (approximately 12 years) brings expansion and good fortune; Saturn-Pluto conjunction (approximately 37 years) triggers profound transformation. Understanding these cycles helps you grasp life"s rhythm.\n\nMajor Astronomical Events in 2026\nIn 2026, Jupiter enters Virgo, bringing good fortune for detailed work and health management. Saturn in Pisces continues to influence spiritual growth. Uranus in Gemini stimulates innovative thinking. Use Lunaxstar"s transit chart feature, input your natal data, and you can see how these planets specifically affect you.\n\nHow to Interpret Transit Charts\nFocus on aspects between personal planets (Sun, Moon, Mercury, Venus, Mars) and transiting planets. Beneficial aspects (trine, sextile) bring opportunities, challenging aspects (square, opposition) bring challenges, but all are opportunities for growth.',
    },
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 10,
    tags: ['推运盘', '行运', '行星相位', '流年', 'Transit chart'],
  },
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
      id: 'Analisis Bagan Komposit: Mengungkap Kompatibilitas Hubungan Anda',
    },
    excerpt: {
      zh: '合盘（Composite Chart）是关系占星学的精华，通过合并两个人的出生数据，揭示关系的本质、挑战和成长方向。了解月亮星座兼容性，让爱情更加和谐。',
      en: 'A composite chart is the essence of relationship astrology. By combining two people"s birth data, it reveals the relationship"s essence, challenges, and growth direction. Understand moon sign compatibility for more harmonious love.',
      id: 'Bagan komposit adalah inti astrologi hubungan. Dengan menggabungkan data kelahiran dua orang, ini mengungkap esensi hubungan, tantangan, dan arah pertumbuhan. Pahami kompatibilitas tanda bulan untuk cinta yang lebih harmonis.',
    },
    content: {
      zh: '合盘（Composite Chart/Synastry Chart）是关系占星学的核心工具，帮助你深入了解 romantic relationships、友谊和合作伙伴关系的动态。\n\n什么是合盘？\n合盘是将两个人的出生星图进行比较和合并的技术。比较盘（Synastry）看两颗星体之间的互动，合盘（Composite）则是创造一张代表「关系本身」的新星图。\n\n月亮星座与情感兼容性\n月亮代表情感需求和安全感。当两人的月亮星座和谐（同元素或三合、六合），情感交流顺畅；如果发生冲突（刑相、冲相），需要更多理解和包容。例如，月亮巨蟹与月亮天蝎同属水象，情感共鸣强烈。\n\n金星与火星：爱与欲\n金星代表爱情观和价值观，火星代表行动力和性吸引力。金星和谐带来审美和价值的共识，火星和谐则激情四射。\n\n如何使用星缘合盘功能\n在 lunaxstar.com 的合盘页面，输入你和伴侣的出生信息，系统会自动生成合盘解读，包括：关系本质、挑战领域、成长方向、长期潜力评分。\n\n提升关系和谐度的建议\n了解合盘不是为了找到「完美匹配」，而是理解差异、尊重彼此的需求。占星学提供洞察，但关系的质量取决于双方的努力和承诺。',
      en: 'A Composite Chart is the core tool of relationship astrology, helping you gain deep insights into romantic relationships, friendships, and business partnerships.\n\nWhat is a Composite Chart?\nComposite chart is a technique that compares and combines two people"s birth charts. Synastry looks at interactions between two people"s planets, while Composite creates a new chart representing "the relationship itself."\n\nMoon Signs and Emotional Compatibility\nThe Moon represents emotional needs and sense of security. When two people"s Moon signs are harmonious (same element or trine/sextile), emotional communication flows smoothly. If there are conflicts (square, opposition), more understanding and tolerance are needed. For example, Moon in Cancer and Moon in Scorpio both belong to Water signs, creating strong emotional resonance.\n\nVenus and Mars: Love and Desire\nVenus represents love style and values, Mars represents drive and sexual attraction. Harmonious Venus brings consensus in aesthetics and values, while harmonious Mars creates passionate energy.\n\nHow to Use Lunaxstar"s Composite Feature\nOn the Composite page of lunaxstar.com, enter your and your partner"s birth information. The system automatically generates a composite interpretation, including: relationship essence, challenge areas, growth direction, and long-term potential score.\n\nTips for Improving Relationship Harmony\nUnderstanding composite charts isn"t about finding a "perfect match" but understanding differences and respecting each other"s needs. Astrology provides insights, but relationship quality depends on both parties" efforts and commitment.',
    },
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 9,
    tags: ['合盘', '组合盘', '关系占星', 'compatibility', 'synastry'],
  },
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
      id: 'Analisis Kepribadian Zodiak: Membedah Empat Elemen Secara Mendalam',
    },
    excerpt: {
      zh: '火象星座热情冲动，土象星座踏实稳重，风象星座聪明善辩，水象星座情感丰富。深入了解四元素如何影响十二星座的性格特质和守护星。',
      en: 'Fire signs are passionate and impulsive, Earth signs are practical and stable, Air signs are intelligent and communicative, Water signs are emotionally rich. Deep dive into how the four elements influence zodiac personality traits and ruling planets.',
      id: 'Tanda api penuh gairah dan impulsif, tanda bumi praktis dan stabil, tanda udara cerdas dan komunikatif, tanda air kaya secara emosional. Membedah secara mendalam bagaimana empat elemen mempengaruhi sifat kepribadian zodiak dan planet penguasa.',
    },
    content: {
      zh: '占星学中的四元素——火、土、风、水，是理解十二星座性格的钥匙。每个元素包含三个星座，共享相似的核心特质。\n\n火象星座（白羊、狮子、射手）\n守护星：火星（白羊）、太阳（狮子）、木星（射手）\n特质：热情、直率、行动力强、喜欢领导、有时候冲动\n白羊座：开拓者，勇敢且直接\n狮子座：表演者，慷慨且骄傲\n射手座：探险家，乐观且哲学\n\n土象星座（金牛、处女、摩羯）\n守护星：金星（金牛）、水星（处女）、土星（摩羯）\n特质：务实、稳重、有耐心、重视物质和安全感\n金牛座：建设者，稳重且感性\n处女座：分析者，完美主义且服务导向\n摩羯座：野心家，有纪律且长远规划\n\n风象星座（双子、天秤、水瓶）\n守护星：水星（双子）、金星（天秤）、天王星（水瓶）\n特质：理性、善于沟通、重视智性刺激和社交\n双子座：沟通者，好奇且多变\n天秤座：外交官，优雅且追求和谐\n水瓶座：创新者，独立且人道关怀\n\n水象星座（巨蟹、天蝎、双鱼）\n守护星：月亮（巨蟹）、冥王星/火星（天蝎）、海王星/木星（双鱼）\n特质：情感丰富、直觉强、重视深层的情感连接\n巨蟹座：守护者，敏感且顾家\n天蝎座：转型者，intense 且神秘\n双鱼座：梦想家，同理心强且艺术天赋\n\n如何运用这个知识\n了解自己的太阳、月亮和上升星座的元素组合，可以更全面地理解性格。例如，太阳双子（风）+ 月亮天蝎（水）的人，既理性好奇又情感深刻。',
      en: 'The four elements in astrology—Fire, Earth, Air, and Water—are the keys to understanding the personalities of the twelve zodiac signs. Each element contains three signs that share similar core traits.\n\nFire Signs (Aries, Leo, Sagittarius)\nRuling Planets: Mars (Aries), Sun (Leo), Jupiter (Sagittarius)\nTraits: Passionate, direct, action-oriented, leadership qualities, sometimes impulsive\nAries: The Pioneer—brave and straightforward\nLeo: The Performer—generous and proud\nSagittarius: The Explorer—optimistic and philosophical\n\nEarth Signs (Taurus, Virgo, Capricorn)\nRuling Planets: Venus (Taurus), Mercury (Virgo), Saturn (Capricorn)\nTraits: Practical, stable, patient, value material security\nTaurus: The Builder—steady and sensual\nVirgo: The Analyzer—perfectionist and service-oriented\nCapricorn: The Achiever—disciplined and long-term planner\n\nAir Signs (Gemini, Libra, Aquarius)\nRuling Planets: Mercury (Gemini), Venus (Libra), Uranus (Aquarius)\nTraits: Rational, communicative, value intellectual stimulation and social connection\nGemini: The Communicator—curious and adaptable\nLibra: The Diplomat—graceful and harmony-seeking\nAquarius: The Innovator—independent and humanitarian\n\nWater Signs (Cancer, Scorpio, Pisces)\nRuling Planets: Moon (Cancer), Pluto/Mars (Scorpio), Neptune/Jupiter (Pisces)\nTraits: Emotionally rich, intuitive, value deep emotional connections\nCancer: The Nurturer—sensitive and family-oriented\nScorpio: The Transformer—intense and mysterious\nPisces: The Dreamer—empathetic and artistically gifted\n\nHow to Apply This Knowledge\nUnderstanding the elemental combination of your Sun, Moon, and Rising signs gives a more complete picture of personality. For example, Sun in Gemini (Air) + Moon in Scorpio (Water) creates someone who is both intellectually curious and emotionally profound.',
    },
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 12,
    tags: ['星座性格', '火象星座', '土象星座', '风象星座', '水象星座'],
  },
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
      id: 'Keunggulan Astrologi AI: Tradisional vs Kecerdasan Buatan',
    },
    excerpt: {
      zh: 'AI占星结合了古老智慧与现代科技，提供24/7免费服务、客观解读和个性化分析。星缘使用LLaMA模型，让每个人都能获得专业的占星指导。',
      en: 'AI astrology combines ancient wisdom with modern technology, offering 24/7 free service, objective interpretation, and personalized analysis. Lunaxstar uses LLaMA models to make professional astrological guidance accessible to everyone.',
      id: 'Astrologi AI menggabungkan kebijaksanaan kuno dengan teknologi modern, menawarkan layanan gratis 24/7, interpretasi objektif, dan analisis personalisasi. Lunaxstar menggunakan model LLaMA untuk membuat panduan astrologi profesional dapat diakses oleh semua orang.',
    },
    content: {
      zh: '人工智能正在改变占星学的获取方式。传统占星需要预约专业占星师，费用高昂且时间受限。AI占星则让每个人都能随时随地获得深入的星图解读。\n\nAI占星的优势\n1. 24/7 可用：无论何时何地，只需访问 lunaxstar.com，就能获得解读\n2. 完全免费：我们相信占星智慧应该人人可及\n3. 客观无偏见：AI不会因个人情绪或偏见影响解读\n4. 个性化深度分析：基于你的精确出生数据，而非泛泛而星座运势\n5. 多语言支持：中文、英文、印尼文，让更多人受益\n\nLLaMA模型的力量\n星缘使用先进的LLaMA大语言模型，经过占星学专业知识训练。它能够：\n- 理解复杂的行星相位和宫位关系\n- 生成自然流畅的解读文字\n- 结合现代心理学洞察\n- 提供实用的生活建议\n\n传统占星师 vs AI\n传统占星师提供人性化的互动和直觉洞察，但受限于时间和费用。AI占星提供即时、免费、一致的服务，适合初步探索和日常指导。两者并非对立，而是互补。\n\n如何使用星缘AI占星\n访问 lunaxstar.com，选择你需要的服务：本命盘解读、推运预测、合盘分析、每日运势。输入精确的出生信息（日期、时间、地点），AI会立即生成个性化的解读报告。\n\n隐私保护\n我们重视你的隐私。所有出生数据仅用于生成解读，不会被存储或用于其他目的。你可以安心探索占星的奥秘。',
      en: 'Artificial Intelligence is transforming how we access astrology. Traditional astrology requires booking a professional astrologer, which is expensive and time-limited. AI astrology allows everyone to access deep chart interpretations anytime, anywhere.\n\nAdvantages of AI Astrology\n1. Available 24/7: Whenever and wherever, just visit lunaxstar.com to get interpretations\n2. Completely Free: We believe astrological wisdom should be accessible to everyone\n3. Objective and Unbiased: AI won"t let personal emotions or biases affect interpretations\n4. Personalized Deep Analysis: Based on your precise birth data, not generic horoscopes\n5. Multi-language Support: Chinese, English, Indonesian, benefiting more people\n\nThe Power of LLaMA Model\nLunaxstar uses advanced LLaMA large language models, trained on professional astrological knowledge. It can:\n- Understand complex planetary aspects and house relationships\n- Generate natural and fluent interpretation text\n- Integrate modern psychological insights\n- Provide practical life advice\n\nTraditional Astrologer vs AI\nTraditional astrologers provide human interaction and intuitive insights but are limited by time and cost. AI astrology provides instant, free, consistent service, ideal for initial exploration and daily guidance. They are not opposed but complementary.\n\nHow to Use Lunaxstar AI Astrology\nVisit lunaxstar.com, choose the service you need: natal chart interpretation, transit predictions, composite analysis, daily horoscope. Enter precise birth information (date, time, place), and AI will immediately generate a personalized interpretation report.\n\nPrivacy Protection\nWe value your privacy. All birth data is only used to generate interpretations and will not be stored or used for other purposes. You can safely explore the mysteries of astrology.',
    },
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 7,
    tags: ['AI占星', '免费解读', 'LLaMA占星', 'AI astrology', '人工智能'],
  },
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
      id: 'Ramalan Zodiak 2026: Tanda Zodiak Mana yang Akan Memiliki Tahun Terbaik',
    },
    excerpt: {
      zh: '2026年，木星进入处女座，土星在双鱼座，天王星在双子座。这将是非常特殊的一年！了解行星 alignments 如何影响你的星座，提前规划精彩一年。',
      en: 'In 2026, Jupiter enters Virgo, Saturn is in Pisces, and Uranus is in Gemini. This will be a very special year! Learn how planetary alignments affect your sign and plan an amazing year ahead.',
      id: 'Pada 2026, Jupiter memasuki Virgo, Saturnus di Pisces, dan Uranus di Gemini. Ini akan menjadi tahun yang sangat istimewa! Pelajari bagaimana penyelarasan planet mempengaruhi tanda Anda dan rencanakan tahun yang luar biasa ke depan.',
    },
    content: {
      zh: '2026年的天象配置非常特殊，将给不同星座带来截然不同的机遇和挑战。让我们看看这一年将如何展开。\n\n2026年重要天象\n- 木星在处女座（1月-9月）：关注健康、工作和日常效率\n- 木星在天秤座（10月-12月）：关系和谐，合作机会增加\n- 土星在双鱼座（持续影响）：灵性成长，情感深化\n- 天王星在双子座（持续影响）：沟通革新，学习方式改变\n- 冥王星在水瓶座（持续影响）：科技与社会变革\n\n最佳运势星座\n♍ 处女座：木星过境，全年好运！事业、健康、日常工作都获得木星祝福。这是追求完美、提升技能的最佳年份。\n♎ 天秤座：下半年木星进入本命宫，人际关系和合作运势飙升。单身的天秤可能遇到真命天子/天女。\n♊ 双子座：天王星激发创新和沟通才能。适合学习新技能、开始写作或媒体项目。\n\n需要关注的星座\n♓ 双鱼座：土星在本命宫，带来责任和成长的机会。虽然压力增大,但这是建立长期基础的年份。\n♑ 摩羯座：冥王星离开摩羯进入水瓶，标志着一个时代的结束。适应变化是关键。\n\n给所有星座的建议\n1. 利用木星在处女座的时机，建立健康的生活习惯\n2. 关注日常工作的效率和质量提升\n3. 开放心态接受新技术和沟通方式\n4. 投资长期关系，而非短期利益\n\n如何使用星缘查看个人运势\n在 lunaxstar.com 的运势页面，输入你的出生信息，获取个性化的2026年年度预测。我们的AI会分析行星对你本命盘的具体影响，提供精准的指导。\n\n记住：占星学显示趋势和能量，最终的选择权在你手中。祝你2026年精彩纷呈！',
      en: 'The astrological configuration of 2026 is very special, bringing distinctly different opportunities and challenges to different signs. Let"s see how this year will unfold.\n\nMajor Astrological Events in 2026\n- Jupiter in Virgo (January-September): Focus on health, work, and daily efficiency\n- Jupiter in Libra (October-December): Relationship harmony, increased cooperation opportunities\n- Saturn in Pisces (ongoing influence): Spiritual growth, emotional deepening\n- Uranus in Gemini (ongoing influence): Communication revolution, changes in learning methods\n- Pluto in Aquarius (ongoing influence): Technology and social transformation\n\nBest Fortune Signs\n♍ Virgo: Jupiter transit, good luck all year! Career, health, and daily work are all blessed by Jupiter. This is the best year to pursue perfection and upgrade skills.\n♎ Libra: Jupiter enters the natal house in the second half, relationship and cooperation fortune soars. Single Libras may meet their soulmate.\n♊ Gemini: Uranus stimulates innovation and communication talents. Suitable for learning new skills, starting writing or media projects.\n\nSigns Needing Attention\n♓ Pisces: Saturn in the natal house brings responsibility and growth opportunities. Although pressure increases, this is a year to build long-term foundations.\n♑ Capricorn: Pluto leaves Capricorn and enters Aquarius, marking the end of an era. Adapting to change is key.\n\nAdvice for All Signs\n1. Use the period of Jupiter in Virgo to establish healthy living habits\n2. Focus on improving efficiency and quality in daily work\n3. Keep an open mind to accept new technologies and communication methods\n4. Invest in long-term relationships, not short-term benefits\n\nHow to Check Personal Horoscope on Lunaxstar\nOn the horoscope page of lunaxstar.com, enter your birth information to get a personalized 2026 annual prediction. Our AI will analyze how planets specifically affect your natal chart and provide precise guidance.\n\nRemember: Astrology shows trends and energies, but the final choice is in your hands. Wishing you a wonderful 2026!',
    },
    author: '星缘团队',
    authorEn: 'Lunaxstar Team',
    authorId: 'Tim Lunaxstar',
    date: '2026-05-20',
    readTime: 11,
    tags: ['2026运势', '今年星座', '年度预测', 'yearly horoscope', '2026'],
  },
];

// Category color mapping
const categoryColors: Record<string, string> = {
  tutorial: 'bg-blue-500/20 text-blue-400',
  guide: 'bg-purple-500/20 text-purple-400',
  analysis: 'bg-green-500/20 text-green-400',
  horoscope: 'bg-amber-500/20 text-amber-400',
  technology: 'bg-cyan-500/20 text-cyan-400',
};

export default function BlogPage() {
  const { language } = useLanguage();
  const currentT = t[language] || t.en;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'zh' ? 'zh-CN' : language === 'id' ? 'id-ID' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };
  
  const getCategoryName = (article: BlogArticle) => {
    if (language === 'zh') return article.categoryZh;
    if (language === 'en') return article.categoryEn;
    if (language === 'id') return article.categoryId;
    return article.categoryEn;
  };
  
  const getCategoryColor = (category: string) => {
    return categoryColors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-pink-900/20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentT.title}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {currentT.subtitle}
          </p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-4 mb-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full inline-block" />
            {currentT.featured}
          </h3>
          
          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white/5 rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient Image Area */}
                <div className="aspect-video bg-gradient-to-br from-purple-50/30 via-pink-900/20 to-indigo-50/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-60" />
                  <span className="text-5xl relative z-10">✨</span>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {getCategoryName(article)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime} {currentT.minRead}
                    </span>
                    <span>•</span>
                    <span>{formatDate(article.date)}</span>
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {article.title[language] || article.title.en}
                  </h4>
                  
                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt[language] || article.excerpt.en}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {currentT.by} {language === 'zh' ? article.author : language === 'id' ? article.authorId : article.authorEn}
                    </div>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-700 text-sm font-medium transition-colors"
                    >
                      {currentT.readMore}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer Info */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            {language === 'zh' ? '更多精彩内容即将推出，敬请期待...' : language === 'id' ? 'Konten menarik lebih banyak akan segera hadir, nantikan...' : 'More exciting content coming soon, stay tuned...'}
          </p>
        </div>
      </section>
    </div>
  );
}
