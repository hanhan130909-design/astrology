import { transitsMetadata } from "@/lib/seoMetadata";

export const metadata = transitsMetadata;

export default function TransitsLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Astrology Calendar - Moon Phases, Retrogrades & Transits",
            description: "Monthly astrology calendar for planetary ingresses, moon phases, retrogrades, direct stations, and major aspects.",
            url: "https://lunaxstar.com/transits",
            provider: { "@type": "Organization", name: "星缘", url: "https://lunaxstar.com" }
          })
        }}
      />
      {children}
    </>
  );
}
