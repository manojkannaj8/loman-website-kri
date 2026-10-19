import { ImageResponse } from "next/og";

export const alt = "Build Studio: Building exceptional homes, under one roof.";
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
          background: "#1e242c",
          color: "#ece7df",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 22, letterSpacing: 6 }}>
          <svg width="44" height="50" viewBox="0 0 64 72">
            <g fill="none" stroke="#f2b872" strokeWidth="6.75">
              <path d="M60.6 18V3.4H3.4V34.5H43.5" />
              <path d="M53 34.5H60.6V68.6H3.4V52" />
              <path d="M41 34.5L45.5 30V21.5H17V53H45.5V39Z" />
            </g>
          </svg>
          BUILD STUDIO
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, letterSpacing: -2 }}>
          <span>Building exceptional homes,</span>
          <span style={{ color: "#f2b872" }}>under one roof.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#a9b4c2", letterSpacing: 3 }}>
          <span>CONSTRUCTION · PROJECT MANAGEMENT · QUANTITY SURVEYING</span>
          <span>CO. MEATH</span>
        </div>
      </div>
    ),
    size,
  );
}
