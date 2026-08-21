export function NashemannLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-6">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orchard-green/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-[-6rem] h-80 w-80 rounded-full bg-mango-orange/10 blur-3xl" aria-hidden="true" />

      <div className="relative w-full max-w-sm rounded-[28px] border border-white/50 bg-white/30 px-7 py-8 text-center shadow-[0_20px_70px_rgba(34,55,45,0.08)] backdrop-blur-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/60 shadow-[0_8px_24px_rgba(34,55,45,0.08)]">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 rounded-full border-2 border-orchard-green/15" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-orchard-green border-r-orchard-green/45" />
            <div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-orchard-green to-mango-orange animate-pulse" />
          </div>
        </div>

        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-orchard-green/75">Nashemann</div>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink">Getting things ready</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-light">
          A calm little moment while we prepare your marketplace experience.
        </p>

        <div className="mx-auto mt-6 h-1 w-28 overflow-hidden rounded-full bg-ink/5">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-orchard-green/30 via-orchard-green to-mango-orange/60" />
        </div>

        <div className="mt-7 border-t border-ink/5 pt-5 text-xs text-ink-light">
          <span>More shops online at </span>
          <a href="https://nashemann.store" className="font-semibold text-orchard-green transition-colors hover:text-mango-orange">
            nashemann.store
          </a>
          <span className="mx-1.5 text-ink/20">·</span>
          <a href="https://nashemann.store/apply" className="font-semibold text-ink transition-colors hover:text-mango-orange">
            Apply yours now
          </a>
        </div>
      </div>
    </div>
  );
}
