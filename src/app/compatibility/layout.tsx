import { compatibilityMetadata } from "@/lib/seoMetadata";

export const metadata = compatibilityMetadata;

export default function CompatibilityLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free Astrology Compatibility Calculator - Synastry & Zodiac",
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
