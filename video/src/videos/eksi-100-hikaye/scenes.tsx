// Each scene = Paint (static illustration, replaced by an AI background when present)
//            + Overlay (character, light, particles, scene-specific animation).
import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "./Character";
import {
  Apartment,
  BareTree,
  Canvas,
  Car,
  clamp,
  FarCity,
  Glow,
  Gradient,
  mix,
  SnowFall,
  SnowGround,
  Stars,
  StreetLamp,
  useT,
  VH,
  VW,
} from "./kit";
import type { SceneId } from "./story";

export type SceneParts = {
  Paint: React.FC;
  Overlay: React.FC;
  /** Ken Burns camera: scale and offset (px) from start to end of the scene */
  camera: { from: [number, number, number]; to: [number, number, number] };
};

/* ---------- shared bits ---------- */

const DuskSky: React.FC = () => (
  <Gradient
    stops={[
      [0, "#16213f"],
      [0.32, "#2c3d66"],
      [0.48, "#55688f"],
      [0.53, "#c98e6c"],
      [0.56, "#e8a66b"],
    ]}
  />
);

const NightSky: React.FC<{ glow?: string }> = ({ glow = "#3d5384" }) => (
  <Gradient
    stops={[
      [0, "#0b1226"],
      [0.45, "#1a2747"],
      [0.62, glow],
    ]}
  />
);

/** Breath puffs leaving the mouth and turning into falling ice crystals. */
const Breath: React.FC<{
  x: number;
  y: number;
  dir?: 1 | -1;
  every?: number;
}> = ({ x, y, dir = 1, every = 36 }) => {
  const frame = useCurrentFrame();
  const out: React.ReactNode[] = [];
  for (let k = 0; k < 8; k++) {
    const age = frame - k * every;
    if (age < 0 || age > 120) continue;
    if (age < 26) {
      const t = age / 26;
      for (let j = 0; j < 4; j++) {
        out.push(
          <circle
            key={`p${k}${j}`}
            cx={x + dir * (12 + t * 110 + j * 18)}
            cy={y - j * 4 - t * 10}
            r={9 + j * 5 + t * 10}
            fill="#eef3fa"
            opacity={(1 - t) * 0.8}
          />,
        );
      }
    }
    if (age > 12) {
      const t = (age - 12) / 108;
      for (let j = 0; j < 10; j++) {
        const sx = x + dir * (90 + j * 9 + random(`bx${k}${j}`) * 60);
        const sy = y + t * 330 + random(`by${k}${j}`) * 50;
        const s = 5 + random(`bs${k}${j}`) * 4;
        out.push(
          <path
            key={`c${k}${j}`}
            d={`M ${sx - s} ${sy} L ${sx + s} ${sy} M ${sx} ${sy - s} L ${sx} ${sy + s} M ${sx - s * 0.7} ${sy - s * 0.7} L ${sx + s * 0.7} ${sy + s * 0.7} M ${sx - s * 0.7} ${sy + s * 0.7} L ${sx + s * 0.7} ${sy - s * 0.7}`}
            stroke="white"
            strokeWidth={2}
            opacity={Math.min(1, t * 5) * (1 - Math.max(0, t - 0.7) / 0.3)}
            transform={`rotate(${frame * 3 + j * 40} ${sx} ${sy})`}
          />,
        );
      }
    }
  }
  return <g>{out}</g>;
};

/** Frost creeping in from the frame edges. */
const FrostEdges: React.FC<{ amount: number }> = ({ amount }) => (
  <g opacity={amount}>
    <defs>
      <radialGradient id="frost-edge" cx="0.5" cy="0.5" r="0.72">
        <stop offset="0.62" stopColor="#ffffff" stopOpacity={0} />
        <stop offset="1" stopColor="#eaf5ff" stopOpacity={0.9} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={VW} height={VH} fill="url(#frost-edge)" />
    {new Array(26).fill(0).map((_, i) => {
      const edge = i % 4;
      const p = random(`fe${i}`);
      const len = 60 + random(`fl${i}`) * 140;
      const [x, y, a] =
        edge === 0
          ? [p * VW, 0, 90]
          : edge === 1
            ? [VW, p * VH, 180]
            : edge === 2
              ? [p * VW, VH, 270]
              : [0, p * VH, 0];
      const r = (a * Math.PI) / 180;
      return (
        <path
          key={i}
          d={`M ${x} ${y} l ${Math.cos(r) * len} ${Math.sin(r) * len} m ${-Math.cos(r) * len * 0.5} ${-Math.sin(r) * len * 0.5} l ${Math.cos(r + 0.6) * len * 0.35} ${Math.sin(r + 0.6) * len * 0.35}`}
          stroke="white"
          strokeWidth={3}
          opacity={0.7}
        />
      );
    })}
  </g>
);

