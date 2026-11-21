// Short (1080x1920): why snowflakes are six-sided. Visuals are SVG; narration + captions per scene.
import React from "react";
import { Watermark } from "../../components/Watermark";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  random,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordCaptions } from "../../components/WordCaptions";
import {
  KAR_LEAD,
  KAR_STORY,
  KAR_STORY_EN,
  type KarScene,
  type KarTag,
} from "./story";

type Lang = "tr" | "en";
const LangCtx = React.createContext<Lang>("tr");
const TEMP_LABELS: Record<Lang, [string, string, string]> = {
  tr: ["−2 °C·düz plaka", "−5 °C·iğne", "−15 °C·yıldız"],
  en: ["−2 °C·flat plate", "−5 °C·needle", "−15 °C·star"],
};

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = 960;
const ICE = "#e8f4ff";
const ACCENT = "#ffcc00";
const TAG_COLOR: Record<Exclude<KarTag, "">, string> = {
  GERÇEK: "#7be0a6",
  BELKİ: "#ffcf6a",
  FACT: "#7be0a6",
  MAYBE: "#ffcf6a",
};

const useSec = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// ---------- snowflake drawing ----------

type Kind = "star" | "plate" | "needle" | "prism";

const hexPoints = (r: number, rot = 0) =>
  new Array(6)
    .fill(0)
    .map((_, i) => {
      const a = ((i * 60 + rot) * Math.PI) / 180;
      return `${(r * Math.sin(a)).toFixed(1)},${(-r * Math.cos(a)).toFixed(1)}`;
    })
    .join(" ");

/** One arm of a dendrite along -y; branches sprout once growth passes their position. */
const Arm: React.FC<{ seed: string; r: number; g: number; w: number }> = ({
  seed,
  r,
  g,
  w,
}) => {
  const branches = new Array(4).fill(0).map((_, i) => {
    const p = 0.22 + i * 0.17 + (random(`${seed}-p${i}`) - 0.5) * 0.08;
    const len = r * (0.38 - 0.3 * p) * (0.75 + 0.5 * random(`${seed}-l${i}`));
    const vis = len * interpolate(g, [p, p + 0.3], [0, 1], clamp);
    return { y: -r * p, vis };
  });
  const s = Math.sin(Math.PI / 3);
  const c = Math.cos(Math.PI / 3);
  return (
    <g strokeLinecap="round">
      <line x1={0} y1={0} x2={0} y2={-r * g} strokeWidth={w} />
      {branches.map((b, i) =>
        b.vis > 0.5 ? (
          <g key={i}>
            <line
              x1={0}
              y1={b.y}
              x2={b.vis * s}
              y2={b.y - b.vis * c}
              strokeWidth={w * 0.8}
            />
            <line
              x1={0}
              y1={b.y}
              x2={-b.vis * s}
              y2={b.y - b.vis * c}
              strokeWidth={w * 0.8}
            />
          </g>
        ) : null,
      )}
    </g>
  );
};

