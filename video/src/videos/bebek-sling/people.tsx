// Soft, rounded characters for the mother & baby (midwifery) series.
// Coordinates are relative to the feet (0,0); body points up (negative y). Front view.
import React from "react";
import { useCurrentFrame } from "remotion";

export const SKIN = "#f2c4a2";
export const SKIN_DARK = "#d9a07c";
const INK = "#4a3a36";

type Arms = "down" | "hold" | "point" | "wave" | "tie";

const Arm: React.FC<{ side: 1 | -1; pose: Arms; color: string }> = ({
  side,
  pose,
  color,
}) => {
  const frame = useCurrentFrame();
  const sx = side * 72;
  const sy = -438;
  let d: string;
  switch (pose) {
    case "hold": // hands meet under the baby
      d = `M ${sx} ${sy} Q ${side * 105} -350 ${side * 28} -292`;
      break;
    case "point": {
      const wob = Math.sin(frame / 8) * 4;
      d =
        side === 1
          ? `M ${sx} ${sy} Q 150 -470 ${190 + wob} -520`
          : `M ${sx} ${sy} Q -100 -360 -80 -300`;
      break;
    }
    case "wave": {
      const w = Math.sin(frame / 5) * 14;
      d =
        side === 1
          ? `M ${sx} ${sy} Q 140 -480 ${120 + w} -580`
          : `M ${sx} ${sy} Q -100 -360 -80 -300`;
      break;
    }
    case "tie": // both hands at the waist knot
      d = `M ${sx} ${sy} Q ${side * 110} -320 ${side * 20} -262`;
      break;
    default:
      d = `M ${sx} ${sy} Q ${side * 100} -360 ${side * 88} -280`;
  }
  const end = d.split(" ").slice(-2).map(Number);
  return (
    <g>
      <path
        d={d}
        stroke={color}
        strokeWidth={34}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={end[0]} cy={end[1]} r={17} fill={SKIN} />
    </g>
  );
};

/** Mother / midwife base. `front` is drawn between body and arms (carriers, baby). */
export const Person: React.FC<{
  x: number;
  y: number;
  scale?: number;
  top: string;
  bottom: string;
  hair?: "bun" | "cap";
  arms?: Arms;
  mood?: "smile" | "calm" | "talk";
  stethoscope?: boolean;
  behind?: React.ReactNode; // drawn behind the body (back carry baby)
  front?: React.ReactNode;
  /** back = seen from behind: no face, hair covers the head */
  view?: "front" | "back";
}> = ({
  x,
  y,
  scale = 1,
  top,
  bottom,
  hair = "bun",
  arms = "down",
  mood = "smile",
  stethoscope,
  behind,
  front,
  view = "front",
}) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 18) * 2;
  const blink = frame % 110 > 106;
  const talk = mood === "talk" ? Math.abs(Math.sin(frame / 3)) * 6 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={120} ry={18} fill="#6b4e44" opacity={0.15} />
      {behind}
      {/* legs + shoes */}
      <path d="M -70 -250 L -78 -20 L -14 -20 L -8 -250 Z" fill={bottom} />
      <path d="M 70 -250 L 78 -20 L 14 -20 L 8 -250 Z" fill={bottom} />
      <ellipse cx={-48} cy={-12} rx={38} ry={16} fill={INK} />
      <ellipse cx={48} cy={-12} rx={38} ry={16} fill={INK} />
      {/* torso */}
      <path
        d={`M -78 -440 Q -92 -330 -82 -238 L 82 -238 Q 92 -330 78 -440 Q 0 ${-468 + breathe} -78 -440 Z`}
        fill={top}
      />
      {/* neck + head */}
      <rect x={-18} y={-480} width={36} height={40} fill={SKIN_DARK} />
      {hair === "bun" && <circle cx={0} cy={-602} r={34} fill="#5b3a2e" />}
      <circle cx={0} cy={-530} r={64} fill={SKIN} />
      {hair === "bun" && (
        <path
          d="M -66 -532 Q -70 -606 0 -604 Q 70 -606 66 -532 Q 40 -578 0 -574 Q -40 -578 -66 -532 Z"
          fill="#5b3a2e"
        />
      )}
      {hair === "cap" && (
        <g>
          <path
            d="M -66 -540 Q -70 -612 0 -612 Q 70 -612 66 -540 Q 0 -566 -66 -540 Z"
            fill="#5fb3a8"
          />
          <path
            d="M -66 -540 Q -64 -500 -58 -486 L -46 -536 Z"
            fill="#5b3a2e"
          />
          <path d="M 66 -540 Q 64 -500 58 -486 L 46 -536 Z" fill="#5b3a2e" />
        </g>
      )}
      {view === "back" && <circle cx={0} cy={-534} r={67} fill="#5b3a2e" />}
      {view === "front" && (
        <>
          {/* face */}
          {blink ? (
            <g stroke={INK} strokeWidth={4} strokeLinecap="round">
              <line x1={-30} y1={-530} x2={-16} y2={-530} />
              <line x1={16} y1={-530} x2={30} y2={-530} />
            </g>
          ) : (
            <g fill={INK}>
              <circle cx={-23} cy={-530} r={6} />
              <circle cx={23} cy={-530} r={6} />
            </g>
          )}
          <circle cx={-38} cy={-506} r={10} fill="#f19a8f" opacity={0.5} />
          <circle cx={38} cy={-506} r={10} fill="#f19a8f" opacity={0.5} />
          {mood === "calm" ? (
            <path
              d="M -12 -500 Q 0 -494 12 -500"
              stroke={INK}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <path
              d={`M -16 -503 Q 0 ${-488 + talk} 16 -503`}
              stroke={INK}
              strokeWidth={5}
              fill={mood === "talk" ? "#8a4b45" : "none"}
              strokeLinecap="round"
            />
          )}
        </>
      )}
      {stethoscope && view === "front" && (
        <path
          d="M -40 -446 Q -50 -360 0 -350 Q 50 -360 40 -446 M 0 -350 L 0 -320"
          stroke="#3d4a5c"
          strokeWidth={7}
          fill="none"
        />
      )}
      {front}
      <Arm side={-1} pose={arms} color={top} />
      <Arm side={1} pose={arms} color={top} />
    </g>
  );
};

