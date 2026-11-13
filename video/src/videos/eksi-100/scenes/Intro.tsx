import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  clamp,
  Ground,
  mix,
  SceneSvg,
  Skyline,
  Sky,
  Snow,
  Thermometer,
  W,
  H,
} from "./common";

// 0: Temperature drops from 18° to -100° over the city.
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0.2 * fps, 3.4 * fps], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const temp = Math.round(18 - 118 * p);
  const frost = interpolate(frame, [3.0 * fps, 3.8 * fps], [0, 1], clamp);

  return (
    <SceneSvg>
      <Sky
        id="intro-sky"
        top={mix(p, "#6d8fc2", "#26375c")}
        bottom={mix(p, "#a9c0dd", "#5d7099")}
      />
      <Snow count={Math.round(20 + 90 * p)} seed="intro" speed={0.8 + p} />
      <Skyline color={mix(p, "#46557a", "#33415f")} />
      <Ground color={mix(p, "#d7e1ee", "#e8f0fa")} />
      <text
        x={420}
        y={540}
        textAnchor="middle"
        fontSize={190}
        fontWeight={900}
        fill="white"
        stroke="#1b2235"
        strokeWidth={14}
        paintOrder="stroke"
      >
        {temp}°
      </text>
      <Thermometer
        x={1620}
        y={290}
        h={600}
        level={interpolate(p, [0, 1], [0.95, 0.03])}
      />
      {/* frost vignette at the end */}
      <defs>
        <radialGradient id="intro-frost" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="white" stopOpacity={0} />
          <stop offset="1" stopColor="#eaf6ff" stopOpacity={0.85} />
        </radialGradient>
      </defs>
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill="url(#intro-frost)"
        opacity={frost}
      />
    </SceneSvg>
  );
};
