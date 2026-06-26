"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const PRODUCTS = [
  { id: "wealth",  zh: "招财开运壁纸",  en: "Wealth & Prosperity",   link: "ahumw" },
  { id: "love",    zh: "姻缘开运壁纸",  en: "Love & Harmony",        link: "wdpnd" },
  { id: "success", zh: "文昌开运壁纸",  en: "Wisdom & Success",      link: "airpfp" },
  { id: "peace",   zh: "平安开运壁纸",  en: "Peace & Protection",     link: "ifxpd" },
  { id: "romance", zh: "桃花开运壁纸",  en: "Romance & Love",        link: "dqdfrc" },
  { id: "career",  zh: "事业开运壁纸",  en: "Career & Ambition",     link: "rfidul" },
];

const T: Record<string, any> = {
  zh: { title: "开运壁纸", sub: "中式书法吉祥壁纸 · 1080×1920 手机全屏", price: "$9.99", cta: "立即购买" },
  en: { title: "Fortune Wallpapers", sub: "Auspicious calligraphy wallpapers · 1080×1920 mobile", price: "$9.99", cta: "Buy Now" },
  id: { title: "Wallpaper Keberuntungan", sub: "Wallpaper kaligrafi hoki · 1080×1920", price: "$9.99", cta: "Beli" },
};

export default function ShopPage() {
  const { language } = useLanguage();
  const t = T[language] || T.en;

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[-1.5px] mb-3">{t.title}</h1>
          <p className="text-gray-500 text-sm">{t.sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[9/16] bg-gray-100 flex items-center justify-center">
                <img
                  src={`/shop/thumb-${p.id}.png`}
                  alt={p.zh}
                  width={300} height={533}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{p.zh}</h3>
                <p className="text-xs text-gray-500 mb-3">{p.en}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{t.price}</span>
                  <a
                    href={`https://hanhan55.gumroad.com/l/${p.link}`}
                    target="_blank"
                    rel="noopener"
                    className="px-4 py-2 bg-[#171717] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors"
                  >
                    {t.cta}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
