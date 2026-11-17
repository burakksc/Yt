// Cozy winter cabin with a fireplace — seamless 60 s loop (illustrated, all code).
// Every motion is periodic with an integer number of cycles per LOOP_FRAMES, so the
// last frame flows into the first. The 1-hour video repeats this loop (build_loop_video.sh)
// under a non-repeating fire/wind soundtrack (scripts/ambience/make_fire_ambience.py).
// Mascot: the sleeping ginger cat from the channel logo.
import React, { useId } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

export const FIRE_FPS = 30;
export const FIRE_LOOP = 60 * FIRE_FPS; // 1800

const W = 1920;
const H = 1080;
const TAU = Math.PI * 2;
/** k full cycles per loop — k must be an integer for a seamless loop. */
const wave = (f: number, k: number, ph = 0) =>
  Math.sin((TAU * k * f) / FIRE_LOOP + ph);

const C = {
  wall1: "#3b2416",
  wall2: "#24150c",
  plank: "#2a180d",
  beam: "#1c0f08",
  floor: "#2a170c",
  stone: "#6b5a4c",
  stoneDark: "#3e3229",
  mantel: "#4a2b17",
  fireOut: "#ff7a1f",
  fireMid: "#ffb43a",
  fireCore: "#fff1b8",
  night: "#0d1a33",
  moon: "#f4ecd2",
  cat: "#e08a3c",
  catDark: "#b5622a",
  catLight: "#f6c08a",
  knit: "#7a4f6b",
};

const Glow: React.FC<{
  cx: number;
  cy: number;
  r: number;
  color: string;
  o: number;
  rx?: number;
}> = ({ cx, cy, r, color, o, rx }) => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={o} />
          <stop offset="0.45" stopColor={color} stopOpacity={o * 0.35} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx ?? r} ry={r} fill={`url(#${id})`} />
    </>
  );
};

/** Firelight intensity, shared by everything the fire illuminates. */
const useFireLight = () => {
  const f = useCurrentFrame();
  return (
    0.82 +
    0.08 * wave(f, 53) +
    0.06 * wave(f, 97, 1.3) +
    0.04 * wave(f, 151, 2.1)
  );
};

/* ---------------- room ---------------- */

const Wall: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="wallg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.wall2} />
        <stop offset="1" stopColor={C.wall1} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#wallg)" />
    {new Array(26).fill(0).map((_, i) => (
      <line
        key={i}
        x1={i * 76}
        y1={0}
        x2={i * 76}
        y2={830}
        stroke={C.plank}
        strokeWidth={4}
        opacity={0.6}
      />
    ))}
    {/* ceiling beams */}
    <rect x={0} y={0} width={W} height={70} fill={C.beam} />
    {[180, 700, 1220, 1740].map((x) => (
      <path
        key={x}
        d={`M ${x - 40} 0 L ${x + 40} 0 L ${x + 30} 110 L ${x - 30} 110 Z`}
        fill={C.beam}
      />
    ))}
    {/* floor */}
    <rect x={0} y={830} width={W} height={H - 830} fill={C.floor} />
    {new Array(8).fill(0).map((_, i) => (
      <line
        key={i}
        x1={0}
        y1={850 + i * 32}
        x2={W}
        y2={850 + i * 32}
        stroke="#1d0f07"
        strokeWidth={3}
      />
    ))}
  </g>
);

const FairyLights: React.FC = () => {
  const f = useCurrentFrame();
  const pts: React.ReactNode[] = [];
  const spans: [number, number][] = [
    [140, 660],
    [740, 1180],
    [1260, 1780],
  ];
  spans.forEach(([x1, x2], s) => {
    const sag = 60;
    const d = `M ${x1} 96 Q ${(x1 + x2) / 2} ${96 + sag * 2} ${x2} 96`;
    pts.push(
      <path key={`w${s}`} d={d} stroke="#0d0805" strokeWidth={3} fill="none" />,
    );
    for (let i = 1; i < 12; i++) {
      const t = i / 12;
      const x = x1 + (x2 - x1) * t;
      const y = 96 + sag * 2 * 2 * t * (1 - t);
      const k = 7 + Math.floor(random(`fl${s}${i}`) * 9);
      const tw = 0.6 + 0.4 * wave(f, k, random(`fp${s}${i}`) * TAU);
      pts.push(
        <g key={`${s}${i}`}>
          <Glow cx={x} cy={y + 6} r={34} color="#ffd38a" o={0.55 * tw} />
          <circle
            cx={x}
            cy={y + 6}
            r={5}
            fill="#fff0c4"
            opacity={0.6 + 0.4 * tw}
          />
        </g>,
      );
    }
  });
  return <g>{pts}</g>;
};

