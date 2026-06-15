import assert from "node:assert/strict";
import {
  normalizeBirthProfile,
  saveLatestBirthProfile,
  loadLatestBirthProfile,
  LATEST_BIRTH_PROFILE_KEY,
} from "../src/lib/latestBirthProfile.js";

function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

const profile = normalizeBirthProfile({
  name: "han",
  year: 1986,
  month: 11,
  day: 14,
  hour: 18,
  minute: 33,
  lat: 41 + 40 / 60,
  lng: 123 + 21 / 60,
  tz: 480,
  hsys: "B",
  city: "沈阳",
});

assert.equal(profile.year, 1986);
assert.equal(profile.month, 11);
assert.equal(profile.day, 14);
assert.equal(profile.hour, 18);
assert.equal(profile.minute, 33);
assert.equal(profile.tz, 8);
assert.equal(profile.houseSystem, "B");
assert.equal(profile.city, "沈阳");

const apiShape = normalizeBirthProfile({
  year: 1991,
  month: 2,
  day: 3,
  hour: 4,
  minute: 5,
  latitude: -6.2,
  longitude: 106.8,
  timezone: 7,
  houseSystem: "P",
});
assert.equal(apiShape.lat, -6.2);
assert.equal(apiShape.lng, 106.8);
assert.equal(apiShape.tz, 7);
assert.equal(apiShape.houseSystem, "P");

assert.equal(normalizeBirthProfile({ year: "bad" }), null);

const storage = createMemoryStorage();
saveLatestBirthProfile(profile, storage);
const raw = JSON.parse(storage.getItem(LATEST_BIRTH_PROFILE_KEY));
assert.equal(raw.tz, 8);
assert.equal(raw.houseSystem, "B");

const loaded = loadLatestBirthProfile(storage);
assert.deepEqual(loaded, raw);

console.log("latest birth profile tests passed");
