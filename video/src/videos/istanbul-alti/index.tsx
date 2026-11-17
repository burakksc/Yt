import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ALTI_SCENES } from "./scenes";
import { AltiLang } from "./lang";
import { ALTI_STORY, type AltiScene, type Tag } from "./story";
import { ALTI_STORY_TR } from "./story_tr";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const TAG_COLOR: Record<Exclude<Tag, "">, string> = {
  FACT: "#7be0a6",
  MYTH: "#ff7a5c",
  MAYBE: "#ffcf6a",
};

/** On-screen text: each line gets an equal share of the scene, with soft fades. */
const Lines: React.FC<{ scene: AltiScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = scene.sec * fps;
  const start = 0.9 * fps;
  const per = (total - start - 0.5 * fps) / scene.lines.length;
  const i = Math.min(
    scene.lines.length - 1,
    Math.max(0, Math.floor((frame - start) / per)),
  );
  if (frame < start) return null;
  const local = frame - start - i * per;
  const o = interpolate(
    local,
    [0, 10, per - 10, per],
    [0, 1, 1, i === scene.lines.length - 1 ? 1 : 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 160,
        right: 160,
        bottom: 96,
        textAlign: "center",
        fontSize: 50,
        fontWeight: 700,
        color: "#fff6e6",
        lineHeight: 1.25,
        opacity: o,
        transform: `translateY(${(1 - o) * 10}px)`,
        textShadow: "0 3px 14px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)",
      }}
    >
      {scene.lines[i]}
    </div>
  );
};

const DoorLabel: React.FC<{ scene: AltiScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  if (!scene.door) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 90,
        opacity: s,
        transform: `translateX(${(1 - s) * -30}px)`,
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: 6,
          color: "#c9a46a",
        }}
      >
        ⌂ ISTANBUL BENEATH ISTANBUL
      </div>
      <div
        style={{
          fontSize: 58,
          fontWeight: 900,
          color: "#fff6e6",
          textShadow: "0 3px 14px rgba(0,0,0,0.9)",
        }}
      >
        {scene.door}
      </div>
    </div>
  );
};

const Stamp: React.FC<{ tag: Tag; text?: string }> = ({ tag, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!tag) return null;
  const s = spring({
    frame: frame - 1.2 * fps,
    fps,
    config: { damping: 9, stiffness: 200 },
  });
  const c = TAG_COLOR[tag];
  return (
    <div
      style={{
        position: "absolute",
        top: 92,
        right: 150,
        padding: "8px 26px",
        border: `6px solid ${c}`,
        borderRadius: 14,
        color: c,
        fontSize: 46,
        fontWeight: 900,
        letterSpacing: 6,
        transform: `rotate(-8deg) scale(${interpolate(s, [0, 1], [2.2, 1])})`,
        opacity: Math.min(1, s * 1.4),
        background: "rgba(10,8,6,0.35)",
      }}
    >
      {text || tag}
    </div>
  );
};

/** Depth meter on the right edge; animates from the previous scene's depth. */
const Depth: React.FC<{ scene: AltiScene; prev: number }> = ({
  scene,
  prev,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = interpolate(frame, [0, 1.5 * fps], [prev, scene.depth], clamp);
  const max = 14;
  const top = 260;
  const h = 560;
  return (
    <div style={{ position: "absolute", right: 56, top, height: h, width: 60 }}>
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 0,
          width: 4,
          height: h,
          background: "rgba(255,246,230,0.25)",
          borderRadius: 2,
        }}
      />
      {[0, 4, 8, 12].map((m) => (
        <div
          key={m}
          style={{
            position: "absolute",
            left: 14,
            top: (m / max) * h,
            width: 28,
            height: 2,
            background: "rgba(255,246,230,0.35)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 10,
          top: (d / max) * h - 18,
          width: 36,
          height: 36,
          borderRadius: 18,
          background: "#c9a46a",
          boxShadow: "0 0 18px #ffb35c",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 70,
          top: (d / max) * h - 22,
          fontSize: 32,
          fontWeight: 800,
          color: "#fff6e6",
          whiteSpace: "nowrap",
          textShadow: "0 2px 8px #000",
        }}
      >
        −{d.toFixed(0)} m
      </div>
    </div>
  );
};

const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16 } });
  const zoom = interpolate(frame, [0, 7 * fps], [1, 1.04], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 90,
        display: "flex",
        justifyContent: "center",
        opacity: s,
      }}
    >
      {/* channel logo (already includes the channel name) */}
      <Img
        src={staticFile("brand/logo-round.png")}
        style={{
          width: 720,
          height: 720,
          borderRadius: 360,
          transform: `scale(${(0.9 + 0.1 * s) * zoom})`,
          boxShadow:
            "0 0 80px rgba(255,200,120,0.35), 0 20px 60px rgba(0,0,0,0.7)",
        }}
      />
    </div>
  );
};

const ScenePage: React.FC<{ scene: AltiScene; prev: number }> = ({
  scene,
  prev,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = scene.sec * fps;
  const Scene = ALTI_SCENES[scene.id];
  const fade = interpolate(
    frame,
    [0, 12, frames - 12, frames],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Scene />
      </AbsoluteFill>
      {/* vignette + bottom shade for text */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 72%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill style={{ opacity: fade }}>
        <DoorLabel scene={scene} />
        <Stamp tag={scene.tag} text={scene.tagText} />
        {scene.id !== "outro" && <Depth scene={scene} prev={prev} />}
        {scene.id === "outro" && <OutroCard />}
        <Lines scene={scene} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const AltiVideo: React.FC<{
  story: AltiScene[];
  soundtrack: string;
  narrationDir?: string; // one <id>.wav per scene, starts NARRATION_DELAY s in
  lang: "en" | "tr";
}> = ({ story, soundtrack, narrationDir, lang }) => {
  const { fps } = useVideoConfig();
  let at = 0;
  return (
    <AltiLang.Provider value={lang}>
      <AbsoluteFill style={{ fontFamily, backgroundColor: "#000" }}>
        <Series>
          {story.map((scene, i) => (
            <Series.Sequence
              key={scene.id}
              durationInFrames={scene.sec * fps}
              premountFor={fps}
            >
              <ScenePage
                scene={scene}
                prev={i === 0 ? 0 : story[i - 1].depth}
              />
            </Series.Sequence>
          ))}
        </Series>
        <Audio src={staticFile(soundtrack)} volume={narrationDir ? 0.55 : 1} />
        {narrationDir &&
          story.map((scene) => {
            const from = Math.round((at + NARRATION_DELAY) * fps);
            at += scene.sec;
            return (
              <Sequence key={scene.id} from={from} premountFor={fps}>
                <Audio src={staticFile(`${narrationDir}/${scene.id}.wav`)} />
              </Sequence>
            );
          })}
      </AbsoluteFill>
    </AltiLang.Provider>
  );
};

const NARRATION_DELAY = 0.6;

export const IstanbulAlti: React.FC = () => (
  <AltiVideo
    story={ALTI_STORY}
    soundtrack="istanbul-alti/soundtrack.m4a"
    lang="en"
  />
);

export const IstanbulAltiTR: React.FC = () => (
  <AltiVideo
    story={ALTI_STORY_TR}
    soundtrack="istanbul-alti/soundtrack_tr.m4a"
    narrationDir="istanbul-alti/tr"
    lang="tr"
  />
);
