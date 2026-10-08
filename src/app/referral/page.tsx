"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Share2, Copy, Check, TrendingUp, Users, DollarSign, Link as LinkIcon } from "lucide-react";

const UI = {
  zh: {
    title: "分销中心",
    subtitle: "推荐朋友，赚取20%佣金",
    emailLabel: "输入你的邮箱生成推荐链接",
    emailPlaceholder: "your@email.com",
    generateBtn: "生成推荐链接",
    yourLink: "你的推荐链接",
    copyBtn: "复制",
    copied: "已复制",
    shareBtn: "分享",
    stats: "你的数据",
    clicks: "点击数",
    conversions: "转化数",
    revenue: "佣金收入",
    howItWorks: "如何运作",
    step1: "生成你的专属推荐链接",
    step2: "分享给朋友和粉丝",
    step3: "他们购买后你获得20%佣金",
    commission: "佣金比例",
    payout: "满$50可提现",
    loading: "加载中...",
    enterEmail: "请输入邮箱",
    notFound: "未找到推荐码",
  },
  en: {
    title: "Referral Center",
    subtitle: "Refer friends, earn 20% commission",
    emailLabel: "Enter your email to generate a referral link",
    emailPlaceholder: "your@email.com",
    generateBtn: "Generate Link",
    yourLink: "Your Referral Link",
    copyBtn: "Copy",
    copied: "Copied",
    shareBtn: "Share",
    stats: "Your Stats",
    clicks: "Clicks",
    conversions: "Conversions",
    revenue: "Commission",
    howItWorks: "How It Works",
    step1: "Generate your unique referral link",
    step2: "Share with friends and followers",
    step3: "Earn 20% when they purchase",
    commission: "Commission Rate",
    payout: "Payout at $50 minimum",
    loading: "Loading...",
    enterEmail: "Please enter email",
    notFound: "Referral code not found",
  },
  id: { title: "Pusat Referral", subtitle: "Rujuk teman, dapat 20% komisi", emailLabel: "Masukkan email untuk buat link", emailPlaceholder: "email@email.com", generateBtn: "Buat Link", yourLink: "Link Referral Anda", copyBtn: "Salin", copied: "Tersalin", shareBtn: "Bagikan", stats: "Statistik Anda", clicks: "Klik", conversions: "Konversi", revenue: "Komisi", howItWorks: "Cara Kerja", step1: "Buat link referral unik", step2: "Bagikan ke teman", step3: "Dapat 20% saat mereka beli", commission: "Komisi", payout: "Pencairan min $50", loading: "Memuat...", enterEmail: "Masukkan email", notFound: "Kode tidak ditemukan" },
  th: { title: "ศูนย์แนะนำ", subtitle: "แนะนำเพื่อน รับค่าคอม 20%", emailLabel: "กรอกอีเมลเพื่อสร้างลิงก์", emailPlaceholder: "email@email.com", generateBtn: "สร้างลิงก์", yourLink: "ลิงก์แนะนำของคุณ", copyBtn: "คัดลอก", copied: "คัดลอกแล้ว", shareBtn: "แชร์", stats: "สถิติของคุณ", clicks: "คลิก", conversions: "การซื้อ", revenue: "ค่าคอม", howItWorks: "วิธีใช้", step1: "สร้างลิงก์เฉพาะ", step2: "แชร์ให้เพื่อน", step3: "รับ 20% เมื่อซื้อ", commission: "ค่าคอม", payout: "ถอนขั้นต่ำ $50", loading: "กำลังโหลด...", enterEmail: "กรอกอีเมล", notFound: "ไม่พบโค้ด" },
  vi: { title: "Trung tâm Giới thiệu", subtitle: "Giới thiệu bạn, nhận 20% hoa hồng", emailLabel: "Nhập email để tạo link", emailPlaceholder: "email@email.com", generateBtn: "Tạo Link", yourLink: "Link Giới thiệu", copyBtn: "Sao chép", copied: "Đã sao chép", shareBtn: "Chia sẻ", stats: "Thống kê", clicks: "Lượt click", conversions: "Lượt mua", revenue: "Hoa hồng", howItWorks: "Cách hoạt động", step1: "Tạo link riêng", step2: "Chia sẻ cho bạn bè", step3: "Nhận 20% khi họ mua", commission: "Hoa hồng", payout: "Rút tối thiểu $50", loading: "Đang tải...", enterEmail: "Nhập email", notFound: "Không tìm thấy mã" },
  ms: { title: "Pusat Rujukan", subtitle: "Rujuk rakan, peroleh 20% komisen", emailLabel: "Masukkan email untuk pautan", emailPlaceholder: "email@email.com", generateBtn: "Jana Pautan", yourLink: "Pautan Rujukan Anda", copyBtn: "Salin", copied: "Tersalin", shareBtn: "Kongsi", stats: "Statistik Anda", clicks: "Klik", conversions: "Penukaran", revenue: "Komisen", howItWorks: "Cara Kerja", step1: "Jana pautan unik", step2: "Kongsi dengan rakan", step3: "Peroleh 20% apabila beli", commission: "Komisen", payout: "Pengeluaran min $50", loading: "Memuatkan...", enterEmail: "Masukkan email", notFound: "Kod tidak dijumpai" },
  ja: { title: "紹介センター", subtitle: "友達を紹介して20%コミッション", emailLabel: "メールを入力してリンク生成", emailPlaceholder: "email@email.com", generateBtn: "リンク生成", yourLink: "あなたの紹介リンク", copyBtn: "コピー", copied: "コピー済み", shareBtn: "共有", stats: "あなたの統計", clicks: "クリック", conversions: "購入", revenue: "コミッション", howItWorks: "仕組み", step1: "専用リンクを生成", step2: "友達に共有", step3: "購入で20%獲得", commission: "コミッション", payout: "最低$50で出金", loading: "読み込み中...", enterEmail: "メール入力", notFound: "コードが見つかりません" },
  ko: { title: "추천 센터", subtitle: "친구 추천하고 20% 수수료", emailLabel: "이메일 입력하여 링크 생성", emailPlaceholder: "email@email.com", generateBtn: "링크 생성", yourLink: "나의 추천 링크", copyBtn: "복사", copied: "복사됨", shareBtn: "공유", stats: "나의 통계", clicks: "클릭", conversions: "전환", revenue: "수수료", howItWorks: "작동 방식", step1: "고유 링크 생성", step2: "친구와 공유", step3: "구매시 20% 적립", commission: "수수료율", payout: "최소 $50 출금", loading: "로딩중...", enterEmail: "이메일 입력", notFound: "코드를 찾을 수 없습니다" },
};

