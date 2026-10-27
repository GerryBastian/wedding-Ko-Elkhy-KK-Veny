import type { ReactNode } from "react";

/*
 * Bingkai lengkung emas bergaya barok, dirender dengan filter pencahayaan (#gilded)
 * agar tampak seperti emas tempa 3D. Sistem koordinat 300 x 440.
 *
 *   jendela foto : x 46–254, lengkung r=104 berpusat (150,180), bawah y=400
 *   pita bingkai : x 26–274, lengkung r=124, bawah y=418
 */

const CX = 150;
const SPRING = 180;

function archPath(r: number, bottom: number) {
  return `M${CX - r} ${bottom} V${SPRING} A${r} ${r} 0 0 1 ${CX + r} ${SPRING} V${bottom} Z`;
}

/** Titik-titik di sepanjang lengkung + sisi tegak (untuk untaian manik). */
function archPoints(r: number, bottom: number, step: number) {
  const pts: { x: number; y: number }[] = [];
  for (let y = bottom; y > SPRING; y -= step) pts.push({ x: CX - r, y });
  const arcSteps = Math.round((Math.PI * r) / step);
  for (let i = 0; i <= arcSteps; i++) {
    const a = Math.PI + (i / arcSteps) * Math.PI;
    pts.push({ x: CX + r * Math.cos(a), y: SPRING + r * Math.sin(a) });
  }
  for (let y = SPRING + step; y <= bottom; y += step) pts.push({ x: CX + r, y });
  return pts;
}

/** Gulungan spiral (volute) — dasar ornamen acanthus. */
function volute(cx: number, cy: number, r: number, turns: number, start: number, dir: 1 | -1) {
  const n = 48;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + dir * turns * Math.PI * 2 * t;
    const rr = r * (1 - 0.82 * t);
    const x = cx + rr * Math.cos(a);
    const y = cy + rr * Math.sin(a);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d;
}

function Rosette({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="0" cy={-r * 0.55} rx={r * 0.28} ry={r * 0.5} transform={`rotate(${i * 45})`} />
      ))}
      <circle r={r * 0.3} />
    </g>
  );
}

/** Daun acanthus 3 cuping. */
const ACANTHUS = "M0 0 C4 -8 12 -14 22 -14 C17 -10 16 -7 20 -5 C14 -4 12 -1 17 2 C10 3 5 2 0 0Z";

function LeafCluster({ x, y, rot, scale = 1, flip = false }: { x: number; y: number; rot: number; scale?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -scale : scale} ${scale})`}>
      <path d={ACANTHUS} />
      <path d={ACANTHUS} transform="rotate(-38) scale(0.8)" />
      <path d={ACANTHUS} transform="rotate(34) scale(0.72)" />
      <circle cx="0" cy="0" r="2.6" />
    </g>
  );
}

function FrameOrnament() {
  const outer = archPath(124, 418);
  const inner = archPath(104, 400);
  const beads = archPoints(114, 410, 7.2);
  const stroke = { fill: "none", stroke: "url(#gold-leaf)", strokeLinecap: "round" as const };

  return (
    <g fill="url(#gold-leaf)" filter="url(#gilded)">
      {/* Pita bingkai utama */}
      <path d={`${outer} ${inner}`} fillRule="evenodd" />
      {/* Tepi luar bertekstur tali */}
      <path d={archPath(126, 418)} {...stroke} strokeWidth="3.4" strokeDasharray="2.6 1.8" />
      {/* Garis profil */}
      <path d={archPath(119, 413)} fill="none" stroke="#6e4c17" strokeOpacity="0.55" strokeWidth="0.8" />
      <path d={archPath(108.5, 404)} fill="none" stroke="#6e4c17" strokeOpacity="0.55" strokeWidth="0.8" />
      {/* Untaian manik */}
      {beads.map((b, i) => (
        <circle key={i} cx={b.x.toFixed(2)} cy={b.y.toFixed(2)} r="2.3" />
      ))}

      {/* Mahkota: gulungan C besar + kipas kerang + finial */}
      <path d={volute(112, 74, 22, 1.2, Math.PI * 0.05, -1)} {...stroke} strokeWidth="5" />
      <path d={volute(188, 74, 22, 1.2, Math.PI * 0.95, 1)} {...stroke} strokeWidth="5" />
      <LeafCluster x={132} y={64} rot={200} scale={1.15} />
      <LeafCluster x={168} y={64} rot={-20} scale={1.15} flip />
      <g transform="translate(150 66)">
        {[-72, -54, -36, -18, 0, 18, 36, 54, 72].map((a) => (
          <path key={a} d="M0 0 C-5.5 -12 -5.5 -32 0 -40 C5.5 -32 5.5 -12 0 0Z" transform={`rotate(${a})`} />
        ))}
        <circle r="7.5" />
      </g>
      <path d="M150 6 L157 15 L150 24 L143 15 Z" />
      <circle cx="150" cy="2" r="3.2" />

      {/* Acanthus di bahu lengkung */}
      <LeafCluster x={70} y={98} rot={-130} scale={1.25} />
      <LeafCluster x={230} y={98} rot={-50} scale={1.25} flip />

      {/* Sayap gulungan di kedua sisi */}
      <path d={volute(14, 262, 13, 1.3, -Math.PI * 0.5, -1)} {...stroke} strokeWidth="4" />
      <path d={volute(286, 262, 13, 1.3, -Math.PI * 0.5, 1)} {...stroke} strokeWidth="4" />
      <Rosette x={36} y={300} r={11} />
      <Rosette x={264} y={300} r={11} />
      <Rosette x={36} y={200} r={7.5} />
      <Rosette x={264} y={200} r={7.5} />

      {/* Alas, kaki gulungan, rumpun daun sudut */}
      <rect x="14" y="415" width="272" height="11" rx="2" />
      <rect x="24" y="427" width="252" height="6" rx="2" />
      <path d={volute(30, 426, 12, 1.2, -Math.PI * 0.4, 1)} {...stroke} strokeWidth="3.8" />
      <path d={volute(270, 426, 12, 1.2, Math.PI * 1.4, -1)} {...stroke} strokeWidth="3.8" />
      <LeafCluster x={40} y={408} rot={-70} scale={1.05} />
      <LeafCluster x={260} y={408} rot={-110} scale={1.05} flip />
      <g transform="translate(150 424)">
        <ellipse rx="24" ry="10" />
        <LeafCluster x={-22} y={0} rot={180} scale={0.9} />
        <LeafCluster x={22} y={0} rot={0} scale={0.9} flip />
      </g>
    </g>
  );
}

/** Bingkai lengkung emas barok dengan foto di dalam jendelanya. */
export function GildedArchFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[300/440] ${className ?? ""}`}>
      {/* Latar beludru di balik foto agar tepi bingkai terlihat dalam */}
      <div
        className="absolute overflow-hidden rounded-t-full bg-burgundy-deep shadow-[inset_0_0_0_1px_rgb(110_76_23/0.6)]"
        style={{ left: "15.33%", right: "15.33%", top: "17.27%", bottom: "9.09%" }}
      >
        {children}
        {/* Bayangan dalam: foto seolah terbenam di balik bingkai */}
        <div className="pointer-events-none absolute inset-0 rounded-t-full shadow-[inset_0_6px_18px_rgb(30_8_4/0.55),inset_0_-4px_12px_rgb(30_8_4/0.35)]" />
        {/* Kilau kaca tipis */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.16)_0%,transparent_35%,transparent_70%,rgb(255_255_255/0.06)_100%)]" />
      </div>
      <svg viewBox="0 0 300 440" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <FrameOrnament />
      </svg>
    </div>
  );
}
