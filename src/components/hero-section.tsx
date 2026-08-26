"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { FloatingMangoes } from "@/components/floating-mangoes";

const DESKTOP_QUERY = "(min-width: 768px)";
function subscribe(callback: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}
// Server (and first client paint) always renders the mobile snapshot --
// same "resync without setState-in-effect" pattern as theme-toggle.tsx.
function getServerSnapshot() {
  return false;
}

interface HeroSectionProps {
  videoSrc: string;
  mobileImageSrc: string;
  desktopImageSrc?: string;
  // See SiteContent.hero.mobileOnly's comment -- when true, desktop never
  // falls back to mobileImageSrc even without a desktopImageSrc/video (the
  // mobile asset is assumed too low-resolution to blow up full-bleed).
  mobileOnly?: boolean;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  accentEmoji?: string;
}

// Full-height hero shown immediately -- no scroll-to-reveal interaction.
// Desktop gets the autoplaying video when one's configured; mobile gets a
// static still frame from that same video (extracted once, not a separate
// photoshoot) so it never downloads the video at all. Vendors with no video
// asset (photo-only businesses) fall back to a static image on both
// breakpoints instead of an empty <video> tag.
export function HeroSection({ videoSrc, mobileImageSrc, desktopImageSrc, mobileOnly, title, subtitle, children, accentEmoji }: HeroSectionProps) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const showVideo = isDesktop && Boolean(videoSrc);
  const imageSrc = isDesktop ? desktopImageSrc || (mobileOnly ? undefined : mobileImageSrc) : mobileImageSrc;

  return (
    <section
      // h-screen (100vh) includes the mobile browser's address/toolbar
      // chrome in its calculation, which isn't actually visible viewport --
      // the hero rendered taller than the real screen, so it looked cut
      // off/"not adjusted" and jumped as the chrome showed/hid on scroll.
      // The inline style's 100svh (small viewport height -- sized to the
      // space that's always visible) wins over the class when supported; an
      // unsupported unit is simply not applied, so the h-screen class's
      // 100vh remains as the fallback on older browsers.
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black"
      style={{ height: "100svh" }}
      aria-label="Hero"
    >
      {showVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        // No video and no image set for this vendor (or breakpoint) --
        // a gradient background, same fallback pattern as LazyVideo's story
        // banner, rather than ever falling through to a shared default
        // image that would actually belong to a different vendor.
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-orchard-green)] to-[var(--color-mango-deep)]" />
      )}
      <div className="absolute inset-0 bg-black/45" />
      <FloatingMangoes emoji={accentEmoji} />
      <div className="relative z-[2] flex h-full flex-col items-center justify-center px-[5%] text-center">
        <h1 className="font-serif text-4xl font-bold leading-tight text-white drop-shadow-md md:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-xl text-lg text-white/90 drop-shadow-sm">{subtitle}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
