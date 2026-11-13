import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, SceneSvg, Sky, Snow, TempChip, useProgress } from "./common";

// 3: Phone battery collapses 100% -> 0%, then the screen dies under frost.
export const ElectronicsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const battery = Math.round(
    interpolate(
      frame,
      [0.3 * fps, 1.1 * fps, 2.0 * fps, 2.8 * fps],
      [100, 72, 21, 0],
      clamp,
    ),
  );
  const dead = interpolate(frame, [3.0 * fps, 3.3 * fps], [0, 1], clamp);
  const frost = useProgress(1.8, 4.2);
  const color = battery > 50 ? "#3ccf6e" : battery > 15 ? "#e0803a" : "#e5483a";

  const px = 960 - 150;
  const py = 170;
  const pw = 300;
  const ph = 560;

  const corners = [
    [px, py],
    [px + pw, py],
    [px, py + ph],
    [px + pw, py + ph],
  ];

  return (
    <SceneSvg>
      <Sky id="el-sky" top="#16223e" bottom="#2c3d66" />
      <Snow count={70} seed="el" />
      <g transform={`translate(960 450) scale(1.45) translate(-960 -450)`}>
        {/* phone */}
        <rect
          x={px}
          y={py}
          width={pw}
          height={ph}
          rx={36}
          fill="#0a0e18"
          stroke="#3a4660"
          strokeWidth={6}
        />
        <g opacity={1 - dead}>
          <text
            x={960}
            y={py + 110}
            textAnchor="middle"
            fontSize={44}
            fontWeight={700}
            fill="white"
          >
            12:00
          </text>
          <rect
            x={960 - 55}
            y={py + 230}
            width={110}
            height={52}
            rx={8}
            fill="none"
            stroke="white"
            strokeWidth={6}
          />
          <rect
            x={960 + 55}
            y={py + 245}
            width={10}
            height={22}
            rx={3}
            fill="white"
          />
          <rect
            x={960 - 47}
            y={py + 238}
            width={Math.max(0, 94 * (battery / 100))}
            height={36}
            rx={4}
            fill={color}
          />
          <text
            x={960}
            y={py + 360}
            textAnchor="middle"
            fontSize={52}
            fontWeight={800}
            fill={battery === 0 ? "#ff6a55" : "white"}
          >
            %{battery}
          </text>
          {frost > 0.3 && (
            <text
              x={960}
              y={py + 420}
              textAnchor="middle"
              fontSize={34}
              fill="#9fd4ff"
              opacity={frost}
            >
              ❄
            </text>
          )}
        </g>
        {dead > 0 && (
          <text
            x={960}
            y={py + ph / 2 + 22}
            textAnchor="middle"
            fontSize={64}
            fill="#8fd0ff"
            opacity={dead}
          >
            ❄
          </text>
        )}
        {/* frost creeping in from the corners */}
        {corners.map(([cx, cy], i) => (
          <g key={i} opacity={frost}>
            {new Array(6).fill(0).map((_, j) => {
              const dx = (cx === px ? 1 : -1) * (8 + j * 14 * frost);
              const dy =
                (cy === py ? 1 : -1) * (8 + ((j * 7) % 5) * 12 * frost);
              return (
                <circle
                  key={j}
                  cx={cx + dx}
                  cy={cy + dy}
                  r={5 + (j % 3) * 2}
                  fill="#e9f6ff"
                />
              );
            })}
          </g>
        ))}
      </g>
      <TempChip />
    </SceneSvg>
  );
};
