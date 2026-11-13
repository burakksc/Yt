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
import { WordCaptions, wordStartFrame } from "../../components/WordCaptions";
import { Canvas } from "../eksi-100-hikaye/kit";
import { Person } from "../bebek-sling/people";
import { Nursery } from "../bebek-sling/scenes";
import { SARGI_STORY, type SargiScene } from "./story";
import { DONE, EMPTY, WrapBack, WrapFront, type WrapState } from "./wrap";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const up = (s: string) => s.toLocaleUpperCase("tr-TR");
const FLOOR = 1410;
const MOM = { top: "#f4a99a", bottom: "#7f9bb8" };
const STEPS = 8;

/** Progress 0..1 for each cue word of the scene (starts when the word is on screen). */
const useCues = (scene: SargiScene) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.round(scene.sec * fps);
  return scene.cues.map((c) => {
    const f0 = wordStartFrame(scene.text, c, total, fps);
    return interpolate(frame, [f0, f0 + 0.7 * fps], [0, 1], clamp);
  });
};

/** Wrap state at the end of each step, so every scene starts where the previous one ended. */
const AFTER: Record<number, Partial<WrapState>> = {
  1: { band: 1 },
  2: { band: 1 },
  3: { band: 1, drapes: 1 },
  4: { band: 1, drapes: 1, tucked: 1 },
  5: { band: 1, drapes: 1, tucked: 1, frontX: 1, waist: 1 },
  6: { band: 1, drapes: 1, tucked: 1, frontX: 1, waist: 1, baby: 1, babyIn: 1 },
  7: { ...DONE, pocketUp: 0 },
  8: DONE,
};
const before = (step: number): WrapState => ({
  ...EMPTY,
  ...(AFTER[step - 1] ?? {}),
});

const Midwife: React.FC<{ arms?: "point" | "wave" }> = ({ arms = "point" }) => (
  <Person
    x={150}
    y={FLOOR}
    scale={0.82}
    top="#7cc6b8"
    bottom="#5fa596"
    hair="cap"
    arms={arms}
    mood="talk"
    stethoscope
  />
);

const Mom: React.FC<{
  s: WrapState;
  view?: "front" | "back";
  back?: { cross: number; knot: number };
  x?: number;
  scale?: number;
}> = ({ s, view = "front", back, x = 640, scale = 1.12 }) => (
  <Person
    x={x}
    y={FLOOR}
    scale={scale}
    top={MOM.top}
    bottom={MOM.bottom}
    view={view}
    arms={s.baby > 0 ? "hold" : "tie"}
    mood="calm"
    front={
      view === "back" && back ? (
        <WrapBack cross={back.cross} knot={back.knot} />
      ) : (
        <WrapFront s={s} />
      )
    }
  />
);

/** Quick "turn around" squash when the view flips. */
const Turn: React.FC<{
  at: number;
  children: (view: "front" | "back") => React.ReactNode;
  first: "front" | "back";
}> = ({ at, children, first }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(
    frame,
    [at - 0.2 * fps, at, at + 0.2 * fps],
    [1, 0.05, 1],
    clamp,
  );
  const view = frame < at ? first : first === "front" ? "back" : "front";
  return (
    <g transform={`translate(640 0) scale(${k} 1) translate(-640 0)`}>
      {children(view)}
    </g>
  );
};

const SceneArt: React.FC<{ scene: SargiScene }> = ({ scene }) => {
  const c = useCues(scene);
  const { fps } = useVideoConfig();
  const frames = Math.round(scene.sec * fps);
  const cueFrame = (i: number) =>
    wordStartFrame(scene.text, scene.cues[i], frames, fps);
  const s = before(scene.step);
  let art: React.ReactNode;
  switch (scene.id) {
    case "giris":
      art = <Mom s={DONE} />;
      break;
    case "orta":
      art = <Mom s={{ ...s, band: c[1] > 0 ? 1 : c[0] }} />;
      break;
    case "arka":
      art = (
        <Turn at={cueFrame(0)} first="front">
          {(v) => (
            <Mom
              s={{ ...s, band: 1 }}
              view={v}
              back={{ cross: c[1], knot: 0 }}
            />
          )}
        </Turn>
      );
      break;
    case "omuz":
      art = <Mom s={{ ...s, drapes: c[0] }} />;
      break;
    case "alt":
      art = <Mom s={{ ...s, tucked: c[0] }} />;
      break;
    case "bagla":
      art = (
        <Turn at={cueFrame(1)} first="front">
          {(v) => (
            <Mom
              s={{ ...s, frontX: c[0], waist: c[0] }}
              view={v}
              back={{ cross: 1, knot: c[1] }}
            />
          )}
        </Turn>
      );
      break;
    case "bebek":
      art = <Mom s={{ ...s, baby: c[0], babyIn: c[1], mMark: c[2] }} />;
      break;
    case "yay":
      art = <Mom s={{ ...s, spread: c[0] }} />;
      break;
    case "cep":
      art = <Mom s={{ ...s, pocketUp: c[0], faceMark: c[1] }} />;
      break;
    case "kontrol":
      art = <Mom s={DONE} x={300} scale={1.0} />;
      break;
    default:
      art = <Mom s={DONE} />;
  }
  return (
    <Canvas>
      <Nursery />
      {art}
      {scene.id === "kontrol" ? (
        <Checklist scene={scene} />
      ) : (
        <Midwife
          arms={
            scene.id === "giris" || scene.id === "kapanis" ? "wave" : "point"
          }
        />
      )}
    </Canvas>
  );
};