/* ---------- 1. pencere: view from the window, thermometer plunges ---------- */

const PencerePaint: React.FC = () => (
  <Canvas>
    <DuskSky />
    <Stars count={40} maxY={500} seed="p1" />
    <FarCity y={1000} color="#45506e" seed="p1far" />
    <rect x={0} y={1000} width={VW} height={60} fill="#7d93b8" />
    <rect x={0} y={1012} width={VW} height={4} fill="#e8a66b" opacity={0.4} />
    <rect x={0} y={1060} width={VW} height={860} fill="#dbe5f1" />
    {/* park with tiny trees */}
    {new Array(30).fill(0).map((_, i) => (
      <BareTree
        key={i}
        x={20 + i * 36 + random(`pt${i}`) * 20}
        base={1110 + random(`pb${i}`) * 40}
        h={70 + random(`ph${i}`) * 40}
        seed={`pt${i}`}
        color="#3b4256"
        snow={false}
      />
    ))}
    <Apartment
      x={150}
      base={1300}
      w={300}
      floors={3}
      cols={6}
      seed="pa1"
      lights={0.55}
    />
    <Apartment
      x={500}
      base={1480}
      w={560}
      floors={15}
      cols={9}
      seed="pa2"
      lights={0.6}
    />
    <SnowGround y={1440} />
    <StreetLamp x={230} base={1520} />
    <StreetLamp x={470} base={1600} />
    <BareTree x={380} base={1640} h={420} seed="pf1" />
    <BareTree x={960} base={1700} h={380} seed="pf2" />
    <Car x={300} base={1720} scale={0.8} />
    {/* window frame + sill (we are inside, looking out) */}
    <rect x={0} y={0} width={150} height={VH} fill="#d9d4c8" />
    <rect x={130} y={0} width={26} height={VH} fill="#b7b1a3" />
    <rect x={0} y={1780} width={VW} height={140} fill="#cfc9bc" />
    <rect x={0} y={1770} width={VW} height={18} fill="#e6e1d6" />
    <rect x={18} y={600} width={14} height={120} rx={7} fill="#9a9488" />
  </Canvas>
);

const PencereOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = interpolate(frame, [0.4 * fps, 3.8 * fps], [0, 1], clamp);
  const level = interpolate(drop, [0, 1], [0.72, 0.03]);
  const temp = Math.round(interpolate(drop, [0, 1], [-5, -100]));
  const frost = useT(2.5, 5.5);
  const tx = 44;
  const ty = 820;
  const th = 520;
  return (
    <Canvas>
      <SnowFall count={90} seed="p1s" />
      {/* thermometer on the window frame */}
      <rect
        x={tx - 10}
        y={ty - 20}
        width={84}
        height={th + 40}
        rx={10}
        fill="#8a5a3c"
      />
      <rect x={tx + 14} y={ty} width={36} height={th} rx={18} fill="#f7f1e4" />
      {new Array(11).fill(0).map((_, i) => (
        <line
          key={i}
          x1={tx + 50}
          y1={ty + 30 + i * 42}
          x2={tx + 62}
          y2={ty + 30 + i * 42}
          stroke="#5a3d2a"
          strokeWidth={3}
        />
      ))}
      <rect
        x={tx + 25}
        y={ty + 20 + (th - 70) * (1 - level)}
        width={14}
        height={(th - 70) * level + 10}
        rx={7}
        fill="#d4382a"
      />
      <circle cx={tx + 32} cy={ty + th - 26} r={20} fill="#d4382a" />
      {/* digital readout next to it */}
      <g transform={`translate(190 ${ty + th - 40})`}>
        <rect
          x={0}
          y={-58}
          width={250}
          height={80}
          rx={16}
          fill="#0d1527"
          opacity={0.85}
        />
        <text
          x={125}
          y={2}
          textAnchor="middle"
          fontSize={56}
          fontWeight={900}
          fill={temp <= -90 ? "#7fd0ff" : "white"}
        >
          {temp}°C
        </text>
      </g>
      <FrostEdges amount={frost} />
    </Canvas>
  );
};

/* ---------- 2. kapı: stepping outside, breath turns to ice ---------- */

