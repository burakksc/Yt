// Short (1080x1920): "7 places Russia hides" — NASA Blue Marble map (public domain) zooming to each real
// location + real Wikimedia Commons photos (CC BY / BY-SA, credited) + English narration (Michael).
import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordCaptions } from "../../components/WordCaptions";
import { GZ_LEAD, GZ_STORY, type GzScene } from "./story";

const { fontFamily } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });

const ACCENT = "#ffcc00";
const RED = "#ff3b3b";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const H = 1920;

// world.jpg = NASA Blue Marble (public domain), equirectangular: lon -180..180, lat 90..-90, 3840x1920
const MAP = { lon0: -180, lat0: 90, ppd: 3840 / 360, w: 3840, h: 1920 };

export const CREDITS: Record<string, string> = {
  patomskiy: "Photo: Dmitry Semenov (Imaggeo) · CC BY 4.0 · Wikimedia Commons",
  kola: "Photo: Alexander Novikov · CC BY-SA 4.0 · Wikimedia Commons",
  batagaika: "Photo: Courtin et al. · CC BY 4.0 · Wikimedia Commons",
  yamantau: "Photo: Pesotsky · CC BY 3.0 · Wikimedia Commons",
};

/** Equirectangular view of the map centred on (lat, lon) showing `span` degrees of longitude across `w` px. */
const MapView: React.FC<{ lat: number; lon: number; span: number; w: number; h: number; children?: React.ReactNode }> = ({
  lat,
  lon,
  span,
  w,
  h,
  children,
}) => {
  const s = w / (span * MAP.ppd);
  const left = w / 2 - (lon - MAP.lon0) * MAP.ppd * s;
  const top = h / 2 - (MAP.lat0 - lat) * MAP.ppd * s;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0a1440" }}>
      <Img
        src={staticFile("rusya-gizli/img/world.jpg")}
        style={{ position: "absolute", left, top, width: MAP.w * s, height: MAP.h * s, maxWidth: "none" }}
      />
      {children}
    </div>
  );
};

/** screen position of (lat,lon) inside a MapView */
const proj = (lat: number, lon: number, c: { lat: number; lon: number; span: number; w: number; h: number }) => {
  const s = c.w / (c.span * MAP.ppd);
  return { x: c.w / 2 + (lon - c.lon) * MAP.ppd * s, y: c.h / 2 + (c.lat - lat) * MAP.ppd * s };
};

