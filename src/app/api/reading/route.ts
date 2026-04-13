/**
 * Chart Reading API - Free/Paid Content Layering
 * 生成星盘解读内容，分层展示免费和付费内容
 */

import { NextRequest, NextResponse } from 'next/server';

// ════════════════════════════════════════════════════════════════════════════
// 星座关键词数据库
// ════════════════════════════════════════════════════════════════════════════

const SIGN_KEYWORDS: Record<string, Record<string, { keywords: string[]; traits: string[]; advice: string }>> = {
  Aries: {
    zh: {
      keywords: ['冲动', '领导力', '热情', '勇气'],
      traits: ['天生的领导者', '行动力强', '独立自主', '竞争心强'],
      advice: '2026年是你突破自我的关键年，事业上有重大转机，但需注意人际关系的平衡。'
    },
    en: {
      keywords: ['Bold', 'Leadership', 'Passion', 'Courage'],
      traits: ['Natural Leader', 'Action-oriented', 'Independent', 'Competitive'],
      advice: '2026 is your breakthrough year. Major career opportunities await, but maintain balance in relationships.'
    },
    id: {
      keywords: ['Berani', 'Kepemimpinan', 'Passion', 'Keberanian'],
      traits: ['Pemimpin Alami', 'Berorientasi Aksi', 'Mandiri', 'Kompetitif'],
      advice: '2026 adalah tahun terobosan Anda. Peluang karir besar menanti, tapi jaga keseimbangan hubungan.'
    }
  },
  Taurus: {
    zh: {
      keywords: ['稳定', '实际', '固执', '享受'],
      traits: ['务实可靠', '耐心坚韧', '艺术天分', '物质追求'],
      advice: '2026年财运稳定上升，投资理财有好运气，但需避免过度保守错过新机会。'
    },
    en: {
      keywords: ['Stable', 'Practical', 'Stubborn', 'Sensual'],
      traits: ['Reliable', 'Patient', 'Artistic', 'Material-focused'],
      advice: '2026 brings stable financial growth. Good luck in investments, but avoid being too conservative.'
    },
    id: {
      keywords: ['Stabil', 'Praktis', 'Pertahankan', 'Sensual'],
      traits: ['Dapat Diandalkan', 'Sabar', 'Artistik', 'Fokus Material'],
      advice: '2026 membawa pertumbuhan keuangan yang stabil. Keberuntungan baik dalam investasi.'
    }
  },
  Gemini: {
    zh: {
      keywords: ['多变', '聪明', '沟通', '好奇'],
      traits: ['思维敏捷', '多才多艺', '善于沟通', '好奇心强'],
      advice: '2026年学习运极佳，适合进修或考证，但需专注避免三心二意。'
    },
    en: {
      keywords: ['Versatile', 'Clever', 'Communicative', 'Curious'],
      traits: ['Quick-witted', 'Multi-talented', 'Great communicator', 'Curious'],
      advice: '2026 is excellent for learning. Perfect for courses or certifications, but stay focused.'
    },
    id: {
      keywords: ['Serbaguna', 'Cerdas', 'Komunikatif', 'Penasarang'],
      traits: ['Cepat Berpikir', 'Multi-bakat', 'Komunikator Hebat', 'Penasaran'],
      advice: '2026 sangat baik untuk belajar. Sempurna untuk kursus atau sertifikasi.'
    }
  },
  Cancer: {
    zh: {
      keywords: ['敏感', '家庭', '情感', '保护'],
      traits: ['情感丰富', '家庭导向', '直觉力强', '保护欲强'],
      advice: '2026年家庭运势良好，适合购房或家庭投资，感情上需要更多安全感。'
    },
    en: {
      keywords: ['Sensitive', 'Home-loving', 'Emotional', 'Protective'],
      traits: ['Deeply emotional', 'Family-oriented', 'Intuitive', 'Protective'],
      advice: '2026 brings good family fortune. Great for home investment. Need more emotional security.'
    },
    id: {
      keywords: ['Sensitif', 'Cinta Keluarga', 'Emosional', 'Protektif'],
      traits: ['Sangat Emosional', 'Berorientasi Keluarga', 'Intuitif', 'Protektif'],
      advice: '2026 membawa keberuntungan keluarga yang baik. Cocok untuk investasi properti.'
    }
  },
  Leo: {
    zh: {
      keywords: ['自信', '戏剧', '慷慨', '骄傲'],
      traits: ['天生明星', '创造力强', '慷慨大方', '领导魅力'],
      advice: '2026年是展现自我的黄金年，创意项目有突破，但需注意团队合作。'
    },
    en: {
      keywords: ['Confident', 'Dramatic', 'Generous', 'Proud'],
      traits: ['Natural Star', 'Creative', 'Generous', 'Charismatic Leader'],
      advice: '2026 is your golden year for self-expression. Creative breakthroughs await.'
    },
    id: {
      keywords: ['Percaya Diri', 'Dramatis', 'Murah Hati', 'Bangga'],
      traits: ['Bintang Alami', 'Kreatif', 'Murah Hati', 'Pemimpin Karismatik'],
      advice: '2026 adalah tahun emas untuk ekspresi diri. Terobosan kreatif menanti.'
    }
  },
  Virgo: {
    zh: {
      keywords: ['分析', '完美', '服务', '实际'],
      traits: ['注重细节', '分析力强', '务实可靠', '助人为乐'],
      advice: '2026年工作运势极佳，有机会获得晋升，健康方面需注意肠胃问题。'
    },
    en: {
      keywords: ['Analytical', 'Perfectionist', 'Service-oriented', 'Practical'],
      traits: ['Detail-oriented', 'Analytical', 'Reliable', 'Helpful'],
      advice: '2026 brings excellent career fortune. Promotion opportunities await. Watch digestive health.'
    },
    id: {
      keywords: ['Analitis', 'Perfeksionis', 'Berorientasi Layanan', 'Praktis'],
      traits: ['Fokus Detail', 'Analitis', 'Dapat Diandalkan', 'Membantu'],
      advice: '2026 membawa keberuntungan karir yang sangat baik. Kesempatan promosi menanti.'
    }
  },
  Libra: {
    zh: {
      keywords: ['平衡', '和谐', '美感', '社交'],
      traits: ['追求和谐', '审美力强', '善于合作', '优柔寡断'],
      advice: '2026年感情运势良好，有伴侣的可能有重要进展，单身者有望遇见正缘。'
    },
    en: {
      keywords: ['Balanced', 'Harmonious', 'Aesthetic', 'Social'],
      traits: ['Harmony-seeker', 'Great taste', 'Cooperative', 'Indecisive'],
      advice: '2026 brings good relationship fortune. Important developments for couples.'
    },
    id: {
      keywords: ['Seimbang', 'Harmonis', 'Estetis', 'Sosial'],
      traits: ['Pencari Harmoni', 'Selera Bagus', 'Kooperatif', 'Tidak Memihak'],
      advice: '2026 membawa keberuntungan hubungan yang baik. Perkembangan penting untuk pasangan.'
    }
  },
  Scorpio: {
    zh: {
      keywords: ['神秘', '深刻', '执着', '洞察'],
      traits: ['意志坚强', '洞察力强', '感情深刻', '神秘魅力'],
      advice: '2026年是蜕变重生之年，适合告别过去开启新篇章，财务上有意外收获。'
    },
    en: {
      keywords: ['Mysterious', 'Deep', 'Determined', 'Insightful'],
      traits: ['Strong-willed', 'Intuitive', 'Deep feeler', 'Mysterious'],
      advice: '2026 is your transformation year. Perfect for new beginnings. Unexpected financial gains.'
    },
    id: {
      keywords: ['Misterius', 'Dalam', 'Bertekad', 'Wawasan'],
      traits: ['Tekad Kuat', 'Intuitif', 'Perasa Dalam', 'Misterius'],
      advice: '2026 adalah tahun transformasi Anda. Sempurna untuk awal baru. Keuntungan finansial tak terduga.'
    }
  },
  Sagittarius: {
    zh: {
      keywords: ['自由', '哲学', '冒险', '乐观'],
      traits: ['热爱自由', '哲学思想', '冒险精神', '乐观积极'],
      advice: '2026年旅行运极佳，有机会出国发展或长途旅行，学习新领域有好运气。'
    },
    en: {
      keywords: ['Free', 'Philosophical', 'Adventurous', 'Optimistic'],
      traits: ['Freedom-lover', 'Philosophical', 'Adventurous', 'Optimistic'],
      advice: '2026 brings excellent travel fortune. Opportunities abroad or long-distance journeys await.'
    },
    id: {
      keywords: ['Bebas', 'Filosofis', 'Petualang', 'Optimis'],
      traits: ['Pecinta Kebebasan', 'Filosofis', 'Petualang', 'Optimis'],
      advice: '2026 membawa keberuntungan perjalanan yang sangat baik. Kesempatan di luar negeri menanti.'
    }
  },
  Capricorn: {
    zh: {
      keywords: ['责任', '目标', '纪律', '实际'],
      traits: ['责任心强', '目标明确', '纪律严明', '务实可靠'],
      advice: '2026年是事业收获年，长期项目会有成果，但需注意工作与生活的平衡。'
    },
    en: {
      keywords: ['Responsible', 'Goal-oriented', 'Disciplined', 'Practical'],
      traits: ['Highly responsible', 'Goal-focused', 'Disciplined', 'Reliable'],
      advice: '2026 is your career harvest year. Long-term projects bear fruit. Balance work and life.'
    },
    id: {
      keywords: ['Bertanggung Jawab', 'Berorientasi Tujuan', 'Disiplin', 'Praktis'],
      traits: ['Sangat Bertanggung Jawab', 'Fokus Tujuan', 'Disiplin', 'Dapat Diandalkan'],
      advice: '2026 adalah tahun panen karir Anda. Proyek jangka panjang berbuah. Seimbangkan kerja dan hidup.'
    }
  },
  Aquarius: {
    zh: {
      keywords: ['创新', '人道', '独立', '叛逆'],
      traits: ['创新思维', '人道主义', '独立自主', '不拘一格'],
      advice: '2026年是创新突破之年，科技或创业项目有好运气，社交圈会有重要变化。'
    },
    en: {
      keywords: ['Innovative', 'Humanitarian', 'Independent', 'Rebellious'],
      traits: ['Innovative thinker', 'Humanitarian', 'Independent', 'Unique'],
      advice: '2026 is your innovation year. Tech or startup projects bring good luck. Social changes ahead.'
    },
    id: {
      keywords: ['Inovatif', 'Humanitarian', 'Mandiri', 'Memberontak'],
      traits: ['Pemikir Inovatif', 'Humanitarian', 'Mandiri', 'Unik'],
      advice: '2026 adalah tahun inovasi Anda. Proyek teknologi atau startup membawa keberuntungan.'
    }
  },
  Pisces: {
    zh: {
      keywords: ['直觉', '梦幻', '艺术', '同理心'],
      traits: ['直觉力强', '艺术天分', '富有同情心', '理想主义'],
      advice: '2026年是灵性成长之年，艺术创作有突破，但需注意边界避免过度付出。'
    },
    en: {
      keywords: ['Intuitive', 'Dreamy', 'Artistic', 'Empathetic'],
      traits: ['Highly intuitive', 'Artistic talent', 'Compassionate', 'Idealistic'],
      advice: '2026 is your spiritual growth year. Artistic breakthroughs await. Maintain healthy boundaries.'
    },
    id: {
      keywords: ['Intuitif', 'Mimpi', 'Artistik', 'Empati'],
      traits: ['Sangat Intuitif', 'Bakat Artistik', 'Penuh Kasih', 'Idealis'],
      advice: '2026 adalah tahun pertumbuhan spiritual Anda. Terobosan artistik menanti.'
    }
  }
};

