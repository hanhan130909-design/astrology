/**
 * 7-Day Email Sequence Templates — Soulmate Funnel
 * Personalized with user's birth chart data
 */

export interface SubscriberData {
  email: string;
  name?: string;
  moonSign?: string;
  risingSign?: string;
  sunSign?: string;
  venusSign?: string;
  marsSign?: string;
  jupiterSign?: string;
  saturnSign?: string;
  subscribedAt: number; // timestamp
  sequenceStep: number; // 0-7, which email was last sent
  source?: string; // natal / bazi
}

const GUMROAD_URL = "https://hanhan55.gumroad.com/l/zxccdv";

function getSignTrait(sign?: string): string {
  const traits: Record<string, string> = {
    Aries: "impulsive and passionate",
    Taurus: "loyal but stubborn",
    Gemini: "curious but easily bored",
    Cancer: "deeply emotional and nurturing",
    Leo: "confident and attention-seeking",
    Virgo: "analytical and self-critical",
    Libra: "harmonious but indecisive",
    Scorpio: "intense and fiercely loyal",
    Sagittarius: "adventurous and commitment-phobic",
    Capricorn: "ambitious and guarded",
    Aquarius: "independent and emotionally distant",
    Pisces: "dreamy and easily overwhelmed",
  };
  return sign ? traits[sign] || "unique and complex" : "unique and complex";
}

function getCompatibleSign(sign?: string): string {
  const compat: Record<string, string> = {
    Aries: "Leo or Sagittarius",
    Taurus: "Virgo or Capricorn",
    Gemini: "Libra or Aquarius",
    Cancer: "Scorpio or Pisces",
    Leo: "Aries or Sagittarius",
    Virgo: "Taurus or Capricorn",
    Libra: "Gemini or Aquarius",
    Scorpio: "Cancer or Pisces",
    Sagittarius: "Aries or Leo",
    Capricorn: "Taurus or Virgo",
    Aquarius: "Gemini or Libra",
    Pisces: "Cancer or Scorpio",
  };
  return sign ? compat[sign] || "someone unexpected" : "someone unexpected";
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 20px;">
  <div style="text-align:center;margin-bottom:24px;">
    <span style="font-size:28px;">🌙</span>
    <span style="color:#d4af37;font-size:18px;font-weight:700;letter-spacing:2px;">LUNAXSTAR</span>
  </div>
  <div style="background:#14141f;border-radius:16px;padding:28px 24px;border:1px solid #2a2a3a;">
    ${content}
  </div>
  <div style="text-align:center;margin-top:24px;padding:0 16px;">
    <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:0;">
      LunaXStar · lunaxstar.com<br/>
      You're receiving this because you requested your birth chart reading.<br/>
      <a href="{{unsubscribe_url}}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
    </p>
  </div>
</div>
</body></html>`;
}

function ctaButton(text: string, url: string): string {
  return `<div style="text-align:center;margin:28px 0;">
    <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#d4af37,#f5d76e);color:#0a0a0f;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;">${text}</a>
  </div>`;
}

// ─── Email 1: Day 0 (Immediate) ───
export function email1(data: SubscriberData): { subject: string; html: string } {
  const moon = data.moonSign || "your";
  const rising = data.risingSign || "your";
  const venus = data.venusSign || "your";
  const name = data.name || "there";

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your complete birth chart is ready. I pulled your rising sign, moon sign, and planetary positions — and there's something I need to tell you.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your <strong style="color:#d4af37;">${moon} moon</strong> means you love deeply, but you push people away when you feel vulnerable. Your <strong style="color:#d4af37;">${rising} rising</strong> makes you seem confident on the outside, but inside you're terrified of being abandoned.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">And your <strong style="color:#d4af37;">${venus} venus</strong>? That's why you keep attracting the same type of person — and why it never works out.</p>
    <div style="background:#1e1e2e;border-left:3px solid #d4af37;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
      <p style="color:#d4af37;font-size:17px;font-weight:700;margin:0 0 8px;">Your soulmate isn't who you think.</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">There's a specific aspect in your chart that points to someone completely different from your usual type.</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I'll tell you who in the next email. For now, save this email. Tomorrow morning, I'm sending you the exact date range when you'll meet them.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar Team</p>
    <p style="color:#6b7280;font-size:13px;margin:12px 0 0;">P.S. If you can't wait, the full soulmate reading is here:</p>
    ${ctaButton("Get Your Full Soulmate Reading — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "Your birth chart is ready 🔮",
    html: emailWrapper(content),
  };
}

// ─── Email 2: Day 1 ───
export function email2(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const saturn = data.saturnSign || "your";
  const jupiter = data.jupiterSign || "your";

  // Calculate a plausible date range (3-6 months from now)
  const now = new Date();
  const start = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + 150 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Yesterday I told you your soulmate isn't who you think. Today I'm giving you the timeline.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Based on your <strong style="color:#d4af37;">${saturn} Saturn</strong> position and <strong style="color:#d4af37;">${jupiter} Jupiter</strong> transit, your next major love window opens between:</p>
    <div style="text-align:center;background:#1e1e2e;padding:24px;border-radius:12px;margin:24px 0;">
      <p style="color:#d4af37;font-size:22px;font-weight:700;margin:0;">📅 ${fmt(start)}</p>
      <p style="color:#6b7280;font-size:16px;margin:8px 0;">— through —</p>
      <p style="color:#d4af37;font-size:22px;font-weight:700;margin:0;">${fmt(end)}</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">That's when you'll meet someone who matches your chart. Not a fling. Not a situationship. Someone who actually stays.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">But here's the catch — your chart shows a pattern that makes you self-sabotage right before things get real. You'll meet them, then push them away because you're scared.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I've seen this in 100+ charts. The women who prepare for this window don't miss it. The ones who don't? They meet the right person at the wrong time — and spend years wondering "what if."</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">Tomorrow I'll tell you exactly what you need to do before this window opens.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:12px 0 0;">— LunaXStar Team</p>
    <p style="color:#6b7280;font-size:13px;margin:12px 0 0;">P.S. Want the full preparation guide? It's in your personalized report:</p>
    ${ctaButton("Unlock Your Complete Reading — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "Your soulmate window opens soon ⏳",
    html: emailWrapper(content),
  };
}

// ─── Email 3: Day 2 ───
export function email3(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const moon = data.moonSign || "your";
  const venus = data.venusSign || "your";
  const mars = data.marsSign || "your";

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I've read your chart carefully. There are 3 patterns that keep showing up in your relationships:</p>
    <div style="margin:20px 0;">
      <div style="background:#1e1e2e;padding:16px 20px;border-radius:10px;margin-bottom:12px;">
        <p style="color:#d4af37;font-size:15px;font-weight:700;margin:0 0 6px;">1. Your ${moon} moon makes you overgive.</p>
        <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">You give everything to someone before they've earned it. Then you feel resentful when they don't match your energy.</p>
      </div>
      <div style="background:#1e1e2e;padding:16px 20px;border-radius:10px;margin-bottom:12px;">
        <p style="color:#d4af37;font-size:15px;font-weight:700;margin:0 0 6px;">2. Your ${venus} venus attracts emotionally unavailable people.</p>
        <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">You're drawn to the "mysterious" type — but mystery is just another word for "won't commit." This is exactly why they ghosted.</p>
      </div>
      <div style="background:#1e1e2e;padding:16px 20px;border-radius:10px;">
        <p style="color:#d4af37;font-size:15px;font-weight:700;margin:0 0 6px;">3. Your ${mars} mars makes you act first, think later.</p>
        <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">You send the text. You make the first move. Then you feel stupid when they don't respond the way you want.</p>
      </div>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">None of this is your fault. It's in your chart. But knowing the pattern is the first step to breaking it.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">The good news? Your chart also shows that once you break these patterns, love comes easily.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">Tomorrow: how to break pattern #2 (the one that's costing you the most).</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:12px 0 0;">— LunaXStar Team</p>
  `;

  return {
    subject: "The 3 mistakes your chart says you'll make in love",
    html: emailWrapper(content),
  };
}

