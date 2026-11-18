// English version of story_short.ts: Kokoro am_michael narration in public/istanbul-alti/en_short.
export const ALTI_SHORT_EN: {
  id: "intro" | "cistern" | "hagia" | "legend" | "yenikapi";
  sec: number;
  vsec: number;
}[] = [
  {
    id: "intro",
    sec: 5.3,
    vsec: 4.22,
  },
  {
    id: "cistern",
    sec: 10.5,
    vsec: 9.43,
  },
  {
    id: "hagia",
    sec: 12.6,
    vsec: 11.47,
  },
  {
    id: "legend",
    sec: 14.0,
    vsec: 12.9,
  },
  {
    id: "yenikapi",
    sec: 11.4,
    vsec: 10.28,
  },
];

export const ALTI_SHORT_EN_FRAMES = Math.round(
  ALTI_SHORT_EN.reduce((a, x) => a + x.sec, 0) * 30,
);
