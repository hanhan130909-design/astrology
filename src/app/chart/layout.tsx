import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Astrology Chart Calculator",
  description: "Free online astrology chart calculator supporting natal chart, transit chart, composite chart, solar return and more. Based on real astronomical calculations with AI-powered interpretation.",
  keywords: ["astrology chart", "chart calculator", "natal chart", "transit chart", "free chart", "AI chart"],
  openGraph: {
    title: "Free Astrology Chart Calculator",
    description: "Free online astrology chart calculator supporting natal chart, transit chart, composite chart, solar return and more. Based on real astronomical calculations with AI-powered interpretation.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Astrology Chart Calculator",
    description: "Free online astrology chart calculator supporting natal chart, transit chart, composite chart, solar return and more. Based on real astronomical calculations with AI-powered interpretation.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
