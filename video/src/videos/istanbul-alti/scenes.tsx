// Illustrated underground scenes, 1920x1080 SVG. Warm torchlight on dark stone.
import React, { useId } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useAltiLang } from "./lang";
import type { AltiSceneId } from "./story";

const W = 1920;
const H = 1080;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const PAL = {
  night: "#0f1424",
  night2: "#1d2540",
  stone: "#3b332c",
  stoneDark: "#241f1b",
  stoneLight: "#5a4e43",
  earth: "#2b231d",
  torch: "#ffb35c",
  water: "#2c5f63",
  waterHi: "#5fa7a3",
  cream: "#f4e6cf",
};

const useSec = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const prog = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], clamp);

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    width="100%"
    height="100%"
    style={{ position: "absolute", inset: 0 }}
  >
    {children}
  </svg>
);

const Grad: React.FC<{
  stops: [number, string][];
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  dir?: "v" | "h";
}> = ({ stops, x = 0, y = 0, w = W, h = H, dir = "v" }) => {
  const id = useId();
  return (
    <>
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2={dir === "h" ? 1 : 0}
          y2={dir === "v" ? 1 : 0}
        >
          {stops.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
    </>
  );
};

const Glow: React.FC<{
  cx: number;
  cy: number;
  r: number;
  color?: string;
  o?: number;
}> = ({ cx, cy, r, color = PAL.torch, o = 0.5 }) => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={o} />
          <stop offset="0.5" stopColor={color} stopOpacity={o * 0.3} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
    </>
  );
};

/** Flickering torch on a wall bracket. */
const Torch: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => {
  const f = useCurrentFrame();
  const fl = 0.85 + 0.15 * Math.sin(f / 2.3 + x) * Math.sin(f / 3.7 + y);
  return (
    <g>
      <Glow cx={x} cy={y - 20 * s} r={260 * s * fl} o={0.45} />
      <rect x={x - 6 * s} y={y} width={12 * s} height={60 * s} fill="#2a1d14" />
      <path
        d={`M ${x - 18 * s} ${y} L ${x + 18 * s} ${y} L ${x + 10 * s} ${y + 14 * s} L ${x - 10 * s} ${y + 14 * s} Z`}
        fill="#4a3424"
      />
      <path
        d={`M ${x} ${y - 46 * s * fl} C ${x + 18 * s} ${y - 20 * s} ${x + 14 * s} ${y} ${x} ${y} C ${x - 14 * s} ${y} ${x - 18 * s} ${y - 20 * s} ${x} ${y - 46 * s * fl} Z`}
        fill="#ffcf6a"
      />
      <path
        d={`M ${x} ${y - 26 * s * fl} C ${x + 8 * s} ${y - 12 * s} ${x + 6 * s} ${y} ${x} ${y} C ${x - 6 * s} ${y} ${x - 8 * s} ${y - 12 * s} ${x} ${y - 26 * s * fl} Z`}
        fill="#fff1c4"
      />
    </g>
  );
};

/** Floating dust motes in the light. */
const Dust: React.FC<{ n?: number; seed: string }> = ({ n = 40, seed }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const x =
          (random(`${seed}x${i}`) * W +
            f * (0.2 + random(`${seed}v${i}`) * 0.4)) %
          W;
        const y = (random(`${seed}y${i}`) * H + Math.sin(f / 40 + i) * 20) % H;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1 + random(`${seed}r${i}`) * 2}
            fill="#ffe6bd"
            opacity={0.15 + 0.25 * random(`${seed}o${i}`)}
          />
        );
      })}
    </g>
  );
};

