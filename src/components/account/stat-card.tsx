export function StatCard({
  icon,
  label,
  value,
  accent = "mango-orange",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "mango-orange" | "orchard-green" | "golden";
}) {
  const accentClasses = {
    "mango-orange": "bg-mango-orange/10 text-mango-orange",
    "orchard-green": "bg-orchard-green/10 text-orchard-green",
    golden: "bg-golden/20 text-mango-deep",
  }[accent];

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5 flex items-center gap-4 shadow-brand-sm transition-shadow hover:shadow-brand-md">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 [&_svg]:w-5 [&_svg]:h-5 ${accentClasses}`}>
        {icon}
      </div>
      <div className="min-w-0">
        {/* font-sans, not font-serif: Cormorant Garamond ships old-style
            figures -- 3/4/5/7/9 drop below the baseline and digit heights
            vary across 7 different ascents, so any number rendered in it
            visibly bounces. Inter has uniform lining figures. */}
        <div className="text-xl font-bold font-sans truncate tabular-nums">{value}</div>
        <div className="text-xs text-ink-light">{label}</div>
      </div>
    </div>
  );
}
