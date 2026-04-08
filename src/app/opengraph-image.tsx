import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Finance Guide — Free Budget Planner for India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a192f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top badge */}
        <div
          style={{
            background: "#64ffda",
            color: "#0a192f",
            padding: "8px 20px",
            borderRadius: "8px",
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "32px",
          }}
        >
          100% Free · Built for India
        </div>

        {/* Main heading */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "68px",
            fontWeight: "bold",
            lineHeight: 1.1,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          Plan Your Salary Smarter.
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: "#8892b0",
            fontSize: "30px",
            maxWidth: "800px",
            lineHeight: 1.4,
            marginBottom: "48px",
          }}
        >
          AI-powered budget planner for Indian households. Personalised results in under 2 minutes.
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              color: "#64ffda",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Finance Guide
          </div>
          <div style={{ color: "#4a5568", fontSize: "28px" }}>·</div>
          <div style={{ color: "#8892b0", fontSize: "24px" }}>
            finance-guide.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
