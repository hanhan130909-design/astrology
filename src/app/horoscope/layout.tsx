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
  return children;
}
