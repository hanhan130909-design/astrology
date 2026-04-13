/**
 * Payment API - Midtrans Integration
 * 印尼主流支付：GoPay, OVO, DANA, ShopeePay, Credit Card
 * 测试模式：使用 Midtrans Sandbox
 */

import { NextRequest, NextResponse } from 'next/server';

// Midtrans 配置（测试环境）
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-YOUR_SANDBOX_KEY';
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_SANDBOX_KEY';
const MIDTRANS_API_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';

// 价格配置
const PRICING = {
  report: {
    amount: 19000,
    currency: 'IDR',
    name: { id: 'Laporan Lengkap', zh: '完整报告', en: 'Full Report' },
  },
  consultation: {
    amount: 99000,
    currency: 'IDR',
    name: { id: 'Konsultasi 1-on-1', zh: '一对一咨询', en: '1-on-1 Consultation' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// 创建支付订单
// ════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerEmail, customerName, language = 'id' } = body;
    
    // 验证产品
    const product = PRICING[productId as keyof typeof PRICING];
    if (!product) {
      return NextResponse.json({ success: false, error: 'Invalid product' }, { status: 400 });
    }
    
    // 生成订单ID
    const orderId = `ASTRO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // 构建Midtrans请求
    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: product.amount,
      },
      customer_details: {
        email: customerEmail,
        first_name: customerName,
      },
      item_details: [{
        id: productId,
        price: product.amount,
        quantity: 1,
        name: product.name[language as 'id' | 'zh' | 'en'] || product.name.id,
      }],
      enabled_payments: [
        'gopay',
        'shopeepay',
        'dana',
        'ovo',
        'credit_card',
        'bank_transfer',
        'bca_va',
        'bni_va',
        'bri_va',
        'mandiri_bill',
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://astrology-main-ten.vercel.app'}/payment/success?order_id=${orderId}`,
      },
    };
    
    // 调用Midtrans API
    const response = await fetch(MIDTRANS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(midtransPayload),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Midtrans error:', data);
      // 如果Midtrans失败，返回模拟数据（测试模式）
      return NextResponse.json({
        success: true,
        testMode: true,
        orderId,
        paymentUrl: `/payment/simulate?order_id=${orderId}&product=${productId}`,
        amount: product.amount,
        currency: product.currency,
        productName: product.name[language as 'id' | 'zh' | 'en'] || product.name.id,
        message: {
          zh: '测试模式：点击下方按钮模拟支付成功',
          en: 'Test Mode: Click button below to simulate successful payment',
          id: 'Mode Tes: Klik tombol di bawah untuk simulasi pembayaran berhasil'
        }[language as 'zh' | 'en' | 'id']
      });
    }
    
    return NextResponse.json({
      success: true,
      orderId,
      token: data.token,
      redirectUrl: data.redirect_url,
      amount: product.amount,
      currency: product.currency,
      productName: product.name[language as 'id' | 'zh' | 'en'] || product.name.id,
    });
    
  } catch (err: unknown) {
    console.error('Payment error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    
    // 返回模拟支付模式
    return NextResponse.json({
      success: true,
      testMode: true,
      orderId: `ASTRO-TEST-${Date.now()}`,
      paymentUrl: '/payment/simulate',
      message: 'Payment system in test mode'
    });
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 查询订单状态
// ════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');
  
  if (!orderId) {
    return NextResponse.json({ success: false, error: 'Missing order_id' }, { status: 400 });
  }
  
  // 模拟支付成功（测试模式）
  if (orderId.startsWith('ASTRO-TEST')) {
    return NextResponse.json({
      success: true,
      status: 'paid',
      orderId,
      paidAt: new Date().toISOString(),
    });
  }
  
  // 实际查询Midtrans
  try {
    const response = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      status: data.transaction_status === 'settlement' || data.transaction_status === 'capture' ? 'paid' : data.transaction_status,
      orderId,
      paidAt: data.settlement_time || data.transaction_time,
    });
    
  } catch (err: unknown) {
    console.error('Status check error:', err);
    return NextResponse.json({ success: false, error: 'Failed to check status' }, { status: 500 });
  }
}
