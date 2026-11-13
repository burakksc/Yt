import React from "react";
import { loadFont } from "@remotion/google-fonts/Nunito";
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
import { BEBEK_SCENES } from "./scenes";
import { BEBEK_STORY, type BebekScene } from "./story";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const up = (s: string) => s.toLocaleUpperCase("tr-TR");

const Hud: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 150,
      left: 50,
      background: "rgba(255,255,255,0.88)",
      color: "#e0786a",
      padding: "10px 24px",
      borderRadius: 30,
      fontSize: 36,
      fontWeight: 900,
      border: "3px solid #f6c1b5",
    }}
  >
    ♡ EBE ANLATIYOR
  </div>
);

const Title: React.FC<{ scene: BebekScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const big = scene.id === "giris";
  return (
    <div
      lang="tr"
      style={{
        position: "absolute",
        top: big ? 260 : 250,
        left: 40,
        right: 40,
        textAlign: "center",
        opacity: s,
        transform: `translateY(${(1 - s) * -24}px)`,
      }}
    >
      <div
        style={{
          fontSize: big ? 112 : 86,
          fontWeight: 900,
          color: "#ffffff",
          WebkitTextStroke: `${big ? 16 : 13}px #b85c50`,
          paintOrder: "stroke fill",
          lineHeight: 1.02,
        }}
      >
        {up(scene.title)}
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 10,
          padding: "6px 24px",
          background: "#ffffff",
          color: "#b85c50",
          fontSize: big ? 46 : 36,
          fontWeight: 800,
          borderRadius: 24,
        }}
      >
        {scene.subtitle}
      </div>
    </div>
  );
};

const ScenePage: React.FC<{ scene: BebekScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = Math.round(scene.sec * fps);
  const Scene = BEBEK_SCENES[scene.id];
  const fade = interpolate(
    frame,
    [0, 7, frames - 6, frames],
    [0, 1, 1, 0],
    clamp,
  );
  const zoom = interpolate(frame, [0, frames], [1.03, 1.0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#fdf3ea" }}>
      <AbsoluteFill style={{ opacity: fade, transform: `scale(${zoom})` }}>
        <Scene scene={scene} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 72%, rgba(120,60,50,0.28) 100%)",
        }}
      />
      <Hud />
      <Title scene={scene} />
      <WordCaptions
        text={scene.text}
        durationInFrames={frames}
        highlight="#ffd2c6"
      />
      {scene.id === "mpoz" && (
        <div
          style={{
            position: "absolute",
            top: 1406,
            left: 110,
            right: 110,
            padding: "6px 16px",
            borderRadius: 18,
            background: "rgba(140,70,60,0.78)",
            textAlign: "center",
            fontSize: 26,
            fontWeight: 700,
            color: "#ffffff",
            opacity: interpolate(frame, [fps, 1.5 * fps], [0, 0.9], clamp),
          }}
        >
          Genel bilgilendirmedir. Prematüre ya da özel durumlarda
          ebene/doktoruna danış.
        </div>
      )}
    </AbsoluteFill>
  );
};

export const BebekSling: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#fdf3ea" }}>
      <Series>
        {BEBEK_STORY.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={Math.round(scene.sec * fps)}
            premountFor={fps}
          >
            <ScenePage scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
      <Audio src={staticFile("bebek-sling/music.mp3")} volume={0.75} />
    </AbsoluteFill>
  );
};
