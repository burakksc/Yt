// Scenes for the midwife-led baby sling video (1080x1920).
// Zones: title 250–470, step chips ~520–600, characters 700–1410, captions 1480+.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { wordStartFrame } from "../../components/WordCaptions";
import { Canvas, Glow, Gradient } from "../eksi-100-hikaye/kit";
import {
  BackCarryBaby,
  BackCarryStraps,
  Baby,
  MeiTai,
  Person,
  RingSling,
  WrapCross,
} from "./people";
import type { BebekScene, BebekSceneId } from "./story";

const FLOOR = 1410;
const MOM = { top: "#f4a99a", bottom: "#7f9bb8" };
const MIDWIFE = { top: "#7cc6b8", bottom: "#5fa596" };
const C = {
  ring: "#e98a8a",
  stretchy: "#b9a3dd",
  woven: "#f0b45e",
  back: "#6fb8d6",
  meitai: "#8fc59a",
  meitaiAccent: "#4f8f63",
};

/** 0..1 progress of each step, starting when its keyword appears in the caption. */
const useSteps = (scene: BebekScene) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.round(scene.sec * fps);
  return scene.steps.map((s) => {
    const f0 = wordStartFrame(scene.text, s.at, total, fps);
    return interpolate(frame, [f0, f0 + 0.6 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });
};

/* ---------- background ---------- */

export const Nursery: React.FC = () => (
  <>
    <Gradient
      stops={[
        [0, "#fdf3ea"],
        [0.6, "#f9e1d2"],
        [1, "#f4d3c2"],
      ]}
    />
    {/* polka-dot wallpaper */}
    {new Array(9)
      .fill(0)
      .map((_, r) =>
        new Array(7)
          .fill(0)
          .map((__, c) => (
            <circle
              key={`${r}${c}`}
              cx={60 + c * 160 + (r % 2) * 80}
              cy={520 + r * 110}
              r={7}
              fill="#f2c2b0"
              opacity={0.5}
            />
          )),
      )}
    {/* window with curtains */}
    <rect
      x={720}
      y={520}
      width={300}
      height={360}
      rx={18}
      fill="#cfe8f3"
      stroke="#fff6ee"
      strokeWidth={18}
    />
    <circle cx={930} cy={600} r={36} fill="#fff6c8" />
    <path
      d="M 700 500 Q 760 700 720 900 L 690 900 L 690 500 Z"
      fill="#9fd3c7"
    />
    <path
      d="M 1040 500 Q 980 700 1020 900 L 1050 900 L 1050 500 Z"
      fill="#9fd3c7"
    />
    <rect x={680} y={490} width={390} height={18} rx={9} fill="#e8b9a6" />
    {/* framed heart */}
    <rect
      x={90}
      y={560}
      width={170}
      height={150}
      rx={12}
      fill="#fff6ee"
      stroke="#e8b9a6"
      strokeWidth={10}
    />
    <path
      d="M 175 660 C 130 630 140 590 175 610 C 210 590 220 630 175 660 Z"
      fill="#f19a8f"
    />
    {/* floor + rug */}
    <rect x={0} y={FLOOR} width={1080} height={510} fill="#e9c9a8" />
    {new Array(6).fill(0).map((_, i) => (
      <line
        key={i}
        x1={0}
        y1={FLOOR + 30 + i * 80}
        x2={1080}
        y2={FLOOR + 30 + i * 80}
        stroke="#d9b48e"
        strokeWidth={4}
      />
    ))}
    <ellipse cx={560} cy={FLOOR + 40} rx={420} ry={60} fill="#f6d6e0" />
    {/* plant */}
    <g transform={`translate(70 ${FLOOR})`}>
      <path d="M -40 0 L -32 -90 L 32 -90 L 40 0 Z" fill="#e3a07c" />
      {[-50, -20, 10, 40].map((a, i) => (
        <ellipse
          key={i}
          cx={a * 0.6}
          cy={-150 - (i % 2) * 40}
          rx={22}
          ry={60}
          fill="#7fbf8e"
          transform={`rotate(${a} ${a * 0.6} -110)`}
        />
      ))}
    </g>
    <Glow cx={870} cy={700} r={500} color="#fff2d6" opacity={0.35} />
  </>
);

/* ---------- step chips ---------- */

export const StepChips: React.FC<{ scene: BebekScene }> = ({ scene }) => {
  const p = useSteps(scene);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = scene.steps.length;
  if (n === 0 || n > 3) return null;
  const w = 336;
  const gap = 14;
  const x0 = (1080 - (n * w + (n - 1) * gap)) / 2;
  return (
    <g>
      {scene.steps.map((s, i) => {
        const active = p[i] > 0 && (i === n - 1 || p[i + 1] === 0);
        const pop = spring({
          frame:
            frame -
            wordStartFrame(scene.text, s.at, Math.round(scene.sec * fps), fps),
          fps,
          config: { damping: 12, stiffness: 180 },
        });
        return (
          <g
            key={i}
            transform={`translate(${x0 + i * (w + gap)} 520)`}
            opacity={0.35 + 0.65 * Math.min(1, p[i] * 2)}
          >
            <g
              transform={`translate(${w / 2} 40) scale(${p[i] > 0 ? 0.92 + 0.08 * pop : 0.92}) translate(${-w / 2} -40)`}
            >
              <rect
                width={w}
                height={80}
                rx={40}
                fill={active ? "#ff8f7a" : p[i] > 0 ? "#ffffff" : "#fff6ee"}
                stroke="#f0a493"
                strokeWidth={4}
              />
              <circle
                cx={40}
                cy={40}
                r={26}
                fill={active ? "#ffffff" : "#ffb3a3"}
              />
              <text
                x={40}
                y={50}
                textAnchor="middle"
                fontSize={30}
                fontWeight={900}
                fill={active ? "#ff8f7a" : "#ffffff"}
              >
                {p[i] >= 1 && !active ? "✓" : i + 1}
              </text>
              <text
                x={80}
                y={51}
                fontSize={24}
                fontWeight={800}
                fill={active ? "#ffffff" : "#8a5a50"}
              >
                {s.label}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

const Midwife: React.FC<{
  arms?: "point" | "wave" | "down";
  talk?: boolean;
}> = ({ arms = "point", talk = true }) => (
  <Person
    x={150}
    y={FLOOR}
    scale={0.82}
    top={MIDWIFE.top}
    bottom={MIDWIFE.bottom}
    hair="cap"
    arms={arms}
    mood={talk ? "talk" : "smile"}
    stethoscope
  />
);

/* ---------- scenes ---------- */

const Giris: React.FC = () => (
  <Canvas>
    <Nursery />
    <Person
      x={640}
      y={FLOOR}
      scale={1.12}
      top={MOM.top}
      bottom={MOM.bottom}
      arms="hold"
      mood="calm"
      front={<RingSling fabric={1} baby={1} tight={1} color={C.ring} />}
    />
    <Midwife arms="wave" />
  </Canvas>
);

const sceneWith =
  (
    render: (p: number[]) => React.ReactNode,
    arms: "hold" | "tie" | "down" = "hold",
  ) =>
  ({ scene }: { scene: BebekScene }) => {
    const p = useSteps(scene);
    return (
      <Canvas>
        <Nursery />
        <StepChips scene={scene} />
        <Person
          x={640}
          y={FLOOR}
          scale={1.12}
          top={MOM.top}
          bottom={MOM.bottom}
          arms={arms}
          mood="calm"
          front={render(p)}
        />
        <Midwife />
      </Canvas>
    );
  };

const Halkali = sceneWith(([a, b, c]) => (
  <RingSling fabric={a} baby={b} tight={c} color={C.ring} />
));
const Esnek = sceneWith(([a, b, c]) => (
  <WrapCross
    pocket={a}
    cross={a}
    baby={b}
    knot={0}
    color={C.stretchy}
    stripes={c > 0.5}
  />
));
const Dokuma = sceneWith(
  ([a, b, c]) => (
    <WrapCross pocket={a} baby={a} cross={b} knot={c} color={C.woven} stripes />
  ),
  "tie",
);

const Sirt: React.FC<{ scene: BebekScene }> = ({ scene }) => {
  const [a, b, c] = useSteps(scene);
  return (
    <Canvas>
      <Nursery />
      <StepChips scene={scene} />
      <Person
        x={640}
        y={FLOOR}
        scale={1.12}
        top={MOM.top}
        bottom={MOM.bottom}
        arms="tie"
        mood="smile"
        behind={<BackCarryBaby baby={a} />}
        front={<BackCarryStraps straps={b} knot={b} color={C.back} />}
      />
      {/* helper: the midwife steps closer for the first tries */}
      <g transform={`translate(${c * 120} 0)`}>
        <Midwife arms={c > 0 ? "point" : "point"} />
      </g>
    </Canvas>
  );
};

const MeiTaiScene = sceneWith(
  ([a, b, c]) => (
    <MeiTai
      waist={a}
      baby={b}
      panel={b}
      straps={c}
      color={C.meitai}
      accent={C.meitaiAccent}
    />
  ),
  "tie",
);

const Ticks: React.FC<{ scene: BebekScene }> = ({ scene }) => {
  const p = useSteps(scene);
  const letters = ["T", "I", "C", "K", "S"];
  return (
    <Canvas>
      <Nursery />
      <Person
        x={300}
        y={FLOOR}
        scale={1.0}
        top={MOM.top}
        bottom={MOM.bottom}
        arms="hold"
        mood="calm"
        front={
          <WrapCross
            pocket={1}
            baby={1}
            cross={1}
            knot={1}
            color={C.woven}
            stripes
          />
        }
      />
      {/* "close enough to kiss" + "two fingers" hints on the mother */}
      <g opacity={p[2]}>
        <path
          d="M 300 760 Q 360 700 320 680"
          stroke="#ff8f7a"
          strokeWidth={5}
          fill="none"
          strokeDasharray="10 8"
        />
        <path
          d="M 360 690 C 340 670 345 650 360 660 C 375 650 380 670 360 690 Z"
          fill="#ff8f7a"
        />
      </g>
      {scene.steps.map((s, i) => (
        <g
          key={i}
          transform={`translate(${560 + (1 - p[i]) * 60} ${560 + i * 150})`}
          opacity={0.25 + 0.75 * p[i]}
        >
          <rect
            width={480}
            height={124}
            rx={30}
            fill="#ffffff"
            stroke="#f0a493"
            strokeWidth={4}
          />
          <circle
            cx={64}
            cy={62}
            r={44}
            fill={p[i] > 0 ? "#ff8f7a" : "#ffd2c6"}
          />
          <text
            x={64}
            y={80}
            textAnchor="middle"
            fontSize={50}
            fontWeight={900}
            fill="#ffffff"
          >
            {letters[i]}
          </text>
          <foreignObject x={124} y={10} width={340} height={104}>
            <div
              style={{
                height: 104,
                display: "flex",
                alignItems: "center",
                fontSize: 31,
                fontWeight: 800,
                color: "#8a5a50",
                lineHeight: 1.1,
              }}
            >
              {s.label}
            </div>
          </foreignObject>
          {p[i] >= 1 && (
            <text
              x={440}
              y={78}
              textAnchor="middle"
              fontSize={44}
              fontWeight={900}
              fill="#5fb37e"
            >
              ✓
            </text>
          )}
        </g>
      ))}
    </Canvas>
  );
};

const MPoz: React.FC<{ scene: BebekScene }> = ({ scene }) => {
  const [m, face] = useSteps(scene);
  return (
    <Canvas>
      <Nursery />
      <StepChips scene={scene} />
      {/* close-up of the baby with the M traced through knees and bottom */}
      <g transform="translate(540 760) scale(2.6)">
        <Baby legs="M" bx={0} by={0} />
        <path
          d="M -86 70 L -60 112 L 0 128 L 60 112 L 86 70"
          stroke="#ff8f7a"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={`${m} 1`}
        />
        <g opacity={m}>
          <text x={-118} y={60} fontSize={14} fontWeight={900} fill="#ff8f7a">
            diz
          </text>
          <text x={96} y={60} fontSize={14} fontWeight={900} fill="#ff8f7a">
            diz
          </text>
          <text
            x={0}
            y={150}
            textAnchor="middle"
            fontSize={14}
            fontWeight={900}
            fill="#ff8f7a"
          >
            kalça
          </text>
        </g>
      </g>
      <g opacity={m} transform="translate(540 1340)">
        <text
          textAnchor="middle"
          fontSize={120}
          fontWeight={900}
          fill="#ff8f7a"
        >
          M
        </text>
      </g>
      {/* inward facing: small mother icon with baby facing her */}
      <g opacity={face} transform={`translate(${880} ${FLOOR}) scale(0.55)`}>
        <Person
          x={0}
          y={0}
          top={MOM.top}
          bottom={MOM.bottom}
          arms="hold"
          mood="smile"
          front={<Baby by={-424} />}
        />
        <text
          x={0}
          y={-720}
          textAnchor="middle"
          fontSize={64}
          fontWeight={900}
          fill="#5fb37e"
        >
          ↔ sana dönük
        </text>
      </g>
      <Midwife />
    </Canvas>
  );
};

export const BEBEK_SCENES: Record<
  BebekSceneId,
  React.FC<{ scene: BebekScene }>
> = {
  giris: Giris,
  halkali: Halkali,
  esnek: Esnek,
  dokuma: Dokuma,
  sirt: Sirt,
  meitai: MeiTaiScene,
  ticks: Ticks,
  mpoz: MPoz,
};
