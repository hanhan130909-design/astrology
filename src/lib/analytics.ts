export const ANALYTICS_EVENT_NAMES = [
  "birth_form_start",
  "chart_generated",
  "chart_generation_error",
  "chart_shared",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

type AnalyticsParams = Partial<Record<
  "chart_type" | "house_system" | "share_method" | "error_category",
  string
>>;

const ALLOWED_FIELDS: Record<AnalyticsEventName, readonly (keyof AnalyticsParams)[]> = {
  birth_form_start: ["chart_type", "house_system"],
  chart_generated: ["chart_type", "house_system"],
  chart_generation_error: ["chart_type", "house_system", "error_category"],
  chart_shared: ["chart_type", "share_method"],
};

const ALLOWED_VALUES: Partial<Record<keyof AnalyticsParams, ReadonlySet<string>>> = {
  chart_type: new Set(["natal", "solar_return"]),
  share_method: new Set(["copy_link", "download_image", "native_share"]),
  error_category: new Set(["api_error", "network_error", "invalid_response"]),
};

export function sanitizeAnalyticsEvent(
  name: unknown,
  params: unknown,
): { name: AnalyticsEventName; params: AnalyticsParams } | null {
  if (typeof name !== "string" || !ANALYTICS_EVENT_NAMES.includes(name as AnalyticsEventName)) {
    return null;
  }
  if (!params || typeof params !== "object" || Array.isArray(params)) return null;

  const eventName = name as AnalyticsEventName;
  const input = params as Record<string, unknown>;
  const sanitized: AnalyticsParams = {};
  for (const field of ALLOWED_FIELDS[eventName]) {
    const value = input[field];
    if (typeof value !== "string" || value.length === 0 || value.length > 40) continue;
    const allowedValues = ALLOWED_VALUES[field];
    if (allowedValues && !allowedValues.has(value)) return null;
    sanitized[field] = value;
  }

  return { name: eventName, params: sanitized };
}

export function trackAnalyticsEvent(name: AnalyticsEventName, params: AnalyticsParams): boolean {
  const event = sanitizeAnalyticsEvent(name, params);
  if (!event || typeof window === "undefined") return false;

  const gtag = (window as typeof window & {
    gtag?: (...args: unknown[]) => void;
  }).gtag;
  if (typeof gtag !== "function") return false;

  gtag("event", event.name, event.params);
  return true;
}
