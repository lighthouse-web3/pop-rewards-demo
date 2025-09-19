export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* subtle diagonal hatch, tinted green so it doesn’t read purple/blue */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background:
            "repeating-linear-gradient(45deg, rgba(168,255,0,0.06) 0, rgba(168,255,0,0.06) 2px, transparent 2px, transparent 26px)",
        }}
      />

      {/* neon-green glows (no blue/teal) */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: `
            radial-gradient(600px 220px at 14% 14%, rgba(57,255,20,0.18), transparent 60%),
            radial-gradient(520px 200px at 86% 18%, rgba(168,255,0,0.14), transparent 60%),
            radial-gradient(440px 180px at 50% 88%, rgba(120,255,80,0.12), transparent 70%)
          `,
        }}
      />
    </div>
  );
}
