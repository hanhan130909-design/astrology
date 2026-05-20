import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Lunar Return Chart Analysis",
  description: "Generate a free professional Lunar Return chart to analyze astrological themes and influences for the upcoming year. AI interprets fortune themes and opportunities.",
  keywords: ["lunar return", "solar return", "birthday chart", "yearly forecast", "AI lunar return"],
  openGraph: {
    title: "Free Lunar Return Chart Analysis",
    description: "Generate a free professional Lunar Return chart to analyze astrological themes and influences for the upcoming year. AI interprets fortune themes and opportunities.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Lunar Return Chart Analysis",
    description: "Generate a free professional Lunar Return chart to analyze astrological themes and influences for the upcoming year. AI interprets fortune themes and opportunities.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
