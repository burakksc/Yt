// "Buzdolabından önce: Kilerler" — ~53 s 16:9 explainer, on-screen Turkish text, no voice-over.
// Photos: Wikimedia Commons (public/kiler/credits.json). Music: scripts/audio/make_music_bed.py.

export type KilerScene = {
  id: string; // = image file name in public/kiler/
  sec: number;
  place: string; // location chip
  title: string;
  facts: string[];
  credit: string;
};

export const KILER_STORY: KilerScene[] = [
  {
    id: "giris",
    sec: 5,
    place: "Audley End konağı kileri · İngiltere",
    title: "Buzdolabından önce yiyecek nasıl saklanırdı?",
    facts: ["Cevap: akıllıca inşa edilmiş kilerler."],
    credit: "Foto: Michael Garlick · CC BY-SA 2.0",
  },
  {
    id: "mahzen",
    sec: 7,
    place: "Elliston · Newfoundland, Kanada",
    title: "Toprak Mahzen",
    facts: [
      "Toprağın birkaç metre altı yıl boyu serin ve nemli kalır",
      "Patates, havuç, lahana, elma kışı burada çıkarır",
      "Bu küçük kasabada 130'dan fazla mahzen var",
    ],
    credit: "Foto: Ryan Hodnett · CC BY-SA 4.0",
  },
  {
    id: "buzhane",
    sec: 7,
    place: "Kew Bahçeleri buzhanesi · İngiltere, 18. yy",
    title: "Buzhane",
    facts: [
      "Kışın gölden buz kesilir, derin bir kuyuya istiflenir",
      "Saman ve talaş yalıtım yapar",
      "Buz yaz ortasına kadar erimeden kalır",
    ],
    credit: "Foto: Eddie Johnston · CC BY-SA 4.0",
  },
  {
    id: "yakhchal",
    sec: 7.5,
    place: "Meybod · İran",
    title: "Yahçal: Çöldeki Buzdolabı",
    facts: [
      "Fikir yaklaşık 2.400 yıllık",
      "Kalın kerpiç kubbe sıcağı içeri almaz",
      "Yüksek duvar gölge yapar, kışın donan buz yazın da saklanır",
    ],
    credit: "Foto: Soheil46 · CC BY-SA 4.0",
  },
  {
    id: "horreo",
    sec: 7,
    place: "Xove, Galiçya · İspanya",
    title: "Ayaklı Ambar (Hórreo)",
    facts: [
      "Taş ayaklar tahılı yerin neminden uzak tutar",
      "Ayak üstündeki yassı taş fareleri durdurur",
      "Karadeniz'deki serenderler de aynı fikir",
    ],
    credit: "Foto: Xemenendura · CC BY-SA 4.0",
  },
  {
    id: "kaynak",
    sec: 6.5,
    place: "Pennsylvania · ABD",
    title: "Kaynak Evi",
    facts: [
      "Soğuk kaynak suyu taş bir oluktan geçer",
      "Süt, tereyağı ve peynir kapları suyun içinde serin kalır",
    ],
    credit: "Foto: Generic1139 · CC BY-SA 3.0",
  },
  {
    id: "kiler",
    sec: 7,
    place: "New Mexico · ABD, 1940'lar",
    title: "Ev Kileri",
    facts: [
      "Evin en serin, güneş almayan köşesi",
      "Raflar kavanoz dolusu konserve, reçel, turşu",
      "Bizde de: salça, bulgur, erişte, pekmez, kurutmalar",
    ],
    credit: "Foto: ABD Ulusal Arşivi (NARA) · Kamu malı",
  },
  {
    id: "kapanis",
    sec: 6,
    place: "Audley End konağı · İngiltere",
    title: "Her kilerin 4 kuralı",
    facts: ["Serin", "Karanlık", "Havadar", "Zararlıdan uzak"],
    credit: "Foto: Michael Garlick · CC BY-SA 2.0",
  },
];

export const KILER_FPS = 30;
export const KILER_FRAMES = Math.round(
  KILER_STORY.reduce((s, x) => s + x.sec, 0) * KILER_FPS,
);