const Bookshelf: React.FC = () => {
  const L = useFireLight();
  const books: React.ReactNode[] = [];
  const colors = [
    "#6d2a1f",
    "#2f4a3a",
    "#7a5a2a",
    "#3a3352",
    "#5a1f2c",
    "#2a4058",
    "#8a6a3a",
  ];
  for (let r = 0; r < 5; r++) {
    let x = 110;
    let i = 0;
    while (x < 500) {
      const w = 16 + random(`bw${r}${i}`) * 18;
      const h = 70 + random(`bh${r}${i}`) * 34;
      books.push(
        <rect
          key={`${r}${i}`}
          x={x}
          y={262 + r * 120 - h}
          width={w}
          height={h}
          fill={colors[(r * 3 + i) % colors.length]}
        />,
      );
      if (random(`bl${r}${i}`) > 0.6)
        books.push(
          <rect
            key={`l${r}${i}`}
            x={x + 3}
            y={262 + r * 120 - h + 12}
            width={w - 6}
            height={4}
            fill="#d9b06a"
            opacity={0.6}
          />,
        );
      x += w + 2;
      i++;
    }
  }
  return (
    <g>
      <rect x={90} y={140} width={430} height={700} fill="#1e110a" />
      {new Array(6).fill(0).map((_, r) => (
        <rect
          key={r}
          x={90}
          y={262 + r * 120}
          width={430}
          height={14}
          fill="#3a2214"
        />
      ))}
      {books}
      <rect
        x={90}
        y={140}
        width={430}
        height={700}
        fill="#ffb060"
        opacity={0.08 * L}
      />
    </g>
  );
};

const Fireplace: React.FC = () => {
  const L = useFireLight();
  const stones: React.ReactNode[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const x = 620 + c * 80 + (r % 2) * 40 - 20;
      const y = 400 + r * 52;
      const inBox = x > 740 && x < 1180 && y > 540;
      if (inBox || x < 600 || x > 1300) continue;
      const s = random(`st${r}${c}`);
      stones.push(
        <rect
          key={`${r}${c}`}
          x={x}
          y={y}
          width={74}
          height={46}
          rx={14}
          fill={s > 0.5 ? C.stone : "#5d4e42"}
          stroke={C.stoneDark}
          strokeWidth={4}
        />,
      );
    }
  }
  return (
    <g>
      <rect x={600} y={390} width={720} height={450} fill={C.stoneDark} />
      {stones}
      {/* firebox */}
      <path
        d="M 760 840 L 760 600 Q 960 500 1160 600 L 1160 840 Z"
        fill="#120a06"
      />
      <path
        d="M 760 840 L 760 600 Q 960 500 1160 600 L 1160 840 Z"
        fill="none"
        stroke="#2c211a"
        strokeWidth={12}
      />
      {/* hearth */}
      <rect x={560} y={830} width={800} height={34} rx={6} fill="#4d4038" />
      {/* mantel */}
      <rect x={560} y={356} width={800} height={42} rx={6} fill={C.mantel} />
      <rect x={560} y={356} width={800} height={10} fill="#6a4026" />
      {/* warm wash on the stones */}
      <Glow cx={960} cy={700} r={420} rx={520} color="#ff9a3c" o={0.35 * L} />
    </g>
  );
};

