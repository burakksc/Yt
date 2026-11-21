import { Composition, Still } from "remotion";
import { TitleCard } from "./components/TitleCard";
import {
  Eksi100,
  EKSI100_DURATION,
  EKSI100_EN_SECS,
  EKSI100_FPS,
} from "./videos/eksi-100";
import { Eksi100Hikaye } from "./videos/eksi-100-hikaye";
import { CozyAlley, LOOP_FPS, LOOP_FRAMES } from "./videos/cozy-alley";
import { SlingVideo } from "./videos/sling";
import { BebekSling } from "./videos/bebek-sling";
import { EsnekSargi } from "./videos/esnek-sargi";
import { Test3D } from "./videos/test-3d";
import { Avatar } from "./videos/brand/Avatar";
import { IstanbulAlti, IstanbulAltiTR } from "./videos/istanbul-alti";
import { KarTanesiShort } from "./videos/kar-tanesi";
import { AtgIkamet } from "./videos/atg-ikamet";
import { RusyaKoylerEN } from "./videos/rusya-koyler";
import { BranEN } from "./videos/bran";
import { CozyRoom, ROOM_FPS, ROOM_FRAMES } from "./videos/cozy-room";
import { BRAN_FPS, BRAN_FRAMES } from "./videos/bran/story";
import { RU_FPS, RU_FRAMES } from "./videos/rusya-koyler/story";
import { ATG_FPS, ATG_FRAMES } from "./videos/atg-ikamet/timeline";
import {
  CikolataEN,
  CikolataEN3D,
  CikolataTR,
  CikolataTR3D,
} from "./videos/cikolata";
import { CIK_EN } from "./videos/cikolata/story_en";
import { CIK_TR } from "./videos/cikolata/story_tr";
import { CIK_FPS, cikFrames } from "./videos/cikolata/types";
import {
  KAR_FPS,
  KAR_FRAMES,
  KAR_STORY_EN,
  karFrames,
} from "./videos/kar-tanesi/story";
import { ALTI_FRAMES_TR } from "./videos/istanbul-alti/story_tr";
import {
  IstanbulAltiShortEN,
  IstanbulAltiShortTR,
} from "./videos/istanbul-alti/short";
import { ALTI_SHORT_EN_FRAMES } from "./videos/istanbul-alti/story_short_en";
import { ALTI_SHORT_FRAMES } from "./videos/istanbul-alti/story_short";
import { CozyFireplace, FIRE_FPS, FIRE_LOOP } from "./videos/cozy-fireplace";
import { ALTI_FPS, ALTI_FRAMES } from "./videos/istanbul-alti/story";
import { SARGI_FPS, SARGI_FRAMES } from "./videos/esnek-sargi/story";
import { BEBEK_FPS, BEBEK_FRAMES } from "./videos/bebek-sling/story";
import { SLING_FPS, SLING_FRAMES } from "./videos/sling/story";
import { STORY_FPS, STORY_FRAMES } from "./videos/eksi-100-hikaye/story";
import { RusyaGizliEN } from "./videos/rusya-gizli";
import { GizemShort } from "./videos/gizem";
import { gzFrames } from "./videos/gizem/stories";
import { GZ_FPS, GZ_FRAMES } from "./videos/rusya-gizli/story";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="YouTubeIntro"
        component={TitleCard}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Video Başlığı",
          subtitle: "Alt başlık / hook cümlesi",
          accent: "#ff3b30",
          background: "#0b0b0f",
        }}
      />
      <Composition
        id="ShortsHook"
        component={TitleCard}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "Bunu biliyor muydun?",
          subtitle: "3 saniyede hook",
          accent: "#ffcc00",
          background: "#111111",
        }}
      />
      <Composition
        id="Eksi100"
        component={Eksi100}
        durationInFrames={EKSI100_DURATION}
        fps={EKSI100_FPS}
        width={1080}
        height={1920}
        defaultProps={{
          title: "-100°C'DE",
          subtitle: "NELER OLUR?",
          captions: [
            {
              badge: "SICAKLIK DÜŞÜYOR",
              text: "Dünya -100°C olsaydı ne olurdu?",
            },
            {
              badge: "1 · İNSAN",
              text: "Açıktaki cilt saniyeler içinde donar. Dakikalar içinde hipotermi başlar.",
            },
            {
              badge: "2 · SU",
              text: "Borular patlar, göller ve denizler katılaşır.",
            },
            {
              badge: "3 · ELEKTRONİK",
              text: "Piller çöker, telefonlar ve bilgisayarlar kapanır.",
            },
            {
              badge: "4 · ARAÇLAR",
              text: "Yağ koyulaşır, yakıt jelleşir, lastikler kırılganlaşır.",
            },
            {
              badge: "5 · ELEKTRİK",
              text: "Kablolar kopar, şehir karanlığa gömülür.",
            },
            {
              badge: "6 · YAPILAR",
              text: "Beton ve çelik çatlar, binalar zarar görür.",
            },
            { badge: "7 · DOĞA", text: "Bitkiler ölür, tarım biter." },
            {
              badge: "8 · HAVA",
              text: "Nefesin çıkar çıkmaz buz kristallerine dönüşür.",
            },
            { badge: "SON", text: 'Takip et, bir sonraki "ne olurdu?" için.' },
          ],
        }}
      />
      <Composition
        id="Eksi100EN"
        component={Eksi100}
        durationInFrames={Math.round(
          EKSI100_EN_SECS.reduce((a, b) => a + b, 0) * EKSI100_FPS,
        )}
        fps={EKSI100_FPS}
        width={1080}
        height={1920}
        defaultProps={{
          lang: "en" as const,
          title: "AT -100°C",
          subtitle: "WHAT HAPPENS?",
          captions: [
            {
              badge: "TEMPERATURE DROPPING",
              text: "What if the whole world dropped to minus 100 degrees Celsius?",
            },
            {
              badge: "1 · HUMANS",
              text: "Exposed skin freezes in seconds. Hypothermia sets in within minutes.",
            },
            {
              badge: "2 · WATER",
              text: "Pipes burst, and lakes freeze solid.",
            },
            {
              badge: "3 · ELECTRONICS",
              text: "Batteries die. Phones and computers shut down.",
            },
            {
              badge: "4 · VEHICLES",
              text: "Oil turns thick, diesel gels, and tires turn brittle.",
            },
            {
              badge: "5 · POWER",
              text: "Power lines snap, and cities go dark.",
            },
            {
              badge: "6 · BUILDINGS",
              text: "Concrete and steel crack, and buildings get damaged.",
            },
            {
              badge: "7 · NATURE",
              text: "Plants die, and farming comes to an end.",
            },
            {
              badge: "8 · AIR",
              text: "Your breath turns into ice crystals the moment you exhale.",
            },
            {
              badge: "THE END",
              text: "The coldest ever recorded is minus 89 degrees, in Antarctica. Minus 100? Never measured. Follow for more.",
            },
          ],
        }}
      />
      <Composition
        id="Eksi100Hikaye"
        component={Eksi100Hikaye}
        durationInFrames={STORY_FRAMES}
        fps={STORY_FPS}
        width={1080}
        height={1920}
        defaultProps={{
          hookTop: "-100°C",
          hookBottom: "KAÇ SAAT DAYANIRSIN?",
        }}
      />
      <Composition
        id="CozyAlleyLoop"
        component={CozyAlley}
        durationInFrames={LOOP_FRAMES}
        fps={LOOP_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="SlingBaglama"
        component={SlingVideo}
        durationInFrames={SLING_FRAMES}
        fps={SLING_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BebekSling"
        component={BebekSling}
        durationInFrames={BEBEK_FRAMES}
        fps={BEBEK_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="EsnekSargi"
        component={EsnekSargi}
        durationInFrames={SARGI_FRAMES}
        fps={SARGI_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Test3D"
        component={Test3D}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still
        id="AvatarNight"
        component={Avatar}
        width={800}
        height={800}
        defaultProps={{ variant: "night" as const }}
      />
      <Still
        id="AvatarWarm"
        component={Avatar}
        width={800}
        height={800}
        defaultProps={{ variant: "warm" as const }}
      />
      <Still
        id="AvatarMonogram"
        component={Avatar}
        width={800}
        height={800}
        defaultProps={{ variant: "monogram" as const }}
      />
      <Composition
        id="IstanbulAlti"
        component={IstanbulAlti}
        durationInFrames={ALTI_FRAMES}
        fps={ALTI_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="CozyNoel"
        component={CozyRoom}
        durationInFrames={ROOM_FRAMES}
        fps={ROOM_FPS}
        width={1920}
        height={1080}
        defaultProps={{ scene: "noel" }}
      />
      <Composition
        id="CozyNycB"
        component={CozyRoom}
        durationInFrames={ROOM_FRAMES}
        fps={ROOM_FPS}
        width={1920}
        height={1080}
        defaultProps={{ scene: "nycB" }}
      />
      <Composition
        id="CozyNycF"
        component={CozyRoom}
        durationInFrames={ROOM_FRAMES}
        fps={ROOM_FPS}
        width={1920}
        height={1080}
        defaultProps={{ scene: "nycF" }}
      />
      <Composition
        id="BranEN"
        component={BranEN}
        durationInFrames={BRAN_FRAMES}
        fps={BRAN_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemVoyager"
        component={GizemShort}
        defaultProps={{ slug: "voyager" }}
        durationInFrames={gzFrames("voyager")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemResin"
        component={GizemShort}
        defaultProps={{ slug: "resin" }}
        durationInFrames={gzFrames("resin")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemEngine"
        component={GizemShort}
        defaultProps={{ slug: "engine" }}
        durationInFrames={gzFrames("engine")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemYonaguni"
        component={GizemShort}
        defaultProps={{ slug: "yonaguni" }}
        durationInFrames={gzFrames("yonaguni")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemOil"
        component={GizemShort}
        defaultProps={{ slug: "oil" }}
        durationInFrames={gzFrames("oil")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemSvalbard"
        component={GizemShort}
        defaultProps={{ slug: "svalbard" }}
        durationInFrames={gzFrames("svalbard")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemAntikythera"
        component={GizemShort}
        defaultProps={{ slug: "antikythera" }}
        durationInFrames={gzFrames("antikythera")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemBaalbek"
        component={GizemShort}
        defaultProps={{ slug: "baalbek" }}
        durationInFrames={gzFrames("baalbek")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemYamantau"
        component={GizemShort}
        defaultProps={{ slug: "yamantau" }}
        durationInFrames={gzFrames("yamantau")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemSentinel"
        component={GizemShort}
        defaultProps={{ slug: "sentinel" }}
        durationInFrames={gzFrames("sentinel")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemSnakeIsland"
        component={GizemShort}
        defaultProps={{ slug: "snakeisland" }}
        durationInFrames={gzFrames("snakeisland")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemStardust"
        component={GizemShort}
        defaultProps={{ slug: "stardust" }}
        durationInFrames={gzFrames("stardust")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemMetro2"
        component={GizemShort}
        defaultProps={{ slug: "metro2" }}
        durationInFrames={gzFrames("metro2")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemBermuda"
        component={GizemShort}
        defaultProps={{ slug: "bermuda" }}
        durationInFrames={gzFrames("bermuda")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemDerinkuyu"
        component={GizemShort}
        defaultProps={{ slug: "derinkuyu" }}
        durationInFrames={gzFrames("derinkuyu")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemDay1900"
        component={GizemShort}
        defaultProps={{ slug: "day1900" }}
        durationInFrames={gzFrames("day1900")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemKnockerUp"
        component={GizemShort}
        defaultProps={{ slug: "knockerup" }}
        durationInFrames={gzFrames("knockerup")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemFlannan"
        component={GizemShort}
        defaultProps={{ slug: "flannan" }}
        durationInFrames={gzFrames("flannan")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemMaryCeleste"
        component={GizemShort}
        defaultProps={{ slug: "maryceleste" }}
        durationInFrames={gzFrames("maryceleste")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemLector"
        component={GizemShort}
        defaultProps={{ slug: "lector" }}
        durationInFrames={gzFrames("lector")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemHumanComputers"
        component={GizemShort}
        defaultProps={{ slug: "humancomputers" }}
        durationInFrames={gzFrames("humancomputers")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemChocolate"
        component={GizemShort}
        defaultProps={{ slug: "chocolate" }}
        durationInFrames={gzFrames("chocolate")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemRussia"
        component={GizemShort}
        defaultProps={{ slug: "russia" }}
        durationInFrames={gzFrames("russia")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemBloop"
        component={GizemShort}
        defaultProps={{ slug: "bloop" }}
        durationInFrames={gzFrames("bloop")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemTaos"
        component={GizemShort}
        defaultProps={{ slug: "taos" }}
        durationInFrames={gzFrames("taos")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemWow"
        component={GizemShort}
        defaultProps={{ slug: "wow" }}
        durationInFrames={gzFrames("wow")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GizemVoynich"
        component={GizemShort}
        defaultProps={{ slug: "voynich" }}
        durationInFrames={gzFrames("voynich")}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RusyaGizliEN"
        component={RusyaGizliEN}
        durationInFrames={GZ_FRAMES}
        fps={GZ_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="RusyaKoylerEN"
        component={RusyaKoylerEN}
        durationInFrames={RU_FRAMES}
        fps={RU_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="AtgIkamet"
        component={AtgIkamet}
        durationInFrames={ATG_FRAMES}
        fps={ATG_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CikolataEN3D"
        component={CikolataEN3D}
        durationInFrames={cikFrames(CIK_EN)}
        fps={CIK_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CikolataTR3D"
        component={CikolataTR3D}
        durationInFrames={cikFrames(CIK_TR)}
        fps={CIK_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CikolataEN"
        component={CikolataEN}
        durationInFrames={cikFrames(CIK_EN)}
        fps={CIK_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CikolataTR"
        component={CikolataTR}
        durationInFrames={cikFrames(CIK_TR)}
        fps={CIK_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="KarTanesiShort"
        component={KarTanesiShort}
        durationInFrames={KAR_FRAMES}
        fps={KAR_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="KarTanesiShortEN"
        component={KarTanesiShort}
        durationInFrames={karFrames(KAR_STORY_EN)}
        fps={KAR_FPS}
        width={1080}
        height={1920}
        defaultProps={{ lang: "en" as const }}
      />
      <Composition
        id="IstanbulAltiShortEN"
        component={IstanbulAltiShortEN}
        durationInFrames={ALTI_SHORT_EN_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IstanbulAltiShortTR"
        component={IstanbulAltiShortTR}
        durationInFrames={ALTI_SHORT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IstanbulAltiTR"
        component={IstanbulAltiTR}
        durationInFrames={ALTI_FRAMES_TR}
        fps={ALTI_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="CozyFireplaceLoop"
        component={CozyFireplace}
        durationInFrames={FIRE_LOOP}
        fps={FIRE_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
