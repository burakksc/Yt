// "Sling bağlama yöntemleri" — ~55 s vertical explainer (on-screen text, no voice-over).
// Figures (ASME B30.9 / manufacturer tables, see vault note):
//   choker ≈ 75–80 % of vertical (choke angle ≥ 120°), basket up to 2× with vertical legs,
//   leg tension = (W/2) / sin(angle): 60° → 58 %, 45° → 71 %, 30° → 100 % of the load,
//   3–4 leg bridles are rated as if only 2 legs carry the load, never below 30°.

export type SlingSceneId =
  | "giris"
  | "dikey"
  | "bogma"
  | "sepet"
  | "ciftSarim"
  | "cokKollu"
  | "aci"
  | "guvenlik";

export type SlingScene = {
  id: SlingSceneId;
  sec: number;
  step: string; // HUD counter, "" = none
  title: string;
  subtitle: string;
  text: string;
};

export const SLING_STORY: SlingScene[] = [
  {
    id: "giris",
    sec: 4.5,
    step: "",
    title: "SLING BAĞLAMA",
    subtitle: "5 yöntem + 1 altın kural",
    text: "Aynı sling, bağlama şekline göre bambaşka yük taşır.",
  },
  {
    id: "dikey",
    sec: 6.5,
    step: "1/5",
    title: "Dikey Bağlama",
    subtitle: "Vertical",
    text: "Tek kol, kancadan yüke dümdüz iner. Slingin tam kapasitesi kullanılır.",
  },
  {
    id: "bogma",
    sec: 7,
    step: "2/5",
    title: "Boğma Bağlama",
    subtitle: "Choker",
    text: "Sling yükü sarar ve kendi gözünden geçer. Kapasite yaklaşık yüzde 75–80'e düşer.",
  },
  {
    id: "sepet",
    sec: 7,
    step: "3/5",
    title: "Sepet Bağlama",
    subtitle: "Basket",
    text: "Yük slingin içinde beşik gibi durur. Kollar dikse kapasite iki katına çıkar.",
  },
  {
    id: "ciftSarim",
    sec: 6.5,
    step: "4/5",
    title: "Çift Sarım Boğma",
    subtitle: "Double wrap choker",
    text: "Sling yükün etrafında iki tur döner. Borular ve demetler kaymaz.",
  },
  {
    id: "cokKollu",
    sec: 7,
    step: "5/5",
    title: "Çok Kollu Bağlama",
    subtitle: "Bridle",
    text: "3 ya da 4 kol olsa bile yükü sadece 2 kol taşıyormuş gibi hesapla.",
  },
  {
    id: "aci",
    sec: 9,
    step: "KURAL",
    title: "Açı Her Şeyi Değiştirir",
    subtitle: "Sling angle",
    text: "60 derecede her kol yükün yüzde 58'ini, 30 derecede tamamını taşır. 30 derecenin altına asla inme.",
  },
  {
    id: "guvenlik",
    sec: 8,
    step: "",
    title: "Sahada Unutma",
    subtitle: "Güvenlik",
    text: "Keskin kenara koruyucu tak, slinge düğüm atma, yükün altında durma. Kaydet, sahada lazım olur.",
  },
];

export const SLING_FPS = 30;
export const SLING_FRAMES = Math.round(
  SLING_STORY.reduce((s, x) => s + x.sec, 0) * SLING_FPS,
);
