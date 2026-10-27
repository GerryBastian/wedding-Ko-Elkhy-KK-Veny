import type { CSSProperties, ReactNode } from "react";

/* ───────────────── Renda oval ───────────────── */

function scallopPath(cx: number, cy: number, rx: number, ry: number, count: number, depth: number) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a0 = (i / count) * Math.PI * 2;
    const a1 = ((i + 1) / count) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const p0 = [cx + rx * Math.cos(a0), cy + ry * Math.sin(a0)];
    const p1 = [cx + rx * Math.cos(a1), cy + ry * Math.sin(a1)];
    const c = [cx + (rx + depth) * Math.cos(am), cy + (ry + depth) * Math.sin(am)];
    if (i === 0) d += `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} `;
    d += `Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} `;
  }
  return `${d}Z`;
}

function ringDots(cx: number, cy: number, rx: number, ry: number, count: number, r: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), r };
  });
}

/**
 * Bingkai renda oval (seperti moodboard). Anak (foto) diletakkan di dalam oval.
 * `id` wajib unik per halaman (untuk mask SVG).
 */
export function LaceOval({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  // Sistem koordinat 300 x 400
  const cx = 150;
  const cy = 200;
  const outer = scallopPath(cx, cy, 138, 186, 46, 9);
  const holesA = ringDots(cx, cy, 131, 179, 70, 2.2);
  const holesB = ringDots(cx, cy, 122, 170, 56, 3.1);
  const holesC = ringDots(cx, cy, 113.5, 161.5, 84, 1.3);
  const petals = ringDots(cx, cy, 127, 175, 23, 0);

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Foto di dalam oval */}
      <div className="absolute overflow-hidden" style={{ left: "11.5%", right: "11.5%", top: "9.5%", bottom: "9.5%", borderRadius: "50%" }}>
        {children}
      </div>
      <svg viewBox="0 0 300 400" className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_10px_18px_rgb(20_2_8/0.55)]" aria-hidden="true">
        <defs>
          <mask id={`lace-${id}`}>
            <path d={outer} fill="#fff" />
            <ellipse cx={cx} cy={cy} rx={115.5} ry={163.5} fill="#000" />
            {[...holesA, ...holesB, ...holesC].map((h, i) => (
              <circle key={i} cx={h.x.toFixed(1)} cy={h.y.toFixed(1)} r={h.r} fill="#000" />
            ))}
          </mask>
          <linearGradient id={`lace-fill-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbf2ee" />
            <stop offset="0.5" stopColor="#ead3ca" />
            <stop offset="1" stopColor="#d9b9ae" />
          </linearGradient>
        </defs>
        <g mask={`url(#lace-${id})`}>
          <rect width="300" height="400" fill={`url(#lace-fill-${id})`} />
          {/* Motif bunga kecil di renda */}
          {petals.map((p, i) => (
            <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`} opacity="0.5">
              <circle r="5.5" fill="none" stroke="#b48a80" strokeWidth="0.7" />
              <circle r="1.6" fill="#b48a80" />
            </g>
          ))}
        </g>
        <ellipse cx={cx} cy={cy} rx={115.5} ry={163.5} fill="none" stroke="#f6e7df" strokeWidth="1.4" />
        <ellipse cx={cx} cy={cy} rx={117.5} ry={165.5} fill="none" stroke="#b48a80" strokeWidth="0.6" strokeDasharray="1.5 2.5" />
      </svg>
    </div>
  );
}

/* ───────────────── Segel lilin ───────────────── */

/** Tepi lilin tak beraturan dengan "lelehan" kecil — deterministik. */
function waxOutline(r: number, points = 64) {
  let d = "";
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const drip = Math.max(0, Math.sin(i * 0.9 + 1.3)) ** 6 * 4.5 + Math.max(0, Math.sin(i * 0.37 + 4)) ** 8 * 3;
    const wobble = r + Math.sin(i * 2.3) * 1.6 + Math.cos(i * 1.1) * 1.4 + drip;
    const x = 60 + wobble * Math.cos(a);
    const y = 60 + wobble * Math.sin(a);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}

const WAX_OUTLINE = waxOutline(50);
const WAX_DOTS = Array.from({ length: 36 }, (_, i) => {
  const a = (i / 36) * Math.PI * 2;
  return { x: 60 + 33.5 * Math.cos(a), y: 60 + 33.5 * Math.sin(a) };
});

/**
 * Segel lilin realistis: tepi timbul (bevel + kilau), cakram tengah tertekan,
 * cincin titik terukir, dan monogram timbul.
 */
export function WaxSeal({ initials = "EV", className, style }: { initials?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden="true" focusable="false">
      <path d={WAX_OUTLINE} fill="url(#wax-base)" filter="url(#wax-relief)" />
      <circle cx="60" cy="60" r="38" fill="#7a1527" filter="url(#wax-inset)" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#c0485f" strokeOpacity="0.35" strokeWidth="0.8" />
      {WAX_DOTS.map((d, i) => (
        <circle key={i} cx={d.x.toFixed(2)} cy={d.y.toFixed(2)} r="0.95" fill="#3b0510" opacity="0.65" />
      ))}
      <g filter="url(#wax-emboss)">
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fontFamily="var(--font-pinyon), 'Pinyon Script', cursive"
          fontSize="38"
          fill="#8f2236"
        >
          {initials}
        </text>
        <path d="M38 80 C50 86 70 86 82 80" fill="none" stroke="#8f2236" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ───────────────── Pita satin ───────────────── */

export function Bow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden="true" focusable="false">
      <g filter="url(#soft-shadow)">
        <path d="M58 46 C40 20 8 14 6 34 C4 52 34 58 58 50Z" fill="url(#satin)" />
        <path d="M62 46 C80 20 112 14 114 34 C116 52 86 58 62 50Z" fill="url(#satin)" />
        <path d="M55 52 C46 70 36 88 26 104 L38 100 L42 108 C50 90 56 72 60 54Z" fill="url(#satin)" />
        <path d="M65 52 C74 70 84 88 94 104 L82 100 L78 108 C70 90 64 72 60 54Z" fill="url(#satin)" />
        <ellipse cx="60" cy="49" rx="9" ry="8" fill="url(#satin)" stroke="#2c040c" strokeOpacity="0.4" />
        <path d="M18 30 C30 26 44 34 52 44" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.5" />
        <path d="M102 30 C90 26 76 34 68 44" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/* ───────────────── Untaian mutiara ───────────────── */

export function PearlStrand({ className, count = 22, sag = 34 }: { className?: string; count?: number; sag?: number }) {
  const pearls = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return { x: 8 + t * 284, y: 10 + sag * 4 * t * (1 - t), r: 5.2 + Math.sin(t * Math.PI) * 1.2 };
  });
  return (
    <svg viewBox={`0 0 300 ${sag + 24}`} className={className} aria-hidden="true" focusable="false">
      {pearls.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={p.r.toFixed(1)} fill="url(#pearl)" filter="url(#soft-shadow)" />
      ))}
    </svg>
  );
}

/* ───────────────── Rangkaian laurel ───────────────── */

/** Daun-daun laurel di sepanjang busur, deterministik. */
const LAUREL_LEAVES = (() => {
  const leaves: { x: number; y: number; rot: number; side: 1 | -1 }[] = [];
  for (const side of [-1, 1] as const) {
    for (let i = 0; i < 9; i++) {
      // busur dari bawah (90°) naik ke atas di sisi kiri/kanan
      const deg = 98 + i * 16;
      const a = (deg * Math.PI) / 180;
      const x = 50 + side * -38 * Math.cos(a);
      const y = 52 + 38 * Math.sin(a);
      const tangent = side === -1 ? deg + 90 : 90 - deg;
      leaves.push({ x, y, rot: tangent + (i % 2 === 0 ? 28 : -28) * side, side });
    }
  }
  return leaves;
})();

/** Rangkaian daun laurel emas melingkar (untuk monogram). */
export function LaurelWreath({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <g fill="url(#gold-leaf)" filter="url(#gilded)">
        <path d="M50 92 C22 88 10 64 14 40 C16 30 20 22 26 16" fill="none" stroke="url(#gold-leaf)" strokeWidth="1.2" />
        <path d="M50 92 C78 88 90 64 86 40 C84 30 80 22 74 16" fill="none" stroke="url(#gold-leaf)" strokeWidth="1.2" />
        {LAUREL_LEAVES.map((l, i) => (
          <ellipse key={i} cx={l.x.toFixed(2)} cy={l.y.toFixed(2)} rx="2.1" ry="5.2" transform={`rotate(${l.rot.toFixed(1)} ${l.x.toFixed(2)} ${l.y.toFixed(2)})`} />
        ))}
        <circle cx="50" cy="92" r="2.2" />
      </g>
    </svg>
  );
}

/* ───────────────── Pemisah emas berhias ───────────────── */

export function GoldFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 24" className={className} aria-hidden="true" focusable="false" fill="none">
      <path d="M4 12 H84" stroke="url(#gold)" strokeWidth="0.9" />
      <path d="M136 12 H216" stroke="url(#gold)" strokeWidth="0.9" />
      <path d="M110 3 C100 3 96 12 86 12 C96 12 100 21 110 21 C120 21 124 12 134 12 C124 12 120 3 110 3Z" stroke="url(#gold)" strokeWidth="1" />
      <circle cx="110" cy="12" r="2.4" fill="url(#gold)" />
      <circle cx="4" cy="12" r="1.6" fill="url(#gold)" />
      <circle cx="216" cy="12" r="1.6" fill="url(#gold)" />
    </svg>
  );
}

/** Judul section bergaya kaligrafi + label kapital. */
export function ScriptHeading({
  script,
  label,
  tone = "light",
  className,
}: {
  script: string;
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`text-center ${className ?? ""}`}>
      {label && <p className={`eyebrow ${dark ? "text-champagne-soft/80" : "text-rose"}`}>{label}</p>}
      <h2 className={`mt-1 px-2 font-script text-[3.4rem] leading-[1.25] sm:text-7xl ${dark ? "text-gold" : "text-burgundy"}`}>
        {/* "&" bawaan Pinyon kurang terbaca → ganti dengan italic serif */}
        {script.split("&").map((part, i) => (
          <span key={i}>
            {i > 0 && <span className="font-serif text-[0.6em] italic">&amp;</span>}
            {part}
          </span>
        ))}
      </h2>
      <GoldFlourish className="mx-auto mt-1 h-4 w-44" />
    </div>
  );
}
