// Short: "7 places Russia hides" — English narration (Kokoro am_michael, speed 1.15) = projects/rusya-gizli/script_en.json
// sec/vsec fitted by scripts/tts/fit_timing.py. Coordinates: vault/01-Videolar/2026-11-19 Rusya Uydu Haritası Garip Yerler (Short).md
export const GZ_FPS = 30;
export const GZ_LEAD = 0.15;

export type GzScene = {
  id: string;
  sec: number;
  vsec: number;
  num: number; // 0 = hook/end
  name: string;
  lat: number;
  lon: number;
  photo: boolean;
  big: string;
  bigSub: string;
  text: string;
};

export const GZ_STORY: GzScene[] = [
  {
    id: "hook",
    sec: 5.0,
    vsec: 4.55,
    num: 0,
    name: "7 places Russia hides",
    lat: 63,
    lon: 100,
    photo: false,
    big: "",
    bigSub: "",
    text: "Russia hides places you were never supposed to see. Here are seven.",
  },
  {
    id: "jeannette",
    sec: 7.9,
    vsec: 7.4,
    num: 1,
    name: "Jeannette Island",
    lat: 76.72,
    lon: 158.0,
    photo: false,
    big: "BLACKED OUT",
    bigSub: "on online maps for years",
    text: "Jeannette Island, in the Arctic. For years, online maps showed it as a solid black shape. No one explained why.",
  },
  {
    id: "patomskiy",
    sec: 9.3,
    vsec: 8.8,
    num: 2,
    name: "Patomskiy Crater",
    lat: 59.2849,
    lon: 116.5893,
    photo: true,
    big: "~250 YEARS",
    bigSub: "old — origin still debated",
    text: "Patomskiy Crater. A strange cone of broken rock in the Siberian forest. Locals call it the Fire Eagle's Nest, and stay away.",
  },
  {
    id: "yamal",
    sec: 9.2,
    vsec: 8.7,
    num: 3,
    name: "Yamal Craters",
    lat: 69.97,
    lon: 68.37,
    photo: false,
    big: "2014",
    bigSub: "the ground exploded",
    text: "Yamal. In 2014, the frozen ground here simply exploded, leaving giant holes. Trapped methane gas is the main suspect.",
  },
  {
    id: "kola",
    sec: 9.1,
    vsec: 8.62,
    num: 4,
    name: "Kola Superdeep Borehole",
    lat: 69.3965,
    lon: 30.61,
    photo: true,
    big: "12,262 m",
    bigSub: "deepest hole ever dug",
    text: "The Kola Superdeep Borehole. Twelve kilometres down, the deepest hole ever dug. Today, it is sealed with a rusty metal cap.",
  },
  {
    id: "lenin",
    sec: 8.2,
    vsec: 7.72,
    num: 5,
    name: "The LENIN Forest",
    lat: 55.8476,
    lon: 72.1722,
    photo: false,
    big: "~80 m",
    bigSub: "per letter — written in pine trees",
    text: "Near Omsk, pine trees spell out the word Lenin, each letter about eighty metres tall. You can only read it from the sky.",
  },
  {
    id: "batagaika",
    sec: 8.3,
    vsec: 7.85,
    num: 6,
    name: "Batagaika Crater",
    lat: 67.5803,
    lon: 134.7715,
    photo: true,
    big: "~1 km",
    bigSub: "wide — and growing every year",
    text: "Batagaika, the gateway to the underworld. A crater almost one kilometre wide, and it grows every single year.",
  },
  {
    id: "yamantau",
    sec: 8.5,
    vsec: 7.97,
    num: 7,
    name: "Mount Yamantau",
    lat: 54.255,
    lon: 58.103,
    photo: true,
    big: "CLOSED TOWN",
    bigSub: "at the foot of the mountain",
    text: "Mount Yamantau. A closed military town sits at its foot, and many believe a huge bunker is hidden inside the mountain.",
  },
  {
    id: "end",
    sec: 3.7,
    vsec: 3.2,
    num: 0,
    name: "Which one would you visit?",
    lat: 63,
    lon: 100,
    photo: false,
    big: "",
    bigSub: "",
    text: "Which one would you visit? Tell me in the comments.",
  },
];

export const GZ_FRAMES = Math.round(GZ_STORY.reduce((s, x) => s + x.sec, 0) * GZ_FPS);
