import type { Metadata } from "next";

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
            name: "Transit Chart Analysis",
            description: "The Transit Chart is a core tool for astrological forecasting. By overlaying current planetary positions onto your natal chart, understand present energy influences and future turning points.",
            provider: { "@type": "Organization", name: "星缘", url: "https://lunaxstar.com" }
          })
        }}
      />
      {children}
    </>
  );
}
