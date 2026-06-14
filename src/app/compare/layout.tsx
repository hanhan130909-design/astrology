import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "星盘对比 - 多人比较",
  description: "同时对比多个星盘，深入探索人际关系的占星学奥秘。",
  keywords: ["zodiac comparison", "sign comparison", "astrology compare", "zodiac match"],
  openGraph: {
    title: "星盘对比 - 多人比较",
    description: "Free zodiac sign comparison tool. Compare two zodiac signs to discover personality compatibility, strengths, weaknesses and relationship potential.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "星盘对比 - 多人比较",
    description: "Free zodiac sign comparison tool. Compare two zodiac signs to discover personality compatibility, strengths, weaknesses and relationship potential.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
