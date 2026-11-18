// Turkish narration (Chatterbox Michael) = scripts/tts/cikolata_tr.json; sec/vsec fitted from public/cikolata/tr/*.wav
import type { CikScene } from "./types";

export const CIK_TR: CikScene[] = [
  {
    id: "hook",
    sec: 8,
    vsec: 7,
    title: "Acı mı, tatlı mı?",
    tag: "",
    text: "Bir kakao çekirdeğini ağaçtan koparıp ısırsan, çikolata tadı alamazsın. Peki o tat nereden geliyor?",
  },
  {
    id: "tree",
    sec: 8,
    vsec: 7,
    title: "Gövdede meyve",
    tag: "GERÇEK",
    text: "Kakao meyveleri ağacın gövdesinden çıkar. Her birinde, beyaz ve tatlı bir posaya sarılı kırk kadar çekirdek var.",
  },
  {
    id: "ferment",
    sec: 8,
    vsec: 7,
    title: "Bir haftalık sihir",
    tag: "GERÇEK",
    text: "Çekirdekler yaprakların altında yaklaşık bir hafta mayalanır. Çikolatanın kokusu tam burada doğar.",
  },
  {
    id: "roast",
    sec: 8,
    vsec: 7,
    title: "Kurut · Kavur · Kır",
    tag: "GERÇEK",
    text: "Sonra güneşte kurutulur, kavrulur ve kırılır. Kabuğu ayrılan parçalar ezilince koyu bir sıvıya dönüşür.",
  },
  {
    id: "conche",
    sec: 8,
    vsec: 7,
    title: "1879: Uzun karıştırma",
    tag: "GERÇEK",
    text: "Şekerle karıştırılır ve saatlerce, hatta günlerce yoğrulur. Bu yöntemi bin sekiz yüz yetmiş dokuzda İsviçreli Rodolphe Lindt buldu.",
  },
  {
    id: "temper",
    sec: 8,
    vsec: 7,
    title: "Neden çıt diye kırılır?",
    tag: "GERÇEK",
    text: "Son sır sıcaklıkta. Doğru ısıtılıp soğutulan çikolata parlak olur ve kırılınca çıt diye ses çıkarır.",
  },
  {
    id: "loop",
    sec: 8,
    vsec: 7,
    title: "Yine ağaçta",
    tag: "",
    text: "Ve bütün bu yolculuk, yine bir ağaçta başlar.",
  },
];
