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
    <div className="relative md:grid md:grid-cols-2 min-h-[calc(100vh-var(--nav-height))] overflow-hidden bg-surface">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#eef4f0] via-[#f7faf8] to-[#edf5f3]">
        <div
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orchard-green/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -right-28 bottom-[-7rem] h-96 w-96 rounded-full bg-mango-orange/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(45,90,39,0.08) 0 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,107,0,0.07) 0 1px, transparent 1px)",
            backgroundSize: "28px 28px, 34px 34px",
          }}
        />

        <div className="relative z-[2] flex h-full min-h-[360px] flex-col justify-end px-[8%] py-12 text-left md:min-h-0 md:p-12 lg:p-16">
          <span className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orchard-green">
            {eyebrow}
          </span>
          <h2 className="max-w-lg font-serif text-3xl font-bold leading-tight text-ink md:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-light md:text-lg">{subhead}</p>

          <div className="mt-8 flex items-center gap-3 text-sm text-ink-light">
            <span className="h-px w-10 bg-border-subtle" aria-hidden="true" />
            <span>Powered by Nashemann</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center px-[5%] py-12 min-h-[calc(100vh-var(--nav-height))] md:min-h-0 md:py-16">
        <div className="relative z-[2] w-full max-w-md bg-surface/95 backdrop-blur-md rounded-brand p-6 shadow-brand-lg md:bg-transparent md:backdrop-blur-none md:rounded-none md:p-0 md:shadow-none animate-[authFadeUp_0.7s_ease_forwards]">
          {children}
        </div>
      </div>
    </div>
  );
}
