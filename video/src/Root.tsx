import { Composition, Still } from "remotion";
import { TitleCard } from "./components/TitleCard";
import { Eksi100, EKSI100_DURATION, EKSI100_FPS } from "./videos/eksi-100";
import { Eksi100Hikaye } from "./videos/eksi-100-hikaye";
import { CozyAlley, LOOP_FPS, LOOP_FRAMES } from "./videos/cozy-alley";
import { SlingVideo } from "./videos/sling";
import { BebekSling } from "./videos/bebek-sling";
import { EsnekSargi } from "./videos/esnek-sargi";
import { Test3D } from "./videos/test-3d";
import { Avatar } from "./videos/brand/Avatar";
import { IstanbulAlti } from "./videos/istanbul-alti";
import { CozyFireplace, FIRE_FPS, FIRE_LOOP } from "./videos/cozy-fireplace";
import { ALTI_FPS, ALTI_FRAMES } from "./videos/istanbul-alti/story";
import { SARGI_FPS, SARGI_FRAMES } from "./videos/esnek-sargi/story";
import { BEBEK_FPS, BEBEK_FRAMES } from "./videos/bebek-sling/story";
import { SLING_FPS, SLING_FRAMES } from "./videos/sling/story";
import { STORY_FPS, STORY_FRAMES } from "./videos/eksi-100-hikaye/story";

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