// 行星解读
const PLANET_READINGS: Record<string, Record<string, { title: string; meaning: string; advice: string }>> = {
  Sun: {
    zh: { title: '太阳星座 - 核心自我', meaning: '代表你的核心身份、生命力和自我表达方式', advice: '发挥你的太阳星座特质，展现真实的自我' },
    en: { title: 'Sun Sign - Core Self', meaning: 'Represents your core identity, vitality and self-expression', advice: 'Embrace your Sun sign traits and show your true self' },
    id: { title: 'Matahari - Diri Inti', meaning: 'Mewakili identitas inti, vitalitas dan ekspresi diri', advice: 'Terimalah sifat tanda Matahari Anda dan tunjukkan diri Anda yang sebenarnya' }
  },
  Moon: {
    zh: { title: '月亮星座 - 情感内核', meaning: '代表你的情感需求、内在安全感和潜意识反应', advice: '理解你的月亮星座，找到内心的平静' },
    en: { title: 'Moon Sign - Emotional Core', meaning: 'Represents your emotional needs, inner security and subconscious', advice: 'Understand your Moon sign to find inner peace' },
    id: { title: 'Bulan - Inti Emosional', meaning: 'Mewakili kebutuhan emosional, keamanan batin dan bawah sadar', advice: 'Pahami tanda Bulan Anda untuk menemukan kedamaian batin' }
  }
};