const Flake: React.FC<{
  kind?: Kind;
  seed?: string;
  r: number; // radius in px
  g?: number; // growth 0..1
  x?: number;
  y?: number;
  rot?: number;
  color?: string;
  glow?: number;
  opacity?: number;
}> = ({
  kind = "star",
  seed = "a",
  r,
  g = 1,
  x = CX,
  y = CY,
  rot = 0,
  color = ICE,
  glow = 18,
  opacity = 1,
}) => {
  const w = Math.max(3, r * 0.035);
  let body: React.ReactNode = null;
  if (kind === "star") {
    body = (
      <>
        {new Array(6).fill(0).map((_, k) => (
          <g key={k} transform={`rotate(${k * 60})`}>
            <Arm seed={seed} r={r} g={g} w={w} />
          </g>
        ))}
        <polygon
          points={hexPoints(r * 0.11 * Math.min(1, g * 4))}
          fill={color}
          fillOpacity={0.35}
          strokeWidth={w * 0.7}
        />
      </>
    );
  } else if (kind === "plate" || kind === "prism") {
    const rr = r * g;
    body = (
      <>
        <polygon
          points={hexPoints(rr)}
          fill={color}
          fillOpacity={0.18}
          strokeWidth={w}
          strokeLinejoin="round"
        />
        <polygon
          points={hexPoints(rr * 0.62)}
          fill="none"
          strokeWidth={w * 0.6}
          strokeOpacity={0.7}
        />
        {kind === "plate" &&
          new Array(6)
            .fill(0)
            .map((_, k) => (
              <line
                key={k}
                x1={0}
                y1={0}
                x2={0}
                y2={-rr * 0.62}
                strokeWidth={w * 0.5}
                strokeOpacity={0.6}
                transform={`rotate(${k * 60})`}
              />
            ))}
      </>
    );
  } else {
    const hh = r * g;
    body = (
      <>
        <rect
          x={-r * 0.09}
          y={-hh}
          width={r * 0.18}
          height={hh * 2}
          rx={r * 0.06}
          fill={color}
          fillOpacity={0.2}
          strokeWidth={w}
        />
        <line
          x1={0}
          y1={-hh * 0.9}
          x2={0}
          y2={hh * 0.9}
          strokeWidth={w * 0.5}
          strokeOpacity={0.7}
        />
      </>
    );
  }
  return (
    <svg
      width={W}
      height={H}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        opacity,
        filter: `drop-shadow(0 0 ${glow}px rgba(170,215,255,0.85))`,
      }}
    >
      <g
        transform={`translate(${x} ${y}) rotate(${rot})`}
        stroke={color}
        fill="none"
      >
        {body}
      </g>
    </svg>
  );
};

// ---------- background ----------

const Snowfall: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(110).fill(0).map((_, i) => {
        const size = 3 + random(`s${i}`) * 9;
        const speed = 0.8 + size * 0.22;
        const y =
          ((random(`y${i}`) * (H + 100) + frame * speed) % (H + 100)) - 50;
        const x =
          random(`x${i}`) * W +
          Math.sin(frame / (40 + 30 * random(`w${i}`)) + i) * 18;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size,
              background: "white",
              opacity: 0.25 + 0.5 * random(`o${i}`),
              filter: size > 9 ? "blur(2px)" : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Sky: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(circle at 78% 14%, rgba(255,236,190,0.22) 0, rgba(255,236,190,0) 22%), linear-gradient(180deg, #0a1424 0%, #142a48 55%, #24405f 100%)",
    }}
  >
    {/* warm window glow + snowy ground (decorative, under the Shorts UI) */}
    <div
      style={{
        position: "absolute",
        left: -200,
        right: -200,
        bottom: -420,
        height: 700,
        borderRadius: "50%",
        background: "linear-gradient(180deg,#c9d9ec,#8fa6c2)",
        opacity: 0.35,
      }}
    />
  </AbsoluteFill>
);

// ---------- scene visuals ----------

const HookV: React.FC = () => {
  const t = useSec();
  const g = interpolate(t, [0.2, 4.2], [0, 1], {
    ...clamp,
    easing: (x) => 1 - (1 - x) ** 3,
  });
  return <Flake seed="hero" r={360} g={g} rot={t * 6} />;
};

const Molecule: React.FC<{
  x: number;
  y: number;
  rot: number;
  s?: number;
  o?: number;
}> = ({ x, y, rot, s = 1, o = 1 }) => {
  const d = 62 * s;
  const a = (52.25 * Math.PI) / 180;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <line
        x1={0}
        y1={0}
        x2={-d * Math.sin(a)}
        y2={d * Math.cos(a)}
        stroke="#cfe3ff"
        strokeWidth={10 * s}
      />
      <line
        x1={0}
        y1={0}
        x2={d * Math.sin(a)}
        y2={d * Math.cos(a)}
        stroke="#cfe3ff"
        strokeWidth={10 * s}
      />
      <circle r={40 * s} fill="#e8655a" />
      <circle
        cx={-d * Math.sin(a)}
        cy={d * Math.cos(a)}
        r={25 * s}
        fill="#f4f8ff"
      />
      <circle
        cx={d * Math.sin(a)}
        cy={d * Math.cos(a)}
        r={25 * s}
        fill="#f4f8ff"
      />
    </g>
  );
};

