import type { Metadata } from "next";

export const SITE_ORIGIN = "https://lunaxstar.com";

export function siteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString().replace(/\/$/, path === "/" ? "" : "/");
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
