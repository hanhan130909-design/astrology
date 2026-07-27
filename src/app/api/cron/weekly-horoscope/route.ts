import { NextResponse } from "next/server";
import { generateWeeklyHoroscope } from "@/lib/horoscope-generator";

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "62187bb3-e105-4861-b26d-2e5b2eb61c5c";
const RESEND_API = "https://api.resend.com";
const FROM = "星缘周运势 <newsletter@lunaxstar.com>";

function horoscopeHtml(horoscope: ReturnType<typeof generateWeeklyHoroscope>): string {
  const rows = horoscope.signs.map((s) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-family:-apple-system,sans-serif;font-size:14px">
      <strong style="color:#171717">${s.emoji} ${s.en} · ${s.zh}</strong><br/>
      <span style="color:#444">${s.forecast}</span><br/>
      <span style="color:#888;font-size:12px">${s.forecastZh}</span>
    </td></tr>`
  ).join("");
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;background:#fff;border-radius:16px;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#171717">
    <h1 style="font-size:24px;text-align:center;margin:0 0 4px">🔮 本周运势 · Weekly Horoscope</h1>
    <p style="text-align:center;color:#888;font-size:13px;margin:0 0 28px">${horoscope.dateRange}</p>
    <table style="width:100%;border-collapse:collapse">${rows}</table>
    <div style="margin-top:28px;padding:20px;background:#f9f9f9;border-radius:12px;font-size:13px;line-height:1.7">
      <strong>📚 Astrology Knowledge · 占星知识</strong><br/>
      ${horoscope.knowledge.en}<br/><span style="color:#999;font-size:12px">${horoscope.knowledge.zh}</span>
    </div>
    <div style="text-align:center;margin-top:28px">
      <a href="https://lunaxstar.com/natal" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600">免费生成你的星盘 →</a>
    </div>
    <p style="text-align:center;color:#bbb;font-size:11px;margin-top:32px">星缘 · lunaxstar.com<br/><a href="%unsubscribe_url%" style="color:#bbb">取消订阅</a></p>
  </div></body></html>`;
}

const NURTURE_DAY_MASTER_HTML = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5">
<div style="max-width:520px;margin:0 auto;padding:32px 20px;background:#fff;border-radius:16px;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#171717">
  <h2 style="font-size:20px;text-align:center;margin:0 0 8px">✨ 你的日主是什么？</h2>
  <p style="font-size:14px;line-height:1.7">在八字命理中，<strong>日主（Day Master）</strong>是你命盘的核心——比星座更精准地描述你的性格。一共有10种：甲木、乙木、丙火、丁火、戊土、己土、庚金、辛金、壬水、癸水。每一种都是一个完整的人格原型。</p>
  <p style="font-size:14px;line-height:1.7">你的出生日期+时间=你的日主。花30秒查一下——你可能一直在用错的星座介绍自己。</p>
  <div style="text-align:center;margin:28px 0">
    <a href="https://lunaxstar.com/bazi" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:14px 30px;border-radius:10px;font-size:15px;font-weight:600">免费查我的日主 →</a>
  </div>
  <p style="font-size:12px;color:#999;text-align:center">星缘 · lunaxstar.com<br/><a href="%unsubscribe_url%" style="color:#999">取消订阅</a></p>
</div></body></html>`;

const NURTURE_AI_READING_HTML = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5">
<div style="max-width:520px;margin:0 auto;padding:32px 20px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#fff">
  <h2 style="font-size:20px;text-align:center;margin:0 0 8px">🔮 解锁你的完整命盘</h2>
  <p style="font-size:14px;line-height:1.7;color:#ccc">你已经在星缘拿到了免费的日主和星盘。现在想要一份<strong style="color:#FFD700">AI 深度解读</strong>吗？</p>
  <p style="font-size:14px;line-height:1.7;color:#ccc">AI 会分析你的日主、十神、大运、五行平衡——写一份专属于你的命运报告。比找师傅便宜 <strong style="color:#FFD700">10 倍</strong>。</p>
  <div style="margin:20px 0;padding:16px;background:rgba(255,255,255,0.08);border-radius:10px;text-align:center">
    <span style="font-size:28px;font-weight:900;color:#FFD700">$3.99</span>
    <span style="font-size:14px;color:#ccc;margin-left:8px">一次性 · 永久访问</span>
  </div>
  <div style="text-align:center;margin:24px 0">
    <a href="https://lunaxstar.com/pricing" style="display:inline-block;background:#FFD700;color:#171717;text-decoration:none;padding:14px 30px;border-radius:10px;font-size:15px;font-weight:700">🔮 获取 AI 深度解读</a>
  </div>
  <p style="font-size:11px;color:#888;text-align:center;margin-top:28px">星缘 · lunaxstar.com<br/><a href="%unsubscribe_url%" style="color:#666">取消订阅</a></p>
</div></body></html>`;

async function fetchSubscribers(apiKey: string): Promise<{ email: string; createdAt: string }[]> {
  const all: { email: string; createdAt: string }[] = [];
  let url = `${RESEND_API}/audiences/${AUDIENCE_ID}/contacts?limit=100`;
  do {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!resp.ok) throw new Error(`Resend contacts failed: ${resp.status}`);
    const json = await resp.json();
    const contacts = json.data || [];
    for (const c of contacts) {
      if (!c.unsubscribed) all.push({ email: c.email, createdAt: c.created_at || "" });
    }
    url = json.next || "";
  } while (url);
  return all;
}

async function sendEmail(apiKey: string, to: string, subject: string, html: string): Promise<boolean> {
  const resp = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  return resp.ok;
}

// POST /api/cron/weekly-horoscope — triggered by Vercel Cron every Monday
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "weekly-horoscope-2026";

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  try {
    const subscribers = await fetchSubscribers(apiKey);
    if (subscribers.length === 0) {
      return NextResponse.json({ sent: 0, message: "no subscribers" });
    }

    // Generate and send weekly horoscope
    const horoscope = generateWeeklyHoroscope();
    const html = horoscopeHtml(horoscope);
    let sent = 0, failed = 0;
    for (const sub of subscribers) {
      if (await sendEmail(apiKey, sub.email, `🔮 Weekly Horoscope · 本周运势 ${horoscope.dateRange}`, html)) sent++; else failed++;
      await new Promise((r) => setTimeout(r, 200));
    }

    // Nurture: check subscriber tenure and send stage-appropriate emails
    const now = Date.now();
    const DAY_MS = 86400000;
    let nurtureSent = 0;
    for (const sub of subscribers) {
      if (!sub.createdAt) continue;
      const joined = new Date(sub.createdAt).getTime();
      const days = Math.floor((now - joined) / DAY_MS);

      if (days >= 6 && days <= 8) {
        // ~7 days: Day Master discovery
        if (await sendEmail(apiKey, sub.email, "✨ 你的日主是什么？— Discover Your Day Master", NURTURE_DAY_MASTER_HTML)) nurtureSent++;
      } else if (days >= 13 && days <= 15) {
        // ~14 days: AI Reading upsell
        if (await sendEmail(apiKey, sub.email, "🔮 解锁你的完整命盘 · $3.99 AI 深度解读", NURTURE_AI_READING_HTML)) nurtureSent++;
      }
      await new Promise((r) => setTimeout(r, 150));
    }

    return NextResponse.json({ sent, failed, nurtureSent, total: subscribers.length });
  } catch (error) {
    console.error("Weekly horoscope cron error:", error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
