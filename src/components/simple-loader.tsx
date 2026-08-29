// Plain, vendor-neutral loading overlay -- no Nashemann branding, no
// "Powered by" link. Used for vendors who don't want the platform's own
// mark surfaced on their storefront (currently just NIGEHBAAN).
export function SimpleLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-black/50">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black/60 dark:border-white/15 dark:border-t-white/70"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
