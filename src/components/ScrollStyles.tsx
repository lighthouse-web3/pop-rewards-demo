export default function ScrollStyles() {
  return (
    <style>{`
      html, body, * { scrollbar-width: thin; scrollbar-color: #A8FF00 rgba(255,255,255,0.06); }
      *::-webkit-scrollbar { width: 12px; height: 12px; }
      *::-webkit-scrollbar-track { background: rgba(255,255,255,0.06); border-radius: 9999px; }
      *::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #39FF14, #A8FF00);
        border-radius: 9999px;
        border: 3px solid rgba(11,15,9,0.35);
      }
      *::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #66FF3D, #C8FF4D);
      }
      *::-webkit-scrollbar-corner { background: transparent; }

      .themed-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
      .themed-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #39FF14, #A8FF00);
        border: 2px solid rgba(11,15,9,0.35);
        border-radius: 9999px;
      }
    `}</style>
  );
}
