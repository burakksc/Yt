import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  readonly title: string;
  readonly subtitle: string;
  readonly accent: string;
  readonly background: string;
};

// Reusable title card for YouTube intros (16:9) and Shorts hooks (9:16).
export const TitleCard: React.FC<Props> = ({
  title,
  subtitle,
  accent,
  background,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, durationInFrames } = useVideoConfig();
  const scale = width / 1920;

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const subEnter = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const exit = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        justifyContent: "center",
        alignItems: "center",
        padding: 120 * scale,
        opacity: exit,
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 160 * enter * scale * 2,
          height: 12 * scale * 2,
          backgroundColor: accent,
          borderRadius: 999,
          marginBottom: 48 * scale * 2,
        }}
      />
      <h1
        style={{
          color: "white",
          fontSize: 140 * scale * (width < 1200 ? 1.6 : 1),
          fontWeight: 800,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.05,
          transform: `translateY(${(1 - enter) * 60}px)`,
          opacity: enter,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 56 * scale * (width < 1200 ? 1.6 : 1),
          marginTop: 32 * scale * 2,
          textAlign: "center",
          transform: `translateY(${(1 - subEnter) * 40}px)`,
          opacity: subEnter,
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
