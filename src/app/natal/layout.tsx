import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Natal Chart Analysis - Birth Chart Calculator",
  description: "Generate your free professional natal chart based on real astronomical calculations. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.",
  keywords: ["natal chart", "birth chart", "astrology chart", "free natal", "AI natal"],
  openGraph: {
    title: "Free Natal Chart Analysis - Birth Chart Calculator",
    description: "Generate your free professional natal chart based on real astronomical calculations. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Natal Chart Analysis - Birth Chart Calculator",
    description: "Generate your free professional natal chart based on real astronomical calculations. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.",
  },
};

export default function NatalLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <>
            <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"WebPage\", \"name\": \"Free Natal Chart Analysis - Birth Chart Calculator\", \"description\": \"Generate your free professional natal chart based on real astronomical calculations. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.\", \"url\": \"https://lunaxstar.com/natal\", \"isPartOf\": {\"@type\": \"WebSite\", \"name\": \"LunaxStar\", \"url\": \"https://lunaxstar.com\"}}" }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"What is a natal chart?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"A natal chart is an astronomical map calculated from your exact birth time, date, and location, showing the positions of all planets and houses at that moment. It serves as your cosmic blueprint, revealing personality traits and life directions.\"}}, {\"@type\": \"Question\", \"name\": \"How accurate is a natal chart?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Natal charts are calculated using real astronomical data, including the Swiss Ephemeris. The more precise your birth time, the more accurate the analysis \\u2014 especially for the Ascendant and house divisions which are very time-sensitive.\"}}, {\"@type\": \"Question\", \"name\": \"What is the difference between Rising sign and Sun sign?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Your Sun sign is where the Sun was at birth, representing your core self. Your Rising sign (Ascendant) is the zodiac sign rising on the eastern horizon at birth, representing your outward persona and first impressions.\"}}, {\"@type\": \"Question\", \"name\": \"How do I read aspects in a natal chart?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Aspects are angular relationships between planets, including conjunction, sextile, square, trine, and opposition. Harmonious aspects bring talents and flowing energy, while challenging aspects bring growth through tension.\"}}, {\"@type\": \"Question\", \"name\": \"What do houses represent in a natal chart?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"The twelve houses represent different life areas: the 1st house is self-image, the 7th is partnerships, the 10th is career. Planets in different houses influence how you experience those life domains.\"}}, {\"@type\": \"Question\", \"name\": \"What if I don't know my exact birth time?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"If unsure, use noon as default. However, the Ascendant and house placements may be inaccurate. For the most complete analysis, try to obtain your accurate birth time from birth records.\"}}, {\"@type\": \"Question\", \"name\": \"Can a natal chart predict the future?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"A natal chart itself doesn't predict the future directly \\u2014 it reveals your innate gifts, challenges, and life patterns. Combined with transit charts, you can understand current energy trends and potential opportunities.\"}}]}" }}
      />
      {children}
    </>
  );
}
