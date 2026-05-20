import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily, Monthly & Yearly Horoscope - Free Zodiac Forecast",
  description: "Free daily, monthly and yearly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions covering love, career, health and finance.",
  keywords: ["horoscope", "daily horoscope", "monthly horoscope", "yearly horoscope", "free horoscope"],
  openGraph: {
    title: "Daily, Monthly & Yearly Horoscope - Free Zodiac Forecast",
    description: "Free daily, monthly and yearly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions covering love, career, health and finance.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily, Monthly & Yearly Horoscope - Free Zodiac Forecast",
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
