import { createPageMetadata } from "@/lib/seoMetadata";

export const metadata = createPageMetadata({
  path: "/tarot",
  title: "Free Online Tarot Reading - No Sign Up",
  description: "Free online AI-powered tarot card reading. Draw tarot cards with various layouts and get guidance for love, career, and growth.",
  keywords: ["tarot reading", "free tarot", "AI tarot", "tarot cards", "online tarot"],
});

export default function TarotLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return children;
}
