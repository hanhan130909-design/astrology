import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Solar Return Chart - Birthday Astrology",
  description: "Generate a free professional Solar Return chart to analyze astrological themes for your personal new year. AI interprets fortune themes for the year ahead.",
  keywords: ["solar return", "birthday astrology", "yearly chart", "AI solar return"],
  openGraph: {
    title: "Free Solar Return Chart - Birthday Astrology",
    description: "Generate a free professional Solar Return chart to analyze astrological themes for your personal new year. AI interprets fortune themes for the year ahead.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Solar Return Chart - Birthday Astrology",
    description: "Generate a free professional Solar Return chart to analyze astrological themes for your personal new year. AI interprets fortune themes for the year ahead.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
