export default function LockedCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="pointer-events-none grid gap-2 opacity-30">
        <div className="h-2 rounded bg-white/10" />
        <div className="h-2 w-3/4 rounded bg-white/10" />
        <div className="h-2 w-2/3 rounded bg-white/10" />
        <div className="h-2 w-1/2 rounded bg-white/10" />
        <div className="h-2 w-1/3 rounded bg-white/10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-xl border border-white/10 bg-black/50 px-6 py-5 text-center backdrop-blur-sm">
          <div className="text-3xl">🔒</div>
          <div className="mt-2 font-semibold">{title} — Coming Soon</div>
          <div className="text-xs text-zinc-300">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
