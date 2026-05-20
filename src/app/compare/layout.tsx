import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zodiac Sign Comparison Tool",
  description: "Free zodiac sign comparison tool. Compare two zodiac signs to discover personality compatibility, strengths, weaknesses and relationship potential.",
  keywords: ["zodiac comparison", "sign comparison", "astrology compare", "zodiac match"],
  openGraph: {
    title: "Zodiac Sign Comparison Tool",
    description: "Free zodiac sign comparison tool. Compare two zodiac signs to discover personality compatibility, strengths, weaknesses and relationship potential.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zodiac Sign Comparison Tool",
    description: "Free zodiac sign comparison tool. Compare two zodiac signs to discover personality compatibility, strengths, weaknesses and relationship potential.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
