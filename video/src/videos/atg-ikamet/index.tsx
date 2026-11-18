// ATG Mali Müşavirlik — "Yatırımla İkamet İzni" explainer (1080x1920, Turkish dialogue).
// Source: Resmî Gazete 18.11.2026 / 33434, Cumhurbaşkanı Kararı 11994 (user-provided pages).
// Style follows the user's reference Short: white info card on top, one 3D-cartoon character below.
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ATG_END, LINES, type Line, type Who } from "./timeline";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

const NAVY = "#1a3a6b";
const NAVY_D = "#13294d";
const GOLD = "#c9a24e";
const INK = "#1f2a3d";
const MUTED = "#6b7a99";
const RED = "#d9534f";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const up = (s: string) => s.toLocaleUpperCase("tr-TR");

const NAME: Record<Who, string> = {
  musavir: "Mali Müşavir",
  turk: "Türk Yatırımcı",
  yabanci: "Yabancı Yatırımcı",
};

// ---------- cards ----------

type CardId =
  | "intro"
  | "law"
  | "amount"
  | "options"
  | "hold"
  | "who"
  | "family"
  | "limits"
  | "notes";
const CARD_OF: Record<string, CardId> = {
  "01": "intro",
  "02": "intro",
  "03": "law",
  "04": "amount",
  "05": "amount",
  "06": "options",
  "07": "options",
  "08": "hold",
  "09": "hold",
  "10": "who",
  "11": "family",
  "12": "family",
  "13": "limits",
  "14": "limits",
  "15": "notes",
  "16": "notes",
};
const ICON: Record<CardId, string> = {
  intro: "📰",
  law: "⚖️",
  amount: "💵",
  options: "🏦",
  hold: "⏳",
  who: "🏛️",
  family: "👨‍👩‍👧",
  limits: "⚠️",
  notes: "📒",
};

const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = GOLD,
}) => (
  <div
    style={{
      fontSize: 30,
      fontWeight: 800,
      letterSpacing: 3,
      color,
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);
const Big: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 58, fontWeight: 900, color: INK, lineHeight: 1.12 }}>
    {children}
  </div>
);
const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: GOLD }}>{children}</span>
);
const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontSize: 34,
      fontWeight: 700,
      color: MUTED,
      marginTop: 16,
      lineHeight: 1.3,
    }}
  >
    {children}
  </div>
);

/** Rows appear one after another across the card's lifetime (k = 0..1). */
const Row: React.FC<{
  i: number;
  n: number;
  k: number;
  mark?: React.ReactNode;
  children: React.ReactNode;
}> = ({ i, n, k, mark, children }) => {
  const o = interpolate(
    k,
    [(i / n) * 0.7, (i / n) * 0.7 + 0.12],
    [0, 1],
    clamp,
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 18,
        marginTop: 16,
        opacity: o,
        transform: `translateX(${(1 - o) * 30}px)`,
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          width: 40,
          height: 40,
          borderRadius: 20,
          background: GOLD,
          color: "white",
          fontSize: 24,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        {mark ?? ""}
      </div>
      <div
        style={{ fontSize: 36, fontWeight: 700, color: INK, lineHeight: 1.25 }}
      >
        {children}
      </div>
    </div>
  );
};

const Tile: React.FC<{ amount: string; years: string; o: number }> = ({
  amount,
  years,
  o,
}) => (
  <div
    style={{
      flex: 1,
      borderRadius: 22,
      border: "2px solid #e3e8f2",
      borderTop: `10px solid ${GOLD}`,
      padding: "26px 10px",
      textAlign: "center",
      opacity: o,
      transform: `scale(${0.9 + 0.1 * o})`,
    }}
  >
    <div style={{ fontSize: 60, fontWeight: 900, color: NAVY }}>{amount}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: MUTED, marginTop: 4 }}>
      veya karşılığı döviz
    </div>
    <div style={{ fontSize: 34, fontWeight: 900, color: INK, marginTop: 14 }}>
      {years}
    </div>
  </div>
);

