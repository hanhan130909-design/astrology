import type { Metadata } from "next";
import LanguageLanding, { LANGS } from "@/components/LanguageLanding";

export const metadata: Metadata = {
  title: "LunaXStar - Bagan Lahir & Kalkulator BaZi Gratis",
  description:
    "Bagan lahir dan BaZi gratis berbasis perhitungan astronomi nyata. Temukan waktu jodoh, gaya penghasilan, dan pola hidup Anda. Tanpa pendaftaran.",
  alternates: {
    canonical: "https://lunaxstar.com/id",
    languages: { ...LANGS },
  },
  openGraph: {
    title: "LunaXStar - Bagan Lahir & Kalkulator BaZi Gratis",
    description:
      "Bagan lahir dan BaZi gratis berbasis perhitungan astronomi nyata. Tanpa pendaftaran.",
    type: "website",
    url: "https://lunaxstar.com/id",
    siteName: "LunaXStar",
  },
};

export const dynamic = "force-static";

export default function IndonesianLandingPage() {
  return <LanguageLanding lang="id" />;
}
