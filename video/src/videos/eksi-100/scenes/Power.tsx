import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  clamp,
  Ground,
  mix,
  SceneSvg,
  Sky,
  Snow,
  Stars,
  TempChip,
  useProgress,
} from "./common";

const Tower: React.FC<{ x: number; base: number; h: number }> = ({
  x,
  base,
  h,
}) => {
  const top = base - h;
  const s = "#06090f";
  return (
    <g stroke={s} strokeWidth={7} fill="none">
      <line x1={x - 70} y1={base} x2={x - 18} y2={top} />
      <line x1={x + 70} y1={base} x2={x + 18} y2={top} />
      {[0.2, 0.4, 0.6, 0.8].map((t) => {
        const y = base - h * t;
        const half = 70 - 52 * t;
        return (
          <g key={t}>
            <line x1={x - half} y1={y} x2={x + half} y2={y} />
            <line x1={x - half} y1={y} x2={x + half - 10} y2={y - h * 0.2} />
          </g>
        );
      })}
      <line
        x1={x - 110}
        y1={top + 20}
        x2={x + 110}
        y2={top + 20}
        strokeWidth={9}
      />
    </g>
  );
};

// 5: Power lines ice up and snap; the houses go dark.
export const PowerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ice = useProgress(0.6, 2.8);
  const snap = interpolate(frame, [3.0 * fps, 3.6 * fps], [0, 1], {
    ...clamp,
  });
  const flicker =
    frame > 3.0 * fps && frame < 3.9 * fps
      ? Math.floor(frame / 2) % 2 === 0
        ? 0.3
        : 1
      : 1;
  const lights =
    interpolate(frame, [3.6 * fps, 4.0 * fps], [1, 0], clamp) * flicker;
  const dark = useProgress(3.4, 4.6);

  const base = 860;
  const t1 = 420;
  const t2 = 1080;
  const topY = base - 560 + 20;
  const wire = mix(ice, "#141a26", "#d8eeff");
  const width = 4 + ice * 6;

  const sag = (x1: number, x2: number, y: number, dy: number) =>
    `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + 60} ${x2} ${y + dy}`;

  // Snapped wires hang down from each tower
  const dangle = (x: number, y: number, len: number, side: number) =>
    `M ${x} ${y} Q ${x + side * len * 0.15} ${y + len * 0.65} ${x + side * len * 0.55} ${y + len}`;

  return (
    <SceneSvg>
      <Sky
        id="pw-sky"
        top={mix(dark, "#1d2a4a", "#0c1324")}
        bottom={mix(dark, "#34466e", "#1a2440")}
      />
      <Stars count={40} seed="pw" />
      <Snow count={60} seed="pw" />
      <Ground y={base} color={mix(dark, "#cfdbea", "#9fb0c8")} />
      <Tower x={t1} base={base} h={560} />
      <Tower x={t2} base={base} h={560} />
      <g stroke={wire} strokeWidth={width} fill="none">
        {[-100, 0, 100].map((o, i) =>
          snap < 1 ? (
            <g key={o} opacity={1 - snap}>
              <path d={sag(t1 + o, t2 + o, topY, 0)} />
              <path d={sag(t2 + o, 1920, topY, 40)} />
            </g>
          ) : (
            <g key={o}>
              <path d={dangle(t1 + o, topY, 260 + i * 40, 1)} />
              <path d={dangle(t2 + o, topY, 220 + i * 50, -1)} />
            </g>
          ),
        )}
        {snap > 0 &&
          snap < 1 &&
          [-100, 0, 100].map((o) => (
            <g key={`f${o}`} opacity={snap}>
              <path d={dangle(t1 + o, topY, 260 * snap, 1)} />
              <path d={dangle(t2 + o, topY, 220 * snap, -1)} />
            </g>
          ))}
      </g>
      {/* sparks at the break */}
      {snap > 0 &&
        snap < 1 &&
        new Array(8).fill(0).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={750 + Math.cos(a) * 120 * snap}
              cy={topY + 60 + Math.sin(a) * 80 * snap}
              r={7}
              fill="#ffd34d"
              opacity={1 - snap}
            />
          );
        })}
      {/* houses */}
      {[1360, 1560, 1760].map((hx) => (
        <g key={hx}>
          <path
            d={`M ${hx - 85} ${base} L ${hx - 85} ${base - 120} Q ${hx} ${base - 230} ${hx + 85} ${base - 120} L ${hx + 85} ${base} Z`}
            fill="#4a4f5e"
            stroke="#2a2e38"
            strokeWidth={5}
          />
          {[-35, 35].map((wx) => (
            <rect
              key={wx}
              x={hx + wx - 18}
              y={base - 120}
              width={36}
              height={36}
              fill={mix(lights, "#262b38", "#f2c94c")}
            />
          ))}
        </g>
      ))}
      <TempChip />
    </SceneSvg>
  );
};
