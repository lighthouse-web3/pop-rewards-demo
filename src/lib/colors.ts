// Same keys, new vibe (Zomato-ish red, vibrant, minimal dark)
export const COLORS = {
  // warm near-black (very subtle, used sparingly)
  navy: "#1E0A0B",

  // brighter, warmer canvas so the page doesn't feel gloomy
  bgFrom: "#1A0B0C", // deep wine
  bgVia: "#220D0F", // warmer maroon
  bgTo: "#1A0B0C",

  // CTA gradient uses the old "yellow*" keys to avoid code changes
  // vivid food-reds, not neon
  yellowFrom: "#FF4B4B", // bright tomato red
  yellowTo: "#E21E2C", // Zomato-leaning red

  // subtle lines and friendly headline contrast
  border: "rgba(255,255,255,0.10)",
  headline: "#FFE9EB", // warm off-white with a pink tint
} as const;
