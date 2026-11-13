import React from "react";
import { random } from "remotion";
import {
  Ground,
  mix,
  SceneSvg,
  Sky,
  Snow,
  TempChip,
  useProgress,
} from "./common";

// 6: Building ices over, icicles grow on the roof, cracks spread on the facade.
export const BuildingsScene: React.FC = () => {
  const tint = useProgress(0.2, 2.0);
  const icicles = useProgress(0.6, 2.6);
  const crack = useProgress(1.8, 4.6, false);

  const bx = 960 - 230;
  const bw = 460;
  const base = 860;
  const top = 240;

  const windows = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 6; c++) {
      const lit = random(`bw-${r}-${c}`) > 0.35;
      windows.push(
        <rect
          key={`${r}-${c}`}
          x={bx + 34 + c * 70}
          y={top + 36 + r * 58}
          width={36}
          height={30}
          fill={lit ? "#f2c94c" : mix(tint, "#2c3c62", "#35507a")}
        />,
      );
    }
  }

  // crack paths drawn progressively with stroke-dashoffset
  const crackPaths = [
    `M ${bx + 30} ${base} l 20 -60 l -15 -50 l 25 -70 l -10 -60 l 20 -80 l -15 -90 l 20 -80`,
    `M ${bx + 160} ${top} l -10 70 l 25 60 l -20 80 l 15 90 l -10 70`,
    `M ${bx + 300} ${base} l -15 -80 l 20 -70 l -25 -90 l 15 -60 l -10 -100`,
    `M ${bx + 420} ${top + 40} l -20 80 l 15 70 l -20 90 l 20 70 l -10 80 l 15 100`,
  ];

  return (
    <SceneSvg>
      <Sky id="bld-sky" top="#34436a" bottom="#7d8db6" />
      <Snow count={70} seed="bld" />
      <Ground y={base} color="#e3ebf6" />
      <rect
        x={bx}
        y={top}
        width={bw}
        height={base - top}
        fill={mix(tint, "#8a93a4", "#b9d2ec")}
        stroke="#3b4458"
        strokeWidth={6}
      />
      {windows}
      <rect x={960 - 30} y={base - 80} width={60} height={80} fill="#5a3a26" />
      {/* roof ledge with snow */}
      <rect
        x={bx - 14}
        y={top - 16}
        width={bw + 28}
        height={20}
        fill="#eef6fd"
      />
      {new Array(23).fill(0).map((_, i) => {
        const x = bx - 6 + i * 21;
        const len = (16 + random(`bi-${i}`) * 40) * icicles;
        return (
          <path
            key={i}
            d={`M ${x - 7} ${top + 4} L ${x + 7} ${top + 4} L ${x} ${top + 4 + len} Z`}
            fill="#eef8ff"
          />
        );
      })}
      {crackPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="#1a2030"
          strokeWidth={5}
          fill="none"
          strokeDasharray={1000}
          strokeDashoffset={
            1000 * (1 - Math.min(1, Math.max(0, crack * 1.4 - i * 0.12)))
          }
        />
      ))}
      <TempChip />
    </SceneSvg>
  );
};
