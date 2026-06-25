import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Resend Audience that holds newsletter subscribers (created via API).
const AUDIENCE_ID =
  process.env.RESEND_AUDIENCE_ID || "62187bb3-e105-4861-b26d-2e5b2eb61c5c";

function welcomeHtml(): string {
  return `
  <div style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#171717;">
    <div style="font-size:32px;text-align:center;margin-bottom:8px;">✨</div>
    <h1 style="font-size:22px;font-weight:700;text-align:center;margin:0 0 4px;">欢迎订阅星缘周运势</h1>
    <p style="font-size:14px;color:#6b7280;text-align:center;margin:0 0 24px;">Welcome to Starry Fate Weekly Horoscope</p>
    <p style="font-size:15px;line-height:1.7;">你好 👋</p>
    <p style="font-size:15px;line-height:1.7;">感谢订阅！每周一，我们会把 <strong>12 星座运势</strong> 和 <strong>占星/八字知识</strong> 送到你的邮箱。</p>
    <p style="font-size:15px;line-height:1.7;color:#6b7280;">Every Monday you'll get 12-zodiac horoscopes and astrology insights, in your language.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="https://lunaxstar.com/natal" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;">免费生成你的星盘 →</a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:32px;">星缘 · lunaxstar.com<br/>You're receiving this because you subscribed at lunaxstar.com.</p>
  </div>`;
}

// POST /api/subscribe — add subscriber to Resend audience + send welcome email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "invalid_email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "not_configured" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // Add contact to audience (Resend dedupes by email per audience).
    let already = false;
    const { error: contactErr } = await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    });

    if (contactErr) {
      const msg = (contactErr.message || "").toLowerCase();
      if (msg.includes("already") || msg.includes("exist")) {
        already = true;
      } else {
        console.error("Resend contact error:", contactErr);
        // Non-duplicate error — still try welcome email, but report soft failure path
      }
    }

    // Send welcome email only for genuinely new subscribers.
    if (!already) {
      const { error: mailErr } = await resend.emails.send({
        from: "星缘周运势 <newsletter@lunaxstar.com>",
        to: [email],
        subject: "🎉 欢迎订阅星缘周运势 / Welcome to Starry Fate",
        html: welcomeHtml(),
      });
      if (mailErr) console.error("Welcome email error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: already ? "already" : "subscribed",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ success: false, message: "error" }, { status: 500 });
  }
}
