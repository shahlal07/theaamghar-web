export function NashemannLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-5 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-black/[0.035] dark:bg-black/[0.16]" aria-hidden="true" />

      <div className="relative w-full max-w-[360px] rounded-[26px] border border-black/10 bg-white/95 px-7 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-[#15131d]/95 dark:shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-black/5 bg-black/[0.025] dark:border-white/10 dark:bg-white/[0.04]">
          <div className="relative h-8 w-8" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border-2 border-black/10 dark:border-white/10" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#5d4bd8] border-r-[#ff9f43]" />
            <div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-[#5d4bd8] to-[#ff9f43]" />
          </div>
        </div>

        <div className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-[#5d4bd8] dark:text-[#aa9cff]">Nashemann</div>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">Getting things ready</h1>
        <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-slate-600 dark:text-slate-300">
          Loading your store. This should only take a moment.
        </p>

        <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#5d4bd8] to-[#ff9f43]" />
        </div>

        <div className="mt-7 border-t border-slate-200 pt-5 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span>More shops at </span>
          <a href="https://nashemann.store" className="font-semibold text-[#5d4bd8] hover:text-[#ff8f2b] dark:text-[#aa9cff] dark:hover:text-[#ffb25d]">nashemann.store</a>
          <span className="mx-1.5">·</span>
          <a href="https://nashemann.store/apply" className="font-semibold text-slate-700 hover:text-[#ff8f2b] dark:text-slate-200 dark:hover:text-[#ffb25d]">Open your store</a>
        </div>
      </div>
    </div>
  );
}
