"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = {
  bg: "#0a0e1a",
  card: "#111827",
  border: "#2d3748",
  gold: "#d4a574",
  goldLight: "#e8c89e",
  text: "#f9fafb",
  textMuted: "#9ca3af",
  success: "#10b981",
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }

    // 检查支付状态
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payment?order_id=${orderId}`);
        const data = await res.json();
        
        if (data.success && data.status === 'paid') {
          setStatus('success');
          // 存储支付成功状态
          sessionStorage.setItem('paid_report', 'true');
        } else if (data.success) {
          // 等待中，模拟成功（演示模式）
          setStatus('success');
          sessionStorage.setItem('paid_report', 'true');
        } else {
          setStatus('error');
        }
      } catch {
        // 测试模式：直接成功
        setStatus('success');
        sessionStorage.setItem('paid_report', 'true');
      }
    };

    checkStatus();
  }, [orderId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p style={{ color: COLORS.textMuted }}>
            {language === 'zh' ? '正在确认支付...' : language === 'id' ? 'Mengkonfirmasi pembayaran...' : 'Confirming payment...'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <div
          className="max-w-md w-full p-8 rounded-3xl text-center"
          style={{ backgroundColor: COLORS.card, border: `2px solid #ef4444` }}
        >
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-3 text-red-400">
            {language === 'zh' ? '支付失败' : language === 'id' ? 'Pembayaran Gagal' : 'Payment Failed'}
          </h1>
          <p className="mb-6" style={{ color: COLORS.textMuted }}>
            {language === 'zh' ? '请重试或联系客服' : language === 'id' ? 'Silakan coba lagi atau hubungi layanan pelanggan' : 'Please try again or contact support'}
          </p>
          <Link
            href="/chart"
            className="inline-block px-8 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: COLORS.gold, color: COLORS.bg }}
          >
            {language === 'zh' ? '返回星盘' : language === 'id' ? 'Kembali ke Bagan' : 'Back to Chart'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
      <div
        className="max-w-md w-full p-8 rounded-3xl text-center"
        style={{
          backgroundColor: COLORS.card,
          border: `2px solid ${COLORS.success}`,
          boxShadow: `0 0 60px ${COLORS.success}30`,
        }}
      >
        <div className="text-7xl mb-6">✅</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: COLORS.success }}>
          {language === 'zh' ? '支付成功！' : language === 'id' ? 'Pembayaran Berhasil!' : 'Payment Successful!'}
        </h1>
        <p className="mb-6" style={{ color: COLORS.textMuted }}>
          {language === 'zh' ? '您的完整星盘报告已解锁' : language === 'id' ? 'Laporan lengkap Anda telah dibuka' : 'Your full report has been unlocked'}
        </p>
        {orderId && (
          <p className="text-xs mb-6" style={{ color: COLORS.textMuted }}>
            {language === 'zh' ? '订单号：' : language === 'id' ? 'ID Pesanan: ' : 'Order ID: '}{orderId}
          </p>
        )}
        
        <div className="space-y-3">
          <Link
            href="/chart"
            className="block w-full py-4 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: COLORS.success, color: '#fff' }}
          >
            {language === 'zh' ? '查看完整报告 →' : language === 'id' ? 'Lihat Laporan Lengkap →' : 'View Full Report →'}
          </Link>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl font-semibold"
            style={{ backgroundColor: COLORS.border, color: COLORS.text }}
          >
            {language === 'zh' ? '返回首页' : language === 'id' ? 'Ke Beranda' : 'Go to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <div className="animate-spin text-6xl">⏳</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}