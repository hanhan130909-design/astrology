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
  return children;
}