// ════════════════════════════════════════════════════════════════════════════
// API Handler
// ════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planets, ascendant, language = 'en', isPaid = false } = body;
    
    const lang = language as 'zh' | 'en' | 'id';
    
    // 免费内容：太阳、月亮、上升
    const freeReading = {
      sun: generatePlanetReading('Sun', planets?.Sun, lang),
      moon: generatePlanetReading('Moon', planets?.Moon, lang),
      ascendant: generateAscendantReading(ascendant, lang),
    };
    
    // 付费内容：完整解读
    const paidReading = isPaid ? {
      allPlanets: generateAllPlanetsReading(planets, lang),
      monthlyForecast: generateMonthlyForecast(lang),
      wealthDirection: generateWealthAdvice(ascendant?.sign, lang),
      lifePath: generateLifePathAdvice(planets, lang),
      blindSpots: generateBlindSpots(planets, lang),
    } : null;
    
    return NextResponse.json({
      success: true,
      free: freeReading,
      paid: paidReading,
      isPaid,
      price: {
        amount: 19000,
        currency: 'IDR',
        formatted: 'Rp 19.000',
      }
    });
    
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 辅助函数
// ════════════════════════════════════════════════════════════════════════════

function generatePlanetReading(planetId: string, planetData: any, lang: 'zh' | 'en' | 'id') {
  if (!planetData || planetData.error) {
    return null;
  }
  
  const sign = planetData.sign;
  const signData = SIGN_KEYWORDS[sign]?.[lang];
  const planetInfo = PLANET_READINGS[planetId]?.[lang];
  
  return {
    planet: planetId,
    symbol: planetData.symbol || planetData.planetSymbol,
    sign: sign,
    sign_cn: planetData.sign_cn,
    degree: planetData.formatted,
    title: planetInfo?.title || '',
    keywords: signData?.keywords || [],
    traits: signData?.traits || [],
    advice: signData?.advice || '',
  };
}

