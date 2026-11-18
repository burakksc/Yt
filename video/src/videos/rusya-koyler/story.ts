// English narration (Kokoro am_michael) = projects/rusya-koyler/script_en.json; sec/vsec fitted by scripts/tts/fit_timing.py
// Sources: vault/01-Videolar/2026-11-18 Rusya'nın Ulaşılmaz Köyleri (Short).md

export type RuScene = {
  id: string;
  sec: number;
  vsec: number;
  title: string;
  tag: "FACT" | "";
  big: string;
  bigSub: string;
  text: string;
};

export const RU_STORY: RuScene[] = [
  {
    id: "hook",
    sec: 8.4,
    vsec: 7.67,
    title: "24,751 empty villages",
    tag: "FACT",
    big: "24,751",
    bigSub: "villages with zero residents (2021 census)",
    text: "In Russia, twenty four thousand, seven hundred and fifty one villages have no one left. Not a single person.",
  },
  {
    id: "noroad",
    sec: 12.1,
    vsec: 11.3,
    title: "No road out",
    tag: "FACT",
    big: "46,000",
    bigSub: "villages without a year-round road (2011)",
    text: "Many villages that are still alive have no real road out. In 2011, the government itself said forty six thousand villages had no road you could use all year.",
  },
  {
    id: "ice",
    sec: 14.1,
    vsec: 13.35,
    title: "Roads made of ice",
    tag: "FACT",
    big: "11,000+ km",
    bigSub: "of winter roads in Yakutia each year",
    text: "So in winter, people drive on ice. In Yakutia alone, crews open more than eleven thousand kilometres of winter roads, across frozen rivers and swamps. In spring, they simply melt away.",
  },
  {
    id: "yakutia",
    sec: 7.8,
    vsec: 7.05,
    title: "Bigger than Argentina",
    tag: "FACT",
    big: "~90%",
    bigSub: "of Yakutia has no year-round transport",
    text: "Yakutia is bigger than Argentina, and about ninety percent of it has no year round transport at all.",
  },
  {
    id: "delivery",
    sec: 10.9,
    vsec: 10.12,
    title: "One delivery a year",
    tag: "FACT",
    big: "~1,800",
    bigSub: "Arctic settlements wait for it",
    text: "About eighteen hundred Arctic settlements wait for one big delivery a year. Fuel and food come by barge or helicopter, before the ice closes in.",
  },
  {
    id: "end",
    sec: 8.6,
    vsec: 7.85,
    title: "Would you live here?",
    tag: "",
    big: "",
    bigSub: "",
    text: "Out here, life runs on seasons, not schedules. Would you live somewhere you can only reach when the river freezes?",
  },
];

export const RU_FPS = 30;
export const RU_LEAD = 0.25;
export const RU_FRAMES = Math.round(
  RU_STORY.reduce((a, x) => a + x.sec, 0) * RU_FPS,
);
