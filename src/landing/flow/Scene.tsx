/* Original illustration kit for the page: business objects in a navy and blue palette. */

export const C = {
  n950: '#081534',
  n900: '#0D1F4A',
  n800: '#14306E',
  royal: '#2450C8',
  blue: '#3F72E6',
  sky: '#8FB2F5',
  ice: '#DCE6FA',
  white: '#F6F9FF',
  steel: '#5F76A8',
};

const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

const ISO = (x: number, y: number, s = 1) => `translate(${x} ${y}) matrix(${0.866 * s} ${0.5 * s} ${-0.866 * s} ${0.5 * s} 0 0)`;

function Extrude({ d, depth = 16, dx = 0, dy = 1, side, top }: { d: string; depth?: number; dx?: number; dy?: number; side: string; top: string }) {
  return (
    <>
      {Array.from({ length: depth }, (_, i) => (
        <path key={i} d={d} fill={side} transform={`translate(${dx * (depth - i)} ${dy * (depth - i)})`} />
      ))}
      <path d={d} fill={top} />
    </>
  );
}

export function Defs() {
  return (
    <defs>
      <radialGradient id="tbGlobe" cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor={C.white} />
        <stop offset="0.42" stopColor={C.sky} />
        <stop offset="1" stopColor={C.royal} />
      </radialGradient>
      <linearGradient id="tbRod" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.white} />
        <stop offset="1" stopColor={C.sky} />
      </linearGradient>
      <linearGradient id="tbBg" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#12296A" />
        <stop offset="0.55" stopColor={C.n900} />
        <stop offset="1" stopColor={C.n950} />
      </linearGradient>
    </defs>
  );
}

export function Globe({ x, y, r, rings = true }: { x: number; y: number; r: number; rings?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {rings && (
        <g className="f-orbit" fill="none" stroke={C.ice} strokeOpacity="0.45" strokeWidth="2">
          <circle r={r * 1.42} />
          <circle r={r * 1.95} />
          <circle cx={r * 1.95} r="6" fill={C.ice} fillOpacity="1" stroke="none" />
          <circle cx={-r * 1} cy={r * 1} r="7" fill={C.sky} fillOpacity="1" stroke="none" />
        </g>
      )}
      <circle r={r} fill="url(#tbGlobe)" />
      <g fill="none" stroke={C.n800} strokeOpacity="0.35" strokeWidth="2">
        <ellipse rx={r} ry={r * 0.34} />
        <ellipse rx={r} ry={r * 0.72} />
        <ellipse rx={r * 0.38} ry={r} />
        <ellipse rx={r * 0.76} ry={r} />
      </g>
    </g>
  );
}

