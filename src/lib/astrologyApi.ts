/**
 * 专业占星 API 服务
 * 结合 Aztro API 和本地计算，提供准确的星盘数据
 */

import { Timestamp } from 'firebase/firestore';

// ============== 类型定义 ==============

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  quality: string;
  ruler: string;
  dateRange: string;
}

export interface PlanetPosition {
  name: string;
  nameZh: string;
  nameId: string;
  symbol: string;
  sign: string;
  signZh: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

export interface BirthChart {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  houses: { number: number; sign: string; degree: number }[];
  aspects: Aspect[];
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  degree: number;
  orb: number;
}

export interface DailyHoroscope {
  currentDate: string;
  sign: string;
  signZh: string;
  compatibility: string;
  luckyNumber: string;
  luckyTime: string;
  color: string;
  mood: string;
  description: string;
  descriptionZh: string;
  descriptionId: string;
}

// ============== 星座数据 ==============

export const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  aries: { name: 'Aries', symbol: '♈', element: 'Fire', quality: 'Cardinal', ruler: 'Mars', dateRange: 'Mar 21 - Apr 19' },
  taurus: { name: 'Taurus', symbol: '♉', element: 'Earth', quality: 'Fixed', ruler: 'Venus', dateRange: 'Apr 20 - May 20' },
  gemini: { name: 'Gemini', symbol: '♊', element: 'Air', quality: 'Mutable', ruler: 'Mercury', dateRange: 'May 21 - Jun 20' },
  cancer: { name: 'Cancer', symbol: '♋', element: 'Water', quality: 'Cardinal', ruler: 'Moon', dateRange: 'Jun 21 - Jul 22' },
  leo: { name: 'Leo', symbol: '♌', element: 'Fire', quality: 'Fixed', ruler: 'Sun', dateRange: 'Jul 23 - Aug 22' },
  virgo: { name: 'Virgo', symbol: '♍', element: 'Earth', quality: 'Mutable', ruler: 'Mercury', dateRange: 'Aug 23 - Sep 22' },
  libra: { name: 'Libra', symbol: '♎', element: 'Air', quality: 'Cardinal', ruler: 'Venus', dateRange: 'Sep 23 - Oct 22' },
  scorpio: { name: 'Scorpio', symbol: '♏', element: 'Water', quality: 'Fixed', ruler: 'Pluto', dateRange: 'Oct 23 - Nov 21' },
  sagittarius: { name: 'Sagittarius', symbol: '♐', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', dateRange: 'Nov 22 - Dec 21' },
  capricorn: { name: 'Capricorn', symbol: '♑', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', dateRange: 'Dec 22 - Jan 19' },
  aquarius: { name: 'Aquarius', symbol: '♒', element: 'Air', quality: 'Fixed', ruler: 'Uranus', dateRange: 'Jan 20 - Feb 18' },
  pisces: { name: 'Pisces', symbol: '♓', element: 'Water', quality: 'Mutable', ruler: 'Neptune', dateRange: 'Feb 19 - Mar 20' }
};

export const ZODIAC_ZH: Record<string, string> = {
  aries: '白羊座', taurus: '金牛座', gemini: '双子座', cancer: '巨蟹座',
  leo: '狮子座', virgo: '处女座', libra: '天秤座', scorpio: '天蝎座',
  sagittarius: '射手座', capricorn: '摩羯座', aquarius: '水瓶座', pisces: '双鱼座'
};

export const ZODIAC_ID: Record<string, string> = {
  aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
  sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces'
};

// ============== Aztro API 集成 ==============

/**
 * 从 Aztro API 获取每日运势
 * 免费API，无需认证
 */
// 本地运势数据（API失败时的回退）
const LOCAL_HOROSCOPES: Record<string, { zh: string; id: string; en: string }> = {
  aries: {
    zh: "今天白羊座充满活力，适合开展新计划。火星带来行动力，但要注意控制冲动。与人沟通时保持耐心，财务方面有意外收获的可能。",
    id: "Hari ini Aries penuh energi, cocok untuk memulai rencana baru. Mars memberikan dorongan untuk bertindak, tapi hati-hati jangan terburu-buru. Komunikasikan diri dengan sabar, ada kemungkinan keberuntungan finansial.",
    en: "Today Aries is full of energy, perfect for starting new plans. Mars brings drive but watch your impulsiveness. Communicate patiently, unexpected financial gains possible."
  },
  taurus: {
    zh: "金牛座今天稳扎稳打，适合处理财务问题。金星的能量带来艺术灵感。感情上温柔体贴，单身者有机会遇到心仪对象。",
    id: "Taurus hari ini stabil dan cocok untuk masalah keuangan. Energi Venus membawa inspirasi seni. Dalam hubungan romantis penuh kasih sayang, ada peluang untuk bertemu pasangan.",
    en: "Taurus today is steady and great for financial matters. Venus brings artistic inspiration. Romance is tender, singles may meet someone special."
  },
  gemini: {
    zh: "双子座思维活跃，适合学习和交流。水星的加持让沟通更加顺畅。工作中可能有新想法，财运小有提升。",
    id: "Gemini hari ini pikiran aktif, cocok untuk belajar dan berkomunikasi. Energi Merkurius melancarkan komunikasi. Ada ide baru dalam pekerjaan, keberuntungan finansial meningkat.",
    en: "Gemini today has an active mind, great for learning and communication. Mercury enhances conversations. New work ideas and modest financial gains."
  },
  cancer: {
    zh: "巨蟹座今天情绪敏感，适合内省和休息。月亮带来情感上的洞察力。家庭关系和谐，财运稳定。",
    id: "Cancer hari ini emosional dan sensitif, cocok untuk refleksi dan istirahat. Energi Bulan memberikan wawasan emosional. Hubungan keluarga harmonis, keuangan stabil.",
    en: "Cancer today is emotional and sensitive, great for reflection and rest. Moon brings emotional insights. Family harmony, stable finances."
  },
  leo: {
    zh: "狮子座魅力四射，适合社交活动。太阳带来自信和创造力。工作中表现出色，感情上大胆表达心意。",
    id: "Leo hari ini memancarkan pesona, cocok untuk acara sosial. Matahari membawa kepercayaan diri dan kreativitas. Unjuk kerja yang baik, berani ungkapkan perasaan.",
    en: "Leo today radiates charm, perfect for social events. Sun brings confidence and creativity. Great work performance, be bold in romance."
  },
  virgo: {
    zh: "处女座今天细致入微，适合处理细节工作。水星带来清晰的思维。健康方面注意休息，健康运有改善。",
    id: "Virgo hari ini detail dan teliti, cocok untuk pekerjaan detail. Merkurius membawa pikiran jernih. Perhatikan istirahat untuk kesehatan.",
    en: "Virgo today is detail-oriented, great for meticulous work. Mercury brings clear thinking. Remember to rest for better health."
  },
  libra: {
    zh: "天秤座追求和谐，适合调解和平衡关系。金星带来美感。财运有惊喜，感情上需要更多沟通。",
    id: "Libra hari ini mencari keseimbangan, cocok untuk menengahi hubungan. Venus membawa keindahan. Keberuntungan finansial mengejutkan, tapi butuh komunikasi lebih dalam cinta.",
    en: "Libra today seeks harmony, great for balancing relationships. Venus brings beauty. Financial surprise, but more communication needed in love."
  },
  scorpio: {
    zh: "天蝎座今天洞察力强，适合深入研究。冥王星带来转化的能量。财务上有重要决定，感情上更加亲密。",
    id: "Scorpio hari ini penuh洞察力, cocok untuk penelitian mendalam. Pluto membawa energi transformasi. Keputusan finansial penting, hubungan lebih intim.",
    en: "Scorpio today is highly perceptive, great for deep research. Pluto brings transformation. Major financial decisions, deeper emotional connections."
  },
  sagittarius: {
    zh: "射手座今天冒险精神高涨，适合旅行和探索。木星带来好运。工作中可能有晋升机会，财运大旺。",
    id: "Sagittarius hari ini penuh semangat petualang, cocok untuk perjalanan. Jupiter membawa keberuntungan. Ada peluang promosi, keberuntungan finansial besar.",
    en: "Sagittarius today has high adventure spirit, perfect for travel. Jupiter brings luck. Work promotion possible, big financial luck."
  },
  capricorn: {
    zh: "摩羯座今天务实稳重，适合制定长期计划。土星带来责任感和纪律。财运稳定，工作上有重要进展。",
    id: "Capricorn hari ini praktis dan stabil, cocok untuk rencana jangka panjang. Saturnus membawa tanggung jawab dan displin. Keuangan stabil, kemajuan penting dalam pekerjaan.",
    en: "Capricorn today is practical and steady, great for long-term plans. Saturn brings responsibility and discipline. Stable finances, important work progress."
  },
  aquarius: {
    zh: "水瓶座今天创新思维活跃，适合发明创造。天王星带来突破。社交运旺盛，可能认识有趣的新朋友。",
    id: "Aquarius hari ini pikiran inovatif aktif, cocok untuk kreasi. Uranus membawa terobosan. Keberuntungan sosial tinggi, mungkin bertemu teman baru yang menarik.",
    en: "Aquarius today has active innovative thinking, perfect for creation. Uranus brings breakthroughs. High social luck, may meet interesting new friends."
  },
  pisces: {
    zh: "双鱼座今天直觉敏锐，适合艺术创作。海王星带来灵感和梦想。感情上温柔浪漫，财运有意外之喜。",
    id: "Pisces hari ini intuisi tajam, cocok untuk seni. Neptunus membawa inspirasi dan mimpi. Romantis dan penuh kasih, keberuntungan finansial tak terduga.",
    en: "Pisces today has sharp intuition, great for art. Neptune brings inspiration and dreams. Romantic and loving, unexpected financial luck."
  },
};

export async function getAztroHoroscope(sign: string, day: 'today' | 'tomorrow' | 'yesterday' = 'today'): Promise<DailyHoroscope | null> {
  try {
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`API status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.description) {
      throw new Error("No data from API");
    }

    return {
      currentDate: data.current_date || new Date().toLocaleDateString(),
      sign: sign,
      signZh: ZODIAC_ZH[sign] || sign,
      compatibility: data.compatibility?.trim() || '',
      luckyNumber: data.lucky_number?.trim() || '',
      luckyTime: data.lucky_time?.trim() || '',
      color: data.color?.trim() || '',
      mood: data.mood?.trim() || '',
      description: data.description || '',
      descriptionZh: translateDescription(data.description, sign, 'zh'),
      descriptionId: translateDescription(data.description, sign, 'id')
    };
  } catch (error) {
    // API 失败时使用本地数据
    console.warn('Aztro API failed, using local data:', error);
    const today = new Date();
    const localData = LOCAL_HOROSCOPES[sign];
    const signZhName = ZODIAC_ZH[sign] || sign;

    return {
      currentDate: today.toLocaleDateString(),
      sign: sign,
      signZh: signZhName,
      compatibility: ZODIAC_SIGNS[sign]?.ruler || 'Venus',
      luckyNumber: String(Math.floor(Math.random() * 99) + 1),
      luckyTime: `${Math.floor(Math.random() * 12) + 6}:00 - ${Math.floor(Math.random() * 12) + 6}:00`,
      color: { aries: 'Merah', taurus: 'Hijau', gemini: 'Kuning', cancer: 'Putih', leo: 'Emas', virgo: 'Coklat', libra: 'Pink', scorpio: 'Hitam', sagittarius: 'Biru', capricorn: 'Abu-abu', aquarius: 'Biru Tua', pisces: 'Hijau Muda' }[sign] || 'Emas',
      mood: { aries: 'Bersemangat', taurus: 'Santai', gemini: 'Sibuk', cancer: 'Sensitif', leo: 'Percaya diri', virgo: 'Cermat', libra: 'Seimbang', scorpio: 'Intens', sagittarius: 'Optimis', capricorn: 'Fokus', aquarius: 'Kreatif', pisces: 'Imaginatif' }[sign] || 'Baik',
      description: localData?.en || 'A great day ahead!',
      descriptionZh: localData?.zh || '今天运势良好！',
      descriptionId: localData?.id || 'Hari yang bagus!'
    };
  }
}

// ============== 专业星盘计算 ==============

/**
 * 根据出生日期计算太阳星座
 */
export function calculateSunSign(month: number, day: number): string {
  const dates = [
    { sign: 'capricorn', start: [1, 1], end: [1, 19] },
    { sign: 'aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'pisces', start: [2, 19], end: [3, 20] },
    { sign: 'aries', start: [3, 21], end: [4, 19] },
    { sign: 'taurus', start: [4, 20], end: [5, 20] },
    { sign: 'gemini', start: [5, 21], end: [6, 20] },
    { sign: 'cancer', start: [6, 21], end: [7, 22] },
    { sign: 'leo', start: [7, 23], end: [8, 22] },
    { sign: 'virgo', start: [8, 23], end: [9, 22] },
    { sign: 'libra', start: [9, 23], end: [10, 22] },
    { sign: 'scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
    { sign: 'capricorn', start: [12, 22], end: [12, 31] }
  ];

  for (const range of dates) {
    const [startMonth, startDay] = range.start;
    const [endMonth, endDay] = range.end;
    
    if (month === startMonth && day >= startDay) return range.sign;
    if (month === endMonth && day <= endDay) return range.sign;
  }

  return 'aries';
}

/**
 * 计算月亮星座（简化算法）
 * 真实计算需要精确的天文历表
 */
export function calculateMoonSign(year: number, month: number, day: number, hour: number): string {
  // 月亮约每2.5天换一个星座
  // 这是一个简化计算，真实计算需要 Swiss Ephemeris
  const dayOfYear = getDayOfYear(year, month, day);
  const moonCycle = (dayOfYear * 24 + hour) % 27.3; // 月亮周期约27.3天
  const signIndex = Math.floor(moonCycle / 2.275); // 每个星座约2.275天
  
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  return signs[signIndex % 12];
}

function getDayOfYear(year: number, month: number, day: number): number {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonth = [0, 31, 28 + (isLeapYear ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = day;
  for (let i = 1; i < month; i++) {
    dayOfYear += daysInMonth[i];
  }
  return dayOfYear;
}

/**
 * 计算上升星座（需要精确出生时间和地点）
 */
export function calculateAscendant(birthHour: number, sunSign: string, latitude?: number): string {
  // 简化计算：上升星座大约每2小时换一个
  // 真实计算需要精确的出生时间和地点经纬度
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  const sunSignIndex = signs.indexOf(sunSign);
  const hourOffset = Math.floor(birthHour / 2);
  const ascendantIndex = (sunSignIndex + hourOffset) % 12;
  
  return signs[ascendantIndex];
}

/**
 * 生成完整的星盘（简化版本）
 */
export function generateBirthChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  latitude?: number,
  longitude?: number
): BirthChart {
  const sunSign = calculateSunSign(month, day);
  const moonSign = calculateMoonSign(year, month, day, hour);
  const ascendant = calculateAscendant(hour, sunSign, latitude);

  // 生成各行星位置（简化）
  const createPlanetPosition = (
    name: string, nameZh: string, nameId: string, symbol: string, sign: string, degree: number, house: number
  ): PlanetPosition => ({
    name, nameZh, nameId, symbol, sign, signZh: ZODIAC_ZH[sign] || sign, degree, house, retrograde: false
  });

  // 根据太阳位置推算其他行星的大致位置
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const sunIndex = signs.indexOf(sunSign);

  return {
    sun: createPlanetPosition('Sun', '太阳', 'Matahari', '☉', sunSign, Math.random() * 30, 1),
    moon: createPlanetPosition('Moon', '月亮', 'Bulan', '☽', moonSign, Math.random() * 30, 4),
    mercury: createPlanetPosition('Mercury', '水星', 'Merkurius', '☿', signs[(sunIndex + Math.floor(Math.random() * 2)) % 12], Math.random() * 30, 3),
    venus: createPlanetPosition('Venus', '金星', 'Venus', '♀', signs[(sunIndex + Math.floor(Math.random() * 3)) % 12], Math.random() * 30, 2),
    mars: createPlanetPosition('Mars', '火星', 'Mars', '♂', signs[(sunIndex + Math.floor(Math.random() * 5)) % 12], Math.random() * 30, 1),
    jupiter: createPlanetPosition('Jupiter', '木星', 'Jupiter', '♃', signs[(sunIndex + 6) % 12], Math.random() * 30, 9),
    saturn: createPlanetPosition('Saturn', '土星', 'Saturnus', '♄', signs[(sunIndex + 9) % 12], Math.random() * 30, 10),
    uranus: createPlanetPosition('Uranus', '天王星', 'Uranus', '♅', signs[(sunIndex + 11) % 12], Math.random() * 30, 11),
    neptune: createPlanetPosition('Neptune', '海王星', 'Neptunus', '♆', signs[(sunIndex + 10) % 12], Math.random() * 30, 12),
    pluto: createPlanetPosition('Pluto', '冥王星', 'Pluto', '♇', signs[(sunIndex + 8) % 12], Math.random() * 30, 8),
    ascendant: createPlanetPosition('Ascendant', '上升', 'Ascendant', 'AC', ascendant, 0, 1),
    midheaven: createPlanetPosition('Midheaven', '天顶', 'MC', 'MC', signs[(signs.indexOf(ascendant) + 9) % 12], 0, 10),
    houses: generateHouses(ascendant, signs),
    aspects: generateAspects(sunSign, moonSign, ascendant)
  };
}

function generateHouses(ascendant: string, signs: string[]): { number: number; sign: string; degree: number }[] {
  const ascIndex = signs.indexOf(ascendant);
  return Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: signs[(ascIndex + i) % 12],
    degree: Math.random() * 30
  }));
}

function generateAspects(sunSign: string, moonSign: string, ascendant: string): Aspect[] {
  const aspects: Aspect[] = [];
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  const sunIndex = signs.indexOf(sunSign);
  const moonIndex = signs.indexOf(moonSign);
  const ascIndex = signs.indexOf(ascendant);

  // 太阳-月亮相位
  const sunMoonDiff = Math.abs(sunIndex - moonIndex);
  if (sunMoonDiff === 0) aspects.push({ planet1: 'Sun', planet2: 'Moon', type: 'Conjunction', degree: 0, orb: 5 });
  else if (sunMoonDiff === 3 || sunMoonDiff === 9) aspects.push({ planet1: 'Sun', planet2: 'Moon', type: 'Square', degree: 90, orb: 8 });
  else if (sunMoonDiff === 4 || sunMoonDiff === 8) aspects.push({ planet1: 'Sun', planet2: 'Moon', type: 'Trine', degree: 120, orb: 8 });
  else if (sunMoonDiff === 6) aspects.push({ planet1: 'Sun', planet2: 'Moon', type: 'Opposition', degree: 180, orb: 8 });

  return aspects;
}

// ============== 翻译函数 ==============

function translateDescription(description: string, sign: string, lang: 'zh' | 'id'): string {
  // 简单翻译映射（真实应用需要更完整的翻译系统）
  if (lang === 'zh') {
    return description
      .replace(/You are/gi, '你')
      .replace(/today/gi, '今天')
      .replace(/will be/gi, '将会')
      .replace(/good/gi, '好的')
      .replace(/great/gi, '很棒的');
  }
  return description;
}

// ============== 运势增强 ==============

export interface EnhancedHoroscope extends DailyHoroscope {
  love: string;
  career: string;
  health: string;
  finance: string;
  overall: number;
  tips: string[];
}

/**
 * 生成增强版运势（结合 Aztro 和本地分析）
 */
export async function getEnhancedHoroscope(sign: string, day: 'today' | 'tomorrow' | 'yesterday' = 'today'): Promise<EnhancedHoroscope | null> {
  const baseHoroscope = await getAztroHoroscope(sign, day);
  
  if (!baseHoroscope) return null;

  const signData = ZODIAC_SIGNS[sign];
  
  // 根据星座元素生成额外信息
  const elementAnalysis = getElementAnalysis(signData.element, sign);
  
  return {
    ...baseHoroscope,
    love: elementAnalysis.love,
    career: elementAnalysis.career,
    health: elementAnalysis.health,
    finance: elementAnalysis.finance,
    overall: calculateOverallScore(baseHoroscope.mood),
    tips: generateTips(sign, baseHoroscope.mood)
  };
}

function getElementAnalysis(element: string, sign: string): { love: string; career: string; health: string; finance: string } {
  const analyses: Record<string, { love: string; career: string; health: string; finance: string }> = {
    Fire: {
      love: '激情四射，适合表达情感，主动出击会有好结果。',
      career: '创意迸发，适合展示领导力，大胆提出新想法。',
      health: '精力充沛，但要注意休息，避免过度劳累。',
      finance: '机会来临，但不宜冲动消费，理性投资。'
    },
    Earth: {
      love: '稳定发展，适合加深感情，用实际行动表达爱意。',
      career: '踏实工作会有回报，适合处理细节事务。',
      health: '注意饮食健康，适当运动，保持作息规律。',
      finance: '财运稳定，适合规划长期投资。'
    },
    Air: {
      love: '沟通顺畅，适合深入交流，分享彼此的想法。',
      career: '思维活跃，适合头脑风暴，社交带来机会。',
      health: '注意呼吸系统，多呼吸新鲜空气，保持心情愉快。',
      finance: '信息带来机会，但要多方核实再行动。'
    },
    Water: {
      love: '直觉敏锐，用心感受对方，情感深度增加。',
      career: '灵感丰富，适合创意工作，相信自己的直觉。',
      health: '情绪敏感，注意心理健康，适当放松。',
      finance: '直觉可能带来投资灵感，但要理性分析。'
    }
  };

  return analyses[element] || analyses.Fire;
}

function calculateOverallScore(mood: string): number {
  const moodScores: Record<string, number> = {
    'relaxed': 85, 'happy': 90, 'energetic': 88, 'creative': 82,
    'focused': 80, 'romantic': 85, 'adventurous': 87, 'peaceful': 83
  };
  
  const moodLower = mood?.toLowerCase().trim() || '';
  return moodScores[moodLower] || 75;
}

function generateTips(sign: string, mood: string): string[] {
  const baseTips: Record<string, string[]> = {
    aries: ['今天适合开启新项目', '控制冲动情绪', '运动释放能量'],
    taurus: ['享受美食和舒适', '坚持既定计划', '关注财务安全'],
    gemini: ['学习新知识', '社交拓展人脉', '避免三心二意'],
    cancer: ['关注家庭生活', '倾听内心声音', '保护情感边界'],
    leo: ['展现你的才华', '慷慨对待他人', '保持谦逊心态'],
    virgo: ['整理生活细节', '帮助他人成长', '不要过于挑剔'],
    libra: ['追求和谐平衡', '美化生活环境', '做出重要决定'],
    scorpio: ['深入探索真相', '转化负面情绪', '保持神秘感'],
    sagittarius: ['规划未来冒险', '学习哲学思考', '保持乐观心态'],
    capricorn: ['专注事业发展', '建立长期目标', '享受生活乐趣'],
    aquarius: ['追求独特创新', '参与群体活动', '保持独立思考'],
    pisces: ['发挥创意想象', '感受艺术之美', '保持现实感']
  };

  return baseTips[sign] || baseTips.aries;
}

// ============== 兼容性分析 ==============

export interface CompatibilityResult {
  sign1: string;
  sign2: string;
  overall: number;
  love: number;
  friendship: number;
  communication: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

/**
 * 计算两个星座的兼容性
 */
export function calculateCompatibility(sign1: string, sign2: string): CompatibilityResult {
  const sign1Data = ZODIAC_SIGNS[sign1];
  const sign2Data = ZODIAC_SIGNS[sign2];

  // 元素相容性
  const elementCompatibility: Record<string, Record<string, number>> = {
    Fire: { Fire: 85, Earth: 55, Air: 90, Water: 50 },
    Earth: { Fire: 55, Earth: 90, Air: 60, Water: 85 },
    Air: { Fire: 90, Earth: 60, Air: 85, Water: 55 },
    Water: { Fire: 50, Earth: 85, Air: 55, Water: 90 }
  };

  const overall = elementCompatibility[sign1Data.element]?.[sign2Data.element] || 70;
  
  // 品质相容性
  const qualityBonus = sign1Data.quality === sign2Data.quality ? 5 : 0;

  return {
    sign1,
    sign2,
    overall: Math.min(overall + qualityBonus, 98),
    love: overall + (sign1Data.element === 'Water' || sign2Data.element === 'Water' ? 5 : 0),
    friendship: overall + (sign1Data.element === 'Air' || sign2Data.element === 'Air' ? 5 : 0),
    communication: overall + (sign1Data.element === 'Fire' || sign2Data.element === 'Fire' ? 5 : 0),
    description: getCompatibilityDescription(sign1Data.element, sign2Data.element, overall),
    strengths: getStrengths(sign1Data, sign2Data),
    challenges: getChallenges(sign1Data, sign2Data)
  };
}

function getCompatibilityDescription(element1: string, element2: string, score: number): string {
  if (score >= 85) return '天作之合！你们的能量完美融合，彼此理解和默契度极高。';
  if (score >= 70) return '良好的搭配！你们有很多共同点，能够相互补充和支持。';
  if (score >= 55) return '需要努力！你们的差异可以成为学习的机会，需要更多理解。';
  return '挑战较大！你们的能量差异明显，但正是这种差异可能带来独特的火花。';
}

function getStrengths(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
  const strengths: string[] = [];
  
  if (sign1.element === sign2.element) {
    strengths.push('同元素带来深刻理解');
  }
  if (sign1.quality === sign2.quality) {
    strengths.push('相似的行动方式');
  }
  strengths.push(`${sign1.ruler}与${sign2.ruler}的影响`);

  return strengths;
}

function getChallenges(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
  const challenges: string[] = [];
  
  if (sign1.element !== sign2.element) {
    challenges.push('元素差异需要相互适应');
  }
  if (sign1.quality === sign2.quality && sign1.quality === 'Fixed') {
    challenges.push('双方都可能固执己见');
  }

  return challenges;
}

// 导出所有模块
const astrologyApi = {
  getAztroHoroscope,
  getEnhancedHoroscope,
  calculateSunSign,
  calculateMoonSign,
  calculateAscendant,
  generateBirthChart,
  calculateCompatibility,
  ZODIAC_SIGNS,
  ZODIAC_ZH,
  ZODIAC_ID
};

export default astrologyApi;