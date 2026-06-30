import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const W = 800, H = 1000;

function buildBaziCard(data: {
  dayMaster: string;    // e.g. "甲"
  dayMasterEn: string;  // e.g. "Yang Wood"
  element: string;      // e.g. "木"
  elementEn: string;    // e.g. "Wood"
}): string {
  const { dayMaster, dayMasterEn, element, elementEn } = data;
  const cx = W / 2;
  // Element color map
  const eColors: Record<string, { bg: string; accent: string }> = {
    木: { bg: "#1a3a1a", accent: "#4CAF50" },
    火: { bg: "#3a1a1a", accent: "#FF5722" },
    土: { bg: "#2a2a1a", accent: "#FFC107" },
    金: { bg: "#1a1a2a", accent: "#FFD700" },
    水: { bg: "#1a1a3a", accent: "#2196F3" },
  };
  const c = eColors[element] || { bg: "#1a1a1a", accent: "#F5C542" };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0" stop-color="${c.bg}" stop-opacity="1"/>
      <stop offset="1" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="40%">
      <stop offset="0" stop-color="${c.accent}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="30" y="30" width="${W-60}" height="${H-60}" rx="28" fill="none" stroke="${c.accent}" stroke-width="2" opacity="0.5"/>
  <rect x="46" y="46" width="${W-92}" height="${H-92}" rx="18" fill="none" stroke="${c.accent}" stroke-width="1" opacity="0.25"/>
  <text x="${cx}" y="160" font-family="PingFang SC, sans-serif" font-size="28" fill="white" text-anchor="middle" letter-spacing="8" opacity="0.85">✨ My BaZi Day Master ✨</text>
  <text x="${cx}" y="420" font-family="PingFang SC, serif" font-size="220" font-weight="900" fill="${c.accent}" text-anchor="middle">${dayMaster}</text>
  <text x="${cx}" y="520" font-family="PingFang SC, sans-serif" font-size="32" fill="white" text-anchor="middle" opacity="0.9">${elementEn}</text>
  <text x="${cx}" y="570" font-family="PingFang SC, sans-serif" font-size="26" fill="${c.accent}" text-anchor="middle" opacity="0.7">${dayMasterEn}</text>
  <line x1="${cx-100}" y1="620" x2="${cx+100}" y2="620" stroke="${c.accent}" stroke-width="1" opacity="0.4"/>
  <text x="${cx}" y="700" font-family="PingFang SC, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.8">What's yours?</text>
  <text x="${cx}" y="750" font-family="PingFang SC, sans-serif" font-size="28" font-weight="700" fill="${c.accent}" text-anchor="middle">lunaxstar.com</text>
  <text x="${cx}" y="790" font-family="PingFang SC, sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.5">Free BaZi Calculator · 8 Languages</text>
  <text x="${cx}" y="${H-50}" font-family="PingFang SC, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.3">星缘 · Starry Fate</text>
  </svg>`;
}

function buildNatalCard(data: {
  sun: string;      // e.g. "Leo"
  sunEmoji: string; // e.g. "♌"
  moon: string;     // e.g. "Cancer"
  moonEmoji: string;
  rising: string;   // e.g. "Virgo"
  risingEmoji: string;
}): string {
  const { sun, sunEmoji, moon, moonEmoji, rising, risingEmoji } = data;
  const cx = W / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="30%" r="70%">
      <stop offset="0" stop-color="#1a1a3a"/>
      <stop offset="1" stop-color="#0a0a0a"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="28%" r="45%">
      <stop offset="0" stop-color="#7B68EE" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#7B68EE" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="30" y="30" width="${W-60}" height="${H-60}" rx="28" fill="none" stroke="#7B68EE" stroke-width="2" opacity="0.5"/>
  <rect x="46" y="46" width="${W-92}" height="${H-92}" rx="18" fill="none" stroke="#7B68EE" stroke-width="1" opacity="0.25"/>
  <text x="${cx}" y="130" font-family="PingFang SC, sans-serif" font-size="28" fill="white" text-anchor="middle" letter-spacing="8" opacity="0.85">🌟 My Big Three 🌟</text>
  <text x="${cx}" y="320" font-family="PingFang SC, sans-serif" font-size="64" fill="#FFD700" text-anchor="middle">${sunEmoji} ${sun}</text>
  <text x="${cx}" y="370" font-family="PingFang SC, sans-serif" font-size="20" fill="white" text-anchor="middle" opacity="0.6">Sun · Core Identity</text>
  <text x="${cx}" y="490" font-family="PingFang SC, sans-serif" font-size="56" fill="#C0C0FF" text-anchor="middle">${moonEmoji} ${moon}</text>
  <text x="${cx}" y="540" font-family="PingFang SC, sans-serif" font-size="20" fill="white" text-anchor="middle" opacity="0.6">Moon · Inner Emotions</text>
  <text x="${cx}" y="660" font-family="PingFang SC, sans-serif" font-size="52" fill="#9370DB" text-anchor="middle">${risingEmoji} ${rising}</text>
  <text x="${cx}" y="710" font-family="PingFang SC, sans-serif" font-size="20" fill="white" text-anchor="middle" opacity="0.6">Rising · First Impressions</text>
  <line x1="${cx-100}" y1="770" x2="${cx+100}" y2="770" stroke="#7B68EE" stroke-width="1" opacity="0.4"/>
  <text x="${cx}" y="840" font-family="PingFang SC, sans-serif" font-size="22" fill="white" text-anchor="middle" opacity="0.8">What's your Big Three?</text>
  <text x="${cx}" y="890" font-family="PingFang SC, sans-serif" font-size="30" font-weight="700" fill="#7B68EE" text-anchor="middle">lunaxstar.com</text>
  <text x="${cx}" y="930" font-family="PingFang SC, sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.5">Free Natal Chart · 8 Languages</text>
  <text x="${cx}" y="${H-50}" font-family="PingFang SC, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.3">星缘 · Starry Fate</text>
  </svg>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const type = body.type || "bazi";

    let svg: string;
    if (type === "natal") {
      svg = buildNatalCard(body);
    } else {
      svg = buildBaziCard(body);
    }

    const png = await sharp(Buffer.from(svg)).png({ quality: 92 }).toBuffer();

    return new NextResponse(png, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Share card error:", error);
    return NextResponse.json({ error: "Failed to generate card" }, { status: 500 });
  }
}
