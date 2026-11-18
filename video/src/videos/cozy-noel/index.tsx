// Cozy Christmas library (1920x1080): SDXL still (projects/cozy-noel/C.png, upscaled) brought to life.
// - real flame pixels warped by an animated SVG displacement filter + brightness flicker
// - warm light glows that flicker with the fire and candles
// - 3-layer snowfall visible only through the window panes (window_mask.png)
// Rendered as a NOEL_LOOP+2 s clip; the extra 2 s are cross-faded into the start (seamless loop).
import React from "react";
import {
  AbsoluteFill,
  Img,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const NOEL_FPS = 30;
export const NOEL_LOOP = 60; // seconds
export const NOEL_FRAMES = (NOEL_LOOP + 2) * NOEL_FPS;

const K = 1920 / 1344; // source -> output scale
const ROOM = staticFile("cozy-noel/room.png");

// flame centres in source pixels (auto-detected bright spots), r = crop radius (source px)
const CANDLES: { x: number; y: number; r: number }[] = [
  { x: 732, y: 182, r: 9 },
  { x: 757, y: 183, r: 6 },
  { x: 717, y: 195, r: 6 },
  { x: 933, y: 191, r: 8 },
  { x: 945, y: 179, r: 7 },
  { x: 891, y: 253, r: 6 },
  { x: 648, y: 184, r: 6 },
  { x: 679, y: 499, r: 8 },
  { x: 577, y: 532, r: 7 },
  { x: 614, y: 534, r: 7 },
  { x: 251, y: 519, r: 6 },
  { x: 1298, y: 599, r: 7 },
  { x: 1303, y: 655, r: 8 },
  { x: 1254, y: 660, r: 7 },
  { x: 1232, y: 663, r: 6 },
];
const FIRE = { x: 838, y: 482, w: 120, h: 70 };
const TREE_LIGHTS: [number, number][] = [
  [1147, 108],
  [1119, 326],
  [1067, 290],
  [1156, 354],
  [1257, 361],
  [1064, 424],
  [1130, 200],
  [1180, 260],
  [1100, 380],
  [1210, 400],
];
// window boxes in output px (snow is generated inside these and clipped by the pane mask)
const WINDOWS = [
  { x: 505, y: 150, w: 260, h: 460 },
  { x: 1885, y: 130, w: 40, h: 500 },
];

/** Smooth-ish random flicker in [0,1] (two octaves of value noise + sines). */
const flick = (t: number, seed: string, speed = 10) => {
  const v = (k: number) => random(`${seed}-${k}`);
  const a = t * speed;
  const i = Math.floor(a);
  const f = a - i;
  const s = f * f * (3 - 2 * f);
  const n1 = v(i) * (1 - s) + v(i + 1) * s;
  const b = t * speed * 2.7;
  const j = Math.floor(b);
  const g = b - j;
  const n2 =
    v(j + 999) * (1 - g * g * (3 - 2 * g)) +
    v(j + 1000) * (g * g * (3 - 2 * g));
  return (
    0.55 * n1 + 0.3 * n2 + 0.15 * (0.5 + 0.5 * Math.sin(t * 7.3 + v(-1) * 6))
  );
};

/** A crop of the room image around a flame, warped by the shared turbulence filter. */
const Flame: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  filter: string;
  bright: number;
}> = ({ x, y, w, h, filter, bright }) => {
  const X = x * K;
  const Y = y * K;
  const W = w * K;
  const H = h * K;
  return (
    <div
      style={{
        position: "absolute",
        left: X - W / 2,
        top: Y - H / 2,
        width: W,
        height: H,
        overflow: "hidden",
        borderRadius: "50%",
        filter: `url(#${filter}) brightness(${bright})`,
        WebkitMaskImage:
          "radial-gradient(closest-side, #000 60%, transparent 100%)",
        maskImage: "radial-gradient(closest-side, #000 60%, transparent 100%)",
      }}
    >
      <Img
        src={ROOM}
        style={{
          position: "absolute",
          left: -(X - W / 2),
          top: -(Y - H / 2),
          width: 1920,
          height: 1080,
          maxWidth: "none",
        }}
      />
    </div>
  );
};

const Glow: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
  o: number;
}> = ({ x, y, r, color, o }) => (
  <div
    style={{
      position: "absolute",
      left: x * K - r,
      top: y * K - r,
      width: 2 * r,
      height: 2 * r,
      borderRadius: "50%",
      background: `radial-gradient(closest-side, ${color} 0%, rgba(0,0,0,0) 100%)`,
      mixBlendMode: "screen",
      opacity: o,
    }}
  />
);

