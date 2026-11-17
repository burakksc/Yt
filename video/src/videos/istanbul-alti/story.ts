// "Istanbul beneath Istanbul" — no voice-over: ambient SFX + short English on-screen text.
// Sources and fact/legend decisions: vault/01-Videolar/2026-11-17 İstanbul'un Altındaki İstanbul.md
// scripts/audio/make_istanbul_sfx.py reads the `sec` values below (keep the `sec: N` format).

export type Tag = "FACT" | "MYTH" | "MAYBE" | "";

export type AltiSceneId =
  | "intro"
  | "cistern"
  | "map"
  | "hagia"
  | "legend"
  | "bazaar"
  | "galata"
  | "anemas"
  | "yenikapi"
  | "truth"
  | "outro";

export type AltiScene = {
  id: AltiSceneId;
  sec: number;
  door: string; // small label top-left, "" = none
  tag: Tag;
  depth: number; // metres below street level shown on the depth meter
  lines: string[]; // shown one after another
};

export const ALTI_STORY: AltiScene[] = [
  {
    id: "intro",
    sec: 10,
    door: "",
    tag: "",
    depth: 0,
    lines: [
      "They say there is a second Istanbul…",
      "…hidden beneath the first.",
    ],
  },
  {
    id: "cistern",
    sec: 14,
    door: "Door 1 · Basilica Cistern",
    tag: "FACT",
    depth: 9,
    lines: [
      "Built in the 6th century. 336 columns.",
      "A water palace bigger than a football pitch.",
    ],
  },
  {
    id: "map",
    sec: 12,
    door: "Beneath the old city",
    tag: "FACT",
    depth: 9,
    lines: [
      "Over 100 cisterns have been found under the old city.",
      "Binbirdirek means “1,001 columns”… it has 224.",
    ],
  },
  {
    id: "hagia",
    sec: 14,
    door: "Door 2 · Hagia Sophia",
    tag: "FACT",
    depth: 11,
    lines: [
      "2005: robot cameras found 8 wells and a hidden room.",
      "About 700 m of tunnels have been measured so far.",
    ],
  },
  {
    id: "legend",
    sec: 14,
    door: "Where do they lead?",
    tag: "MYTH",
    depth: 11,
    lines: [
      "Myth: to Topkapı Palace… and under the sea to the islands.",
      "Most are water and air channels. A 9 km network? Never measured.",
    ],
  },
  {
    id: "bazaar",
    sec: 14,
    door: "Door 3 · Grand Bazaar",
    tag: "MYTH",
    depth: 4,
    lines: [
      "A secret entrance behind a shop. Apprentices sworn to silence.",
      "Çemberlitaş was called a gateway too. No evidence — only stories.",
    ],
  },
  {
    id: "galata",
    sec: 13,
    door: "Door 4 · Galata Tower",
    tag: "MAYBE",
    depth: 6,
    lines: [
      "1960 restoration: tunnels and dungeons reported beneath the tower.",
      "Skulls and old coins, the story goes.",
    ],
  },
  {
    id: "anemas",
    sec: 12,
    door: "Door 5 · Anemas Dungeons",
    tag: "FACT",
    depth: 7,
    lines: [
      "Dark chambers beneath a Byzantine palace.",
      "Four emperors were held captive here.",
    ],
  },
  {
    id: "yenikapi",
    sec: 15,
    door: "The deepest door · Yenikapı",
    tag: "FACT",
    depth: 12,
    lines: [
      "A metro dig uncovered a Byzantine harbor with 37 shipwrecks.",
      "Below it: footprints 8,500 years old.",
    ],
  },
  {
    id: "truth",
    sec: 12,
    door: "",
    tag: "",
    depth: 12,
    lines: [
      "Some say the tunnels reach Scotland.",
      "The truth: no hidden city — a city of thousands of years, layer upon layer.",
    ],
  },
  {
    id: "outro",
    sec: 7,
    door: "",
    tag: "",
    depth: 0,
    lines: ["Which tunnel do you think hides a secret?"],
  },
];

export const ALTI_FPS = 30;
export const ALTI_FRAMES = Math.round(
  ALTI_STORY.reduce((s, x) => s + x.sec, 0) * ALTI_FPS,
);
