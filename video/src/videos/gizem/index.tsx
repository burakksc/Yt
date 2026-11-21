// Mystery Shorts (1080x1920): real photos / PD scans + English narration (Michael) + smaller captions.
// One component for every story; data in ./stories.ts (generated from projects/gizem/stories.json).
import React from "react";
import { Watermark } from "../../components/Watermark";
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
import { GZ_LEAD, STORIES, type MyScene } from "./stories";

const { fontFamily } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });
const ACCENT = "#7fd3ff";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Dust: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(40).fill(0).map((_, i) => {
        const s = 2 + random(`s${i}`) * 4;
        const y = ((random(`y${i}`) * 2000 - frame * (0.3 + s * 0.08)) % 2000 + 2000) % 2000 - 40;
        const x = random(`x${i}`) * 1080 + Math.sin(frame / 50 + i) * 12;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, background: "white", opacity: 0.12 + 0.25 * random(`o${i}`) }} />
        );
      })}
    </AbsoluteFill>
  );
};

const ScenePage: React.FC<{ slug: string; scene: MyScene; index: number; credit?: string }> = ({ slug, scene, index, credit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = Math.round(scene.sec * fps);
  const p = interpolate(frame, [0, frames], [0, 1], clamp);
  const fade = interpolate(frame, [0, 8, frames - 8, frames], [0, 1, 1, 0], clamp);
  const t = spring({ frame, fps, config: { damping: 14 } });
  const big = spring({ frame: frame - Math.round((GZ_LEAD + 0.8) * fps), fps, config: { damping: 12 } });
  const dir = index % 2 ? 1 : -1;
  return (
    <AbsoluteFill style={{ opacity: index === 0 ? 1 : fade, overflow: "hidden" }}>
      {/* blurred fill behind (no black bars for portrait/landscape mixes) */}
      <Img src={staticFile(`gizem/${slug}/img/${scene.img}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.45)", transform: "scale(1.2)" }} />
      <Img
        src={staticFile(`gizem/${slug}/img/${scene.img}.jpg`)}
        style={{
          position: "absolute",
          height: scene.fit === "contain" ? undefined : "100%",
          width: scene.fit === "contain" ? "100%" : undefined,
          left: "50%",
          top: scene.fit === "contain" ? "50%" : 0,
          transform: `translateX(-50%) ${scene.fit === "contain" ? "translateY(-50%)" : ""} translateX(${scene.fit === "contain" ? 0 : dir * interpolate(p, [0, 1], [-110, 110])}px) scale(${interpolate(p, [0, 1], [1.04, 1.14])})`,
          filter: "brightness(0.85) contrast(1.05)",
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.8) 100%)" }} />
      <Dust />
      <div style={{ position: "absolute", top: 260, left: 60, right: 60, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * -30}px)` }}>
        <div style={{ fontSize: 76, fontWeight: 900, color: "white", lineHeight: 1.05, textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}>{scene.title.toUpperCase()}</div>
      </div>
      {scene.big && (
        <div style={{ position: "absolute", top: 820, left: 40, right: 40, textAlign: "center", opacity: big, transform: `scale(${0.7 + 0.3 * big})` }}>
          <div style={{ fontSize: 150, fontWeight: 900, color: ACCENT, lineHeight: 1, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{scene.big}</div>
          {scene.bigSub && <div style={{ fontSize: 42, fontWeight: 800, color: "white", marginTop: 14, textShadow: "0 3px 14px rgba(0,0,0,0.95)" }}>{scene.bigSub}</div>}
        </div>
      )}
      {credit && (
        <div style={{ position: "absolute", left: 64, right: 40, top: 1816, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.6)", textShadow: "0 2px 6px #000" }}>{credit}</div>
      )}
      <Watermark />
      <Sequence from={Math.round(GZ_LEAD * fps)} layout="none">
        <Audio src={staticFile(`gizem/${slug}/en/${scene.id}.wav`)} />
        <WordCaptions text={scene.text} durationInFrames={Math.round(scene.vsec * fps)} top={1440} highlight={ACCENT} locale="en-US" fontSize={58} />
      </Sequence>
      {scene.sfx && (
        <Sequence from={Math.round((GZ_LEAD + scene.vsec + 0.1) * fps)} layout="none">
          <Audio src={staticFile(`gizem/${slug}/${scene.sfx}.m4a`)} volume={0.9} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

export const GizemShort: React.FC<{ slug: string }> = ({ slug }) => {
  const { fps } = useVideoConfig();
  const st = STORIES[slug];
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#05080f" }}>
      <Series>
        {st.scenes.map((scene, i) => (
          <Series.Sequence key={scene.id} durationInFrames={Math.round(scene.sec * fps)} premountFor={fps}>
            <ScenePage slug={slug} scene={scene} index={i} credit={st.credits[scene.img]} />
          </Series.Sequence>
        ))}
      </Series>
      <Audio src={staticFile("gizem/bed.m4a")} volume={0.16} />
    </AbsoluteFill>
  );
};