const KapiPaint: React.FC = () => (
  <Canvas>
    <NightSky />
    <Stars count={90} maxY={700} seed="k" />
    <FarCity y={900} color="#26314d" seed="kfar" lights={0.6} />
    {/* building facade filling the frame */}
    <rect x={0} y={300} width={VW} height={1100} fill="#6b7896" />
    <rect
      x={0}
      y={300}
      width={VW}
      height={1100}
      fill="#0d1527"
      opacity={0.25}
    />
    {[0, 1, 2, 3].map((f) =>
      [0, 1, 2, 3].map((c) => {
        const lit = random(`kw${f}${c}`) > 0.4;
        const x = 80 + c * 250 + (c > 1 ? 120 : 0);
        if (c === 2 && f === 3) return null;
        return (
          <g key={`${f}${c}`}>
            <rect
              x={x}
              y={380 + f * 240}
              width={130}
              height={150}
              fill={lit ? "#ffc56a" : "#26304a"}
            />
            <rect
              x={x - 6}
              y={530 + f * 240}
              width={142}
              height={10}
              fill="#eef4fb"
            />
          </g>
        );
      }),
    )}
    {/* entrance: open door with warm light */}
    <rect x={430} y={1010} width={240} height={390} fill="#2a1f1a" />
    <rect x={450} y={1030} width={200} height={370} fill="#ffcf8a" />
    <path d="M 450 1030 L 380 1050 L 380 1400 L 450 1400 Z" fill="#5a3a26" />
    <rect x={400} y={985} width={300} height={28} fill="#e9f0f8" />
    <SnowGround y={1395} />
    {/* warm light spilling onto the snow */}
    <path
      d="M 450 1400 L 650 1400 L 820 1700 L 300 1700 Z"
      fill="#ffd69a"
      opacity={0.35}
    />
    <StreetLamp x={150} base={1500} h={330} />
    <BareTree x={930} base={1560} h={520} seed="kt" />
  </Canvas>
);

const KapiOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const walk = useT(0, 1.6);
  const x = interpolate(walk, [0, 1], [550, 520]);
  const y = interpolate(walk, [0, 1], [1395, 1440]);
  const frost = useT(2, 7, false) * 0.55;
  const walking = frame < 1.6 * fps;
  return (
    <Canvas>
      <Glow cx={550} cy={1250} r={360} color="#ffcf8a" opacity={0.35} />
      <Character
        x={x}
        y={y}
        scale={1.25}
        pose={walking ? "walk" : "shiver"}
        mood={frame > 1.4 * fps ? "shocked" : "neutral"}
        frost={frost}
      />
      {frame > 1.2 * fps && <Breath x={x + 70} y={y - 365} every={34} />}
      <SnowFall count={110} seed="k2" wind={1.4} />
      <FrostEdges amount={frost * 0.8} />
    </Canvas>
  );
};

/* ---------- 3. araba: frozen car, dead battery ---------- */

const ArabaPaint: React.FC = () => (
  <Canvas>
    <NightSky glow="#4a5f8f" />
    <Stars count={70} maxY={600} seed="a" />
    <Apartment
      x={-40}
      base={1150}
      w={520}
      floors={12}
      cols={8}
      seed="aa1"
      lights={0.5}
    />
    <Apartment
      x={560}
      base={1100}
      w={560}
      floors={11}
      cols={8}
      seed="aa2"
      lights={0.45}
    />
    <SnowGround y={1100} />
    {/* parking lines under snow */}
    {[200, 480, 760].map((x) => (
      <line
        key={x}
        x1={x}
        y1={1180}
        x2={x - 60}
        y2={1700}
        stroke="#c9d6e8"
        strokeWidth={6}
        opacity={0.6}
      />
    ))}
    <StreetLamp x={90} base={1300} h={360} />
    <StreetLamp x={980} base={1260} h={330} />
    <BareTree x={860} base={1250} h={420} seed="at" />
  </Canvas>
);

const ArabaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const run = useT(0, 1.3);
  const x = interpolate(run, [0, 1], [-60, 300]);
  const arrived = frame > 1.3 * fps;
  const blink = Math.floor(frame / 8) % 2 === 0;
  const warn = useT(2.2, 2.6);
  return (
    <Canvas>
      <Car x={620} base={1420} scale={1.55} />
      <Character
        x={x}
        y={1430}
        scale={1.15}
        pose={arrived ? "reach" : "walk"}
        mood={arrived ? "worried" : "neutral"}
        frost={0.45}
        walkSpeed={1.6}
      />
      {/* dead battery + thick oil warning bubbles */}
      <g opacity={warn} transform={`translate(640 ${1060 - warn * 20})`}>
        <rect
          x={-210}
          y={-70}
          width={190}
          height={120}
          rx={24}
          fill="#0d1527"
          opacity={0.85}
        />
        <rect
          x={-180}
          y={-40}
          width={110}
          height={56}
          rx={8}
          fill="none"
          stroke="white"
          strokeWidth={6}
        />
        <rect x={-70} y={-24} width={10} height={24} rx={3} fill="white" />
        {blink && (
          <rect x={-172} y={-32} width={14} height={40} rx={3} fill="#ff4b3a" />
        )}
        <rect
          x={20}
          y={-70}
          width={190}
          height={120}
          rx={24}
          fill="#0d1527"
          opacity={0.85}
        />
        <path
          d="M 115 -48 C 85 -10 80 10 115 28 C 150 10 145 -10 115 -48 Z"
          fill="#c98a1e"
        />
        <text
          x={115}
          y={84}
          textAnchor="middle"
          fontSize={30}
          fontWeight={800}
          fill="#ffd28a"
        >
          YAĞ
        </text>
        <text
          x={-115}
          y={84}
          textAnchor="middle"
          fontSize={30}
          fontWeight={800}
          fill="#ff8a7a"
        >
          AKÜ
        </text>
      </g>
      <SnowFall count={90} seed="a2" />
    </Canvas>
  );
};

