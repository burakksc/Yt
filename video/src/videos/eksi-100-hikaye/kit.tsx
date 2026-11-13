// Painting kit for the illustrated placeholder backgrounds (1080x1920 SVG space).
// Used until AI-generated backgrounds are dropped into public/eksi-100-hikaye/bg/.
import React, { useId } from "react";
import {
  Easing,
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const VW = 1080;
export const VH = 1920;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const mix = (p: number, a: string, b: string) =>
  interpolateColors(p, [0, 1], [a, b]);

/** 0..1 progress between two times (seconds, scene-local). */
export const useT = (from: number, to: number, ease = true) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [from * fps, to * fps], [0, 1], {
    ...clamp,
    easing: ease ? Easing.inOut(Easing.cubic) : undefined,
  });
};

export const Canvas: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <svg
    viewBox={`0 0 ${VW} ${VH}`}
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid slice"
    style={{ display: "block", position: "absolute", inset: 0 }}
  >
    {children}
  </svg>
);

export const Gradient: React.FC<{
  stops: [number, string][];
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}> = ({ stops, x = 0, y = 0, w = VW, h = VH }) => {
  const id = useId();
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
    </>
  );
};

/** Soft radial light (lamp, window spill, fire). */
export const Glow: React.FC<{
  cx: number;
  cy: number;
  r: number;
  color: string;
  opacity?: number;
}> = ({ cx, cy, r, color, opacity = 0.6 }) => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={opacity} />
          <stop offset="0.45" stopColor={color} stopOpacity={opacity * 0.35} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
    </>
  );
};

export const Stars: React.FC<{
  count?: number;
  maxY?: number;
  seed?: string;
}> = ({ count = 80, maxY = 700, seed = "st" }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {new Array(count).fill(0).map((_, i) => {
        const tw = 0.5 + 0.5 * Math.sin(frame / 10 + i * 2.1);
        return (
          <circle
            key={i}
            cx={random(`${seed}x${i}`) * VW}
            cy={random(`${seed}y${i}`) * maxY}
            r={1 + random(`${seed}r${i}`) * 2}
            fill="white"
            opacity={0.25 + tw * 0.6}
          />
        );
      })}
    </g>
  );
};

/** Distant city silhouette with tiny warm lights. */
export const FarCity: React.FC<{
  y: number;
  color?: string;
  lights?: number;
  seed?: string;
}> = ({ y, color = "#3b4766", lights = 1, seed = "far" }) => {
  const parts: React.ReactNode[] = [];
  let x = -20;
  let i = 0;
  while (x < VW + 20) {
    const w = 18 + random(`${seed}w${i}`) * 40;
    const h = 20 + random(`${seed}h${i}`) * 90;
    parts.push(
      <rect
        key={`b${i}`}
        x={x}
        y={y - h}
        width={w}
        height={h + 2}
        fill={color}
      />,
    );
    if (random(`${seed}s${i}`) > 0.93) {
      // church spire / tower
      parts.push(
        <path
          key={`s${i}`}
          d={`M ${x + w / 2 - 6} ${y - h} L ${x + w / 2} ${y - h - 70} L ${x + w / 2 + 6} ${y - h} Z`}
          fill={color}
        />,
      );
    }
    for (let k = 0; k < 3; k++) {
      if (random(`${seed}l${i}${k}`) < 0.5 * lights) {
        parts.push(
          <rect
            key={`l${i}${k}`}
            x={x + 3 + random(`${seed}lx${i}${k}`) * (w - 6)}
            y={y - h + 6 + random(`${seed}ly${i}${k}`) * (h - 10)}
            width={3}
            height={3}
            fill="#ffd28a"
          />,
        );
      }
    }
    x += w;
    i++;
  }
  return <g>{parts}</g>;
};

