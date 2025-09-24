export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* subtle warm grid so it feels lively, not gloomy */}
      <div
        className="absolute inset-0 opacity-[.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />
      {/* tiny radial texture to avoid flat fills */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* warm red glows (no neon, no blue) */}
      <div className="absolute -top-24 -left-28 h-80 w-80 rounded-full bg-[#FF4B4B]/32 blur-[120px]" />
      <div className="absolute top-1/3 -right-28 h-80 w-80 rounded-full bg-[#E21E2C]/28 blur-[120px]" />

      {/* gentle warm aura at bottom center */}
      <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#FF8A8A]/18 blur-[140px]" />
    </div>
  );
}
