import { NextRequest, NextResponse } from 'next/server';

// Language code mapping for Google Translate
const LANG_MAP: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en',
  id: 'id',
  th: 'th',
  vi: 'vi',
  ms: 'ms',
  ja: 'ja',
  ko: 'ko',
};

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
    }

    const tl = LANG_MAP[targetLang] || targetLang;

    // Use Google Translate unofficial API (quicker than official, free)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();

    // Parse Google's nested response format: [[["translated text", "original", ...]], ...]
    const translated = data[0]
      ?.map((segment: any[]) => segment[0])
      ?.join('') || text;

    return NextResponse.json({
      translated,
      targetLang: tl,
    });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
