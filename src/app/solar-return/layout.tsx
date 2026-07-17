import { solarReturnMetadata } from "@/lib/seoMetadata";
import { solarReturnFaqs } from "@/components/solarReturnFaq";

export const metadata = solarReturnMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: solarReturnFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }).replace(/</g, "\\u003c");

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