/* ---------- 4. elektrik: lines snap, city goes dark ---------- */

const ElektrikPaint: React.FC = () => (
  <Canvas>
    <NightSky glow="#33456f" />
    <Stars count={120} maxY={800} seed="e" />
    <SnowGround y={1350} />
  </Canvas>
);

const ElektrikOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ice = useT(0.3, 2.2);
  const snap = interpolate(frame, [2.4 * fps, 2.9 * fps], [0, 1], clamp);
  // blocks go dark one after another
  const lightsFor = (i: number) =>
    interpolate(
      frame,
      [(3.0 + i * 0.35) * fps, (3.1 + i * 0.35) * fps],
      [0.6, 0],
      clamp,
    ) *
    (frame > 2.4 * fps && frame < 3.0 * fps && Math.floor(frame / 2) % 2
      ? 0.3
      : 1);
  const poles = [130, 540, 950];
  const wireY = 760;
  const wire = mix(ice, "#0e121c", "#d6ecff");
  return (
    <Canvas>
      <Apartment
        x={-60}
        base={1360}
        w={420}
        floors={12}
        cols={6}
        seed="ea1"
        lights={lightsFor(0)}
      />
      <Apartment
        x={380}
        base={1360}
        w={330}
        floors={9}
        cols={5}
        seed="ea2"
        lights={lightsFor(2)}
      />
      <Apartment
        x={730}
        base={1360}
        w={420}
        floors={13}
        cols={6}
        seed="ea3"
        lights={lightsFor(1)}
      />
      <SnowGround y={1360} />
      {poles.map((px) => (
        <g key={px}>
          <rect
            x={px - 8}
            y={wireY - 20}
            width={16}
            height={1430 - wireY}
            fill="#141a26"
          />
          <rect
            x={px - 60}
            y={wireY - 20}
            width={120}
            height={12}
            fill="#141a26"
          />
        </g>
      ))}
      <g
        stroke={wire}
        strokeWidth={4 + ice * 7}
        fill="none"
        strokeLinecap="round"
      >
        {[-50, 0, 50].map((o, i) =>
          poles.slice(0, -1).map((px, k) => {
            const x1 = px + o;
            const x2 = poles[k + 1] + o;
            if (snap === 0) {
              return (
                <path
                  key={`${i}${k}`}
                  d={`M ${x1} ${wireY - 14} Q ${(x1 + x2) / 2} ${wireY + 70} ${x2} ${wireY - 14}`}
                />
              );
            }
            const hang = 260 * snap;
            return (
              <g key={`${i}${k}`}>
                <path
                  d={`M ${x1} ${wireY - 14} Q ${x1 + 40} ${wireY + hang * 0.6} ${x1 + 110 * snap} ${wireY + hang}`}
                />
                <path
                  d={`M ${x2} ${wireY - 14} Q ${x2 - 40} ${wireY + hang * 0.6} ${x2 - 110 * snap} ${wireY + hang}`}
                />
              </g>
            );
          }),
        )}
      </g>
      {snap > 0 &&
        snap < 1 &&
        poles.slice(0, -1).map((px, k) =>
          new Array(10).fill(0).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const cx = (px + poles[k + 1]) / 2;
            return (
              <circle
                key={`${k}${i}`}
                cx={cx + Math.cos(a) * 140 * snap}
                cy={wireY + 60 + Math.sin(a) * 100 * snap}
                r={8}
                fill="#ffe27a"
                opacity={1 - snap}
              />
            );
          }),
        )}
      {snap > 0 && snap < 0.5 && (
        <Glow
          cx={540}
          cy={wireY + 60}
          r={400}
          color="#bfe3ff"
          opacity={0.6 * (1 - snap * 2)}
        />
      )}
      <Character
        x={540}
        y={1420}
        scale={0.95}
        pose="stand"
        mood={snap > 0 ? "shocked" : "worried"}
        frost={0.5}
      />
      <SnowFall count={80} seed="e2" />
    </Canvas>
  );
};

