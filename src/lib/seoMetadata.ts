import type { Metadata } from "next";

export const SITE_ORIGIN = "https://lunaxstar.com";

/** Normalizes a site-relative route, dropping query/hash/trailing slashes and rejecting origin changes. */
export function siteUrl(path: string): string {
  const input = path.trim();

  // Route metadata accepts paths only so callers cannot replace the site origin.
  if (/^[a-z][a-z\d+.-]*:/i.test(input) || input.startsWith("//")) {
    throw new TypeError("siteUrl accepts site-relative paths only");
  }

  const candidate = input.startsWith("/") ? input : `/${input}`;
  const url = new URL(candidate || "/", SITE_ORIGIN);

  if (url.origin !== SITE_ORIGIN) {
    throw new TypeError("siteUrl path must resolve within the site origin");
  }

  url.search = "";
  url.hash = "";

  const pathname = url.pathname.replace(/\/+$/, "");
  return pathname ? `${SITE_ORIGIN}${pathname}` : SITE_ORIGIN;
}

type PageMetadataInput = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
};

export function createPageMetadata({
  path,
  title,
  description,
  keywords = [],
  type = "website",
}: PageMetadataInput): Metadata {
  const canonical = siteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      siteName: "LunaXStar",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const homeMetadata = createPageMetadata({
  path: "/",
  title: "Free Birth Chart & BaZi Calculator | LunaXStar",
  description: "Create a free Western birth chart or BaZi chart with real astronomical calculations. No signup required.",
  keywords: ["free birth chart", "natal chart calculator", "BaZi calculator", "astrology chart"],
});

export const natalMetadata = createPageMetadata({
  path: "/natal",
  title: "Free Birth Chart Calculator - Natal Chart Analysis",
  description: "Generate a free professional natal chart with planets, houses, aspects, and traditional techniques. No signup required.",
  keywords: ["free birth chart", "natal chart calculator", "astrology chart", "rising sign calculator"],
});

export const solarReturnMetadata = createPageMetadata({
  path: "/solar-return",
  title: "Free Solar Return Chart Calculator (2026) - No Sign Up",
  description: "Generate a free professional Solar Return chart to analyze astrological themes for your personal new year. AI interprets fortune themes for the year ahead.",
  keywords: ["solar return", "birthday astrology", "yearly chart", "AI solar return"],
});

export const baziMetadata = createPageMetadata({
  path: "/bazi",
  title: "Free BaZi Calculator - Four Pillars Chart & Luck Cycles",
  description: "Generate a free BaZi Four Pillars chart with Ten Gods, Five Elements, and 10-year luck cycles. No signup required.",
  keywords: ["BaZi calculator", "Four Pillars chart", "Chinese astrology", "luck cycles"],
});

export const transitsMetadata = createPageMetadata({
  path: "/transits",
  title: "Astrology Calendar - Moon Phases, Retrogrades & Transits",
  description: "Monthly astrology calendar for planetary ingresses, moon phases, retrogrades, direct stations, and major aspects.",
  keywords: ["星象日历", "astrology calendar", "moon phases", "planetary ingress", "retrograde"],
});

export const tarotMetadata = createPageMetadata({
  path: "/tarot",
  title: "Free Online Tarot Reading - No Sign Up",
  description: "Free online AI-powered tarot card reading. Draw tarot cards with various layouts and get guidance for love, career, and growth.",
  keywords: ["tarot reading", "free tarot", "AI tarot", "tarot cards", "online tarot"],
});

export const compatibilityMetadata = createPageMetadata({
  path: "/compatibility",
  title: "Free Astrology Compatibility Calculator - Synastry & Zodiac",
  description: "Compare two birth charts and analyze relationship dynamics, love compatibility, friendship, and astrological synastry for free.",
  keywords: ["compatibility", "synastry", "zodiac compatibility", "relationship astrology", "couple chart", "love match", "astrology compatibility", "free compatibility"],
});

export const blogMetadata = createPageMetadata({
  path: "/blog",
  title: "Astrology Guides - Birth Charts, BaZi & Timing Techniques",
  description: "Learn astrology with practical guides to birth charts, BaZi, planetary transits, zodiac compatibility, and timing techniques.",
  keywords: ["astrology guides", "birth chart", "BaZi", "planetary transits", "zodiac compatibility"],
});
