import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "塔罗占卜 - 免费在线抽牌",
  description: "78张经典塔罗牌，多种牌阵可选。免费在线塔罗占卜，探索命运的指引。",
  keywords: ["tarot reading", "free tarot", "AI tarot", "tarot cards", "online tarot"],
  openGraph: {
    title: "塔罗占卜 - 免费在线抽牌",
    description: "Free online AI-powered tarot card reading. Draw tarot cards with various layouts. AI interprets card meanings providing insightful guidance for love, career and growth.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "塔罗占卜 - 免费在线抽牌",
    description: "Free online AI-powered tarot card reading. Draw tarot cards with various layouts. AI interprets card meanings providing insightful guidance for love, career and growth.",
  },
};

export default function TarotLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return children;
}
