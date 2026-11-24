import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KILER_STORY, type KilerScene } from "./story";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const up = (s: string) => s.toLocaleUpperCase("tr-TR");
const CREAM = "#fff3dc";
const AMBER = "#f4b36b";
const INK = "#120d08";

const Photo: React.FC<{ scene: KilerScene; index: number; frames: number }> = ({
  scene,
  index,
  frames,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, frames], [0, 1], clamp);
  const zoomIn = index % 2 === 0;
  const scale = zoomIn ? 1.04 + t * 0.1 : 1.14 - t * 0.1;
  const x = (index % 3) - 1; // -1, 0, 1 pan direction
  return (
    <Img
      src={staticFile(`kiler/${scene.id}.jpg`)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale}) translateX(${x * t * 20}px)`,
      }}
    />
  );
};

const Fact: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: s,
        transform: `translateX(${(1 - s) * -40}px)`,
        fontSize: 44,
        fontWeight: 600,
        color: CREAM,
        lineHeight: 1.25,
        textShadow: "0 2px 10px rgba(0,0,0,0.7)",
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: AMBER,
          flexShrink: 0,
        }}
      />
      {text}
    </div>
  );
};

const Chip: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 14], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 80,
        opacity: o,
        padding: "10px 24px",
        borderRadius: 999,
        background: "rgba(18,13,8,0.72)",
        border: `2px solid ${AMBER}`,
        color: AMBER,
        fontSize: 30,
        fontWeight: 800,
      }}
    >
      📍 {text}
    </div>
  );
};

const Credit: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      right: 30,
      bottom: 20,
      padding: "4px 12px",
      borderRadius: 8,
      background: "rgba(18,13,8,0.6)",
      fontSize: 20,
      fontWeight: 600,
      color: "rgba(255,243,220,0.75)",
      textShadow: "0 1px 4px rgba(0,0,0,0.9)",
    }}
  >
    {text}
  </div>
);

const Progress: React.FC<{ index: number }> = ({ index }) => (
  <div
    style={{
      position: "absolute",
      top: 72,
      right: 80,
      display: "flex",
      gap: 10,
    }}
  >
    {KILER_STORY.map((s, i) => (
      <div
        key={s.id}
        style={{
          width: i === index ? 44 : 14,
          height: 14,
          borderRadius: 7,
          background: i <= index ? AMBER : "rgba(255,243,220,0.35)",
        }}
      />
    ))}
  </div>
);

const Intro: React.FC<{ scene: KilerScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const sub = spring({ frame: frame - 35, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 160px",
        background:
          "radial-gradient(ellipse at center, rgba(18,13,8,0.55) 0%, rgba(18,13,8,0.8) 100%)",
      }}
    >
      <div
        style={{
          fontSize: 104,
          fontWeight: 900,
          color: CREAM,
          lineHeight: 1.05,
          opacity: s,
          transform: `scale(${0.9 + s * 0.1})`,
          textShadow: "0 4px 24px rgba(0,0,0,0.8)",
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          marginTop: 36,
          fontSize: 52,
          fontWeight: 800,
          color: AMBER,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
        }}
      >
        {scene.facts[0]}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ scene: KilerScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const end = spring({ frame: frame - 100, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "rgba(18,13,8,0.62)",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: CREAM,
          opacity: s,
          textShadow: "0 4px 24px rgba(0,0,0,0.8)",
        }}
      >
        {up(scene.title)}
      </div>
      <div style={{ display: "flex", gap: 28, marginTop: 50 }}>
        {scene.facts.map((f, i) => {
          const p = spring({ frame: frame - 18 - i * 12, fps, config: { damping: 11 } });
          return (
            <div
              key={f}
              style={{
                padding: "22px 40px",
                borderRadius: 24,
                background: AMBER,
                color: INK,
                fontSize: 50,
                fontWeight: 900,
                opacity: p,
                transform: `scale(${0.6 + p * 0.4})`,
              }}
            >
              {up(f)}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 60,
          fontSize: 42,
          fontWeight: 600,
          color: CREAM,
          opacity: end,
        }}
      >
        Buzdolabı 100 yıllık. Kilerler binlerce yıllık.
      </div>
    </AbsoluteFill>
  );
};

const Info: React.FC<{ scene: KilerScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(18,13,8,0.88) 0%, rgba(18,13,8,0.6) 45%, rgba(18,13,8,0) 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 0,
          bottom: 0,
          width: 1050,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            color: CREAM,
            lineHeight: 1.02,
            opacity: s,
            transform: `translateY(${(1 - s) * 30}px)`,
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            width: 120 * s,
            height: 8,
            borderRadius: 4,
            background: AMBER,
            marginBottom: 14,
          }}
        />
        {scene.facts.map((f, i) => (
          <Fact key={f} text={f} delay={24 + i * 40} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ScenePage: React.FC<{ scene: KilerScene; index: number }> = ({
  scene,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = Math.round(scene.sec * fps);
  const fade = interpolate(frame, [0, 8, frames - 8, frames], [0, 1, 1, 0], clamp);
  const last = index === KILER_STORY.length - 1;
  return (
    <AbsoluteFill lang="tr" style={{ backgroundColor: INK, opacity: fade }}>
      <Photo scene={scene} index={index} frames={frames} />
      {index === 0 ? (
        <Intro scene={scene} />
      ) : last ? (
        <Outro scene={scene} />
      ) : (
        <Info scene={scene} />
      )}
      <Chip text={scene.place} />
      <Progress index={index} />
      <Credit text={scene.credit} />
    </AbsoluteFill>
  );
};

export const KilerVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: INK }}>
      <Series>
        {KILER_STORY.map((scene, i) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={Math.round(scene.sec * fps)}
            premountFor={fps}
          >
            <ScenePage scene={scene} index={i} />
          </Series.Sequence>
        ))}
      </Series>
      <Audio src={staticFile("kiler/music.mp3")} volume={0.8} />
    </AbsoluteFill>
  );
};
