// Short (1080x1920): how chocolate is made. Bilingual: CikolataEN (Kokoro) / CikolataTR (Chatterbox).
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  random,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordCaptions } from "../../components/WordCaptions";
import { CIK_EN } from "./story_en";
import { CIK_TR } from "./story_tr";
import { CIK_LEAD, type CikScene } from "./types";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

type Lang = "en" | "tr";
const LangCtx = React.createContext<Lang>("en");
const useLang = () => React.useContext(LangCtx);
const L = (lang: Lang, en: string, tr: string) => (lang === "tr" ? tr : en);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const H = 1920;
const CX = W / 2;
const ACCENT = "#ffcc00";
const CREAM = "#fff3e0";
const COCOA = "#4a2716";
const POD_A = "#f0a640";
const POD_B = "#b9561f";
const FACT = "#7be0a6";

const useSec = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};
const ease = (x: number) => x * x * (3 - 2 * x);

// ---------- shared drawings ----------

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="pod" x1="0" x2="1">
      <stop offset="0" stopColor={POD_A} />
      <stop offset="1" stopColor={POD_B} />
    </linearGradient>
    <linearGradient id="bar" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#6b3a22" />
      <stop offset="1" stopColor="#2e160c" />
    </linearGradient>
    <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#8a5a33" />
      <stop offset="1" stopColor="#5c3a1f" />
    </linearGradient>
  </defs>
);

const Svg: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <svg
    width={W}
    height={H}
    style={{ position: "absolute", left: 0, top: 0, ...style }}
  >
    <Defs />
    {children}
  </svg>
);

const Pod: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  o?: number;
}> = ({ x, y, s = 1, rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <path
      d="M0,-150 C70,-140 92,-40 80,40 C68,120 30,160 0,165 C-30,160 -68,120 -80,40 C-92,-40 -70,-140 0,-150 Z"
      fill="url(#pod)"
    />
    {[-48, -24, 0, 24, 48].map((dx) => (
      <path
        key={dx}
        d={`M${dx * 0.4},-140 Q${dx * 1.5},10 ${dx * 0.5},158`}
        stroke="#8f3f14"
        strokeOpacity={0.45}
        strokeWidth={4}
        fill="none"
      />
    ))}
    <rect x={-8} y={-182} width={16} height={38} rx={6} fill="#5a3a20" />
  </g>
);

const Bean: React.FC<{
  x: number;
  y: number;
  s?: number;
  color?: string;
  rot?: number;
  o?: number;
}> = ({ x, y, s = 1, color = "#6b3a22", rot = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <ellipse rx={24} ry={36} fill={color} />
    <path
      d="M0,-30 Q6,0 0,30"
      stroke="#000"
      strokeOpacity={0.25}
      strokeWidth={3}
      fill="none"
    />
  </g>
);

const Trunk: React.FC<{ x?: number }> = ({ x = 300 }) => (
  <g>
    <rect x={x - 70} y={380} width={140} height={1500} fill="#4b2f1b" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path
        key={i}
        d={`M${x - 60 + i * 22},380 Q${x - 50 + i * 22 + (i % 2 ? 14 : -14)},1100 ${x - 60 + i * 22},1880`}
        stroke="#2f1c0f"
        strokeWidth={5}
        fill="none"
        opacity={0.6}
      />
    ))}
    <ellipse
      cx={x + 210}
      cy={420}
      rx={230}
      ry={70}
      fill="#2f5a2c"
      opacity={0.85}
      transform={`rotate(-12 ${x + 210} 420)`}
    />
    <ellipse
      cx={x - 120}
      cy={470}
      rx={190}
      ry={60}
      fill="#3d6e36"
      opacity={0.8}
      transform={`rotate(14 ${x - 120} 470)`}
    />
  </g>
);

const Label: React.FC<{
  x: number;
  y: number;
  text: string;
  o: number;
  size?: number;
  color?: string;
}> = ({ x, y, text, o, size = 64, color = ACCENT }) => (
  <div
    style={{
      position: "absolute",
      left: x - 400,
      top: y - size * 0.6,
      width: 800,
      textAlign: "center",
      fontSize: size,
      fontWeight: 900,
      color,
      opacity: o,
      transform: `scale(${0.8 + 0.2 * o})`,
      textShadow: "0 4px 18px rgba(0,0,0,0.6)",
    }}
  >
    {text}
  </div>
);

