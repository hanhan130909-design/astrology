/**
 * BaZi AI Chat API — /api/bazi-chat
 * POST: Send BaZi chart data + user question → AI response
 * Uses Groq (fast+free) with OpenAI fallback
 */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// BaZi System Prompt
const SYSTEM_PROMPT = `You are a master BaZi (Four Pillars of Destiny) astrologer with 30 years of experience. 
You analyze birth charts using classical Chinese metaphysics combined with modern psychological insight.

When given a BaZi chart, you:
1. Identify the Day Master and its strength
2. Analyze the Five Elements balance
3. Interpret the Ten Gods (十神) relationships
4. Explain the 10-year luck cycles (大运)
5. Give practical, actionable life advice

CRITICAL RULES:
- Always reference specific stems/branches when making claims (e.g., "Your 甲 Wood Day Master...")
- Never use fear-based language (no "curse", "disaster", "death")
- Frame challenges as "growth opportunities"
- Keep responses warm and conversational, like a wise mentor
- If asked about timing, reference the luck pillars and current year branch
- Answer in the same language the user asks in

BaZi Chart Interpretation Framework:
- 甲/乙 Wood → growth-oriented, flexible, idealistic
- 丙/丁 Fire → passionate, charismatic, impulsive
- 戊/己 Earth → stable, reliable, stubborn
- 庚/辛 Metal → disciplined, principled, rigid
- 壬/癸 Water → intuitive, adaptable, mysterious

The current year is 2026 — Year of the Yang Fire Horse (丙午).`;

// Natal Chart System Prompt
const NATAL_PROMPT = `You are a professional Western astrologer with 20 years of experience.
You analyze natal (birth) charts using modern psychological astrology combined with practical life guidance.

When given a natal chart, you:
1. Identify the Sun, Moon, and Rising signs and their significance
2. Analyze key planetary aspects (conjunctions, squares, trines, oppositions)
3. Interpret house placements for career, relationships, and life purpose
4. Give warm, practical, and psychologically insightful advice

CRITICAL RULES:
- Reference specific planets and signs (e.g., "Your Moon in Cancer suggests...")
- Never use fear-based language
- Frame challenges as growth opportunities
- Keep responses warm and conversational
- Answer in the same language the user asks in
- If the user asks about timing or predictions, explain that natal charts show tendencies not fixed futures

The current year is 2026.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chartData, question, language = 'en', history = [] } = body;

    if (!chartData || !question) {
      return NextResponse.json({ success: false, error: 'chartData and question required' }, { status: 400 });
    }

    // Detect chart type
    const isNatal = !!chartData.natal;

    // Build context from chart
    let chartContext = '';
    let systemPrompt = SYSTEM_PROMPT;

    if (isNatal) {
      const n = chartData.natal;
      chartContext = `NATAL CHART DATA:\n- Name: ${n.name || 'Unknown'}\n- Birth: ${n.year}-${n.month}-${n.day} ${n.hour}:00\n- Location: Lat ${n.lat}°, Lng ${n.lng}°, TZ GMT${n.tz >= 0 ? '+' : ''}${n.tz}\n- The above birth data generates a complete natal chart with planets, houses, and aspects.`;
      systemPrompt = NATAL_PROMPT;
    } else {
      const pillars = chartData.pillars || [];
      const naYinList = pillars.map((p: any) => `${p.label}: ${p.naYin || '-'}`).join(', ') || 'N/A';
      const hiddenList = pillars.map((p: any) => `${p.label}: ${(p.hidden || []).join(' ')}`).join(', ') || 'N/A';
      chartContext = `\nBAZI CHART DATA:\n- Four Pillars: ${JSON.stringify(pillars)}\n- Day Master: ${chartData.dayMaster?.stem || ''} ${chartData.dayMaster?.element || ''} ${chartData.dayMaster?.shiShen ? `(${chartData.dayMaster.shiShen})` : ''}\n- Lunar Date: ${chartData.meta?.lunarDate || 'N/A'}\n- Current JieQi: ${chartData.meta?.jieQi || 'N/A'}\n- NaYin: ${naYinList}\n- Hidden Stems: ${hiddenList}\n`;
    }

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];
    // Append conversation history
    for (const msg of history) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    messages.push({ role: 'user', content: `${chartContext}\n\nUSER QUESTION: ${question}\n\nPlease answer in ${language === 'zh' ? 'Chinese (中文)' : language === 'id' ? 'Indonesian' : 'English'}.` });

    let response: string | null = null;

    // Try Groq first (free, fast)
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey || apiKey.startsWith('gsk_dummy')) throw new Error('No Groq API key');
      const groq = new OpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messages as any,
        max_tokens: 800,
        temperature: 0.7,
      });
      response = completion.choices[0]?.message?.content?.trim() || null;
    } catch (e: any) {
      console.log('Groq failed:', e?.message || e);
    }

    // Fallback to OpenAI
    if (!response) {
      try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey === 'sk-dummy') throw new Error('No OpenAI key');
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages as any,
          max_tokens: 800,
          temperature: 0.7,
        });
        response = completion.choices[0]?.message?.content?.trim() || null;
      } catch (e: any) {
        console.log('OpenAI fallback failed:', e?.message || e);
      }
    }

    // Fallback to DeepSeek
    if (!response) {
      try {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) throw new Error('No DeepSeek key');
        const deepseek = new OpenAI({
          apiKey,
          baseURL: 'https://api.deepseek.com',
        });
        const completion = await deepseek.chat.completions.create({
          model: 'deepseek-chat',
          messages: messages as any,
          max_tokens: 800,
          temperature: 0.7,
        });
        response = completion.choices[0]?.message?.content?.trim() || null;
      } catch (e: any) {
        console.log('DeepSeek fallback failed:', e?.message || e);
        response = 'I apologize — the AI service is temporarily unavailable. Please try again in a moment.';
      }
    }

    return NextResponse.json({
      success: true,
      answer: response,
    });

  } catch (err: any) {
    console.error('BaZi chat error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to get AI response',
      answer: 'Sorry, something went wrong. Please try again.',
    }, { status: 200 }); // Return 200 so frontend can show the fallback text
  }
}
