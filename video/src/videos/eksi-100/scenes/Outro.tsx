import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, SceneSvg, Sky, Snow, Stars, Thermometer } from "./common";

// 9: The real record (-89.2°C, Vostok station, Antarctica, 21 July 1983) vs. -100°C.
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = (delaySec: number) =>
    interpolate(frame, [delaySec * fps, (delaySec + 0.4) * fps], [0, 1], clamp);
  const lift = (delaySec: number) => (1 - appear(delaySec)) * 20;

  const cx = 760;
  return (
    <SceneSvg>
      <Sky id="out-sky" top="#08122a" bottom="#1d3462" />
      <Stars count={120} seed="out" />
      <Snow count={30} seed="out" opacity={0.5} />
      <g opacity={appear(0.1)} transform={`translate(0 ${lift(0.1)})`}>
        <text
          x={cx}
          y={170}
          textAnchor="middle"
          fontSize={46}
          fontWeight={800}
          fill="#8fc8f5"
          letterSpacing={3}
        >
          REKOR
        </text>
        <text
          x={cx}
          y={350}
          textAnchor="middle"
          fontSize={190}
          fontWeight={900}
          fill="white"
        >
          -89,2°C
        </text>
        <text
          x={cx}
          y={425}
          textAnchor="middle"
          fontSize={52}
          fontWeight={700}
          fill="#b8c8e0"
        >
          Antarktika, 1983
        </text>
      </g>
      <g opacity={appear(1.0)} transform={`translate(0 ${lift(1.0)})`}>
        <text
          x={cx}
          y={660}
          textAnchor="middle"
          fontSize={170}
          fontWeight={900}
          fill="#ff6a55"
        >
          -100°C?
        </text>
        <text
          x={cx}
          y={750}
          textAnchor="middle"
          fontSize={52}
          fontWeight={700}
          fill="white"
        >
          Henüz hiç ölçülmedi.
        </text>
      </g>
      <Thermometer x={1620} y={110} h={860} level={0.02} />
    </SceneSvg>
  );
};
