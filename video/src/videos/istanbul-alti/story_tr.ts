// Turkish version of ALTI_STORY with Michael (Chatterbox) narration: public/istanbul-alti/tr/<id>.wav
// `sec` is stretched to fit the narration; make_istanbul_sfx.py reads this file for soundtrack_tr.m4a.
import type { AltiScene } from "./story";

export const ALTI_STORY_TR: AltiScene[] = [
  {
    id: "intro",
    sec: 10,
    door: "",
    tag: "",
    tagText: "",
    depth: 0,
    lines: ["Derler ki, ikinci bir İstanbul var…", "…ilkinin altında saklı."],
  },
  {
    id: "cistern",
    sec: 14,
    door: "Kapı 1 · Yerebatan Sarnıcı",
    tag: "FACT",
    tagText: "GERÇEK",
    depth: 9,
    lines: [
      "6. yüzyılda yapıldı. 336 sütun.",
      "Futbol sahasından büyük, sudan bir saray.",
    ],
  },
  {
    id: "map",
    sec: 14,
    door: "Tarihi yarımadanın altında",
    tag: "FACT",
    tagText: "GERÇEK",
    depth: 9,
    lines: [
      "Eski şehrin altında 100'den fazla sarnıç bulundu.",
      "Binbirdirek “1.001 sütun” demek… aslında 224 tane.",
    ],
  },
  {
    id: "hagia",
    sec: 15,
    door: "Kapı 2 · Ayasofya",
    tag: "FACT",
    tagText: "GERÇEK",
    depth: 11,
    lines: [
      "2005: robot kameralar 8 kuyu ve gizli bir oda buldu.",
      "Şimdiye kadar yaklaşık 700 m tünel ölçüldü.",
    ],
  },
  {
    id: "legend",
    sec: 16,
    door: "Nereye çıkıyorlar?",
    tag: "MYTH",
    tagText: "EFSANE",
    depth: 11,
    lines: [
      "Efsane: Topkapı Sarayı'na… denizin altından adalara.",
      "Çoğu su ve hava kanalı. 9 km'lik ağ mı? Hiç ölçülmedi.",
    ],
  },
  {
    id: "bazaar",
    sec: 14,
    door: "Kapı 3 · Kapalıçarşı",
    tag: "MYTH",
    tagText: "EFSANE",
    depth: 4,
    lines: [
      "Bir dükkânın arkasında gizli giriş. Sır tutmaya yeminli çıraklar.",
      "Kanıt yok — sadece hikâyeler.",
    ],
  },
  {
    id: "galata",
    sec: 13,
    door: "Kapı 4 · Galata Kulesi",
    tag: "MAYBE",
    tagText: "BELKİ",
    depth: 6,
    lines: [
      "1960 restorasyonu: kulenin altında tünel ve zindan anlatıları.",
      "Kafatasları ve eski sikkeler, öyle anlatılır.",
    ],
  },
  {
    id: "anemas",
    sec: 12,
    door: "Kapı 5 · Anemas Zindanları",
    tag: "FACT",
    tagText: "GERÇEK",
    depth: 7,
    lines: [
      "Bir Bizans sarayının altında karanlık odalar.",
      "Dört imparator burada tutsak edildi.",
    ],
  },
  {
    id: "yenikapi",
    sec: 15,
    door: "En derin kapı · Yenikapı",
    tag: "FACT",
    tagText: "GERÇEK",
    depth: 12,
    lines: [
      "Metro kazısı 37 batıklı bir Bizans limanı çıkardı.",
      "Altında: 8.500 yıllık ayak izleri.",
    ],
  },
  {
    id: "truth",
    sec: 13,
    door: "",
    tag: "",
    tagText: "",
    depth: 12,
    lines: [
      "Kimi der ki tüneller İskoçya'ya kadar uzanır.",
      "Gerçek: gizli şehir yok — binlerce yıllık, katman katman bir şehir var.",
    ],
  },
  {
    id: "outro",
    sec: 7,
    door: "",
    tag: "",
    tagText: "",
    depth: 0,
    lines: ["Sence hangi tünel bir sır saklıyor?"],
  },
];

export const ALTI_FRAMES_TR = Math.round(
  ALTI_STORY_TR.reduce((s, x) => s + x.sec, 0) * 30,
);