/* ---------- 5. borular: the pipe freezes and bursts ---------- */

const BorularPaint: React.FC = () => (
  <Canvas>
    <Gradient
      stops={[
        [0, "#3c4a66"],
        [1, "#22293b"],
      ]}
    />
    {/* tiled wall */}
    {new Array(30)
      .fill(0)
      .map((_, r) =>
        new Array(10)
          .fill(0)
          .map((__, c) => (
            <rect
              key={`${r}${c}`}
              x={c * 112 + (r % 2) * 0}
              y={r * 56}
              width={110}
              height={54}
              fill="#4a5875"
              opacity={0.55}
            />
          )),
      )}
    {/* window with dark frozen city */}
    <rect
      x={560}
      y={240}
      width={420}
      height={520}
      fill="#0e1528"
      stroke="#c9c2b4"
      strokeWidth={22}
    />
    <FarCity y={700} color="#1b2238" lights={0.15} seed="bw" />
    <rect x={760} y={240} width={20} height={520} fill="#c9c2b4" />
    {/* floor */}
    <rect x={0} y={1460} width={VW} height={460} fill="#5b4636" />
    {new Array(9).fill(0).map((_, i) => (
      <line
        key={i}
        x1={0}
        y1={1480 + i * 52}
        x2={VW}
        y2={1480 + i * 52}
        stroke="#4a382b"
        strokeWidth={4}
      />
    ))}
    {/* radiator */}
    <g>
      {new Array(9).fill(0).map((_, i) => (
        <rect
          key={i}
          x={560 + i * 46}
          y={1060}
          width={38}
          height={300}
          rx={14}
          fill="#cfd6df"
        />
      ))}
      <rect x={550} y={1080} width={430} height={18} fill="#b3bcc8" />
      <rect x={550} y={1320} width={430} height={18} fill="#b3bcc8" />
    </g>
  </Canvas>
);

const BorularOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ice = useT(0.2, 2.6);
  const burst = interpolate(frame, [2.8 * fps, 3.4 * fps], [0, 1], clamp);
  const after = interpolate(frame, [3.4 * fps, 5.5 * fps], [0, 1], clamp);
  const pipeX = 330;
  return (
    <Canvas>
      {/* vertical pipe with ice growing on it */}
      <rect
        x={pipeX - 26}
        y={0}
        width={52}
        height={1460}
        fill={mix(ice, "#9aa5b5", "#e8f4ff")}
      />
      {new Array(14).fill(0).map((_, i) => (
        <rect
          key={i}
          x={pipeX - 34}
          y={100 + i * 100}
          width={68}
          height={18}
          fill={mix(ice, "#7f8a9a", "#d6eaf9")}
        />
      ))}
      {new Array(30).fill(0).map((_, i) => {
        const y = 40 + i * 48;
        const s = (6 + random(`pi${i}`) * 12) * ice;
        return (
          <ellipse
            key={i}
            cx={pipeX + (i % 2 ? 26 : -26)}
            cy={y}
            rx={s}
            ry={s * 1.6}
            fill="#f2f9ff"
            opacity={0.9}
          />
        );
      })}
      {/* burst: crack, spray that freezes mid-air into icicles */}
      {burst > 0 && (
        <g transform={`translate(${pipeX} 760)`}>
          <path
            d="M -26 -40 L 6 -6 L -14 18 L 22 52"
            stroke="#1d2433"
            strokeWidth={7}
            fill="none"
          />
          {new Array(16).fill(0).map((_, i) => {
            const a = -0.9 + (i / 15) * 1.8;
            const d = 60 + burst * (180 + random(`sp${i}`) * 140);
            const x = Math.cos(a) * d;
            const y = Math.sin(a) * d + burst * burst * 120;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={7 + random(`sr${i}`) * 6}
                fill={mix(after, "#6fb2ff", "#f2f9ff")}
                opacity={0.9}
              />
            );
          })}
          {after > 0 &&
            new Array(7)
              .fill(0)
              .map((_, i) => (
                <path
                  key={`ic${i}`}
                  d={`M ${30 + i * 26} 70 l 10 0 l -5 ${after * (60 + i * 14)} Z`}
                  fill="#eaf6ff"
                />
              ))}
        </g>
      )}
      <Character
        x={760}
        y={1450}
        scale={1.2}
        facing={-1}
        pose="shiver"
        mood={burst > 0 ? "shocked" : "worried"}
        frost={0.35}
      />
      <FrostEdges amount={0.25 + ice * 0.35} />
    </Canvas>
  );
};

