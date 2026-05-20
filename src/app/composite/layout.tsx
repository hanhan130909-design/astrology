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
            name: "Composite Chart Analysis",
            description: "The Composite Chart reveals the soul blueprint of a relationship. By calculating midpoints between two natal charts, understand deep dynamics and potential challenges with AI-powered advice.",
            provider: { "@type": "Organization", name: "星缘", url: "https://lunaxstar.com" }
          })
        }}
      />
      {children}
    </>
  );
}
