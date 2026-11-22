// Big uppercase captions shown 2–3 words at a time with the active word highlighted.
// Timing is spread over the scene by word length (no voice-over timings needed).
// Turkish-safe uppercase (yt-video rule): toLocaleUpperCase("tr-TR"), never CSS text-transform.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export type Word = { text: string; start: number; end: number };

export const timeWords = (
  text: string,
  frames: number,
  fps: number,
): Word[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const startF = 0.3 * fps;
  const endF = frames - 0.4 * fps;
  const weights = words.map((w) => w.length + 3);
  const total = weights.reduce((a, b) => a + b, 0);
  let t = startF;
  return words.map((w, i) => {
    const d = ((endF - startF) * weights[i]) / total;
    const word = { text: w, start: t, end: t + d };
    t += d;
    return word;
  });
};

const chunk = (words: Word[]): Word[][] => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const len = cur.map((c) => c.text).join(" ").length;
    if (cur.length >= 3 || len > 16 || /[.,?!]$/.test(w.text)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
};

export const WordCaptions: React.FC<{
  text: string;
  durationInFrames: number;
  top?: number;
  highlight?: string;
  locale?: string; // "tr-TR" (default) or "en-US" — keeps I/İ correct per language
  fontSize?: number;
}> = ({
  text,
  durationInFrames,
  top = 1480,
  highlight = "#ffd23f",
  locale = "tr-TR",
  fontSize = 82,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = timeWords(text, durationInFrames, fps);
  const current = chunk(words).find(
    (c) => frame >= c[0].start && frame < c[c.length - 1].end + 2,
  );
  if (!current) return null;
  const pop = spring({
    frame: frame - current[0].start,
    fps,
    config: { damping: 12, stiffness: 220 },
  });
  return (
    <div
      lang="tr"
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top,
        textAlign: "center",
        fontSize,
        fontWeight: 900,
        lineHeight: 1.12,
        transform: `scale(${0.85 + 0.15 * pop})`,
      }}
    >
      {current.map((w, i) => {
        const active = frame >= w.start && frame < w.end;
        return (
          <span
            key={i}
            style={{
              color: active ? highlight : "white",
              WebkitTextStroke: "14px #0b1020",
              paintOrder: "stroke fill",
              marginRight: 22,
              display: "inline-block",
              textShadow: "0 8px 18px rgba(0,0,0,0.45)",
            }}
          >
            {w.text.toLocaleUpperCase(locale).replace(/T[ÜU]RK[Iİ]YE/g, "TÜRKİYE")}
          </span>
        );
      })}
    </div>
  );
};

/** Frame at which the first word starting with `keyword` appears (for syncing visuals to text). */
export const wordStartFrame = (
  text: string,
  keyword: string,
  durationInFrames: number,
  fps: number,
): number => {
  const k = keyword.toLocaleLowerCase("tr-TR");
  const w = timeWords(text, durationInFrames, fps).find((x) =>
    x.text.toLocaleLowerCase("tr-TR").startsWith(k),
  );
  if (!w) throw new Error(`keyword "${keyword}" not found in caption text`);
  return w.start;
};
