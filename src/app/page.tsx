import HomePageClient from "@/components/HomePageClient";
import { createPageMetadata } from "@/lib/seoMetadata";

export const metadata = createPageMetadata({
  path: "/",
  title: "Free Birth Chart & BaZi Calculator | LunaXStar",
  description: "Create a free Western birth chart or BaZi chart with real astronomical calculations. No signup required.",
  keywords: ["free birth chart", "natal chart calculator", "BaZi calculator", "astrology chart"],
});

export default function HomePage() {
  return <HomePageClient />;
}
