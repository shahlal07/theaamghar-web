function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse bg-cream-warm rounded-brand-sm ${className}`} />;
}

export default function AccountLoading() {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonBlock className="h-8 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-20" />
        ))}
      </div>
      <SkeletonBlock className="h-40" />
      <div className="grid sm:grid-cols-2 gap-4">
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-32" />
      </div>
    </div>
  );
}
