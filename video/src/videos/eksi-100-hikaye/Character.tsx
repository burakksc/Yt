// Our channel mascot: stick-figure body, round face, teal ushanka with ear flaps,
// long mustard scarf and mittens. Pose, expression and frost are parametric.
import React from "react";
import { useCurrentFrame } from "remotion";
import { mix } from "./kit";

export type Pose = "stand" | "walk" | "hug" | "phone" | "shiver" | "reach";
export type Mood = "neutral" | "worried" | "shocked" | "relieved";

const INK = "#161a24";

export const Character: React.FC<{
  x: number;
  y: number; // feet position
  scale?: number;
  facing?: 1 | -1;
  pose?: Pose;
  mood?: Mood;
  frost?: number; // 0..1
  walkSpeed?: number;
}> = ({
  x,
  y,
  scale = 1,
  facing = 1,
  pose = "stand",
  mood = "neutral",
  frost = 0,
  walkSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const ink = mix(frost, INK, "#5d86a8");
  const hat = mix(frost, "#1f5f6b", "#8fbcd0");
  const fur = mix(frost, "#e9dcc3", "#f2f8ff");
  const scarf = mix(frost, "#e2a72e", "#d9d2a8");
  const face = mix(frost, "#ffffff", "#e3f2ff");

  // idle breathing / shiver / walk cycle
  const breathe = Math.sin(frame / 14) * 2;
  const shiver = pose === "shiver" ? Math.sin(frame * 2.1) * 3 : 0;
  const phase = (frame / 4) * walkSpeed;
  const swing = pose === "walk" ? Math.sin(phase) * 26 : 0;
  const bob = pose === "walk" ? Math.abs(Math.cos(phase)) * -6 : 0;

  // blink every ~3.3 s
  const blink = frame % 100 > 96;

  // arms: [shoulder angle, elbow angle] in degrees, 0 = straight down, positive = forward
  const arms: Record<Pose, [[number, number], [number, number]]> = {
    stand: [
      [8, 6],
      [-8, -6],
    ],
    walk: [
      [swing * 0.9, 10],
      [-swing * 0.9, 10],
    ],
    hug: [
      [78, 40],
      [70, 55],
    ],
    phone: [
      [40, 95],
      [-10, -6],
    ],
    shiver: [
      [55, 110],
      [45, 120],
    ],
    reach: [
      [95, 5],
      [-10, -6],
    ],
  };
  const [front, back] = arms[pose];

  const arm = ([a1, a2]: [number, number], key: string, behind: boolean) => {
    const len1 = 70;
    const len2 = 64;
    const r1 = (a1 * Math.PI) / 180;
    const r2 = ((a1 + a2) * Math.PI) / 180;
    const sx = 0;
    const sy = -238;
    const ex = sx + Math.sin(r1) * len1;
    const ey = sy + Math.cos(r1) * len1;
    const hx = ex + Math.sin(r2) * len2;
    const hy = ey + Math.cos(r2) * len2;
    return (
      <g key={key} opacity={behind ? 0.85 : 1}>
        <polyline
          points={`${sx},${sy} ${ex},${ey} ${hx},${hy}`}
          stroke={ink}
          strokeWidth={11}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* mitten */}
        <ellipse
          cx={hx}
          cy={hy}
          rx={15}
          ry={13}
          fill={mix(frost, "#b8442f", "#c9a3a3")}
        />
      </g>
    );
  };

  const leg = (dir: number, key: string) => (
    <g key={key}>
      <line
        x1={0}
        y1={-130}
        x2={dir * swing * 0.7}
        y2={-14}
        stroke={ink}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <ellipse cx={dir * swing * 0.7 + 10} cy={-8} rx={24} ry={11} fill={ink} />
    </g>
  );

  const eyes = () => {
    if (blink) {
      return (
        <g stroke={ink} strokeWidth={4} strokeLinecap="round">
          <line x1={-20} y1={-318} x2={-8} y2={-318} />
          <line x1={14} y1={-318} x2={26} y2={-318} />
        </g>
      );
    }
    const r = mood === "shocked" ? 7 : 5.5;
    return (
      <g fill={ink}>
        <circle cx={-13} cy={-318} r={r} />
        <circle cx={20} cy={-318} r={r} />
        {mood === "worried" && (
          <g stroke={ink} strokeWidth={3.5} strokeLinecap="round">
            <line x1={-24} y1={-336} x2={-6} y2={-332} />
            <line x1={30} y1={-336} x2={12} y2={-332} />
          </g>
        )}
      </g>
    );
  };

  const mouth = () => {
    switch (mood) {
      case "shocked":
        return <ellipse cx={5} cy={-292} rx={8} ry={11} fill={ink} />;
      case "worried":
        return (
          <path
            d="M -8 -288 Q 4 -298 18 -288"
            stroke={ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        );
      case "relieved":
        return (
          <path
            d="M -10 -296 Q 4 -282 20 -296"
            stroke={ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <line
            x1={-4}
            y1={-292}
            x2={14}
            y2={-292}
            stroke={ink}
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <g
      transform={`translate(${x + shiver} ${y + bob}) scale(${scale * facing} ${scale})`}
    >
      {/* shadow */}
      <ellipse cx={8} cy={0} rx={70} ry={12} fill="#0c1222" opacity={0.25} />
      {arm(back, "back", true)}
      {leg(-1, "l1")}
      {leg(1, "l2")}
      {/* torso */}
      <line
        x1={0}
        y1={-250}
        x2={0}
        y2={-126}
        stroke={ink}
        strokeWidth={13}
        strokeLinecap="round"
        transform={`translate(0 ${breathe * 0.3})`}
      />
      {/* scarf: wrap + two tails blowing back */}
      <rect x={-34} y={-262} width={68} height={28} rx={10} fill={scarf} />
      <path
        d={`M -18 -246 Q ${-40 - Math.sin(frame / 6) * 6} -210 ${-30 - Math.sin(frame / 5) * 10} -168`}
        stroke={scarf}
        strokeWidth={20}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M -20 -176 l -8 14 M -32 -172 l -6 14"
        stroke={mix(frost, "#b8831f", "#c9c4a0")}
        strokeWidth={4}
      />
      {arm(front, "front", false)}
      {/* head */}
      <circle
        cx={2}
        cy={-312}
        r={46}
        fill={face}
        stroke={ink}
        strokeWidth={5}
      />
      {eyes()}
      {mouth()}
      {/* cheeks redden with cold */}
      <circle
        cx={-26}
        cy={-298}
        r={8}
        fill="#f08a8a"
        opacity={0.45 * (1 - frost)}
      />
      <circle
        cx={34}
        cy={-298}
        r={8}
        fill="#f08a8a"
        opacity={0.45 * (1 - frost)}
      />
      {/* ushanka */}
      <path d="M -48 -322 Q -50 -378 2 -380 Q 54 -378 52 -322 Z" fill={hat} />
      <rect x={-54} y={-334} width={112} height={20} rx={10} fill={fur} />
      <path
        d="M -50 -326 Q -66 -300 -52 -270 Q -38 -282 -40 -320 Z"
        fill={fur}
      />
      <path d="M 54 -326 Q 70 -300 56 -270 Q 42 -282 44 -320 Z" fill={fur} />
      {/* frost crystals on hat and shoulders */}
      {frost > 0.25 &&
        [
          [-30, -372],
          [30, -366],
          [-40, -246],
          [36, -250],
          [-6, -390],
        ].map(([fx, fy], i) => (
          <path
            key={i}
            d={`M ${fx - 7} ${fy} L ${fx + 7} ${fy} M ${fx} ${fy - 7} L ${fx} ${fy + 7} M ${fx - 5} ${fy - 5} L ${fx + 5} ${fy + 5} M ${fx - 5} ${fy + 5} L ${fx + 5} ${fy - 5}`}
            stroke="white"
            strokeWidth={2.5}
            opacity={(frost - 0.25) / 0.75}
          />
        ))}
    </g>
  );
};
