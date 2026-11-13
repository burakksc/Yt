// Cozy rainy NYC alley — a seamless 60 s loop for long ambient videos.
// Every animation is periodic with a period that divides LOOP_FRAMES, so the last frame
// flows into the first. The 1-hour video is made by repeating this loop (ffmpeg, -c copy)
// and muxing a separately generated, non-repeating 1-hour soundscape.
import React from "react";
import {
  AbsoluteFill,
  Img,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const LOOP_FPS = 30;
export const LOOP_FRAMES = 60 * LOOP_FPS; // 1800

const W = 1920;
const H = 1080;
const TAU = Math.PI * 2;

/** Periodic wave: k full cycles per loop (k must be an integer for a seamless loop). */
const wave = (frame: number, k: number, phase = 0) =>
  Math.sin((TAU * k * frame) / LOOP_FRAMES + phase);

/* ---------- camera: very slow breathing zoom/pan ---------- */
const useCamera = () => {
  const f = useCurrentFrame();
  const s = 1.045 + 0.012 * wave(f, 1);
  const x = 10 * wave(f, 1, 1.3);
  const y = 6 * wave(f, 2, 0.4);
  return `translate(${x}px, ${y}px) scale(${s})`;
};

/* ---------- rain ---------- */
type Layer = {
  count: number;
  len: [number, number];
  width: number;
  opacity: number;
  cycles: [number, number]; // falls per loop (integer)
  seed: string;
};

const LAYERS: Layer[] = [
  {
    count: 650,
    len: [14, 26],
    width: 1.1,
    opacity: 0.22,
    cycles: [70, 95],
    seed: "far",
  },
  {
    count: 320,
    len: [28, 46],
    width: 1.6,
    opacity: 0.32,
    cycles: [95, 120],
    seed: "mid",
  },
  {
    count: 90,
    len: [60, 95],
    width: 2.4,
    opacity: 0.38,
    cycles: [120, 140],
    seed: "near",
  },
];

const LAMP = { x: 958, y: 86 };
const WIND = 0.16; // horizontal drift per vertical px

const Rain: React.FC = () => {
  const f = useCurrentFrame();
  const lines: React.ReactNode[] = [];
  for (const L of LAYERS) {
    for (let i = 0; i < L.count; i++) {
      const r = (k: string) => random(`${L.seed}-${k}-${i}`);
      const cycles = Math.round(
        L.cycles[0] + r("c") * (L.cycles[1] - L.cycles[0]),
      );
      const travel = H + 200;
      const y =
        ((r("y") * travel + (f * cycles * travel) / LOOP_FRAMES) % travel) -
        100;
      const x0 = r("x") * (W + 300) - 150;
      const x = x0 + y * WIND;
      const len = L.len[0] + r("l") * (L.len[1] - L.len[0]);
      // streaks near the street lamp catch the warm light
      const d = Math.hypot(x - LAMP.x, y - (LAMP.y + 160));
      const lit = Math.max(0, 1 - d / 420);
      const color =
        lit > 0.05
          ? `rgba(255,214,150,${L.opacity + lit * 0.5})`
          : `rgba(210,225,240,${L.opacity})`;
      lines.push(
        <line
          key={`${L.seed}${i}`}
          x1={x}
          y1={y}
          x2={x - len * WIND}
          y2={y - len}
          stroke={color}
          strokeWidth={L.width}
          strokeLinecap="round"
        />,
      );
    }
  }
  return <g>{lines}</g>;
};

/* ---------- ripples on the wet street ---------- */
// Street area (perspective): ripples are spread inside this quad.
const STREET = {
  topY: 700,
  botY: 1075,
  topL: 1035,
  topR: 1245,
  botL: 520,
  botR: 1460,
};
const PERIODS = [30, 36, 40, 45, 50, 60, 72, 75, 90]; // all divide 1800

const Ripples: React.FC = () => {
  const f = useCurrentFrame();
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 70; i++) {
    const P = PERIODS[Math.floor(random(`rp${i}`) * PERIODS.length)];
    const shift = Math.floor(random(`rs${i}`) * P);
    const local = (f + shift) % P;
    const cycle = Math.floor((f + shift) / P) % (LOOP_FRAMES / P);
    const t = local / P;
    const v = Math.pow(random(`rv${i}-${cycle}`), 0.6); // bias toward the near (bottom) part
    const y = STREET.topY + v * (STREET.botY - STREET.topY);
    const l = STREET.topL + (STREET.botL - STREET.topL) * v;
    const rr = STREET.topR + (STREET.botR - STREET.topR) * v;
    const x = l + random(`rx${i}-${cycle}`) * (rr - l);
    const scale = 0.35 + v * 1.1;
    const rx = (4 + t * 22) * scale;
    out.push(
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={rx}
        ry={rx * 0.3}
        fill="none"
        stroke="rgba(235,225,210,1)"
        strokeWidth={1.4 * scale}
        opacity={(1 - t) * 0.55}
      />,
    );
  }
  return <g>{out}</g>;
};

