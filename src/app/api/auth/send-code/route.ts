import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

// Email regex that accepts QQ, 163, 126, Gmail, Outlook, etc.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000; // 10 分钟一个验证码窗口

// 服务端 HMAC 密钥：用于确定性生成验证码，无需跨实例存储。
// Vercel serverless 无状态，内存 Map 会在冷启动/多实例时丢失，
// 导致「发码」和「验码」落到不同实例时验证失败。HMAC 方案彻底规避。
function getSecret(): string {
  return process.env.CRON_SECRET || process.env.RESEND_API_KEY || "lunaxstar-dev-secret";
}

// 每个邮箱在同一个 10 分钟窗口内验证码固定，可无状态校验
function codeFor(email: string, windowStart: number): string {
  const hmac = createHmac("sha256", getSecret())
    .update(`${email}:${windowStart}`)
    .digest("hex");
  const num = parseInt(hmac.slice(0, 8), 16) % 1000000;
  return String(num).padStart(6, "0");
}

function currentCode(email: string): string {
  return codeFor(email, Math.floor(Date.now() / WINDOW_MS));
}

// Best-effort 内存限流：仅在同一热实例内生效，防重复刷码。
const lastSent = new Map<string, number>();

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Rate limit: best-effort 60s（跨实例不保证，但不会造成错误拒绝）
  const prev = lastSent.get(email);
  if (prev && Date.now() - prev < 60000) {
    return NextResponse.json({ error: "Please wait 60 seconds before requesting a new code" }, { status: 429 });
  }

  const code = currentCode(email);
  lastSent.set(email, Date.now());

  // Send via Resend
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "星缘 <noreply@lunaxstar.com>",
        to: [email],
        subject: "星缘验证码 / LunaX Verification Code",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #171717;">星缘 / LunaX</h2>
            <p>你的验证码是：</p>
            <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #171717;">${code}</span>
            </div>
            <p style="color: #666; font-size: 14px;">10 分钟内有效 / Valid for 10 minutes</p>
            <p style="color: #999; font-size: 12px;">如非本人操作请忽略 / Ignore if this wasn't you</p>
          </div>
        `,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("Resend error:", data);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Code sent" });
  } catch (e) {
    console.error("Send code error:", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

// Verify endpoint — 无状态校验，接受当前窗口和上一个窗口（处理边界）
export async function PUT(request: NextRequest) {
  const { email, code } = await request.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code required" }, { status: 400 });
  }

  const now = Date.now();
  const currentWindow = Math.floor(now / WINDOW_MS);
  const input = String(code).trim();

  const valid =
    input === codeFor(email, currentWindow) ||
    input === codeFor(email, currentWindow - 1);

  if (!valid) {
    return NextResponse.json({ error: "Invalid code or code expired" }, { status: 400 });
  }

  // Return a session token (simple JWT-like approach)
  const sessionToken = Buffer.from(JSON.stringify({ email, iat: now })).toString("base64");

  return NextResponse.json({ success: true, token: sessionToken, email });
}
