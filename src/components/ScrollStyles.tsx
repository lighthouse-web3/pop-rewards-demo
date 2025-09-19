export default function ScrollStyles() {
  return (
    <style>{`
      html, body, * { scrollbar-width: thin; scrollbar-color: #6E56CF rgba(255,255,255,0.06); }
      *::-webkit-scrollbar { width: 12px; height: 12px; }
      *::-webkit-scrollbar-track { background: rgba(255,255,255,0.06); border-radius: 9999px; }
      *::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#6E56CF,#8B5CF6); border-radius: 9999px; border: 3px solid rgba(20,26,59,0.35); }
      *::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg,#8B5CF6,#A78BFA); }
      *::-webkit-scrollbar-corner { background: transparent; }
      .themed-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
      .themed-scroll::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#6E56CF,#8B5CF6); border: 2px solid rgba(20,26,59,0.35); }
    `}</style>
  );
}
