import NatalSeoContent from "@/components/NatalSeoContent";
import {
  natalFaqs,
  serializeNatalFaqJsonLd,
} from "@/components/natalFaq";
import { natalMetadata } from "@/lib/seoMetadata";

export const metadata = natalMetadata;

export default function NatalLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"WebPage\", \"name\": \"Free Birth Chart Calculator - Natal Chart Analysis\", \"description\": \"Generate your free professional natal chart based on real astronomical calculations. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.\", \"url\": \"https://lunaxstar.com/natal\", \"isPartOf\": {\"@type\": \"WebSite\", \"name\": \"LunaxStar\", \"url\": \"https://lunaxstar.com\"}}" }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeNatalFaqJsonLd(natalFaqs) }}
      />
      {children}
      <NatalSeoContent />
    </>
  );
}
