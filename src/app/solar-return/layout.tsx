import { solarReturnMetadata } from "@/lib/seoMetadata";
import {
  serializeSolarReturnFaqJsonLd,
  solarReturnFaqs,
} from "@/components/solarReturnFaq";

export const metadata = solarReturnMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqJsonLd = serializeSolarReturnFaqJsonLd(solarReturnFaqs);

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
    </>
  );
}
