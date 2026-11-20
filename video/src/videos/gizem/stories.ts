// generated from projects/gizem/stories.json by the build step — edit the JSON
export const GZ_LEAD = 0.25;
export type MyScene = {id:string;img:string;title:string;big:string;bigSub:string;text:string;sec:number;vsec:number;sfx?:string;fit?:"contain"};
export type MyStory = {title:string;scenes:MyScene[];credits:Record<string,string>};
export const STORIES: Record<string, MyStory> = {
 "bloop": {
  "title": "THE BLOOP",
  "scenes": [
   {
    "id": "hook",
    "img": "bloop_map",
    "title": "The Bloop",
    "big": "1997",
    "bigSub": "Pacific Ocean",
    "text": "In 1997, something in the Pacific Ocean made a sound so loud, it was picked up by sensors more than five thousand kilometres apart.",
    "vsec": 9.95,
    "sec": 10.7
   },
   {
    "id": "mics",
    "img": "ice3",
    "title": "Listening for submarines",
    "big": "",
    "bigSub": "",
    "text": "The underwater microphones were built to listen for submarines. They had never heard anything like this.",
    "vsec": 6.83,
    "sec": 7.58
   },
   {
    "id": "sound",
    "img": "bloop_spec",
    "title": "The real recording",
    "big": "",
    "bigSub": "",
    "text": "It rose fast and was far too powerful for any known animal. Listen.",
    "sfx": "bloop",
    "fit": "contain",
    "vsec": 5.0,
    "sec": 8.95
   },
   {
    "id": "monster",
    "img": "ice2",
    "title": "A sea monster?",
    "big": "",
    "bigSub": "",
    "text": "Many people believed it came from a giant, unknown creature in the deep.",
    "vsec": 4.9,
    "sec": 5.65
   },
   {
    "id": "answer",
    "img": "ice1",
    "title": "NOAA's answer",
    "big": "ICEQUAKE",
    "bigSub": "an iceberg cracking off Antarctica",
    "text": "Years later, scientists gave their answer: an icequake. A huge iceberg cracking and breaking away from Antarctica.",
    "vsec": 8.07,
    "sec": 8.82
   },
   {
    "id": "end",
    "img": "bloop_map",
    "title": "Would you go down there?",
    "big": "",
    "bigSub": "",
    "text": "But for years, nobody knew what made it. Would you go down and look?",
    "vsec": 4.38,
    "sec": 5.12
   }
  ],
  "credits": {
   "bloop_map": "Map: Nojhan · CC BY-SA 3.0 · Wikimedia Commons",
   "bloop_spec": "Spectrogram: NOAA (public domain)"
  }
 },
 "taos": {
  "title": "THE TAOS HUM",
  "scenes": [
   {
    "id": "hook",
    "img": "taos1",
    "title": "The Taos Hum",
    "big": "",
    "bigSub": "",
    "text": "In Taos, a small desert town in New Mexico, some people hear a sound that others cannot hear.",
    "vsec": 6.85,
    "sec": 7.6
   },
   {
    "id": "what",
    "img": "taos2",
    "title": "A distant engine",
    "big": "",
    "bigSub": "",
    "text": "A low, steady rumble, like a diesel engine idling far away. Day and night.",
    "vsec": 5.53,
    "sec": 6.28
   },
   {
    "id": "survey",
    "img": "taos3",
    "title": "Who hears it?",
    "big": "~2%",
    "bigSub": "of residents in a 1990s survey",
    "text": "In a survey in the 1990s, about two percent of the people living there said they could hear it.",
    "vsec": 6.4,
    "sec": 7.15
   },
   {
    "id": "science",
    "img": "taos4",
    "title": "Scientists came",
    "big": "0",
    "bigSub": "sources found",
    "text": "Scientists came with sensitive microphones and instruments. They could not find where it comes from.",
    "vsec": 6.3,
    "sec": 7.05
   },
   {
    "id": "end",
    "img": "taos5",
    "title": "Can you hear it?",
    "big": "",
    "bigSub": "",
    "text": "The ground, power lines, or something inside the ears of the people who hear it? Nobody knows. Would you want to hear it?",
    "vsec": 7.7,
    "sec": 8.45
   }
  ],
  "credits": {}
 },
 "wow": {
  "title": "THE WOW! SIGNAL",
  "scenes": [
   {
    "id": "hook",
    "img": "wow_sky",
    "title": "The Wow! Signal",
    "big": "1977",
    "bigSub": "Big Ear radio telescope, Ohio",
    "text": "On August fifteenth, 1977, a radio telescope in Ohio caught a signal from deep space.",
    "vsec": 7.38,
    "sec": 8.12
   },
   {
    "id": "freq",
    "img": "wow_sky",
    "title": "The hydrogen line",
    "big": "1420 MHz",
    "bigSub": "",
    "text": "It was strong and narrow, right next to the radio frequency of hydrogen, where scientists thought an alien message might be sent.",
    "vsec": 8.5,
    "sec": 9.25
   },
   {
    "id": "wow",
    "img": "wow_printout",
    "title": "\"Wow!\"",
    "big": "",
    "bigSub": "",
    "text": "Astronomer Jerry Ehman circled it on the printout and wrote one word: Wow!",
    "fit": "contain",
    "vsec": 5.17,
    "sec": 5.92
   },
   {
    "id": "sec",
    "img": "wow_printout",
    "title": "72 seconds",
    "big": "72 s",
    "bigSub": "from the direction of Sagittarius",
    "text": "It lasted seventy two seconds, and came from the direction of the constellation Sagittarius.",
    "fit": "contain",
    "vsec": 6.25,
    "sec": 7.0
   },
   {
    "id": "end",
    "img": "wow_sky",
    "title": "It never came back",
    "big": "",
    "bigSub": "",
    "text": "Astronomers have searched that spot for decades. It has never come back. Was it a message?",
    "vsec": 6.08,
    "sec": 6.83
   }
  ],
  "credits": {
   "wow_printout": "Big Ear Radio Observatory / NAAPO (Wikimedia Commons, public domain)"
  }
 },
 "voynich": {
  "title": "THE VOYNICH MANUSCRIPT",
  "scenes": [
   {
    "id": "hook",
    "img": "voy_3",
    "title": "The Voynich Manuscript",
    "big": "~600",
    "bigSub": "years old",
    "text": "This book is about six hundred years old, and nobody on Earth can read it.",
    "vsec": 5.22,
    "sec": 5.97
   },
   {
    "id": "date",
    "img": "voy_32",
    "title": "Early 1400s",
    "big": "1404–1438",
    "bigSub": "radiocarbon date of the pages",
    "text": "Carbon dating puts its pages in the early fourteen hundreds.",
    "vsec": 4.35,
    "sec": 5.1
   },
   {
    "id": "script",
    "img": "voy_46",
    "title": "An unknown alphabet",
    "big": "",
    "bigSub": "",
    "text": "It is written in an alphabet that appears nowhere else in the world.",
    "vsec": 4.4,
    "sec": 5.15
   },
   {
    "id": "plants",
    "img": "voy_66",
    "title": "Plants that don't exist",
    "big": "",
    "bigSub": "",
    "text": "Its pages are full of plants nobody can identify, star charts, and strange drawings of bathing women.",
    "vsec": 7.38,
    "sec": 8.12
   },
   {
    "id": "tried",
    "img": "voy_100",
    "title": "Still unbroken",
    "big": "",
    "bigSub": "",
    "text": "Codebreakers, linguists and even computers have tried. No one has cracked it.",
    "vsec": 5.3,
    "sec": 6.05
   },
   {
    "id": "end",
    "img": "voy_170",
    "title": "Could you read it?",
    "big": "",
    "bigSub": "",
    "text": "Today it is kept at Yale University. Do you think anyone will ever read it?",
    "vsec": 5.25,
    "sec": 6.0
   }
  ],
  "credits": {}
 },
 "voyager": {
  "title": "NEVER COMING BACK",
  "scenes": [
   {
    "id": "hook",
    "img": "voyager",
    "title": "Never coming back",
    "big": "1977",
    "bigSub": "Voyager 1 & 2 launch",
    "text": "In 1977, NASA launched two spacecraft that will never come home: Voyager 1 and Voyager 2.",
    "fit": "contain",
    "vsec": 7.9,
    "sec": 8.65
   },
   {
    "id": "planets",
    "img": "jupiter",
    "title": "The grand tour",
    "big": "4",
    "bigSub": "giant planets visited",
    "text": "Together they flew past Jupiter, Saturn, Uranus and Neptune, sending back the first close-up pictures of these worlds.",
    "fit": "contain",
    "vsec": 8.3,
    "sec": 9.05
   },
   {
    "id": "dot",
    "img": "paleblue",
    "title": "The Pale Blue Dot",
    "big": "",
    "bigSub": "",
    "text": "In 1990, Voyager 1 turned around and photographed Earth from six billion kilometres away. A tiny blue dot.",
    "vsec": 8.55,
    "sec": 9.3
   },
   {
    "id": "far",
    "img": "helio",
    "title": "Interstellar space",
    "big": "25+ billion km",
    "bigSub": "Voyager 1 from Earth",
    "text": "Today, both Voyagers have left the Sun's bubble and are in interstellar space, the farthest human-made objects ever.",
    "fit": "contain",
    "vsec": 7.95,
    "sec": 8.7
   },
   {
    "id": "record",
    "img": "goldenrecord",
    "title": "A message for aliens",
    "big": "",
    "bigSub": "",
    "text": "Each one carries a golden record with sounds and pictures of Earth, in case anyone ever finds it.",
    "fit": "contain",
    "vsec": 6.92,
    "sec": 7.67
   },
   {
    "id": "nh",
    "img": "pluto",
    "title": "New Horizons",
    "big": "2015",
    "bigSub": "first visit to Pluto",
    "text": "In 2015, a newer probe, New Horizons, gave us our first close look at Pluto, with its giant heart-shaped glacier.",
    "fit": "contain",
    "vsec": 8.55,
    "sec": 9.3
   },
   {
    "id": "arrokoth",
    "img": "arrokoth",
    "title": "Arrokoth",
    "big": "",
    "bigSub": "",
    "text": "Then it flew past Arrokoth, the most distant object ever explored up close, and kept going.",
    "fit": "contain",
    "vsec": 6.55,
    "sec": 7.3
   },
   {
    "id": "end",
    "img": "voyager",
    "title": "Into the dark",
    "big": "",
    "bigSub": "",
    "text": "None of them will ever return. When their power runs out, they will drift silently between the stars for millions of years.",
    "fit": "contain",
    "vsec": 8.0,
    "sec": 8.75
   }
  ],
  "credits": {
   "voyager": "Image: NASA / JPL (public domain)",
   "arrokoth": "Image: NASA / JHUAPL / SwRI (public domain)",
   "jupiter": "Image: NASA, ESA / Hubble (public domain)",
   "paleblue": "Image: NASA / JPL (public domain)",
   "helio": "Image: NASA / JPL (public domain)",
   "goldenrecord": "Image: NASA / JPL (public domain)",
   "pluto": "Image: NASA / JHUAPL / SwRI (public domain)"
  }
 },
 "resin": {
  "title": "PINE RESIN",
  "scenes": [
   {
    "id": "hook",
    "img": "forest",
    "title": "Lost in the woods?",
    "big": "",
    "bigSub": "",
    "text": "Lost in the woods, with wet wood and no lighter? Look for one thing: pine resin.",
    "vsec": 5.4,
    "sec": 6.15
   },
   {
    "id": "what",
    "img": "resin",
    "title": "Pine resin",
    "big": "",
    "bigSub": "",
    "text": "It's the sticky, golden sap that pine trees push out to seal their wounds. And it is full of flammable oils.",
    "vsec": 7.33,
    "sec": 8.07
   },
   {
    "id": "fire",
    "img": "fire",
    "title": "Fire starter",
    "big": "",
    "bigSub": "",
    "text": "A small lump of resin catches a spark easily and burns hot for minutes, even when everything around it is damp.",
    "vsec": 7.55,
    "sec": 8.3
   },
   {
    "id": "fatwood",
    "img": "fatwood",
    "title": "Fatwood",
    "big": "",
    "bigSub": "",
    "text": "Look for old pine stumps. Wood soaked with resin, called fatwood, smells like turpentine and lights almost instantly.",
    "vsec": 8.25,
    "sec": 9.0
   },
   {
    "id": "torch",
    "img": "torch",
    "title": "A torch",
    "big": "",
    "bigSub": "",
    "text": "Smear resin on the end of a stick with dry bark, and you have a torch that burns for a long time.",
    "vsec": 6.53,
    "sec": 7.28
   },
   {
    "id": "glue",
    "img": "glue",
    "title": "Natural glue",
    "big": "",
    "bigSub": "",
    "text": "Melt it, mix in fine charcoal, and it becomes a strong glue. People have used it to fix tools for thousands of years.",
    "vsec": 8.05,
    "sec": 8.8
   },
   {
    "id": "water",
    "img": "waterproof",
    "title": "Waterproofing",
    "big": "",
    "bigSub": "",
    "text": "It also seals cracks in containers and makes seams waterproof.",
    "vsec": 4.7,
    "sec": 5.45
   },
   {
    "id": "end",
    "img": "resin",
    "title": "Take only a little",
    "big": "",
    "bigSub": "",
    "text": "Only collect resin that has already leaked out, never cut the tree. Did you know this trick?",
    "vsec": 6.1,
    "sec": 6.85
   }
  ],
  "credits": {}
 }
};
export const gzFrames = (slug: string, fps = 30) => STORIES[slug].scenes.reduce((a, s) => a + Math.round(s.sec * fps), 0);
