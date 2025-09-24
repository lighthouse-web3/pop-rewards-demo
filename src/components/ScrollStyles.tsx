export default function ScrollStyles() {
  return (
    <style>{`
      /* thin red scrollbar everywhere */
      html, body, * { scrollbar-width: thin; scrollbar-color: #FF4B4B rgba(255,255,255,0.08); }
      *::-webkit-scrollbar { width: 12px; height: 12px; }
      *::-webkit-scrollbar-track { background: rgba(255,255,255,0.08); border-radius: 9999px; }
      *::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #FF4B4B, #E21E2C);
        border-radius: 9999px;
        border: 3px solid rgba(20, 10, 11, 0.35);
      }
      *::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #FF5E5E, #FF3A3A);
      }
      *::-webkit-scrollbar-corner { background: transparent; }

      /* scoped variant if you use .themed-scroll */
      .themed-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
      .themed-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.08); border-radius: 9999px; }
      .themed-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #FF4B4B, #E21E2C);
        border: 2px solid rgba(20, 10, 11, 0.35);
        border-radius: 9999px;
      }
    `}</style>
  );
}
