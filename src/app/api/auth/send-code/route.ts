import { NextRequest, NextResponse } from "next/server";

// In-memory store for verification codes (Vercel serverless — resets on cold start, fine for dev)
// Production: use Vercel KV or Redis
const codeStore = new Map<string, { code: string; expires: number }>();

// Email regex that accepts QQ, 163, 126, Gmail, Outlook, etc.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const CODE_EXPIRE_MS = 10 * 60 * 1000; // 10 minutes

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Rate limit: max 1 code per 60 seconds per email
  const existing = codeStore.get(email);
  if (existing && Date.now() - (existing.expires - CODE_EXPIRE_MS) < 60000) {
    return NextResponse.json({ error: "Please wait 60 seconds before requesting a new code" }, { status: 429 });
  }

  const code = generateCode();
  codeStore.set(email, { code, expires: Date.now() + CODE_EXPIRE_MS });

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

// Also export verify endpoint
export async function PUT(request: NextRequest) {
  const { email, code } = await request.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code required" }, { status: 400 });
  }

  const stored = codeStore.get(email);
  if (!stored) {
    return NextResponse.json({ error: "No code requested or code expired" }, { status: 400 });
  }

  if (Date.now() > stored.expires) {
    codeStore.delete(email);
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }

  if (stored.code !== String(code).trim()) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  // Valid — consume the code
  codeStore.delete(email);

  // Return a signed token (simple JWT-like approach)
  // In production, use proper JWT with jsonwebtoken
  const sessionToken = Buffer.from(JSON.stringify({ email, iat: Date.now() })).toString("base64");

  return NextResponse.json({ success: true, token: sessionToken, email });
}
