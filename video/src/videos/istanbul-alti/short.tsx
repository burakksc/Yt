// Vertical (1080x1920) summary Short of the Turkish Istanbul video: reuses the 16:9 scene
// illustrations (scaled + centre-cropped), Turkish Michael narration and word captions.
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
import { WordCaptions } from "../../components/WordCaptions";
import { AltiLang } from "./lang";
import { ALTI_SCENES } from "./scenes";
import { ALTI_SHORT } from "./story_short";
import { ALTI_STORY } from "./story";
import { ALTI_SHORT_EN } from "./story_short_en";
import { ALTI_STORY_TR } from "./story_tr";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GOLD = "#c9a46a";
const TAG_COLOR = {
  FACT: "#7be0a6",
  MYTH: "#ff7a5c",
  MAYBE: "#ffcf6a",
} as const;
const SCALE = 0.9; // 1920x1080 art -> 1728 wide, a 1080 px window of it is visible
const FOCUS_X: Record<string, number> = {
  intro: 960,
  cistern: 960,
  hagia: 960,
  legend: 1300,
  yenikapi: 960,
};
const ART_TOP = 470;

const Page: React.FC<{
  id: (typeof ALTI_SHORT)[number]["id"];
  sec: number;
  vsec: number;
  lang: "tr" | "en";
}> = ({ id, sec, vsec, lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = (lang === "tr" ? ALTI_STORY_TR : ALTI_STORY).find(
    (s) => s.id === id,
  )!;
  const Scene = ALTI_SCENES[id];
  const frames = sec * fps;
  const fade = interpolate(
    frame,
    [0, 10, frames - 10, frames],
    [0, 1, 1, 0],
    clamp,
  );
  const s = spring({ frame, fps, config: { damping: 14 } });
  const stamp = spring({
    frame: frame - Math.round(1.0 * fps),
    fps,
    config: { damping: 9, stiffness: 200 },
  });
  const title =
    id === "intro"
      ? lang === "tr"
        ? "İstanbul'un altında ne var?"
        : "What lies beneath Istanbul?"
      : scene.door.replace(
          /^Kapı \d · |^En derin kapı · |^Door \d · |^The deepest door · /,
          "",
        );
  return (
    <AbsoluteFill>
      {/* the original 16:9 illustration, scaled and centre-cropped */}
      <div
        style={{
          position: "absolute",
          left: 540 - FOCUS_X[id] * SCALE,
          top: ART_TOP,
          width: 1920,
          height: 1080,
          transform: `scale(${SCALE})`,
          transformOrigin: "0 0",
          opacity: fade,
        }}
      >
        <AbsoluteFill style={{ width: 1920, height: 1080 }}>
          <Scene />
        </AbsoluteFill>
      </div>
      {/* blend the art into the dark frame */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ART_TOP - 2,
          height: 220,
          background:
            "linear-gradient(180deg, #0c0a0e 0%, rgba(12,10,14,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ART_TOP + 1080 * SCALE - 120,
          height: 122,
          background:
            "linear-gradient(0deg, #0c0a0e 0%, rgba(12,10,14,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 270,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: s * fade,
          transform: `translateY(${(1 - s) * -30}px)`,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 6,
            color: GOLD,
          }}
        >
          {lang === "tr"
            ? "⌂ İSTANBUL'UN ALTINDAKİ İSTANBUL"
            : "⌂ ISTANBUL BENEATH ISTANBUL"}
        </div>
        <div
          style={{
            fontSize: 70,
            fontWeight: 900,
            color: "#fff6e6",
            lineHeight: 1.08,
            marginTop: 10,
            textShadow: "0 3px 14px rgba(0,0,0,0.9)",
          }}
        >
          {title.toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US")}
        </div>
        {scene.tag && (
          <div
            style={{
              display: "inline-block",
              marginTop: 18,
              padding: "6px 24px",
              border: `5px solid ${TAG_COLOR[scene.tag]}`,
              borderRadius: 12,
              color: TAG_COLOR[scene.tag],
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: 5,
              background: "rgba(10,8,6,0.45)",
              transform: `rotate(-4deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`,
              opacity: Math.min(1, stamp * 1.4),
            }}
          >
            {scene.tagText || scene.tag}
          </div>
        )}
      </div>
      <Sequence from={Math.round(0.5 * fps)} layout="none">
        <Audio
          src={staticFile(
            `istanbul-alti/${lang === "tr" ? "tr" : "en_short"}/${id}.wav`,
          )}
        />
        <WordCaptions
          text={(lang === "tr" ? narration : narrationEn)[id]}
          locale={lang === "tr" ? "tr-TR" : "en-US"}
          durationInFrames={Math.round(vsec * fps)}
          top={1500}
          highlight="#ffcf6a"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// English narration (scripts/tts/istanbul_short_en.json), used for captions.
const narrationEn: Record<(typeof ALTI_SHORT)[number]["id"], string> = {
  intro: "They say there's a second Istanbul, hidden beneath the first.",
  cistern:
    "The Basilica Cistern. Built in the sixth century, with 336 columns. A water palace bigger than a football pitch.",
  hagia:
    "In 2005, robot cameras lowered under Hagia Sophia found 8 wells and a hidden room. About 700 metres of tunnels have been measured so far.",
  legend:
    "Legend says these tunnels run to Topkapi Palace, even under the sea to the islands. In reality, most are water and air channels. A 9 km network? It's never been measured.",
  yenikapi:
    "In Yenikapi, a metro dig uncovered a Byzantine harbor with 37 shipwrecks. And below it, footprints 8,500 years old.",
};

// Narration text (scripts/tts/istanbul_tr_narration.json), used for captions.
const narration: Record<(typeof ALTI_SHORT)[number]["id"], string> = {
  intro: "Derler ki, İstanbul'un altında ikinci bir İstanbul saklı.",
  cistern:
    "Yerebatan Sarnıcı. Altıncı yüzyılda yapıldı, 336 sütunu var. Bir futbol sahasından büyük, sudan bir saray.",
  hagia:
    "2005 yılında, Ayasofya'nın altına indirilen robot kameralar 8 kuyu ve gizli bir oda buldu. Bugüne kadar yaklaşık 700 metre tünel ölçüldü.",
  legend:
    "Efsaneye göre bu tüneller Topkapı Sarayı'na, hatta denizin altından adalara uzanıyor. Oysa çoğu, su ve hava kanalı. 9 kilometrelik bir tünel ağı var mı? Bu hiç ölçülmedi.",
  yenikapi:
    "Yenikapı'da bir metro kazısı, 37 batıkla bir Bizans limanını ortaya çıkardı. Daha da altında, 8.500 yıllık ayak izleri.",
};

export const IstanbulAltiShortTR: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AltiLang.Provider value="tr">
      <AbsoluteFill style={{ fontFamily, backgroundColor: "#0c0a0e" }}>
        <Series>
          {ALTI_SHORT.map((x) => (
            <Series.Sequence
              key={x.id}
              durationInFrames={Math.round(x.sec * fps)}
              premountFor={fps}
            >
              <Page id={x.id} sec={x.sec} vsec={x.vsec} lang="tr" />
            </Series.Sequence>
          ))}
        </Series>
        <Audio
          src={staticFile("istanbul-alti/soundtrack_short_tr.m4a")}
          volume={0.5}
        />
      </AbsoluteFill>
    </AltiLang.Provider>
  );
};

export const IstanbulAltiShortEN: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AltiLang.Provider value="en">
      <AbsoluteFill style={{ fontFamily, backgroundColor: "#0c0a0e" }}>
        <Series>
          {ALTI_SHORT_EN.map((x) => (
            <Series.Sequence
              key={x.id}
              durationInFrames={Math.round(x.sec * fps)}
              premountFor={fps}
            >
              <Page id={x.id} sec={x.sec} vsec={x.vsec} lang="en" />
            </Series.Sequence>
          ))}
        </Series>
        <Audio
          src={staticFile("istanbul-alti/soundtrack_short_en.m4a")}
          volume={0.5}
        />
      </AbsoluteFill>
    </AltiLang.Provider>
  );
};
