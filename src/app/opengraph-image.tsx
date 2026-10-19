import { ImageResponse } from "next/og";

export const alt = "Build Studio — Building exceptional homes, under one roof.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f1eee8",
          color: "#17181a",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 22, letterSpacing: 6 }}>
          <svg width="48" height="48" viewBox="0 0 40 40">
            <g fill="none" stroke="#17181a" strokeWidth="3.2">
              <path d="M35 4.5H5V20h30v15.5H5" />
              <path d="M13 12.25h22M5 27.75h22" />
            </g>
          </svg>
          BUILD STUDIO
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, letterSpacing: -2 }}>
          <span>Building exceptional homes,</span>
          <span style={{ color: "#a63d24" }}>under one roof.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#615e58", letterSpacing: 3 }}>
          <span>CONSTRUCTION · PROJECT MANAGEMENT · QUANTITY SURVEYING</span>
          <span>CO. MEATH</span>
        </div>
      </div>
    ),
    size,
  );
}
