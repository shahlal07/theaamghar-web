// Set this once a Nashemann brand mark exists -- the logo slot below
// falls back to the gradient dot mark until then, so this file is the
// only thing that needs to change to swap it in.
const NASHEMANN_LOGO_URL: string | null = null;

export function NashemannLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-5 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-black/[0.035] dark:bg-black/[0.16]" aria-hidden="true" />

      <div className="relative w-full max-w-[360px] rounded-[26px] border border-black/10 bg-white/95 px-7 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-[#15131d]/95 dark:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-black/5 bg-black/[0.025] dark:border-white/10 dark:bg-white/[0.04] overflow-hidden">
          {NASHEMANN_LOGO_URL ? (
            // eslint-disable-next-line @next/next/no-img-element -- tiny fixed-size logo, not worth next/image's overhead in a loading overlay
            <img src={NASHEMANN_LOGO_URL} alt="Nashemann" className="h-full w-full object-contain" />
          ) : (
            <div className="relative h-8 w-8" aria-hidden="true">
              <div className="absolute inset-0 rounded-full border-2 border-black/10 dark:border-white/10" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#5d4bd8] border-r-[#ff9f43]" />
              <div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-[#5d4bd8] to-[#ff9f43]" />
            </div>
          )}
        </div>

        <h1 className="mt-6 text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">Getting things ready</h1>
        <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-slate-600 dark:text-slate-300">
          This should only take a moment.
        </p>

        <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#5d4bd8] to-[#ff9f43]" />
        </div>

        <a
          href="https://nashemann.store"
          className="mt-7 flex items-center justify-center gap-1.5 border-t border-slate-200 pt-5 text-xs font-semibold text-slate-500 hover:text-[#5d4bd8] dark:border-white/10 dark:text-slate-400 dark:hover:text-[#aa9cff] transition-colors"
        >
          Powered by <span className="text-[#5d4bd8] dark:text-[#aa9cff]">nashemann.store</span>
        </a>
      </div>
    </div>
  );
}
