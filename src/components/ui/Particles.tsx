/**
 * Partikel cahaya champagne yang melayang perlahan — murni CSS (GPU, ringan di HP).
 * Posisi dibuat deterministik agar render server & klien identik.
 */
export function Particles({ count = 14, className }: { count?: number; className?: string }) {
  const items = Array.from({ length: count }, (_, i) => {
    const rnd = (n: number) => {
      const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      left: `${(rnd(1) * 100).toFixed(2)}%`,
      size: 2 + Math.round(rnd(2) * 3),
      duration: 14 + Math.round(rnd(3) * 14),
      delay: -Math.round(rnd(4) * 24),
      dx: `${Math.round((rnd(5) - 0.5) * 80)}px`,
      opacity: (0.25 + rnd(6) * 0.5).toFixed(2),
    };
  });

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-10px] rounded-full bg-champagne-soft"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px 2px rgb(214 185 140 / 0.45)",
              animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
              "--dx": p.dx,
              "--o": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