/* ---------- 6. telefon: battery collapses ---------- */

const TelefonPaint: React.FC = () => (
  <Canvas>
    <Gradient
      stops={[
        [0, "#0c1324"],
        [1, "#1c2742"],
      ]}
    />
    <Glow cx={540} cy={900} r={700} color="#6f8fd6" opacity={0.25} />
  </Canvas>
);

const TelefonOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const battery = Math.round(
    interpolate(
      frame,
      [0.4 * fps, 1.4 * fps, 2.6 * fps, 3.6 * fps],
      [100, 64, 17, 0],
      clamp,
    ),
  );
  const dead = interpolate(frame, [3.8 * fps, 4.1 * fps], [0, 1], clamp);
  const frost = useT(1.5, 5.5);
  const color = battery > 50 ? "#3ccf6e" : battery > 15 ? "#f0a03a" : "#ff4b3a";
  const shake = Math.sin(frame * 1.9) * 3;
  const px = 270;
  const py = 330;
  const pw = 540;
  const ph = 1000;
  return (
    <Canvas>
      <g transform={`translate(${shake} 0)`}>
        <rect
          x={px - 14}
          y={py - 14}
          width={pw + 28}
          height={ph + 28}
          rx={78}
          fill="#2b3142"
        />
        <rect
          x={px}
          y={py}
          width={pw}
          height={ph}
          rx={66}
          fill={mix(dead, "#1b2a4d", "#030509")}
        />
        <g opacity={1 - dead}>
          <text
            x={540}
            y={py + 190}
            textAnchor="middle"
            fontSize={120}
            fontWeight={300}
            fill="white"
          >
            11:00
          </text>
          <text
            x={540}
            y={py + 250}
            textAnchor="middle"
            fontSize={36}
            fill="#b9c6e4"
          >
            Cumartesi, -100°C
          </text>
          <rect
            x={540 - 110}
            y={py + 420}
            width={220}
            height={110}
            rx={18}
            fill="none"
            stroke="white"
            strokeWidth={9}
          />
          <rect
            x={540 + 110}
            y={py + 452}
            width={18}
            height={46}
            rx={5}
            fill="white"
          />
          <rect
            x={540 - 98}
            y={py + 432}
            width={Math.max(0, 196 * (battery / 100))}
            height={86}
            rx={10}
            fill={color}
          />
          <text
            x={540}
            y={py + 650}
            textAnchor="middle"
            fontSize={110}
            fontWeight={900}
            fill={battery < 16 ? "#ff6a55" : "white"}
          >
            %{battery}
          </text>
          {battery < 30 && (
            <g opacity={Math.floor(frame / 9) % 2 ? 1 : 0.5}>
              <rect
                x={px + 50}
                y={py + 730}
                width={pw - 100}
                height={110}
                rx={26}
                fill="#2a3756"
              />
              <text
                x={540}
                y={py + 798}
                textAnchor="middle"
                fontSize={34}
                fontWeight={700}
                fill="white"
              >
                ⚠ Pil çok soğuk
              </text>
            </g>
          )}
        </g>
        {/* mittens holding the phone */}
        <ellipse
          cx={px + 10}
          cy={py + ph - 160}
          rx={70}
          ry={110}
          fill="#b8442f"
        />
        <ellipse
          cx={px + pw - 10}
          cy={py + ph - 140}
          rx={70}
          ry={110}
          fill="#b8442f"
        />
        {/* frost growing over the screen */}
        <g opacity={frost}>
          {new Array(40).fill(0).map((_, i) => {
            const corner = i % 4;
            const cx = corner % 2 ? px + pw : px;
            const cy = corner > 1 ? py + ph : py;
            const d = random(`tf${i}`) * 220 * frost;
            const a = random(`ta${i}`) * Math.PI * 0.5;
            const sx = cx + (corner % 2 ? -1 : 1) * Math.cos(a) * d;
            const sy = cy + (corner > 1 ? -1 : 1) * Math.sin(a) * d;
            return (
              <circle
                key={i}
                cx={sx}
                cy={sy}
                r={6 + random(`tr${i}`) * 10}
                fill="#eaf6ff"
                opacity={0.85}
              />
            );
          })}
        </g>
        {dead > 0 && (
          <text
            x={540}
            y={py + ph / 2 + 40}
            textAnchor="middle"
            fontSize={120}
            fill="#8fd0ff"
            opacity={dead}
          >
            ❄
          </text>
        )}
      </g>
      <SnowFall count={40} seed="t2" size={1.4} />
    </Canvas>
  );
};