function generateAscendantReading(ascendant: any, lang: 'zh' | 'en' | 'id') {
  if (!ascendant) return null;
  
  const sign = ascendant.sign;
  const signData = SIGN_KEYWORDS[sign]?.[lang];
  
  const titles = {
    zh: '上升星座 - 人生面具',
    en: 'Ascendant - Life Mask',
    id: 'Ascendant - Topeng Kehidupan'
  };
  
  return {
    sign: sign,
    sign_cn: ascendant.sign_cn,
    symbol: ascendant.symbol,
    degree: ascendant.formatted,
    title: titles[lang],
    keywords: signData?.keywords || [],
    traits: signData?.traits || [],
    advice: signData?.advice || '',
  };
}

function generateAllPlanetsReading(planets: Record<string, any>, lang: 'zh' | 'en' | 'id') {
  if (!planets) return [];
  
  return Object.entries(planets)
    .filter(([_, data]) => !(_ as any).error)
    .map(([id, data]) => generatePlanetReading(id, data, lang))
    .filter(Boolean);
}

function generateMonthlyForecast(lang: 'zh' | 'en' | 'id') {
  const forecasts = {
    zh: [
      { month: '4月', theme: '事业突破', advice: '适合推进重要项目' },
      { month: '5月', theme: '人际调整', advice: '注意沟通，避免误会' },
      { month: '6月', theme: '财运上升', advice: '投资理财有好机会' },
      { month: '7月', theme: '感情转机', advice: '单身者遇见正缘' },
      { month: '8月', theme: '健康关注', advice: '注意休息和饮食' },
      { month: '9月', theme: '学习成长', advice: '适合进修新技能' },
    ],
    en: [
      { month: 'Apr', theme: 'Career Breakthrough', advice: 'Great for important projects' },
      { month: 'May', theme: 'Relationship Adjust', advice: 'Focus on communication' },
      { month: 'Jun', theme: 'Financial Rise', advice: 'Good investment opportunities' },
      { month: 'Jul', theme: 'Love Turnaround', advice: 'Singles may meet the one' },
      { month: 'Aug', theme: 'Health Focus', advice: 'Rest and diet attention needed' },
      { month: 'Sep', theme: 'Learning Growth', advice: 'Perfect for new skills' },
    ],
    id: [
      { month: 'Apr', theme: 'Terobosan Karir', advice: 'Cocok untuk proyek penting' },
      { month: 'Mei', theme: 'Penyesuaian Hubungan', advice: 'Fokus pada komunikasi' },
      { month: 'Jun', theme: 'Keuangan Meningkat', advice: 'Kesempatan investasi baik' },
      { month: 'Jul', theme: 'Putusan Cinta', advice: 'Lajang mungkin bertemu jodoh' },
      { month: 'Ags', theme: 'Fokus Kesehatan', advice: 'Perlu istirahat dan diet' },
      { month: 'Sep', theme: 'Pertumbuhan Belajar', advice: 'Sempurna untuk skill baru' },
    ],
  };
  
  return forecasts[lang];
}