/** Water drops falling + ripples. */
const Drips: React.FC<{ xs: number[]; top: number; bottom: number }> = ({
  xs,
  top,
  bottom,
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      {xs.map((x, i) => {
        const P = 50 + i * 13;
        const t = ((f + i * 17) % P) / P;
        const fall = Math.min(1, t / 0.5);
        const ring = Math.max(0, (t - 0.5) / 0.5);
        return (
          <g key={i}>
            {t < 0.5 && (
              <ellipse
                cx={x}
                cy={top + (bottom - top) * fall * fall}
                rx={3}
                ry={6}
                fill="#bfe3e0"
                opacity={0.8}
              />
            )}
            {t >= 0.5 && (
              <ellipse
                cx={x}
                cy={bottom}
                rx={6 + ring * 70}
                ry={2 + ring * 12}
                fill="none"
                stroke="#bfe3e0"
                strokeWidth={2}
                opacity={(1 - ring) * 0.6}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

const Skyline: React.FC<{ y: number; color?: string; lights?: boolean }> = ({
  y,
  color = "#0a0d18",
  lights = true,
}) => (
  <g>
    {/* generic old-city silhouette: houses, domes, minarets (stylised, no exact landmark copy) */}
    <path
      d={`M 0 ${y} L 0 ${y - 90} L 120 ${y - 90} L 120 ${y - 130} L 220 ${y - 130} L 220 ${y - 80} L 330 ${y - 80} L 330 ${y - 150} L 360 ${y - 150} L 360 ${y} Z`}
      fill={color}
    />
    {[
      [560, 230, 120],
      [1180, 200, 110],
    ].map(([cx, r, h], i) => (
      <g key={i} fill={color}>
        <rect x={cx - r} y={y - h} width={r * 2} height={h} />
        <path
          d={`M ${cx - r * 0.75} ${y - h} A ${r * 0.75} ${r * 0.62} 0 0 1 ${cx + r * 0.75} ${y - h} Z`}
        />
        <rect x={cx - 6} y={y - h - r * 0.62 - 40} width={12} height={40} />
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <rect
              x={cx + sd * (r + 60) - 9}
              y={y - h - 230}
              width={18}
              height={h + 230}
            />
            <path
              d={`M ${cx + sd * (r + 60) - 12} ${y - h - 230} L ${cx + sd * (r + 60)} ${y - h - 300} L ${cx + sd * (r + 60) + 12} ${y - h - 230} Z`}
            />
          </g>
        ))}
      </g>
    ))}
    <path
      d={`M 1480 ${y} L 1480 ${y - 70} L 1600 ${y - 70} L 1600 ${y - 120} L 1720 ${y - 120} L 1720 ${y - 60} L 1920 ${y - 60} L 1920 ${y} Z`}
      fill={color}
    />
    {lights &&
      new Array(40)
        .fill(0)
        .map((_, i) => (
          <rect
            key={i}
            x={random(`sl${i}`) * W}
            y={y - 20 - random(`sly${i}`) * 90}
            width={4}
            height={6}
            fill="#ffcf8a"
            opacity={0.6}
          />
        ))}
  </g>
);

const Stars: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      {new Array(90).fill(0).map((_, i) => (
        <circle
          key={i}
          cx={random(`st${i}`) * W}
          cy={random(`sty${i}`) * 500}
          r={1 + random(`str${i}`) * 1.6}
          fill="white"
          opacity={0.3 + 0.5 * (0.5 + 0.5 * Math.sin(f / 15 + i))}
        />
      ))}
    </g>
  );
};

/** Strata of rock under the surface line. */
const Strata: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <Grad
      y={y}
      h={H - y + 1400}
      stops={[
        [0, "#3a2f27"],
        [0.3, "#2b231d"],
        [1, "#16120f"],
      ]}
    />
    {new Array(14).fill(0).map((_, i) => {
      const yy = y + 40 + i * 95;
      let d = `M 0 ${yy}`;
      for (let x = 0; x <= W; x += 120)
        d += ` L ${x} ${yy + Math.sin(x / 300 + i) * 14}`;
      return (
        <path
          key={i}
          d={d}
          stroke="#4a3d32"
          strokeWidth={3}
          fill="none"
          opacity={0.5}
        />
      );
    })}
    {new Array(60).fill(0).map((_, i) => (
      <ellipse
        key={i}
        cx={random(`rk${i}`) * W}
        cy={y + 60 + random(`rky${i}`) * 1300}
        rx={8 + random(`rkr${i}`) * 26}
        ry={5 + random(`rkr${i}`) * 14}
        fill="#453a30"
        opacity={0.6}
      />
    ))}
  </g>
);

/* ---------------- scenes ---------------- */

const Intro: React.FC = () => {
  const t = useSec();
  const down = interpolate(t, [3.5, 9.5], [0, 620], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });
  const glow = prog(t, 6, 9);
  return (
    <Svg>
      <g transform={`translate(0 ${-down})`}>
        <Grad
          stops={[
            [0, "#070a14"],
            [0.6, PAL.night2],
            [1, "#3b3354"],
          ]}
          h={760}
        />
        <Stars />
        <circle cx={1550} cy={170} r={60} fill="#f4e6cf" opacity={0.9} />
        <Skyline y={760} />
        <Strata y={760} />
        {/* glowing tunnel network revealed underground */}
        <g opacity={glow}>
          {[
            "M 200 1100 C 500 1050 700 1250 960 1180 S 1500 1100 1800 1250",
            "M 560 900 L 560 1180",
            "M 1180 900 L 1180 1200 C 1180 1350 900 1400 700 1450",
            "M 960 1180 C 980 1350 1300 1380 1600 1500",
            "M 300 1400 C 600 1500 900 1350 1200 1520",
          ].map((d, i) => (
            <g key={i}>
              <path
                d={d}
                stroke={PAL.torch}
                strokeWidth={16}
                fill="none"
                opacity={0.18}
              />
              <path
                d={d}
                stroke="#ffd79a"
                strokeWidth={4}
                fill="none"
                strokeDasharray="14 10"
              />
            </g>
          ))}
          {[
            [560, 1180],
            [1180, 1200],
            [960, 1180],
            [700, 1450],
            [1600, 1500],
          ].map(([x, y], i) => (
            <g key={i}>
              <Glow cx={x} cy={y} r={70} o={0.7} />
              <circle cx={x} cy={y} r={9} fill="#fff1c4" />
            </g>
          ))}
        </g>
      </g>
    </Svg>
  );
};

const Cistern: React.FC = () => {
  const t = useSec();
  const cam = interpolate(t, [0, 14], [1.0, 1.12], clamp);
  const horizon = 520;
  const rows = 7;
  const cols: React.ReactNode[] = [];
  for (let r = rows - 1; r >= 0; r--) {
    const z = 1 / (1 + r * 0.55);
    const colW = 70 * z;
    const top = horizon - 360 * z;
    const bot = horizon + 300 * z;
    const spacing = 330 * z;
    for (let c = -5; c <= 5; c++) {
      const x = W / 2 + c * spacing;
      if (x < -100 || x > W + 100) continue;
      const shade = 0.35 + 0.6 * z;
      cols.push(
        <g key={`${r}${c}`} opacity={shade}>
          <rect
            x={x - colW / 2}
            y={top}
            width={colW}
            height={bot - top}
            fill={PAL.stoneLight}
          />
          <rect
            x={x - colW / 2}
            y={top}
            width={colW * 0.35}
            height={bot - top}
            fill="#6f6152"
            opacity={0.6}
          />
          <rect
            x={x - colW * 0.8}
            y={top - 18 * z}
            width={colW * 1.6}
            height={22 * z}
            fill="#6b5d4f"
          />
          {/* arches */}
          {c < 5 && (
            <path
              d={`M ${x} ${top - 10 * z} Q ${x + spacing / 2} ${top - 120 * z} ${x + spacing} ${top - 10 * z}`}
              stroke="#4c4137"
              strokeWidth={22 * z}
              fill="none"
            />
          )}
          {/* reflection */}
          <rect
            x={x - colW / 2}
            y={bot}
            width={colW}
            height={(bot - top) * 0.5}
            fill={PAL.waterHi}
            opacity={0.18}
          />
          {r < 3 && Math.abs(c) < 4 && (
            <Glow cx={x} cy={bot - 6} r={110 * z} o={0.55} />
          )}
        </g>,
      );
    }
  }
  return (
    <Svg>
      <g
        transform={`translate(${W / 2} ${horizon}) scale(${cam}) translate(${-W / 2} ${-horizon})`}
      >
        <rect width={W} height={H} fill="#0e0c0b" />
        <Grad
          y={horizon}
          h={H - horizon}
          stops={[
            [0, "#173538"],
            [1, "#0b1a1c"],
          ]}
        />
        {cols}
        {new Array(8).fill(0).map((_, i) => {
          const y = horizon + 40 + i * 70;
          return (
            <path
              key={i}
              d={`M 0 ${y} Q ${W / 2} ${y + 12} ${W} ${y}`}
              stroke={PAL.waterHi}
              strokeWidth={1.5}
              opacity={0.15}
              fill="none"
            />
          );
        })}
        <Drips xs={[420, 900, 1330, 1620]} top={150} bottom={870} />
      </g>
      <Dust seed="cis" />
    </Svg>
  );
};

/** Stylised historic peninsula (not a precise map). */
const PENINSULA =
  "M 260 620 C 300 520 420 470 560 450 C 700 430 820 380 980 360 C 1120 345 1260 330 1380 370 C 1480 400 1560 470 1600 560 C 1630 640 1590 720 1500 760 C 1380 810 1220 800 1060 820 C 880 845 700 870 540 860 C 400 850 300 790 270 720 Z";

const MapScene: React.FC = () => {
  const t = useSec();
  const shown = Math.floor(interpolate(t, [0.5, 6.5], [0, 110], clamp));
  const count = Math.round(interpolate(t, [6.6, 8.2], [1001, 224], clamp));
  return (
    <Svg>
      <rect width={W} height={H} fill="#0d1622" />
      <Grad
        stops={[
          [0, "#13273a"],
          [1, "#0b1520"],
        ]}
      />
      <path d={PENINSULA} fill="#2b2620" stroke="#c9a46a" strokeWidth={4} />
      <text x={1650} y={300} fill="#5f7f99" fontSize={34} fontStyle="italic">
        Golden Horn
      </text>
      <text x={700} y={980} fill="#5f7f99" fontSize={34} fontStyle="italic">
        Sea of Marmara
      </text>
      {new Array(110).fill(0).map((_, i) => {
        if (i >= shown) return null;
        const x = 380 + random(`cx${i}`) * 1150;
        const y = 440 + random(`cy${i}`) * 380;
        return (
          <g key={i}>
            <Glow cx={x} cy={y} r={30} o={0.5} />
            <circle cx={x} cy={y} r={5} fill="#ffd79a" />
          </g>
        );
      })}
      <g opacity={prog(t, 6.2, 6.6)} transform="translate(400 330)">
        <rect
          x={-210}
          y={-90}
          width={420}
          height={150}
          rx={24}
          fill="#11161f"
          opacity={0.9}
          stroke="#c9a46a"
          strokeWidth={3}
        />
        <text
          x={0}
          y={-35}
          textAnchor="middle"
          fontSize={30}
          fill="#c9a46a"
          fontWeight={800}
          letterSpacing={3}
        >
          BINBIRDIREK
        </text>
        <text
          x={0}
          y={40}
          textAnchor="middle"
          fontSize={78}
          fill="#fff1c4"
          fontWeight={900}
        >
          {count}
          <tspan fontSize={36} fill="#c9a46a">
            {" "}
            columns
          </tspan>
        </text>
      </g>
    </Svg>
  );
};

const Hagia: React.FC = () => {
  const lang = useAltiLang();
  const t = useSec();
  const ground = 470;
  const robot = interpolate(t, [1, 6], [ground - 40, ground + 360], clamp);
  const tunnels = prog(t, 6, 11);
  const room = prog(t, 4.5, 6);
  return (
    <Svg>
      <Grad
        stops={[
          [0, "#0a0d18"],
          [1, "#27304f"],
        ]}
        h={ground}
      />
      <Stars />
      {/* stylised great domed building (cross-section feel) */}
      <g fill="#0a0d18">
        <rect x={560} y={ground - 170} width={800} height={170} />
        <path
          d={`M 700 ${ground - 170} A 260 220 0 0 1 1220 ${ground - 170} Z`}
        />
        <rect x={954} y={ground - 430} width={12} height={50} />
        {[480, 1440].map((x) => (
          <g key={x}>
            <rect x={x - 10} y={ground - 420} width={20} height={420} />
            <path
              d={`M ${x - 13} ${ground - 420} L ${x} ${ground - 500} L ${x + 13} ${ground - 420} Z`}
            />
          </g>
        ))}
      </g>
      <Strata y={ground} />
      {/* wells */}
      {[760, 960, 1160].map((x, i) => (
        <g key={x}>
          <rect
            x={x - 22}
            y={ground}
            width={44}
            height={330 + i * 20}
            fill="#120f0d"
          />
          <rect
            x={x - 22}
            y={ground + 260 + i * 20}
            width={44}
            height={70}
            fill={PAL.water}
            opacity={0.8}
          />
        </g>
      ))}
      {/* robot camera on a cable */}
      <line
        x1={960}
        y1={ground - 60}
        x2={960}
        y2={robot}
        stroke="#c9c2b4"
        strokeWidth={3}
      />
      <g transform={`translate(960 ${robot})`}>
        <path d="M 0 20 L -140 300 L 140 300 Z" fill="#fff1c4" opacity={0.12} />
        <rect x={-22} y={-14} width={44} height={34} rx={8} fill="#c9a46a" />
        <circle cx={0} cy={22} r={10} fill="#fff1c4" />
        <circle
          cx={14}
          cy={-6}
          r={4}
          fill={Math.floor(t * 3) % 2 ? "#ff4b3a" : "#5a1a14"}
        />
      </g>
      {/* tunnels + hidden room */}
      <g opacity={tunnels}>
        {[
          `M 760 ${ground + 300} L 300 ${ground + 300} L 120 ${ground + 380}`,
          `M 1160 ${ground + 340} L 1600 ${ground + 340} L 1820 ${ground + 260}`,
          `M 960 ${ground + 330} L 960 ${ground + 470} L 1300 ${ground + 470}`,
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#0d0b0a"
            strokeWidth={46}
            fill="none"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${tunnels} 1`}
          />
        ))}
      </g>
      <g opacity={room}>
        <rect
          x={1240}
          y={ground + 420}
          width={170}
          height={110}
          rx={10}
          fill="#0d0b0a"
          stroke="#c9a46a"
          strokeWidth={4}
          strokeDasharray="12 8"
        />
        <text
          x={1325}
          y={ground + 405}
          textAnchor="middle"
          fontSize={28}
          fill="#c9a46a"
          fontWeight={800}
        >
          {lang === "tr" ? "? oda" : "? room"}
        </text>
      </g>
      <Dust seed="hag" n={25} />
    </Svg>
  );
};

const LegendMap: React.FC = () => {
  const lang = useAltiLang();
  const t = useSec();
  const line = prog(t, 0.6, 5);
  const truth = prog(t, 6.5, 8);
  const hs: [number, number] = [1300, 520];
  const tk: [number, number] = [1420, 440];
  const isl: [number, number] = [1650, 850];
  return (
    <Svg>
      <Grad
        stops={[
          [0, "#13273a"],
          [1, "#0b1520"],
        ]}
      />
      <path d={PENINSULA} fill="#2b2620" stroke="#c9a46a" strokeWidth={4} />
      {/* islands */}
      {[
        [1600, 850, 40],
        [1700, 880, 30],
        [1780, 835, 26],
      ].map(([x, y, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={r * 1.6}
          ry={r}
          fill="#2b2620"
          stroke="#c9a46a"
          strokeWidth={3}
        />
      ))}
      <text
        x={1700}
        y={790}
        textAnchor="middle"
        fill="#5f7f99"
        fontSize={28}
        fontStyle="italic"
      >
        {lang === "tr" ? "Adalar" : "Princes' Islands"}
      </text>
      {/* legend path */}
      <path
        d={`M ${hs[0]} ${hs[1]} L ${tk[0]} ${tk[1]} M ${hs[0]} ${hs[1]} C 1380 700 1500 860 ${isl[0]} ${isl[1]}`}
        stroke="#ff7a5c"
        strokeWidth={6}
        fill="none"
        strokeDasharray="18 14"
        pathLength={1}
        style={{ strokeDasharray: `${line * 1.0} 1` }}
        opacity={1 - truth * 0.7}
      />
      {/* real short channels around the building */}
      <g opacity={truth}>
        {[
          "M 1300 520 l -60 20 l -30 40",
          "M 1300 520 l 50 30 l 20 40",
          "M 1300 520 l 10 -50",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#7be0a6"
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <Glow cx={1300} cy={520} r={120} color="#7be0a6" o={0.4} />
      </g>
      {[hs, tk].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={14} fill="#fff1c4" />
          <text
            x={x + 24}
            y={y + 10}
            fill="#fff1c4"
            fontSize={30}
            fontWeight={800}
          >
            {i === 0
              ? lang === "tr"
                ? "Ayasofya"
                : "Hagia Sophia"
              : "Topkapı"}
          </text>
        </g>
      ))}
      <g opacity={prog(t, 9, 10)} transform="translate(1470 760) rotate(-8)">
        <text textAnchor="middle" fontSize={92} fontWeight={900} fill="#ff7a5c">
          9 km?
        </text>
      </g>
    </Svg>
  );
};

const Bazaar: React.FC = () => {
  const t = useSec();
  const open = prog(t, 2, 5);
  const floor = 860;
  return (
    <Svg>
      <rect width={W} height={H} fill="#1a1410" />
      {/* vaulted arcade */}
      {new Array(5).fill(0).map((_, i) => {
        const x = i * 480 - 240;
        return (
          <g key={i}>
            <path
              d={`M ${x} ${floor} L ${x} 360 Q ${x + 240} 120 ${x + 480} 360 L ${x + 480} ${floor}`}
              fill="#2e241c"
              stroke="#5a4636"
              strokeWidth={14}
            />
            {new Array(9).fill(0).map((__, k) => (
              <path
                key={k}
                d={`M ${x + 30 + k * 8} 360 Q ${x + 240} ${150 + k * 6} ${x + 450 - k * 8} 360`}
                stroke={k % 2 ? "#7a2f22" : "#e2d2b6"}
                strokeWidth={6}
                fill="none"
                opacity={0.5}
              />
            ))}
            <Glow cx={x + 240} cy={300} r={160} o={0.35} />
            <path d={`M ${x + 225} 300 h 30 l -6 30 h -18 Z`} fill="#c9a46a" />
          </g>
        );
      })}
      <rect y={floor} width={W} height={H - floor} fill="#3a2d22" />
      {/* the shop with the secret door */}
      <g transform="translate(760 0)">
        <rect
          x={0}
          y={480}
          width={400}
          height={floor - 480}
          fill="#4a3627"
          stroke="#2a1d14"
          strokeWidth={8}
        />
        {new Array(4).fill(0).map((_, i) => (
          <rect
            key={i}
            x={20 + i * 95}
            y={500}
            width={70}
            height={110}
            fill={["#a0412d", "#c9a46a", "#3b6f6a", "#7a2f22"][i]}
            opacity={0.8}
          />
        ))}
        {/* trapdoor opening to stairs */}
        <rect x={110} y={700} width={180} height={150} fill="#0a0806" />
        {new Array(5).fill(0).map((_, i) => (
          <rect
            key={i}
            x={120 + i * 8}
            y={720 + i * 26}
            width={160 - i * 16}
            height={10}
            fill="#2a2018"
            opacity={open}
          />
        ))}
        <Glow cx={200} cy={830} r={120} o={0.5 * open} />
        <g
          transform={`translate(110 700) skewY(${-open * 12}) scale(${1 - open * 0.7} 1)`}
        >
          <rect
            width={180}
            height={150}
            fill="#5a3f2b"
            stroke="#2a1d14"
            strokeWidth={6}
          />
          <circle cx={150} cy={75} r={8} fill="#c9a46a" />
        </g>
      </g>
      {/* Çemberlitaş column (banded) on the right */}
      <g transform="translate(1600 0)">
        <rect x={-40} y={180} width={80} height={floor - 180} fill="#6a5a4a" />
        {new Array(7).fill(0).map((_, i) => (
          <rect
            key={i}
            x={-46}
            y={240 + i * 85}
            width={92}
            height={12}
            fill="#3a2f26"
          />
        ))}
      </g>
      <Dust seed="baz" />
    </Svg>
  );
};

const Galata: React.FC = () => {
  const t = useSec();
  const ground = 560;
  const cam = interpolate(t, [0, 6], [0, 330], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });
  const glint = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <Svg>
      <g transform={`translate(0 ${-cam})`}>
        <Grad
          stops={[
            [0, "#070a14"],
            [1, "#2a3354"],
          ]}
          h={ground}
        />
        <Stars />
        {/* round stone tower with conical roof */}
        <g>
          <rect
            x={860}
            y={ground - 420}
            width={200}
            height={420}
            fill="#141a2c"
          />
          {new Array(5).fill(0).map((_, i) => (
            <rect
              key={i}
              x={900 + (i % 2) * 70}
              y={ground - 380 + i * 70}
              width={22}
              height={34}
              rx={11}
              fill="#ffcf8a"
              opacity={0.7}
            />
          ))}
          <rect
            x={845}
            y={ground - 450}
            width={230}
            height={34}
            fill="#141a2c"
          />
          <path
            d={`M 860 ${ground - 450} L 960 ${ground - 600} L 1060 ${ground - 450} Z`}
            fill="#141a2c"
          />
          <Skyline y={ground} color="#0e1220" />
        </g>
        <Strata y={ground} />
        {/* tunnels + dungeon beneath the tower */}
        <rect x={900} y={ground} width={120} height={180} fill="#0b0908" />
        <path
          d={`M 960 ${ground + 180} L 960 ${ground + 300} L 1500 ${ground + 300} M 960 ${ground + 300} L 420 ${ground + 300}`}
          stroke="#0b0908"
          strokeWidth={70}
          fill="none"
        />
        <rect
          x={1380}
          y={ground + 230}
          width={260}
          height={150}
          fill="#0b0908"
        />
        {new Array(6).fill(0).map((_, i) => (
          <rect
            key={i}
            x={1400 + i * 40}
            y={ground + 240}
            width={8}
            height={130}
            fill="#3a332c"
          />
        ))}
        <Torch x={600} y={ground + 260} s={0.8} />
        {/* skull + coins */}
        <g transform={`translate(760 ${ground + 318})`}>
          <ellipse cx={0} cy={0} rx={26} ry={22} fill="#d9cdb4" />
          <rect x={-14} y={14} width={28} height={14} rx={4} fill="#d9cdb4" />
          <circle cx={-9} cy={-2} r={6} fill="#1a1410" />
          <circle cx={9} cy={-2} r={6} fill="#1a1410" />
        </g>
        {[1180, 1210, 1240].map((x, i) => (
          <g key={x}>
            <ellipse
              cx={x}
              cy={ground + 326 - i * 4}
              rx={16}
              ry={6}
              fill="#c9a46a"
            />
            <circle
              cx={x + 6}
              cy={ground + 322 - i * 4}
              r={3}
              fill="#fff1c4"
              opacity={glint}
            />
          </g>
        ))}
      </g>
      <Dust seed="gal" n={20} />
    </Svg>
  );
};

const Anemas: React.FC = () => {
  const t = useSec();
  const gate = prog(t, 1, 4);
  const floor = 900;
  return (
    <Svg>
      <rect width={W} height={H} fill="#141110" />
      {/* massive wall with arches */}
      {new Array(4).fill(0).map((_, i) => {
        const x = 100 + i * 460;
        return (
          <g key={i}>
            <path
              d={`M ${x} ${floor} L ${x} 380 Q ${x + 180} 150 ${x + 360} 380 L ${x + 360} ${floor}`}
              fill="#0a0807"
              stroke="#4a3f35"
              strokeWidth={28}
            />
            {new Array(8).fill(0).map((__, k) => (
              <rect
                key={k}
                x={x - 50}
                y={200 + k * 90}
                width={40}
                height={14}
                fill="#3a322b"
              />
            ))}
          </g>
        );
      })}
      {/* iron gate in the 2nd arch */}
      <g transform={`translate(560 0)`}>
        <g transform={`translate(0 ${-gate * 420})`}>
          {new Array(7).fill(0).map((_, i) => (
            <rect
              key={i}
              x={20 + i * 50}
              y={380}
              width={10}
              height={floor - 380}
              fill="#2a2724"
            />
          ))}
          {[460, 640, 820].map((y) => (
            <rect key={y} x={10} y={y} width={340} height={10} fill="#2a2724" />
          ))}
        </g>
        <Glow cx={180} cy={700} r={260} o={0.35 * gate} />
      </g>
      <rect y={floor} width={W} height={H - floor} fill="#221c18" />
      <Torch x={460} y={520} />
      <Torch x={1380} y={520} />
      {/* chains */}
      {[1100, 1180].map((x) => (
        <g key={x}>
          {new Array(9).fill(0).map((_, i) => (
            <ellipse
              key={i}
              cx={x + Math.sin(t * 1.2 + i * 0.3) * (i * 0.8)}
              cy={420 + i * 26}
              rx={8}
              ry={13}
              fill="none"
              stroke="#5a5550"
              strokeWidth={4}
            />
          ))}
        </g>
      ))}
      <Dust seed="ane" />
    </Svg>
  );
};

const Yenikapi: React.FC = () => {
  const lang = useAltiLang();
  const t = useSec();
  const cam = interpolate(t, [0, 12], [0, 400], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });
  const g = 260;
  return (
    <Svg>
      <g transform={`translate(0 ${-cam})`}>
        <Grad
          stops={[
            [0, "#0a0d18"],
            [1, "#27304f"],
          ]}
          h={g}
        />
        <Skyline y={g} lights={false} />
        {/* layers */}
        <Grad
          y={g}
          h={260}
          stops={[
            [0, "#4a3d32"],
            [1, "#3a2f27"],
          ]}
        />
        <Grad
          y={g + 260}
          h={420}
          stops={[
            [0, "#2e3b3a"],
            [1, "#22302f"],
          ]}
        />
        <Grad
          y={g + 680}
          h={700}
          stops={[
            [0, "#2b231d"],
            [1, "#16120f"],
          ]}
        />
        {/* metro tunnel */}
        <rect x={0} y={g + 90} width={W} height={110} fill="#0f0d0c" />
        <rect x={0} y={g + 186} width={W} height={6} fill="#6b6b6b" />
        <g transform={`translate(${((t * 140) % 2600) - 700} ${g + 112})`}>
          <rect width={560} height={70} rx={20} fill="#c9d3e3" />
          {new Array(6).fill(0).map((_, i) => (
            <rect
              key={i}
              x={30 + i * 86}
              y={14}
              width={60}
              height={26}
              rx={4}
              fill="#ffe7a8"
            />
          ))}
        </g>
        {/* harbor layer with shipwrecks */}
        {[
          [360, 1, 1.0],
          [900, -1, 0.85],
          [1450, 1, 1.1],
        ].map(([x, d, s], i) => (
          <g
            key={i}
            transform={`translate(${x} ${g + 450}) scale(${(d as number) * (s as number)} ${s})`}
          >
            <path d="M -200 0 Q 0 120 200 0 Z" fill="#6b4a2e" />
            {new Array(9).fill(0).map((_, k) => (
              <line
                key={k}
                x1={-180 + k * 45}
                y1={6}
                x2={-150 + k * 38}
                y2={70 - Math.abs(k - 4) * 10}
                stroke="#3e2a1a"
                strokeWidth={8}
              />
            ))}
            <line
              x1={-10}
              y1={0}
              x2={40}
              y2={-140}
              stroke="#3e2a1a"
              strokeWidth={10}
            />
          </g>
        ))}
        <text
          x={W / 2}
          y={g + 610}
          textAnchor="middle"
          fontSize={30}
          fill="#9fb8b6"
          letterSpacing={4}
        >
          {lang === "tr"
            ? "THEODOSIUS LİMANI · 4.–11. yy"
            : "THEODOSIAN HARBOR · 4th–11th c."}
        </text>
        {/* neolithic footprints */}
        {new Array(8).fill(0).map((_, i) => {
          const x = 560 + i * 110;
          const y = g + 900 + (i % 2) * 40;
          const show = prog(t, 8 + i * 0.25, 8.6 + i * 0.25);
          return (
            <g
              key={i}
              opacity={show}
              transform={`translate(${x} ${y}) rotate(${-10 + (i % 2) * 20})`}
            >
              <path
                d="M -4 40 C -18 40 -20 20 -16 4 C -14 -10 -24 -22 -22 -38 C -20 -52 4 -54 18 -44 C 26 -36 24 -20 16 -6 C 10 8 14 40 -4 40 Z"
                fill="#0e0b09"
              />
              {[
                [-18, -58, 7],
                [-6, -62, 6],
                [5, -60, 5],
                [14, -55, 4.5],
                [21, -48, 4],
              ].map(([cx, cy, r], k) => (
                <circle key={k} cx={cx} cy={cy} r={r} fill="#0e0b09" />
              ))}
            </g>
          );
        })}
        <text
          x={W / 2}
          y={g + 810}
          textAnchor="middle"
          fontSize={30}
          fill="#c9a46a"
          letterSpacing={4}
          opacity={prog(t, 9, 10)}
        >
          {lang === "tr"
            ? "NEOLİTİK · ~8.500 YIL ÖNCE"
            : "NEOLITHIC · ~8,500 YEARS AGO"}
        </text>
      </g>
    </Svg>
  );
};

const Truth: React.FC = () => {
  const lang = useAltiLang();
  const t = useSec();
  const up = interpolate(t, [3, 11], [900, 0], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });
  const layers = [
    [lang === "tr" ? "BUGÜN" : "TODAY", "#3a3f55"],
    [lang === "tr" ? "OSMANLI" : "OTTOMAN", "#4a3d32"],
    [lang === "tr" ? "BİZANS" : "BYZANTINE", "#3e3229"],
    [lang === "tr" ? "ROMA" : "ROMAN", "#33291f"],
    [lang === "tr" ? "NEOLİTİK" : "NEOLITHIC", "#221a14"],
  ];
  return (
    <Svg>
      <g transform={`translate(0 ${-up})`}>
        <Grad
          stops={[
            [0, "#070a14"],
            [1, "#2a3354"],
          ]}
          h={420}
        />
        <Stars />
        <Skyline y={420} />
        {layers.map(([name, c], i) => (
          <g key={name}>
            <rect y={420 + i * 300} width={W} height={300} fill={c} />
            <text
              x={80}
              y={420 + i * 300 + 80}
              fontSize={36}
              fill="#c9a46a"
              letterSpacing={6}
              fontWeight={800}
            >
              {name}
            </text>
            {new Array(4).fill(0).map((_, k) => (
              <Glow
                key={k}
                cx={400 + k * 420 + (i % 2) * 120}
                cy={420 + i * 300 + 170}
                r={60}
                o={0.35}
              />
            ))}
          </g>
        ))}
      </g>
      <Dust seed="tru" n={25} />
    </Svg>
  );
};

const Outro: React.FC = () => (
  <Svg>
    <Grad
      stops={[
        [0, "#14112b"],
        [1, "#2a2350"],
      ]}
    />
    <Stars />
  </Svg>
);

export const ALTI_SCENES: Record<AltiSceneId, React.FC> = {
  intro: Intro,
  cistern: Cistern,
  map: MapScene,
  hagia: Hagia,
  legend: LegendMap,
  bazaar: Bazaar,
  galata: Galata,
  anemas: Anemas,
  yenikapi: Yenikapi,
  truth: Truth,
  outro: Outro,
};
