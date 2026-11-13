import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Ground,
  mix,
  SceneSvg,
  Sky,
  Snow,
  TempChip,
  useProgress,
} from "./common";

// 4: A running car freezes: oil thickens, body ices over, tires crack.
export const VehiclesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const freeze = useProgress(1.5, 3.8);
  const crack = useProgress(4.0, 5.2);
  const running = freeze < 0.6;
  const shake = running ? Math.sin(frame * 2.3) * 2 : 0;

  const body = mix(freeze, "#d33f30", "#a9cbe8");
  const glass = mix(freeze, "#9cc8f0", "#e3f3ff");
  const cx = 960;
  const gy = 860;

  const exhaust = running
    ? new Array(4).fill(0).map((_, i) => {
        const t = ((frame + i * 8) % 32) / 32;
        return (
          <circle
            key={i}
            cx={cx + 330 + t * 160}
            cy={gy - 95 - t * 60}
            r={14 + t * 30}
            fill="white"
            opacity={(1 - t) * 0.6 * (1 - freeze / 0.6)}
          />
        );
      })
    : null;

  const wheel = (wx: number) => (
    <g>
      <circle cx={wx} cy={gy - 45} r={62} fill="#1d2230" />
      <circle
        cx={wx}
        cy={gy - 45}
        r={28}
        fill={mix(freeze, "#c4c8d0", "#e7f4ff")}
      />
      {crack > 0 && (
        <path
          d={`M ${wx - 40} ${gy - 80} l 18 22 l -8 18 l 20 20 M ${wx + 30} ${gy - 20} l -14 -16 l 10 -14`}
          stroke="#cfe6ff"
          strokeWidth={5}
          fill="none"
          opacity={crack}
        />
      )}
    </g>
  );

  return (
    <SceneSvg>
      <Sky id="car-sky" top="#7584b0" bottom="#c4cde3" />
      <Snow count={60} seed="car" />
      <Ground y={gy} color="#e7eef8" />
      {exhaust}
      <g transform={`translate(0 ${shake})`}>
        {/* body */}
        <path
          d={`M ${cx - 330} ${gy - 60} L ${cx - 330} ${gy - 150} L ${cx - 170} ${gy - 165} L ${cx - 90} ${gy - 255} L ${cx + 140} ${gy - 255} L ${cx + 220} ${gy - 165} L ${cx + 330} ${gy - 150} L ${cx + 330} ${gy - 60} Z`}
          fill={body}
          stroke="#1d2230"
          strokeWidth={6}
        />
        <path
          d={`M ${cx - 145} ${gy - 170} L ${cx - 80} ${gy - 238} L ${cx + 10} ${gy - 238} L ${cx + 10} ${gy - 170} Z`}
          fill={glass}
        />
        <path
          d={`M ${cx + 30} ${gy - 170} L ${cx + 30} ${gy - 238} L ${cx + 130} ${gy - 238} L ${cx + 195} ${gy - 170} Z`}
          fill={glass}
        />
        <rect
          x={cx - 335}
          y={gy - 140}
          width={24}
          height={20}
          rx={4}
          fill="#ffd34d"
        />
        {/* ice crust */}
        <path
          d={`M ${cx - 340} ${gy - 150} Q ${cx - 200} ${gy - 200} ${cx - 90} ${gy - 268} L ${cx + 140} ${gy - 268} Q ${cx + 260} ${gy - 200} ${cx + 340} ${gy - 150}`}
          fill="#eef8ff"
          opacity={freeze * 0.75}
        />
        {wheel(cx - 190)}
        {wheel(cx + 190)}
      </g>
      <TempChip />
    </SceneSvg>
  );
};
