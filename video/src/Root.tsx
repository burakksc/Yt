import { Composition } from "remotion";
import { TitleCard } from "./components/TitleCard";

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
    </>
  );
};
