import { ImageResponse } from "next/og";

export const runtime = 'edge';
export const alt = 'LunaXStar — Find Your Soulmate Pattern';
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
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #2a2a5e 100%)",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              color: "#1a1a2e",
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: "28px", color: "#fbbf24", letterSpacing: "6px", fontWeight: "bold" }}>
            LUNAXSTAR
          </span>
        </div>

        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#f8fafc",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "28px",
            maxWidth: "1000px",
          }}
        >
          Who Is Your
          <br />
          <span style={{ color: "#fbbf24" }}>Soulmate?</span>
        </h1>

        <p
          style={{
            fontSize: "30px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.5,
            marginBottom: "48px",
          }}
        >
          Your Birth Chart Reveals The Pattern — Free Reading in 2 Minutes
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "16px 40px",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            borderRadius: "50px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1a1a2e",
          }}
        >
          Get Your Free Chart →
        </div>
      </div>
    ),
    { ...size }
  );
}