/* ---------- 7. soba: the tiled stove, the only warm place ---------- */

const SobaPaint: React.FC = () => (
  <Canvas>
    <Gradient
      stops={[
        [0, "#6d5a52"],
        [0.5, "#b89273"],
        [1, "#7a5c47"],
      ]}
    />
    {/* floor */}
    <rect x={0} y={1480} width={VW} height={440} fill="#9a6b45" />
    {new Array(10).fill(0).map((_, i) => (
      <line
        key={i}
        x1={0}
        y1={1500 + i * 46}
        x2={VW}
        y2={1500 + i * 46}
        stroke="#7d5536"
        strokeWidth={4}
      />
    ))}
    <rect x={0} y={1470} width={VW} height={16} fill="#e9dccb" />
    {/* chimney pipe */}
    <rect x={500} y={0} width={70} height={720} fill="#5b5f69" />
    <rect x={430} y={600} width={110} height={60} rx={20} fill="#3f434c" />
    {/* tiled stove */}
    <g>
      <rect x={120} y={650} width={420} height={830} fill="#f4f1ea" />
      {new Array(14)
        .fill(0)
        .map((_, r) =>
          new Array(6)
            .fill(0)
            .map((__, c) => (
              <rect
                key={`${r}${c}`}
                x={124 + c * 69}
                y={654 + r * 59}
                width={67}
                height={57}
                fill="none"
                stroke="#d8d2c4"
                strokeWidth={3}
              />
            )),
        )}
      <rect x={110} y={630} width={440} height={30} fill="#e7e2d6" />
      <rect x={250} y={1010} width={160} height={200} rx={8} fill="#2a2c33" />
      <rect x={250} y={1300} width={160} height={110} rx={8} fill="#2a2c33" />
      <rect x={280} y={1320} width={100} height={20} rx={6} fill="#4a4d56" />
    </g>
    {/* wood crate */}
    <rect x={620} y={1310} width={300} height={190} fill="#a0714a" />
    <rect x={620} y={1310} width={300} height={24} fill="#7d5536" />
    <rect x={620} y={1400} width={300} height={10} fill="#7d5536" />
    {new Array(7).fill(0).map((_, i) => (
      <g key={i}>
        <rect
          x={630 + i * 40}
          y={1250 - (i % 2) * 22}
          width={40}
          height={70}
          rx={6}
          fill="#c58b55"
          transform={`rotate(${i * 7 - 20} ${650 + i * 40} 1290)`}
        />
      </g>
    ))}
    {/* frosted window on the right */}
    <rect
      x={720}
      y={260}
      width={300}
      height={420}
      fill="#2a3b5e"
      stroke="#e7e2d6"
      strokeWidth={18}
    />
    <rect
      x={720}
      y={260}
      width={300}
      height={420}
      fill="#e9f3ff"
      opacity={0.35}
    />
  </Canvas>
);

const SobaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.75 + 0.25 * Math.sin(frame / 3) * Math.sin(frame / 7.3 + 1);
  const warm = useT(0.5, 4);
  const walk = useT(0, 1.4);
  const x = interpolate(walk, [0, 1], [900, 610]);
  const arrived = walk >= 1;
  return (
    <Canvas>
      {/* fire inside the stove door window */}
      <rect x={270} y={1030} width={120} height={160} rx={6} fill="#3a1c10" />
      {new Array(6).fill(0).map((_, i) => {
        const h = 60 + Math.sin(frame / 3 + i * 1.7) * 25 + i * 6;
        return (
          <path
            key={i}
            d={`M ${280 + i * 18} 1190 Q ${290 + i * 18 + Math.sin(frame / 4 + i) * 8} ${1190 - h} ${300 + i * 18} 1190 Z`}
            fill={i % 2 ? "#ffb23a" : "#ff6a2a"}
          />
        );
      })}
      <Glow
        cx={330}
        cy={1110}
        r={520}
        color="#ffb060"
        opacity={0.55 * flicker}
      />
      <Glow
        cx={330}
        cy={1480}
        r={420}
        color="#ff9a4a"
        opacity={0.35 * flicker}
      />
      <Character
        x={x}
        y={1470}
        scale={1.3}
        facing={-1}
        pose={arrived ? "hug" : "walk"}
        mood={warm > 0.6 ? "relieved" : "worried"}
        frost={0.5 * (1 - warm)}
      />
      {/* cold creeping in at the edges */}
      <FrostEdges amount={0.45 * (1 - warm * 0.5)} />
    </Canvas>
  );
};

