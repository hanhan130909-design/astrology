/**
 * OpenAI API Integration for AI Astrology Readings
 * 
 * 使用 OpenAI GPT 生成个性化星盘解读
 * 
 * 环境变量:
 * OPENAI_API_KEY - 你的 OpenAI API 密钥
 * OPENAI_API_BASE - 可选，自定义 API 端点
 */

// BirthData type
interface BirthData {
  name?: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  latitude: number;
  longitude: number;
  timezone?: number;
  gender?: string;
}

// OpenAI 配置
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';

// API 调用超时
const TIMEOUT = 30000;

// 请求封装
async function callOpenAI(prompt: string, options: {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional astrologer with deep knowledge of Western astrology.
You analyze birth charts and provide insightful, personalized readings.
Always respond in the language the user is using.
Be specific about planetary positions and their meanings.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// 生成行星位置描述
function describePlanetPosition(planet: string, sign: string, degree: number, house?: number): string {
  const planetNames: Record<string, string> = {
    Sun: '太阳',
    Moon: '月亮',
    Mercury: '水星',
    Venus: '金星',
    Mars: '火星',
    Jupiter: '木星',
    Saturn: '土星',
    Uranus: '天王星',
    Neptune: '海王星',
    Pluto: '冥王星'
  };

  const planetName = planetNames[planet] || planet;
  let desc = `${planetName}在${sign}${degree.toFixed(1)}°`;
  
  if (house) {
    desc += `，落在第${house}宫`;
  }
  
  return desc;
}

// 生成本命盘解读
export async function generateNatalReading(
  birthData: BirthData,
  planetPositions: Record<string, any>,
  housePositions: any[],
  aspects: any[]
): Promise<string> {
  // 构建行星位置描述
  const planetDescriptions = Object.entries(planetPositions)
    .filter(([_, data]) => data && !data.error)
    .map(([planet, data]) => {
      const house = housePositions.find((h: any) => {
        // 简化：假设行星在对应度数的宫位
        return Math.abs(h.longitude - data.longitude) < 30;
      });
      return describePlanetPosition(planet, data.sign_cn || data.sign, data.degree, house?.house);
    })
    .join('。');

  // 构建相位描述
  const aspectDescriptions = aspects
    .filter((a: any) => ['Conjunction', 'Square', 'Trine', 'Opposition'].includes(a.type))
    .slice(0, 5)
    .map((a: any) => {
      const typeMap: Record<string, string> = {
        'Conjunction': '合',
        'Square': '刑',
        'Trine': '拱',
        'Opposition': '冲'
      };
      return `${a.planet1}${typeMap[a.type]}${a.planet2}`;
    })
    .join('，');

  const birthDate = `${birthData.year}年${birthData.month}月${birthData.day}日${birthData.hour}时${birthData.minute || 0}分`;

  const prompt = `
请为以下星盘提供详细的性格解读：

出生信息：${birthDate}，出生于纬度${birthData.latitude.toFixed(2)}°，经度${birthData.longitude.toFixed(2)}°

行星位置：
${planetDescriptions}

主要相位：
${aspectDescriptions || '暂无主要相位'}

请从以下方面进行分析：
1. 核心性格特点
2. 情感模式
3. 沟通与思维模式
4. 人际关系与爱情
5. 事业与财运
6. 人生挑战与成长方向

请用温暖、专业的语气，提供具体且有洞察力的解读。`;

  try {
    return await callOpenAI(prompt, {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1500
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

// 生成合盘解读
export async function generateSynastryReading(
  person1: BirthData,
  person2: BirthData,
  synastryAspects: any[]
): Promise<string> {
  const prompt = `
请分析以下两人的合盘（关系盘）：

第一人：${person1.year}年${person1.month}月${person1.day}日
第二人：${person2.year}年${person2.month}月${person2.day}日

关系相位：
${synastryAspects.map((a: any) => `${a.planet1}与${a.planet2}形成${a.type}`).join('，')}

请分析：
1. 两人之间的吸引力和挑战
2. 沟通模式
3. 情感连接
4. 长期兼容性
5. 关系建议

请用专业但温暖的语气，提供有洞察力的分析。`;

  try {
    return await callOpenAI(prompt, {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1200
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

// 生成年度运势
export async function generateYearlyReading(
  birthData: BirthData,
  year: number,
  majorTransits: any[]
): Promise<string> {
  const prompt = `
请为以下用户预测${year}年的年度运势：

出生信息：${birthData.year}年${birthData.month}月${birthData.day}日

主要行运：
${majorTransits.map((t: any) => `${t.planet}行运经过${t.sign}`).join('，')}

请分析：
1. ${year}年整体运势
2. 各领域运势（事业、感情、财运、健康）
3. 重要时间节点
4. 建议与注意事项

请用专业、鼓励的语气。`;

  try {
    return await callOpenAI(prompt, {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1200
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

// Next.js API Route Handler
export async function handleAIAIReadingRequest(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { type, birthData, planetPositions, housePositions, aspects, person2, year, transits } = await req.json();

    let content = '';

    switch (type) {
      case 'natal':
        content = await generateNatalReading(birthData, planetPositions, housePositions, aspects);
        break;
      case 'synastry':
        content = await generateSynastryReading(birthData, person2, aspects);
        break;
      case 'yearly':
        content = await generateYearlyReading(birthData, year, transits);
        break;
      default:
        return Response.json({ error: 'Invalid reading type' }, { status: 400 });
    }

    return Response.json({ success: true, content });
  } catch (error) {
    console.error('AI Reading Error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
