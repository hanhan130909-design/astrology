import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "星座配对 - 合盘分析",
  description: "基于出生信息的专业合盘配对分析，探索两人的灵魂契合度与关系互动模式。",
  keywords: ["compatibility", "synastry", "zodiac compatibility", "relationship astrology", "couple chart", "love match", "astrology compatibility", "free compatibility"],
  openGraph: {
    title: "星座配对 - 合盘分析",
    description: "Free online zodiac compatibility analysis. Compare two birth charts and analyze relationship dynamics, love compatibility, and friendship insights.",
    type: "website",
    url: "https://lunaxstar.com/compatibility",
    siteName: "LunaXStar",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Zodiac Compatibility Analysis - LunaXStar",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "星座配对 - 合盘分析",
    description: "Free online zodiac compatibility analysis. Compare two birth charts and analyze relationship dynamics.",
    images: ["/og-image.png"],
  },
};

export default function CompatibilityLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Zodiac Compatibility Analysis",
    "description": "Free online zodiac compatibility analysis tool. Compare two birth charts and analyze relationship dynamics based on astrological synastry.",
    "url": "https://lunaxstar.com/compatibility",
    "isPartOf": {
      "@type": "WebSite",
      "name": "LunaXStar",
      "url": "https://lunaxstar.com"
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Zodiac Compatibility Analyzer",
      "description": "Free online tool for zodiac compatibility analysis and relationship astrology",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