const CardBody: React.FC<{ id: CardId; k: number }> = ({ id, k }) => {
  switch (id) {
    case "intro":
      return (
        <>
          <Label>YENİ KARAR</Label>
          <Big>
            Yabancılara <Hi>yatırımla</Hi> ikamet izni
          </Big>
          <Sub>Resmî Gazete · 18 Kasım 2026</Sub>
        </>
      );
    case "law":
      return (
        <>
          <Label>RESMÎ GAZETE · SAYI 33434</Label>
          <Big>
            Cumhurbaşkanı Kararı <Hi>No: 11994</Hi>
          </Big>
          <Sub>
            6458 sayılı Yabancılar ve Uluslararası Koruma Kanunu, md. 31 ·
            Yayımı tarihinde yürürlükte
          </Sub>
        </>
      );
    case "amount":
      return (
        <>
          <Label>YATIRIM TUTARI → İKAMET SÜRESİ</Label>
          <div style={{ display: "flex", gap: 24, marginTop: 6 }}>
            <Tile
              amount="$150.000"
              years="3 YIL İKAMET"
              o={interpolate(k, [0.05, 0.2], [0, 1], clamp)}
            />
            <Tile
              amount="$200.000"
              years="5 YIL İKAMET"
              o={interpolate(k, [0.55, 0.7], [0, 1], clamp)}
            />
          </div>
        </>
      );
    case "options":
      return (
        <>
          <Label>YATIRIM SEÇENEKLERİ</Label>
          <Row i={0} n={4} k={k} mark="1">
            Türkiye&apos;deki bankalarda mevduat
          </Row>
          <Row i={1} n={4} k={k} mark="2">
            Devlet borçlanma araçları
          </Row>
          <Row i={2} n={4} k={k} mark="3">
            Gayrimenkul veya girişim sermayesi yatırım fonu katılma payı
          </Row>
          <Row i={3} n={4} k={k} mark="4">
            Bireysel emeklilik sistemi katkı payı
          </Row>
        </>
      );
    case "hold":
      return (
        <>
          <Label>ÖNEMLİ ŞART</Label>
          <Big>
            Yatırım, izin süresinin <Hi>yarısı</Hi> boyunca tutulmalı
          </Big>
          <div
            style={{
              display: "flex",
              gap: 18,
              marginTop: 22,
              opacity: interpolate(k, [0.45, 0.6], [0, 1], clamp),
            }}
          >
            {["3 yıl → 1,5 yıl", "5 yıl → 2,5 yıl"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "12px 24px",
                  borderRadius: 40,
                  background: "#f1f4fa",
                  border: `2px solid ${NAVY}`,
                  fontSize: 34,
                  fontWeight: 800,
                  color: NAVY,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </>
      );
    case "who":
      return (
        <>
          <Label>YATIRIMI TESPİT EDEN KURUM</Label>
          {[
            ["Mevduat", "BDDK"],
            ["Devlet borçlanma araçları", "Hazine ve Maliye Bak."],
            ["Fon katılma payı", "SPK"],
            ["Bireysel emeklilik", "SEDDK"],
          ].map(([a, b], i) => {
            const o = interpolate(
              k,
              [i * 0.18, i * 0.18 + 0.12],
              [0, 1],
              clamp,
            );
            return (
              <div
                key={a}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < 3 ? "2px solid #eef1f6" : undefined,
                  opacity: o,
                }}
              >
                <div style={{ fontSize: 34, fontWeight: 700, color: INK }}>
                  {a}
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: NAVY }}>
                  {b}
                </div>
              </div>
            );
          })}
        </>
      );
    case "family":
      return (
        <>
          <Label>AİLE</Label>
          <Big>
            Eş ve çocuklar da <Hi>kapsamda</Hi>
          </Big>
          <Sub>Yabancı eş · ergin olmayan veya bağımlı yabancı çocuklar</Sub>
        </>
      );
    case "limits":
      return (
        <>
          <Label color={RED}>DİKKAT</Label>
          <Row i={0} n={3} k={k} mark="✕">
            Çalışma izni yerine geçmez
          </Row>
          <Row i={1} n={3} k={k} mark="✕">
            Yatırım yoluyla vatandaşlık kapsamında değerlendirilmez
          </Row>
          <Row i={2} n={3} k={k} mark="i">
            Usul ve esaslar: İçişleri Bakanlığı
          </Row>
        </>
      );
    case "notes":
      return null; // rendered by NotesCard
  }
};

