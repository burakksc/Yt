// Story data for "-100°C'de kaç saat dayanırsın?" (9:16 Shorts).
// - narration: Turkish voice-over text (also used for captions)
// - sec: scene length; captions are spread over it until real TTS timings exist
// - bg: optional AI background at public/eksi-100-hikaye/bg/<id>.png (falls back to the SVG painting)
// - voice: optional narration clip at public/eksi-100-hikaye/voice/<id>.mp3

export type SceneId =
  | "pencere"
  | "kapi"
  | "araba"
  | "elektrik"
  | "borular"
  | "telefon"
  | "soba"
  | "rekor";

export type StoryScene = {
  id: SceneId;
  sec: number;
  clock: string;
  narration: string;
};

export const STORY: StoryScene[] = [
  {
    id: "pencere",
    sec: 5.5,
    clock: "07:00",
    narration:
      "Bir sabah uyandın. Dışarısı eksi 100 derece. Ne kadar dayanabilirsin?",
  },
  {
    id: "kapi",
    sec: 7.5,
    clock: "07:04",
    narration:
      "Kapıyı açtığın an nefesin çıtırdayarak buza dönüşüyor. Yüzündeki cilt dakikalar içinde donar.",
  },
  {
    id: "araba",
    sec: 6,
    clock: "07:10",
    narration:
      "Arabaya koşuyorsun. Ama akü çoktan ölmüş, motor yağı bal gibi koyulaşmış.",
  },
  {
    id: "elektrik",
    sec: 6,
    clock: "07:45",
    narration:
      "Buzla ağırlaşan kablolar tek tek kopuyor. Şehir karanlığa gömülüyor.",
  },
  {
    id: "borular",
    sec: 6,
    clock: "09:30",
    narration:
      "Kalorifer duruyor. Borulardaki su donup genleşiyor ve boruları patlatıyor.",
  },
  {
    id: "telefon",
    sec: 6,
    clock: "11:00",
    narration:
      "Telefonun yüzde yüzden sıfıra iniyor. Lityum piller bu soğukta çalışmaz.",
  },
  {
    id: "soba",
    sec: 6.5,
    clock: "14:00",
    narration:
      "Tek umudun eski bir soba ve bir sandık odun. Artık bütün hayatın bu odada.",
  },
  {
    id: "rekor",
    sec: 8.5,
    clock: "",
    narration:
      "Dünyada ölçülen en düşük sıcaklık eksi 89 virgül 2. Eksi 100'ü kimse yaşamadı. Sen kaç saat dayanırdın?",
  },
];

export const STORY_FPS = 30;
export const STORY_FRAMES = Math.round(
  STORY.reduce((s, x) => s + x.sec, 0) * STORY_FPS,
);
