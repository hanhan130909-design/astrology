/**
 * AI Reading API Route
 * POST /api/ai-reading
 * 
 * Body:
 * {
 *   type: 'natal' | 'synastry' | 'yearly',
 *   birthData: {...},
 *   planetPositions: {...},
 *   housePositions: [...],
 *   aspects: [...],
 *   // for synastry:
 *   person2: {...},
 *   // for yearly:
 *   year: number,
 *   transits: [...]
 * }
 * 
 * Headers:
 *   Authorization: Bearer YOUR_OPENAI_API_KEY
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Lazy OpenAI client
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,
  });
}

// 语言映射
const languageMap: Record<string, string> = {
  zh: 'Chinese',
  id: 'Indonesian',
  en: 'English'
};

// 行星名称
const planetNames: Record<string, Record<string, string>> = {
  zh: {
    Sun: '太阳', Moon: '月亮', Mercury: '水星', Venus: '金星', Mars: '火星',
    Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Pluto: '冥王星'
  },
  id: {
    Sun: 'Matahari', Moon: 'Bulan', Mercury: 'Merkurius', Venus: 'Venus', Mars: 'Mars',
    Jupiter: 'Jupiter', Saturn: 'Saturnus', Uranus: 'Uranus', Neptune: 'Neptunus', Pluto: 'Pluto'
  },
  en: {
    Sun: 'Sun', Moon: 'Moon', Mercury: 'Mercury', Venus: 'Venus', Mars: 'Mars',
    Jupiter: 'Jupiter', Saturn: 'Saturn', Uranus: 'Uranus', Neptune: 'Neptune', Pluto: 'Pluto'
  }
};

// 相位名称
const aspectNames: Record<string, Record<string, string>> = {
  zh: { Conjunction: '合', Sextile: '六', Square: '刑', Trine: '拱', Opposition: '冲' },
  id: { Conjunction: 'Konjungsi', Sextile: 'Sekstil', Square: 'Kuadrat', Trine: 'Trigon', Opposition: 'Oposisi' },
  en: { Conjunction: 'Conjunction', Sextile: 'Sextile', Square: 'Square', Trine: 'Trine', Opposition: 'Opposition' }
};

// 星座名称
const signNames: Record<string, Record<string, string>> = {
  zh: {
    Aries: '白羊座', Taurus: '金牛座', Gemini: '双子座', Cancer: '巨蟹座',
    Leo: '狮子座', Virgo: '处女座', Libra: '天秤座', Scorpio: '天蝎座',
    Sagittarius: '射手座', Capricorn: '摩羯座', Aquarius: '水瓶座', Pisces: '双鱼座'
  },
  id: {
    Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer',
    Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio',
    Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces'
  },
  en: {
    Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer',
    Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio',
    Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, birthData, planetPositions, housePositions, aspects, person2, year, transits, language = 'zh' } = body;

    const lang = language || 'zh';
    const planets = planetNames[lang] || planetNames.zh;
    const aspects_tr = aspectNames[lang] || aspectNames.zh;
    const signs_tr = signNames[lang] || signNames.zh;

    // 构建系统提示
    const systemPrompt = lang === 'zh' 
      ? `你是一位专业的西方占星师，精通本命盘分析、合盘解读和运势预测。请用${lang === 'zh' ? '中文' : lang === 'id' ? '印尼语' : '英语'}提供温暖、专业、洞察力强的解读。`
      : lang === 'id'
      ? `Kamu adalah ahli astrologi Barat profesional. Berikan analisis yang hangat, profesional, dan penuh wawasan dalam Bahasa Indonesia.`
      : `You are a professional Western astrologer. Provide warm, professional, and insightful readings in English.`;

    let userPrompt = '';

    if (type === 'natal') {
      // 行星位置
      const planetList = Object.entries(planetPositions || {})
        .filter(([_, data]) => data && !(data as any).error)
        .map(([planet, data]: [string, any]) => 
          `${planets[planet] || planet} di ${signs_tr[data.sign] || data.sign} ${data.degree?.toFixed(1)}°`
        ).join('\n');

      // 主要相位
      const aspectList = (aspects || [])
        .filter((a: any) => ['Conjunction', 'Square', 'Trine', 'Opposition'].includes(a.type))
        .slice(0, 5)
        .map((a: any) => `${planets[a.planet1] || a.planet1} ${aspects_tr[a.type]} ${planets[a.planet2] || a.planet2}`)
        .join('\n');

      const birthDate = `${birthData.year}-${birthData.month.toString().padStart(2,'0')}-${birthData.day.toString().padStart(2,'0')} ${birthData.hour.toString().padStart(2,'0')}:${(birthData.minute||0).toString().padStart(2,'0')}`;

      userPrompt = `
分析以下本命盘：

出生信息：${birthDate}
出生地：纬度 ${birthData.latitude?.toFixed(2)}°, 经度 ${birthData.longitude?.toFixed(2)}°

行星位置：
${planetList || 'N/A'}

主要相位：
${aspectList || 'N/A'}

请从以下方面进行分析：
1. 核心性格特点
2. 情感与内心世界
3. 沟通与思维方式
4. 人际关系与爱情
5. 事业与人生目标
6. 人生挑战与成长建议

请提供具体、有洞察力的解读，300-500字。
`;
    } else if (type === 'synastry' && person2) {
      const synAspects = (aspects || []).slice(0, 8)
        .map((a: any) => `${planets[a.planet1] || a.planet1} ${aspects_tr[a.type]} ${planets[a.planet2] || a.planet2}`)
        .join('\n');

      userPrompt = `
分析两人的合盘关系：

第一人：${birthData.year}-${birthData.month.toString().padStart(2,'0')}-${birthData.day.toString().padStart(2,'0')}
第二人：${person2.year}-${person2.month.toString().padStart(2,'0')}-${person2.day.toString().padStart(2,'0')}

关系相位：
${synAspects || 'N/A'}

请分析：
1. 两人之间的吸引与挑战
2. 沟通与理解模式
3. 情感连接深度
4. 长期兼容性
5. 关系建议

300-400字专业分析。
`;
    } else if (type === 'yearly') {
      const transitList = (transits || []).slice(0, 5)
        .map((t: any) => `${planets[t.planet] || t.planet} di ${signs_tr[t.sign] || t.sign}`)
        .join('\n');

      userPrompt = `
预测${year}年年度运势：

出生：${birthData.year}-${birthData.month.toString().padStart(2,'0')}-${birthData.day.toString().padStart(2,'0')}

主要行运：
${transitList || 'N/A'}

请预测：
1. ${year}年整体运势
2. 各领域运势（事业/感情/财运/健康）
3. 重要时间节点
4. 建议

300-400字。
`;
    }

    // 检查 API Key - 如果没有则返回备用解读
    if (!process.env.OPENAI_API_KEY) {
      const fallbackReading = lang === 'zh' 
        ? `【备用解读】\n\n基于您提供的出生信息，这是一个充满潜力的星盘。\n\n太阳星座代表您的核心自我，月亮星座反映您的情感需求，上升星座展示您给外界的印象。\n\n主要建议：\n1. 发挥您的天生优势\n2. 注意行星相位带来的挑战\n3. 保持开放心态迎接机遇\n\n如需更详细的AI解读，请配置OpenAI API密钥。`
        : lang === 'id'
        ? `【Pembacaan Cadangan】\n\nBerdasarkan informasi kelahiran Anda, ini adalah bagan yang penuh potensi.\n\nMatahari mewakili inti diri Anda, Bulan mencerminkan kebutuhan emosional, dan Ascendant menunjukkan kesan Anda kepada dunia luar.\n\nSaran utama:\n1. Manfaatkan kelebihan alami Anda\n2. Perhatikan tantangan dari aspek planet\n3. Tetap terbuka untuk peluang\n\nUntuk pembacaan AI yang lebih detail, silakan konfigurasi API key OpenAI.`
        : `【Fallback Reading】\n\nBased on your birth information, this is a chart full of potential.\n\nThe Sun represents your core self, the Moon reflects your emotional needs, and the Ascendant shows your impression to the outside world.\n\nMain suggestions:\n1. Leverage your natural strengths\n2. Pay attention to challenges from planetary aspects\n3. Stay open to opportunities\n\nFor more detailed AI reading, please configure OpenAI API key.`;
      
      return NextResponse.json({
        success: true,
        reading: fallbackReading,
        content: fallbackReading,
        fallback: true
      }, { status: 200 });
    }

    // 调用 OpenAI
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      reading: content,
      content,
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('AI Reading Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
