// Scenes for the sling explainer. 1080x1920 SVG space; main action between y≈480 and y≈1420
// (title above, captions below — see yt-video 9:16 zone plan).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "../eksi-100-hikaye/Character";
import {
  Canvas,
  clamp,
  Glow,
  Gradient,
  useT,
  VW,
} from "../eksi-100-hikaye/kit";
import type { SlingSceneId } from "./story";

const GROUND = 1330;
const SLING = "#ff8a1f";
const SLING_DARK = "#c25a00";
const CHAIN = "#9aa3b2";
const OK = "#3ccf6e";
const WARN = "#ffb020";
const BAD = "#ff4b3a";

/* ---------- shared drawing ---------- */

const Site: React.FC = () => (
  <>
    <Gradient
      stops={[
        [0, "#5f86bd"],
        [0.45, "#a9c2df"],
        [0.62, "#f1d2a6"],
        [0.7, "#e9b884"],
      ]}
    />
    {/* distant steel frames */}
    <g fill="#7d8aa3" opacity={0.55}>
      {[80, 260, 760, 930].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={900 - i * 30}
            width={14}
            height={GROUND - 900 + i * 30}
          />
          <rect
            x={x + 120}
            y={900 - i * 30}
            width={14}
            height={GROUND - 900 + i * 30}
          />
          <rect x={x} y={900 - i * 30} width={134} height={12} />
          <rect x={x} y={1050 - i * 15} width={134} height={10} />
        </g>
      ))}
    </g>
    <Gradient
      stops={[
        [0, "#9aa0aa"],
        [1, "#6b717c"],
      ]}
      y={GROUND}
      h={1920 - GROUND}
    />
    <rect x={0} y={GROUND} width={VW} height={8} fill="#5b616b" />
    {/* hazard stripe at the ground edge */}
    {new Array(14).fill(0).map((_, i) => (
      <path
        key={i}
        d={`M ${i * 80} ${GROUND + 8} l 40 0 l -20 26 l -40 0 Z`}
        fill="#ffc61a"
        opacity={0.85}
      />
    ))}
  </>
);

/** Crane hook hanging from the top of the frame. (x, y) = bottom of the hook's bowl. */
const Hook: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <line
      x1={x - 10}
      y1={-20}
      x2={x - 10}
      y2={y - 150}
      stroke="#2a2f3a"
      strokeWidth={5}
    />
    <line
      x1={x + 10}
      y1={-20}
      x2={x + 10}
      y2={y - 150}
      stroke="#2a2f3a"
      strokeWidth={5}
    />
    <rect
      x={x - 46}
      y={y - 160}
      width={92}
      height={70}
      rx={10}
      fill="#ffc61a"
      stroke="#1d212b"
      strokeWidth={5}
    />
    <circle cx={x} cy={y - 125} r={14} fill="#1d212b" />
    <rect x={x - 8} y={y - 92} width={16} height={26} fill="#3a404d" />
    <path
      d={`M ${x} ${y - 66} C ${x - 40} ${y - 60} ${x - 44} ${y + 6} ${x} ${y + 6} C ${x + 36} ${y + 6} ${x + 40} ${y - 30} ${x + 18} ${y - 40}`}
      stroke="#3a404d"
      strokeWidth={16}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

/** A sling segment that draws itself on. progress 0..1 */
const Band: React.FC<{
  d: string;
  p: number;
  color?: string;
  width?: number;
  dashed?: boolean;
}> = ({ d, p, color = SLING, width = 22, dashed = false }) => (
  <g>
    <path
      d={d}
      stroke={color === CHAIN ? "#5d6575" : SLING_DARK}
      strokeWidth={width + 6}
      fill="none"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={dashed ? "0.03 0.02" : `${p} 1`}
    />
    <path
      d={d}
      stroke={color}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={dashed ? "0.03 0.02" : `${p} 1`}
    />
  </g>
);

const Badge: React.FC<{
  x: number;
  y: number;
  label: string;
  value: string;
  color: string;
  delay: number;
}> = ({ x, y, label, value, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 11, stiffness: 170 },
  });
  if (s <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect
        x={-170}
        y={-72}
        width={340}
        height={144}
        rx={30}
        fill="#11161f"
        opacity={0.9}
      />
      <rect
        x={-170}
        y={-72}
        width={340}
        height={144}
        rx={30}
        fill="none"
        stroke={color}
        strokeWidth={6}
      />
      <text
        x={0}
        y={-22}
        textAnchor="middle"
        fontSize={30}
        fontWeight={800}
        fill="#c9d3e3"
        letterSpacing={2}
      >
        {label}
      </text>
      <text
        x={0}
        y={46}
        textAnchor="middle"
        fontSize={68}
        fontWeight={900}
        fill={color}
      >
        {value}
      </text>
    </g>
  );
};

