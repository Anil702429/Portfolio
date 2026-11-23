import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/queries";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 300;

export default async function OpenGraphImage() {
  const settings = await getSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "#0f1a2e",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 108, fontWeight: 700 }}>{settings.name}</div>
        <div style={{ fontSize: 44, marginTop: 20, color: "#82b1ff" }}>{settings.professionalTitle}</div>
      </div>
    ),
    size,
  );
}