// ---------- background ----------

const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 48%, #4a2a18 0%, #2a170d 55%, #170c06 100%)",
      }}
    >
      {new Array(40).fill(0).map((_, i) => {
        const size = 4 + random(`d${i}`) * 10;
        const y =
          (random(`y${i}`) * H -
            frame * (0.3 + random(`v${i}`) * 0.5) +
            H * 4) %
          H;
        const x = random(`x${i}`) * W + Math.sin(frame / 50 + i) * 12;
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
              background: "#ffcf8a",
              opacity: 0.08 + 0.12 * random(`o${i}`),
              filter: "blur(1.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- scenes ----------

const HookV: React.FC<{ scene: CikScene }> = ({ scene }) => {
  const t = useSec();
  const lang = useLang();
  const v = scene.vsec;
  const pop = interpolate(t, [v * 0.25, v * 0.4], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const bite = interpolate(t, [v * 0.45, v * 0.5], [0, 1], clamp);
  const bitter = interpolate(t, [v * 0.55, v * 0.62], [0, 1], clamp);
  const q = interpolate(t, [v * 0.72, v * 0.8], [0, 1], clamp);
  return (
    <>
      <Svg>
        <Trunk />
        <Pod x={470} y={900} rot={Math.sin(t * 1.6) * 5} />
        <g opacity={pop}>
          <Bean
            x={interpolate(pop, [0, 1], [470, 760])}
            y={interpolate(pop, [0, 1], [900, 1060])}
            s={interpolate(pop, [0, 1], [0.6, 3.2])}
            color="#c9a48c"
            rot={-15}
          />
          {/* bite mark */}
          <circle cx={835} cy={985} r={46 * bite} fill="#2a170d" />
          <circle cx={800} cy={960} r={34 * bite} fill="#2a170d" />
        </g>
      </Svg>
      <Label
        x={760}
        y={1260}
        text={L(lang, "BITTER!", "ACI!")}
        o={bitter}
        color="#ff7a5c"
        size={80}
      />
      <Label x={CX} y={700} text="?" o={q} size={200} color={ACCENT} />
    </>
  );
};

const TreeV: React.FC<{ scene: CikScene }> = ({ scene }) => {
  const t = useSec();
  const { fps } = useVideoConfig();
  const v = scene.vsec;
  const pods = [
    { x: 470, y: 760, at: 0.2 },
    { x: 150, y: 1040, at: 0.6, rot: 10 },
    { x: 470, y: 1300, at: 1.0 },
  ];
  const open = interpolate(
    t,
    [CIK_LEAD + v * 0.45, CIK_LEAD + v * 0.6],
    [0, 1],
    { ...clamp, easing: ease },
  );
  const beans = new Array(15).fill(0).map((_, i) => ({
    x: 790 + ((i % 3) - 1) * 62,
    y: 860 + Math.floor(i / 3) * 74,
  }));
  return (
    <>
      <Svg>
        <Trunk />
        {pods.map((p, i) => {
          const s = spring({
            frame: (t - p.at) * fps,
            fps,
            config: { damping: 12 },
          });
          return (
            <Pod
              key={i}
              x={p.x}
              y={p.y}
              s={0.75 * s}
              rot={(p.rot ?? -6) + Math.sin(t * 1.4 + i) * 3}
            />
          );
        })}
        {/* opened pod: two shell halves + white pulp with beans */}
        <g opacity={open}>
          <g transform={`translate(${-open * 70} 0)`}>
            <path
              d="M790,700 C700,720 670,860 680,960 C690,1080 730,1150 790,1170 Z"
              fill="url(#pod)"
            />
          </g>
          <g transform={`translate(${open * 70} 0)`}>
            <path
              d="M790,700 C880,720 910,860 900,960 C890,1080 850,1150 790,1170 Z"
              fill="url(#pod)"
            />
          </g>
          <ellipse
            cx={790}
            cy={935}
            rx={105 * open}
            ry={225 * open}
            fill="#f6efe2"
          />
          {beans.map((b, i) => (
            <Bean
              key={i}
              x={b.x}
              y={b.y}
              s={0.8 * open}
              color="#d8c2b0"
              rot={(random(`br${i}`) - 0.5) * 30}
            />
          ))}
        </g>
      </Svg>
      <Label
        x={790}
        y={1260}
        text="~40"
        o={interpolate(
          t,
          [CIK_LEAD + v * 0.65, CIK_LEAD + v * 0.75],
          [0, 1],
          clamp,
        )}
        size={96}
      />
    </>
  );
};

const FermentV: React.FC<{ scene: CikScene }> = ({ scene }) => {
  const t = useSec();
  const lang = useLang();
  const v = scene.vsec;
  const k = interpolate(t, [0.6, v * 0.75], [0, 1], clamp);
  const leaves = interpolate(t, [0.1, 1.0], [0, 1], { ...clamp, easing: ease });
  const day = Math.max(1, Math.min(7, Math.ceil(k * 7)));
  const beanColor = interpolateColors(k, [0, 1], ["#d8c2b0", "#6b3a22"]);
  return (
    <>
      <Svg>
        <rect
          x={190}
          y={900}
          width={700}
          height={360}
          rx={16}
          fill="url(#wood)"
        />
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={190}
            x2={890}
            y1={990 + i * 90}
            y2={990 + i * 90}
            stroke="#3c2312"
            strokeWidth={6}
          />
        ))}
        {new Array(36).fill(0).map((_, i) => (
          <Bean
            key={i}
            x={240 + (i % 12) * 55 + (Math.floor(i / 12) % 2) * 25}
            y={890 - Math.floor(i / 12) * 34}
            s={0.75}
            color={beanColor}
            rot={(random(`fr${i}`) - 0.5) * 70}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <ellipse
            key={i}
            cx={interpolate(leaves, [0, 1], [-400 + i * 900, 310 + i * 230])}
            cy={810 - (i % 2) * 20}
            rx={250}
            ry={70}
            fill={i % 2 ? "#3d7a36" : "#2f6a2c"}
            transform={`rotate(${-8 + i * 8} ${310 + i * 230} 810)`}
            opacity={0.92}
          />
        ))}
        {/* warm steam */}
        {[0, 1, 2, 3].map((i) => {
          const p = (t * 0.35 + i * 0.25) % 1;
          return (
            <circle
              key={i}
              cx={330 + i * 140 + Math.sin(t + i) * 20}
              cy={760 - p * 260}
              r={30 + p * 40}
              fill="#fff"
              opacity={(1 - p) * 0.12 * k}
            />
          );
        })}
      </Svg>
      <Label
        x={CX}
        y={1330}
        text={`${L(lang, "DAY", "GÜN")} ${day} / 7`}
        o={1}
        size={84}
      />
    </>
  );
};

const RoastV: React.FC<{ scene: CikScene }> = ({ scene }) => {
  const t = useSec();
  const lang = useLang();
  const v = scene.vsec;
  const p1 = interpolate(
    t,
    [0, 0.4, CIK_LEAD + v * 0.25, CIK_LEAD + v * 0.32],
    [0, 1, 1, 0],
    clamp,
  );
  const p2 = interpolate(
    t,
    [
      CIK_LEAD + v * 0.28,
      CIK_LEAD + v * 0.34,
      CIK_LEAD + v * 0.5,
      CIK_LEAD + v * 0.56,
    ],
    [0, 1, 1, 0],
    clamp,
  );
  const p3 = interpolate(
    t,
    [CIK_LEAD + v * 0.52, CIK_LEAD + v * 0.58],
    [0, 1],
    clamp,
  );
  const level = interpolate(
    t,
    [CIK_LEAD + v * 0.62, CIK_LEAD + v * 0.98],
    [0, 1],
    { ...clamp, easing: ease },
  );
  return (
    <>
      <Svg>
        {/* 1: sun drying */}
        <g opacity={p1}>
          <circle cx={780} cy={700} r={110} fill="#ffcf5a" />
          {new Array(12).fill(0).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 + t * 0.4;
            return (
              <line
                key={i}
                x1={780 + Math.cos(a) * 140}
                y1={700 + Math.sin(a) * 140}
                x2={780 + Math.cos(a) * 190}
                y2={700 + Math.sin(a) * 190}
                stroke="#ffcf5a"
                strokeWidth={10}
                strokeLinecap="round"
              />
            );
          })}
          <rect
            x={150}
            y={1120}
            width={780}
            height={40}
            rx={10}
            fill="#b98a55"
          />
          {new Array(14).fill(0).map((_, i) => (
            <Bean
              key={i}
              x={200 + i * 52}
              y={1095}
              s={0.6}
              color="#7a4428"
              rot={90 + (random(`sr${i}`) - 0.5) * 40}
            />
          ))}
        </g>
        {/* 2: roasting drum */}
        <g opacity={p2} transform={`translate(${CX} 1000)`}>
          <circle r={260} fill="#2b2b2b" stroke="#777" strokeWidth={14} />
          <g transform={`rotate(${t * 140})`}>
            {new Array(18).fill(0).map((_, i) => (
              <Bean
                key={i}
                x={Math.cos(i * 2.1) * (60 + (i % 4) * 45)}
                y={Math.sin(i * 2.1) * (60 + (i % 4) * 45)}
                s={0.8}
                color="#4a2716"
                rot={i * 40}
              />
            ))}
          </g>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${-120 + i * 120},300 q20,40 0,80 q-20,40 0,80`}
              stroke="#ff8a3d"
              strokeWidth={14}
              fill="none"
              opacity={0.6 + 0.4 * Math.sin(t * 8 + i)}
            />
          ))}
        </g>
        {/* 3: nibs falling into a bowl, turning into liquid */}
        <g opacity={p3}>
          <path d="M210,1050 Q540,1420 870,1050 Z" fill="#d9d2c8" />
          <clipPath id="bowl">
            <path d="M210,1050 Q540,1420 870,1050 Z" />
          </clipPath>
          <rect
            x={200}
            y={1240 - 190 * level}
            width={680}
            height={400}
            fill={COCOA}
            clipPath="url(#bowl)"
          />
          {new Array(16).fill(0).map((_, i) => {
            const fall = ((t * 0.9 + random(`n${i}`)) % 1) * (1 - level * 0.6);
            const sides = 5;
            const r = 14 + random(`nr${i}`) * 10;
            const pts = new Array(sides).fill(0).map((__, j) => {
              const a = (j / sides) * Math.PI * 2 + i;
              const rr = r * (0.7 + 0.4 * random(`np${i}-${j}`));
              return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
            });
            return (
              <polygon
                key={i}
                points={pts.join(" ")}
                transform={`translate(${300 + random(`nx${i}`) * 480} ${650 + fall * 480})`}
                fill="#5a2f1a"
              />
            );
          })}
        </g>
      </Svg>
      <Label
        x={CX}
        y={1330}
        text={
          p3 > 0.5
            ? L(lang, "COCOA MASS", "KAKAO HAMURU")
            : p2 > 0.5
              ? L(lang, "ROAST", "KAVURMA")
              : L(lang, "SUN-DRY", "GÜNEŞTE KURUTMA")
        }
        o={1}
        size={72}
      />
    </>
  );
};

const ConcheV: React.FC<{ scene: CikScene }> = ({ scene }) => {
  const t = useSec();
  const lang = useLang();
  const v = scene.vsec;
  const roller = Math.sin(t * 2.2) * 230;
  const badge = interpolate(
    t,
    [CIK_LEAD + v * 0.55, CIK_LEAD + v * 0.65],
    [0, 1],
    clamp,
  );
  const hours = Math.floor(interpolate(t, [0.5, v], [1, 72], clamp));
  return (
    <>
      <Svg>
        <rect x={120} y={860} width={840} height={420} rx={60} fill="#8c8c8c" />
        <rect x={150} y={890} width={780} height={360} rx={44} fill={COCOA} />
        <path
          d={`M150,${1000 + Math.sin(t * 3) * 10} Q${CX + roller},${940 + Math.cos(t * 2.2) * 25} 930,${1000 - Math.sin(t * 3) * 10} L930,1250 L150,1250 Z`}
          fill="#5b301b"
        />
        <g transform={`translate(${CX + roller} 1040)`}>
          <circle r={95} fill="#b9b9b9" stroke="#6e6e6e" strokeWidth={10} />
          <g transform={`rotate(${t * -300})`}>
            {[0, 60, 120].map((a) => (
              <line
                key={a}
                x1={-80}
                x2={80}
                y1={0}
                y2={0}
                transform={`rotate(${a})`}
                stroke="#6e6e6e"
                strokeWidth={8}
              />
            ))}
          </g>
        </g>
        {new Array(8).fill(0).map((_, i) => {
          const fall = interpolate(
            t,
            [0.3 + i * 0.25, 1.2 + i * 0.25],
            [0, 1],
            clamp,
          );
          return (
            <rect
              key={i}
              x={260 + i * 75}
              y={560 + fall * 380}
              width={34}
              height={34}
              rx={5}
              fill="#fffaf2"
              opacity={1 - fall * 0.9}
              transform={`rotate(${i * 20} ${277 + i * 75} ${577 + fall * 380})`}
            />
          );
        })}
      </Svg>
      <Label
        x={CX}
        y={1330}
        text={`${hours} ${L(lang, "h", "saat")}`}
        o={1}
        size={80}
      />
      <Label
        x={CX}
        y={720}
        text="1879 · Rodolphe Lindt"
        o={badge}
        size={60}
        color={CREAM}
      />
    </>
  );
};

const TemperV: React.FC<{ scene: CikScene }> = ({ scene }) => {
  const t = useSec();
  const lang = useLang();
  const v = scene.vsec;
  const draw = interpolate(t, [0.3, CIK_LEAD + v * 0.45], [0, 1], clamp);
  const bar = interpolate(
    t,
    [CIK_LEAD + v * 0.45, CIK_LEAD + v * 0.55],
    [0, 1],
    clamp,
  );
  const snap = interpolate(
    t,
    [CIK_LEAD + v * 0.78, CIK_LEAD + v * 0.84],
    [0, 1],
    { ...clamp, easing: ease },
  );
  const shine = ((t * 0.6) % 1.6) - 0.3;
  // dark chocolate tempering curve: melt 45 °C -> cool 27 °C -> rewarm 31 °C
  const pts = [
    [0, 45],
    [0.35, 45],
    [0.65, 27],
    [1, 31],
  ];
  const gx = (x: number) => 180 + x * 720;
  const gy = (c: number) => 1060 - (c - 20) * 14;
  const path = pts
    .map((p, i) => `${i ? "L" : "M"}${gx(p[0])},${gy(p[1])}`)
    .join(" ");
  return (
    <>
      <Svg>
        <g opacity={1 - bar}>
          <line
            x1={170}
            x2={920}
            y1={1080}
            y2={1080}
            stroke={CREAM}
            strokeOpacity={0.4}
            strokeWidth={4}
          />
          <path
            d={path}
            stroke={ACCENT}
            strokeWidth={12}
            fill="none"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
          {pts.slice(1).map((p, i) => (
            <text
              key={i}
              x={gx(p[0])}
              y={gy(p[1]) - 30}
              textAnchor="middle"
              fill={CREAM}
              fontSize={46}
              fontWeight={900}
              fontFamily={fontFamily}
              opacity={draw > p[0] - 0.05 ? 1 : 0}
            >
              {p[1]}°C
            </text>
          ))}
        </g>
        <g opacity={bar}>
          {[-1, 1].map((side) => (
            <g
              key={side}
              transform={`translate(${CX + side * snap * 70} 1000) rotate(${side * snap * 14})`}
            >
              <clipPath id={`half${side}`}>
                <rect
                  x={side < 0 ? -330 : 0}
                  y={-200}
                  width={330}
                  height={400}
                />
              </clipPath>
              <g clipPath={`url(#half${side})`}>
                <rect
                  x={-300}
                  y={-170}
                  width={600}
                  height={340}
                  rx={22}
                  fill="url(#bar)"
                />
                {new Array(8).fill(0).map((_, i) => (
                  <rect
                    key={i}
                    x={-280 + (i % 4) * 142}
                    y={-150 + Math.floor(i / 4) * 160}
                    width={122}
                    height={140}
                    rx={10}
                    fill="none"
                    stroke="#7b4a2e"
                    strokeWidth={6}
                  />
                ))}
                <rect
                  x={-300 + shine * 600}
                  y={-170}
                  width={70}
                  height={340}
                  fill="#fff"
                  opacity={0.18}
                  transform={`skewX(-20)`}
                />
              </g>
            </g>
          ))}
        </g>
      </Svg>
      <Label
        x={CX}
        y={1330}
        text={L(lang, "SNAP!", "ÇIT!")}
        o={snap}
        size={120}
      />
      <Label
        x={CX}
        y={760}
        text={L(lang, "GLOSSY", "PARLAK")}
        o={interpolate(bar, [0.6, 1], [0, 1], clamp) * (1 - snap)}
        size={64}
        color={CREAM}
      />
    </>
  );
};