function generateWealthAdvice(sign: string, lang: 'zh' | 'en' | 'id') {
  const directions: Record<string, Record<string, { direction: string; advice: string }>> = {
    Aries: {
      zh: { direction: '东南方', advice: '适合创业和投资，避免冲动消费' },
      en: { direction: 'Southeast', advice: 'Good for entrepreneurship and investment, avoid impulse spending' },
      id: { direction: 'Tenggara', advice: 'Cocok untuk wirausaha dan investasi, hindari belanja impulsif' }
    },
    Taurus: {
      zh: { direction: '西南方', advice: '适合稳健投资，房产是好选择' },
      en: { direction: 'Southwest', advice: 'Good for steady investments, real estate is favorable' },
      id: { direction: 'Barat Daya', advice: 'Cocok untuk investasi stabil, properti menguntungkan' }
    },
    // ... 其他星座
  };
  
  return directions[sign]?.[lang] || { direction: '正东方', advice: '保持稳定的财务规划' };
}

function generateLifePathAdvice(planets: Record<string, any>, lang: 'zh' | 'en' | 'id') {
  const messages = {
    zh: '根据你的星盘配置，你的人生使命是找到平衡物质追求与精神成长的道路。你的北交点指向需要发展的方向，南交点则是需要放下的过往模式。',
    en: 'Based on your chart configuration, your life purpose is to find a balance between material pursuits and spiritual growth. Your North Node points to where you need to develop, while South Node indicates past patterns to release.',
    id: 'Berdasarkan konfigurasi bagan Anda, tujuan hidup Anda adalah menemukan keseimbangan antara pencarian material dan pertumbuhan spiritual.'
  };
  
  return messages[lang];
}

function generateBlindSpots(planets: Record<string, any>, lang: 'zh' | 'en' | 'id') {
  const spots = {
    zh: [
      '你可能过于关注外部成就而忽视内心需求',
      '人际关系中容易忽略对方的感受',
      '完美主义倾向可能导致拖延',
      '财务决策时情绪影响较大'
    ],
    en: [
      'You may focus too much on external achievements while neglecting inner needs',
      'Easy to overlook others\' feelings in relationships',
      'Perfectionism may lead to procrastination',
      'Financial decisions heavily influenced by emotions'
    ],
    id: [
      'Anda mungkin terlalu fokus pada pencapaian eksternal sambil mengabaikan kebutuhan batin',
      'Mudah mengabaikan perasaan orang lain dalam hubungan',
      'Perfeksionisme dapat menyebabkan penundaan',
      'Keputusan keuangan sangat dipengaruhi emosi'
    ]
  };
  
  return spots[lang];
}
