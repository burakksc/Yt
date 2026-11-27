// "How Ottomans Painted on Water" (ebru) — ~35 s vertical Short. AI clips (FLUX.1-schnell → Wan 2.2)
// + English on-screen text, no voice-over. Clips: public/ebru/<id>.mp4 (1080×1920, 30 fps).
// Facts: UNESCO ICH 00644 (2014), istanbultarihi.ist, Georgia Tech paper museum. Anti-forgery use: several sources.
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GOLD = "#ffcc00";

type Scene = { id: string; sec: number; chip: string; text: string; hook?: string };

export const EBRU_SCENES: Scene[] = [
  { id: "e1-hook", sec: 5, chip: "OTTOMAN EMPIRE", hook: "THEY PAINTED ON WATER TO STOP FORGERS", text: "" },
  { id: "e2-workshop", sec: 5, chip: "1500s · ISTANBUL", text: "Ottoman marblers worked over a tray of thickened water." },
  { id: "e3-pigment", sec: 5, chip: "THE RECIPE", text: "Natural pigments, gum tragacanth, and a few drops of ox gall." },
  { id: "e4-brush", sec: 5, chip: "THE BRUSH", text: "Horsehair tied to a rose branch. The colors float instead of sinking." },
  { id: "e5-tulip", sec: 5, chip: "THE PATTERN", text: "A thin stylus pulls the paint into waves and tulips." },
  { id: "e6-paper", sec: 5, chip: "ONE OF A KIND", text: "Lay the paper, lift it. No two prints are ever the same." },
  { id: "e7-scribe", sec: 5, chip: "ANTI-FORGERY", text: "Officials used marbled paper: scrape the ink, and the pattern breaks." },
];

export const EBRU_FPS = 30;
export const EBRU_FRAMES = EBRU_SCENES.reduce((s, x) => s + x.sec, 0) * EBRU_FPS;

const Chip: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [3, 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: "rgba(0,0,0,0.65)", color: GOLD, fontSize: 40, fontWeight: 800, padding: "10px 26px", borderRadius: 14, letterSpacing: 2 }}>
        {text}
      </div>
    </div>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 1440,
        left: 70,
        right: 70,
        textAlign: "center",
        color: "white",
        fontSize: 62,
        fontWeight: 800,
        lineHeight: 1.18,
        opacity: s,
        transform: `translateY(${(1 - s) * 24}px)`,
        WebkitTextStroke: "10px rgba(0,0,0,0.85)",
        paintOrder: "stroke fill",
      }}
    >
      {text}
    </div>
  );
};

const Hook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 11, stiffness: 160 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 1300,
        left: 50,
        right: 50,
        textAlign: "center",
        color: "white",
        fontSize: 100,
        fontWeight: 900,
        lineHeight: 1.02,
        transform: `scale(${0.85 + s * 0.15})`,
        opacity: s,
        WebkitTextStroke: "16px #000",
        paintOrder: "stroke fill",
      }}
    >
      {text}
    </div>
  );
};

const ScenePage: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = scene.sec * fps;
  const fade = interpolate(frame, [0, 5, frames - 5, frames], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Video src={staticFile(`ebru/${scene.id}.mp4`)} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <Chip text={scene.chip} />
      {scene.hook ? <Hook text={scene.hook} /> : <Caption text={scene.text} />}
    </AbsoluteFill>
  );
};

export const EbruShort: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "black" }}>
      <Series>
        {EBRU_SCENES.map((s) => (
          <Series.Sequence key={s.id} durationInFrames={s.sec * fps} premountFor={fps}>
            <ScenePage scene={s} />
          </Series.Sequence>
        ))}
      </Series>
      <div style={{ position: "absolute", top: 60, right: 40, fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
        AI reconstruction
      </div>
      <Audio src={staticFile("ebru/music.mp3")} volume={0.8} />
    </AbsoluteFill>
  );
};
