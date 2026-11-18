// Vertical summary Short of IstanbulAltiTR: 5 scenes, Turkish Michael narration (public/istanbul-alti/tr).
// make_istanbul_sfx.py reads `id`/`sec` below for soundtrack_short_tr.m4a. sec = narration + 1.1 s.
export const ALTI_SHORT: {
  id: "intro" | "cistern" | "hagia" | "legend" | "yenikapi";
  sec: number;
  vsec: number;
}[] = [
  {
    id: "intro",
    sec: 6.3,
    vsec: 5.24,
  },
  {
    id: "cistern",
    sec: 11.2,
    vsec: 10.08,
  },
  {
    id: "hagia",
    sec: 13.6,
    vsec: 12.52,
  },
  {
    id: "legend",
    sec: 14.9,
    vsec: 13.8,
  },
  {
    id: "yenikapi",
    sec: 11.7,
    vsec: 10.6,
  },
];

export const ALTI_SHORT_FRAMES = Math.round(
  ALTI_SHORT.reduce((a, x) => a + x.sec, 0) * 30,
);
