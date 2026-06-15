export const LATEST_BIRTH_PROFILE_KEY = "astro_latest_birth_profile";

function numberOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeTimezone(value) {
  const n = numberOrNull(value);
  if (n == null) return null;
  return Math.abs(n) > 24 ? n / 60 : n;
}

export function normalizeBirthProfile(input) {
  if (!input || typeof input !== "object") return null;
  const year = numberOrNull(input.year);
  const month = numberOrNull(input.month);
  const day = numberOrNull(input.day);
  const hour = numberOrNull(input.hour);
  const minute = numberOrNull(input.minute);
  const lat = numberOrNull(input.lat ?? input.latitude);
  const lng = numberOrNull(input.lng ?? input.longitude);
  const tz = normalizeTimezone(input.tz ?? input.timezone);

  if ([year, month, day, hour, minute, lat, lng, tz].some(v => v == null)) {
    return null;
  }

  return {
    name: input.name || "Quick Chart",
    year: Math.trunc(year),
    month: Math.trunc(month),
    day: Math.trunc(day),
    hour: Math.trunc(hour),
    minute: Math.trunc(minute),
    lat,
    lng,
    tz,
    houseSystem: input.houseSystem || input.hsys || "B",
    city: input.city || input.cityName || "",
    savedAt: Number(input.savedAt) || Date.now(),
  };
}

function browserStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
}

export function saveLatestBirthProfile(input, storage = browserStorage()) {
  const profile = normalizeBirthProfile(input);
  if (!profile || !storage) return null;
  storage.setItem(LATEST_BIRTH_PROFILE_KEY, JSON.stringify({ ...profile, savedAt: Date.now() }));
  return profile;
}

export function loadLatestBirthProfile(storage = browserStorage()) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(LATEST_BIRTH_PROFILE_KEY);
    if (!raw) return null;
    return normalizeBirthProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function profileToBirthData(profile) {
  const p = normalizeBirthProfile(profile);
  if (!p) return null;
  return {
    year: p.year,
    month: p.month,
    day: p.day,
    hour: p.hour,
    minute: p.minute,
    lat: p.lat,
    lng: p.lng,
    tz: p.tz,
  };
}
