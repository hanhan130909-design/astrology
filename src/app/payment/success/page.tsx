"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const T: Record<string, Record<string, string>> = {
  zh: { title: "支付成功！", sub: "感谢你的支持，内容已解锁。", cta: "返回首页", more: "查看其他内容" },
  en: { title: "Payment Successful!", sub: "Thanks for your support — your content is unlocked.", cta: "Back to Home", more: "Browse More" },
  id: { title: "Pembayaran Berhasil!", sub: "Terima kasih atas dukungan Anda — konten telah dibuka.", cta: "Ke Beranda", more: "Jelajahi Lainnya" },
};

export default function PaymentSuccessPage() {
  const { language } = useLanguage();
  const t = T[language] || T.en;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#171717] px-6">
      <div
        className="max-w-md w-full p-8 rounded-2xl text-center bg-white"
        style={{ boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.08)" }}
      >
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold mb-3">{t.title}</h1>
        <p className="text-gray-500 mb-8">{t.sub}</p>
        <div className="space-y-3">
          <Link href="/" className="block w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">
            {t.cta}
          </Link>
          <Link href="/pricing" className="block w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            {t.more}
          </Link>
        </div>
      </div>
    </div>
  );
}
