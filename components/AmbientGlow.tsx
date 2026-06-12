export default function AmbientGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="glow-drift-1 absolute rounded-full"
        style={{
          width: 700, height: 700,
          background: "rgba(184,136,46,0.12)",
          filter: "blur(90px)",
          top: "5%", left: "-8%",
        }}
      />
      <div
        className="glow-drift-2 absolute rounded-full"
        style={{
          width: 620, height: 620,
          background: "rgba(212,168,71,0.10)",
          filter: "blur(90px)",
          top: "40%", right: "-5%",
        }}
      />
      <div
        className="glow-drift-3 absolute rounded-full"
        style={{
          width: 520, height: 520,
          background: "rgba(180,130,40,0.09)",
          filter: "blur(80px)",
          bottom: "8%", left: "32%",
        }}
      />
    </div>
  );
}
