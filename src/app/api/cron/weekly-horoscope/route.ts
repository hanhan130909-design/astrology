import { NextResponse } from "next/server";
import { generateWeeklyHoroscope } from "@/lib/horoscope-generator";

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "62187bb3-e105-4861-b26d-2e5b2eb61c5c";
const RESEND_API = "https://api.resend.com";
const FROM = "星缘周运势 <newsletter@lunaxstar.com>";

function emailHtml(horoscope: ReturnType<typeof generateWeeklyHoroscope>): string {
  const rows = horoscope.signs
    .map(
      (s) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-family:-apple-system,sans-serif;font-size:14px">
          <strong style="color:#171717">${s.emoji} ${s.en} · ${s.zh}</strong><br/>
          <span style="color:#444">${s.forecast}</span><br/>
          <span style="color:#888;font-size:12px">${s.forecastZh}</span>
        </td></tr>`
    )
    .join("");

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;background:#fff;border-radius:16px;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#171717">
    <h1 style="font-size:24px;text-align:center;margin:0 0 4px">🔮 本周运势 · Weekly Horoscope</h1>
    <p style="text-align:center;color:#888;font-size:13px;margin:0 0 28px">${horoscope.dateRange}</p>
    <table style="width:100%;border-collapse:collapse">${rows}</table>
    <div style="margin-top:28px;padding:20px;background:#f9f9f9;border-radius:12px;font-size:13px;line-height:1.7">
      <strong>📚 Astrology Knowledge · 占星知识</strong><br/>
      ${horoscope.knowledge.en}<br/>
      <span style="color:#999;font-size:12px">${horoscope.knowledge.zh}</span>
    </div>
    <div style="text-align:center;margin-top:28px">
      <a href="https://lunaxstar.com/natal" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600">免费生成你的星盘 →</a>
    </div>
    <p style="text-align:center;color:#bbb;font-size:11px;margin-top:32px">
      星缘 · lunaxstar.com<br/>
      <a href="%unsubscribe_url%" style="color:#bbb">取消订阅</a>
    </p>
  </div></body></html>`;
}

async function fetchSubscribers(apiKey: string): Promise<{ email: string }[]> {
  const all: { email: string }[] = [];
  let url = `${RESEND_API}/audiences/${AUDIENCE_ID}/contacts?limit=100`;
  do {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!resp.ok) throw new Error(`Resend contacts failed: ${resp.status}`);
    const json = await resp.json();
    const contacts = json.data || [];
    for (const c of contacts) {
      if (!c.unsubscribed) all.push({ email: c.email });
    }
    // pagination — Resend may return a cursor or next link; if none, stop.
    url = json.next || "";
  } while (url);
  return all;
}

// POST /api/cron/weekly-horoscope — triggered by Vercel Cron every Monday
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "weekly-horoscope-2026";

  // Vercel Cron sends an Authorization header with the CRON_SECRET environment variable value.
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  try {
    // Fetch subscribers
    const subscribers = await fetchSubscribers(apiKey);
    if (subscribers.length === 0) {
      return NextResponse.json({ sent: 0, message: "no subscribers" });
    }

    // Generate horoscope content
    const horoscope = generateWeeklyHoroscope();
    const html = emailHtml(horoscope);

    // Send to each subscriber
    let sent = 0;
    let failed = 0;
    for (const sub of subscribers) {
      try {
        const resp = await fetch(`${RESEND_API}/emails`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: FROM,
            to: [sub.email],
            subject: `🔮 Weekly Horoscope · 本周运势 ${horoscope.dateRange}`,
            html,
          }),
        });
        if (resp.ok) sent++;
        else {
          failed++;
          console.error("Send fail:", sub.email, await resp.text());
        }
      } catch (e) {
        failed++;
        console.error("Send exception:", sub.email, e);
      }
      // small delay to avoid rate limits (Resend: 100/s but be gentle)
      await new Promise((r) => setTimeout(r, 200));
    }

    return NextResponse.json({ sent, failed, total: subscribers.length });
  } catch (error) {
    console.error("Weekly horoscope cron error:", error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
