"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Adds noindex meta tag for non-English pages to concentrate SEO weight on English content.
 * Googlebot sees default English (no localStorage), so English pages are indexable.
 * Users who manually switch to other languages get noindex to avoid duplicate content issues.
 */
export default function LanguageNoIndex() {
  const { language } = useLanguage();

  useEffect(() => {
    const META_ID = "language-noindex-meta";

    // Remove existing meta first
    const existing = document.getElementById(META_ID);
    if (existing) existing.remove();

    // Add noindex for non-English languages
    if (language !== "en") {
      const meta = document.createElement("meta");
      meta.id = META_ID;
      meta.name = "robots";
      meta.content = "noindex, follow";
      document.head.appendChild(meta);
    }
  }, [language]);

  return null;
}
