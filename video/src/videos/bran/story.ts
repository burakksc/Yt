// English narration (Kokoro am_michael) = projects/bran/script_en.json; sec/vsec fitted by scripts/tts/fit_timing.py
// Sources: vault/01-Videolar/2026-11-18 Bran Kalesi Drakula (Short).md · images: SDXL (AI, stylized on purpose)

export type BranScene = {
  id: string;
  sec: number;
  vsec: number;
  title: string;
  tag: "FACT" | "MYTH" | "";
  big: string;
  bigSub: string;
  text: string;
};

export const BRAN_STORY: BranScene[] = [
  {
    id: "hook",
    sec: 8.3,
    vsec: 7.53,
    title: "Dracula's castle?",
    tag: "",
    big: "",
    bigSub: "",
    text: "This is the most famous vampire castle in the world. But no vampire ever lived here. Not even Dracula.",
  },
  {
    id: "built",
    sec: 10.1,
    vsec: 9.3,
    title: "Built in 1388",
    tag: "FACT",
    big: "1388",
    bigSub: "a Saxon customs fort on a mountain pass",
    text: "Bran Castle was built by Saxon townspeople from Brasov, and finished in 1388, as a customs post on a mountain pass.",
  },
  {
    id: "vlad",
    sec: 11.7,
    vsec: 10.97,
    title: "Vlad never lived here",
    tag: "MYTH",
    big: "",
    bigSub: "Dracula's home? Most historians: no",
    text: "Vlad the Impaler, the real man behind Dracula? Most historians say he never set foot inside. His own fortress was Poenari, far away in Wallachia.",
  },
  {
    id: "stoker",
    sec: 9.6,
    vsec: 8.82,
    title: "Stoker never came",
    tag: "MYTH",
    big: "1897",
    bigSub: "Dracula published \u2014 Bran not in it",
    text: "And Bram Stoker, who wrote Dracula in 1897, never visited Romania. His novel doesn't even mention Bran.",
  },
  {
    id: "queen",
    sec: 10.9,
    vsec: 10.2,
    title: "A queen's home",
    tag: "FACT",
    big: "1920",
    bigSub: "a gift to Queen Marie of Romania",
    text: "The real story is sweeter. In 1920, the people of Brasov gave the castle to Queen Marie of Romania. It became one of her favourite homes.",
  },
  {
    id: "museum",
    sec: 9.1,
    vsec: 8.35,
    title: "Seized, then returned",
    tag: "FACT",
    big: "2006",
    bigSub: "returned to her family \u2014 now a museum",
    text: "The communists seized it in 1948. It was returned to her family in 2006, and today it's a museum.",
  },
  {
    id: "end",
    sec: 6.2,
    vsec: 5.4,
    title: "Would you visit at night?",
    tag: "",
    big: "",
    bigSub: "",
    text: "So it's not a vampire's lair. It's a queen's home. Would you still visit at night?",
  },
];

export const BRAN_FPS = 30;
export const BRAN_LEAD = 0.25;
export const BRAN_FRAMES = Math.round(
  BRAN_STORY.reduce((a, x) => a + x.sec, 0) * BRAN_FPS,
);
