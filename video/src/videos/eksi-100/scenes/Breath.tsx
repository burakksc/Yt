import React from "react";
import { random, useCurrentFrame } from "remotion";
import {
  Ground,
  SceneSvg,
  Sky,
  Snow,
  Stars,
  StickFigure,
  TempChip,
} from "./common";

// 8: Exhaled breath turns into ice crystals that fall to the ground.
export const BreathScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fx = 470;
  const s = 1.35;
  const mouthX = fx + 55 * s;
  const mouthY = 860 - 345 * s + 20;
  const period = 40;

  const puffs: React.ReactNode[] = [];
  for (let k = 0; k < 5; k++) {
    const t0 = k * period;
    const age = frame - t0;
    if (age < 0 || age > 110) continue;
    // puff phase
    if (age < 30) {
      const t = age / 30;
      for (let j = 0; j < 4; j++) {
        puffs.push(
          <circle
            key={`p${k}-${j}`}
            cx={mouthX + 20 + t * 150 + j * 28}
            cy={mouthY - j * 6}
            r={14 + j * 7 + t * 12}
            fill="#e6eef8"
            opacity={(1 - t) * 0.85}
          />,
        );
      }
    }
    // crystal phase
    if (age > 15) {
      const t = (age - 15) / 95;
      for (let j = 0; j < 9; j++) {
        const sx = mouthX + 150 + j * 20 + random(`br-${k}-${j}`) * 50;
        puffs.push(
          <text
            key={`c${k}-${j}`}
            x={sx + t * 140}
            y={mouthY + t * 380 + random(`by-${k}-${j}`) * 60}
            fontSize={30}
            fill="white"
            opacity={Math.min(1, t * 4) * (1 - Math.max(0, t - 0.75) * 4)}
          >
            ✱
          </text>,
        );
      }
    }
  }

  return (
    <SceneSvg>
      <Sky id="br-sky" top="#1e2c4c" bottom="#3a4c76" />
      <Stars count={50} seed="br" />
      <Snow count={40} seed="br" />
      <Ground y={860} color="#cfdcec" />
      <StickFigure x={fx} freeze={0.1} scale={s} />
      {puffs}
      <text
        x={1600}
        y={140}
        textAnchor="middle"
        fontSize={64}
        fontWeight={600}
        fill="#cfe6ff"
      >
        -100°C
      </text>
      <TempChip />
    </SceneSvg>
  );
};
