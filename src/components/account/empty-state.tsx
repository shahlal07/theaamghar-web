import Link from "next/link";

export function EmptyState({
  icon,
  title,
  message,
  actionHref,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 border border-dashed border-border-subtle rounded-brand bg-cream-warm/40">
      <div className="w-16 h-16 rounded-full bg-mango-orange/10 text-mango-orange flex items-center justify-center mb-4 [&_svg]:w-8 [&_svg]:h-8">
        {icon}
      </div>
      <h3 className="font-serif text-lg font-bold mb-1.5">{title}</h3>
      <p className="text-sm text-ink-light max-w-sm mb-5">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="bg-mango-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-transform shadow-[0_4px_15px_rgba(255,107,0,0.3)]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
