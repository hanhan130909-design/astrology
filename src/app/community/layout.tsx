import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zodiac Community - Connect with Astrology Enthusiasts",
  description: "Join the free Starry Fate Zodiac Community and connect with astrology enthusiasts worldwide. Discuss horoscopes, zodiac compatibility and astrology techniques.",
  keywords: ["zodiac community", "astrology forum", "astrology discussion", "free community"],
  openGraph: {
    title: "Zodiac Community - Connect with Astrology Enthusiasts",
    description: "Join the free Starry Fate Zodiac Community and connect with astrology enthusiasts worldwide. Discuss horoscopes, zodiac compatibility and astrology techniques.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zodiac Community - Connect with Astrology Enthusiasts",
    description: "Join the free Starry Fate Zodiac Community and connect with astrology enthusiasts worldwide. Discuss horoscopes, zodiac compatibility and astrology techniques.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
