import { createPageMetadata } from "@/lib/seoMetadata";

export const metadata = createPageMetadata({
  path: "/bazi",
  title: "Free BaZi Calculator - Four Pillars Chart & Luck Cycles",
  description: "Generate a free BaZi Four Pillars chart with Ten Gods, Five Elements, and 10-year luck cycles. No signup required.",
  keywords: ["BaZi calculator", "Four Pillars chart", "Chinese astrology", "luck cycles"],
});

export default function BaziLayout({ children }: { children: React.ReactNode }) {
  return children;
}
