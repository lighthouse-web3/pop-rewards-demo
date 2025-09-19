export default function SmallStat({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-zinc-300">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-emerald-300">{delta}</div>
    </div>
  );
}
