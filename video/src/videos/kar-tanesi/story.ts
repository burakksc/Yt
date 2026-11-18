// Short: "Kar taneleri neden hep altı köşeli?" — Turkish, Michael (Chatterbox) narration.
// Narration text = scripts/tts/kar_tanesi_tr.json (keep in sync); audio in public/kar-tanesi/tr/<id>.wav.
// `sec` (scene length) and `vsec` (narration length) are filled in from the wav files after TTS.
export type KarTag = "GERÇEK" | "BELKİ" | "";
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
    sec: 6,
    vsec: 5,
    title: "Neden hep 6 köşe?",
    tag: "",
    text: "Her kar tanesi neden altı köşelidir? Cevap, gözle göremeyeceğin kadar küçük.",
  },
  {
    id: "molecule",
    sec: 9,
    vsec: 8,
    title: "Su molekülü",
    tag: "GERÇEK",
    text: "Su molekülü küçük bir bumeranga benzer. Donarken bu bumeranglar birbirine tutunur ve altıgen halkalar kurar.",
  },
  {
    id: "grow",
    sec: 8,
    vsec: 7,
    title: "Altı kol, aynı hava",
    tag: "GERÇEK",
    text: "Kar tanesi bu altıgenin üstünde büyür. Altı kolu aynı havada, aynı anda uzadığı için birbirine benzer.",
  },
  {
    id: "temp",
    sec: 9,
    vsec: 8,
    title: "Şekli sıcaklık seçer",
    tag: "GERÇEK",
    text: "Şeklini ise sıcaklık belirler. Eksi iki derecede düz bir plaka, eksi beşte iğne, eksi on beşte yıldız.",
  },
  {
    id: "twins",
    sec: 9,
    vsec: 8,
    title: "İkiz kar tanesi?",
    tag: "BELKİ",
    text: "Peki iki kar tanesi hiç aynı olur mu? Basit olanlar belki. Ama dallı bir yıldızın ikizini bulmak neredeyse imkânsız.",
  },
  {
    id: "white",
    sec: 9,
    vsec: 8,
    title: "Kar beyaz değil",
    tag: "GERÇEK",
    text: "Son bir sır: kar aslında beyaz değil. Buz şeffaftır. Beyazlık, ışığın binlerce küçük yüzeyde saçılmasından gelir.",
  },
  {
    id: "loop",
    sec: 5,
    vsec: 4,
    title: "Hepsi altı köşeli",
    tag: "",
    text: "Bir dahaki kar yağışında yakından bak. Hepsi altı köşeli.",
  },
];

export const KAR_FPS = 30;
export const KAR_LEAD = 0.3; // narration starts this many seconds into each scene
export const KAR_FRAMES = Math.round(
  KAR_STORY.reduce((s, x) => s + x.sec, 0) * KAR_FPS,
);
