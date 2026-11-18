// Generated from projects/atg-ikamet/diyalog.json + wav lengths (scripts in session). Seconds.
export type Who = "musavir" | "turk" | "yabanci";
export type Line = {
  id: string;
  who: Who;
  start: number;
  dur: number;
  text: string;
};
export const LINES: Line[] = [
  {
    id: "01",
    who: "turk",
    start: 0.6,
    dur: 4.13,
    text: "Hocam, yeni bir karar çıkmış. Yabancılara yatırımla ikamet izni mi veriliyor?",
  },
  {
    id: "02",
    who: "yabanci",
    start: 5.08,
    dur: 6.53,
    text: "Evet, ben de duydum. Türkiye'de yaşamak istiyorum. Ne yapmam gerekiyor?",
  },
  {
    id: "03",
    who: "musavir",
    start: 11.95,
    dur: 12.35,
    text: "Doğru duymuşsunuz. On sekiz Kasım iki bin yirmi altı tarihli Resmî Gazete'de yayımlanan, on bir bin dokuz yüz doksan dört sayılı Cumhurbaşkanı Kararı ile bu düzenleme yürürlüğe girdi.",
  },
  {
    id: "04",
    who: "yabanci",
    start: 24.65,
    dur: 3.65,
    text: "Ne kadar yatırım yapmam gerekiyor?",
  },
  {
    id: "05",
    who: "musavir",
    start: 28.65,
    dur: 9.16,
    text: "En az yüz elli bin ABD Doları ya da karşılığı döviz yatırırsanız üç yıllık, en az iki yüz bin dolar yatırırsanız beş yıllık ikamet izni alabilirsiniz.",
  },
  {
    id: "06",
    who: "turk",
    start: 38.16,
    dur: 2.94,
    text: "Bu parayı nereye yatırmak gerekiyor?",
  },
  {
    id: "07",
    who: "musavir",
    start: 41.45,
    dur: 11.65,
    text: "Dört seçenek var. Türkiye'deki bankalara mevduat, devlet borçlanma araçları, gayrimenkul ya da girişim sermayesi yatırım fonu katılma payı, veya bireysel emeklilik sistemine katkı payı.",
  },
  {
    id: "08",
    who: "yabanci",
    start: 53.44,
    dur: 3.55,
    text: "Parayı sonra hemen çekebilir miyim?",
  },
  {
    id: "09",
    who: "musavir",
    start: 57.34,
    dur: 10.27,
    text: "Hayır. Yatırımı, ikamet izni süresinin yarısı boyunca tutmanız gerekiyor. Yani üç yıllık izinde bir buçuk yıl, beş yıllık izinde iki buçuk yıl.",
  },
  {
    id: "10",
    who: "musavir",
    start: 67.96,
    dur: 10.86,
    text: "Bunu mevduatta BDDK, devlet borçlanma araçlarında Hazine ve Maliye Bakanlığı, fonlarda Sermaye Piyasası Kurulu, bireysel emeklilikte ise SEDDK tespit ediyor.",
  },
  {
    id: "11",
    who: "yabanci",
    start: 79.17,
    dur: 3.33,
    text: "Ailem de benimle gelebilir mi?",
  },
  {
    id: "12",
    who: "musavir",
    start: 82.85,
    dur: 7.76,
    text: "Evet. Yabancı eşiniz ile ergin olmayan veya bağımlı yabancı çocuklarınız da bu kapsamda ikamet izni alabilir.",
  },
  {
    id: "13",
    who: "turk",
    start: 90.96,
    dur: 4.05,
    text: "Peki bu izin çalışma hakkı ya da vatandaşlık sağlıyor mu?",
  },
  {
    id: "14",
    who: "musavir",
    start: 95.36,
    dur: 15.09,
    text: "Hayır. Bu düzenleme Türkiye'de çalışmayan yatırımcılar içindir, çalışma izni yerine geçmez. Ayrıca yatırım yoluyla vatandaşlık kapsamında değerlendirilmez. Başvuruya ilişkin usul ve esasları İçişleri Bakanlığı belirleyecek.",
  },
  {
    id: "15",
    who: "yabanci",
    start: 110.8,
    dur: 5.03,
    text: "Çok teşekkürler. Süreci sizinle yürütmek isterim.",
  },
  {
    id: "16",
    who: "musavir",
    start: 116.18,
    dur: 5.97,
    text: "Memnuniyetle. Detaylı bilgi için ATG Mali Müşavirlik'e ulaşabilirsiniz.",
  },
];
export const ATG_END = 125.1;
export const ATG_FPS = 30;
export const ATG_FRAMES = Math.round(ATG_END * ATG_FPS);