export function Badge({ x, y, s = 1, rotate = 0 }: { x: number; y: number; s?: number; rotate?: number }) {
  const shield = 'M120 0L230 40V130C230 200 170 242 120 262C70 242 10 200 10 130V40Z';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <Extrude d={shield} depth={26} dx={-0.8} dy={1} side={C.royal} top={C.ice} />
      <path d="M120 34L198 62V128C198 178 156 208 120 224C84 208 42 178 42 128V62Z" fill={C.n900} />
      <path d="M78 124L108 154L164 92" fill="none" stroke={C.ice} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function Bubble({ x, y, s = 1, rotate = 0, top = '#27407F', side = C.n950 }: { x: number; y: number; s?: number; rotate?: number; top?: string; side?: string }) {
  const d = `${rr(0, 0, 320, 190, 34)}M60 180L44 250L130 188Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <Extrude d={d} depth={18} dy={1} dx={0.5} side={side} top={top} />
      <g fill="none" stroke={C.ice} strokeWidth="5">
        <circle cx="96" cy="95" r="20" />
        <circle cx="160" cy="95" r="20" />
        <circle cx="224" cy="95" r="20" />
      </g>
    </g>
  );
}

export function Arrow({ x, y, length = 980, rotate = -58, s = 1 }: { x: number; y: number; length?: number; rotate?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <rect x="0" y="10" width={length} height="110" rx="10" fill={C.royal} />
      <rect x="0" y="-14" width={length} height="110" rx="10" fill="url(#tbRod)" />
      <g stroke={C.steel} strokeOpacity="0.5" strokeWidth="4">
        {Array.from({ length: Math.floor(length / 70) }, (_, i) => (
          <line key={i} x1={40 + i * 70} x2={40 + i * 70} y1="-14" y2={i % 3 === 0 ? 46 : 18} />
        ))}
      </g>
      <path d={`M${length} -60L${length + 190} 41L${length} 142Z`} fill={C.royal} />
      <path d={`M${length} -60L${length + 190} 41L${length} 41Z`} fill={C.blue} />
    </g>
  );
}

export function Team({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const person = (px: number, face: string) => (
    <g transform={`translate(${px} 0)`}>
      <circle cy="0" r="46" fill={face} />
      <circle cy="-12" r="15" fill={C.n900} />
      <path d="M-27 28C-24 8 24 8 27 28A46 46 0 0 1 -27 28Z" fill={C.n900} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {person(0, C.white)}
      {person(106, C.sky)}
      {person(212, C.blue)}
      <path d={`${rr(270, -84, 126, 92, 18)}`} fill="none" stroke={C.ice} strokeWidth="4" />
      <path d="M296 8L290 40L326 8" fill="none" stroke={C.ice} strokeWidth="4" strokeLinejoin="round" />
    </g>
  );
}

export function Tablet({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const bars = [90, 150, 118, 200, 170, 240];
  return (
    <g transform={ISO(x, y, s)}>
      <Extrude d={rr(0, 0, 620, 420, 34)} depth={24} dx={1} dy={1} side={C.n950} top={C.n800} />
      <path d={rr(24, 24, 572, 372, 20)} fill="#1A3A82" />
      {bars.map((h, i) => (
        <rect key={i} x={70 + i * 56} y={350 - h} width="34" height={h} rx="7" fill={i === 5 ? C.ice : C.sky} fillOpacity={i === 5 ? 1 : 0.6} />
      ))}
      <rect x="430" y="70" width="130" height="96" rx="14" fill={C.ice} />
      <rect x="448" y="90" width="72" height="9" rx="4" fill={C.royal} />
      <rect x="448" y="112" width="94" height="9" rx="4" fill={C.sky} />
      <rect x="448" y="134" width="56" height="9" rx="4" fill={C.sky} />
      <rect x="430" y="186" width="130" height="164" rx="14" fill={C.royal} />
      <circle cx="495" cy="268" r="42" fill="none" stroke={C.ice} strokeWidth="14" strokeDasharray="190 300" />
    </g>
  );
}

export function Funnel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const tiers = [
    { rx: 200, cy: 0, fill: C.ice, side: C.sky },
    { rx: 150, cy: 92, fill: C.sky, side: C.blue },
    { rx: 98, cy: 184, fill: C.blue, side: C.royal },
    { rx: 52, cy: 276, fill: C.royal, side: C.n800 },
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[...tiers].reverse().map((t) => (
        <g key={t.rx}>
          <ellipse cy={t.cy + 44} rx={t.rx} ry={t.rx * 0.34} fill={t.side} />
          <rect x={-t.rx} y={t.cy} width={t.rx * 2} height="44" fill={t.side} />
          <ellipse cy={t.cy} rx={t.rx} ry={t.rx * 0.34} fill={t.fill} />
        </g>
      ))}
    </g>
  );
}

export function Calendar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={ISO(x, y, s)}>
      <Extrude d={rr(0, 0, 340, 340, 30)} depth={22} dx={1} dy={1} side={C.steel} top={C.white} />
      <path d="M30 0H310A30 30 0 0 1 340 30V76H0V30A30 30 0 0 1 30 0Z" fill={C.royal} />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={36 + (i % 4) * 70} y={100 + Math.floor(i / 4) * 56} width="46" height="38" rx="8" fill={i === 6 ? C.royal : C.ice} />
      ))}
    </g>
  );
}

/** Quiet line work for the navy background: arcs, outlines and a small network. */
export function GeoLines() {
  const hex = 'M0 -90L78 -45V45L0 90L-78 45V-45Z';
  const nodes: [number, number][] = [
    [1330, 620],
    [1430, 540],
    [1520, 610],
    [1480, 730],
    [1370, 760],
  ];
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke={C.ice} strokeWidth="1.2" vectorEffect="non-scaling-stroke">
        {/* Left: arcs growing from the edge, with one turning dashed ring */}
        <g opacity="0.3">
          <circle cx="0" cy="470" r="130" />
          <circle cx="0" cy="470" r="215" />
          <circle cx="0" cy="470" r="300" />
        </g>
        <g transform="translate(0 470)" opacity="0.5">
          <circle className="f-geo__turn" r="255" strokeDasharray="4 16" />
        </g>
        <circle className="f-geo__orbit-dot" cx="130" cy="470" r="4" fill={C.ice} stroke="none" />

        {/* Top left: parallel diagonals */}
        <g className="f-geo__drift" opacity="0.22">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={40 + i * 34} y1="120" x2={-70 + i * 34} y2="270" />
          ))}
        </g>

        {/* Bottom left: small grid of plus marks */}
        <g opacity="0.34" className="f-geo__blink">
          {Array.from({ length: 12 }, (_, i) => {
            const x = 70 + (i % 4) * 52;
            const y = 770 + Math.floor(i / 4) * 44;
            return <path key={i} d={`M${x - 6} ${y}H${x + 6}M${x} ${y - 6}V${y + 6}`} />;
          })}
        </g>

        {/* Top right: nested squares, turning in opposite directions */}
        <g transform="translate(1450 250)" opacity="0.34">
          <rect className="f-geo__turn" x="-110" y="-110" width="220" height="220" rx="4" />
          <rect className="f-geo__turn f-geo__turn--back" x="-74" y="-74" width="148" height="148" rx="4" />
          <rect className="f-geo__turn" x="-40" y="-40" width="80" height="80" rx="4" />
        </g>

        {/* Bottom right: a small network with data moving along it */}
        <polygon points={nodes.map((n) => n.join(',')).join(' ')} opacity="0.26" />
        <polyline className="f-geo__flow" points={[nodes[0], nodes[1], nodes[2], nodes[3], nodes[4], nodes[0]].map((n) => n.join(',')).join(' ')} opacity="0.75" strokeDasharray="14 150" />
        <path d={`M${nodes[0].join(' ')}L${nodes[2].join(' ')}M${nodes[1].join(' ')}L${nodes[3].join(' ')}M${nodes[1].join(' ')}L${nodes[4].join(' ')}`} opacity="0.16" />
        {nodes.map(([x, y], i) => (
          <circle key={i} className="f-geo__node" style={{ animationDelay: `${i * -0.7}s` }} cx={x} cy={y} r="4.5" fill={C.sky} stroke="none" />
        ))}

        {/* Hexagon outlines, drifting behind the centre */}
        <g transform="translate(300 90)" opacity="0.2">
          <path className="f-geo__turn f-geo__turn--slow" d={hex} />
        </g>
        <g transform="translate(1240 860)" opacity="0.2">
          <path className="f-geo__turn f-geo__turn--slow f-geo__turn--back" d={hex} />
        </g>
      </g>
    </svg>
  );
}

export type TileKind = 'globe' | 'badge' | 'chart' | 'bubble' | 'calendar' | 'funnel' | 'team' | 'arrow';

function TileObject({ kind }: { kind: TileKind }) {
  switch (kind) {
    case 'globe':
      return <Globe x={100} y={100} r={52} />;
    case 'badge':
      return <Badge x={46} y={34} s={0.46} rotate={8} />;
    case 'chart':
      return <Tablet x={100} y={40} s={0.2} />;
    case 'bubble':
      return <Bubble x={34} y={46} s={0.42} rotate={-6} top={C.ice} side={C.sky} />;
    case 'calendar':
      return <Calendar x={100} y={22} s={0.34} />;
    case 'funnel':
      return <Funnel x={100} y={52} s={0.36} />;
    case 'team':
      return <Team x={38} y={100} s={0.42} />;
    default:
      return <Arrow x={34} y={160} length={120} rotate={-45} s={0.64} />;
  }
}

/** Square illustration. `bare` drops the rounded background so it can sit on a coloured card. */
export function Tile({ kind, bare, className = '' }: { kind: TileKind; bare?: boolean; className?: string }) {
  return (
    <svg className={`f-tile ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <Defs />
      {!bare && <rect width="200" height="200" rx="34" fill={kind === 'funnel' || kind === 'badge' ? C.n900 : C.royal} />}
      <TileObject kind={kind} />
    </svg>
  );
}