const MoleculeV: React.FC = () => {
  const t = useSec();
  const k = interpolate(t, [2.6, 5.4], [0, 1], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });
  const bonds = interpolate(t, [5.2, 6.4], [0, 1], clamp);
  const R = 230;
  const verts = new Array(6).fill(0).map((_, i) => {
    const a = (i * 60 * Math.PI) / 180;
    return {
      x: CX + R * Math.sin(a),
      y: CY - R * Math.cos(a),
      rot: i * 60 + 180,
    };
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {/* hydrogen bonds forming the hexagonal ring */}
      <polygon
        points={verts.map((v) => `${v.x},${v.y}`).join(" ")}
        fill="none"
        stroke={ACCENT}
        strokeWidth={6}
        strokeDasharray="14 14"
        opacity={bonds}
        style={{ filter: `drop-shadow(0 0 14px ${ACCENT})` }}
      />
      {verts.map((v, i) => {
        const sx = i === 0 ? CX : CX + (random(`mx${i}`) - 0.5) * 700;
        const sy = i === 0 ? CY : CY + (random(`my${i}`) - 0.5) * 900;
        const enter = i === 0 ? 1 : interpolate(t, [2.4, 3.2], [0, 1], clamp);
        return (
          <Molecule
            key={i}
            x={interpolate(k, [0, 1], [sx, v.x])}
            y={interpolate(k, [0, 1], [sy, v.y])}
            rot={interpolate(
              k,
              [0, 1],
              [i * 47 + Math.sin(t * 2 + i) * 12, v.rot],
            )}
            s={interpolate(k, [0, 1], [i === 0 ? 1.9 : 1, 1])}
            o={enter}
          />
        );
      })}
      <text
        x={CX}
        y={CY + 250}
        textAnchor="middle"
        fill="#cfe3ff"
        fontSize={42}
        fontWeight={800}
        fontFamily={fontFamily}
        opacity={interpolate(t, [0.6, 1.2, 2.4, 2.8], [0, 1, 1, 0], clamp)}
      >
        {React.useContext(LangCtx) === "en" ? "H₂O · 104.5°" : "H₂O · 104,5°"}
      </text>
    </svg>
  );
};

const GrowV: React.FC = () => {
  const t = useSec();
  const g = interpolate(t, [0.3, 6.5], [0.08, 1], clamp);
  const hex = interpolate(t, [0, 0.8, 1.6], [1, 1, 0], clamp);
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", opacity: hex }}>
        <polygon
          transform={`translate(${CX} ${CY})`}
          points={hexPoints(230, 30)}
          fill="none"
          stroke={ACCENT}
          strokeWidth={6}
          strokeDasharray="14 14"
        />
      </svg>
      <Flake seed="grow" r={400} g={g} rot={30} />
    </>
  );
};

const Row: React.FC<{
  y: number;
  at: number;
  kind: Kind;
  label: string;
  t: number;
  fps: number;
  seed: string;
}> = ({ y, at, kind, label, t, fps, seed }) => {
  const s = spring({ frame: (t - at) * fps, fps, config: { damping: 14 } });
  return (
    <>
      <Flake
        kind={kind}
        seed={seed}
        r={kind === "needle" ? 120 : 125}
        x={300}
        y={y}
        g={s}
        rot={kind === "needle" ? 90 : 0}
        opacity={s}
        glow={12}
      />
      <div
        style={{
          position: "absolute",
          left: 480,
          top: y - 52,
          opacity: s,
          transform: `translateX(${(1 - s) * 60}px)`,
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 900, color: ACCENT }}>
          {label.split("·")[0]}
        </div>
        <div
          style={{ fontSize: 44, fontWeight: 800, color: ICE, marginTop: -6 }}
        >
          {label.split("·")[1]}
        </div>
      </div>
    </>
  );
};