const Crate: React.FC<{ x: number; y: number; w: number; h: number }> = ({
  x,
  y,
  w,
  h,
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      fill="#b77a45"
      stroke="#6e4422"
      strokeWidth={6}
    />
    <path
      d={`M ${x} ${y} L ${x + w} ${y + h} M ${x + w} ${y} L ${x} ${y + h}`}
      stroke="#8a5a32"
      strokeWidth={10}
    />
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      fill="none"
      stroke="#6e4422"
      strokeWidth={14}
    />
  </g>
);

const Pipe: React.FC<{
  cx: number;
  cy: number;
  len: number;
  r: number;
  color?: string;
}> = ({ cx, cy, len, r, color = "#7f8ea3" }) => (
  <g>
    <rect x={cx - len / 2} y={cy - r} width={len} height={r * 2} fill={color} />
    <rect
      x={cx - len / 2}
      y={cy - r * 0.55}
      width={len}
      height={r * 0.35}
      fill="#c7d2e0"
      opacity={0.6}
    />
    <ellipse cx={cx + len / 2} cy={cy} rx={r * 0.35} ry={r} fill="#5d6a7c" />
    <ellipse
      cx={cx + len / 2}
      cy={cy}
      rx={r * 0.2}
      ry={r * 0.6}
      fill="#2a313d"
    />
    <ellipse cx={cx - len / 2} cy={cy} rx={r * 0.35} ry={r} fill={color} />
  </g>
);

const Worker: React.FC<{
  pose?: "stand" | "reach";
  mood?: "neutral" | "relieved" | "worried" | "shocked";
}> = ({ pose = "reach", mood = "relieved" }) => (
  <Character
    x={170}
    y={1440}
    scale={0.82}
    outfit="worker"
    pose={pose}
    mood={mood}
  />
);

/** Raise everything (hook + sling + load) after rigging. */
const useLift = (from: number, to: number, px = 110) => useT(from, to) * px;

/* ---------- scenes ---------- */

const Giris: React.FC = () => {
  const drop = useT(0, 1.6);
  const hookY = interpolate(drop, [0, 1], [380, 760]);
  return (
    <Canvas>
      <Site />
      <Hook x={600} y={hookY} />
      <Crate x={450} y={1070} w={300} h={250} />
      <Glow cx={600} cy={1190} r={300} color="#ffd38a" opacity={0.25} />
      <Character
        x={170}
        y={1440}
        scale={0.82}
        outfit="worker"
        pose="stand"
        mood="neutral"
      />
    </Canvas>
  );
};

const Dikey: React.FC = () => {
  const rig = useT(0.3, 1.4);
  const lift = useLift(2.6, 4.4);
  const hookY = 640 - lift;
  return (
    <Canvas>
      <Site />
      <g transform={`translate(0 ${-lift})`}>
        <Crate x={450} y={1060} w={300} h={250} />
        <circle
          cx={600}
          cy={1040}
          r={22}
          fill="none"
          stroke="#3a404d"
          strokeWidth={10}
        />
      </g>
      <Hook x={600} y={hookY} />
      <Band d={`M 600 ${hookY - 10} L 600 ${1022 - lift}`} p={rig} />
      <Badge
        x={850}
        y={820}
        label="KAPASİTE"
        value="%100"
        color={OK}
        delay={1.5}
      />
      <Worker />
    </Canvas>
  );
};

const Bogma: React.FC = () => {
  const wrap = useT(0.3, 1.2);
  const leg = useT(1.1, 1.9);
  const lift = useLift(3.2, 5);
  const hookY = 620 - lift;
  const cy = 1200 - lift;
  return (
    <Canvas>
      <Site />
      {/* band behind the pipe */}
      <Band
        d={`M 586 ${cy - 60} L 586 ${cy + 64}`}
        p={wrap}
        color={SLING_DARK}
      />
      <Pipe cx={600} cy={cy} len={640} r={62} />
      {/* band wrapped in front, through its own eye (choke point) */}
      <Band d={`M 614 ${cy + 64} Q 650 ${cy} 612 ${cy - 74}`} p={wrap} />
      <ellipse
        cx={606}
        cy={cy - 82}
        rx={30}
        ry={18}
        fill="none"
        stroke={SLING}
        strokeWidth={12}
        opacity={wrap}
      />
      <Hook x={600} y={hookY} />
      <Band d={`M 600 ${hookY - 10} L 606 ${cy - 96}`} p={leg} />
      {/* choke point marker */}
      <g opacity={useT(2, 2.4)}>
        <circle
          cx={606}
          cy={cy - 82}
          r={46}
          fill="none"
          stroke={WARN}
          strokeWidth={5}
          strokeDasharray="10 8"
        />
        <text
          x={680}
          y={cy - 120}
          fontSize={34}
          fontWeight={800}
          fill="#1d212b"
        >
          boğma noktası
        </text>
      </g>
      <Badge
        x={850}
        y={800}
        label="KAPASİTE"
        value="~%75–80"
        color={WARN}
        delay={2.3}
      />
      <Worker />
    </Canvas>
  );
};

const Sepet: React.FC = () => {
  const rig = useT(0.3, 1.6);
  const lift = useLift(3.4, 5.2);
  const hookY = 600 - lift;
  const cy = 1180 - lift;
  const r = 120;
  return (
    <Canvas>
      <Site />
      {/* drum seen end-on */}
      <circle
        cx={600}
        cy={cy}
        r={r}
        fill="#4d78b5"
        stroke="#23406b"
        strokeWidth={8}
      />
      <circle
        cx={600}
        cy={cy}
        r={r * 0.62}
        fill="none"
        stroke="#7fa6dc"
        strokeWidth={6}
      />
      <Hook x={600} y={hookY} />
      {/* basket: up one side, under the load, up the other side */}
      <Band
        d={`M 586 ${hookY - 4} L ${600 - r - 8} ${cy} A ${r + 8} ${r + 8} 0 0 0 ${600 + r + 8} ${cy} L 614 ${hookY - 4}`}
        p={rig}
      />
      <g opacity={useT(2, 2.5)} fontSize={40} fontWeight={900}>
        <text x={600 - r - 110} y={cy - 150} fill="#1d212b">
          ×1
        </text>
        <text x={600 + r + 30} y={cy - 150} fill="#1d212b">
          ×1
        </text>
      </g>
      <Badge
        x={860}
        y={690}
        label="KOLLAR DİKSE"
        value="%200"
        color={OK}
        delay={2.4}
      />
      <Worker />
    </Canvas>
  );
};

const CiftSarim: React.FC = () => {
  const w1 = useT(0.3, 1.0);
  const w2 = useT(0.9, 1.6);
  const leg = useT(1.5, 2.2);
  const lift = useLift(3.4, 5);
  const hookY = 620 - lift;
  const cy = 1210 - lift;
  return (
    <Canvas>
      <Site />
      {/* two wraps behind */}
      <Band
        d={`M 566 ${cy - 100} L 566 ${cy + 100}`}
        p={w1}
        color={SLING_DARK}
      />
      <Band
        d={`M 616 ${cy - 100} L 616 ${cy + 100}`}
        p={w2}
        color={SLING_DARK}
      />
      {/* pipe bundle */}
      <Pipe cx={600} cy={cy - 52} len={620} r={46} color="#8b96a8" />
      <Pipe cx={560} cy={cy + 40} len={620} r={46} color="#7f8ea3" />
      <Pipe cx={640} cy={cy + 40} len={620} r={46} color="#74839a" />
      {/* two wraps in front */}
      <Band d={`M 566 ${cy + 100} Q 540 ${cy} 590 ${cy - 108}`} p={w1} />
      <Band d={`M 616 ${cy + 100} Q 590 ${cy} 600 ${cy - 108}`} p={w2} />
      <Hook x={600} y={hookY} />
      <Band d={`M 600 ${hookY - 10} L 596 ${cy - 112}`} p={leg} />
      <g opacity={useT(2.2, 2.6)}>
        <text
          x={760}
          y={cy - 150}
          fontSize={40}
          fontWeight={900}
          fill="#1d212b"
        >
          2 TUR
        </text>
        <path
          d={`M 750 ${cy - 140} Q 700 ${cy - 130} 640 ${cy - 80}`}
          stroke="#1d212b"
          strokeWidth={5}
          fill="none"
        />
      </g>
      <Badge
        x={850}
        y={800}
        label="SONUÇ"
        value="KAYMAZ"
        color={OK}
        delay={2.4}
      />
      <Worker />
    </Canvas>
  );
};

const CokKollu: React.FC = () => {
  const rig = useT(0.3, 1.6);
  const show = useT(2.2, 2.8);
  const lift = useLift(4.2, 6);
  const hookY = 560 - lift;
  const top = 1080 - lift;
  // container top corners (slight perspective)
  const c = {
    fl: [330, top + 40],
    fr: [870, top + 40],
    bl: [400, top - 30],
    br: [940, top - 30],
  } as const;
  const ml = [600, hookY + 60];
  const leg = (to: readonly [number, number], loaded: boolean, k: string) => (
    <g key={k}>
      <Band
        d={`M ${ml[0]} ${ml[1]} L ${to[0]} ${to[1]}`}
        p={rig}
        color={show > 0.5 && loaded ? SLING : CHAIN}
        width={14}
        dashed={show > 0.5 && !loaded}
      />
    </g>
  );
  return (
    <Canvas>
      <Site />
      {/* container */}
      <path
        d={`M ${c.bl[0]} ${c.bl[1]} L ${c.br[0]} ${c.br[1]} L ${c.fr[0]} ${c.fr[1]} L ${c.fl[0]} ${c.fl[1]} Z`}
        fill="#3f8f6a"
      />
      <rect
        x={c.fl[0]}
        y={c.fl[1]}
        width={c.fr[0] - c.fl[0]}
        height={200}
        fill="#2f7656"
      />
      <path
        d={`M ${c.fr[0]} ${c.fr[1]} L ${c.br[0]} ${c.br[1]} L ${c.br[0]} ${c.br[1] + 200} L ${c.fr[0]} ${c.fr[1] + 200} Z`}
        fill="#245c43"
      />
      {new Array(9).fill(0).map((_, i) => (
        <line
          key={i}
          x1={c.fl[0] + 30 + i * 58}
          y1={c.fl[1] + 15}
          x2={c.fl[0] + 30 + i * 58}
          y2={c.fl[1] + 185}
          stroke="#25654a"
          strokeWidth={8}
        />
      ))}
      {leg(c.bl, false, "bl")}
      {leg(c.br, true, "br")}
      {leg(c.fl, true, "fl")}
      {leg(c.fr, false, "fr")}
      <Hook x={600} y={hookY} />
      <circle
        cx={ml[0]}
        cy={ml[1]}
        r={24}
        fill="none"
        stroke="#5d6575"
        strokeWidth={12}
      />
      <g opacity={show} fontSize={30} fontWeight={800}>
        <text x={330} y={top - 170} fill={SLING_DARK}>
          yükü taşır
        </text>
        <text x={830} y={top - 120} fill="#4a5262">
          dengeler
        </text>
      </g>
      <Badge
        x={850}
        y={760}
        label="HESAPTA"
        value="2 KOL"
        color={WARN}
        delay={2.6}
      />
      <Worker />
    </Canvas>
  );
};

const Aci: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // 60° → 45° → 30° → 22° (forbidden)
  const theta = interpolate(t, [0, 2.8, 3.6, 5.4, 6.0], [60, 60, 30, 30, 22], {
    ...clamp,
  });
  const rad = (theta * Math.PI) / 180;
  const d = 260;
  const attachY = 1160;
  const hookY = attachY - d * Math.tan(rad) - 10;
  const share = 0.5 / Math.sin(rad); // per-leg share of the load
  const pct = Math.round(share * 100);
  const color =
    theta < 29.5 ? BAD : theta <= 31 ? BAD : theta <= 46 ? WARN : OK;
  const forbidden = theta < 29.5;
  const arc = (x: number, dir: 1 | -1) => {
    const r = 90;
    const ex = x - dir * r * Math.cos(rad);
    const ey = attachY - r * Math.sin(rad);
    return `M ${x - dir * r} ${attachY} A ${r} ${r} 0 0 ${dir === 1 ? 1 : 0} ${ex} ${ey}`;
  };
  return (
    <Canvas>
      <Site />
      {/* I-beam */}
      <rect x={140} y={attachY} width={800} height={22} fill="#56606f" />
      <rect x={140} y={attachY + 22} width={800} height={70} fill="#6b7584" />
      <rect x={140} y={attachY + 92} width={800} height={22} fill="#56606f" />
      <Hook x={540} y={hookY} />
      <Band
        d={`M 530 ${hookY - 6} L ${540 - d} ${attachY}`}
        p={1}
        color={forbidden ? BAD : SLING}
      />
      <Band
        d={`M 550 ${hookY - 6} L ${540 + d} ${attachY}`}
        p={1}
        color={forbidden ? BAD : SLING}
      />
      {/* horizontal reference + angle arcs */}
      <line
        x1={540 - d - 160}
        y1={attachY}
        x2={540 + d + 160}
        y2={attachY}
        stroke="#1d212b"
        strokeWidth={3}
        strokeDasharray="12 10"
      />
      <path d={arc(540 - d, -1)} stroke={color} strokeWidth={8} fill="none" />
      <path d={arc(540 + d, 1)} stroke={color} strokeWidth={8} fill="none" />
      <text
        x={540 + d + 40}
        y={attachY - 40}
        fontSize={56}
        fontWeight={900}
        fill={color}
      >
        {Math.round(theta)}°
      </text>
      {/* per-leg share */}
      <g transform="translate(220 880)">
        <rect
          x={-150}
          y={-64}
          width={300}
          height={128}
          rx={26}
          fill="#11161f"
          opacity={0.9}
        />
        <text
          x={0}
          y={-18}
          textAnchor="middle"
          fontSize={28}
          fontWeight={800}
          fill="#c9d3e3"
        >
          HER KOL
        </text>
        <text
          x={0}
          y={44}
          textAnchor="middle"
          fontSize={64}
          fontWeight={900}
          fill={color}
        >
          %{pct}
        </text>
      </g>
      {forbidden && (
        <g transform="translate(540 640) rotate(-6)">
          <rect
            x={-300}
            y={-70}
            width={600}
            height={140}
            rx={18}
            fill="none"
            stroke={BAD}
            strokeWidth={12}
          />
          <text
            x={0}
            y={22}
            textAnchor="middle"
            fontSize={64}
            fontWeight={900}
            fill={BAD}
          >
            30°'NİN ALTI YOK!
          </text>
        </g>
      )}
    </Canvas>
  );
};