const LoopV: React.FC = () => {
  const t = useSec();
  return (
    <Svg>
      <Trunk />
      <Pod x={470} y={900} rot={Math.sin(t * 1.6) * 5} />
    </Svg>
  );
};

// ---------- shell ----------

const Title: React.FC<{ scene: CikScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const lang = useLang();
  return (
    <div
      style={{
        position: "absolute",
        top: 290,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity: s,
        transform: `translateY(${(1 - s) * -30}px)`,
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 900,
          color: "white",
          lineHeight: 1.05,
          textShadow: "0 4px 24px rgba(0,0,0,0.7)",
        }}
      >
        {lang === "tr"
          ? scene.title.toLocaleUpperCase("tr-TR")
          : scene.title.toUpperCase()}
      </div>
      {scene.tag && (
        <div
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "6px 24px",
            border: `5px solid ${FACT}`,
            borderRadius: 12,
            color: FACT,
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: 5,
            transform: `rotate(-4deg) scale(${interpolate(spring({ frame: frame - 0.8 * fps, fps, config: { damping: 9, stiffness: 200 } }), [0, 1], [2, 1])})`,
            background: "rgba(20,10,5,0.45)",
          }}
        >
          {scene.tag}
        </div>
      )}
    </div>
  );
};

const VISUAL: Record<CikScene["id"], React.FC<{ scene: CikScene }>> = {
  hook: HookV,
  tree: TreeV,
  ferment: FermentV,
  roast: RoastV,
  conche: ConcheV,
  temper: TemperV,
  loop: LoopV,
};

