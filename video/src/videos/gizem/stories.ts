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
 },
 "engine": {
  "title": "HORSEPOWER",
  "scenes": [
   {
    "id": "hook",
    "img": "hoods",
    "title": "Same size, different power",
    "big": "150 vs 421 hp",
    "bigSub": "both 2.0-litre, 4 cylinders",
    "text": "These two engines are both two litres, with four cylinders. One makes about one hundred fifty horsepower. The other makes four hundred twenty one. How?",
    "vsec": 9.85,
    "sec": 10.6
   },
   {
    "id": "air",
    "img": "intake",
    "title": "It's all about air",
    "big": "",
    "bigSub": "",
    "text": "An engine is basically an air pump. The more air and fuel it can burn every second, the more power it makes.",
    "vsec": 7.42,
    "sec": 8.18
   },
   {
    "id": "turbo",
    "img": "turbo",
    "title": "Turbochargers",
    "big": "",
    "bigSub": "",
    "text": "A turbocharger uses hot exhaust gas to spin a fan that squeezes extra air into the cylinders. More air, bigger explosion.",
    "vsec": 9.03,
    "sec": 9.78
   },
   {
    "id": "rpm",
    "img": "tacho",
    "title": "Revs",
    "big": "power = torque × rpm",
    "bigSub": "",
    "text": "Power is force times speed. An engine that can safely spin faster makes more power from the same size.",
    "vsec": 7.25,
    "sec": 8.0
   },
   {
    "id": "parts",
    "img": "pistons",
    "title": "Stronger parts",
    "big": "",
    "bigSub": "",
    "text": "High power engines use forged pistons, stronger rods, better cooling and smarter computers, so they don't melt under the pressure.",
    "vsec": 9.3,
    "sec": 10.05
   },
   {
    "id": "cost",
    "img": "hoods",
    "title": "The price",
    "big": "",
    "bigSub": "",
    "text": "That's why the powerful one costs more, uses more fuel and needs more care. Which one would you choose?",
    "vsec": 7.22,
    "sec": 7.97
   }
  ],
  "credits": {}
 },
 "yonaguni": {
  "title": "YONAGUNI",
  "scenes": [
   {
    "id": "hook",
    "img": "yon1",
    "title": "A pyramid under the sea?",
    "big": "1986",
    "bigSub": "discovered by a diver",
    "text": "In 1986, a diver off the tiny Japanese island of Yonaguni found something strange on the sea floor.",
    "vsec": 8.12,
    "sec": 8.88
   },
   {
    "id": "what",
    "img": "yon2",
    "title": "The Yonaguni Monument",
    "big": "~25 m",
    "bigSub": "below the surface",
    "text": "Giant stone terraces, flat platforms and sharp right angles, like steps, about twenty five metres under the water.",
    "vsec": 8.22,
    "sec": 8.97
   },
   {
    "id": "theory",
    "img": "yon3",
    "title": "Lost civilization?",
    "big": "10,000 years",
    "bigSub": "claimed age",
    "text": "A Japanese geologist believed it was carved by people over ten thousand years ago, when this land was still above the sea.",
    "vsec": 8.18,
    "sec": 8.93
   },
   {
    "id": "nature",
    "img": "yon4",
    "title": "Or nature?",
    "big": "",
    "bigSub": "",
    "text": "Most scientists disagree. This sandstone naturally cracks along straight lines, which can create step-like shapes.",
    "vsec": 7.75,
    "sec": 8.5
   },
   {
    "id": "end",
    "img": "yon1",
    "title": "You decide",
    "big": "",
    "bigSub": "",
    "text": "Natural rock, or the ruins of a lost world? What do you think?",
    "vsec": 4.65,
    "sec": 5.4
   }
  ],
  "credits": {}
 },
 "oil": {
  "title": "HOW TO ADD ENGINE OIL",
  "scenes": [
   {
    "id": "hook",
    "img": "oil1",
    "title": "How to add engine oil",
    "big": "",
    "bigSub": "",
    "text": "Here's how to check and add engine oil, the right way, in under a minute.",
    "vsec": 4.95,
    "sec": 5.7
   },
   {
    "id": "cool",
    "img": "oil2",
    "title": "1. Park & wait",
    "big": "~10 min",
    "bigSub": "engine off, level ground",
    "text": "Park on level ground, turn the engine off, and wait about ten minutes. The oil drains back down, and the hot parts cool off.",
    "vsec": 8.18,
    "sec": 8.93
   },
   {
    "id": "stick",
    "img": "oil3",
    "title": "2. Find the dipstick",
    "big": "",
    "bigSub": "",
    "text": "Open the hood and find the dipstick. It usually has a yellow or orange handle.",
    "vsec": 5.47,
    "sec": 6.22
   },
   {
    "id": "read",
    "img": "oil4",
    "title": "3. Wipe & read",
    "big": "MIN – MAX",
    "bigSub": "",
    "text": "Pull it out, wipe it clean, push it all the way back in, then pull it out again. The oil should be between the two marks.",
    "vsec": 7.3,
    "sec": 8.05
   },
   {
    "id": "cap",
    "img": "oil5",
    "title": "4. Open the oil cap",
    "big": "",
    "bigSub": "",
    "text": "If it's low, open the cap with the oil can symbol on top of the engine.",
    "vsec": 4.92,
    "sec": 5.67
   },
   {
    "id": "pour",
    "img": "oil6",
    "title": "5. Add a little at a time",
    "big": "",
    "bigSub": "",
    "text": "Use the oil type from your owner's manual. Pour in a little, wait a minute, and check again. Never overfill.",
    "vsec": 7.2,
    "sec": 7.95
   },
   {
    "id": "end",
    "img": "oil1",
    "title": "Done",
    "big": "",
    "bigSub": "",
    "text": "Close the cap tightly, and you're done. Check it once a month. Follow for more simple car tips.",
    "vsec": 6.03,
    "sec": 6.78
   }
  ],
  "credits": {}
 },
 "svalbard": {
  "title": "THE DOOMSDAY VAULT",
  "scenes": [
   {
    "id": "hook",
    "img": "vault_dusk",
    "title": "The Doomsday Vault",
    "big": "",
    "bigSub": "",
    "text": "Inside an Arctic mountain, there's a vault built to survive the end of the world.",
    "fit": "contain",
    "vsec": 6.17,
    "sec": 6.92
   },
   {
    "id": "where",
    "img": "svalbard_mtn",
    "title": "Svalbard, Norway",
    "big": "1,300 km",
    "bigSub": "from the North Pole",
    "text": "The Svalbard Global Seed Vault sits on a Norwegian island, about 1,300 kilometres from the North Pole.",
    "fit": "contain",
    "vsec": 8.9,
    "sec": 9.65
   },
   {
    "id": "tunnel",
    "img": "tunnel",
    "title": "Into the rock",
    "big": "-18°C",
    "bigSub": "storage temperature",
    "text": "A tunnel runs over 100 metres into the rock, to chambers kept at minus 18 degrees.",
    "fit": "contain",
    "vsec": 7.75,
    "sec": 8.5
   },
   {
    "id": "seeds",
    "img": "seeds",
    "title": "The treasure",
    "big": "1.3 million+",
    "bigSub": "seed samples stored",
    "text": "The treasure inside? Seeds. Over 1.3 million samples of the world's crops.",
    "fit": "contain",
    "vsec": 6.85,
    "sec": 7.6
   },
   {
    "id": "frozen",
    "img": "vault_land",
    "title": "Built to last",
    "big": "",
    "bigSub": "",
    "text": "Even if the power fails, the permafrost should keep them frozen.",
    "fit": "contain",
    "vsec": 5.1,
    "sec": 5.85
   },
   {
    "id": "syria",
    "img": "icarda",
    "title": "The first withdrawal",
    "big": "2015",
    "bigSub": "first withdrawal",
    "text": "In 2015, war in Syria cut scientists off from their gene bank near Aleppo. So they withdrew their backup seeds, and grew them again.",
    "fit": "contain",
    "vsec": 10.5,
    "sec": 11.25
   },
   {
    "id": "end",
    "img": "vault_snow",
    "title": "One seed at a time",
    "big": "",
    "bigSub": "",
    "text": "The doomsday vault isn't just waiting for doomsday. It's already saving our crops.",
    "fit": "contain",
    "vsec": 6.17,
    "sec": 6.92
   }
  ],
  "credits": {
   "vault_dusk": "Photo: the tinz · CC BY 2.0 · Flickr",
   "svalbard_mtn": "Photo: Kitty Terwolbeck · CC BY 2.0 · Flickr",
   "tunnel": "Photo: Dag Endresen · CC BY 2.0 · Flickr",
   "seeds": "Photo: CIAT · CC BY-SA 2.0 · Flickr",
   "vault_land": "Photo: Christopher Michel · CC BY 2.0 · Flickr",
   "icarda": "ICARDA, Syria, 1991. Photo: JIRCAS · CC BY 2.0 · Flickr",
   "vault_snow": "Photo: Dag Endresen · CC BY 2.0 · Flickr"
  }
 },
 "antikythera": {
  "title": "A 2,000-YEAR-OLD COMPUTER",
  "scenes": [
   {
    "id": "hook",
    "img": "fragment",
    "title": "A 2,000-year-old computer",
    "big": "2,000+ yrs",
    "bigSub": "old, and full of gears",
    "text": "This lump of bronze came from a Greek shipwreck. Inside are gears, over two thousand years old.",
    "fit": "contain",
    "vsec": 7.42,
    "sec": 8.18
   },
   {
    "id": "wreck",
    "img": "wreck",
    "title": "The shipwreck",
    "big": "1901",
    "bigSub": "recovered off Antikythera, Greece",
    "text": "Divers found it in 1901, in a wreck off Antikythera that sank around 60 BC.",
    "fit": "contain",
    "vsec": 7.4,
    "sec": 8.15
   },
   {
    "id": "gears",
    "img": "gears",
    "title": "Hidden gears",
    "big": "30",
    "bigSub": "bronze gears survive",
    "text": "Today it survives in 82 fragments, with 30 bronze gears.",
    "fit": "contain",
    "vsec": 5.5,
    "sec": 6.25
   },
   {
    "id": "cosmos",
    "img": "front",
    "title": "A pocket cosmos",
    "big": "",
    "bigSub": "",
    "text": "Turn a handle, and it showed the Sun, the Moon and its phases, and likely the planets.",
    "vsec": 6.17,
    "sec": 6.92
   },
   {
    "id": "eclipse",
    "img": "back",
    "title": "Predicting the sky",
    "big": "223 months",
    "bigSub": "eclipse cycle on the back dial",
    "text": "It predicted eclipses, and even tracked the four-year Olympic cycle.",
    "vsec": 5.4,
    "sec": 6.15
   },
   {
    "id": "xray",
    "img": "xray",
    "title": "X-ray secrets",
    "big": "2005",
    "bigSub": "X-ray CT scans",
    "text": "In 2005, X-ray scans revealed hidden gears and thousands of tiny inscriptions.",
    "fit": "contain",
    "vsec": 7.42,
    "sec": 8.18
   },
   {
    "id": "model",
    "img": "model",
    "title": "Rebuilding it",
    "big": "2021",
    "bigSub": "UCL's new model of the front",
    "text": "In 2021, a UCL team rebuilt its lost front as a model of the cosmos.",
    "vsec": 7.15,
    "sec": 7.9
   },
   {
    "id": "end",
    "img": "museum",
    "title": "Who built it?",
    "big": "",
    "bigSub": "",
    "text": "Nothing this complex returns for a thousand years. Its maker is still a mystery.",
    "fit": "contain",
    "vsec": 6.58,
    "sec": 7.33
   }
  ],
  "credits": {
   "fragment": "Photo: Tilemahos Efthimiadis (CC BY 2.0)",
   "wreck": "Photo: Tilemahos Efthimiadis (CC BY 2.0)",
   "gears": "Photo: Tilemahos Efthimiadis (CC BY 2.0)",
   "front": "Photo: Tilemahos Efthimiadis (CC BY 2.0) · replica",
   "back": "Photo: Tilemahos Efthimiadis (CC BY 2.0) · replica",
   "xray": "Photo: Tilemahos Efthimiadis (CC BY 2.0)",
   "model": "Photo: Tilemahos Efthimiadis (CC BY 2.0) · replica",
   "museum": "Photo: Weekend Wayfarers (CC BY 2.0)"
  }
 },
 "baalbek": {
  "title": "THE BIGGEST STONE EVER CUT",
  "scenes": [
   {
    "id": "hook",
    "img": "quarry",
    "title": "The biggest stone ever cut",
    "big": "~1,650 t",
    "bigSub": "one single block",
    "text": "See the tiny person? These are the biggest stone blocks known from the ancient world, and they never left the quarry.",
    "fit": "contain",
    "vsec": 8.47,
    "sec": 9.22
   },
   {
    "id": "temple",
    "img": "temple",
    "title": "Baalbek, Lebanon",
    "big": "AD 60",
    "bigSub": "Temple of Jupiter completed",
    "text": "This is Baalbek, Lebanon, and its giant Roman Temple of Jupiter.",
    "vsec": 5.58,
    "sec": 6.33
   },
   {
    "id": "columns",
    "img": "columns",
    "title": "Giant columns",
    "big": "~20 m",
    "bigSub": "six columns still stand",
    "text": "Six columns still stand, each about twenty metres tall.",
    "vsec": 4.7,
    "sec": 5.45
   },
   {
    "id": "trilithon",
    "img": "trilithon",
    "title": "The trilithon",
    "big": "~800 t",
    "bigSub": "each of three blocks",
    "text": "In its base: the trilithon, three blocks of about eight hundred tonnes each.",
    "fit": "contain",
    "vsec": 5.7,
    "sec": 6.45
   },
   {
    "id": "pregnant",
    "img": "pregnant",
    "title": "Stone of the Pregnant Woman",
    "big": "~1,000 t",
    "bigSub": "left in the quarry",
    "text": "In the quarry lies the Stone of the Pregnant Woman: about a thousand tonnes, never moved.",
    "fit": "contain",
    "vsec": 6.9,
    "sec": 7.65
   },
   {
    "id": "find",
    "img": "block2014",
    "title": "An even bigger one",
    "big": "2014",
    "bigSub": "19.6 m long, ~1,650 tonnes",
    "text": "In 2014, archaeologists found a bigger one beside it: about sixteen hundred and fifty tonnes.",
    "fit": "contain",
    "vsec": 8.25,
    "sec": 9.0
   },
   {
    "id": "how",
    "img": "wall",
    "title": "How did they do it?",
    "big": "~800 m",
    "bigSub": "from quarry to temple",
    "text": "Most archaeologists credit Roman engineers, with ramps, rollers and capstans, from a quarry just uphill.",
    "fit": "contain",
    "vsec": 8.6,
    "sec": 9.35
   },
   {
    "id": "end",
    "img": "ruins",
    "title": "Still debated",
    "big": "",
    "bigSub": "",
    "text": "But exactly how the trilithon was lifted is still debated.",
    "fit": "contain",
    "vsec": 4.8,
    "sec": 5.55
   }
  ],
  "credits": {
   "quarry": "Photo: Lodo27 (CC BY-SA 2.0)",
   "temple": "Photo: Arian Zwegers (CC BY 2.0)",
   "columns": "Photo: Eusebius@Commons (CC BY 2.0)",
   "trilithon": "Photo: Lodo27 (CC BY-SA 2.0)",
   "pregnant": "Photo: Following Hadrian (CC BY-SA 2.0)",
   "block2014": "Photo: Lodo27 (CC BY-SA 2.0)",
   "wall": "Photo: Lodo27 (CC BY-SA 2.0)",
   "ruins": "Photo: ISAW / isawnyu (CC BY 2.0)"
  }
 }
};
export const gzFrames = (slug: string, fps = 30) => STORIES[slug].scenes.reduce((a, s) => a + Math.round(s.sec * fps), 0);