const Rule: React.FC<{
  y: number;
  ok: boolean;
  label: string;
  delay: number;
  children: React.ReactNode;
}> = ({ y, ok, label, delay, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 13, stiffness: 160 },
  });
  return (
    <g transform={`translate(0 ${y}) scale(1)`} opacity={Math.min(1, s * 1.2)}>
      <g transform={`translate(${(1 - s) * 80} 0)`}>
        <rect
          x={300}
          y={-120}
          width={720}
          height={240}
          rx={34}
          fill="#11161f"
          opacity={0.88}
        />
        <g transform="translate(470 0)">{children}</g>
        <circle cx={900} cy={-50} r={44} fill={ok ? OK : BAD} />
        <text
          x={900}
          y={-30}
          textAnchor="middle"
          fontSize={56}
          fontWeight={900}
          fill="white"
        >
          {ok ? "✓" : "✕"}
        </text>
        <text
          x={660}
          y={80}
          textAnchor="middle"
          fontSize={36}
          fontWeight={800}
          fill="white"
        >
          {label}
        </text>
      </g>
    </g>
  );
};

const Guvenlik: React.FC = () => (
  <Canvas>
    <Site />
    <rect x={0} y={0} width={VW} height={1920} fill="#0b1020" opacity={0.25} />
    <Rule y={640} ok label="Kenar koruyucu" delay={0.3}>
      <rect x={-90} y={-40} width={180} height={110} fill="#b77a45" />
      <path
        d="M -40 -110 L -40 -40 Q -40 -30 -30 -30"
        stroke={SLING}
        strokeWidth={22}
        fill="none"
      />
      <rect x={-62} y={-58} width={48} height={48} rx={10} fill="#2f6fd6" />
    </Rule>
    <Rule y={920} ok={false} label="Slinge düğüm" delay={1.6}>
      <path
        d="M -120 -40 C -40 -40 -40 60 20 20 C 80 -20 0 -80 -20 -10 C -40 60 60 40 120 40"
        stroke={SLING}
        strokeWidth={20}
        fill="none"
      />
    </Rule>
    <Rule y={1200} ok={false} label="Yükün altında durmak" delay={2.9}>
      <rect x={-70} y={-110} width={140} height={70} fill="#b77a45" />
      <line x1={0} y1={-140} x2={0} y2={-110} stroke={SLING} strokeWidth={10} />
      <circle cx={0} cy={0} r={18} fill="white" />
      <line x1={0} y1={18} x2={0} y2={70} stroke="white" strokeWidth={8} />
    </Rule>
    <Character
      x={150}
      y={1450}
      scale={0.8}
      outfit="worker"
      pose="reach"
      mood="neutral"
    />
  </Canvas>
);

export const SLING_SCENES: Record<SlingSceneId, React.FC> = {
  giris: Giris,
  dikey: Dikey,
  bogma: Bogma,
  sepet: Sepet,
  ciftSarim: CiftSarim,
  cokKollu: CokKollu,
  aci: Aci,
  guvenlik: Guvenlik,
};
