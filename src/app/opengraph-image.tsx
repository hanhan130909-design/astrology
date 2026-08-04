import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #171717 0%, #2d2d2d 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          星缘 · LunaX
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#a3a3a3",
            marginBottom: 40,
          }}
        >
          Free Western + Chinese Astrology · 8 Languages
        </div>

        {/* Zodiac symbols as text */}
        <div
          style={{
            display: "flex",
            gap: 12,
            color: "#525252",
            fontSize: 24,
          }}
        >
          {"Aries Taurus Gemini Cancer Leo Virgo Libra Scorpio Sagittarius Capricorn Aquarius Pisces"
            .split(" ")
            .map((s) => s[0])
            .join("  ")}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 18,
            color: "#525252",
          }}
        >
          lunaxstar.com
        </div>
      </div>
    ),
    { ...size }
  );
}
