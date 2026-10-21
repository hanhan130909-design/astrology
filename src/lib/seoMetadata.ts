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
  title: "Find Your Soulmate Window & Money Pattern | Free Birth Chart",
  description: "Discover your soulmate timing, natural earning style, and hidden life patterns with a free birth chart and BaZi reading. Based on real astronomical calculations. No signup required.",
  keywords: ["free birth chart", "soulmate astrology", "money pattern", "BaZi calculator", "natal chart", "career astrology"],
});

export const natalMetadata = createPageMetadata({
  path: "/natal",
  title: "Free Birth Chart: Discover Your Soulmate Pattern & Life Path",
  description: "Generate a free professional natal chart to discover your soulmate pattern, career direction, and hidden life themes. Includes planets, houses, aspects, and AI-powered interpretation. No signup required.",
  keywords: ["free birth chart", "natal chart calculator", "soulmate astrology", "rising sign", "astrology chart", "life path"],
});

export const solarReturnMetadata = createPageMetadata({
  path: "/solar-return",
  title: "Free Solar Return Chart Calculator (2026) - No Sign Up",
  description: "Generate a free professional Solar Return chart to analyze astrological themes for your personal new year. AI interprets fortune themes for the year ahead.",
  keywords: ["solar return", "birthday astrology", "yearly chart", "AI solar return"],
});

export const baziMetadata = createPageMetadata({
  path: "/bazi",
  title: "Free BaZi Calculator: Find Your Money Style & Career Path",
  description: "Generate a free BaZi Four Pillars chart to discover your Day Master, natural earning style, best career direction, and 10-year luck cycles. Chinese astrology made simple. No signup required.",
  keywords: ["BaZi calculator", "Four Pillars", "Day Master", "money style", "career astrology", "Chinese astrology", "luck cycles"],
});

export const transitsMetadata = createPageMetadata({
  path: "/transits",
  title: "Astrology Calendar - Moon Phases, Retrogrades & Transits",
  description: "Monthly astrology calendar for planetary ingresses, moon phases, retrogrades, direct stations, and major aspects.",
  keywords: ["星象日历", "astrology calendar", "moon phases", "planetary ingress", "retrograde"],
});

export const tarotMetadata = createPageMetadata({
  path: "/tarot",
  title: "Free Tarot Reading: What's Coming Next In Your Love & Career",
  description: "Free online AI-powered tarot card reading. Draw cards for love, career, and personal growth. Get clear guidance on what's coming next and what to do about it. No signup required.",
  keywords: ["tarot reading", "free tarot", "love tarot", "career tarot", "AI tarot", "tarot cards", "online tarot"],
});

export const compatibilityMetadata = createPageMetadata({
  path: "/compatibility",
  title: "Free Compatibility Test: Are You With The Right Person?",
  description: "Compare two birth charts and discover your true compatibility. Find out if you're with the right person, what your core conflicts are, and whether this relationship can last. Free synastry analysis. No signup required.",
  keywords: ["compatibility test", "synastry", "zodiac compatibility", "relationship astrology", "couple chart", "love match", "are we compatible", "free compatibility"],
});

export const blogMetadata = createPageMetadata({
  path: "/blog",
  title: "Astrology Guides - Birth Charts, BaZi & Timing Techniques",
  description: "Learn astrology with practical guides to birth charts, BaZi, planetary transits, zodiac compatibility, and timing techniques.",
  keywords: ["astrology guides", "birth chart", "BaZi", "planetary transits", "zodiac compatibility"],
});