const Snow: React.FC<{ t: number }> = ({ t }) => {
  const layers = [
    { n: 170, size: [1.4, 2.4], speed: [28, 42], o: 0.55, blur: 0 },
    { n: 70, size: [2.8, 4.2], speed: [55, 80], o: 0.75, blur: 0.4 },
    { n: 22, size: [5.5, 8.5], speed: [95, 130], o: 0.85, blur: 1.6 },
  ];
  const wind = 14 * Math.sin(t * 0.21) + 8; // px/s drift, slowly changing
  return (
    <AbsoluteFill
      style={{
        WebkitMaskImage: `url(${staticFile("cozy-noel/window_mask.png")})`,
        maskImage: `url(${staticFile("cozy-noel/window_mask.png")})`,
        WebkitMaskSize: "1920px 1080px",
        maskSize: "1920px 1080px",
      }}
    >
      {WINDOWS.flatMap((w, wi) =>
        layers.flatMap((L, li) =>
          new Array(Math.round((L.n * w.w) / 260)).fill(0).map((_, i) => {
            const key = `${wi}-${li}-${i}`;
            const sz = L.size[0] + random(`sz${key}`) * (L.size[1] - L.size[0]);
            const sp =
              L.speed[0] + random(`sp${key}`) * (L.speed[1] - L.speed[0]);
            const span = w.h + 40;
            const y = ((random(`y${key}`) * span + t * sp) % span) - 20;
            const sway =
              Math.sin(t * (0.6 + random(`f${key}`)) + random(`p${key}`) * 6) *
              (6 + li * 5);
            const x =
              w.x +
              ((((random(`x${key}`) * w.w +
                t * wind * (0.5 + li * 0.4) +
                sway) %
                w.w) +
                w.w) %
                w.w);
            return (
              <div
                key={key}
                style={{
                  position: "absolute",
                  left: x,
                  top: w.y + y,
                  width: sz,
                  height: sz,
                  borderRadius: sz,
                  background: "#fff",
                  opacity: L.o * (0.6 + 0.4 * random(`o${key}`)),
                  filter: L.blur ? `blur(${L.blur}px)` : undefined,
                }}
              />
            );
          }),
        ),
      )}
    </AbsoluteFill>
  );
};

export const CozyNoel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fire = flick(t, "fire", 9);
  const fire2 = flick(t, "fire2", 14);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id="warpFire" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025 0.07"
              numOctaves={2}
              seed={3}
              result="n"
            />
            <feOffset
              in="n"
              dx={Math.sin(t * 0.9) * 12}
              dy={-t * 140}
              result="m"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="m"
              scale={10 + 8 * fire2}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="warpCandle" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.09 0.16"
              numOctaves={1}
              seed={7}
              result="n"
            />
            <feOffset
              in="n"
              dx={Math.sin(t * 1.3) * 6}
              dy={-t * 70}
              result="m"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="m"
              scale={4}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <Img src={ROOM} style={{ width: 1920, height: 1080 }} />
      <Snow t={t} />
      {/* room light breathing with the fire */}
      <Glow
        x={FIRE.x}
        y={FIRE.y + 30}
        r={760}
        color="rgba(255,140,50,0.55)"
        o={0.1 + 0.12 * fire}
      />
      <Glow
        x={FIRE.x}
        y={FIRE.y + 120}
        r={420}
        color="rgba(255,120,40,0.7)"
        o={0.12 + 0.16 * fire2}
      />
      <Flame
        x={FIRE.x}
        y={FIRE.y}
        w={FIRE.w}
        h={FIRE.h}
        filter="warpFire"
        bright={0.92 + 0.22 * fire}
      />
      <Glow
        x={FIRE.x}
        y={FIRE.y}
        r={110}
        color="rgba(255,190,90,0.9)"
        o={0.25 + 0.35 * fire2}
      />
      {CANDLES.map((c, i) => {
        const f = flick(t, `c${i}`, 6 + (i % 4));
        return (
          <React.Fragment key={i}>
            <Flame
              x={c.x}
              y={c.y - c.r * 0.3}
              w={c.r * 2.4}
              h={c.r * 3.2}
              filter="warpCandle"
              bright={0.9 + 0.25 * f}
            />
            <Glow
              x={c.x}
              y={c.y}
              r={c.r * K * 7}
              color="rgba(255,200,120,0.85)"
              o={0.18 + 0.3 * f}
            />
          </React.Fragment>
        );
      })}
      {TREE_LIGHTS.map(([x, y], i) => {
        const o =
          0.15 +
          0.4 *
            (0.5 +
              0.5 *
                Math.sin(
                  t * (0.8 + random(`tl${i}`) * 1.4) + random(`tp${i}`) * 6,
                ));
        return (
          <Glow
            key={i}
            x={x}
            y={y}
            r={22}
            color="rgba(255,220,150,0.9)"
            o={o}
          />
        );
      })}
    </AbsoluteFill>
  );
};