/** Apartment block with lit windows and snow on the roof and ledges. */
export const Apartment: React.FC<{
  x: number;
  base: number;
  w: number;
  floors: number;
  cols: number;
  seed: string;
  lights?: number; // 0..1 share of windows lit
  facade?: string;
  shade?: string;
  door?: boolean;
}> = ({
  x,
  base,
  w,
  floors,
  cols,
  seed,
  lights = 0.6,
  facade = "#8592ad",
  shade = "#5d6984",
  door = true,
}) => {
  const id = useId();
  const floorH = 62;
  const h = floors * floorH + 40;
  const top = base - h;
  const colW = (w - 40) / cols;
  const wins: React.ReactNode[] = [];
  for (let f = 0; f < floors; f++) {
    for (let c = 0; c < cols; c++) {
      const r = random(`${seed}-${f}-${c}`);
      const lit = r < lights;
      const wx = x + 20 + c * colW + colW * 0.2;
      const wy = top + 40 + f * floorH;
      const ww = colW * 0.6;
      const wh = floorH * 0.55;
      wins.push(
        <g key={`${f}-${c}`}>
          <rect
            x={wx}
            y={wy}
            width={ww}
            height={wh}
            fill={lit ? "#ffc56a" : "#2a3350"}
          />
          {lit && (
            <rect
              x={wx}
              y={wy + wh * 0.55}
              width={ww}
              height={wh * 0.45}
              fill="#f2a24a"
              opacity={0.7}
            />
          )}
          <line
            x1={wx + ww / 2}
            y1={wy}
            x2={wx + ww / 2}
            y2={wy + wh}
            stroke="#3d4560"
            strokeWidth={2}
          />
          {/* snow on the window ledge */}
          <rect
            x={wx - 3}
            y={wy + wh}
            width={ww + 6}
            height={5}
            rx={2}
            fill="#eef4fb"
          />
        </g>,
      );
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={facade} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <rect x={x} y={top} width={w} height={h} fill={`url(#${id})`} />
      {/* roof equipment */}
      <rect x={x + w * 0.15} y={top - 28} width={60} height={28} fill={shade} />
      <rect x={x + w * 0.65} y={top - 22} width={44} height={22} fill={shade} />
      {/* snow on roof */}
      <path
        d={`M ${x - 6} ${top + 4} Q ${x + w * 0.25} ${top - 12} ${x + w * 0.5} ${top - 4} T ${x + w + 6} ${top + 2} L ${x + w + 6} ${top + 10} L ${x - 6} ${top + 10} Z`}
        fill="#f1f6fc"
      />
      <rect
        x={x + w * 0.15 - 2}
        y={top - 34}
        width={64}
        height={8}
        rx={4}
        fill="#f1f6fc"
      />
      {wins}
      {door && (
        <g>
          <rect
            x={x + w / 2 - 22}
            y={base - 64}
            width={44}
            height={64}
            fill="#3a2a22"
          />
          <rect
            x={x + w / 2 - 34}
            y={base - 74}
            width={68}
            height={10}
            fill="#e9f0f8"
          />
          {lights > 0.05 && (
            <Glow
              cx={x + w / 2}
              cy={base - 70}
              r={60}
              color="#ffcf7a"
              opacity={0.7}
            />
          )}
        </g>
      )}
    </g>
  );
};

/** Leafless tree with snow on the branches (recursive, deterministic). */
export const BareTree: React.FC<{
  x: number;
  base: number;
  h: number;
  seed: string;
  color?: string;
  snow?: boolean;
}> = ({ x, base, h, seed, color = "#2b2f3c", snow = true }) => {
  const lines: React.ReactNode[] = [];
  const grow = (
    x0: number,
    y0: number,
    len: number,
    ang: number,
    depth: number,
    key: string,
  ) => {
    const x1 = x0 + Math.cos(ang) * len;
    const y1 = y0 - Math.sin(ang) * len;
    lines.push(
      <line
        key={key}
        x1={x0}
        y1={y0}
        x2={x1}
        y2={y1}
        stroke={color}
        strokeWidth={Math.max(1, depth * 2.2)}
        strokeLinecap="round"
      />,
    );
    if (snow && depth <= 3 && depth >= 1) {
      lines.push(
        <line
          key={`${key}s`}
          x1={x0}
          y1={y0 - depth}
          x2={x0 + (x1 - x0) * 0.7}
          y2={y0 + (y1 - y0) * 0.7 - depth}
          stroke="#eef4fb"
          strokeWidth={Math.max(1, depth * 1.2)}
          strokeLinecap="round"
        />,
      );
    }
    if (depth <= 0) return;
    const n = depth > 3 ? 2 : 3;
    for (let k = 0; k < n; k++) {
      const spread = (random(`${seed}${key}a${k}`) - 0.5) * 1.3;
      grow(
        x1,
        y1,
        len * (0.62 + random(`${seed}${key}l${k}`) * 0.15),
        ang + spread,
        depth - 1,
        `${key}${k}`,
      );
    }
  };
  grow(x, base, h * 0.35, Math.PI / 2, 5, "t");
  return <g>{lines}</g>;
};

export const StreetLamp: React.FC<{
  x: number;
  base: number;
  h?: number;
  on?: number;
}> = ({ x, base, h = 230, on = 1 }) => (
  <g>
    {on > 0 && (
      <Glow cx={x} cy={base - h} r={140} color="#ffd38a" opacity={0.75 * on} />
    )}
    {on > 0 && (
      <ellipse
        cx={x}
        cy={base}
        rx={110}
        ry={22}
        fill="#ffe2a8"
        opacity={0.35 * on}
      />
    )}
    <rect x={x - 4} y={base - h} width={8} height={h} fill="#1f2330" />
    <rect
      x={x - 12}
      y={base - h - 16}
      width={24}
      height={18}
      rx={4}
      fill="#1f2330"
    />
    <rect
      x={x - 8}
      y={base - h - 2}
      width={16}
      height={8}
      fill={mix(on, "#3a3f50", "#fff1c9")}
    />
  </g>
);

/** Snow ground with soft drifts. */
export const SnowGround: React.FC<{ y: number; tint?: string }> = ({
  y,
  tint = "#dfe8f4",
}) => {
  const id = useId();
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f7fc" />
          <stop offset="1" stopColor={tint} />
        </linearGradient>
      </defs>
      <path
        d={`M 0 ${y} Q 180 ${y - 30} 380 ${y - 6} T 760 ${y - 14} T ${VW} ${y - 4} L ${VW} ${VH} L 0 ${VH} Z`}
        fill={`url(#${id})`}
      />
      <path
        d={`M 0 ${y + 120} Q 260 ${y + 80} 540 ${y + 130} T ${VW} ${y + 110}`}
        stroke="#c9d6e8"
        strokeWidth={4}
        fill="none"
        opacity={0.7}
      />
    </g>
  );
};

