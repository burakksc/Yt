import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IntroScene } from "./scenes/Intro";
import { HumanScene } from "./scenes/Human";
import { WaterScene } from "./scenes/Water";
import { ElectronicsScene } from "./scenes/Electronics";
import { VehiclesScene } from "./scenes/Vehicles";
import { PowerScene } from "./scenes/Power";
import { BuildingsScene } from "./scenes/Buildings";
import { NatureScene } from "./scenes/Nature";
import { BreathScene } from "./scenes/Breath";
import { OutroScene } from "./scenes/Outro";
import { LangCtx } from "./scenes/common";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

type Caption = {
  readonly badge: string;
  readonly text: string;
};

export type Eksi100Props = {
  readonly title: string;
  readonly subtitle: string;
  readonly captions: Caption[];
  /** "en": Michael narration from public/eksi-100/en/<i>.wav, scene lengths from EKSI100_EN_SECS. */
  readonly lang?: "tr" | "en";
};

// Scene order and length in seconds. Captions (defaultProps) map 1:1 onto this list.
export const SCENES: { sec: number; Scene: React.FC }[] = [
  { sec: 4, Scene: IntroScene },
  { sec: 6, Scene: HumanScene },
  { sec: 6, Scene: WaterScene },
  { sec: 5, Scene: ElectronicsScene },
  { sec: 6, Scene: VehiclesScene },
  { sec: 6, Scene: PowerScene },
  { sec: 5, Scene: BuildingsScene },
  { sec: 5, Scene: NatureScene },
  { sec: 5, Scene: BreathScene },
  { sec: 5, Scene: OutroScene },
];

// English (Michael) version: narration wav lengths per scene, filled in after TTS.
export const EN_LEAD = 0.25;
const EN_VSEC = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
export const EKSI100_EN_SECS = SCENES.map((s, i) =>
  Math.max(s.sec, Math.round((EN_VSEC[i] + EN_LEAD + 0.55) * 10) / 10),
);

export const EKSI100_FPS = 30;
export const EKSI100_DURATION =
  SCENES.reduce((sum, s) => sum + s.sec, 0) * EKSI100_FPS;

// Layout (1080x1920). The 16:9 card sits in the middle, title above, caption below.
const CARD_TOP = 658;
const CARD_H = 608;

const Badge: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 1318,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          minWidth: 420,
          padding: "12px 40px",
          borderRadius: 40,
          backgroundColor: "#d63a2a",
          color: "white",
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: 1.5,
          textAlign: "center",
          transform: `scale(${0.85 + 0.15 * pop})`,
          boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const CaptionText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [2, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 1430,
        left: 70,
        right: 70,
        textAlign: "center",
        color: "white",
        fontSize: 52,
        fontWeight: 800,
        lineHeight: 1.3,
        opacity,
        transform: `translateY(${(1 - opacity) * 14}px)`,
        textShadow: "0 3px 10px rgba(0,0,0,0.6)",
      }}
    >
      {text}
    </div>
  );
};

const ScenePage: React.FC<{ Scene: React.FC; caption: Caption }> = ({
  Scene,
  caption,
}) => {
  const frame = useCurrentFrame();
  const cardIn = interpolate(frame, [0, 5], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      {/* Blurred, zoomed copy of the scene fills the vertical frame.
          Drawn at 1/4 size and scaled up: a large blur on a big element is very slow to render. */}
      <div
        style={{
          position: "absolute",
          height: 1920 / 4,
          width: 3414 / 4,
          left: (1080 - (3414 / 4) * 4.3) / 2,
          top: (1920 - (1920 / 4) * 4.3) / 2,
          filter: "blur(10px)",
          transform: "scale(4.3)",
          transformOrigin: "0 0",
        }}
      >
        <Scene />
      </div>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(16,24,40,0.88) 0%, rgba(16,24,40,0.72) 30%, rgba(16,24,40,0.55) 70%, rgba(70,78,92,0.5) 100%)",
        }}
      />
      {/* The scene card */}
      <div
        style={{
          position: "absolute",
          top: CARD_TOP,
          left: 0,
          width: 1080,
          height: CARD_H,
          overflow: "hidden",
          opacity: cardIn,
          boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
        }}
      >
        <Scene />
      </div>
      <Badge label={caption.badge} />
      <CaptionText text={caption.text} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <div
    style={{
      position: "absolute",
      top: 245,
      left: 0,
      right: 0,
      textAlign: "center",
      lineHeight: 1.05,
    }}
  >
    <div
      style={{
        color: "white",
        fontSize: 118,
        fontWeight: 900,
        letterSpacing: 2,
        textShadow:
          "0 0 3px #0d1424, 0 6px 0 #0d1424, 0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {title}
    </div>
    <div
      style={{
        color: "#7cc4f5",
        fontSize: 82,
        fontWeight: 900,
        letterSpacing: 4,
        marginTop: 12,
        textShadow: "0 5px 0 #0d1424, 0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      {subtitle}
    </div>
  </div>
);

export const Eksi100: React.FC<Eksi100Props> = ({
  title,
  subtitle,
  captions,
  lang = "tr",
}) => {
  const { fps } = useVideoConfig();
  const en = lang === "en";
  return (
    <LangCtx.Provider value={lang}>
      <AbsoluteFill style={{ backgroundColor: "#0f1726", fontFamily }}>
        <Series>
          {SCENES.map(({ sec, Scene }, i) => (
            <Series.Sequence
              key={i}
              durationInFrames={Math.round(
                (en ? EKSI100_EN_SECS[i] : sec) * fps,
              )}
              premountFor={fps}
            >
              <ScenePage
                Scene={Scene}
                caption={captions[i] ?? { badge: "", text: "" }}
              />
              {en && (
                <Sequence from={Math.round(EN_LEAD * fps)} layout="none">
                  <Audio src={staticFile(`eksi-100/en/${i}.wav`)} />
                </Sequence>
              )}
            </Series.Sequence>
          ))}
        </Series>
        <Title title={title} subtitle={subtitle} />
        <Audio
          src={staticFile("eksi-100/wind.mp3")}
          volume={en ? 0.45 : 0.9}
        />
      </AbsoluteFill>
    </LangCtx.Provider>
  );
};
