"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const L: Record<string, { share: string; copied: string; copy: string }> = {
  zh: { share: "分享", copied: "已复制链接！", copy: "复制链接" },
  en: { share: "Share", copied: "Link copied!", copy: "Copy link" },
  id: { share: "Bagikan", copied: "Tautan disalin!", copy: "Salin tautan" },
  th: { share: "แชร์", copied: "คัดลอกลิงก์แล้ว!", copy: "คัดลอกลิงก์" },
  vi: { share: "Chia sẻ", copied: "Đã sao chép liên kết!", copy: "Sao chép liên kết" },
  ms: { share: "Kongsi", copied: "Pautan disalin!", copy: "Salin pautan" },
  ja: { share: "シェア", copied: "リンクをコピーしました！", copy: "リンクをコピー" },
  ko: { share: "공유", copied: "링크 복사됨!", copy: "링크 복사" },
};

export default function ShareButtons({ url, title }: { url: string; title?: string }) {
  const { language } = useLanguage();
  const t = L[language] || L.en;
  const [copied, setCopied] = useState(false);

  const text = title || "Check this out on lunaxstar.com";
  const enc = encodeURIComponent;

  const platforms = [
    { name: "X", color: "#000000", href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}` },
    { name: "Facebook", color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${enc(text + " " + url)}` },
    { name: "Telegram", color: "#0088CC", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}` },
    { name: "Reddit", color: "#FF4500", href: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(text)}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: text, text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <button
        onClick={nativeShare}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#171717] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors"
      >
        <Share2 size={14} /> {t.share}
      </button>
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: p.color }}
        >
          {p.name}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
      >
        {copied ? <Check size={14} className="text-green-600" /> : <Link2 size={14} />}
        {copied ? t.copied : t.copy}
      </button>
    </div>
  );
}