const ScenePage: React.FC<{ scene: CikScene; dir: string }> = ({
  scene,
  dir,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = scene.sec * fps;
  const V = VISUAL[scene.id];
  const fade =
    scene.id === "hook" || scene.id === "loop"
      ? 1
      : interpolate(frame, [0, 8, frames - 8, frames], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fade }}>
        <V scene={scene} />
        <Title scene={scene} />
      </AbsoluteFill>
      <Sequence from={Math.round(CIK_LEAD * fps)} layout="none">
        <Audio src={staticFile(`${dir}/${scene.id}.wav`)} />
        <WordCaptions
          text={scene.text}
          durationInFrames={Math.round(scene.vsec * fps)}
          top={1470}
          locale={useLang() === "tr" ? "tr-TR" : "en-US"}
          highlight={ACCENT}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const CikolataShort: React.FC<{ lang: Lang }> = ({ lang }) => {
  const { fps } = useVideoConfig();
  const story = lang === "tr" ? CIK_TR : CIK_EN;
  return (
    <LangCtx.Provider value={lang}>
      <AbsoluteFill style={{ fontFamily, backgroundColor: "#170c06" }}>
        <Bg />
        <Series>
          {story.map((scene) => (
            <Series.Sequence
              key={scene.id}
              durationInFrames={Math.round(scene.sec * fps)}
              premountFor={fps}
            >
              <ScenePage scene={scene} dir={`cikolata/${lang}`} />
            </Series.Sequence>
          ))}
        </Series>
        <Audio src={staticFile("cikolata/bed.m4a")} volume={0.3} />
      </AbsoluteFill>
    </LangCtx.Provider>
  );
};

export const CikolataEN: React.FC = () => <CikolataShort lang="en" />;
export const CikolataTR: React.FC = () => <CikolataShort lang="tr" />;
