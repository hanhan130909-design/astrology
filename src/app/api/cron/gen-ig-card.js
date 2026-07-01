const sharp = require("sharp");
const path = require("path");

const W = 1080, H = 1080; // IG square feed

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1a2e"/>
      <stop offset="1" stop-color="#0d0d1a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0" stop-color="#7B68EE" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#7B68EE" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <circle cx="${W/2}" cy="300" r="180" fill="none" stroke="#7B68EE" stroke-width="1.5" opacity="0.5"/>
  <circle cx="${W/2}" cy="300" r="150" fill="none" stroke="#7B68EE" stroke-width="1" opacity="0.3"/>
  <circle cx="${W/2}" cy="300" r="120" fill="none" stroke="#7B68EE" stroke-width="1" opacity="0.2"/>
  <text x="${W/2}" y="260" font-family="sans-serif" font-size="72" fill="#FFD700" text-anchor="middle">✨</text>
  <text x="${W/2}" y="340" font-family="PingFang SC, sans-serif" font-size="28" fill="white" text-anchor="middle" opacity="0.9">Free Astrology &amp; BaZi</text>
  <text x="${W/2}" y="500" font-family="PingFang SC, sans-serif" font-size="48" font-weight="800" fill="#FFD700" text-anchor="middle">🌟 星缘</text>
  <text x="${W/2}" y="560" font-family="PingFang SC, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.7">Western + Chinese · 8 Languages</text>
  <text x="${W/2}" y="620" font-family="PingFang SC, sans-serif" font-size="22" fill="#7B68EE" text-anchor="middle" opacity="0.9">🔮 Free Reading · Link in Bio</text>
  <text x="${W/2}" y="960" font-family="PingFang SC, sans-serif" font-size="28" fill="white" text-anchor="middle" opacity="0.5">lunaxstar.com</text>
</svg>`;

sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(
  path.join(__dirname, "..", "..", "..", "..", "..", "..", "public", "ig-card.png")
).then(() => console.log("IG card generated")).catch(console.error);
