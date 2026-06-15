/**
 * Referral API — Viral Growth Engine
 * POST /api/referral — Generate referral code
 * GET /api/referral — Get referral stats
 */
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory store (resets on cold start — production would use DB/Firebase)
const store: Record<string, {
  code: string;
  email: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}> = {};

const stats = {
  totalClicks: 0,
  totalConversions: 0,
  totalUsers: 0,
};

// Generate deterministic referral code from email
function generateCode(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 8);
}

// POST — Create/find referral code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
    }

    const code = generateCode(email);
    const isNew = !store[code];

    if (isNew || action === 'create') {
      store[code] = {
        code,
        email: email.toLowerCase().trim(),
        clicks: isNew ? 0 : store[code].clicks,
        conversions: isNew ? 0 : store[code].conversions,
        createdAt: isNew ? new Date().toISOString() : store[code].createdAt,
      };
      stats.totalUsers++;
    }

    const shareUrl = `https://lunaxstar.com/bazi?ref=${code}`;

    return NextResponse.json({
      success: true,
      code,
      shareUrl,
      existing: !isNew,
      stats: {
        clicks: store[code].clicks,
        conversions: store[code].conversions,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// GET — Stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const entry = store[code];
    if (!entry) return NextResponse.json({ success: false, error: 'Code not found' }, { status: 404 });
    return NextResponse.json({ success: true, ...entry });
  }

  // K-factor = total conversions / total users
  const kFactor = stats.totalUsers > 0 ? (stats.totalConversions / stats.totalUsers).toFixed(2) : '0';
  
  return NextResponse.json({
    success: true,
    totalUsers: stats.totalUsers,
    totalClicks: stats.totalClicks,
    totalConversions: stats.totalConversions,
    kFactor,
    topReferrers: Object.values(store)
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 10)
      .map(e => ({ code: e.code, email: e.email.slice(0, 3) + '***', conversions: e.conversions })),
  });
}
