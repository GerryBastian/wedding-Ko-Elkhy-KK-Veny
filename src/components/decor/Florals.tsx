/**
 * Buket bunga ilustrasi (SVG murni): mawar burgundy, mawar krem, hydrangea putih,
 * daun sage, beri, dan baby's breath. Semua posisi deterministik (aman untuk SSR).
 */

type Tone = "wine" | "wine-dark" | "blush" | "cream";

const PETAL = "M0 0 C-24 -4 -30 -30 -16 -42 C-7 -49 7 -49 16 -42 C30 -30 24 -4 0 0Z";
const SMALL_PETAL = "M0 0 C-5 -3 -6 -10 0 -12 C6 -10 5 -3 0 0Z";
const LEAF = "M0 0 C12 -11 38 -13 60 0 C38 13 12 11 0 0Z";

function petalFill(tone: Tone) {
  return `url(#petal-${tone})`;
}

function Rose({ x, y, size, tone = "wine", rot = 0 }: { x: number; y: number; size: number; tone?: Tone; rot?: number }) {
  const cream = tone === "cream";
  const stroke = cream ? "rgb(140 115 85 / 0.45)" : "rgb(30 2 8 / 0.5)";
  const inner: Tone = tone === "cream" ? "cream" : tone === "blush" ? "blush" : "wine-dark";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size / 100})`}>
      {[0, 72, 144, 216, 288].map((r) => (
        <path key={`o${r}`} d={PETAL} transform={`rotate(${r})`} fill={petalFill(tone)} stroke={stroke} strokeWidth="1" />
      ))}
      {[36, 108, 180, 252, 324].map((r) => (
        <path key={`m${r}`} d={PETAL} transform={`rotate(${r}) scale(0.76)`} fill={petalFill(tone)} stroke={stroke} strokeWidth="1.2" />
      ))}
      {[15, 105, 195, 285].map((r) => (
        <path key={`i${r}`} d={PETAL} transform={`rotate(${r}) scale(0.52)`} fill={petalFill(inner)} stroke={stroke} strokeWidth="1.4" />
      ))}
      <circle r="17" fill={cream ? "url(#cream-core)" : "url(#rose-core)"} />
      {[40, 160, 280].map((r) => (
        <path key={`c${r}`} d={PETAL} transform={`rotate(${r}) scale(0.3)`} fill={petalFill(tone)} stroke={stroke} strokeWidth="2" />
      ))}
      <path d="M-6 2 C-8 -6 6 -9 7 -1 C8 6 -2 8 -3 2" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function Hydrangea({ x, y, size }: { x: number; y: number; size: number }) {
  const florets = Array.from({ length: 19 }, (_, i) => {
    const r = 9.5 * Math.sqrt(i);
    const a = (i * 137.5 * Math.PI) / 180;
    return { fx: r * Math.cos(a), fy: r * Math.sin(a), rot: (i * 47) % 90 };
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 100})`}>
      <circle r="44" fill="rgb(120 100 75 / 0.25)" />
      {florets.map((f, i) => (
        <g key={i} transform={`translate(${f.fx.toFixed(1)} ${f.fy.toFixed(1)}) rotate(${f.rot})`}>
          {[0, 90, 180, 270].map((r) => (
            <path key={r} d={SMALL_PETAL} transform={`rotate(${r})`} fill="url(#petal-cream)" stroke="rgb(150 130 100 / 0.45)" strokeWidth="0.6" />
          ))}
          <circle r="1.6" fill="#b9a27a" />
        </g>
      ))}
    </g>
  );
}

