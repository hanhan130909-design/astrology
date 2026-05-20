import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Tarot Reading - Online Card Draw",
  description: "Free online AI-powered tarot card reading. Draw tarot cards with various layouts. AI interprets card meanings providing insightful guidance for love, career and growth.",
  keywords: ["tarot reading", "free tarot", "AI tarot", "tarot cards", "online tarot"],
  openGraph: {
    title: "Free AI Tarot Reading - Online Card Draw",
    description: "Free online AI-powered tarot card reading. Draw tarot cards with various layouts. AI interprets card meanings providing insightful guidance for love, career and growth.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Tarot Reading - Online Card Draw",
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
