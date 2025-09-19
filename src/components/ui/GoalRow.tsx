import { COLORS } from "@/lib/colors";
export default function GoalRow({
  name,
  current,
  total,
}: {
  name: string;
  current: number;
  total: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((current / total) * 100)));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{name}</span>
        <span className="text-zinc-400">
          {current}/{total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-white/10">
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
          }}
        />
      </div>
    </div>
  );
}
