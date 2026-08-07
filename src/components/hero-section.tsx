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
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

// Full-height hero shown immediately -- no scroll-to-reveal interaction.
// Desktop gets the autoplaying video; mobile gets a static still frame from
// that same video (extracted once, not a separate photoshoot) so it never
// downloads the video at all.
export function HeroSection({ videoSrc, mobileImageSrc, title, subtitle, children }: HeroSectionProps) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <section
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black"
      aria-label="From our orchards to your doorstep"
    >
      {isDesktop ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={mobileImageSrc}
          alt="Ripe mangoes hanging in our orchard"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/45" />
      <FloatingMangoes />
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
