import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于星缘 - 专业占星平台",
  description: "基于真实天文计算与AI技术的免费在线占星平台，了解我们的故事与技术。",
  keywords: ["about Starry Fate", "Starry Fate astrology", "AI astrology", "astrology platform", "about us"],
  openGraph: {
    title: "关于星缘 - 专业占星平台",
    description: "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "关于星缘 - 专业占星平台",
    description: "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
