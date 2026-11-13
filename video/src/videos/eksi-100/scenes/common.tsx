import React from "react";
import {
  Easing,
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scenes are drawn in a 1920x1080 coordinate system and scaled into the card.
export const W = 1920;
export const H = 1080;
export const GROUND_Y = 860;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Progress 0..1 between two points in seconds (local to the scene). */
export const useProgress = (fromSec: number, toSec: number, ease = true) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [fromSec * fps, toSec * fps], [0, 1], {
    ...clamp,
    easing: ease ? Easing.inOut(Easing.cubic) : undefined,
  });
};

export const mix = (p: number, a: string, b: string) =>
  interpolateColors(p, [0, 1], [a, b]);

export const SceneSvg: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid slice"
    style={{ display: "block" }}
  >
    {children}
  </svg>
);

export const Sky: React.FC<{ top: string; bottom: string; id: string }> = ({
  top,
  bottom,
  id,
}) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill={`url(#${id})`} />
  </>
);

export const Stars: React.FC<{
  count?: number;
  seed?: string;
  opacity?: number;
}> = ({ count = 70, seed = "stars", opacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={opacity}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}-x-${i}`) * W;
        const y = random(`${seed}-y-${i}`) * (GROUND_Y - 120);
        const r = 1.5 + random(`${seed}-r-${i}`) * 2.5;
        const tw = 0.5 + 0.5 * Math.sin(frame / 12 + i * 1.7);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="white"
            opacity={0.35 + tw * 0.5}
          />
        );
      })}
    </g>
  );
};

export const Snow: React.FC<{
  count?: number;
  seed?: string;
  speed?: number;
  opacity?: number;
}> = ({ count = 90, seed = "snow", speed = 1, opacity = 0.9 }) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={opacity}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`${seed}-x-${i}`) * W;
        const y0 = random(`${seed}-y-${i}`) * H;
        const v = (1.5 + random(`${seed}-v-${i}`) * 2.5) * speed;
        const r = 2 + random(`${seed}-r-${i}`) * 3;
        const y = (y0 + frame * v) % H;
        const x = x0 + Math.sin((frame + i * 20) / 25) * 12;
        return (
          <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.85} />
        );
      })}
    </g>
  );
};

export const Ground: React.FC<{ color?: string; y?: number }> = ({
  color = "#dfe8f3",
  y = GROUND_Y,
}) => <rect x={0} y={y} width={W} height={H - y} fill={color} />;

/** Deterministic city skyline with lit windows. */
export const Skyline: React.FC<{
  color?: string;
  windowColor?: string;
  litRatio?: number;
  seed?: string;
}> = ({
  color = "#3b4a6b",
  windowColor = "#f2c94c",
  litRatio = 0.7,
  seed = "city",
}) => {
  const buildings: React.ReactNode[] = [];
  let x = -10;
  let i = 0;
  while (x < W) {
    const w = 90 + random(`${seed}-w-${i}`) * 110;
    const h = 200 + random(`${seed}-h-${i}`) * 300;
    const top = GROUND_Y - h;
    const windows: React.ReactNode[] = [];
    for (let wy = top + 24; wy < GROUND_Y - 30; wy += 40) {
      for (let wx = x + 16; wx < x + w - 22; wx += 30) {
        const lit = random(`${seed}-l-${i}-${wx}-${wy}`) < litRatio;
        if (lit) {
          windows.push(
            <rect
              key={`${wx}-${wy}`}
              x={wx}
              y={wy}
              width={12}
              height={14}
              fill={windowColor}
            />,
          );
        }
      }
    }
    buildings.push(
      <g key={i}>
        <rect
          x={x}
          y={top}
          width={w}
          height={h}
          fill={color}
          stroke="#2a3550"
          strokeWidth={3}
        />
        {windows}
      </g>,
    );
    x += w + 8 + random(`${seed}-g-${i}`) * 30;
    i++;
  }
  return <g>{buildings}</g>;
};

/** Small "-100°C" chip in the top-left corner of the card. */
export const TempChip: React.FC = () => (
  <g>
    <rect
      x={28}
      y={26}
      width={150}
      height={48}
      rx={10}
      fill="#0d1a2e"
      opacity={0.92}
    />
    <text
      x={103}
      y={59}
      textAnchor="middle"
      fontSize={26}
      fontWeight={800}
      fill="#d6e8ff"
    >
      -100°C
    </text>
  </g>
);

/** Thermometer; level 0..1 = height of the red column. */
export const Thermometer: React.FC<{
  x: number;
  y: number;
  h: number;
  level: number;
}> = ({ x, y, h, level }) => {
  const tubeW = 40;
  const inner = h - 60;
  const colH = Math.max(0, inner * level);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={tubeW}
        height={h}
        rx={20}
        fill="#f6efe0"
        stroke="#8a5a3c"
        strokeWidth={6}
      />
      <rect
        x={x + 13}
        y={y + 20 + (inner - colH)}
        width={14}
        height={colH}
        rx={7}
        fill="#d93a2b"
      />
      <circle cx={x + tubeW / 2} cy={y + h - 22} r={14} fill="#d93a2b" />
    </g>
  );
};

/**
 * Stick figure with beanie and scarf.
 * freeze 0..1 tints it icy; ice 0..1 grows an ice block around it.
 * facing: 1 = right, -1 = left.
 */
export const StickFigure: React.FC<{
  x: number;
  y?: number;
  freeze?: number;
  ice?: number;
  walk?: number;
  scale?: number;
}> = ({ x, y = GROUND_Y, freeze = 0, ice = 0, walk = 0, scale = 1 }) => {
  const body = mix(freeze, "#1e2230", "#7fb8de");
  const scarf = mix(freeze, "#d63a2a", "#d98a90");
  const face = mix(freeze, "#ffffff", "#dff1ff");
  const hat = mix(freeze, "#3a3f4c", "#9cc6e4");
  const legSwing = Math.sin(walk) * 22;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* legs */}
      <line
        x1={0}
        y1={-150}
        x2={-legSwing * 0.6}
        y2={-10}
        stroke={body}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <line
        x1={0}
        y1={-150}
        x2={legSwing * 0.6}
        y2={-10}
        stroke={body}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <ellipse cx={-legSwing * 0.6 - 8} cy={-6} rx={18} ry={8} fill={body} />
      <ellipse cx={legSwing * 0.6 - 8} cy={-6} rx={18} ry={8} fill={body} />
      {/* torso */}
      <line
        x1={0}
        y1={-290}
        x2={0}
        y2={-150}
        stroke={body}
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* scarf */}
      <rect x={-30} y={-305} width={60} height={26} rx={8} fill={scarf} />
      <rect x={4} y={-290} width={20} height={70} rx={6} fill={scarf} />
      {/* head */}
      <circle
        cx={0}
        cy={-345}
        r={48}
        fill={face}
        stroke={body}
        strokeWidth={5}
      />
      {/* beanie */}
      <path d="M -50 -350 A 50 50 0 0 1 50 -350 Z" fill={hat} />
      {[-30, -10, 10, 30].map((sx) => (
        <line
          key={sx}
          x1={sx}
          y1={-352}
          x2={sx * 0.8}
          y2={-388}
          stroke={mix(freeze, "#2a2e38", "#86b2d2")}
          strokeWidth={4}
        />
      ))}
      <rect
        x={-52}
        y={-358}
        width={104}
        height={12}
        rx={4}
        fill={mix(freeze, "#2b2f3a", "#8fbcda")}
      />
      {/* frost sparkles */}
      {freeze > 0.3 &&
        [
          [-60, -380],
          [55, -320],
          [-40, -200],
          [35, -120],
        ].map(([sx, sy], i) => (
          <text
            key={i}
            x={sx}
            y={sy}
            fontSize={28}
            fill="white"
            opacity={(freeze - 0.3) / 0.7}
          >
            ✱
          </text>
        ))}
      {/* ice block */}
      {ice > 0 && (
        <rect
          x={-95}
          y={-420 * ice}
          width={190}
          height={420 * ice}
          rx={18}
          fill="#cfeaff"
          opacity={0.45}
          stroke="#eaf7ff"
          strokeWidth={6}
        />
      )}
    </g>
  );
};
