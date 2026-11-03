import type { Metadata } from "next";
import LanguageLanding from "@/components/LanguageLanding";

export const metadata: Metadata = {
  title: "LunaXStar - Free Birth Chart & BaZi Calculator",
  description:
    "Free birth chart and BaZi reading based on real astronomical calculations. Discover your soulmate timing, earning style, and life patterns. No signup required.",
  alternates: {
    canonical: "https://lunaxstar.com/en",
    languages: {
      "x-default": "https://lunaxstar.com/",
      en: "https://lunaxstar.com/en",
      id: "https://lunaxstar.com/id",
    },
  },
  openGraph: {
    title: "LunaXStar - Free Birth Chart & BaZi Calculator",
    description:
      "Free birth chart and BaZi reading based on real astronomical calculations. No signup required.",
    type: "website",
    url: "https://lunaxstar.com/en",
    siteName: "LunaXStar",
  },
};

export const dynamic = "force-static";

export default function EnglishLandingPage() {
  return <LanguageLanding lang="en" />;
}
