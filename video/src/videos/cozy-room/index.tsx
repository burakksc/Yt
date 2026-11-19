// CozyRoom (1920x1080): an SDXL still brought to life — used by the Noel library and the NYC apartments.
// - real flame pixels warped by an animated SVG displacement filter + brightness flicker
// - warm glows that flicker with the fire/candles, twinkling lights (tree or city)
// - 3-layer snowfall visible only through the window panes (per-scene alpha mask)
// Rendered as LOOP+2 s; scripts/ambience/make_cozy_hour.sh cross-fades the extra 2 s into the start.
import React from "react";
import {
  AbsoluteFill,
  Img,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ROOMS, type RoomCfg } from "./scenes";

export const ROOM_FPS = 30;
export const ROOM_LOOP = 60; // seconds
export const ROOM_FRAMES = (ROOM_LOOP + 2) * ROOM_FPS;

const K = 1920 / 1344; // source -> output scale

/** Smooth random flicker in [0,1] (two octaves of value noise + a sine). */
const flick = (t: number, seed: string, speed = 10) => {
  const v = (k: number) => random(`${seed}-${k}`);
  const sm = (x: number) => x * x * (3 - 2 * x);
  const a = t * speed;
  const i = Math.floor(a);
  const n1 = v(i) * (1 - sm(a - i)) + v(i + 1) * sm(a - i);
  const b = t * speed * 2.7;
  const j = Math.floor(b);
  const n2 = v(j + 999) * (1 - sm(b - j)) + v(j + 1000) * sm(b - j);
  return (
    0.55 * n1 + 0.3 * n2 + 0.15 * (0.5 + 0.5 * Math.sin(t * 7.3 + v(-1) * 6))
  );
};

const Flame: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  filter: string;
  bright: number;
}> = ({ src, x, y, w, h, filter, bright }) => {
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
        src={src}
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

const Snow: React.FC<{ t: number; cfg: RoomCfg }> = ({ t, cfg }) => {
  const layers = [
    { n: 170, size: [1.4, 2.4], speed: [28, 42], o: 0.55, blur: 0 },
    { n: 70, size: [2.8, 4.2], speed: [55, 80], o: 0.75, blur: 0.4 },
    { n: 22, size: [5.5, 8.5], speed: [95, 130], o: 0.85, blur: 1.6 },
  ];
  const wind = 14 * Math.sin(t * 0.21) + 8;
  const mask = `url(${staticFile(cfg.mask)})`;
  return (
    <AbsoluteFill
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: "1920px 1080px",
        maskSize: "1920px 1080px",
      }}
    >
      {cfg.windows.flatMap((w, wi) =>
        layers.flatMap((L, li) =>
          new Array(Math.max(4, Math.round(((L.n * w.w) / 260) * w.density)))
            .fill(0)
            .map((_, i) => {
              const key = `${wi}-${li}-${i}`;
              const sz =
                L.size[0] + random(`sz${key}`) * (L.size[1] - L.size[0]);
              const sp =
                L.speed[0] + random(`sp${key}`) * (L.speed[1] - L.speed[0]);
              const span = w.h + 40;
              const y = ((random(`y${key}`) * span + t * sp) % span) - 20;
              const sway =
                Math.sin(
                  t * (0.6 + random(`f${key}`)) + random(`p${key}`) * 6,
                ) *
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

export const CozyRoom: React.FC<{ scene: string }> = ({ scene }) => {
  const cfg = ROOMS[scene];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const src = staticFile(cfg.base);
  const fire = flick(t, "fire", 9);
  const fire2 = flick(t, "fire2", 14);
  const F = cfg.fire;
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
      <Img src={src} style={{ width: 1920, height: 1080 }} />
      <Snow t={t} cfg={cfg} />
      {F && (
        <>
          <Glow
            x={F.x}
            y={F.y + 30}
            r={760}
            color="rgba(255,140,50,0.55)"
            o={(0.1 + 0.12 * fire) * cfg.roomGlow}
          />
          <Glow
            x={F.x}
            y={F.y + 120}
            r={420}
            color="rgba(255,120,40,0.7)"
            o={(0.12 + 0.16 * fire2) * cfg.roomGlow}
          />
          <Flame
            src={src}
            x={F.x}
            y={F.y}
            w={F.w}
            h={F.h}
            filter="warpFire"
            bright={0.92 + 0.22 * fire}
          />
          <Glow
            x={F.x}
            y={F.y}
            r={110}
            color="rgba(255,190,90,0.9)"
            o={0.25 + 0.35 * fire2}
          />
        </>
      )}
      {cfg.candles.map(([x, y, r], i) => {
        const f = flick(t, `c${i}`, 6 + (i % 4));
        return (
          <React.Fragment key={i}>
            <Flame
              src={src}
              x={x}
              y={y - r * 0.3}
              w={r * 2.4}
              h={r * 3.2}
              filter="warpCandle"
              bright={0.9 + 0.25 * f}
            />
            <Glow
              x={x}
              y={y}
              r={r * K * 7}
              color="rgba(255,200,120,0.85)"
              o={0.18 + 0.3 * f}
            />
          </React.Fragment>
        );
      })}
      {cfg.twinkles.map(([x, y], i) => {
        const o =
          0.12 +
          0.4 *
            Math.max(
              0,
              Math.sin(
                t * (0.5 + random(`tl${i}`) * 1.4) + random(`tp${i}`) * 6,
              ),
            );
        return (
          <Glow
            key={i}
            x={x}
            y={y}
            r={scene === "noel" ? 22 : 9}
            color={cfg.twinkleColor}
            o={o}
          />
        );
      })}
    </AbsoluteFill>
  );
};
