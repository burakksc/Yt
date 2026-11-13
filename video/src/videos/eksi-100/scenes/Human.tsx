import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  clamp,
  Ground,
  SceneSvg,
  Skyline,
  Sky,
  Snow,
  StickFigure,
  TempChip,
  useProgress,
} from "./common";

// 1: A person walks in, skin freezes, then gets encased in ice.
export const HumanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const walkIn = useProgress(0, 1.8);
  const x = interpolate(walkIn, [0, 1], [300, 960]);
  const walking = interpolate(frame, [0, 1.8 * fps], [0, 1], clamp) < 1;
  const freeze = useProgress(2.0, 4.2);
  const ice = useProgress(4.3, 5.4);
  const shiver =
    freeze > 0 && ice < 1 ? Math.sin(frame * 1.7) * 3 * (1 - ice) : 0;

  return (
    <SceneSvg>
      <Sky id="human-sky" top="#2b3b62" bottom="#6b7ca6" />
      <Snow seed="human" />
      <Skyline />
      <Ground />
      <StickFigure
        x={x + shiver}
        freeze={freeze}
        ice={ice}
        walk={walking ? frame / 3 : 0}
        scale={1.35}
      />
      <TempChip />
    </SceneSvg>
  );
};
