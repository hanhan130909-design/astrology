import { createPageMetadata } from "@/lib/seoMetadata";

export const metadata = createPageMetadata({
  path: "/blog",
  title: "Astrology Guides - Birth Charts, BaZi & Timing Techniques",
  description: "Learn astrology with practical guides to birth charts, BaZi, planetary transits, zodiac compatibility, and timing techniques.",
  keywords: ["astrology guides", "birth chart", "BaZi", "planetary transits", "zodiac compatibility"],
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
