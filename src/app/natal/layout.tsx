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
  return children;
}
