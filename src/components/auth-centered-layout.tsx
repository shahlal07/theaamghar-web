export function AuthCenteredLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-var(--nav-height))] items-center justify-center bg-surface px-5 py-12">
      <div className="w-full max-w-sm animate-[authFadeUp_0.5s_ease_forwards] rounded-brand border border-border-subtle bg-surface p-7 shadow-brand-lg sm:p-8">
        {children}
      </div>
    </div>
  );
}