/** Sleeping baby, seen from the front, tummy-to-tummy on the parent's chest.
 * (bx, by) = baby's head centre. Legs drawn in the M position (knees above the bottom). */
export const Baby: React.FC<{
  bx?: number;
  by?: number;
  legs?: "M" | "straight";
  awake?: boolean;
}> = ({ bx = 0, by = -420, legs = "M", awake = false }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 12) * 1.5;
  return (
    <g transform={`translate(${bx} ${by})`}>
      {/* body */}
      <ellipse cx={0} cy={78 + breathe} rx={50} ry={66} fill="#fbe7c6" />
      {legs === "M" ? (
        <g fill={SKIN}>
          <path d="M -40 120 Q -86 112 -84 70 Q -70 58 -58 74 Q -58 100 -30 110 Z" />
          <path d="M 40 120 Q 86 112 84 70 Q 70 58 58 74 Q 58 100 30 110 Z" />
        </g>
      ) : (
        <g fill={SKIN}>
          <rect x={-34} y={120} width={22} height={80} rx={11} />
          <rect x={12} y={120} width={22} height={80} rx={11} />
        </g>
      )}
      {/* head */}
      <circle cx={0} cy={0} r={44} fill={SKIN} />
      <path
        d="M -10 -44 Q 0 -60 8 -44"
        stroke="#5b3a2e"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      {awake ? (
        <g fill={INK}>
          <circle cx={-15} cy={2} r={4.5} />
          <circle cx={15} cy={2} r={4.5} />
        </g>
      ) : (
        <g stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round">
          <path d="M -21 2 Q -15 8 -9 2" />
          <path d="M 9 2 Q 15 8 21 2" />
        </g>
      )}
      <circle cx={-24} cy={16} r={7} fill="#f19a8f" opacity={0.55} />
      <circle cx={24} cy={16} r={7} fill="#f19a8f" opacity={0.55} />
      <path
        d="M -5 22 Q 0 26 5 22"
        stroke={INK}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
};

/* ---------- carriers (drawn in the mother's coordinate space) ---------- */

const draw = (p: number) => ({ pathLength: 1, strokeDasharray: `${p} 1` });

/** Ring sling: rings on the left shoulder, band across to the right hip, tail hanging. */
export const RingSling: React.FC<{
  fabric: number;
  baby: number;
  tight: number;
  color: string;
}> = ({ fabric, baby, tight, color }) => (
  <g>
    {baby > 0 && (
      <g opacity={baby} transform={`translate(0 ${(1 - baby) * 40})`}>
        <Baby bx={6} by={-424 + (1 - tight) * 18} />
      </g>
    )}
    {/* pouch over the baby's body */}
    <path
      d="M -70 -440 Q -10 -420 70 -250 Q 0 -232 -60 -262 Q -95 -330 -70 -440 Z"
      fill={color}
      opacity={fabric * 0.92}
    />
    <path
      d="M -70 -440 Q -10 -420 70 -250"
      stroke="#ffffff"
      strokeOpacity={0.35}
      strokeWidth={6}
      fill="none"
      {...draw(fabric)}
    />
    {/* rings + tail */}
    <g opacity={fabric}>
      <circle
        cx={-64}
        cy={-452}
        r={20}
        fill="none"
        stroke="#d8b24a"
        strokeWidth={7}
      />
      <circle
        cx={-58}
        cy={-446}
        r={20}
        fill="none"
        stroke="#e8c86a"
        strokeWidth={7}
      />
      <path
        d={`M -64 -432 Q ${-96 - tight * 8} -360 ${-88 - tight * 10} ${-300 + tight * 14}`}
        stroke={color}
        strokeWidth={30}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  </g>
);