const Fire: React.FC = () => {
  const f = useCurrentFrame();
  const L = useFireLight();
  const base = 800;
  const tongues = [
    { x: 860, h: 150, w: 70, k: 41 },
    { x: 920, h: 200, w: 80, k: 37 },
    { x: 975, h: 230, w: 90, k: 47 },
    { x: 1030, h: 190, w: 80, k: 43 },
    { x: 1080, h: 140, w: 64, k: 53 },
  ];
  const flame = (
    x: number,
    h: number,
    w: number,
    k: number,
    ph: number,
    scale: number,
    color: string,
  ) => {
    const hh =
      h *
      scale *
      (0.82 + 0.12 * wave(f, k, ph) + 0.06 * wave(f, k * 2 + 1, ph * 1.7));
    const sway = 14 * wave(f, Math.round(k / 3), ph + 1);
    const ww = w * scale;
    return (
      <path
        d={`M ${x - ww / 2} ${base} C ${x - ww / 2} ${base - hh * 0.45} ${x - ww * 0.15 + sway * 0.5} ${base - hh * 0.6} ${x + sway} ${base - hh} C ${x + ww * 0.2 + sway * 0.5} ${base - hh * 0.6} ${x + ww / 2} ${base - hh * 0.45} ${x + ww / 2} ${base} Z`}
        fill={color}
      />
    );
  };
  // sparks: each rises over P frames; position re-randomised per cycle (cycle index wraps)
  const P = 90;
  const sparks = new Array(16).fill(0).map((_, i) => {
    const shift = Math.floor(random(`sp${i}`) * P);
    const t = ((f + shift) % P) / P;
    const cyc = Math.floor((f + shift) / P) % (FIRE_LOOP / P);
    const x0 = 880 + random(`spx${i}-${cyc}`) * 170;
    const drift = (random(`spd${i}-${cyc}`) - 0.5) * 80;
    return (
      <circle
        key={i}
        cx={x0 + drift * t + 6 * Math.sin(t * 9 + i)}
        cy={base - 80 - t * 260}
        r={2.5}
        fill="#ffd27a"
        opacity={(1 - t) * 0.9}
      />
    );
  });
  return (
    <g>
      <Glow cx={960} cy={760} r={220} rx={260} color="#ff8a2a" o={0.75 * L} />
      {/* logs */}
      <g>
        <rect
          x={830}
          y={790}
          width={260}
          height={34}
          rx={17}
          fill="#4a2a17"
          transform="rotate(-8 960 805)"
        />
        <rect
          x={840}
          y={792}
          width={260}
          height={34}
          rx={17}
          fill="#5a3420"
          transform="rotate(9 960 808)"
        />
        <circle cx={1088} cy={790} r={16} fill="#7a4a2a" />
        <circle cx={1088} cy={790} r={9} fill="#9a6a3a" />
      </g>
      {tongues.map((t, i) => (
        <g key={i}>
          {flame(t.x, t.h, t.w, t.k, i * 1.3, 1, C.fireOut)}
          {flame(t.x, t.h, t.w, t.k + 6, i * 1.3 + 0.4, 0.7, C.fireMid)}
          {flame(t.x, t.h, t.w, t.k + 11, i * 1.3 + 0.8, 0.38, C.fireCore)}
        </g>
      ))}
      {/* embers bed */}
      {new Array(14).fill(0).map((_, i) => (
        <circle
          key={i}
          cx={830 + i * 20}
          cy={826 + (i % 3) * 3}
          r={8}
          fill="#ff6a1a"
          opacity={0.5 + 0.4 * wave(f, 13 + i, i)}
        />
      ))}
      {sparks}
    </g>
  );
};

const Candle: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => {
  const f = useCurrentFrame();
  const fl = 0.85 + 0.15 * wave(f, 61 + (Math.round(x) % 7), x);
  return (
    <g>
      <Glow cx={x} cy={y - h - 16} r={70 * fl} color="#ffc56a" o={0.6} />
      <rect x={x - 11} y={y - h} width={22} height={h} rx={3} fill="#f3e3c4" />
      <path
        d={`M ${x} ${y - h - 30 * fl} C ${x + 8} ${y - h - 12} ${x + 6} ${y - h} ${x} ${y - h} C ${x - 6} ${y - h} ${x - 8} ${y - h - 12} ${x} ${y - h - 30 * fl} Z`}
        fill="#ffcf6a"
      />
    </g>
  );
};

