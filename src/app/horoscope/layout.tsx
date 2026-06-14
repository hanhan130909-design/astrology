import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "每日运势 - 12星座运程",
  description: "查看所有12星座每日运势，涵盖爱情、事业、财运、健康四大维度。免费占星运势分析。",
  keywords: ["horoscope", "daily horoscope", "monthly horoscope", "yearly horoscope", "free horoscope"],
  openGraph: {
    title: "每日运势 - 12星座运程",
    description: "Free daily, monthly and yearly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions covering love, career, health and finance.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "每日运势 - 12星座运程",
    description: "Free daily, monthly and yearly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions covering love, career, health and finance.",
  },
};

export default function HoroscopeLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Daily, Monthly & Yearly Horoscope",
            description: "Astrological horoscopes provide personalized guidance based on real astronomical calculations. Using complete birth information combined with current planetary movements, delivers energy trends truly yours. Supports daily, monthly, and yearly forecasts (Solar Return).",
            provider: { "@type": "Organization", name: "星缘", url: "https://lunaxstar.com" }
          })
        }}
      />
      {children}
    </>
  );
}
