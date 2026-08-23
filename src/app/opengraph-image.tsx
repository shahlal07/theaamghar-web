import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/queries/site-content";

// The link-preview card WhatsApp/Facebook/Twitter render when someone shares
// theaamghar. Previously missing entirely, so every share -- which is how
// this business actually spreads -- showed as a bare grey link.
//
// Generated rather than a static file so it always matches the brand and
// needs no design tooling to update. Text is admin-editable (site_content);
// swapping to a fully custom uploaded image is a possible future step but
// not needed to rebrand the wording/emoji here.
export const alt = "Site preview image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { brand, brandColors, siteMeta } = await getSiteContent();

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
          background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDeep} 55%, ${brandColors.secondary} 100%)`,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 140, display: "flex" }}>{brand.accentEmoji}</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 8, display: "flex" }}>
          {brand.logoText}
        </div>
        <div style={{ fontSize: 34, opacity: 0.95, marginTop: 12, display: "flex" }}>
          {siteMeta.ogSubtitle}
        </div>
        <div style={{ fontSize: 26, opacity: 0.85, marginTop: 24, display: "flex" }}>
          {siteMeta.ogTagline}
        </div>
      </div>
    ),
    size
  );
}