// ─── Email 4: Day 3 ───
export function email4(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const venus = data.venusSign || "your";
  const compatible = getCompatibleSign(data.sunSign);
  const toxic = getCompatibleSign(data.venusSign);

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Yesterday I told you about the 3 patterns. Today we're fixing the most damaging one: attracting emotionally unavailable people.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your <strong style="color:#d4af37;">${venus} venus</strong> is drawn to intensity. You confuse "chemistry" with "compatibility." The person who gives you butterflies? That's your nervous system recognizing someone who'll hurt you — not your soulmate.</p>
    <div style="background:#1e1e2e;border-left:3px solid #d4af37;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
      <p style="color:#d4af37;font-size:16px;font-weight:700;margin:0 0 8px;">Your actual most compatible sign is ${compatible}.</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">I know, I know — you've probably never dated one. They seem "boring" compared to your usual type. But boring is just another word for "consistent." And consistency is what you actually want.</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Here's what I want you to do this week:</p>
    <ul style="color:#e5e5e5;font-size:15px;line-height:2;padding-left:20px;">
      <li>✨ Notice when you feel that "butterfly" pull. Pause. Ask yourself: is this chemistry, or is this anxiety?</li>
      <li>✨ If you're talking to someone right now, check their sun sign. Be extra careful if it's your usual type.</li>
      <li>✨ Open up to someone who feels "safe" even if it's not exciting.</li>
    </ul>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your soulmate window is approaching. Being ready means not wasting it on the wrong person.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar Team</p>
    <p style="color:#6b7280;font-size:13px;margin:12px 0 0;">P.S. Your full compatibility report shows every sign ranked for you:</p>
    ${ctaButton("Get Your Full Compatibility Report — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "Why you keep attracting the wrong person (it's in your chart)",
    html: emailWrapper(content),
  };
}

// ─── Email 5: Day 5 ───
export function email5(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const jupiter = data.jupiterSign || "your";
  const saturn = data.saturnSign || "your";

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I've been focusing on love, but your chart has something else I need to mention.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your <strong style="color:#d4af37;">${jupiter} Jupiter</strong> is moving into your money house in the next 3 months. This is a once-in-12-years transit. It means:</p>
    <div style="margin:20px 0;">
      <p style="color:#d4af37;font-size:16px;margin:0 0 10px;">💵 A financial opportunity you didn't see coming</p>
      <p style="color:#d4af37;font-size:16px;margin:0 0 10px;">💵 A raise or new income source</p>
      <p style="color:#d4af37;font-size:16px;margin:0;">💵 The end of a period where you felt "stuck" with money</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">But — and this is important — your <strong style="color:#d4af37;">${saturn} Saturn</strong> shows that this money comes with a test. You'll be tempted to spend it on the wrong thing (or the wrong person).</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">The women who handle this transit well don't just get a windfall — they change their entire financial situation for the next 12 years.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I'm telling you this because your love life and money life are connected in your chart. When one shifts, the other does too. Your soulmate window and your money window overlap. That's not a coincidence.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">Tomorrow: the one thing you must do before both windows open.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:12px 0 0;">— LunaXStar Team</p>
  `;

  return {
    subject: "Your chart shows a money shift coming 💰",
    html: emailWrapper(content),
  };
}

// ─── Email 6: Day 6 ───
export function email6(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const moon = data.moonSign || "your";

  // Next new moon date (approximate)
  const now = new Date();
  const newMoon = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const fmt = newMoon.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">We've covered a lot this week. Your soulmate window. Your patterns. Your money shift.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Now there's one final thing.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your chart shows a powerful new moon intention-setting happening on <strong style="color:#d4af37;">${fmt}</strong>. This is the most powerful day of your entire year to set intentions for love.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Here's what to do:</p>
    <div style="background:#1e1e2e;padding:20px;border-radius:12px;margin:20px 0;">
      <p style="color:#d4af37;font-size:15px;margin:0 0 12px;">🌙 On the night of ${fmt}:</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.8;margin:0 0 10px;">1. Write down what you want in a partner — not physical traits, but how you want to feel. Safe. Seen. Chosen.</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.8;margin:0 0 10px;">2. Put it under your pillow (or your mattress if that feels weird).</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.8;margin:0;">3. The next morning, delete it. Don't reread it. The universe heard you.</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">This sounds simple, but your <strong style="color:#d4af37;">${moon} moon</strong> means you're especially receptive to this kind of intention-setting. The women who do this during their window? They meet someone within 30 days.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I'm not saying it's magic. I'm saying your chart shows you're ready — and the universe responds to readiness.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">Tomorrow is the last email. I'll tell you what happens if you miss this window (and it's not what you think).</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:12px 0 0;">— LunaXStar Team</p>
  `;

  return {
    subject: "Last step before your soulmate window opens",
    html: emailWrapper(content),
  };
}

// ─── Email 7: Day 7 (Final — Conversion Push) ───
export function email7(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">This is my last email to you.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I've spent 7 days telling you about your soulmate window, your patterns, your money shift. I've given you the timeline, the mistakes to avoid, and the ritual to prepare.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">But here's what I haven't told you:</p>
    <div style="background:#1e1e2e;border-left:3px solid #d4af37;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
      <p style="color:#d4af37;font-size:17px;font-weight:700;margin:0 0 8px;">Your full chart interpretation is 23 pages.</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">I've only shown you about 5%.</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 12px;">The rest includes:</p>
    <ul style="color:#b0b0b0;font-size:14px;line-height:2;padding-left:20px;margin:0 0 20px;">
      <li>Your exact soulmate description (personality, not just sign)</li>
      <li>The 3 dates in your window when you're most likely to meet them</li>
      <li>Your past-life connection pattern (why you keep meeting the same soul)</li>
      <li>Your money window exact dates and what to invest in</li>
      <li>The one thing your chart says you must do this year or you'll regret it</li>
    </ul>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I'm deleting your chart from our servers in 24 hours. We do this for privacy — but it also means if you want the full reading, now is the only time.</p>
    <div style="text-align:center;background:#1e1e2e;padding:24px;border-radius:12px;margin:24px 0;">
      <p style="color:#6b7280;font-size:14px;text-decoration:line-through;margin:0 0 8px;">Normally $49</p>
      <p style="color:#d4af37;font-size:32px;font-weight:700;margin:0 0 8px;">$19.99</p>
      <p style="color:#9ca3af;font-size:13px;margin:0;">60% off — expires in 24 hours</p>
    </div>
    ${ctaButton("Get Your Full 23-Page Reading — $19.99", GUMROAD_URL)}
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:20px 0 0;">Whatever you decide, I hope this week gave you something. You deserve love that stays. You deserve money that flows. You deserve to stop wondering "what if."</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar Team</p>
  `;

  return {
    subject: "Your chart will be deleted in 24 hours ⚠️",
    html: emailWrapper(content),
  };
}

// Get email by step number (0 = welcome/immediate, 1-6 = days 1-6, 7 = final)
export function getEmail(step: number, data: SubscriberData): { subject: string; html: string } {
  const templates = [email1, email2, email3, email4, email5, email6, email7];
  const idx = Math.min(step, templates.length - 1);
  return templates[idx](data);
}

export const TOTAL_EMAILS = 7;
