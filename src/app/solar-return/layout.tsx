import { createPageMetadata } from "@/lib/seoMetadata";

export const metadata = createPageMetadata({
  path: "/solar-return",
  title: "Free Solar Return Chart Calculator (2026) - No Sign Up",
  description: "Generate a free professional Solar Return chart to analyze astrological themes for your personal new year. AI interprets fortune themes for the year ahead.",
  keywords: ["solar return", "birthday astrology", "yearly chart", "AI solar return"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
