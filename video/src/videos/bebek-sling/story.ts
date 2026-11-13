// "Bebek slingi bağlama yöntemleri" — midwife-led, mother & baby themed Shorts (~57 s).
// Sources (see vault note): TICKS (UK Consortium of Sling Manufacturers & Retailers),
// M-position / inward facing early months (International Hip Dysplasia Institute),
// carrier types (manufacturer guides, Lamaze/BWI). Back-carry age deliberately not stated.
//
// steps[].at = first word in `text` where that step is mentioned — the visual for the step
// appears exactly when that word is on screen (yt-video: sync animation to text).

export type BebekSceneId =
  | "giris"
  | "halkali"
  | "esnek"
  | "dokuma"
  | "sirt"
  | "meitai"
  | "ticks"
  | "mpoz";

export type Step = { label: string; at: string };

export type BebekScene = {
  id: BebekSceneId;
  sec: number;
  title: string;
  subtitle: string;
  text: string;
  steps: Step[];
};

export const BEBEK_STORY: BebekScene[] = [
  {
    id: "giris",
    sec: 5,
    title: "Bebek Slingi Bağlama",
    subtitle: "Ebe anlatıyor · 5 yöntem",
    text: "Bebeğini güvenle taşımanın 5 yolu. Ebe olarak adım adım anlatıyorum.",
    steps: [],
  },
  {
    id: "halkali",
    sec: 7.5,
    title: "1 · Halkalı Sling",
    subtitle: "Ring sling",
    text: "Kumaşı iki halkadan geçir, bebeği yerleştir, kuyruğu çekerek sık. Önde ya da kalçada taşınır.",
    steps: [
      { label: "Halkalardan geçir", at: "Kumaşı" },
      { label: "Bebeği yerleştir", at: "bebeği" },
      { label: "Kuyruğu çekip sık", at: "kuyruğu" },
    ],
  },
  {
    id: "esnek",
    sec: 7.5,
    title: "2 · Esnek Sargı",
    subtitle: "Stretchy wrap · çapraz ön",
    text: "Sargıyı önde çapraz bağla, bebeği bantların içine yerleştir. Yenidoğan için en yumuşak seçenek.",
    steps: [
      { label: "Önde çapraz bağla", at: "Sargıyı" },
      { label: "Bebeği yerleştir", at: "bebeği" },
      { label: "Bantları yay", at: "Yenidoğan" },
    ],
  },
  {
    id: "dokuma",
    sec: 7,
    title: "3 · Dokuma Sargı",
    subtitle: "Woven wrap · ön çapraz",
    text: "Bebeği cebe al, bantları çapraz geçir, belde düğümle. Bebek büyüdükçe de sağlam destek verir.",
    steps: [
      { label: "Bebeği cebe al", at: "Bebeği" },
      { label: "Çapraz geçir", at: "bantları" },
      { label: "Belde düğümle", at: "belde" },
    ],
  },
  {
    id: "sirt",
    sec: 7.5,
    title: "4 · Sırt Bağlama",
    subtitle: "Back carry · deneyim ister",
    text: "Baş ve boyun kontrolü oturunca, taşıyıcının talimatına göre başla. Bebeği sırtına al, bantları göğüste bağla. İlk denemeleri yardımla yap.",
    steps: [
      { label: "Bebeği sırta al", at: "Bebeği" },
      { label: "Göğüste bağla", at: "bantları" },
      { label: "Yardımla dene", at: "İlk" },
    ],
  },
  {
    id: "meitai",
    sec: 7,
    title: "5 · Mei Tai",
    subtitle: "Bağcıklı taşıyıcı",
    text: "Bel bağcığını bağla, bebeği panele yerleştir, omuz bağcıklarını çaprazlayıp düğümle.",
    steps: [
      { label: "Beli bağla", at: "Bel" },
      { label: "Bebeği yerleştir", at: "bebeği" },
      { label: "Omuzları düğümle", at: "omuz" },
    ],
  },
  {
    id: "ticks",
    sec: 9,
    title: "Ebe Kontrol Listesi",
    subtitle: "TICKS kuralı",
    text: "Sıkı bağla. Bebek her an görüş alanında olsun. Öpebileceğin yükseklikte dursun. Çenesi göğsüne düşmesin. Sırtı desteklensin.",
    steps: [
      { label: "Sıkı", at: "Sıkı" },
      { label: "Her an görünür", at: "görüş" },
      { label: "Öpülecek yükseklikte", at: "Öpebileceğin" },
      { label: "Çene göğüsten 2 parmak uzak", at: "Çenesi" },
      { label: "Sırt destekli", at: "Sırtı" },
    ],
  },
  {
    id: "mpoz",
    sec: 7,
    title: "M Pozisyonu",
    subtitle: "Kalça sağlığı",
    text: "Dizler kalçadan yukarıda, M pozisyonu. İlk aylarda yüzü sana dönük taşı. Kaydet ve paylaş.",
    steps: [
      { label: "Dizler yukarıda", at: "Dizler" },
      { label: "Yüzü anneye dönük", at: "yüzü" },
    ],
  },
];

export const BEBEK_FPS = 30;
export const BEBEK_FRAMES = Math.round(
  BEBEK_STORY.reduce((s, x) => s + x.sec, 0) * BEBEK_FPS,
);
