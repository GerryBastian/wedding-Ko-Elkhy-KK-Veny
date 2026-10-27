import type { Photo } from "@/types";

type Medallion = { photo: Photo; name: string; label: string };

/**
 * Dua medali oval emas tergantung pada rantai halus, bertingkat & berayun pelan.
 * Sistem koordinat 320 x 310.
 */
export function HangingMedallions({ left, right, className }: { left: Medallion; right: Medallion; className?: string }) {
  return (
    <svg viewBox="0 0 320 310" className={className} role="img" aria-label={`Foto ${left.label} dan ${right.label}`}>
      <Pendant {...left} id="l" x={92} drop={34} delay={0} />
      <Pendant {...right} id="r" x={228} drop={64} delay={-2.5} />
    </svg>
  );
}

const RX = 54;
const RY = 70;

function ellipseDots(cx: number, cy: number, rx: number, ry: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
}

function Pendant({ photo, name, label, id, x, drop, delay }: Medallion & { id: string; x: number; drop: number; delay: number }) {
  const bailY = drop;
  const cy = bailY + 14 + RY;
  const bottom = cy + RY;
  const beads = ellipseDots(x, cy, RX - 6.5, RY - 6.5, 54);

  return (
    <g
      style={{
        transformBox: "view-box",
        transformOrigin: `${x}px 0px`,
        animation: `pendant-sway 7s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* Rantai halus */}
      {/* Warna solid: gradien objectBoundingBox tidak terender pada garis lurus (lebar 0) */}
      <line x1={x} y1="0" x2={x} y2={bailY - 4} stroke="#c9a35f" strokeWidth="1.7" strokeDasharray="3.2 1.4" strokeLinecap="round" />
      <line x1={x} y1="0" x2={x} y2={bailY - 4} stroke="#fff3cf" strokeOpacity="0.55" strokeWidth="0.6" strokeDasharray="1 3.6" />

      <g filter="url(#gilded)" fill="url(#gold-leaf)">
        {/* Cincin gantungan */}
        <ellipse cx={x} cy={bailY} rx="4.2" ry="5.2" fill="none" stroke="url(#gold-leaf)" strokeWidth="2.2" />
        {/* Hiasan kecil di puncak bingkai */}
        <path d={`M${x} ${bailY + 5} C${x - 3} ${bailY + 9} ${x - 3} ${bailY + 12} ${x} ${bailY + 15} C${x + 3} ${bailY + 12} ${x + 3} ${bailY + 9} ${x} ${bailY + 5}Z`} />
        <path d={`M${x - 3} ${bailY + 13} C${x - 9} ${bailY + 11} ${x - 13} ${bailY + 14} ${x - 15} ${bailY + 18} C${x - 10} ${bailY + 17} ${x - 6} ${bailY + 16} ${x - 3} ${bailY + 15}Z`} />
        <path d={`M${x + 3} ${bailY + 13} C${x + 9} ${bailY + 11} ${x + 13} ${bailY + 14} ${x + 15} ${bailY + 18} C${x + 10} ${bailY + 17} ${x + 6} ${bailY + 16} ${x + 3} ${bailY + 15}Z`} />
      </g>

      {/* Foto oval */}
      <clipPath id={`medal-${id}`}>
        <ellipse cx={x} cy={cy} rx={RX - 9} ry={RY - 9} />
      </clipPath>
      <ellipse cx={x} cy={cy} rx={RX - 9} ry={RY - 9} fill="#2a0710" />
      <image
        href={photo.src}
        x={x - RX}
        y={cy - RY}
        width={RX * 2}
        height={RY * 2.2}
        preserveAspectRatio="xMidYMin slice"
        clipPath={`url(#medal-${id})`}
      >
        <title>{label}</title>
      </image>
      {/* Bayangan dalam tipis */}
      <ellipse cx={x} cy={cy} rx={RX - 9} ry={RY - 9} fill="none" stroke="#1a0408" strokeOpacity="0.45" strokeWidth="3" />

      <g filter="url(#gilded)" fill="url(#gold-leaf)">
        {/* Bezel emas tipis */}
        <ellipse cx={x} cy={cy} rx={RX - 2} ry={RY - 2} fill="none" stroke="url(#gold-leaf)" strokeWidth="5.5" />
        {beads.map((b, i) => (
          <circle key={i} cx={b.x.toFixed(2)} cy={b.y.toFixed(2)} r="1.25" />
        ))}
        {/* Tutup mutiara */}
        <path d={`M${x - 4} ${bottom + 1} H${x + 4} L${x + 2.5} ${bottom + 6} H${x - 2.5}Z`} />
      </g>
      <circle cx={x} cy={bottom + 12} r="6.2" fill="url(#pearl)" filter="url(#soft-shadow)" />

      {/* Nama terukir */}
      <text
        x={x}
        y={bottom + 46}
        textAnchor="middle"
        fontFamily="var(--font-pinyon), 'Pinyon Script', cursive"
        fontSize="30"
        fill="url(#gold-leaf)"
      >
        {name}
      </text>
    </g>
  );
}
