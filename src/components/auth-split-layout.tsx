import Image from "next/image";
import { FloatingMangoes } from "@/components/floating-mangoes";

// Split-screen shell shared by /login and /signup so both feel like part of
// the same brand experience as the homepage hero instead of a bare form on
// white.
//
// Uses the same still mango photo as the homepage hero rather than a video:
// the 15.8MB clip that used to sit here was the single heaviest asset on the
// auth pages, and these are short pages with nothing to scroll through, so
// ambient motion bought very little. The image is already compressed to
// ~81KB and shared with the homepage, so it's usually served from cache by
// the time a visitor reaches signup. A semi-opaque, blurred form card keeps
// every label/input legible over it.
export function AuthSplitLayout({
  eyebrow,
  headline,
  subhead,
  children,
}: {
  eyebrow: string;
  headline: string;
  subhead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative md:grid md:grid-cols-2 min-h-[calc(100vh-var(--nav-height))] overflow-hidden">
      <div className="absolute inset-0 md:relative md:inset-auto z-0 overflow-hidden bg-gradient-to-br from-orchard-green to-mango-deep">
        <Image
          src="/images/hero-mango-mobile.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover"
        />
        {/* Lighter overlay than before so the mangoes actually read through,
            while keeping enough contrast for the white headline over it. */}
        <div className="absolute inset-0 bg-black/35 md:bg-black/40" />
        <FloatingMangoes />
        <div className="relative z-[2] h-full flex flex-col items-center justify-start pt-14 px-[5%] text-center md:items-start md:justify-end md:text-left md:p-10">
          <span className="text-xs font-semibold tracking-wide uppercase text-mango-orange mb-2">
            {eyebrow}
          </span>
          <h2 className="font-serif text-xl md:text-3xl font-bold mb-2 text-white drop-shadow-md max-w-xs md:max-w-sm">
            {headline}
          </h2>
          <p className="hidden md:block text-white/85 max-w-sm drop-shadow-sm">{subhead}</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center px-[5%] py-16 min-h-[calc(100vh-var(--nav-height))] md:min-h-0">
        <div className="relative z-[2] w-full max-w-md bg-surface/95 backdrop-blur-md rounded-brand p-6 shadow-brand-lg md:bg-transparent md:backdrop-blur-none md:rounded-none md:p-0 md:shadow-none animate-[authFadeUp_0.7s_ease_forwards]">
          {children}
        </div>
      </div>
    </div>
  );
}