function Leaf({ x, y, len, rot, dark }: { x: number; y: number; len: number; rot: number; dark?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${len / 60})`}>
      <path d={LEAF} fill={dark ? "url(#leaf-dark)" : "url(#leaf)"} stroke="rgb(20 30 15 / 0.35)" strokeWidth="0.6" />
      <path d="M3 0 C20 -1 40 -1 56 0" fill="none" stroke="rgb(255 255 240 / 0.28)" strokeWidth="0.8" />
    </g>
  );
}

function Berries({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const pts = [
    [0, 0, 4.5],
    [8, -6, 3.8],
    [-7, -7, 3.4],
    [3, -14, 3],
    [12, 4, 3.2],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 L3 -14 M0 0 L8 -6 M0 0 L-7 -7 M0 0 L12 4" stroke="#3c2a22" strokeWidth="0.8" />
      {pts.map(([px, py, r], i) => (
        <circle key={i} cx={px} cy={py} r={r} fill="url(#berry)" />
      ))}
    </g>
  );
}

function BabysBreath({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  const tips = [
    [-14, -30],
    [-4, -38],
    [8, -34],
    [16, -24],
    [-18, -18],
    [2, -22],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {tips.map(([tx, ty], i) => (
        <g key={i}>
          <path d={`M0 0 Q${tx * 0.4} ${ty * 0.6} ${tx} ${ty}`} fill="none" stroke="#6d7a5f" strokeWidth="0.7" />
          <circle cx={tx} cy={ty} r="2.6" fill="#fffaf0" stroke="rgb(170 150 120 / 0.5)" strokeWidth="0.4" />
          <circle cx={tx + 2.5} cy={ty + 2} r="1.8" fill="#fffaf0" />
        </g>
      ))}
    </g>
  );
}

export type FloralVariant = "bouquet" | "spray" | "sprig";

const VIEWBOX: Record<FloralVariant, string> = {
  bouquet: "0 0 300 260",
  spray: "0 0 420 170",
  sprig: "0 0 170 150",
};

/** Buket bunga. Balik/arahkan dengan class Tailwind (mis. -scale-x-100, rotate-180). */
export function Florals({ variant = "bouquet", className }: { variant?: FloralVariant; className?: string }) {
  return (
    <svg viewBox={VIEWBOX[variant]} className={`pointer-events-none select-none ${className ?? ""}`} aria-hidden="true" focusable="false">
      <g filter="url(#soft-shadow)">
        {variant === "bouquet" && (
          <>
            <BabysBreath x={52} y={98} rot={-40} s={1.2} />
            <BabysBreath x={262} y={188} rot={110} s={1.1} />
            <Leaf x={150} y={140} len={100} rot={-165} dark />
            <Leaf x={150} y={140} len={92} rot={-128} />
            <Leaf x={150} y={140} len={96} rot={-42} dark />
            <Leaf x={150} y={140} len={100} rot={-8} />
            <Leaf x={150} y={140} len={88} rot={28} dark />
            <Leaf x={150} y={140} len={96} rot={150} />
            <Leaf x={150} y={140} len={84} rot={196} dark />
            <Berries x={58} y={160} s={1.2} />
            <Berries x={250} y={92} s={1.1} />
            <Hydrangea x={104} y={118} size={72} />
            <Hydrangea x={198} y={170} size={64} />
            <Rose x={86} y={186} size={58} tone="cream" rot={20} />
            <Rose x={214} y={104} size={56} tone="blush" rot={-14} />
            <Rose x={156} y={124} size={96} tone="wine" rot={8} />
            <Rose x={118} y={172} size={64} tone="wine-dark" rot={40} />
            <Rose x={238} y={150} size={40} tone="wine" rot={-30} />
          </>
        )}
        {variant === "spray" && (
          <>
            <BabysBreath x={40} y={120} rot={-70} s={1.1} />
            <BabysBreath x={384} y={112} rot={70} s={1.1} />
            <Leaf x={210} y={100} len={110} rot={180} dark />
            <Leaf x={210} y={100} len={104} rot={-160} />
            <Leaf x={210} y={100} len={110} rot={0} dark />
            <Leaf x={210} y={100} len={100} rot={-20} />
            <Leaf x={120} y={110} len={80} rot={-200} />
            <Leaf x={300} y={110} len={80} rot={20} dark />
            <Berries x={96} y={78} />
            <Berries x={330} y={80} />
            <Hydrangea x={150} y={102} size={62} />
            <Hydrangea x={276} y={104} size={58} />
            <Rose x={110} y={120} size={46} tone="cream" rot={10} />
            <Rose x={312} y={124} size={44} tone="blush" />
            <Rose x={212} y={96} size={84} tone="wine" rot={-6} />
            <Rose x={170} y={130} size={50} tone="wine-dark" rot={30} />
            <Rose x={252} y={134} size={48} tone="wine-dark" rot={-20} />
          </>
        )}
        {variant === "sprig" && (
          <>
            <BabysBreath x={34} y={70} rot={-50} />
            <Leaf x={85} y={80} len={72} rot={-150} dark />
            <Leaf x={85} y={80} len={70} rot={-30} />
            <Leaf x={85} y={80} len={64} rot={130} />
            <Berries x={124} y={56} />
            <Rose x={64} y={98} size={46} tone="cream" rot={14} />
            <Rose x={92} y={74} size={62} tone="wine" />
          </>
        )}
      </g>
    </svg>
  );
}
