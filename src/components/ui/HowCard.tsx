import { COLORS } from "@/lib/colors";
export default function HowCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
      <div
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-black"
        style={{
          background: `linear-gradient(90deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
        }}
      >
        {icon}
      </div>
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-zinc-300">{desc}</p>
    </div>
  );
}