/** Wrap front cross carry (stretchy or woven): pocket band + X over the baby + optional knot. */
export const WrapCross: React.FC<{
  pocket: number;
  baby: number;
  cross: number;
  knot: number;
  color: string;
  stripes?: boolean;
}> = ({ pocket, baby, cross, knot, color, stripes }) => (
  <g>
    {baby > 0 && (
      <g opacity={baby} transform={`translate(0 ${(1 - baby) * 40})`}>
        <Baby by={-424} />
      </g>
    )}
    {/* horizontal pocket over the baby's body */}
    <rect
      x={-78}
      y={-380}
      width={156}
      height={92}
      rx={22}
      fill={color}
      opacity={pocket * 0.95}
    />
    {/* X: shoulders to opposite hips, under the baby's bottom */}
    {["M -70 -446 Q -20 -360 60 -262", "M 70 -446 Q 20 -360 -60 -262"].map(
      (d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={40}
          fill="none"
          strokeLinecap="round"
          {...draw(cross)}
        />
      ),
    )}
    {stripes && cross > 0.9 && (
      <g stroke="#ffffff" strokeOpacity={0.4} strokeWidth={4} fill="none">
        <path d="M -70 -446 Q -20 -360 60 -262" />
        <path d="M 70 -446 Q 20 -360 -60 -262" />
      </g>
    )}
    {knot > 0 && (
      <g
        opacity={knot}
        transform={`translate(0 -252) scale(${0.6 + 0.4 * knot})`}
      >
        <circle cx={0} cy={0} r={24} fill={color} />
        <path
          d="M -8 10 Q -30 50 -40 80 M 8 10 Q 30 50 40 80"
          stroke={color}
          strokeWidth={22}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    )}
  </g>
);

/** Back carry: baby behind (peeks over the shoulder), straps cross the chest to a knot. */
export const BackCarryBaby: React.FC<{ baby: number }> = ({ baby }) =>
  baby > 0 ? (
    <g opacity={baby} transform={`translate(${(1 - baby) * 60} 0)`}>
      <Baby bx={62} by={-560} awake />
    </g>
  ) : null;

export const BackCarryStraps: React.FC<{
  straps: number;
  knot: number;
  color: string;
}> = ({ straps, knot, color }) => (
  <g>
    {["M -66 -446 Q -40 -380 0 -352", "M 66 -446 Q 40 -380 0 -352"].map(
      (d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={30}
          fill="none"
          strokeLinecap="round"
          {...draw(straps)}
        />
      ),
    )}
    {/* baby's legs around the waist */}
    <g opacity={straps}>
      <ellipse cx={-96} cy={-268} rx={20} ry={26} fill={SKIN} />
      <ellipse cx={96} cy={-268} rx={20} ry={26} fill={SKIN} />
      <rect
        x={-86}
        y={-300}
        width={172}
        height={46}
        rx={20}
        fill={color}
        opacity={0.9}
      />
    </g>
    {knot > 0 && (
      <g opacity={knot} transform="translate(0 -350)">
        <circle cx={0} cy={0} r={22} fill={color} />
        <path
          d="M -6 10 Q -24 44 -30 70 M 6 10 Q 24 44 30 70"
          stroke={color}
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    )}
  </g>
);

/** Mei tai: waist band, panel over the baby, shoulder straps. */
export const MeiTai: React.FC<{
  waist: number;
  baby: number;
  panel: number;
  straps: number;
  color: string;
  accent: string;
}> = ({ waist, baby, panel, straps, color, accent }) => (
  <g>
    {baby > 0 && (
      <g opacity={baby} transform={`translate(0 ${(1 - baby) * 40})`}>
        <Baby by={-424} />
      </g>
    )}
    <g opacity={panel}>
      <path
        d="M -66 -400 Q 0 -414 66 -400 L 70 -262 L -70 -262 Z"
        fill={color}
      />
      <path d="M -40 -380 L 40 -380 L 0 -300 Z" fill={accent} opacity={0.8} />
    </g>
    {["M -66 -400 Q -70 -430 -70 -446", "M 66 -400 Q 70 -430 70 -446"].map(
      (d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={28}
          fill="none"
          strokeLinecap="round"
          {...draw(straps)}
        />
      ),
    )}
    <g opacity={waist}>
      <rect x={-92} y={-270} width={184} height={36} rx={16} fill={accent} />
      <path
        d="M 92 -252 Q 124 -230 120 -190 M 92 -252 Q 132 -250 150 -220"
        stroke={accent}
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  </g>
);
