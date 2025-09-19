export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Grey grid background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
          linear-gradient(to right, rgba(120,120,120,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(120,120,120,0.1) 1px, transparent 1px)
        `,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Existing radial grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] opacity-20 z-10" />
      {/* Blur blobs */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-[100px] z-20" />
      <div className="absolute top-40 -right-24 h-72 w-72 rounded-full bg-emerald-500/30 blur-[100px] z-20" />
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px] z-20" />
    </div>
  );
}
