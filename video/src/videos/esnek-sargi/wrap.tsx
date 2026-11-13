// Stretchy wrap, pocket wrap cross carry — drawn in the mother's coordinate space (feet = 0,0).
// Every stage is a 0..1 progress value so each step can be animated on its caption cue.
import React from "react";
import { interpolate } from "remotion";
import { Baby } from "../bebek-sling/people";

export const WRAP = "#b9a3dd";
const WRAP_DARK = "#9a83c2";
const HI = "#ff8f7a";

export type WrapState = {
  band: number; // horizontal band (later the pocket) across the waist
  drapes: number; // ends hanging from the shoulders in front
  tucked: number; // ends passed under the band
  frontX: number; // ends crossed in front
  waist: number; // tails around the waist
  baby: number; // baby appears (high on the shoulder)
  babyIn: number; // baby lowered into the cross passes
  spread: number; // cross passes spread knee to knee
  pocketUp: number; // pocket pulled up the baby's back
  mMark: number; // highlight the M position
  faceMark: number; // highlight the free face
};

export const EMPTY: WrapState = {
  band: 0,
  drapes: 0,
  tucked: 0,
  frontX: 0,
  waist: 0,
  baby: 0,
  babyIn: 0,
  spread: 0,
  pocketUp: 0,
  mMark: 0,
  faceMark: 0,
};

export const DONE: WrapState = {
  band: 1,
  drapes: 1,
  tucked: 1,
  frontX: 1,
  waist: 1,
  baby: 1,
  babyIn: 1,
  spread: 1,
  pocketUp: 1,
  mMark: 0,
  faceMark: 0,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Front view: baby → cross passes → pocket (outermost layer). */
export const WrapFront: React.FC<{ s: WrapState }> = ({ s }) => {
  const bandW = 170 * s.band;
  const pocketTop = lerp(-330, -392, s.pocketUp);
  const passW = lerp(34, 62, s.spread);
  const babyY = lerp(-500, -424, s.babyIn);
  const passes = [-1, 1].map((side) => {
    const sx = side * 66;
    const sy = -446;
    // hanging (drapes) → crossed to the opposite hip (frontX)
    const hangEnd = lerp(-300, -200, s.tucked);
    // cubic: the passes come down BESIDE the baby's head and cross low on the baby's back
    const c1x = lerp(side * 64, side * 74, s.frontX);
    const c1y = lerp(-400, -380, s.frontX);
    const c2x = lerp(side * 60, side * 44, s.frontX);
    const c2y = lerp(-330, -300, s.frontX);
    const ex = lerp(side * 58, -side * 70, s.frontX);
    const ey = lerp(hangEnd, -256, s.frontX);
    return {
      d: `M ${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`,
      side,
    };
  });
  return (
    <g>
      {s.baby > 0 && (
        <g opacity={Math.min(1, s.baby * 1.5)}>
          <Baby by={babyY} />
        </g>
      )}
      {/* cross passes */}
      {s.drapes > 0 &&
        passes.map((p) => (
          <g key={p.side}>
            <path
              d={p.d}
              stroke={WRAP_DARK}
              strokeWidth={passW + 6}
              fill="none"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${s.drapes} 1`}
            />
            <path
              d={p.d}
              stroke={WRAP}
              strokeWidth={passW}
              fill="none"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${s.drapes} 1`}
            />
          </g>
        ))}
      {/* tails around the waist */}
      {s.waist > 0 && (
        <g opacity={s.waist}>
          <rect
            x={-92}
            y={-270}
            width={34}
            height={30}
            rx={12}
            fill={WRAP_DARK}
          />
          <rect
            x={58}
            y={-270}
            width={34}
            height={30}
            rx={12}
            fill={WRAP_DARK}
          />
        </g>
      )}
      {/* horizontal band → pocket */}
      {s.band > 0 && (
        <g>
          <rect
            x={-bandW / 2}
            y={pocketTop}
            width={bandW}
            height={-262 - pocketTop}
            rx={22}
            fill={WRAP}
          />
          <rect
            x={-bandW / 2}
            y={pocketTop}
            width={bandW}
            height={8}
            rx={4}
            fill="#ffffff"
            opacity={0.35}
          />
          {s.band < 1 && <circle cx={0} cy={-296} r={10} fill={HI} />}
        </g>
      )}
      {/* M position highlight over the knees */}
      {s.mMark > 0 && (
        <path
          d={`M -84 ${babyY + 70} L -58 ${babyY + 112} L 0 ${babyY + 128} L 58 ${babyY + 112} L 84 ${babyY + 70}`}
          stroke={HI}
          strokeWidth={6}
          fill="none"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={`${s.mMark} 1`}
        />
      )}
      {s.faceMark > 0 && (
        <g opacity={s.faceMark}>
          <circle
            cx={0}
            cy={babyY}
            r={58}
            fill="none"
            stroke="#5fb37e"
            strokeWidth={6}
            strokeDasharray="12 9"
          />
        </g>
      )}
    </g>
  );
};

/** Back view: crossed passes on the back, optional waist band + double knot. */
export const WrapBack: React.FC<{ cross: number; knot: number }> = ({
  cross,
  knot,
}) => (
  <g>
    {[-1, 1].map((side) => (
      <g key={side}>
        <path
          d={`M ${side * 80} -262 Q ${side * 10} -360 ${-side * 66} -446`}
          stroke={WRAP_DARK}
          strokeWidth={42}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${cross} 1`}
        />
        <path
          d={`M ${side * 80} -262 Q ${side * 10} -360 ${-side * 66} -446`}
          stroke={WRAP}
          strokeWidth={36}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${cross} 1`}
        />
      </g>
    ))}
    {knot > 0 && (
      <g opacity={knot}>
        <rect
          x={-88}
          y={-276}
          width={176}
          height={34}
          rx={14}
          fill={WRAP_DARK}
        />
        <g
          transform={`translate(0 -259) scale(${interpolate(knot, [0, 1], [0.5, 1])})`}
        >
          <circle cx={-14} cy={0} r={20} fill={WRAP} />
          <circle cx={14} cy={0} r={20} fill={WRAP} />
          <path
            d="M -10 14 Q -26 50 -34 84 M 10 14 Q 26 50 34 84"
            stroke={WRAP}
            strokeWidth={22}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>
    )}
  </g>
);
