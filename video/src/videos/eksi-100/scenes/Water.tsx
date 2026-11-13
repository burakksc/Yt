import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import {
  clamp,
  H,
  mix,
  SceneSvg,
  Sky,
  Snow,
  TempChip,
  useProgress,
  W,
} from "./common";

const WATER_Y = 600;
const PIPE_Y = 230;

// 2: Pipe frosts and bursts, the lake freezes from left to right.
export const WaterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const freeze = useProgress(0.8, 4.6, false);
  const front = interpolate(freeze, [0, 1], [-40, W + 40]);
  const pipeFrost = useProgress(1.0, 3.5);
  const burst = interpolate(frame, [4.2 * fps, 4.5 * fps], [0, 1], clamp);

  // waves
  const waves = new Array(7).fill(0).map((_, row) => {
    const y = WATER_Y + 40 + row * 45;
    let d = `M 0 ${y}`;
    for (let x = 0; x <= W; x += 40) {
      d += ` L ${x} ${y + Math.sin(x / 60 + frame / 8 + row) * 6}`;
    }
    return (
      <path
        key={row}
        d={d}
        stroke="#5fa0f0"
        strokeWidth={4}
        fill="none"
        opacity={0.7}
      />
    );
  });

  // ice cracks (deterministic)
  const cracks = new Array(14).fill(0).map((_, i) => {
    const x = random(`crack-x-${i}`) * W;
    const y = WATER_Y + 30 + random(`crack-y-${i}`) * (H - WATER_Y - 60);
    const a = random(`crack-a-${i}`) * Math.PI;
    const l = 40 + random(`crack-l-${i}`) * 80;
    return (
      <path
        key={i}
        d={`M ${x} ${y} l ${Math.cos(a) * l} ${Math.sin(a) * l} l ${Math.cos(a + 0.8) * l * 0.6} ${Math.sin(a + 0.8) * l * 0.6}`}
        stroke="#9cc3dd"
        strokeWidth={3}
        fill="none"
      />
    );
  });

  // drips from pipe valves, stop once frozen
  const drips = [380, 1180].map((vx, i) => {
    const t = ((frame + i * 17) % 30) / 30;
    return pipeFrost < 0.6 ? (
      <circle
        key={vx}
        cx={vx}
        cy={PIPE_Y + 70 + t * 250}
        r={7}
        fill="#5fa0f0"
        opacity={1 - t}
      />
    ) : null;
  });

  // icicles under the pipe
  const icicles = new Array(48).fill(0).map((_, i) => {
    const x = 20 + i * 40;
    const len = (10 + random(`icl-${i}`) * 30) * pipeFrost;
    return (
      <path
        key={i}
        d={`M ${x - 6} ${PIPE_Y + 22} L ${x + 6} ${PIPE_Y + 22} L ${x} ${PIPE_Y + 22 + len} Z`}
        fill="#eef8ff"
      />
    );
  });

  return (
    <SceneSvg>
      <Sky id="water-sky" top="#4a5a80" bottom="#6f7ea4" />
      <Snow count={50} seed="water" />
      {/* pipe */}
      <rect
        x={0}
        y={PIPE_Y - 22}
        width={W}
        height={44}
        fill={mix(pipeFrost, "#9aa3ad", "#eef6fc")}
      />
      {[220, 600, 1000, 1400, 1750].map((jx) => (
        <rect
          key={jx}
          x={jx - 14}
          y={PIPE_Y - 32}
          width={28}
          height={64}
          fill={mix(pipeFrost, "#7f8892", "#dcecf7")}
        />
      ))}
      {[380, 1180].map((vx) => (
        <g key={vx}>
          <rect
            x={vx - 10}
            y={PIPE_Y + 22}
            width={20}
            height={30}
            fill="#7f8892"
          />
          <rect
            x={vx - 22}
            y={PIPE_Y + 48}
            width={44}
            height={14}
            fill="#7f8892"
          />
        </g>
      ))}
      {icicles}
      {drips}
      {/* burst */}
      {burst > 0 && (
        <g transform={`translate(1550 ${PIPE_Y})`} opacity={1 - burst * 0.3}>
          <path
            d="M -20 -20 L 0 0 L -12 18 M 0 0 L 22 -14 L 30 8"
            stroke="#1d2433"
            strokeWidth={6}
            fill="none"
          />
          {new Array(10).fill(0).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={Math.cos(a) * 90 * burst}
                cy={Math.sin(a) * 90 * burst}
                r={8}
                fill="#eaf6ff"
                opacity={1 - burst}
              />
            );
          })}
        </g>
      )}
      {/* water */}
      <rect x={0} y={WATER_Y} width={W} height={H - WATER_Y} fill="#1f6fd6" />
      {waves}
      {/* ice covering the water up to the freeze front */}
      <defs>
        <clipPath id="ice-clip">
          <rect
            x={0}
            y={WATER_Y}
            width={Math.max(0, front)}
            height={H - WATER_Y}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#ice-clip)">
        <rect x={0} y={WATER_Y} width={W} height={H - WATER_Y} fill="#d4ecfb" />
        {cracks}
      </g>
      {freeze > 0 && freeze < 1 && (
        <rect
          x={front - 6}
          y={WATER_Y}
          width={12}
          height={H - WATER_Y}
          fill="white"
          opacity={0.95}
        />
      )}
      <TempChip />
    </SceneSvg>
  );
};
