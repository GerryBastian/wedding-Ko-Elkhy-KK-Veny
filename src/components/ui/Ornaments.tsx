import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { className?: string };

/** Ranting laurel/zaitun — garis halus champagne. */
export function BotanicalBranch({ className, ...props }: Props) {
  // Daun di sepanjang batang melengkung; posisi deterministik agar aman SSR.
  const leaves = [
    { x: 30, y: 92, r: -50, s: 1 },
    { x: 44, y: 80, r: 40, s: 0.95 },
    { x: 54, y: 66, r: -42, s: 0.9 },
    { x: 68, y: 56, r: 48, s: 0.85 },
    { x: 78, y: 42, r: -35, s: 0.8 },
    { x: 92, y: 34, r: 55, s: 0.72 },
    { x: 100, y: 22, r: -25, s: 0.62 },
  ];
  return (
    <svg viewBox="0 0 120 110" fill="none" aria-hidden="true" className={className} {...props}>
      <path d="M8 106 C 40 88, 70 60, 112 10" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <path d="M0 0 C 4 -6, 14 -8, 20 -2 C 14 2, 5 3, 0 0 Z" stroke="currentColor" strokeWidth="0.8" />
          <path d="M1 -0.5 L 17 -2.4" stroke="currentColor" strokeWidth="0.4" opacity="0.7" />
        </g>
      ))}
      <circle cx="113" cy="9" r="1.6" fill="currentColor" />
      <circle cx="104" cy="12" r="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Pemisah emas: garis — belah ketupat — garis. */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-champagne ${className ?? ""}`} aria-hidden="true">
      <span className="gold-rule flex-1" />
      <svg width="34" height="10" viewBox="0 0 34 10" fill="none">
        <path d="M17 1 L21 5 L17 9 L13 5 Z" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="5" cy="5" r="1.2" fill="currentColor" />
        <circle cx="29" cy="5" r="1.2" fill="currentColor" />
      </svg>
      <span className="gold-rule flex-1" />
    </div>
  );
}

/** Ornamen sudut bingkai. */
export function CornerFlourish({ className, ...props }: Props) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" className={className} {...props}>
      <path d="M2 78 V 18 C 2 9, 9 2, 18 2 H 78" stroke="currentColor" strokeWidth="0.9" />
      <path d="M10 70 V 24 C 10 16, 16 10, 24 10 H 70" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <path d="M18 18 C 26 18, 30 24, 30 30 C 24 30, 18 26, 18 18 Z" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="18" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Bingkai tipis champagne di empat sudut — dipakai di atas foto. */
export function OrnamentalFrame({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-3 sm:inset-5 ${className ?? ""}`} aria-hidden="true">
      <div className="absolute inset-0 border border-champagne/30" />
      <CornerFlourish className="absolute -left-px -top-px h-14 w-14 text-champagne sm:h-20 sm:w-20" />
      <CornerFlourish className="absolute -right-px -top-px h-14 w-14 rotate-90 text-champagne sm:h-20 sm:w-20" />
      <CornerFlourish className="absolute -bottom-px -right-px h-14 w-14 rotate-180 text-champagne sm:h-20 sm:w-20" />
      <CornerFlourish className="absolute -bottom-px -left-px h-14 w-14 -rotate-90 text-champagne sm:h-20 sm:w-20" />
    </div>
  );
}

/** Monogram E & V */
export function Monogram({ className }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-champagne" fill="none">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 3" />
      </svg>
      <span className="font-serif text-[1.9em] italic leading-none">
        E<span className="mx-0.5 text-[0.6em] text-champagne">&amp;</span>V
      </span>
    </div>
  );
}
