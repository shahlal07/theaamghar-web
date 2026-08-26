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
  mobileImageSrc,
  mobileOnly,
  className,
}: {
  src: string;
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
  const showVideo = Boolean(src) && (isDesktop || !mobileImageSrc);
  const showImage = !showVideo && Boolean(mobileImageSrc) && !(mobileOnly && isDesktop);

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
            <source src={src} type="video/mp4" />
          </video>
        )
      ) : (
        showImage && (
          <Image
            src={mobileImageSrc!}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 0px"
            className="object-cover"
          />
        )
      )}
    </div>
  );
}
