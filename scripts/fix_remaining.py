import os

files = {
    r"C:\Users\user\.qclaw\astrology-clean\src\app\lunar-return\metadata.ts": '''import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Moon Return Chart - Starry Fate | Free Lunar Return Analysis | Lunar Return",
    template: "%s | Starry Fate Lunar Return",
  },
  description: "Generate a free Lunar Return chart to analyze your monthly emotions and inner needs. Enter your birth info, calculate the precise Lunar Return position, AI-powered insights into emotions, relationships, and life guidance.",
  keywords: ["Lunar Return", "Moon Return", "lunar return chart", "monthly emotions", "moon astrology", "free astrology"],
  openGraph: {
    title: "Moon Return Chart - Starry Fate | Free Lunar Return",
    description: "Generate a free Lunar Return chart to analyze your monthly emotions and inner needs. Enter your birth info, calculate the precise Lunar Return position, AI-powered insights into emotions, relationships, and life guidance.",
    type: "website",
    locale: "en_US",
    siteName: "Starry Fate Lunar Return",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon Return Chart - Starry Fate | Free Lunar Return",
    description: "Generate a free Lunar Return chart to analyze your monthly emotions and inner needs.",
  },
};
''',
    r"C:\Users\user\.qclaw\astrology-clean\src\app\solar-return\metadata.ts": '''import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Solar Return Chart - Starry Fate | Free Solar Return Analysis | Solar Return",
    template: "%s | Starry Fate Solar Return",
  },
  description: "Generate a free Solar Return chart to analyze your yearly fortune after your birthday. Enter your birth date, calculate the Solar Return position, AI-powered insights into overall luck, career, love, and financial trends.",
  keywords: ["Solar Return", "sun return", "solar return chart", "birthday forecast", "yearly astrology", "free astrology"],
  openGraph: {
    title: "Solar Return Chart - Starry Fate | Free Solar Return",
    description: "Generate a free Solar Return chart to analyze your yearly fortune after your birthday. Enter your birth date, calculate the Solar Return position, AI-powered insights into overall luck, career, love, and financial trends.",
    type: "website",
    locale: "en_US",
    siteName: "Starry Fate Solar Return",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Return Chart - Starry Fate | Free Solar Return",
    description: "Generate a free Solar Return chart to analyze your yearly fortune after your birthday.",
  },
};
''',
    r"C:\Users\user\.qclaw\astrology-clean\src\app\yearly-horoscope\metadata.ts": '''import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Yearly Horoscope 2026 - Starry Fate | Free Annual Zodiac Forecast | Yearly Horoscope",
    template: "%s | Starry Fate Yearly Horoscope",
  },
  description: "View your free 2026 yearly horoscope for all 12 zodiac signs. AI-powered analysis of annual astro trends, predicting development opportunities and challenges across all life areas. Help you plan your year and make better decisions.",
  keywords: ["yearly horoscope", "2026 horoscope", "annual forecast", "zodiac yearly", "free horoscope", "AI yearly prediction"],
  openGraph: {
    title: "Yearly Horoscope 2026 - Starry Fate | Free Annual Zodiac Forecast",
    description: "View your free 2026 yearly horoscope for all 12 zodiac signs. AI-powered analysis of annual astro trends, predicting development opportunities and challenges across all life areas.",
    type: "website",
    locale: "en_US",
    siteName: "Starry Fate Yearly Horoscope",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yearly Horoscope 2026 - Starry Fate | Free Annual Zodiac Forecast",
    description: "View your free 2026 yearly horoscope for all 12 zodiac signs.",
  },
};
''',
}

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Fixed: {os.path.basename(os.path.dirname(path))}")