const TempV: React.FC<{ scene: KarScene }> = ({ scene }) => {
  const t = useSec();
  const labels = TEMP_LABELS[React.useContext(LangCtx)];
  const { fps } = useVideoConfig();
  const v = scene.vsec;
  return (
    <>
      <Row
        y={640}
        at={KAR_LEAD + v * 0.38}
        kind="plate"
        label={labels[0]}
        t={t}
        fps={fps}
        seed="p"
      />
      <Row
        y={940}
        at={KAR_LEAD + v * 0.62}
        kind="needle"
        label={labels[1]}
        t={t}
        fps={fps}
        seed="n"
      />
      <Row
        y={1240}
        at={KAR_LEAD + v * 0.82}
        kind="star"
        label={labels[2]}
        t={t}
        fps={fps}
        seed="st"
      />
    </>
  );
};

const Sign: React.FC<{
  x: number;
  y: number;
  ch: string;
  color: string;
  o: number;
}> = ({ x, y, ch, color, o }) => (
  <div
    style={{
      position: "absolute",
      left: x - 60,
      top: y - 70,
      width: 120,
      textAlign: "center",
      fontSize: 120,
      fontWeight: 900,
      color,
      opacity: o,
    }}
  >
    {ch}
  </div>
);

const TwinsV: React.FC<{ scene: KarScene }> = ({ scene }) => {
  const t = useSec();
  const v = scene.vsec;
  const a = interpolate(
    t,
    [KAR_LEAD + v * 0.3, KAR_LEAD + v * 0.4],
    [0, 1],
    clamp,
  );
  const b = interpolate(
    t,
    [KAR_LEAD + v * 0.55, KAR_LEAD + v * 0.68],
    [0, 1],
    clamp,
  );
  return (
    <>
      <Flake kind="prism" r={130} x={300} y={680} g={a} opacity={a} glow={12} />
      <Flake kind="prism" r={130} x={780} y={680} g={a} opacity={a} glow={12} />
      <Sign x={CX} y={680} ch="=" color="#7be0a6" o={a} />
      <Flake
        seed="twinA"
        r={190}
        x={290}
        y={1150}
        g={b}
        opacity={b}
        glow={12}
      />
      <Flake
        seed="twinB9"
        r={190}
        x={790}
        y={1150}
        g={b}
        opacity={b}
        glow={12}
        rot={8}
      />
      <Sign x={CX} y={1150} ch="≠" color="#ff7a5c" o={b} />
    </>
  );
};

