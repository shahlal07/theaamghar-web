"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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
// same "resync without setState-in-effect" pattern as hero-section.tsx.
function getServerSnapshot() {
  return false;
}

// Defers the actual video fetch until the player is about to enter the
// viewport (rootMargin gives it a head start so it's ready by the time it's
// visible) rather than downloading on initial page load like a plain
// autoplay <video> would -- keeps this section off the critical path.
//
// On mobile (~95% of this store's traffic), autoplaying video is skipped
// entirely in favor of a static still frame -- these source videos run
// 15-16MB, versus well under 100KB for a compressed frame. Same
// device-aware split as HeroSection, just applied to a second video.
export function LazyVideo({
  src,
  mobileVideoSrc,
  desktopImageSrc,
  mobileImageSrc,
  mobileOnly,
  className,
}: {
  src: string;
  // Portrait-cut video for mobile, opt-in -- see SiteContent.storyBanner
  // .mobileVideoUrl's comment. Falls back to the desktop `src` on mobile
  // when neither this nor mobileImageSrc is set (unchanged legacy
  // behavior), otherwise a mobile image takes priority over the desktop
  // video the same way it always has.
  mobileVideoSrc?: string;
  // Static desktop fallback (used when there's no desktop video) -- without
  // this, desktop had no way to show a still image at all; it either played
  // the video or fell through to mobileImageSrc/gradient.
  desktopImageSrc?: string;
  mobileImageSrc?: string;
  // See SiteContent.storyBanner.mobileOnly's comment -- when true and there's
  // no video, desktop shows this wrapper's own gradient background instead
  // of stretching a mobile-resolution image full-bleed.
  mobileOnly?: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const activeVideoSrc = isDesktop ? src : mobileVideoSrc || (!mobileImageSrc ? src : undefined);
  const showVideo = Boolean(activeVideoSrc);
  const activeImageSrc = isDesktop ? desktopImageSrc || (mobileOnly ? undefined : mobileImageSrc) : mobileImageSrc;
  const showImage = !showVideo && Boolean(activeImageSrc);

  useEffect(() => {
    if (!showVideo) return;
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showVideo]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden bg-gradient-to-br from-orchard-green to-mango-deep ${className ?? ""}`}>
      {showVideo ? (
        shouldLoad && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={activeVideoSrc} type="video/mp4" />
          </video>
        )
      ) : (
        showImage && (
          <Image
            src={activeImageSrc!}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )
      )}
    </div>
  );
}
