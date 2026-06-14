import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "占星学习 - 免费占星知识库",
  description: "从零开始学占星：行星含义、十二宫位、相位解读。系统化免费占星教程。",
  keywords: ["learn astrology", "astrology tutorial", "zodiac knowledge", "beginner astrology"],
  openGraph: {
    title: "占星学习 - 免费占星知识库",
    description: "Learn astrology for free from beginner to advanced. Systematic tutorials covering zodiac basics, planetary meanings, house interpretation and aspect analysis.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "占星学习 - 免费占星知识库",
    description: "Learn astrology for free from beginner to advanced. Systematic tutorials covering zodiac basics, planetary meanings, house interpretation and aspect analysis.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