/* ---------- 8. rekor: Antarctic plateau, the real record ---------- */

const RekorPaint: React.FC = () => (
  <Canvas>
    <Gradient
      stops={[
        [0, "#040816"],
        [0.55, "#0f1d3d"],
        [0.7, "#1f3563"],
      ]}
    />
    <Stars count={220} maxY={1200} seed="r" />
    <Gradient
      stops={[
        [0, "#e6eef8"],
        [1, "#b9c8de"],
      ]}
      y={1300}
      h={620}
    />
    {/* research station silhouette */}
    <g fill="#1a2238">
      <rect x={640} y={1250} width={180} height={60} />
      <rect x={830} y={1265} width={110} height={45} />
      <rect x={700} y={1130} width={6} height={120} />
      <circle cx={703} cy={1128} r={8} fill="#ff5a4a" />
      <rect x={880} y={1180} width={4} height={85} />
    </g>
  </Canvas>
);

const RekorOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (d: number) =>
    interpolate(frame, [d * fps, (d + 0.4) * fps], [0, 1], clamp);
  return (
    <Canvas>
      {/* aurora */}
      {[0, 1, 2].map((i) => {
        const y = 520 + i * 70;
        let d = `M -50 ${y}`;
        for (let x = -50; x <= VW + 50; x += 60) {
          d += ` L ${x} ${y + Math.sin(x / 140 + frame / 25 + i) * 60}`;
        }
        return (
          <path
            key={i}
            d={d}
            stroke={["#3ef0a8", "#2fd3c9", "#8b6cff"][i]}
            strokeWidth={70 - i * 15}
            fill="none"
            opacity={0.22}
            strokeLinecap="round"
          />
        );
      })}
      <g opacity={a(0.3)} transform={`translate(0 ${(1 - a(0.3)) * 20})`}>
        <text
          x={540}
          y={430}
          textAnchor="middle"
          fontSize={44}
          fontWeight={800}
          fill="#8fd0ff"
          letterSpacing={6}
        >
          ÖLÇÜLEN REKOR
        </text>
        <text
          x={540}
          y={590}
          textAnchor="middle"
          fontSize={190}
          fontWeight={900}
          fill="white"
        >
          -89,2°C
        </text>
        <text
          x={540}
          y={660}
          textAnchor="middle"
          fontSize={40}
          fontWeight={700}
          fill="#b8c8e0"
        >
          Vostok İstasyonu, Antarktika · 1983
        </text>
      </g>
      <g opacity={a(2.6)} transform={`translate(0 ${(1 - a(2.6)) * 20})`}>
        <text
          x={540}
          y={900}
          textAnchor="middle"
          fontSize={210}
          fontWeight={900}
          fill="#ff6a55"
        >
          -100°C ?
        </text>
      </g>
      <Character
        x={540}
        y={1450}
        scale={1.1}
        pose="shiver"
        mood="worried"
        frost={0.8}
      />
      <Breath x={610} y={1450 - 1.1 * 312} every={40} />
      <SnowFall count={60} seed="r2" wind={2} />
      <FrostEdges amount={0.6} />
    </Canvas>
  );
};

export const SCENE_PARTS: Record<SceneId, SceneParts> = {
  pencere: {
    Paint: PencerePaint,
    Overlay: PencereOverlay,
    camera: { from: [1.12, 0, 60], to: [1.0, 0, 0] },
  },
  kapi: {
    Paint: KapiPaint,
    Overlay: KapiOverlay,
    camera: { from: [1.0, 0, 0], to: [1.12, 0, -60] },
  },
  araba: {
    Paint: ArabaPaint,
    Overlay: ArabaOverlay,
    camera: { from: [1.08, 40, 0], to: [1.0, -10, 0] },
  },
  elektrik: {
    Paint: ElektrikPaint,
    Overlay: ElektrikOverlay,
    camera: { from: [1.0, 0, 0], to: [1.1, 0, 40] },
  },
  borular: {
    Paint: BorularPaint,
    Overlay: BorularOverlay,
    camera: { from: [1.1, 60, 0], to: [1.0, 0, 0] },
  },
  telefon: {
    Paint: TelefonPaint,
    Overlay: TelefonOverlay,
    camera: { from: [1.0, 0, 0], to: [1.08, 0, 0] },
  },
  soba: {
    Paint: SobaPaint,
    Overlay: SobaOverlay,
    camera: { from: [1.1, -40, 0], to: [1.0, 0, 0] },
  },
  rekor: {
    Paint: RekorPaint,
    Overlay: RekorOverlay,
    camera: { from: [1.06, 0, 0], to: [1.0, 0, 0] },
  },
};
