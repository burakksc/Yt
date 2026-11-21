// Short: "Kar taneleri neden hep altı köşeli?" — Turkish, Michael (Chatterbox) narration.
// Narration text = scripts/tts/kar_tanesi_tr.json (keep in sync); audio in public/kar-tanesi/tr/<id>.wav.
// `sec` (scene length) and `vsec` (narration length) are filled in from the wav files after TTS.
export type KarTag = "GERÇEK" | "BELKİ" | "FACT" | "MAYBE" | "";
export type KarSceneId =
  | "hook"
  | "molecule"
  | "grow"
  | "temp"
  | "twins"
  | "white"
  | "loop";

export type KarScene = {
  id: KarSceneId;
  sec: number;
  vsec: number;
  title: string; // big label at the top
  tag: KarTag;
  text: string; // narration = captions
};

export const KAR_STORY: KarScene[] = [
  {
    id: "hook",
    sec: 7.0,
    vsec: 5.86,
    title: "Neden hep 6 köşe?",
    tag: "",
    text: "Her kar tanesi neden altı köşelidir? Cevap, gözle göremeyeceğin kadar küçük.",
  },
  {
    id: "molecule",
    sec: 8.9,
    vsec: 7.84,
    title: "Su molekülü",
    tag: "GERÇEK",
    text: "Su molekülü küçük bir bumeranga benzer. Donarken bu bumeranglar birbirine tutunur ve altıgen halkalar kurar.",
  },
  {
    id: "grow",
    sec: 8.3,
    vsec: 7.18,
    title: "Altı kol, aynı hava",
    tag: "GERÇEK",
    text: "Kar tanesi bu altıgenin üstünde büyür. Altı kolu aynı havada, aynı anda uzadığı için birbirine benzer.",
  },
  {
    id: "temp",
    sec: 8.9,
    vsec: 7.84,
    title: "Şekli sıcaklık seçer",
    tag: "GERÇEK",
    text: "Şeklini ise sıcaklık belirler. Eksi iki derecede düz bir plaka, eksi beşte iğne, eksi on beşte yıldız.",
  },
  {
    id: "twins",
    sec: 9.6,
    vsec: 8.46,
    title: "İkiz kar tanesi?",
    tag: "BELKİ",
    text: "Peki iki kar tanesi hiç aynı olur mu? Basit olanlar belki. Ama dallı bir yıldızın ikizini bulmak neredeyse imkânsız.",
  },
  {
    id: "white",
    sec: 9.9,
    vsec: 8.78,
    title: "Kar beyaz değil",
    tag: "GERÇEK",
    text: "Son bir sır: kar aslında beyaz değil. Buz şeffaftır. Beyazlık, ışığın binlerce küçük yüzeyde saçılmasından gelir.",
  },
  {
    id: "loop",
    sec: 7.0,
    vsec: 5.26,
    title: "Hepsi altı köşeli",
    tag: "",
    text: "Bir dahaki kar yağışında yakından bak. Hepsi altı köşeli.",
  },
];

// English version (Michael / Kokoro am_michael). Text = scripts/tts/kar_tanesi_en.json;
// audio in public/kar-tanesi/en/<id>.wav. vsec = wav length, sec = vsec + 0.65 (wavs sped up 1.14x to fit 60 s).
const EN: [KarSceneId, string, KarTag, number][] = [
  ["hook", "Why always 6 sides?", "", 0],
  ["molecule", "The water molecule", "FACT", 0],
  ["grow", "Six arms, same air", "FACT", 0],
  ["temp", "Temperature picks the shape", "FACT", 0],
  ["twins", "Twin snowflakes?", "MAYBE", 0],
  ["white", "Snow isn't white", "FACT", 0],
  ["loop", "All 6-sided", "", 0],
];
export const KAR_EN_VSEC: Record<KarSceneId, number> = {
  hook: 5.65,
  molecule: 8.92,
  grow: 8.24,
  temp: 9.36,
  twins: 8.68,
  white: 8.97,
  loop: 5.23,
};
export const KAR_EN_TEXT: Record<KarSceneId, string> = {
  hook: "Why does every snowflake have six sides? The answer is too small for your eyes to see.",
  molecule:
    "A water molecule looks like a tiny boomerang. As it freezes, these boomerangs hold on to each other and build hexagonal rings.",
  grow: "The snowflake grows on top of that hexagon. Its six arms grow in the same air, at the same time, so they look alike.",
  temp: "Its shape is chosen by temperature. At minus two degrees Celsius, a flat plate. At minus five, a needle. At minus fifteen, a star.",
  twins:
    "So can two snowflakes ever be identical? Simple ones, maybe. But finding a twin for a branching star is almost impossible.",
  white:
    "One last secret: snow isn't actually white. Ice is clear. The white comes from light scattering off thousands of tiny surfaces.",
  loop: "Next time it snows, take a closer look. Every single one has six sides.",
};
export const KAR_STORY_EN: KarScene[] = EN.map(([id, title, tag]) => ({
  id,
  title,
  tag,
  text: KAR_EN_TEXT[id],
  vsec: KAR_EN_VSEC[id],
  sec: Math.round((KAR_EN_VSEC[id] + 0.65) * 10) / 10,
}));

export const KAR_FPS = 30;
export const KAR_LEAD = 0.3; // narration starts this many seconds into each scene
export const karFrames = (story: KarScene[]) =>
  Math.round(story.reduce((s, x) => s + x.sec, 0) * KAR_FPS);
export const KAR_FRAMES = karFrames(KAR_STORY);
