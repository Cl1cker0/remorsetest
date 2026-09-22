import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Remorse. Play your way without limits. Premium digital products with instant delivery.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(
  join(process.cwd(), "public", "brand", "remorse-symbol.png"),
  "base64",
);
const logoSrc = `data:image/png;base64,${logoData}`;

export default function OpenGraphImage() {
  const dots = Array.from({ length: 88 }, (_, index) => {
    const column = index % 11;
    const row = Math.floor(index / 11);
    const distance = Math.abs(column - 5) + Math.abs(row - 3.5);
    return (
      <span
        key={index}
        style={{
          width: 5,
          height: 5,
          borderRadius: 999,
          background: "#ff0099",
          opacity: Math.max(0.08, 0.52 - distance * 0.055),
          marginRight: 25 + row * 2,
          marginBottom: 25 + Math.abs(column - 5) * 2,
        }}
      />
    );
  });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        color: "white",
        background:
          "radial-gradient(circle at 74% 48%, rgba(255,0,153,.16), transparent 34%), #050305",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -95,
          top: 6,
          width: 650,
          height: 650,
          display: "flex",
          flexWrap: "wrap",
          transform: "rotate(-9deg)",
        }}
      >
        {dots}
      </div>

      <div
        style={{
          position: "absolute",
          left: 30,
          top: 30,
          width: 1140,
          height: 570,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "46px 54px",
          border: "1px solid rgba(255,255,255,.13)",
          borderRadius: 32,
          background:
            "linear-gradient(135deg, rgba(255,255,255,.055), rgba(255,0,153,.018))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              border: "1px solid rgba(255,105,194,.28)",
              background: "rgba(255,0,153,.07)",
            }}
          >
            <img src={logoSrc} width={51} height={51} alt="" />
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 22,
              fontSize: 31,
              fontWeight: 700,
              letterSpacing: -1.2,
            }}
          >
            remorse<span style={{ color: "#ff4fba" }}>.dev</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 0.94,
              letterSpacing: -5.5,
            }}
          >
            <span>Play your way.</span>
            <span style={{ color: "#ff0099", marginTop: 14 }}>
              Without limits.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 27,
              color: "#c8bec4",
              fontSize: 23,
              letterSpacing: -0.3,
            }}
          >
            Premium digital products. Instant access.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#b9aeb5",
            fontSize: 17,
            letterSpacing: 2.4,
            textTransform: "uppercase",
          }}
        >
          Built for your next session
          <span
            style={{
              width: 86,
              height: 1,
              marginLeft: 20,
              background: "rgba(255,0,153,.5)",
            }}
          />
        </div>
      </div>
    </div>,
    size,
  );
}
