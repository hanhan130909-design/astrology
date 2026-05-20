import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Starry Fate - Free AI Astrology Platform",
  description: "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights.",
  keywords: ["about Starry Fate", "Starry Fate astrology", "AI astrology", "astrology platform", "about us"],
  openGraph: {
    title: "About Starry Fate - Free AI Astrology Platform",
    description: "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Starry Fate - Free AI Astrology Platform",
    description: "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