export default function ReferralPage() {
  const { language } = useLanguage();
  const lang = language || "en";
  const ui = UI[lang] || UI.en;

  const [email, setEmail] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [stats, setStats] = useState<{ clicks: number; conversions: number; revenue: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 从 localStorage 恢复
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lunaxstar_ref_email");
      if (stored) setEmail(stored);
    } catch {}
  }, []);

  const generate = async () => {
    if (!email) { setError(ui.enterEmail); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "create" }),
      });
      const data = await res.json();
      if (data.success) {
        setLink(data.shareUrl);
        setCode(data.code);
        setStats(data.stats);
        try { localStorage.setItem("lunaxstar_ref_email", email); } catch {}
      } else {
        setError(data.error || "Error");
      }
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const share = async () => {
    if (!link) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "LunaXStar", text: "Check out LunaXStar - Free astrology & BaZi!", url: link });
      } catch {}
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{ui.title}</h1>
          <p className="text-lg text-amber-700 font-medium">{ui.subtitle}</p>
        </div>

        {/* Email input */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{ui.emailLabel}</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ui.emailPlaceholder}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={generate}
              disabled={loading}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? ui.loading : ui.generateBtn}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Referral link */}
        {link && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <LinkIcon size={14} />
              {ui.yourLink}
            </h3>
            <div className="flex gap-2">
              <input
                readOnly
                value={link}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600"
              />
              <button
                onClick={copyLink}
                className="px-4 py-3 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 transition-colors flex items-center gap-1"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? ui.copied : ui.copyBtn}
              </button>
              <button
                onClick={share}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <Share2 size={14} />
                {ui.shareBtn}
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
              <TrendingUp size={14} />
              {ui.stats}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-center mb-1">
                  <Users size={18} className="text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.clicks}</div>
                <div className="text-xs text-gray-500">{ui.clicks}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp size={18} className="text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.conversions}</div>
                <div className="text-xs text-gray-500">{ui.conversions}</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center justify-center mb-1">
                  <DollarSign size={18} className="text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">${(stats.revenue || 0).toFixed(2)}</div>
                <div className="text-xs text-gray-500">{ui.revenue}</div>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">{ui.howItWorks}</h3>
          <div className="space-y-3">
            {[ui.step1, ui.step2, ui.step3].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
            <span>{ui.commission}: <strong className="text-amber-600">20%</strong></span>
            <span>{ui.payout}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