const NotesCard: React.FC<{ k: number }> = ({ k }) => {
  const items = [
    "150.000 $ → 3 yıl, 200.000 $ → 5 yıl ikamet",
    "Mevduat, devlet borçlanma araçları, fon payı veya BES",
    "Yatırım, izin süresinin yarısı boyunca tutulur",
    "Yabancı eş ve çocuklar da kapsamda",
    "Çalışma izni ve vatandaşlık sağlamaz",
  ];
  return (
    <div
      style={{
        background: "#ffd84d",
        borderRadius: 28,
        padding: "34px 40px 30px",
        boxShadow: "0 18px 40px rgba(26,58,107,0.18)",
        borderBottom: "10px solid #e8b923",
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 900,
          color: NAVY_D,
          borderBottom: `4px solid ${NAVY_D}`,
          paddingBottom: 12,
          marginBottom: 6,
        }}
      >
        ATG&apos;NİN NOTLARI
      </div>
      {items.map((t, i) => {
        const o = interpolate(k, [i * 0.12, i * 0.12 + 0.1], [0, 1], clamp);
        return (
          <div
            key={t}
            style={{
              display: "flex",
              gap: 18,
              alignItems: "flex-start",
              marginTop: 16,
              opacity: o,
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                width: 44,
                height: 44,
                borderRadius: 22,
                background: NAVY_D,
                color: "white",
                fontSize: 26,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: NAVY_D,
                lineHeight: 1.25,
              }}
            >
              {t}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** One card per run of lines with the same CardId; pops in, holds, fades out. */
const Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const runs: { id: CardId; from: number; to: number }[] = [];
  for (const l of LINES) {
    const id = CARD_OF[l.id];
    const last = runs[runs.length - 1];
    if (last && last.id === id) last.to = l.start + l.dur;
    else runs.push({ id, from: l.start, to: l.start + l.dur });
  }
  runs[runs.length - 1].to = ATG_END;
  return (
    <>
      {runs.map((r, i) => {
        const from = Math.round(r.from * fps) - 6;
        const to =
          i < runs.length - 1
            ? Math.round(runs[i + 1].from * fps) - 6
            : Math.round(ATG_END * fps);
        if (frame < from || frame >= to) return null;
        const s = spring({ frame: frame - from, fps, config: { damping: 15 } });
        const out = interpolate(frame, [to - 8, to], [1, 0], clamp);
        const k = interpolate(frame, [from, to - 10], [0, 1], clamp);
        return (
          <div
            key={r.id}
            style={{
              position: "absolute",
              left: 56,
              right: 56,
              top: 240,
              opacity: Math.min(s, out),
              transform: `translateY(${(1 - s) * 40}px) scale(${0.96 + 0.04 * s})`,
            }}
          >
            {r.id === "notes" ? (
              <NotesCard k={k} />
            ) : (
              <div
                style={{
                  background: "white",
                  borderRadius: 28,
                  padding: "36px 40px 38px 52px",
                  boxShadow: "0 18px 40px rgba(26,58,107,0.14)",
                  border: "2px solid #e6ebf3",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 12,
                    background: r.id === "limits" ? RED : NAVY,
                  }}
                />
                <CardBody id={r.id} k={k} />
              </div>
            )}
            <div
              style={{
                position: "absolute",
                right: -18,
                top: -34,
                width: 104,
                height: 104,
                borderRadius: 52,
                background: "white",
                border: `5px solid ${GOLD}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 52,
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              }}
            >
              {ICON[r.id]}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------- characters ----------

const SIDE: Record<Who, number> = { musavir: 1, turk: -1, yabanci: -1 };

const Speaker: React.FC<{ line: Line; fresh: boolean }> = ({ line, fresh }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = fresh ? spring({ frame, fps, config: { damping: 16 } }) : 1;
  const talking = t < line.dur;
  const bob =
    Math.sin(t * 2.2) * 5 + (talking ? Math.abs(Math.sin(t * 9)) * 6 : 0);
  const sway = Math.sin(t * 1.3) * 0.8 + (talking ? Math.sin(t * 6) * 0.6 : 0);
  const notes = CARD_OF[line.id] === "notes";
  const height = notes ? 820 : 1060;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -40,
          display: "flex",
          justifyContent: "center",
          transform: `translateX(${(1 - s) * 260 * SIDE[line.who]}px) translateY(${-bob}px) rotate(${sway}deg)`,
          opacity: s,
          transformOrigin: "50% 100%",
        }}
      >
        <Img
          src={staticFile(`atg-ikamet/char/${line.who}.png`)}
          style={{
            height,
            filter: "drop-shadow(0 24px 30px rgba(20,40,80,0.18))",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: notes ? 1080 : 820,
          [SIDE[line.who] > 0 ? "right" : "left"]: 70,
          padding: "12px 26px",
          borderRadius: 40,
          background: NAVY,
          color: "white",
          fontSize: 32,
          fontWeight: 800,
          opacity: interpolate(s, [0.5, 1], [0, 1], clamp),
          boxShadow: "0 8px 18px rgba(26,58,107,0.25)",
        }}
      >
        {up(NAME[line.who])}
      </div>
    </AbsoluteFill>
  );
};

/** Subtitle box: the line text in chunks of ~7 words, timed by word length. */
const Subtitle: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = line.text.split(/\s+/);
  const chunks: string[][] = [];
  let cur: string[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= 7 || /[.?!]$/.test(w)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  const weights = chunks.map((c) => c.join(" ").length + 4);
  const total = weights.reduce((a, b) => a + b, 0);
  const t = frame / fps / line.dur;
  let acc = 0;
  let idx = chunks.length - 1;
  for (let i = 0; i < chunks.length; i++) {
    acc += weights[i] / total;
    if (t < acc) {
      idx = i;
      break;
    }
  }
  if (frame / fps > line.dur + 0.3) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1480,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.94)",
          borderRadius: 22,
          padding: "16px 28px",
          fontSize: 40,
          fontWeight: 800,
          color: NAVY_D,
          textAlign: "center",
          lineHeight: 1.25,
          boxShadow: "0 10px 24px rgba(26,58,107,0.18)",
          border: `3px solid ${line.who === "musavir" ? GOLD : "#dfe5ef"}`,
        }}
      >
        {chunks[idx].join(" ")}
      </div>
    </div>
  );
};

// ---------- frame ----------

const Header: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 110,
      left: 56,
      right: 56,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div
      style={{ fontSize: 26, fontWeight: 800, color: MUTED, letterSpacing: 2 }}
    >
      YATIRIMLA İKAMET İZNİ · YENİ KARAR
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Img src={staticFile("atg-ikamet/logo.png")} style={{ height: 58 }} />
      <div
        style={{ fontSize: 26, fontWeight: 900, color: NAVY, lineHeight: 1 }}
      >
        ATG
      </div>
    </div>
  </div>
);

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill
      style={{
        background: `rgba(255,255,255,${0.96 * s})`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: s,
          transform: `scale(${0.9 + 0.1 * s})`,
        }}
      >
        <Img src={staticFile("atg-ikamet/logo.png")} style={{ height: 260 }} />
        <div
          style={{ fontSize: 66, fontWeight: 900, color: NAVY, marginTop: 30 }}
        >
          ATG MALİ MÜŞAVİRLİK
        </div>
        <div
          style={{ fontSize: 34, fontWeight: 700, color: MUTED, marginTop: 14 }}
        >
          Muhasebe • Vergi • Denetim • Danışmanlık
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 50,
            padding: "18px 40px",
            borderRadius: 50,
            background: NAVY,
            color: "white",
            fontSize: 42,
            fontWeight: 900,
          }}
        >
          www.atgmusavirlik.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AtgIkamet: React.FC = () => {
  const { fps } = useVideoConfig();
  const last = LINES[LINES.length - 1];
  return (
    <AbsoluteFill
      style={{
        fontFamily,
        background:
          "linear-gradient(180deg, #e9eef7 0%, #f7f9fc 40%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 12,
          background: `linear-gradient(90deg, ${NAVY}, ${GOLD})`,
        }}
      />
      <Header />
      {LINES.map((l, i) => {
        const from = Math.round(l.start * fps);
        const nextStart = i < LINES.length - 1 ? LINES[i + 1].start : ATG_END;
        const fresh = i === 0 || LINES[i - 1].who !== l.who;
        return (
          <Sequence
            key={l.id}
            from={from}
            durationInFrames={Math.round((nextStart - l.start) * fps)}
            premountFor={fps}
          >
            <Speaker line={l} fresh={fresh} />
            <Subtitle line={l} />
            <Audio
              src={staticFile(`atg-ikamet/ses/${l.id}.wav`)}
              volume={l.who === "yabanci" ? 0.9 : 1}
            />
          </Sequence>
        );
      })}
      <Cards />
      <Sequence from={Math.round((last.start + last.dur + 0.3) * fps)}>
        <Outro />
      </Sequence>
      <Audio src={staticFile("atg-ikamet/bed.m4a")} volume={0.1} />
    </AbsoluteFill>
  );
};