const Checklist: React.FC<{ scene: SargiScene }> = ({ scene }) => {
  const c = useCues(scene);
  const rows = [
    "Sıkı",
    "Her an görünür",
    "Öpülecek yükseklikte",
    "Çene göğüsten 2 parmak uzak",
    "Sırt destekli",
  ];
  return (
    <g>
      {rows.map((r, i) => (
        <g
          key={r}
          transform={`translate(${560 + (1 - c[i]) * 60} ${560 + i * 150})`}
          opacity={0.25 + 0.75 * c[i]}
        >
          <rect
            width={480}
            height={124}
            rx={30}
            fill="#ffffff"
            stroke="#f0a493"
            strokeWidth={4}
          />
          <circle
            cx={64}
            cy={62}
            r={44}
            fill={c[i] > 0 ? "#ff8f7a" : "#ffd2c6"}
          />
          <text
            x={64}
            y={80}
            textAnchor="middle"
            fontSize={50}
            fontWeight={900}
            fill="#ffffff"
          >
            {"TICKS"[i]}
          </text>
          <foreignObject x={124} y={10} width={300} height={104}>
            <div
              style={{
                height: 104,
                display: "flex",
                alignItems: "center",
                fontSize: 31,
                fontWeight: 800,
                color: "#8a5a50",
                lineHeight: 1.1,
              }}
            >
              {r}
            </div>
          </foreignObject>
          {c[i] >= 1 && (
            <text
              x={445}
              y={78}
              textAnchor="middle"
              fontSize={44}
              fontWeight={900}
              fill="#5fb37e"
            >
              ✓
            </text>
          )}
        </g>
      ))}
    </g>
  );
};

const Header: React.FC<{ scene: SargiScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const big = scene.id === "giris";
  return (
    <div
      lang="tr"
      style={{
        position: "absolute",
        top: big ? 270 : 250,
        left: 40,
        right: 40,
        textAlign: "center",
        opacity: s,
      }}
    >
      <div
        style={{
          fontSize: big ? 104 : 84,
          fontWeight: 900,
          color: "#ffffff",
          WebkitTextStroke: `${big ? 16 : 13}px #b85c50`,
          paintOrder: "stroke fill",
          lineHeight: 1.02,
          transform: `translateY(${(1 - s) * -20}px)`,
        }}
      >
        {up(scene.title)}
      </div>
      {scene.step > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 18,
          }}
        >
          {new Array(STEPS).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === scene.step ? 70 : 26,
                height: 26,
                borderRadius: 13,
                background:
                  i + 1 < scene.step
                    ? "#ffb3a3"
                    : i + 1 === scene.step
                      ? "#ff8f7a"
                      : "#ffffff",
                border: "3px solid #f0a493",
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 900,
                lineHeight: "20px",
              }}
            >
              {i + 1 === scene.step ? `${scene.step}/8` : ""}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "inline-block",
            marginTop: 12,
            padding: "6px 24px",
            background: "#ffffff",
            color: "#b85c50",
            fontSize: big ? 44 : 36,
            fontWeight: 800,
            borderRadius: 24,
          }}
        >
          {big
            ? "Ebe anlatıyor · cep çapraz bağlama"
            : scene.id === "kontrol"
              ? "TICKS kuralı"
              : "Kaydet & paylaş"}
        </div>
      )}
    </div>
  );
};

const ScenePage: React.FC<{ scene: SargiScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = Math.round(scene.sec * fps);
  const fade = interpolate(
    frame,
    [0, 6, frames - 5, frames],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#fdf3ea" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <SceneArt scene={scene} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 72%, rgba(120,60,50,0.28) 100%)",
        }}
      />
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
      <Header scene={scene} />
      <WordCaptions
        text={scene.text}
        durationInFrames={frames}
        highlight="#ffd2c6"
      />
      {scene.id === "kapanis" && (
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
            opacity: interpolate(frame, [0.5 * fps, fps], [0, 0.95], clamp),
          }}
        >
          Genel bilgilendirmedir. Sargının kullanım kılavuzuna uy; özel
          durumlarda ebene danış.
        </div>
      )}
    </AbsoluteFill>
  );
};

export const EsnekSargi: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#fdf3ea" }}>
      <Series>
        {SARGI_STORY.map((scene) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={Math.round(scene.sec * fps)}
            premountFor={fps}
          >
            <ScenePage scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
      <Audio src={staticFile("esnek-sargi/music.mp3")} volume={0.75} />
    </AbsoluteFill>
  );
};
