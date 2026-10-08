/**
 * Referral API — Viral Growth Engine (Firebase Persistent)
 *
 * POST /api/referral — Create/find referral code
 * GET  /api/referral?code=xxx — Get referral stats
 * GET  /api/referral — Global stats & top referrers
 * POST /api/referral/track — Track click (called when ?ref= present)
 * POST /api/referral/conversion — Record conversion (Gumroad webhook)
 */
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  query,
  orderBy,
  limit,
  increment,
  where,
} from 'firebase/firestore';

// 佣金比例：20%
const COMMISSION_RATE = 0.20;

// Generate deterministic referral code from email
function generateCode(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 8);
}

// ─── POST — Create/find referral code ───
export async function POST(request: NextRequest) {
  try {
    if (!isFirebaseConfigured || !db) {
      return NextResponse.json({ success: false, error: 'Firebase not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { email, action } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
    }

    const code = generateCode(email);
    const refDoc = doc(db, 'referrals', code);
    const docSnap = await getDoc(refDoc);
    const isNew = !docSnap.exists();

    if (isNew || action === 'create') {
      const now = Timestamp.now();
      await setDoc(refDoc, {
        code,
        email: email.toLowerCase().trim(),
        clicks: isNew ? 0 : (docSnap.data()?.clicks || 0),
        conversions: isNew ? 0 : (docSnap.data()?.conversions || 0),
        revenue: isNew ? 0 : (docSnap.data()?.revenue || 0),
        createdAt: isNew ? now : (docSnap.data()?.createdAt || now),
        updatedAt: now,
      }, { merge: true });
    }

    const updated = await getDoc(refDoc);
    const data = updated.data() || {};
    const shareUrl = `https://lunaxstar.com/bazi?ref=${code}`;

    return NextResponse.json({
      success: true,
      code,
      shareUrl,
      existing: !isNew,
      stats: {
        clicks: data.clicks || 0,
        conversions: data.conversions || 0,
        revenue: data.revenue || 0,
      },
    });
  } catch (err) {
    console.error('Referral POST error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// ─── GET — Stats ───
export async function GET(request: NextRequest) {
  try {
    if (!isFirebaseConfigured || !db) {
      return NextResponse.json({ success: false, error: 'Firebase not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    // Single referrer stats
    if (code) {
      const docSnap = await getDoc(doc(db, 'referrals', code));
      if (!docSnap.exists()) {
        return NextResponse.json({ success: false, error: 'Code not found' }, { status: 404 });
      }
      const data = docSnap.data();
      return NextResponse.json({
        success: true,
        code: data.code,
        email: data.email,
        clicks: data.clicks || 0,
        conversions: data.conversions || 0,
        revenue: data.revenue || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      });
    }

    // Global stats
    const snapshot = await getDocs(collection(db, 'referrals'));
    let totalClicks = 0;
    let totalConversions = 0;
    let totalRevenue = 0;
    const allReferrers: any[] = [];

    snapshot.forEach((d) => {
      const data = d.data();
      totalClicks += data.clicks || 0;
      totalConversions += data.conversions || 0;
      totalRevenue += data.revenue || 0;
      allReferrers.push(data);
    });

    const totalUsers = snapshot.size;
    const kFactor = totalUsers > 0 ? (totalConversions / totalUsers).toFixed(2) : '0';

    const topReferrers = allReferrers
      .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
      .slice(0, 10)
      .map((e) => ({
        code: e.code,
        email: (e.email || '').slice(0, 3) + '***',
        conversions: e.conversions || 0,
        revenue: e.revenue || 0,
      }));

    return NextResponse.json({
      success: true,
      totalUsers,
      totalClicks,
      totalConversions,
      totalRevenue,
      kFactor,
      commissionRate: COMMISSION_RATE,
      topReferrers,
    });
  } catch (err) {
    console.error('Referral GET error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