const Window: React.FC = () => {
  const f = useCurrentFrame();
  const x0 = 1420;
  const y0 = 170;
  const w = 400;
  const h = 560;
  const id = useId();
  const flakes = new Array(70).fill(0).map((_, i) => {
    const cycles = 4 + Math.floor(random(`sn${i}`) * 4); // falls per loop
    const yy = (random(`sny${i}`) * h + (f * cycles * h) / FIRE_LOOP) % h;
    const xx = random(`snx${i}`) * w + 10 * wave(f, 6 + (i % 5), i);
    return (
      <circle
        key={i}
        cx={x0 + xx}
        cy={y0 + yy}
        r={1.5 + random(`snr${i}`) * 2.5}
        fill="white"
        opacity={0.85}
      />
    );
  });
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x0} y={y0} width={w} height={h} />
        </clipPath>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#081226" />
          <stop offset="1" stopColor="#1d3358" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}s)`} />
        <Glow cx={x0 + 300} cy={y0 + 110} r={120} color="#cfe0ff" o={0.35} />
        <circle cx={x0 + 300} cy={y0 + 110} r={42} fill={C.moon} />
        {/* snowy hills + pines */}
        <path
          d={`M ${x0} ${y0 + 470} Q ${x0 + 200} ${y0 + 420} ${x0 + w} ${y0 + 460} L ${x0 + w} ${y0 + h} L ${x0} ${y0 + h} Z`}
          fill="#c9d6ea"
        />
        {[40, 110, 190, 270, 340].map((px, i) => (
          <path
            key={px}
            d={`M ${x0 + px} ${y0 + 470 - 90 - i * 8} L ${x0 + px + 40} ${y0 + 480} L ${x0 + px - 40} ${y0 + 480} Z`}
            fill="#0e1c2e"
          />
        ))}
        {flakes}
      </g>
      {/* frame + mullions + snow on the sill */}
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        fill="none"
        stroke="#2a180c"
        strokeWidth={22}
      />
      <line
        x1={x0 + w / 2}
        y1={y0}
        x2={x0 + w / 2}
        y2={y0 + h}
        stroke="#2a180c"
        strokeWidth={14}
      />
      <line
        x1={x0}
        y1={y0 + h / 2}
        x2={x0 + w}
        y2={y0 + h / 2}
        stroke="#2a180c"
        strokeWidth={14}
      />
      <path
        d={`M ${x0 + 12} ${y0 + h - 12} q 40 -18 80 0 q 60 -14 120 0 q 60 -16 120 0 q 30 -10 56 0 Z`}
        fill="#e8eef8"
        opacity={0.85}
      />
      <rect
        x={x0 - 30}
        y={y0 + h + 6}
        width={w + 60}
        height={24}
        fill="#3a2214"
      />
    </g>
  );
};

const Armchair: React.FC = () => {
  const f = useCurrentFrame();
  const breathe = 1 + 0.025 * wave(f, 24);
  return (
    <g>
      {/* chair */}
      <path
        d="M 250 880 L 250 610 Q 250 540 330 540 L 560 540 Q 640 540 640 610 L 640 880 Z"
        fill="#6a2f22"
      />
      <rect x={220} y={680} width={90} height={200} rx={40} fill="#7a3828" />
      <rect x={580} y={680} width={90} height={200} rx={40} fill="#7a3828" />
      <rect x={290} y={720} width={320} height={80} rx={26} fill="#8a4230" />
      {/* knitted blanket */}
      <path
        d="M 300 700 Q 450 670 600 705 L 610 800 Q 450 780 290 800 Z"
        fill={C.knit}
      />
      {new Array(9).fill(0).map((_, i) => (
        <path
          key={i}
          d={`M ${310 + i * 34} 700 q 8 40 0 92`}
          stroke="#5f3c53"
          strokeWidth={5}
          fill="none"
          opacity={0.7}
        />
      ))}
      {/* sleeping ginger cat (logo mascot) */}
      <g
        transform={`translate(450 712) scale(1 ${breathe}) translate(-450 -712)`}
      >
        <ellipse cx={450} cy={700} rx={120} ry={48} fill={C.cat} />
        {new Array(6).fill(0).map((_, i) => (
          <path
            key={i}
            d={`M ${370 + i * 30} 662 q 10 30 0 70`}
            stroke={C.catDark}
            strokeWidth={9}
            fill="none"
            opacity={0.75}
          />
        ))}
        <path
          d="M 340 720 Q 300 760 380 752 Q 470 748 520 735"
          stroke={C.cat}
          strokeWidth={26}
          fill="none"
          strokeLinecap="round"
        />
        {/* head tucked */}
        <ellipse cx={548} cy={708} rx={48} ry={40} fill={C.cat} />
        <path d="M 520 678 L 528 640 L 548 672 Z" fill={C.cat} />
        <path d="M 560 674 L 580 640 L 584 680 Z" fill={C.cat} />
        <path d="M 527 672 L 531 652 L 541 668 Z" fill="#f2a58a" />
        <ellipse cx={556} cy={724} rx={22} ry={14} fill={C.catLight} />
        <path
          d="M 530 704 q 8 6 16 0"
          stroke="#3a2214"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 556 704 q 8 6 16 0"
          stroke="#3a2214"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={552} cy={718} r={3.5} fill="#c86a6a" />
      </g>
    </g>
  );
};

const SideTable: React.FC = () => {
  const f = useCurrentFrame();
  const LIFE = 120;
  const steam = new Array(8).fill(0).map((_, i) => {
    const t = ((f + i * 15) % LIFE) / LIFE;
    return (
      <circle
        key={i}
        cx={1700 + Math.sin(t * 6 + i) * 10 + t * 14}
        cy={738 - t * 140}
        r={8 + t * 22}
        fill="#f4ecdf"
        opacity={Math.sin(Math.PI * t) * 0.22}
      />
    );
  });
  return (
    <g>
      <rect x={1460} y={780} width={330} height={20} rx={6} fill="#4a2b17" />
      <rect x={1480} y={800} width={16} height={60} fill="#3a2214" />
      <rect x={1754} y={800} width={16} height={60} fill="#3a2214" />
      {/* moon lamp (from the logo) */}
      <Glow cx={1530} cy={720} r={150} color="#ffcf7a" o={0.55} />
      <circle cx={1530} cy={720} r={52} fill="#ffd98a" />
      {new Array(6).fill(0).map((_, i) => (
        <circle
          key={i}
          cx={1508 + random(`mc${i}`) * 44}
          cy={700 + random(`mcy${i}`) * 40}
          r={4 + random(`mcr${i}`) * 6}
          fill="#e8b25a"
          opacity={0.6}
        />
      ))}
      <rect x={1510} y={770} width={40} height={10} rx={3} fill="#3a2214" />
      {/* globe */}
      <circle
        cx={1615}
        cy={730}
        r={38}
        fill="#3a5b6a"
        stroke="#b08a4a"
        strokeWidth={5}
      />
      <path
        d="M 1595 712 q 18 -6 24 8 q -10 14 -26 6 Z M 1620 740 q 14 -4 18 10 q -12 10 -20 0 Z"
        fill="#9a8a5a"
      />
      <rect x={1611} y={768} width={8} height={12} fill="#b08a4a" />
      {/* mug */}
      <rect x={1676} y={738} width={50} height={44} rx={8} fill="#2e3a5c" />
      <path
        d="M 1726 748 q 22 2 0 24"
        stroke="#2e3a5c"
        strokeWidth={8}
        fill="none"
      />
      <path
        d="M 1694 760 a 7 7 0 1 0 8 -10 a 5 5 0 1 1 -8 10 Z"
        fill="#f4ecd2"
      />
      {steam}
    </g>
  );
};

export const CozyFireplace: React.FC = () => {
  const L = useFireLight();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <Wall />
        <Bookshelf />
        <Window />
        <Fireplace />
        <Fire />
        {/* painting above the mantel */}
        <rect
          x={830}
          y={170}
          width={260}
          height={160}
          fill="#1a0f08"
          stroke="#8a6a3a"
          strokeWidth={10}
        />
        <rect x={840} y={180} width={240} height={140} fill="#1c2e4a" />
        <circle cx={1030} cy={215} r={18} fill={C.moon} />
        <path
          d="M 840 320 L 900 250 L 950 300 L 1000 240 L 1080 320 Z"
          fill="#dfe8f4"
        />
        {/* mantel decor */}
        <Candle x={640} y={356} h={60} />
        <Candle x={690} y={356} h={40} />
        <Candle x={1230} y={356} h={50} />
        <Candle x={1280} y={356} h={70} />
        <path
          d="M 600 360 q 40 -20 80 0 q 40 -20 80 0"
          stroke="#2f5a3a"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 1160 360 q 40 -20 80 0 q 40 -20 80 0"
          stroke="#2f5a3a"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
        />
        <FairyLights />
        {/* rug */}
        <ellipse cx={960} cy={960} rx={560} ry={80} fill="#5a2a22" />
        <ellipse
          cx={960}
          cy={960}
          rx={500}
          ry={64}
          fill="none"
          stroke="#c9a46a"
          strokeWidth={6}
          opacity={0.6}
        />
        {/* log basket */}
        <rect x={1340} y={800} width={120} height={70} rx={10} fill="#3a2214" />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={1365 + i * 35}
            cy={800}
            r={18}
            fill="#7a4a2a"
            stroke="#4a2a17"
            strokeWidth={5}
          />
        ))}
        <Armchair />
        <SideTable />
        <Glow
          cx={960}
          cy={720}
          r={900}
          rx={1100}
          color="#ff9440"
          o={0.18 * L}
        />
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 62%, rgba(0,0,0,0) 45%, rgba(5,2,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
