// Short (1080x1920): Bran Castle ("Dracula's castle") — AI-generated stylized images + English narration.
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
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
  BRAN_LEAD as RU_LEAD,
  BRAN_STORY as RU_STORY,
  type BranScene as RuScene,
} from "./story";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

const ACCENT = "#ffcc00";
const TAG = { FACT: "#7be0a6", MYTH: "#ff7a5c" } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const H = 1920;

const Snow: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(60).fill(0).map((_, i) => {
        const size = 3 + random(`s${i}`) * 7;
        const y =
          ((random(`y${i}`) * (H + 80) + frame * (0.9 + size * 0.2)) %
            (H + 80)) -
          40;
        const x = random(`x${i}`) * W + Math.sin(frame / 40 + i) * 16;
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
              opacity: 0.35 + 0.4 * random(`o${i}`),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const ScenePage: React.FC<{ scene: RuScene; index: number }> = ({
  scene,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = scene.sec * fps;
  const p = interpolate(frame, [0, frames], [0, 1], clamp);
  const dir = index % 2 ? 1 : -1;
  const fade = interpolate(
    frame,
    [0, 8, frames - 8, frames],
    [0, 1, 1, 0],
    clamp,
  );
  const t = spring({ frame, fps, config: { damping: 14 } });
  const big = spring({
    frame: frame - Math.round((RU_LEAD + 0.6) * fps),
    fps,
    config: { damping: 12 },
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ opacity: scene.id === "hook" ? 1 : fade, overflow: "hidden" }}
      >
        {/* landscape photo in a vertical frame: slow horizontal pan + gentle zoom */}
        <Img
          src={staticFile(`bran/img/${scene.id}.png`)}
          style={{
            position: "absolute",
            height: "100%",
            left: "50%",
            top: 0,
            transform: `translateX(-50%) translateX(${dir * interpolate(p, [0, 1], [-12, 12])}px) scale(${interpolate(p, [0, 1], [1.02, 1.12])})`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        {scene.id === "end" && <Snow />}
        <div
          style={{
            position: "absolute",
            top: 290,
            left: 60,
            right: 60,
            textAlign: "center",
            opacity: t,
            transform: `translateY(${(1 - t) * -30}px)`,
          }}
        >
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.05,
              textShadow: "0 4px 24px rgba(0,0,0,0.8)",
            }}
          >
            {scene.title.toUpperCase()}
          </div>
          {scene.tag && (
            <div
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "6px 24px",
                border: `5px solid ${TAG[scene.tag]}`,
                borderRadius: 12,
                color: TAG[scene.tag],
                fontSize: 38,
                fontWeight: 900,
                letterSpacing: 5,
                background: "rgba(0,0,0,0.4)",
                transform: `rotate(-4deg) scale(${interpolate(spring({ frame: frame - 0.8 * fps, fps, config: { damping: 9, stiffness: 200 } }), [0, 1], [2, 1])})`,
              }}
            >
              {scene.tag}
            </div>
          )}
        </div>
        {scene.big && (
          <div
            style={{
              position: "absolute",
              top: 820,
              left: 40,
              right: 40,
              textAlign: "center",
              opacity: big,
              transform: `scale(${0.7 + 0.3 * big})`,
            }}
          >
            <div
              style={{
                fontSize: 170,
                fontWeight: 900,
                color: ACCENT,
                lineHeight: 1,
                textShadow: "0 6px 30px rgba(0,0,0,0.85)",
              }}
            >
              {scene.big}
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "white",
                marginTop: 14,
                textShadow: "0 3px 14px rgba(0,0,0,0.9)",
              }}
            >
              {scene.bigSub}
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 1640,
            fontSize: 24,
            fontWeight: 700,
            color: "rgba(255,255,255,0.8)",
            textShadow: "0 2px 6px #000",
          }}
        >
          AI-generated illustration
        </div>
      </AbsoluteFill>
      <Sequence from={Math.round(RU_LEAD * fps)} layout="none">
        <Audio src={staticFile(`bran/en/${scene.id}.wav`)} />
        <WordCaptions
          text={scene.text}
          durationInFrames={Math.round(scene.vsec * fps)}
          top={1420}
          highlight={ACCENT}
          locale="en-US"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export const BranEN: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#0b1018" }}>
      <Series>
        {RU_STORY.map((scene, i) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={Math.round(scene.sec * fps)}
            premountFor={fps}
          >
            <ScenePage scene={scene} index={i} />
          </Series.Sequence>
        ))}
      </Series>
      <Audio src={staticFile("bran/bed.m4a")} volume={0.18} />
    </AbsoluteFill>
  );
};
