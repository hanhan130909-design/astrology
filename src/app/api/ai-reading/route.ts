/**
 * AI Reading API Route - Professional Astrologer Version
 * POST /api/ai-reading
 * 
 * Features:
 * - Groq (FREE, ultra-fast LLaMA 3.1 70B)
 * - Fallback: OpenAI GPT-4o-mini
 * - 8-language support
 * - Professional astrologer prompts
 * - Rich Markdown output
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// ════════════════════════════════════════════════════════════════════════════
// Language Configuration
// ════════════════════════════════════════════════════════════════════════════

const LANGUAGE_CONFIG: Record<string, { 
  name: string; 
  astrologerStyle: string;
  greeting: string;
}> = {
  zh: { 
    name: 'Chinese', 
    astrologerStyle: '温暖口语化，像一位睿智的朋友在分享见解',
    greeting: '你好！我仔细分析了你的星盘，发现了很多有趣的故事...'
  },
  en: { 
    name: 'English', 
    astrologerStyle: 'warm and conversational, like a wise friend sharing insights',
    greeting: "Hello! I've examined your chart and found fascinating stories..."
  },
  id: { 
    name: 'Indonesian', 
    astrologerStyle: 'hangat dan percakapan, seperti teman bijak berbagi wawasan',
    greeting: 'Halo! Saya telah memeriksa bagan Anda dan menemukan cerita yang menarik...'
  },
  th: { 
    name: 'Thai', 
    astrologerStyle: 'อบอุ่นและเป็นกันเอง เหมือนเพื่อนที่มีภูมิปัญญาแบ่งปันข้อมูลเชิงลึก',
    greeting: 'สวัสดี! ฉันได้วิเคราะห์ดวงชะตาของคุณแล้ว พบเรื่องราวที่น่าสนใจมากมาย...'
  },
  vi: { 
    name: 'Vietnamese', 
    astrologerStyle: 'ấm áp và đàm đạo, như một người bạn khôn ngoan chia sẻ hiểu biết',
    greeting: 'Xin chào! Tôi đã phân tích biểu đồ của bạn và tìm thấy nhiều câu chuyện thú vị...'
  },
  ms: { 
    name: 'Malay', 
    astrologerStyle: 'mesra dan perbualan, seperti rakan bijak berkongsi cerapan',
    greeting: 'Helo! Saya telah memeriksa carta anda dan menemui cerita yang menarik...'
  },
  ja: { 
    name: 'Japanese', 
    astrologerStyle: '温かく会話調で、賢明な友人が洞察を共有するような',
    greeting: 'こんにちは！あなたのチャートを詳しく分析しました。とても興味深い物語が見つかりました...'
  },
  ko: { 
    name: 'Korean', 
    astrologerStyle: '따뜻하고 대화형으로, 지혜로운 친구가 통찰력을 공유하는 것처럼',
    greeting: '안녕하세요! 당신의 차트를 분석했더니 흥미로운 이야기들이 많이 보이네요...'
  }
};

// ════════════════════════════════════════════════════════════════════════════
// Translation Maps
// ════════════════════════════════════════════════════════════════════════════

const PLANET_NAMES: Record<string, Record<string, string>> = {
  zh: { Sun: '太阳', Moon: '月亮', Mercury: '水星', Venus: '金星', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Pluto: '冥王星', North_Node: '北交点', South_Node: '南交点', Chiron: '凯龙星' },
  en: { Sun: 'Sun', Moon: 'Moon', Mercury: 'Mercury', Venus: 'Venus', Mars: 'Mars', Jupiter: 'Jupiter', Saturn: 'Saturn', Uranus: 'Uranus', Neptune: 'Neptune', Pluto: 'Pluto', North_Node: 'North Node', South_Node: 'South Node', Chiron: 'Chiron' },
  id: { Sun: 'Matahari', Moon: 'Bulan', Mercury: 'Merkurius', Venus: 'Venus', Mars: 'Mars', Jupiter: 'Jupiter', Saturn: 'Saturnus', Uranus: 'Uranus', Neptune: 'Neptunus', Pluto: 'Pluto', North_Node: 'Node Utara', South_Node: 'Node Selatan', Chiron: 'Chiron' },
  th: { Sun: 'ดวงอาทิตย์', Moon: 'ดวงจันทร์', Mercury: 'ดาวพุธ', Venus: 'ดาวศุกร์', Mars: 'ดาวอังคาร', Jupiter: 'ดาวพฤหัสบดี', Saturn: 'ดาวเสาร์', Uranus: 'ดาวยูเรนัส', Neptune: 'ดาวเนปจูน', Pluto: 'ดาวพลูโต', North_Node: 'จุดเหนือ', South_Node: 'จุดใต้', Chiron: 'ไครอน' },
  vi: { Sun: 'Mặt Trời', Moon: 'Mặt Trăng', Mercury: 'Sao Thủy', Venus: 'Sao Kim', Mars: 'Sao Hỏa', Jupiter: 'Sao Mộc', Saturn: 'Sao Thổ', Uranus: 'Sao Thiên Vương', Neptune: 'Sao Hải Vương', Pluto: 'Sao Diêm Vương', North_Node: 'Điểm Bắc', South_Node: 'Điểm Nam', Chiron: 'Chiron' },
  ms: { Sun: 'Matahari', Moon: 'Bulan', Mercury: 'Utarid', Venus: 'Zuhrah', Mars: 'Marikh', Jupiter: 'Musytari', Saturn: 'Zuhal', Uranus: 'Uranus', Neptune: 'Neptun', Pluto: 'Pluto', North_Node: 'Nod Utara', South_Node: 'Nod Selatan', Chiron: 'Chiron' },
  ja: { Sun: '太陽', Moon: '月', Mercury: '水星', Venus: '金星', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Pluto: '冥王星', North_Node: '北ノード', South_Node: '南ノード', Chiron: 'カイロン' },
  ko: { Sun: '태양', Moon: '달', Mercury: '수성', Venus: '금성', Mars: '화성', Jupiter: '목성', Saturn: '토성', Uranus: '천왕성', Neptune: '해왕성', Pluto: '명왕성', North_Node: '북노드', South_Node: '남노드', Chiron: '카이론' }
};

const SIGN_NAMES: Record<string, Record<string, string>> = {
  zh: { Aries: '白羊座', Taurus: '金牛座', Gemini: '双子座', Cancer: '巨蟹座', Leo: '狮子座', Virgo: '处女座', Libra: '天秤座', Scorpio: '天蝎座', Sagittarius: '射手座', Capricorn: '摩羯座', Aquarius: '水瓶座', Pisces: '双鱼座' },
  en: { Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer', Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio', Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces' },
  id: { Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer', Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio', Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces' },
  th: { Aries: 'แกะ', Taurus: 'วัว', Gemini: 'เมถุน', Cancer: 'ปู', Leo: 'สิงโต', Virgo: 'กันย์', Libra: 'ตาชั่ง', Scorpio: 'แมลงป่อง', Sagittarius: 'ธนู', Capricorn: 'มังกร', Aquarius: 'กุมภ์', Pisces: 'ปลา' },
  vi: { Aries: 'Bạch Dương', Taurus: 'Kim Ngưu', Gemini: 'Song Tử', Cancer: 'Cự Giải', Leo: 'Sư Tử', Virgo: 'Xử Nữ', Libra: 'Thiên Bình', Scorpio: 'Bọ Cạp', Sagittarius: 'Nhân Mã', Capricorn: 'Ma Kết', Aquarius: 'Bảo Bình', Pisces: 'Song Ngư' },
  ms: { Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer', Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio', Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces' },
  ja: { Aries: '牡羊座', Taurus: '牡牛座', Gemini: '双子座', Cancer: '蟹座', Leo: '獅子座', Virgo: '乙女座', Libra: '天秤座', Scorpio: '蠍座', Sagittarius: '射手座', Capricorn: '山羊座', Aquarius: '水瓶座', Pisces: '魚座' },
  ko: { Aries: '양자리', Taurus: '황소자리', Gemini: '쌍둥이자리', Cancer: '게자리', Leo: '사자자리', Virgo: '처녀자리', Libra: '천칭자리', Scorpio: '전갈자리', Sagittarius: '궁수자리', Capricorn: '염소자리', Aquarius: '물병자리', Pisces: '물고기자리' }
};

const ASPECT_NAMES: Record<string, Record<string, string>> = {
  zh: { Conjunction: '合相', Sextile: '六合', Square: '刑相', Trine: '拱相', Opposition: '冲相', Quincunx: '梅花' },
  en: { Conjunction: 'Conjunction', Sextile: 'Sextile', Square: 'Square', Trine: 'Trine', Opposition: 'Opposition', Quincunx: 'Quincunx' },
  id: { Conjunction: 'Konjungsi', Sextile: 'Sekstil', Square: 'Kuadrat', Trine: 'Trigon', Opposition: 'Oposisi', Quincunx: 'Kuinkunks' },
  th: { Conjunction: 'ร่วม', Sextile: 'หกสิบ', Square: 'สี่เหลี่ยม', Trine: 'สามเหลี่ยม', Opposition: 'ตรงข้าม', Quincunx: 'ห้าสิบ' },
  vi: { Conjunction: 'Hợp', Sextile: 'Lục Hợp', Square: 'Hình Vuông', Trine: 'Tam Hợp', Opposition: 'Đối Xung', Quincunx: 'Bất Hợp' },
  ms: { Conjunction: 'Konjungsi', Sextile: 'Sekstil', Square: 'Segi Empat', Trine: 'Trigon', Opposition: 'Oposisi', Quincunx: 'Kuinkunks' },
  ja: { Conjunction: 'コンジャンクション', Sextile: 'セクスタイル', Square: 'スクエア', Trine: 'トライン', Opposition: 'オポジション', Quincunx: 'クインカンクス' },
  ko: { Conjunction: '컨정션', Sextile: '섹스타일', Square: '스퀘어', Trine: '트라인', Opposition: '오퍼지션', Quincunx: '퀸컨스' }
};

// ════════════════════════════════════════════════════════════════════════════
// System Prompts
// ════════════════════════════════════════════════════════════════════════════

function getSystemPrompt(lang: string): string {
  const config = LANGUAGE_CONFIG[lang] || LANGUAGE_CONFIG.zh;
  
  return `你是一位专业的西方占星师，精通古典占星与现代心理占星。

【人设风格】
${config.astrologerStyle}

【核心原则】
1. 不恐吓、不宿命：用"倾向""机会""挑战"替代"注定"
2. 具体不空洞：不说"感情运好"，而说"10月有重要感情机会"
3. 平衡呈现：每个配置都有天赋和挑战两面
4. 行动导向：每个分析都伴随可执行的建议

【分析框架】
🔥 核心自我（太阳+上升）：生命力、人格面具
🌙 情感内在（月亮+4宫）：情感需求、安全感来源  
💭 思维沟通（水星+3宫）：思考模式、表达风格
💕 情感关系（金星+7宫）：爱情观、吸引类型
⚡ 行动能量（火星+1宫）：追求方式、冲突处理
🎯 人生使命（土星+北交）：业力课题、成长方向

【输出要求】
- 使用Markdown格式
- 适当使用emoji提升可读性（🌟💫✨⚠️💡）
- 约1500字深度解读
- 结尾给出3条具体行动建议

回复语言：${config.name}`;
}

function getNatalUserPrompt(data: any, lang: string): string {
  const planets = PLANET_NAMES[lang] || PLANET_NAMES.zh;
  const signs = SIGN_NAMES[lang] || SIGN_NAMES.zh;
  const aspects = ASPECT_NAMES[lang] || ASPECT_NAMES.zh;
  
  // Build planet list
  const planetList = Object.entries(data.planetPositions || {})
    .filter(([_, p]: [string, any]) => p && !p.error && p.longitude != null)
    .map(([key, p]: [string, any]) => {
      const name = planets[key] || key;
      const sign = signs[p.sign] || p.sign;
      return `${name} ${sign} ${p.degree?.toFixed(1)}°`;
    }).join('\n');

  // Build aspect list (top 8 most important)
  const aspectList = (data.aspects || [])
    .filter((a: any) => ['Conjunction', 'Square', 'Trine', 'Opposition'].includes(a.type || a.aspect))
    .slice(0, 8)
    .map((a: any) => {
      const p1 = planets[a.planet1] || a.planet1;
      const p2 = planets[a.planet2] || a.planet2;
      const asp = aspects[a.type || a.aspect] || a.type;
      return `${p1} ${asp} ${p2}`;
    }).join('\n');

  // Build house list
  const houseList = (data.housePositions || [])
    .slice(0, 6)
    .map((h: any, i: number) => `${i + 1}宫: ${signs[h.sign] || h.sign}`)
    .join('\n');

  const birthDate = `${data.birthData?.year}-${String(data.birthData?.month).padStart(2,'0')}-${String(data.birthData?.day).padStart(2,'0')} ${String(data.birthData?.hour||12).padStart(2,'0')}:${String(data.birthData?.minute||0).padStart(2,'0')}`;

  return `请解读以下本命盘：

【出生信息】
日期时间：${birthDate}
出生地点：纬度 ${data.birthData?.latitude?.toFixed(2)}°, 经度 ${data.birthData?.longitude?.toFixed(2)}°

【行星配置】
${planetList}

【主要相位】
${aspectList || '无明显主要相位'}

【宫位信息（前6宫）】
${houseList || '无宫位信息'}

【上升星座】
${planets.Ascendant || '上升'}：${data.ascendant ? signs[data.ascendant.sign] || data.ascendant.sign : '未知'}

请提供完整深度解读（约1500字），包含：
1. 🌟 核心性格画像（太阳+上升综合解读）
2. 🌙 情感世界（月亮位置揭示的内在需求）
3. 💭 思维与沟通（水星揭示的思维特点）
4. 💕 爱情与关系（金星+火星的关系模式）
5. ⚡ 行动与成就（火星+木星的能量投向）
6. 🎯 人生课题与成长方向（土星+北交点）
7. 📋 本月行动建议（3条具体建议）

使用温暖、具体的语言，让读者感到被理解而非被评判。`;
}

function getSynastryUserPrompt(data: any, lang: string): string {
  const planets = PLANET_NAMES[lang] || PLANET_NAMES.zh;
  const signs = SIGN_NAMES[lang] || SIGN_NAMES.zh;
  const aspects = ASPECT_NAMES[lang] || ASPECT_NAMES.zh;

  const aspectList = (data.aspects || [])
    .slice(0, 10)
    .map((a: any) => {
      const p1 = planets[a.planet1] || a.planet1;
      const p2 = planets[a.planet2] || a.planet2;
      const asp = aspects[a.type || a.aspect] || a.type;
      return `${p1} ${asp} ${p2}`;
    }).join('\n');

  return `请解读以下合盘关系：

【第一人】
出生：${data.birthData?.year}-${data.birthData?.month}-${data.birthData?.day}

【第二人】
出生：${data.person2?.year}-${data.person2?.month}-${data.person2?.day}

【关键相位】
${aspectList || '无明显相位'}

请提供关系解读（约1000字），包含：
1. 💕 整体兼容度评分（1-5星）
2. 🌟 核心连接（太阳-月亮/上升-上升相位）
3. 🗣️ 沟通模式（水星相位）
4. ❤️ 情感互动（月亮/金星相位）
5. ⚠️ 挑战与成长机会（土星/冥王硬相位转化）
6. 🤝 3条关系建设建议`;
}

function getYearlyUserPrompt(data: any, lang: string): string {
  const planets = PLANET_NAMES[lang] || PLANET_NAMES.zh;
  const signs = SIGN_NAMES[lang] || SIGN_NAMES.zh;

  const transitList = (data.transits || [])
    .slice(0, 6)
    .map((t: any) => `${planets[t.planet] || t.planet} ${signs[t.sign] || t.sign}`)
    .join('\n');

  return `请解读${data.year}年度运势：

【出生信息】
${data.birthData?.year}-${data.birthData?.month}-${data.birthData?.day}

【主要行运】
${transitList || '本年主要行运'}

请提供年度运势（约1200字），包含：
1. 🌟 年度主题关键词
2. 📅 季度重点（春夏秋冬各有什么机会/挑战）
3. 💼 事业运（⭐评分）
4. 💕 感情运（⭐评分）
5. 💰 财运（⭐评分）
6. ⚠️ 注意事项（逆行期/日月食影响）
7. 🎯 年度行动建议（3条）`;
}

// ════════════════════════════════════════════════════════════════════════════
// Main Handler
// ════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      birthData, 
      planetPositions, 
      housePositions, 
      aspects, 
      person2, 
      year, 
      transits, 
      language = 'zh',
      ascendant
    } = body;

    const lang = language || 'zh';
    const config = LANGUAGE_CONFIG[lang] || LANGUAGE_CONFIG.zh;

    // ═════════════════════════════════════════════════════════════════════════
    // Fallback Mode (No API Key)
    // ═════════════════════════════════════════════════════════════════════════
    
    // Check for Groq or OpenAI API key
    const hasGroqKey = !!process.env.GROQ_API_KEY;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    if (!hasGroqKey && !hasOpenAIKey) {
      const fallbackReading = generateFallbackReading(type, lang, planetPositions, birthData, config);
      return NextResponse.json({
        success: true,
        reading: fallbackReading,
        content: fallbackReading,
        fallback: true,
        message: 'AI解读需要配置 GROQ_API_KEY 或 OPENAI_API_KEY 以获得完整体验'
      }, { status: 200 });
    }

    // ═════════════════════════════════════════════════════════════════════════
    // AI Mode (Groq preferred, OpenAI fallback)
    // ═════════════════════════════════════════════════════════════════════════

    // Prefer Groq (free, fast), fallback to OpenAI
    const useGroq = hasGroqKey;
    const apiKey = useGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    const baseURL = useGroq ? 'https://api.groq.com/openai/v1' : (process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1');
    const model = useGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

    const openai = new OpenAI({
      apiKey,
      baseURL,
    });

    const systemPrompt = getSystemPrompt(lang);
    let userPrompt = '';

    const dataBundle = { birthData, planetPositions, housePositions, aspects, person2, year, transits, ascendant };

    if (type === 'natal') {
      userPrompt = getNatalUserPrompt(dataBundle, lang);
    } else if (type === 'synastry') {
      userPrompt = getSynastryUserPrompt(dataBundle, lang);
    } else if (type === 'yearly') {
      userPrompt = getYearlyUserPrompt(dataBundle, lang);
    } else {
      userPrompt = getNatalUserPrompt(dataBundle, lang);
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.75,
      max_tokens: type === 'natal' ? 2500 : 1500,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      reading: content,
      content,
      usage: completion.usage,
      model,
      provider: useGroq ? 'groq' : 'openai'
    });

  } catch (error: any) {
    console.error('AI Reading Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      reading: generateFallbackReading('natal', 'zh', {}, {}, LANGUAGE_CONFIG.zh)
    }, { status: 500 });
  }
}

// ════════════════════════════════════════════════════════════════════════════
// Fallback Generator
// ════════════════════════════════════════════════════════════════════════════

function generateFallbackReading(
  type: string, 
  lang: string, 
  planetPositions: any, 
  birthData: any,
  config: any
): string {
  const planets = PLANET_NAMES[lang] || PLANET_NAMES.zh;
  const signs = SIGN_NAMES[lang] || SIGN_NAMES.zh;

  // Extract sun and moon
  const sun = planetPositions?.Sun;
  const moon = planetPositions?.Moon;
  const sunSign = sun ? (signs[sun.sign] || sun.sign) : '天蝎座';
  const moonSign = moon ? (signs[moon.sign] || moon.sign) : '巨蟹座';

  if (lang === 'zh') {
    return `# 🌟 你的本命盘解读

${config.greeting}

## 🔥 核心性格画像

你的太阳落在**${sunSign}**，这赋予你强大的内在力量和深刻的情感世界。月亮在**${moonSign}**，进一步强化了你的直觉力和感受力。

你像深海中的珍珠——表面沉静，内在却蕴藏着丰富的情感宝藏。这组配置的人通常：

✨ 直觉力超群，能敏锐感知他人的情绪变化
✨ 情感深刻而持久，一旦认定便全力以赴
✨ 有强大的疗愈能力，适合从事心理咨询、疗愈工作

## 🌙 情感世界

月亮在${moonSign}的你，对情感安全有强烈需求。你需要一个能给予你情感稳定和归属感的港湾。在亲密关系中，你渴望深度的情感连接，而非表面的社交。

## 💕 爱情与关系

你在感情中既热烈又谨慎。热烈在于一旦认定就全情投入，谨慎在于你对情感安全感的要求很高。你的理想伴侣应该是：
- 能给予你情感安全感的人
- 能理解你深层需求的人
- 愿意建立长期稳定关系的人

## ⚡ 行动与成就

你的行动力来自内在的驱动力，一旦找到人生意义，就会爆发出惊人的执行力。适合从事需要深度洞察和疗愈能力的职业。

## 🎯 人生课题与成长方向

这一生，你的主要课题是学会：
- 建立健康的情感边界，保护自己的能量
- 将敏感转化为天赋，而非视为负担
- 学会信任，放下控制欲

## 📋 本月行动建议

根据你的星盘配置，建议本月：
1. 💡 每天留出15分钟独处时间，清理能量场
2. 💡 写下你的情感需求，学习清晰表达
3. 💡 尝试一个疗愈类的活动（冥想、瑜伽、能量疗愈）

---

*配置OpenAI API密钥可获得更详细的个性化AI解读*

星缘占星 | 数据基于真实天文计算`;
  }

  // English fallback
  return `# 🌟 Your Birth Chart Reading

${config.greeting}

## 🔥 Core Personality Portrait

With your Sun in **${sunSign}**, you have a powerful inner strength and deep emotional world. Moon in **${moonSign}** further amplifies your intuition and sensitivity.

You're like a pearl in the deep ocean—calm on the surface, yet containing rich emotional treasures within.

## 📋 Action Suggestions

1. 💡 Schedule daily alone time to clear your energy field
2. 💡 Journal your emotional needs and practice expressing them
3. 💡 Try a healing activity (meditation, yoga, energy work)

---

*Configure OpenAI API key for detailed personalized AI reading*

Starry Fate Astrology | Based on real astronomical calculations`;
}
