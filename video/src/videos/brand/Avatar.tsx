// "Interestingly Cozy" channel avatar (800x800). YouTube crops to a circle and shows it
// as small as ~40px, so: one bold central shape, high contrast, no small text.
// Concept: a steaming mug (cozy) whose steam curls into a question mark (interesting facts),
// under a night sky with a crescent moon (sleep videos).
import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Nunito";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

export type AvatarProps = {
  readonly variant: "night" | "warm" | "monogram";
};

const PALETTES = {
  night: {
    bg1: "#2a2350",
    bg2: "#14112b",
    mug: "#f4b36b",
    mugDark: "#d98a43",
    steam: "#fff3dc",
    moon: "#ffe7a8",
    glow: "#ffb86b",
  },
  warm: {
    bg1: "#f6a96b",
    bg2: "#d9674a",
    mug: "#fff4e6",
    mugDark: "#f1d3b8",
    steam: "#ffffff",
    moon: "#fff4d6",
    glow: "#ffe0b0",
  },
  monogram: {
    bg1: "#2a2350",
    bg2: "#14112b",
    mug: "#f4b36b",
    mugDark: "#d98a43",
    steam: "#fff3dc",
    moon: "#ffe7a8",
    glow: "#ffb86b",
  },
};

const Stars: React.FC<{ color: string }> = ({ color }) => (
  <g fill={color}>
    {[
      [210, 210, 7],
      [640, 300, 8],
      [170, 370, 5],
      [270, 140, 4],
    ].map(([x, y, r], i) => (
      <path
        key={i}
        d={`M ${x} ${y - r * 2} Q ${x} ${y} ${x + r * 2} ${y} Q ${x} ${y} ${x} ${y + r * 2} Q ${x} ${y} ${x - r * 2} ${y} Q ${x} ${y} ${x} ${y - r * 2} Z`}
      />
    ))}
  </g>
);

const Mug: React.FC<{ p: (typeof PALETTES)["night"]; y?: number }> = ({
  p,
  y = 0,
}) => (
  <g transform={`translate(0 ${y})`}>
    {/* warm glow behind the mug */}
    <circle cx={400} cy={520} r={230} fill="url(#glow)" />
    {/* steam curling into a question mark */}
    <path
      d="M 340 395 C 300 340 360 310 345 255 C 335 215 300 200 300 160 C 300 105 345 70 400 70 C 460 70 500 112 500 165 C 500 215 460 240 430 262 C 405 280 400 300 400 330"
      stroke={p.steam}
      strokeWidth={34}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={400} cy={390} r={22} fill={p.steam} />
    {/* mug body */}
    <path
      d="M 255 440 L 545 440 L 525 640 Q 520 680 480 680 L 320 680 Q 280 680 275 640 Z"
      fill={p.mug}
    />
    <path
      d="M 545 470 C 640 470 650 600 540 610"
      stroke={p.mug}
      strokeWidth={34}
      fill="none"
      strokeLinecap="round"
    />
    <path d="M 255 440 L 545 440 L 542 470 L 258 470 Z" fill={p.mugDark} />
    {/* little heart on the mug */}
    <path
      d="M 400 600 C 360 572 366 538 400 556 C 434 538 440 572 400 600 Z"
      fill={p.mugDark}
    />
    {/* saucer */}
    <ellipse cx={400} cy={690} rx={200} ry={26} fill={p.mugDark} />
  </g>
);

export const Avatar: React.FC<AvatarProps> = ({ variant }) => {
  const p = PALETTES[variant];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <svg viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <radialGradient id="bg" cx="0.5" cy="0.4" r="0.75">
            <stop offset="0" stopColor={p.bg1} />
            <stop offset="1" stopColor={p.bg2} />
          </radialGradient>
          <radialGradient id="glow">
            <stop
              offset="0"
              stopColor={p.glow}
              stopOpacity={variant === "warm" ? 0.35 : 0.45}
            />
            <stop offset="1" stopColor={p.glow} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={800} height={800} fill="url(#bg)" />
        {variant !== "warm" && <Stars color={p.moon} />}
        {/* crescent moon (mask, so it works on any background) */}
        <mask id="crescent">
          <rect width={800} height={800} fill="black" />
          <circle cx={600} cy={175} r={62} fill="white" />
          <circle cx={630} cy={157} r={56} fill="black" />
        </mask>
        <rect width={800} height={800} fill={p.moon} mask="url(#crescent)" />
        {variant === "monogram" ? (
          <g>
            <circle cx={400} cy={430} r={240} fill="url(#glow)" />
            <text
              x={400}
              y={520}
              textAnchor="middle"
              fontSize={300}
              fontWeight={900}
              fill={p.mug}
              letterSpacing={-12}
            >
              IC
            </text>
            <path
              d="M 300 300 C 280 250 330 230 315 190 M 400 300 C 380 250 430 230 415 190 M 500 300 C 480 250 530 230 515 190"
              stroke={p.steam}
              strokeWidth={22}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g transform="translate(400 430) scale(0.86) translate(-400 -380)">
            <Mug p={p} />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
