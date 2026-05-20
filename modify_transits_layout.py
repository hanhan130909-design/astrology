# -*- coding: utf-8 -*-
"""Add JSON-LD schema to transits layout.tsx"""

content = '''import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Transit Chart Analysis - Planetary Transit Calculator",
  description: "Generate a free professional transit chart tracking planetary transits affecting your natal chart. AI-powered analysis reveals fortune turning points.",
  keywords: ["transit chart", "planetary transit", "transit analysis", "AI transit"],
  openGraph: {
    title: "Free Transit Chart Analysis - Planetary Transit Calculator",
    description: "Generate a free professional transit chart tracking planetary transits affecting your natal chart. AI-powered analysis reveals fortune turning points.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Transit Chart Analysis - Planetary Transit Calculator",
    description: "Generate a free professional transit chart tracking planetary transits affecting your natal chart. AI-powered analysis reveals fortune turning points.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://lunaxstar.com/transits#webpage",
      "url": "https://lunaxstar.com/transits",
      "name": "Free Transit Chart Analysis - Planetary Transit Calculator",
      "description": "Generate a free professional transit chart tracking planetary transits affecting your natal chart. AI-powered analysis reveals fortune turning points.",
      "isPartOf": {
        "@id": "https://lunaxstar.com/#website"
      },
      "inLanguage": ["zh", "en", "id"]
    },
    {
      "@type": "FAQPage",
      "@id": "https://lunaxstar.com/transits#faqpage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How often should I check my transits?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We recommend checking major planetary transits monthly and doing a comprehensive transit analysis yearly. Checking transits before big decisions helps you choose optimal timing."
          }
        },
        {
          "@type": "Question",
          "name": "Which planetary transits have the greatest impact?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Saturn and Jupiter transits are most significant. Saturn completes a cycle in about 29 years, Jupiter in about 12 years - their aspect changes mark important life turning points."
          }
        },
        {
          "@type": "Question",
          "name": "What do conjunction, square, and trine aspects mean in transits?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Conjunctions represent energy fusion and new cycle beginnings; squares bring challenges and growth opportunities; trines provide smooth supportive energy."
          }
        },
        {
          "@type": "Question",
          "name": "Can transit analysis predict specific events?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Transits reveal energy trends rather than specific events. They tell you when to act and when to be cautious, but specific outcomes depend on personal choices."
          }
        },
        {
          "@type": "Question",
          "name": "How can I use transits to improve my life?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "After understanding current transit energies, act during favorable periods and conserve energy during challenging times. Expand during Jupiter transits, build steadily during Saturn transits."
          }
        }
      ]
    }
  ]
};

export default function TransitsLayout({
  children,
}: {
  children: React.ReactNode,
}) {
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

with open('src/app/transits/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Transits layout updated successfully!')
