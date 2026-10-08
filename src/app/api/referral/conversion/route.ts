/**
 * Referral Conversion API
 *
 * 支持两种调用方式：
 * 1. Gumroad Webhook — application/x-www-form-urlencoded（Gumroad后台自动发送）
 * 2. 手动调用 — application/json
 *
 * Gumroad webhook payload 关键字段：
 * - email: 购买者邮箱
 * - product_name: 产品名
 * - price: 价格（分，如 1999 = $19.99）
 * - currency: 货币
 * - sale_id: 交易ID
 * - url_params: URL参数JSON（如 {"ref":"abc123"}）
 * - referrer: 来源URL
 */
import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import { doc, getDoc, updateDoc, addDoc, collection, increment } from 'firebase/firestore';

const COMMISSION_RATE = 0.20;

// 从各种来源提取推荐码
function extractReferralCode(body: any): string | null {
  // 1. 直接传 code（手动调用）
  if (body.code) return body.code;

  // 2. Gumroad url_params（JSON字符串或对象）
  if (body.url_params) {
    try {
      const params = typeof body.url_params === 'string'
        ? JSON.parse(body.url_params)
        : body.url_params;
      if (params.ref) return params.ref;
    } catch {}
  }

  // 3. 从 referrer URL 中提取 ?ref=
  if (body.referrer) {
    try {
      const url = new URL(body.referrer);
      const ref = url.searchParams.get('ref');
      if (ref) return ref;
    } catch {}
  }

  // 4. Gumroad custom field（如果设置了 "Referral Code" 自定义字段）
  if (body['Referral Code'] || body['referral_code'] || body['ref_code']) {
    return body['Referral Code'] || body['referral_code'] || body['ref_code'];
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    if (!isFirebaseConfigured || !db) {
      return NextResponse.json({ success: false, error: 'Firebase not configured' }, { status: 500 });
    }

    const contentType = request.headers.get('content-type') || '';
    let body: any;

    // Gumroad 发送 form-urlencoded
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formText = await request.text();
      const params = new URLSearchParams(formText);
      body = {};
      params.forEach((value, key) => {
        body[key] = value;
      });
    } else {
      // JSON（手动调用）
      body = await request.json();
    }

    const code = extractReferralCode(body);

    if (!code) {
      // 没有推荐码，静默成功（Gumroad webhook需要返回200）
      return NextResponse.json({ success: true, message: 'No referral code found' });
    }

    const refDoc = doc(db, 'referrals', code);
    const docSnap = await getDoc(refDoc);

    if (!docSnap.exists()) {
      return NextResponse.json({ success: false, error: 'Referral code not found' }, { status: 404 });
    }

    // 解析金额：Gumroad price 单位是分
    let orderAmount = 0;
    if (body.amount !== undefined) {
      orderAmount = typeof body.amount === 'number' ? body.amount : parseFloat(body.amount);
    } else if (body.price !== undefined) {
      // Gumroad price 是分，转成美元
      const priceCents = typeof body.price === 'number' ? body.price : parseFloat(body.price);
      orderAmount = priceCents / 100;
    }

    const commission = Math.round(orderAmount * COMMISSION_RATE * 100) / 100;

    // 防止重复记录（用 sale_id 去重）
    const saleId = body.sale_id || body.order_id || `${code}-${Date.now()}`;

    // 记录转化
    await addDoc(collection(db, 'referral_conversions'), {
      code,
      buyerEmail: body.email || body.buyerEmail || 'unknown',
      product: body.product_name || body.product || 'unknown',
      amount: orderAmount,
      commission,
      currency: body.currency || 'USD',
      saleId,
      status: 'confirmed', // Gumroad webhook 触发的直接标记为 confirmed
      source: 'gumroad_webhook',
      createdAt: Timestamp.now(),
    });

    // 更新分销员统计
    await updateDoc(refDoc, {
      conversions: increment(1),
      revenue: increment(commission),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      code,
      commission,
      commissionRate: COMMISSION_RATE,
      orderAmount,
    });
  } catch (err) {
    console.error('Referral conversion error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
