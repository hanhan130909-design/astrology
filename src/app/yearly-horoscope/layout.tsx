import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yearly Horoscope - 12 Zodiac Signs Annual Forecast",
  description: "Free yearly horoscope for all 12 zodiac signs. Comprehensive annual forecast covering love, career, finance and health with AI-powered analysis.",
  keywords: ["yearly horoscope", "annual forecast", "yearly zodiac", "free horoscope"],
  openGraph: {
    title: "Yearly Horoscope - 12 Zodiac Signs Annual Forecast",
    description: "Free yearly horoscope for all 12 zodiac signs. Comprehensive annual forecast covering love, career, finance and health with AI-powered analysis.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yearly Horoscope - 12 Zodiac Signs Annual Forecast",
    description: "Free yearly horoscope for all 12 zodiac signs. Comprehensive annual forecast covering love, career, finance and health with AI-powered analysis.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
