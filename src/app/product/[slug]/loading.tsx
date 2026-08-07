function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse bg-cream-warm rounded-brand-sm ${className}`} />;
}

export default function ProductLoading() {
  return (
    <div className="px-[5%] py-10 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10">
        <SkeletonBlock className="aspect-square rounded-brand" />
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-10 w-3/4" />
          <SkeletonBlock className="h-20" />
          <SkeletonBlock className="h-14" />
        </div>
      </div>
    </div>
  );
}
