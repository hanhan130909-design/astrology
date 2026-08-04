// GA4 event tracking utilities
// Call these from client components to track user interactions

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Pre-built event trackers
export const Analytics = {
  // CTA clicks
  ctaClick(button: string, page: string) {
    trackEvent("cta_click", { button, page });
  },

  // Feature card clicks
  featureClick(feature: string) {
    trackEvent("feature_click", { feature });
  },

  // Blog article views
  blogView(slug: string, category: string) {
    trackEvent("blog_view", { slug, category });
  },

  // Search usage
  searchQuery(query: string, resultCount: number) {
    trackEvent("search", { query, result_count: resultCount });
  },

  // Login/register
  authStart(method: "email_code" | "password" | "google") {
    trackEvent("auth_start", { method });
  },
  authComplete(method: "email_code" | "password" | "google") {
    trackEvent("auth_complete", { method });
  },

  // Chart generation
  chartGenerated(type: "natal" | "bazi" | "qimen") {
    trackEvent("chart_generated", { type });
  },

  // Page engagement
  pageEngaged(page: string, timeOnPage: number) {
    trackEvent("page_engaged", { page, time_seconds: Math.round(timeOnPage) });
  },

  // Community actions
  communityPost() {
    trackEvent("community_post");
  },
  communityLike() {
    trackEvent("community_like");
  },

  // Pricing views
  pricingView() {
    trackEvent("pricing_view");
  },
  pricingClick(product: string) {
    trackEvent("pricing_click", { product });
  },

  // Language switch
  languageSwitch(lang: string) {
    trackEvent("language_switch", { language: lang });
  },
};
