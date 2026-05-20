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
            "name": "Daily, Monthly & Yearly Horoscope",
            "description": "Free daily, monthly and yearly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions covering love, career, health and finance.",
            "url": "https://starryfate.app/horoscope",
            "mainEntity": {
              "@type": "Article",
              "headline": "Daily Horoscope - Zodiac Fortune Forecast",
              "description": "Comprehensive daily horoscope analysis for all 12 zodiac signs",
              "author": {
                "@type": "Organization",
                "name": "Starry Fate"
              }
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", "h2", ".horoscope-content"]
            }
          })
        }}
      />
      {children}
    </>
  );
}
