import React from "react";
import { random } from "remotion";
import { mix, SceneSvg, Sky, Snow, TempChip, useProgress } from "./common";

const Tree: React.FC<{ x: number; base: number; p: number }> = ({
  x,
  base,
  p,
}) => {
  const trunk = mix(p, "#5b3a24", "#7b8a99");
  const leaf = mix(p, "#2f9a3e", "#f1f8ff");
  const leafHi = mix(p, "#44b354", "#ffffff");
  const s = 1 - p * 0.15;
  return (
    <g>
      <line
        x1={x}
        y1={base}
        x2={x}
        y2={base - 230}
        stroke={trunk}
        strokeWidth={12}
      />
      <line
        x1={x}
        y1={base - 120}
        x2={x - 70}
        y2={base - 220}
        stroke={trunk}
        strokeWidth={7}
      />
      <line
        x1={x}
        y1={base - 140}
        x2={x + 75}
        y2={base - 230}
        stroke={trunk}
        strokeWidth={7}
      />
      {[
        [-70, -250, 60],
        [0, -290, 70],
        [70, -255, 60],
        [-30, -230, 50],
        [40, -225, 50],
      ].map(([dx, dy, r], i) => (
        <circle
          key={i}
          cx={x + dx}
          cy={base + dy}
          r={r * s}
          fill={i % 2 ? leafHi : leaf}
        />
      ))}
    </g>
  );
};

// 7: A green spring field turns into a frozen wasteland; the sun fades to a pale disc.
export const NatureScene: React.FC = () => {
  const p = useProgress(0.4, 4.2);
  const base = 860;

  return (
    <SceneSvg>
      <Sky
        id="nat-sky"
        top={mix(p, "#5aa8e8", "#28385e")}
        bottom={mix(p, "#a9d8f5", "#6a7aa4")}
      />
      {p > 0.4 && (
        <Snow count={Math.round((80 * (p - 0.4)) / 0.6)} seed="nat" />
      )}
      <circle cx={1600} cy={150} r={70} fill={mix(p, "#ffd34d", "#dfe6f2")} />
      <rect
        x={0}
        y={base}
        width={1920}
        height={220}
        fill={mix(p, "#4f9d45", "#eaf2fb")}
      />
      {[480, 960, 1440].map((x) => (
        <Tree key={x} x={x} base={base} p={p} />
      ))}
      {new Array(28).fill(0).map((_, i) => {
        const x = 40 + i * 68;
        const c = ["#ff6fa3", "#ffd34d", "#ffffff"][i % 3];
        return (
          <g key={i} opacity={1 - p}>
            <line
              x1={x}
              y1={base}
              x2={x}
              y2={base - 26 + p * 18}
              stroke="#2f7a34"
              strokeWidth={4}
            />
            <circle
              cx={x}
              cy={base - 30 + p * 18}
              r={8 + random(`fl-${i}`) * 3}
              fill={c}
            />
          </g>
        );
      })}
      <TempChip />
    </SceneSvg>
  );
};
