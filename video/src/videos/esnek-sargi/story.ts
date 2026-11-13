// "Esnek sargı nasıl bağlanır?" — pocket wrap cross carry (PWCC) step-by-step, midwife-led.
// Sequence (babyonthemove.co.nz, wisebabychoices.com, NCT): centre on torso → cross at back →
// over opposite shoulders → under the horizontal band → cross in front, tie at back →
// insert baby through the cross passes (M position) → spread passes knee to knee →
// pull the pocket up the baby's back. Stretchy wrap: front carries only, face always free.
//
// cues: keyword in `text` → the frame that word appears drives that visual (text/visual sync).

export type SargiSceneId =
  | "giris"
  | "orta"
  | "arka"
  | "omuz"
  | "alt"
  | "bagla"
  | "bebek"
  | "yay"
  | "cep"
  | "kontrol"
  | "kapanis";

export type SargiScene = {
  id: SargiSceneId;
  sec: number;
  step: number; // 0 = no step badge
  title: string;
  text: string;
  cues: string[];
};

export const SARGI_STORY: SargiScene[] = [
  {
    id: "giris",
    sec: 4,
    step: 0,
    title: "Esnek Sargı Nasıl Bağlanır?",
    text: "Esnek sargıyı adım adım birlikte bağlayalım.",
    cues: [],
  },
  {
    id: "orta",
    sec: 5.5,
    step: 1,
    title: "Ortayı Bul",
    text: "Kumaşın ortasını bul ve belinin ortasına yerleştir.",
    cues: ["ortasını", "yerleştir"],
  },
  {
    id: "arka",
    sec: 6,
    step: 2,
    title: "Arkada Çaprazla",
    text: "İki ucu arkana götür ve sırtında çaprazla.",
    cues: ["arkana", "çaprazla"],
  },
  {
    id: "omuz",
    sec: 5.5,
    step: 3,
    title: "Omuzlardan Öne Al",
    text: "Her ucu karşı omzunun üstünden öne getir.",
    cues: ["omzunun"],
  },
  {
    id: "alt",
    sec: 5.5,
    step: 4,
    title: "Ön Bandın Altından Geçir",
    text: "Sarkan uçları öndeki bandın altından aşağı geçir.",
    cues: ["altından"],
  },
  {
    id: "bagla",
    sec: 7,
    step: 5,
    title: "Önde Çaprazla, Arkada Bağla",
    text: "Uçları önde çaprazla, beline dola ve arkada çift düğüm at.",
    cues: ["çaprazla", "düğüm"],
  },
  {
    id: "bebek",
    sec: 7,
    step: 6,
    title: "Bebeği Yerleştir",
    text: "Bebeği omzuna al, bacaklarını çapraz bantlardan geçir. Dizler kalçadan yukarıda.",
    cues: ["Bebeği", "bacaklarını", "Dizler"],
  },
  {
    id: "yay",
    sec: 6,
    step: 7,
    title: "Bantları Yay",
    text: "Çapraz bantları dizden dize, sırtına doğru yay.",
    cues: ["dizden"],
  },
  {
    id: "cep",
    sec: 6.5,
    step: 8,
    title: "Cebi Yukarı Çek",
    text: "Öndeki bandı bebeğin sırtına, ensesine kadar çek. Yüzü hep açık kalsın.",
    cues: ["sırtına", "Yüzü"],
  },
  {
    id: "kontrol",
    sec: 7.5,
    step: 0,
    title: "Son Kontrol",
    text: "Sıkı mı? Görünüyor mu? Öpebiliyor musun? Çene göğüsten uzak mı? Sırtı destekli mi?",
    cues: ["Sıkı", "Görünüyor", "Öpebiliyor", "Çene", "Sırtı"],
  },
  {
    id: "kapanis",
    sec: 5,
    step: 0,
    title: "Hazırsınız!",
    text: "Sarkarsa baştan bağla. Esnek sargıyla sadece önde taşı. Kaydet!",
    cues: ["Sarkarsa", "önde"],
  },
];

export const SARGI_FPS = 30;
export const SARGI_FRAMES = Math.round(
  SARGI_STORY.reduce((s, x) => s + x.sec, 0) * SARGI_FPS,
);
