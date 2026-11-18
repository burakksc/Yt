// English narration (Kokoro am_michael) = scripts/tts/cikolata_en.json; sec/vsec fitted from public/cikolata/en/*.wav
import type { CikScene } from "./types";

export const CIK_EN: CikScene[] = [
  {
    id: "hook",
    sec: 10.2,
    vsec: 9.35,
    title: "Bitter, not sweet?",
    tag: "",
    text: "If you picked a cacao bean straight off the tree and bit into it, it wouldn't taste like chocolate at all. So where does that flavor come from?",
  },
  {
    id: "tree",
    sec: 8.9,
    vsec: 8.03,
    title: "Fruit on the trunk",
    tag: "FACT",
    text: "Cacao pods grow right out of the tree's trunk. Each one holds about forty seeds, wrapped in a sweet, white pulp.",
  },
  {
    id: "ferment",
    sec: 7.3,
    vsec: 6.42,
    title: "A week of magic",
    tag: "FACT",
    text: "The beans ferment under leaves for about a week. This is where chocolate's aroma is born.",
  },
  {
    id: "roast",
    sec: 8.8,
    vsec: 7.97,
    title: "Dry · Roast · Crack",
    tag: "FACT",
    text: "Then they're dried in the sun, roasted, and cracked. Without their shells, the pieces are ground into a thick, dark liquid.",
  },
  {
    id: "conche",
    sec: 10.8,
    vsec: 9.93,
    title: "1879: the long stir",
    tag: "FACT",
    text: "It's mixed with sugar and stirred for hours, sometimes days. A Swiss chocolatier, Rodolphe Lindt, invented this in 1879.",
  },
  {
    id: "temper",
    sec: 9.0,
    vsec: 8.15,
    title: "Why it snaps",
    tag: "FACT",
    text: "The last secret is temperature. Chocolate that's heated and cooled just right turns glossy, and snaps when you break it.",
  },
  {
    id: "loop",
    sec: 4.8,
    vsec: 3.38,
    title: "Back to the tree",
    tag: "",
    text: "And the whole journey starts again, on a tree.",
  },
];