/** Falling snow, two depth layers. */
export const SnowFall: React.FC<{
  count?: number;
  seed?: string;
  wind?: number;
  size?: number;
}> = ({ count = 120, seed = "sf", wind = 1, size = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {new Array(count).fill(0).map((_, i) => {
        const near = i % 4 === 0;
        const v = (near ? 6 : 2.5) + random(`${seed}v${i}`) * 2;
        const r = (near ? 5 : 2.2) * size + random(`${seed}r${i}`) * 2;
        const y = (random(`${seed}y${i}`) * VH + frame * v) % (VH + 20);
        const x =
          (random(`${seed}x${i}`) * VW +
            frame * wind * (near ? 3 : 1.2) +
            Math.sin(frame / 20 + i) * 15) %
          (VW + 20);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="white"
            opacity={near ? 0.9 : 0.65}
          />
        );
      })}
    </g>
  );
};

/** Painterly grain + vignette on top of the whole frame. */
export const Finish: React.FC<{ vignette?: number }> = ({
  vignette = 0.55,
}) => {
  const id = useId();
  return (
    <g style={{ pointerEvents: "none" }}>
      <defs>
        <radialGradient id={`${id}v`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#050a18" stopOpacity={vignette} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={VW} height={VH} fill={`url(#${id}v)`} />
    </g>
  );
};

export const Car: React.FC<{
  x: number;
  base: number;
  frozen?: number;
  scale?: number;
}> = ({ x, base, frozen = 1, scale = 1 }) => (
  <g transform={`translate(${x} ${base}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={190} ry={18} fill="#9fb1c9" opacity={0.6} />
    <path
      d="M -175 -40 L -170 -95 L -120 -110 L -80 -165 L 90 -165 L 140 -110 L 178 -100 L 182 -40 Z"
      fill="#2d3445"
    />
    <path d="M -70 -112 L -45 -152 L 5 -152 L 5 -112 Z" fill="#5c6f8f" />
    <path d="M 18 -112 L 18 -152 L 80 -152 L 112 -112 Z" fill="#5c6f8f" />
    {/* snow on roof and hood */}
    <path
      d="M -85 -165 Q 0 -190 95 -166 L 92 -160 L -82 -160 Z"
      fill="#f3f7fc"
      opacity={frozen}
    />
    <path
      d="M -172 -96 Q -140 -112 -118 -110 L -120 -104 L -170 -92 Z"
      fill="#f3f7fc"
      opacity={frozen}
    />
    <path
      d="M 140 -110 Q 165 -112 178 -100 L 176 -96 L 142 -104 Z"
      fill="#f3f7fc"
      opacity={frozen}
    />
    {/* frost on windows */}
    <path
      d="M -70 -112 L -45 -152 L 5 -152 L 5 -112 Z"
      fill="#e6f1fb"
      opacity={0.55 * frozen}
    />
    <path
      d="M 18 -112 L 18 -152 L 80 -152 L 112 -112 Z"
      fill="#e6f1fb"
      opacity={0.55 * frozen}
    />
    <rect x={-182} y={-80} width={18} height={14} rx={3} fill="#b9b39a" />
    {[-110, 110].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-30} r={36} fill="#161a24" />
        <circle cx={wx} cy={-30} r={15} fill="#7c8496" />
      </g>
    ))}
  </g>
);
