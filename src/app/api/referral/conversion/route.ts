/**
 * Referral Conversion API
 * POST /api/referral/conversion — Record a conversion (Gumroad webhook or manual)
 *
 * Gumroad webhook payload includes: email, product_name, price, referral_code (custom field)
 * We store the conversion and update the referrer's stats.
 */
import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import { doc, getDoc, updateDoc, addDoc, collection, increment } from 'firebase/firestore';

const COMMISSION_RATE = 0.20;

export async function POST(request: NextRequest) {
  try {
    if (!isFirebaseConfigured || !db) {
      return NextResponse.json({ success: false, error: 'Firebase not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { code, buyerEmail, product, amount, source } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Referral code required' }, { status: 400 });
    }

    const refDoc = doc(db, 'referrals', code);
    const docSnap = await getDoc(refDoc);

    if (!docSnap.exists()) {
      return NextResponse.json({ success: false, error: 'Referral code not found' }, { status: 404 });
    }

    const orderAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    const commission = Math.round(orderAmount * COMMISSION_RATE * 100) / 100;

    // Record conversion
    await addDoc(collection(db, 'referral_conversions'), {
      code,
      buyerEmail: buyerEmail || 'unknown',
      product: product || 'unknown',
      amount: orderAmount,
      commission,
      status: 'pending', // pending → confirmed → paid
      source: source || 'gumroad',
      createdAt: Timestamp.now(),
    });

    // Update referrer stats
    await updateDoc(refDoc, {
      conversions: increment(1),
      revenue: increment(commission),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      commission,
      commissionRate: COMMISSION_RATE,
    });
  } catch (err) {
    console.error('Referral conversion error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
