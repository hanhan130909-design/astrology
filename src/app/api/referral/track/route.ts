/**
 * Referral Click Tracking API
 * POST /api/referral/track — Record a click on a referral link
 * Called client-side when URL contains ?ref=xxx
 */
import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    if (!isFirebaseConfigured || !db) {
      return NextResponse.json({ success: false, error: 'Firebase not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { code, page, referrer } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Referral code required' }, { status: 400 });
    }

    const refDoc = doc(db, 'referrals', code);
    const docSnap = await getDoc(refDoc);

    if (!docSnap.exists()) {
      // Create minimal entry if code doesn't exist (shouldn't happen normally)
      await setDoc(refDoc, {
        code,
        email: `unknown_${code}@referral.local`,
        clicks: 1,
        conversions: 0,
        revenue: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } else {
      await updateDoc(refDoc, {
        clicks: increment(1),
        updatedAt: Timestamp.now(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Referral track error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
