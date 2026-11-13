import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordCaptions } from "../../components/WordCaptions";
import { SLING_SCENES } from "./scenes";
import { SLING_STORY, type SlingScene } from "./story";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const up = (s: string) => s.toLocaleUpperCase("tr-TR");

const Hud: React.FC<{ step: string }> = ({ step }) => (
  <div
    style={{
      position: "absolute",
      top: 150,
      left: 50,
      display: "flex",
      gap: 14,
      fontSize: 38,
      fontWeight: 800,
    }}
  >
    <div
      style={{
        background: "rgba(10,14,24,0.82)",
        color: "#ffc61a",
        padding: "10px 22px",
        borderRadius: 18,
      }}
    >
      ⛓ SLING BAĞLAMA
    </div>
    {step && (
      <div
        style={{
          background: "#ff8a1f",
          color: "#11161f",
          padding: "10px 22px",
          borderRadius: 18,
        }}
      >
        {step}
      </div>
    )}
  </div>
);

const Title: React.FC<{ scene: SlingScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 170 } });
  const big = scene.id === "giris";
  return (
    <div
      lang="tr"
      style={{
        position: "absolute",
        top: big ? 300 : 250,
        left: 40,
        right: 40,
        textAlign: "center",
        transform: `translateY(${(1 - s) * -30}px)`,
        opacity: s,
      }}
    >
      <div
        style={{
          fontSize: big ? 130 : 84,
          fontWeight: 900,
          color: "white",
          WebkitTextStroke: `${big ? 16 : 12}px #0b1020`,
          paintOrder: "stroke fill",
          lineHeight: 1.02,
        }}
      >
        {up(scene.title)}
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 12,
          padding: "6px 22px",
          background: big ? "#d63a2a" : "rgba(10,14,24,0.82)",
          color: big ? "white" : "#ffc61a",
          fontSize: big ? 52 : 38,
          fontWeight: 800,
          borderRadius: 14,
        }}
      >
        {big ? up(scene.subtitle) : scene.subtitle}
      </div>
    </div>
  );
};

const ScenePage: React.FC<{ scene: SlingScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = Math.round(scene.sec * fps);
  const Scene = SLING_SCENES[scene.id];
  const fade = interpolate(
    frame,
    [0, 6, frames - 5, frames],
    [0, 1, 1, 0],
    clamp,
  );
  const zoom = interpolate(frame, [0, frames], [1.04, 1.0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020" }}>
      <AbsoluteFill style={{ opacity: fade, transform: `scale(${zoom})` }}>
        <Scene />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,12,22,0.55) 0%, rgba(8,12,22,0) 26%, rgba(8,12,22,0) 70%, rgba(8,12,22,0.55) 100%)",
        }}
      />
      <Hud step={scene.step} />
      <Title scene={scene} />
      <WordCaptions text={scene.text} durationInFrames={frames} />
    </AbsoluteFill>
  );
};

export const SlingVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#0b1020" }}>
      <Series>
        {SLING_STORY.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={Math.round(scene.sec * fps)}
            premountFor={fps}
          >
            <ScenePage scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
      <Audio src={staticFile("sling/music.mp3")} volume={0.8} />
    </AbsoluteFill>
  );
};
