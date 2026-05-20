import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Astrology - Free Beginner to Advanced Tutorials",
  description: "Learn astrology for free from beginner to advanced. Systematic tutorials covering zodiac basics, planetary meanings, house interpretation and aspect analysis.",
  keywords: ["learn astrology", "astrology tutorial", "zodiac knowledge", "beginner astrology"],
  openGraph: {
    title: "Learn Astrology - Free Beginner to Advanced Tutorials",
    description: "Learn astrology for free from beginner to advanced. Systematic tutorials covering zodiac basics, planetary meanings, house interpretation and aspect analysis.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Astrology - Free Beginner to Advanced Tutorials",
    description: "Learn astrology for free from beginner to advanced. Systematic tutorials covering zodiac basics, planetary meanings, house interpretation and aspect analysis.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
