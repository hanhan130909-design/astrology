import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Composite Chart Analysis - Relationship Astrology",
  description: "Generate a free professional Composite Chart to analyze the shared astrology and dynamic patterns of a relationship. AI deeply interprets relationship qualities.",
  keywords: ["composite chart", "composite", "relationship astrology", "shared chart", "AI composite"],
  openGraph: {
    title: "Composite Chart Analysis - Relationship Astrology",
    description: "Generate a free professional Composite Chart to analyze the shared astrology and dynamic patterns of a relationship. AI deeply interprets relationship qualities.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Composite Chart Analysis - Relationship Astrology",
    description: "Generate a free professional Composite Chart to analyze the shared astrology and dynamic patterns of a relationship. AI deeply interprets relationship qualities.",
  },
};




export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Composite Chart Analysis - Relationship Astrology",
            "description": "Generate a free professional Composite Chart to analyze the shared astrology and dynamic patterns of a relationship. AI deeply interprets relationship qualities.",
            "url": "https://lunaxstar.com/composite",
            "isPartOf": {"@type": "WebSite", "name": "LunaxStar", "url": "https://lunaxstar.com"},
            " BreadcrumbList": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://lunaxstar.com"},
                {"@type": "ListItem", "position": 2, "name": "Composite Chart", "item": "https://lunaxstar.com/composite"}
              ]
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "LunaxStar Composite Chart Calculator",
            "applicationCategory": "UtilityApplication, EducationApplication",
            "operatingSystem": "Web Browser",
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
            "description": "Free AI-powered composite chart calculator for relationship astrology. Compare two natal charts to reveal deep dynamics and shared patterns.",
            "url": "https://lunaxstar.com/composite",
            "author": {"@type": "Organization", "name": "LunaxStar", "url": "https://lunaxstar.com"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a composite chart?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A composite chart is a midpoints chart calculated between two natal charts. It represents the 'third entity' of the relationship itself, revealing the shared energy, core purpose, and developmental potential of the connection."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between Composite and Synastry?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Composite charts calculate midpoints to create a new chart representing the relationship. Synastry overlays two natal charts to show how each person's planets interact with the other's signs and houses. Both reveal different dimensions of connection."
                }
              },
              {
                "@type": "Question",
                "name": "What does the Composite Midheaven indicate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Composite Midheaven (Medium Coeli) represents the shared public image and life direction of the relationship. It shows how the partnership is seen by the outside world and its shared ambitions and goals."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate are composite chart interpretations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Composite charts are mathematically precise using astronomical algorithms. The AI-powered interpretation provides nuanced analysis based on the exact positions. For best results, use accurate birth times from both partners."
                }
              },
              {
                "@type": "Question",
                "name": "Can composite charts predict relationship outcomes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Composite charts reveal the inherent nature and potential of a relationship, including strengths and challenges. They do not predict outcomes with certainty but provide insights into the relationship's core dynamics and growth opportunities."
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
