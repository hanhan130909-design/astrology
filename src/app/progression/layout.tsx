import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Vimshamsha Progression Analysis",
  description: "Use Vimshamsha astrology system to analyze life stage planetary cycles and fortune themes. AI interprets action themes and inner motivations of each life stage.",
  keywords: ["Vimshamsha", "progression", "secondary progression", "life stages", "AI progression"],
  openGraph: {
    title: "Free Vimshamsha Progression Analysis",
    description: "Use Vimshamsha astrology system to analyze life stage planetary cycles and fortune themes. AI interprets action themes and inner motivations of each life stage.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Vimshamsha Progression Analysis",
    description: "Use Vimshamsha astrology system to analyze life stage planetary cycles and fortune themes. AI interprets action themes and inner motivations of each life stage.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