const Pin: React.FC<{ x: number; y: number; size?: number; label?: string; delay?: number }> = ({
  x,
  y,
  size = 26,
  label,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 180 } });
  const ring = ((frame - delay) % 40) / 40;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${pop})` }}>
      <div
        style={{
          position: "absolute",
          left: -size * 1.5 * (1 + ring),
          top: -size * 1.5 * (1 + ring),
          width: size * 3 * (1 + ring),
          height: size * 3 * (1 + ring),
          borderRadius: "50%",
          border: `4px solid ${RED}`,
          opacity: 1 - ring,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: RED,
          border: "4px solid white",
          boxShadow: "0 0 24px rgba(255,59,59,0.9)",
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            left: size,
            top: -24,
            whiteSpace: "nowrap",
            fontSize: 34,
            fontWeight: 900,
            color: "white",
            textShadow: "0 2px 10px #000, 0 0 4px #000",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

const coord = (lat: number, lon: number) => `${lat.toFixed(2)}°N · ${lon.toFixed(2)}°E`;

const ScenePage: React.FC<{ scene: GzScene; index: number }> = ({ scene, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frames = Math.round(scene.sec * fps);
  const p = interpolate(frame, [0, frames], [0, 1], clamp);
  const fade = interpolate(frame, [0, 6, frames - 6, frames], [0, 1, 1, 0], clamp);
  const t = spring({ frame, fps, config: { damping: 14 } });
  const big = spring({ frame: frame - Math.round(1.6 * fps), fps, config: { damping: 12 } });
  const overview = scene.num === 0;
  // camera: overview = whole Russia; place = fly from wide to close
  const span = overview ? interpolate(p, [0, 1], [150, 135]) : interpolate(Math.min(1, p * 1.6), [0, 1], [110, 14], { easing: (x) => 1 - Math.pow(1 - x, 3) });
  const cam = overview
    ? { lat: 64, lon: 100, span, w: W, h: H }
    : {
        lat: interpolate(Math.min(1, p * 1.6), [0, 1], [64, scene.lat]),
        lon: interpolate(Math.min(1, p * 1.6), [0, 1], [100, scene.lon]),
        span,
        w: W,
        h: H,
      };
  // photo scenes: the map flies in, then the real photo takes over (map stays as an inset)
  const photoIn = scene.photo ? interpolate(frame, [Math.round(2.4 * fps), Math.round(3.0 * fps)], [0, 1], clamp) : 0;
  const pin = proj(scene.lat, scene.lon, cam);
  const inset = { lat: scene.lat, lon: scene.lon, span: 30, w: 330, h: 330 };
  return (
    <AbsoluteFill style={{ opacity: index === 0 ? 1 : fade }}>
      <MapView {...cam}>
        {overview
          ? GZ_STORY.filter((s) => s.num > 0).map((s, i) => {
              const q = proj(s.lat, s.lon, cam);
              return <Pin key={s.id} x={q.x} y={q.y} size={18} delay={8 + i * 5} label={`${s.num}`} />;
            })
          : (
            <>
              <Pin x={pin.x} y={pin.y} delay={Math.round(1.2 * fps)} />
              {scene.id === "jeannette" && (
                <div
                  style={{
                    position: "absolute",
                    left: pin.x - 150,
                    top: pin.y - 90,
                    width: 300,
                    height: 180,
                    background: "#000",
                    opacity: interpolate(frame, [2 * fps, 2.2 * fps], [0, frame % 20 < 3 ? 0.85 : 1], clamp),
                    boxShadow: "0 0 30px rgba(0,0,0,0.8)",
                  }}
                />
              )}
              {scene.id === "lenin" && (
                <div
                  style={{
                    position: "absolute",
                    left: pin.x,
                    top: pin.y - 170,
                    transform: `translate(-50%,-50%) rotate(-8deg) scale(${spring({ frame: frame - 2 * fps, fps, config: { damping: 12 } })})`,
                    fontSize: 150,
                    fontWeight: 900,
                    letterSpacing: 18,
                    color: "#1f6b2c",
                    WebkitTextStroke: "4px #9be38f",
                    textShadow: "0 0 30px rgba(0,0,0,0.6)",
                  }}
                >
                  LENIN
                </div>
              )}
              {scene.id === "yamal" &&
                [[-60, 40], [50, -30], [10, 70], [-20, -60]].map(([dx, dy], i) => {
                  const s2 = spring({ frame: frame - (2 + i * 0.5) * fps, fps, config: { damping: 8 } });
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: pin.x + dx - 22,
                        top: pin.y + dy - 22,
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #000 0 45%, #3a2a1a 60%, rgba(0,0,0,0) 72%)",
                        transform: `scale(${s2})`,
                      }}
                    />
                  );
                })}
            </>
          )}
      </MapView>
      {scene.photo && (
        <AbsoluteFill style={{ opacity: photoIn, overflow: "hidden" }}>
          <Img
            src={staticFile(`rusya-gizli/img/${scene.id}.jpg`)}
            style={{
              position: "absolute",
              height: "100%",
              left: "50%",
              top: 0,
              transform: `translateX(-50%) translateX(${(index % 2 ? 1 : -1) * interpolate(p, [0, 1], [-120, 120])}px) scale(${interpolate(p, [0, 1], [1.05, 1.15])})`,
            }}
          />
          <div style={{ position: "absolute", right: 40, top: 560, width: 330, height: 330, borderRadius: 24, overflow: "hidden", border: "5px solid white", boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
            <MapView {...inset}>
              <Pin x={165} y={165} size={18} />
            </MapView>
          </div>
          <div style={{ position: "absolute", left: 40, top: 1655, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.75)", textShadow: "0 2px 6px #000" }}>
            {CREDITS[scene.id]}
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.8) 100%)" }}
      />
      <div style={{ position: "absolute", top: 230, left: 50, right: 50, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * -30}px)` }}>
        {scene.num > 0 && (
          <div style={{ display: "inline-block", padding: "4px 26px", borderRadius: 40, background: RED, color: "white", fontSize: 46, fontWeight: 900, marginBottom: 14 }}>
            #{scene.num}
          </div>
        )}
        <div style={{ fontSize: overview ? 92 : 78, fontWeight: 900, color: "white", lineHeight: 1.05, textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}>
          {scene.name.toUpperCase()}
        </div>
        {scene.num > 0 && (
          <div style={{ marginTop: 12, fontSize: 36, fontWeight: 800, color: ACCENT, textShadow: "0 2px 10px #000" }}>
            📍 {coord(scene.lat, scene.lon)}
          </div>
        )}
      </div>
      {scene.big && (
        <div style={{ position: "absolute", top: 1000, left: 40, right: 40, textAlign: "center", opacity: big, transform: `scale(${0.7 + 0.3 * big})` }}>
          <div style={{ fontSize: 130, fontWeight: 900, color: ACCENT, lineHeight: 1, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{scene.big}</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: "white", marginTop: 12, textShadow: "0 3px 14px rgba(0,0,0,0.95)" }}>{scene.bigSub}</div>
        </div>
      )}
      <Sequence from={Math.round(GZ_LEAD * fps)} layout="none">
        <Audio src={staticFile(`rusya-gizli/en/${scene.id}.wav`)} />
        <WordCaptions text={scene.text} durationInFrames={Math.round(scene.vsec * fps)} top={1420} highlight={ACCENT} locale="en-US" />
      </Sequence>
    </AbsoluteFill>
  );
};

export const RusyaGizliEN: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#0a1440" }}>
      <Series>
        {GZ_STORY.map((scene, i) => (
          <Series.Sequence key={scene.id} durationInFrames={Math.round(scene.sec * fps)} premountFor={fps}>
            <ScenePage scene={scene} index={i} />
          </Series.Sequence>
        ))}
      </Series>
      <Audio src={staticFile("rusya-koyler/bed.m4a")} volume={0.15} />
    </AbsoluteFill>
  );
};