const WhiteV: React.FC<{ scene: KarScene }> = ({ scene }) => {
  const t = useSec();
  const v = scene.vsec;
  const clear = interpolate(
    t,
    [KAR_LEAD + v * 0.2, KAR_LEAD + v * 0.35],
    [1, 0],
    clamp,
  );
  const beam = interpolate(
    t,
    [KAR_LEAD + v * 0.5, KAR_LEAD + v * 0.62],
    [0, 1],
    clamp,
  );
  const scatter = interpolate(
    t,
    [KAR_LEAD + v * 0.6, KAR_LEAD + v * 0.85],
    [0, 1],
    clamp,
  );
  return (
    <>
      {/* transparent ice */}
      <Flake
        seed="glass"
        r={360}
        color="#bfe3ff"
        glow={4}
        opacity={0.35 + 0.65 * Math.max(clear, scatter)}
      />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <line
          x1={0}
          y1={420}
          x2={CX}
          y2={CY}
          stroke="#fff3c4"
          strokeWidth={14}
          opacity={beam * 0.9}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 16px #ffe9a0)" }}
        />
        {new Array(26).fill(0).map((_, i) => {
          const ang = random(`ray${i}`) * Math.PI * 2;
          const len = (150 + random(`rl${i}`) * 330) * scatter;
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={CX + Math.cos(ang) * len}
              y2={CY + Math.sin(ang) * len}
              stroke="#fff8e0"
              strokeWidth={5}
              opacity={scatter * 0.8}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </>
  );
};

const LoopV: React.FC<{ scene: KarScene }> = ({ scene }) => {
  const t = useSec();
  // shrink back to a point so the end flows into the hook (which grows from a point)
  const g = interpolate(t, [scene.sec - 1.4, scene.sec - 0.1], [1, 0], clamp);
  return <Flake seed="hero" r={360} g={g} rot={24 + t * 6} />;
};

// ---------- scene shell ----------

const Title: React.FC<{ scene: KarScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const parts = scene.title.split(/(6)/);
  const lang = React.useContext(LangCtx);
  return (
    <div
      style={{
        position: "absolute",
        top: 290,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity: s,
        transform: `translateY(${(1 - s) * -30}px)`,
      }}
    >
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          color: "white",
          lineHeight: 1.05,
          textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        {parts.map((p, i) => (
          <span key={i} style={{ color: p === "6" ? ACCENT : undefined }}>
            {p.toLocaleUpperCase(lang === "en" ? "en-US" : "tr-TR")}
          </span>
        ))}
      </div>
      {scene.tag && (
        <div
          style={{
            display: "inline-block",
            marginTop: 22,
            padding: "6px 24px",
            border: `5px solid ${TAG_COLOR[scene.tag]}`,
            borderRadius: 12,
            color: TAG_COLOR[scene.tag],
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 5,
            transform: `rotate(-4deg) scale(${interpolate(spring({ frame: frame - 0.8 * fps, fps, config: { damping: 9, stiffness: 200 } }), [0, 1], [2, 1])})`,
            background: "rgba(10,14,24,0.4)",
          }}
        >
          {scene.tag}
        </div>
      )}
    </div>
  );
};

const VISUAL: Record<KarScene["id"], React.FC<{ scene: KarScene }>> = {
  hook: HookV,
  molecule: MoleculeV,
  grow: GrowV,
  temp: TempV,
  twins: TwinsV,
  white: WhiteV,
  loop: LoopV,
};

const ScenePage: React.FC<{ scene: KarScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = scene.sec * fps;
  const V = VISUAL[scene.id];
  const lang = React.useContext(LangCtx);
  const fade =
    scene.id === "hook" || scene.id === "loop"
      ? 1
      : interpolate(frame, [0, 8, frames - 8, frames], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fade }}>
        <V scene={scene} />
        <Title scene={scene} />
      </AbsoluteFill>
      <Sequence from={Math.round(KAR_LEAD * fps)} layout="none">
        <Audio src={staticFile(`kar-tanesi/${lang}/${scene.id}.wav`)} />
        <WordCaptions
          text={scene.text}
          durationInFrames={Math.round(scene.vsec * fps)}
          top={1440}
          highlight={ACCENT}
          locale={lang === "en" ? "en-US" : "tr-TR"}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export const KarTanesiShort: React.FC<{ lang?: Lang }> = ({ lang = "tr" }) => {
  const { fps } = useVideoConfig();
  const story = lang === "en" ? KAR_STORY_EN : KAR_STORY;
  return (
    <LangCtx.Provider value={lang}>
      <AbsoluteFill style={{ fontFamily, backgroundColor: "#0a1424" }}>
        <Sky />
        <Snowfall />
        <Series>
          {story.map((scene) => (
            <Series.Sequence
              key={scene.id}
              durationInFrames={Math.round(scene.sec * fps)}
              premountFor={fps}
            >
              <ScenePage scene={scene} />
            </Series.Sequence>
          ))}
        </Series>
        <Watermark />
      <Audio src={staticFile("kar-tanesi/bed.m4a")} volume={0.35} />
      </AbsoluteFill>
    </LangCtx.Provider>
  );
};
