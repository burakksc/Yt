import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import { getStaticFiles } from "@remotion/studio";
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
import { SCENE_PARTS } from "./scenes";
import { STORY, type StoryScene } from "./story";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

export type Eksi100HikayeProps = {
  readonly hookTop: string;
  readonly hookBottom: string;
};

const DIR = "eksi-100-hikaye";
const hasFile = (name: string) =>
  getStaticFiles().some((f) => f.name === `${DIR}/${name}`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- captions: 2-3 word chunks, active word highlighted ---------- */

type Word = { text: string; start: number; end: number }; // frames, scene-local

const timeWords = (text: string, frames: number, fps: number): Word[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const startF = 0.25 * fps;
  const endF = frames - 0.45 * fps;
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let t = startF;
  return words.map((w, i) => {
    const d = ((endF - startF) * weights[i]) / total;
    const word = { text: w, start: t, end: t + d };
    t += d;
    return word;
  });
};

const chunkWords = (words: Word[]): Word[][] => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const len = cur.map((c) => c.text).join(" ").length;
    if (cur.length >= 3 || len > 16 || /[.,?!]$/.test(w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
};

const Captions: React.FC<{ scene: StoryScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = timeWords(scene.narration, Math.round(scene.sec * fps), fps);
  const chunks = chunkWords(words);
  const chunk = chunks.find(
    (c) => frame >= c[0].start && frame < c[c.length - 1].end + 2,
  );
  if (!chunk) return null;
  const pop = spring({
    frame: frame - chunk[0].start,
    fps,
    config: { damping: 12, stiffness: 220 },
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1480,
        textAlign: "center",
        fontSize: 86,
        fontWeight: 900,
        lineHeight: 1.12,
        transform: `scale(${0.85 + 0.15 * pop})`,
      }}
    >
      {chunk.map((w, i) => {
        const active = frame >= w.start && frame < w.end;
        return (
          <span
            key={i}
            style={{
              color: active ? "#ffd23f" : "white",
              WebkitTextStroke: "14px #0b1020",
              paintOrder: "stroke fill",
              marginRight: 22,
              display: "inline-block",
              textShadow: "0 8px 18px rgba(0,0,0,0.45)",
            }}
          >
            {w.text.toLocaleUpperCase("tr-TR")}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- HUD: temperature + story clock ---------- */

const Hud: React.FC<{ clock: string }> = ({ clock }) => (
  <div
    style={{
      position: "absolute",
      top: 150,
      left: 50,
      display: "flex",
      gap: 14,
      fontWeight: 800,
      fontSize: 40,
    }}
  >
    <div
      style={{
        background: "rgba(10,18,36,0.78)",
        color: "#8fd0ff",
        padding: "10px 22px",
        borderRadius: 18,
        border: "2px solid rgba(143,208,255,0.35)",
      }}
    >
      ❄ -100°C
    </div>
    {clock && (
      <div
        style={{
          background: "rgba(10,18,36,0.78)",
          color: "white",
          padding: "10px 22px",
          borderRadius: 18,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        🕖 {clock}
      </div>
    )}
  </div>
);

/* ---------- hook title on the first scene ---------- */

const Hook: React.FC<{ top: string; bottom: string }> = ({ top, bottom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  const out = interpolate(frame, [4.6 * fps, 5.3 * fps], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 40,
        right: 40,
        textAlign: "center",
        opacity: out,
        transform: `scale(${0.6 + 0.4 * s})`,
      }}
    >
      <div
        style={{
          fontSize: 170,
          fontWeight: 900,
          color: "white",
          WebkitTextStroke: "18px #0b1020",
          paintOrder: "stroke fill",
          lineHeight: 1,
          letterSpacing: -2,
        }}
      >
        {top}
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 22,
          padding: "12px 34px",
          background: "#d63a2a",
          color: "white",
          fontSize: 66,
          fontWeight: 900,
          borderRadius: 20,
          transform: "rotate(-2deg)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        {bottom}
      </div>
    </div>
  );
};

/* ---------- one scene: background (AI image or painting) + overlay, with camera ---------- */

const SceneView: React.FC<{ scene: StoryScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = Math.round(scene.sec * fps);
  const { Paint, Overlay, camera } = SCENE_PARTS[scene.id];
  const p = interpolate(frame, [0, frames], [0, 1], clamp);
  const [s, x, y] = camera.from.map((v, i) => v + (camera.to[i] - v) * p);
  const fadeIn = interpolate(frame, [0, 8], [0, 1], clamp);
  const fadeOut = interpolate(frame, [frames - 6, frames], [1, 0], clamp);
  const bgName = `bg/${scene.id}.png`;
  const hasBg = hasFile(bgName);
  const voice = `voice/${scene.id}.mp3`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080f" }}>
      <AbsoluteFill
        style={{
          opacity: fadeIn * fadeOut,
          transform: `translate(${x}px, ${y}px) scale(${s})`,
        }}
      >
        {hasBg ? (
          <Img
            src={staticFile(`${DIR}/${bgName}`)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Paint />
        )}
        <Overlay />
      </AbsoluteFill>
      {/* readability gradient behind captions */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,8,18,0.45) 0%, rgba(5,8,18,0) 18%, rgba(5,8,18,0) 55%, rgba(5,8,18,0.35) 75%, rgba(5,8,18,0.55) 100%)",
        }}
      />
      <Hud clock={scene.clock} />
      <Captions scene={scene} />
      {hasFile(voice) && <Audio src={staticFile(`${DIR}/${voice}`)} />}
    </AbsoluteFill>
  );
};

/* ---------- sound effects placed at the moments they happen ---------- */

const sfxAt = (sceneId: StoryScene["id"], sec: number) => {
  let start = 0;
  for (const s of STORY) {
    if (s.id === sceneId) return start + sec;
    start += s.sec;
  }
  return start;
};

export const Eksi100Hikaye: React.FC<Eksi100HikayeProps> = ({
  hookTop,
  hookBottom,
}) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill lang="tr" style={{ backgroundColor: "#05080f", fontFamily }}>
      <Series>
        {STORY.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={Math.round(scene.sec * fps)}
            premountFor={fps}
          >
            <SceneView scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
      <Sequence durationInFrames={Math.round(5.5 * fps)}>
        <Hook top={hookTop} bottom={hookBottom} />
      </Sequence>
      <Audio src={staticFile("eksi-100/wind.mp3")} volume={0.55} />
      <Sequence from={Math.round(sfxAt("elektrik", 2.4) * fps)}>
        <Audio src={staticFile(`${DIR}/sfx/zap.mp3`)} volume={0.7} />
      </Sequence>
      <Sequence from={Math.round(sfxAt("borular", 2.8) * fps)}>
        <Audio src={staticFile(`${DIR}/sfx/crack.mp3`)} volume={0.9} />
      </Sequence>
      <Sequence
        from={Math.round(sfxAt("soba", 0) * fps)}
        durationInFrames={Math.round(6.5 * fps)}
      >
        <Audio src={staticFile(`${DIR}/sfx/fire.mp3`)} volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};