/* ---------- steam from the manhole ---------- */
const MANHOLE = { x: 1218, y: 975 };

const Steam: React.FC = () => {
  const f = useCurrentFrame();
  const puffs: React.ReactNode[] = [];
  const LIFE = 150; // 5 s, divides 1800
  for (let i = 0; i < 18; i++) {
    const shift = Math.floor((i / 18) * LIFE);
    const local = (f + shift) % LIFE;
    const t = local / LIFE;
    const sway = Math.sin(t * 5 + i) * 18;
    const x = MANHOLE.x + sway + t * 90 + (random(`sx${i}`) - 0.5) * 40;
    const y = MANHOLE.y - t * 360;
    const r = 30 + t * 120;
    const a = Math.sin(Math.PI * t) * 0.16;
    puffs.push(
      <circle key={i} cx={x} cy={y} r={r} fill="url(#steam)" opacity={a} />,
    );
  }
  return <g>{puffs}</g>;
};

/* ---------- lights ---------- */
const Lights: React.FC = () => {
  const f = useCurrentFrame();
  // gentle lamp flicker + two short dips per loop
  let lamp = 0.82 + 0.05 * wave(f, 37) + 0.03 * wave(f, 91, 1);
  const dip = (at: number) => Math.max(0, 1 - Math.abs(f - at) / 3);
  lamp -= 0.35 * (dip(612) + dip(618) + dip(1410));
  const neon =
    0.75 + 0.15 * wave(f, 53) + (f % 900 > 880 && f % 4 < 2 ? -0.5 : 0);
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <circle
        cx={LAMP.x}
        cy={LAMP.y}
        r={320}
        fill="url(#lamp)"
        opacity={lamp}
      />
      <circle
        cx={LAMP.x}
        cy={LAMP.y}
        r={60}
        fill="url(#lampCore)"
        opacity={lamp}
      />
      {/* warm reflection on the wet ground under the lamp */}
      <ellipse
        cx={1085}
        cy={890}
        rx={70}
        ry={190}
        fill="url(#reflect)"
        opacity={0.35 * lamp + 0.05 * wave(f, 23)}
      />
      {/* distant red neon sign */}
      <ellipse
        cx={1080}
        cy={430}
        rx={26}
        ry={60}
        fill="url(#neon)"
        opacity={neon * 0.6}
      />
      <ellipse
        cx={1110}
        cy={505}
        rx={22}
        ry={40}
        fill="url(#neon)"
        opacity={neon * 0.45}
      />
    </g>
  );
};

export const CozyAlley: React.FC = () => {
  const camera = useCamera();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0e", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: camera }}>
        <Img
          src={staticFile("cozy-alley/alley.png")}
          style={{ width: W, height: H, objectFit: "cover" }}
        />
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <radialGradient id="lamp">
              <stop offset="0" stopColor="#ffd38a" stopOpacity={0.55} />
              <stop offset="0.35" stopColor="#ffb860" stopOpacity={0.18} />
              <stop offset="1" stopColor="#ffb860" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="lampCore">
              <stop offset="0" stopColor="#fff3d6" stopOpacity={0.9} />
              <stop offset="1" stopColor="#ffcf80" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="reflect">
              <stop offset="0" stopColor="#ffb36b" stopOpacity={0.7} />
              <stop offset="1" stopColor="#ffb36b" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="neon">
              <stop offset="0" stopColor="#ff4a3a" stopOpacity={0.8} />
              <stop offset="1" stopColor="#ff4a3a" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="steam">
              <stop offset="0" stopColor="#e9e4dc" stopOpacity={1} />
              <stop offset="0.6" stopColor="#d9d4cc" stopOpacity={0.4} />
              <stop offset="1" stopColor="#d9d4cc" stopOpacity={0} />
            </radialGradient>
          </defs>
          <Steam />
          <Ripples />
          <Lights />
          <Rain />
        </svg>
      </AbsoluteFill>
      {/* cozy grade: warm lift + soft vignette */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(40,60,90,0.10) 0%, rgba(255,170,90,0.06) 60%, rgba(255,150,80,0.08) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 55% 50%, rgba(0,0,0,0) 55%, rgba(8,6,10,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
