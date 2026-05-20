# -*- coding: utf-8 -*-
"""Add JSON-LD schema to composite layout.tsx"""

content = '''import type { Metadata } from "next";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://lunaxstar.com/composite#webpage",
      "url": "https://lunaxstar.com/composite",
      "name": "Composite Chart Analysis - Relationship Astrology",
      "description": "Generate a free professional Composite Chart to analyze the shared astrology and dynamic patterns of a relationship.",
      "isPartOf": {
        "@id": "https://lunaxstar.com/#website"
      },
      "inLanguage": ["zh", "en", "id"]
    },
    {
      "@type": "FAQPage",
      "@id": "https://lunaxstar.com/composite#faqpage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the difference between composite and synastry charts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Synastry analyzes how two people's planets interact, while composite creates a virtual chart representing the relationship itself. Composite reveals overall energy; synastry shows specific interactions."
          }
        },
        {
          "@type": "Question",
          "name": "Which planet is most important in a composite chart?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Sun, Moon, and Ascendant are most important. The Sun represents relationship purpose, the Moon reveals emotional needs, and the Ascendant reflects how others perceive the relationship."
          }
        },
        {
          "@type": "Question",
          "name": "Can composite charts predict relationship outcomes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Composite charts reveal relationship energy rather than outcomes. They help you understand the relationship's essential characteristics and development direction."
          }
        },
        {
          "@type": "Question",
          "name": "Do challenging aspects in composite charts mean we must break up?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not necessarily. Challenging aspects indicate areas needing effort. Many long-term relationships have difficult aspects. The key is understanding and growing together."
          }
        },
        {
          "@type": "Question",
          "name": "How can I use composite charts to improve my relationship?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "After understanding the composite chart, leverage strengths while putting effort into challenging areas. If the Moon is afflicted, focus more on emotional expression."
          }
        }
      ]
    }
  ]
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
'''

with open('src/app/composite/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Composite layout updated successfully!')
