/**
 * 7-Day Email Sequence — Anxiety Harvesting Mode
 * Personalized with user's birth chart data
 * Strategy: escalating anxiety → social proof → scarcity → conversion
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
  subscribedAt: number;
  sequenceStep: number;
  source?: string;
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

function warningBox(title: string, body: string): string {
  return `<div style="background:#1e1e2e;border-left:3px solid #d4af37;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
    <p style="color:#d4af37;font-size:16px;font-weight:700;margin:0 0 8px;">${title}</p>
    <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">${body}</p>
  </div>`;
}

// ─── Email 1: Day 0 (Immediate) — Shock & Hook ───
export function email1(data: SubscriberData): { subject: string; html: string } {
  const moon = data.moonSign || "your";
  const rising = data.risingSign || "your";
  const venus = data.venusSign || "your";
  const name = data.name || "there";

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I just finished reading your chart. I need to tell you something before you go to sleep tonight.</p>
    ${warningBox(
      "You've already missed 2 soulmate windows.",
      `Your ${moon} moon and ${rising} rising show two periods in the last 5 years where you met someone who matched your chart. Both times, your ${venus} venus made you push them away.`
    )}
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">You didn't do it on purpose. It's a pattern written in your chart — the same pattern that makes you feel "something's off" right when things start getting real.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">The good news? Your next window opens soon. The bad news? If you don't break this pattern before then, you'll miss this one too.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Tomorrow I'll send you the exact date your window opens. Read it carefully — this is the one that matters.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar</p>
    <p style="color:#6b7280;font-size:13px;margin:12px 0 0;">P.S. If you can't wait until tomorrow, the full breakdown is here:</p>
    ${ctaButton("Get Your Full Soulmate Reading — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "I read your chart. You missed 2 windows already.",
    html: emailWrapper(content),
  };
}

// ─── Email 2: Day 1 — The Timeline & Urgency ───
export function email2(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const saturn = data.saturnSign || "your";
  const jupiter = data.jupiterSign || "your";

  const now = new Date();
  const start = new Date(now.getTime() + 47 * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + 137 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Yesterday I told you about the pattern. Today I'm giving you the date.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Based on your <strong style="color:#d4af37;">${saturn} Saturn</strong> return and <strong style="color:#d4af37;">${jupiter} Jupiter</strong> transit into your 7th house, your next soulmate window opens:</p>
    <div style="text-align:center;background:#1e1e2e;padding:24px;border-radius:12px;margin:24px 0;">
      <p style="color:#d4af37;font-size:22px;font-weight:700;margin:0;">📅 ${fmt(start)}</p>
      <p style="color:#6b7280;font-size:16px;margin:8px 0;">— through —</p>
      <p style="color:#d4af37;font-size:22px;font-weight:700;margin:0;">${fmt(end)}</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">That's <strong style="color:#d4af37;">47 days</strong> from now. After this window closes? You wait <strong>2 years</strong> for the next one.</p>
    ${warningBox(
      "Here's what most women do wrong:",
      "They meet the right person during their window — but their pattern kicks in. They overthink. They pull away. They find something 'wrong' with them. And then the window closes, and they're alone again, wondering why."
    )}
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I've seen this in 100+ charts. The women who prepare don't miss it. The ones who don't? They spend the next 2 years saying "I almost met someone once."</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Tomorrow: the exact pattern in your chart that makes you self-sabotage — and how to break it in 7 days.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar</p>
    <p style="color:#6b7280;font-size:13px;margin:12px 0 0;">P.S. Your full preparation guide is in the complete reading:</p>
    ${ctaButton("Unlock Your Complete Reading — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "Your next soulmate window opens in 47 days. Don't miss this one.",
    html: emailWrapper(content),
  };
}

// ─── Email 3: Day 2 — The Pattern (Fear of Repetition) ───
export function email3(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const moon = data.moonSign || "your";
  const venus = data.venusSign || "your";
  const mars = data.marsSign || "your";

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I want you to think about your last 3 relationships. Notice anything similar?</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your chart shows 3 patterns that keep repeating:</p>
    <div style="margin:20px 0;">
      <div style="background:#1e1e2e;padding:16px 20px;border-radius:10px;margin-bottom:12px;">
        <p style="color:#d4af37;font-size:15px;font-weight:700;margin:0 0 6px;">1. Your ${moon} moon makes you overgive — then resent it.</p>
        <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">You give everything before they've earned it. Then you feel used. But you keep doing it because your moon sign equates "giving" with "being loved."</p>
      </div>
      <div style="background:#1e1e2e;padding:16px 20px;border-radius:10px;margin-bottom:12px;">
        <p style="color:#d4af37;font-size:15px;font-weight:700;margin:0 0 6px;">2. Your ${venus} venus attracts emotionally unavailable people.</p>
        <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">You call it "chemistry." I call it your nervous system recognizing someone who'll hurt you. The butterfly feeling? That's anxiety, not connection.</p>
      </div>
      <div style="background:#1e1e2e;padding:16px 20px;border-radius:10px;">
        <p style="color:#d4af37;font-size:15px;font-weight:700;margin:0 0 6px;">3. Your ${mars} mars makes you chase — then lose interest.</p>
        <p style="color:#b0b0b0;font-size:14px;line-height:1.6;margin:0;">You send the first text. You plan the dates. Then when they finally commit, you feel... nothing. Because the chase was the point. The relationship wasn't.</p>
      </div>
    </div>
    ${warningBox(
      "These patterns don't go away on their own.",
      "They get stronger with every relationship. By your 40s, they're so ingrained that you don't even notice you're doing them. You just call it 'bad luck with men.'"
    )}
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">But here's the thing — your chart also shows the exact moment these patterns started. And once you see it, you can't unsee it. That's when the breaking begins.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Tomorrow: the one thing you can do this week to start breaking pattern #2 (the one that's costing you the most).</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar</p>
    ${ctaButton("Get The Full Pattern Breakdown — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "Your last 3 relationships weren't bad luck. It's this pattern in your chart.",
    html: emailWrapper(content),
  };
}

// ─── Email 4: Day 3 — Social Proof & The Solution ───
export function email4(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const venus = data.venusSign || "your";
  const compatible = getCompatibleSign(data.sunSign);

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I got an email yesterday from Sarah in Austin. She has the same ${venus} venus as you.</p>
    <div style="background:#1e1e2e;padding:20px;border-radius:12px;margin:20px 0;border:1px solid #2a2a3a;">
      <p style="color:#b0b0b0;font-size:14px;line-height:1.7;margin:0;font-style:italic;">"I was 34 and had been single for 5 years. I kept attracting guys who'd disappear after 3 months. Your chart reading showed me my venus pattern — I was chasing emotionally unavailable men because my dad was. I started dating a 'boring' Taurus 2 months later. We just got engaged."</p>
      <p style="color:#d4af37;font-size:13px;margin:12px 0 0;">— Sarah, 34, Austin TX</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Sarah's story isn't unique. I've seen it 47 times this year alone. Women with your venus sign keep attracting the same type — until they see the pattern.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your actual most compatible sign is <strong style="color:#d4af37;">${compatible}</strong>. I know — you've probably never dated one. They seem "too calm" compared to your usual type. But calm is just another word for "won't leave you."</p>
    ${warningBox(
      "Here's your homework for this week:",
      "The next time you feel that intense 'butterfly' pull toward someone, pause for 24 hours. That feeling is your pattern talking, not your intuition. Write down 3 things you actually know about them. If you can't, it's not connection — it's chemistry."
    )}
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your soulmate window is 44 days away. Being ready means not wasting it on another emotionally unavailable person.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar</p>
    <p style="color:#6b7280;font-size:13px;margin:12px 0 0;">P.S. Your full compatibility ranking (all 12 signs, from best to worst) is in the complete reading:</p>
    ${ctaButton("Get Your Full Compatibility Report — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "A woman with your exact venus sign just got engaged. Here's what she did differently.",
    html: emailWrapper(content),
  };
}

// ─── Email 5: Day 4 — Money Anxiety (Expand the Fear) ───
export function email5(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const jupiter = data.jupiterSign || "your";
  const saturn = data.saturnSign || "your";

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I've been talking about love all week. But your chart has something else I need to warn you about.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Your <strong style="color:#d4af37;">${jupiter} Jupiter</strong> enters your 2nd house of money in <strong style="color:#d4af37;">47 days</strong>. Same day as your soulmate window. That's not a coincidence.</p>
    <div style="margin:20px 0;">
      <p style="color:#d4af37;font-size:16px;margin:0 0 10px;">💵 This transit means:</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.8;margin:0 0 8px;">• A financial opportunity you didn't see coming (job offer, raise, or unexpected income)</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.8;margin:0 0 8px;">• The end of a 2-year period where you felt "stuck" financially</p>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.8;margin:0;">• A chance to reset your entire relationship with money</p>
    </div>
    ${warningBox(
      "But your ${saturn} Saturn shows a trap.",
      "You'll be tempted to spend this money on the wrong person. Or the wrong thing. Or you'll self-sabotage because deep down you don't believe you deserve it. 68% of people with your Saturn position blow their first Jupiter transit. Don't be one of them."
    )}
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Here's why I'm telling you this: your love life and money life are connected in your chart. When your soulmate window opens, your money window opens too. The women who handle both? They meet someone AND get a raise in the same 3 months.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">The women who handle neither? They meet the wrong person AND spend their windfall trying to make it work.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">Tomorrow: the one financial decision you must make before both windows open.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:12px 0 0;">— LunaXStar</p>
    ${ctaButton("Get Your Wealth & Love Forecast — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "Your money window opens the same day as your soulmate window. But there's a trap.",
    html: emailWrapper(content),
  };
}

// ─── Email 6: Day 5 — Scarcity (Chart Deletion Warning) ───
export function email6(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";
  const moon = data.moonSign || "your";

  const now = new Date();
  const newMoon = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);
  const fmt = newMoon.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I need to be honest with you.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I've sent you 5 emails this week. I've told you about your pattern, your window, your money trap. I've given you the dates and the warnings.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">But I've only shown you about <strong style="color:#d4af37;">5%</strong> of what's in your chart.</p>
    ${warningBox(
      "Your full reading is 23 pages. I'm deleting it in 48 hours.",
      "We delete all charts after 7 days for privacy. After that, you'd have to re-enter your birth details and start over. But the timing won't be the same — your window analysis is calculated from the day you first requested it."
    )}
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 12px;">What you're missing:</p>
    <ul style="color:#b0b0b0;font-size:14px;line-height:2;padding-left:20px;margin:0 0 20px;">
      <li>Your exact soulmate description (personality, not just sign)</li>
      <li>The 3 specific dates in your window when you're most likely to meet them</li>
      <li>Your past-life connection pattern (why you keep meeting the same soul)</li>
      <li>Your money window exact dates and what to invest in</li>
      <li>The one thing your chart says you must do this year or you'll regret it</li>
      <li>Your complete compatibility ranking (all 12 signs)</li>
    </ul>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Also — mark your calendar for <strong style="color:#d4af37;">${fmt}</strong>. That's the new moon in your sign. It's the most powerful night of your entire year to set intentions. Your <strong style="color:#d4af37;">${moon} moon</strong> makes you especially receptive.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">I'll send you the exact ritual tomorrow morning. But if you want the full preparation guide, it's in your complete reading.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar</p>
    <p style="color:#6b7280;font-size:13px;margin:12px 0 0;">P.S. Tomorrow is your last chance to get 60% off. After that, the price goes back to $49.</p>
    ${ctaButton("Get Your Full 23-Page Reading — $19.99", GUMROAD_URL)}
  `;

  return {
    subject: "I'm deleting your chart in 48 hours. Here's what you'll lose.",
    html: emailWrapper(content),
  };
}

// ─── Email 7: Day 6 — Final Conversion (Last Chance) ───
export function email7(data: SubscriberData): { subject: string; html: string } {
  const name = data.name || "there";

  const content = `
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Hey ${name},</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">This is my last email to you.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">In 12 hours, your chart gets deleted. The 60% discount expires. And this 7-day sequence ends.</p>
    <div style="text-align:center;background:#1e1e2e;padding:24px;border-radius:12px;margin:24px 0;">
      <p style="color:#6b7280;font-size:14px;text-decoration:line-through;margin:0 0 8px;">Normally $49</p>
      <p style="color:#d4af37;font-size:36px;font-weight:700;margin:0 0 8px;">$19.99</p>
      <p style="color:#ef4444;font-size:13px;margin:0;">⏰ Offer expires in 12 hours</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">Let me be straight with you. You've read 6 emails. You know your pattern. You know your window opens in 45 days. You know you're at risk of missing it.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">The question isn't "is this real?" The question is: <strong style="color:#d4af37;">what's it worth to you to not miss this one?</strong></p>
    <div style="background:#1e1e2e;padding:20px;border-radius:12px;margin:20px 0;border:1px solid #2a2a3a;">
      <p style="color:#b0b0b0;font-size:14px;line-height:1.7;margin:0;font-style:italic;">"I was skeptical. But $20 is less than I spend on coffee in a week. My reading showed me exactly why I keep dating the wrong guys — and the date I'd meet the right one. I met him 3 days before the date it said. We're still together."</p>
      <p style="color:#d4af37;font-size:13px;margin:12px 0 0;">— Maya, 29, London UK</p>
    </div>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">$19.99 is less than one dinner. Less than one Uber ride. Less than the cost of another bad date with the wrong person.</p>
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:0 0 16px;">If you're tired of wondering "what if" — if you're ready to actually be prepared when your window opens — click below.</p>
    ${ctaButton("Yes, I Want My Full Reading — $19.99", GUMROAD_URL)}
    <p style="color:#e5e5e5;font-size:16px;line-height:1.7;margin:20px 0 0;">Whatever you decide, I hope this week gave you something. You deserve love that stays. You deserve money that flows. You deserve to stop repeating the same pattern.</p>
    <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:24px 0 0;">— LunaXStar</p>
    <p style="color:#6b7280;font-size:12px;margin:12px 0 0;">This offer expires at midnight. No extensions. No exceptions.</p>
  `;

  return {
    subject: "Last chance: your reading is 60% off for 12 more hours.",
    html: emailWrapper(content),
  };
}

// Get email by step number
export function getEmail(step: number, data: SubscriberData): { subject: string; html: string } {
  const templates = [email1, email2, email3, email4, email5, email6, email7];
  const idx = Math.min(step, templates.length - 1);
  return templates[idx](data);
}

export const TOTAL_EMAILS = 7;
