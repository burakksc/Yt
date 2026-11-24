// 3D style test (free, procedural): a Roman "urinator" free diver descending with a stone weight.
// No external models/keys. All motion from useCurrentFrame() (never useFrame()).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin", "latin-ext"],
});

const FOG = "#0d5670";
const SURFACE_Y = 20;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Diver hip position over time (world). */
const diverPos = (p: number) =>
  new THREE.Vector3(
    interpolate(p, [0, 1], [1.4, -0.4]),
    interpolate(p, [0, 1], [11, 3.4]),
    0,
  );

/** Procedural caustic-like texture (bright wavy cell lines). */
const useCausticTexture = (seed: string) =>
  useMemo(() => {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const g = c.getContext("2d")!;
    g.fillStyle = "black";
    g.fillRect(0, 0, size, size);
    g.lineCap = "round";
    for (let i = 0; i < 140; i++) {
      const x = random(`${seed}x${i}`) * size;
      const y = random(`${seed}y${i}`) * size;
      const r = 20 + random(`${seed}r${i}`) * 50;
      g.strokeStyle = `rgba(255,255,255,${0.25 + random(`${seed}a${i}`) * 0.5})`;
      g.lineWidth = 1.5 + random(`${seed}w${i}`) * 3;
      g.beginPath();
      for (let k = 0; k <= 7; k++) {
        const ang = (k / 7) * Math.PI * 2;
        const rr = r * (0.7 + random(`${seed}k${i}-${k}`) * 0.6);
        const px = x + Math.cos(ang) * rr;
        const py = y + Math.sin(ang) * rr;
        if (k === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.stroke();
    }
    const b = document.createElement("canvas");
    b.width = size;
    b.height = size;
    const bg = b.getContext("2d")!;
    bg.filter = "blur(5px)";
    bg.drawImage(c, 0, 0);
    bg.filter = "none";
    bg.globalAlpha = 0.6;
    bg.drawImage(c, 0, 0);
    const t = new THREE.CanvasTexture(b);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [seed]);

const Skin: React.FC = () => (
  <meshStandardMaterial color="#b4825f" roughness={0.55} />
);

const Limb: React.FC<{
  len: number;
  r: number;
  children?: React.ReactNode;
  rot?: [number, number, number];
  pos?: [number, number, number];
}> = ({ len, r, children, rot = [0, 0, 0], pos = [0, 0, 0] }) => (
  // Joint at the group origin, limb hangs along -Y.
  <group position={pos} rotation={rot}>
    <mesh position={[0, -len / 2, 0]}>
      <capsuleGeometry args={[r, len, 6, 16]} />
      <Skin />
    </mesh>
    <group position={[0, -len, 0]}>{children}</group>
  </group>
);

const Diver: React.FC<{ frame: number; p: number }> = ({ frame, p }) => {
  const kick = Math.sin(frame / 5);
  const pos = diverPos(p);
  const sway = Math.sin(frame / 22) * 0.06;
  return (
    // Head points down-left (diving head first, stone leading).
    <group position={pos} rotation={[0.15, 0.4, 2.75 + sway]}>
      {/* torso */}
      <mesh position={[0, 0.3, 0]} scale={[1.15, 1, 0.75]}>
        <capsuleGeometry args={[0.17, 0.42, 8, 20]} />
        <Skin />
      </mesh>
      {[-1, 1].map((k) => (
        <mesh key={k} position={[k * 0.2, 0.52, 0]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <Skin />
        </mesh>
      ))}
      {/* loincloth */}
      <mesh position={[0, -0.02, 0]} scale={[1.1, 1, 0.8]}>
        <cylinderGeometry args={[0.19, 0.21, 0.22, 20]} />
        <meshStandardMaterial color="#d9ccb0" roughness={0.9} />
      </mesh>
      {/* net bag with shells */}
      <group position={[0.2, -0.02, 0.12]}>
        <mesh>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color="#7a5a32" wireframe />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.08, 12, 10]} />
          <meshStandardMaterial color="#c9a98a" roughness={0.8} />
        </mesh>
      </group>
      {/* neck + head */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.12, 12]} />
        <Skin />
      </mesh>
      <group position={[0, 0.82, 0]}>
        <mesh scale={[0.9, 1.08, 1]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <Skin />
        </mesh>
        <mesh position={[0, 0.025, -0.01]} scale={[0.95, 1.05, 1.05]}>
          <sphereGeometry args={[0.122, 32, 32, 0, Math.PI * 2, 0, 1.6]} />
          <meshStandardMaterial color="#20140d" roughness={0.9} />
        </mesh>
      </group>
      {/* arms overhead, holding the stone */}
      {[-1, 1].map((s) => (
        <Limb key={s} len={0.3} r={0.05} pos={[s * 0.22, 0.55, 0]} rot={[0.15, 0, Math.PI + s * 0.24]}>
          <Limb len={0.28} r={0.042} rot={[0, 0, s * 0.1]}>
            <mesh position={[0, -0.05, 0]} scale={[0.8, 1.3, 0.5]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <Skin />
            </mesh>
          </Limb>
        </Limb>
      ))}
      <mesh position={[0, 1.2, 0.02]} rotation={[0.4, 0.3, 0.2]} scale={[1.2, 0.8, 0.9]}>
        <dodecahedronGeometry args={[0.15, 1]} />
        <meshStandardMaterial color="#6d675e" roughness={1} flatShading />
      </mesh>
      {/* legs, flutter kick */}
      {[-1, 1].map((s) => (
        <Limb key={s} len={0.44} r={0.07} pos={[s * 0.1, -0.08, 0]} rot={[kick * 0.35 * s, 0, s * 0.04]}>
          <Limb len={0.42} r={0.055} rot={[Math.max(0, kick * s) * 0.5, 0, 0]}>
            <mesh position={[0, -0.07, 0.02]} scale={[0.45, 1.1, 0.35]}>
              <sphereGeometry args={[0.1, 14, 12]} />
              <Skin />
            </mesh>
          </Limb>
        </Limb>
      ))}
    </group>
  );
};

const Rope: React.FC<{ p: number }> = ({ p }) => {
  const geom = useMemo(() => {
    const a = new THREE.Vector3(2.6, SURFACE_Y - 0.2, -0.6);
    const b = diverPos(p);
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0.5, 0, 0));
    return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 40, 0.018, 6, false);
  }, [p]);
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#8b6a3e" roughness={1} />
    </mesh>
  );
};

const Seabed: React.FC<{ frame: number }> = ({ frame }) => {
  const caustic = useCausticTexture("bed");
  caustic.repeat.set(5, 5);
  caustic.offset.set(frame * 0.0016, frame * 0.0009);
  const grass = useMemo(
    () =>
      new Array(160).fill(0).map((_, i) => ({
        x: (random(`gx${i}`) - 0.5) * 24,
        z: (random(`gz${i}`) - 0.5) * 18 - 2,
        h: 0.5 + random(`gh${i}`) * 1.1,
        ph: random(`gp${i}`) * 6,
      })),
    [],
  );
  const rocks = useMemo(
    () =>
      new Array(26).fill(0).map((_, i) => ({
        x: (random(`rx${i}`) - 0.5) * 22,
        z: (random(`rz${i}`) - 0.5) * 16 - 2,
        s: 0.2 + random(`rs${i}`) * 0.9,
      })),
    [],
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#c2a878" roughness={1} emissive="#9fe8ff" emissiveMap={caustic} emissiveIntensity={0.4} />
      </mesh>
      {rocks.map((r, i) => (
        <mesh key={i} position={[r.x, r.s * 0.3, r.z]} scale={[r.s, r.s * 0.6, r.s]} rotation={[0, r.x, 0]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#5f6152" roughness={1} flatShading />
        </mesh>
      ))}
      {grass.map((g, i) => (
        <mesh
          key={i}
          position={[g.x, g.h / 2, g.z]}
          rotation={[Math.sin(frame / 18 + g.ph) * 0.18, g.ph, Math.sin(frame / 25 + g.ph) * 0.12]}
        >
          <boxGeometry args={[0.05, g.h, 0.012]} />
          <meshStandardMaterial color="#3f7d4a" roughness={0.8} />
        </mesh>
      ))}
      {/* murex shells on the bed */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-1.5 + i * 0.5, 0.08, 0.5 + random(`sh${i}`)]} rotation={[1.4, 0, i]}>
          <coneGeometry args={[0.07, 0.22, 7]} />
          <meshStandardMaterial color="#d8b9a0" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const SurfaceAndRays: React.FC<{ frame: number }> = ({ frame }) => {
  const tex = useCausticTexture("surf");
  tex.repeat.set(50, 50);
  tex.offset.set(-frame * 0.002, frame * 0.0013);
  return (
    <group>
      <mesh position={[0, SURFACE_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial color="#bdf3fb" map={tex} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* boat hull silhouette */}
      <mesh position={[2.8, SURFACE_Y - 0.1, -0.6]} rotation={[0, 0.3, Math.PI / 2]} scale={[0.5, 1, 1]}>
        <capsuleGeometry args={[0.55, 3.6, 6, 16]} />
        <meshStandardMaterial color="#1b130c" roughness={1} />
      </mesh>
      {/* god rays */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh
          key={i}
          position={[-5 + i * 1.7, SURFACE_Y - 10, -3 - (i % 3)]}
          rotation={[0, 0, 0.18 + Math.sin(frame / 40 + i) * 0.04]}
        >
          <cylinderGeometry args={[0.3, 2.2, 20, 16, 1, true]} />
          <meshBasicMaterial
            color="#d8fbff"
            transparent
            opacity={0.045 + 0.025 * Math.sin(frame / 15 + i * 2)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

const Bubbles: React.FC<{ frame: number; p: number }> = ({ frame, p }) => {
  const { fps } = useVideoConfig();
  const items = new Array(26).fill(0).map((_, i) => {
    const born = i * 5; // one bubble every 5 frames
    const age = (frame - born) / fps;
    if (age < 0) return null;
    const origin = diverPos(Math.max(0, p - age / 5));
    const y = origin.y - 0.75 + age * 1.6;
    const x = origin.x - 0.35 + Math.sin(age * 6 + i) * 0.06;
    const r = 0.015 + random(`b${i}`) * 0.03;
    return (
      <mesh key={i} position={[x, y, 0.1]}>
        <sphereGeometry args={[r, 10, 10]} />
        <meshStandardMaterial color="#e8fbff" transparent opacity={0.65} roughness={0.1} metalness={0.2} />
      </mesh>
    );
  });
  return <group>{items}</group>;
};

const Fish: React.FC<{ frame: number }> = ({ frame }) => (
  <group>
    {new Array(22).fill(0).map((_, i) => {
      const a = frame / 70 + random(`fa${i}`) * 1.2;
      const rad = 3.2 + random(`fr${i}`) * 1.2;
      const y = 3 + random(`fy${i}`) * 4;
      const x = Math.cos(a) * rad - 1;
      const z = Math.sin(a) * rad * 0.6 - 6;
      return (
        <group key={i} position={[x, y, z]} rotation={[0, -a, 0]} scale={0.6}>
          <mesh scale={[0.05, 0.08, 0.2]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#b9c7cc" metalness={0.5} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2 + Math.sin(frame / 3 + i) * 0.4, 0, 0]}>
            <coneGeometry args={[0.06, 0.1, 4]} />
            <meshStandardMaterial color="#9fb0b6" />
          </mesh>
        </group>
      );
    })}
  </group>
);

const MarineSnow: React.FC<{ frame: number }> = ({ frame }) => {
  const geom = useMemo(() => {
    const n = 500;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (random(`sx${i}`) - 0.5) * 14;
      arr[i * 3 + 1] = random(`sy${i}`) * 16;
      arr[i * 3 + 2] = (random(`sz${i}`) - 0.5) * 8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  return (
    <points geometry={geom} position={[0, -frame * 0.003, 0]}>
      <pointsMaterial color="#d9f6ff" size={0.03} transparent opacity={0.6} />
    </points>
  );
};

const CameraRig: React.FC<{ p: number }> = ({ p }) => {
  const camera = useThree((s) => s.camera);
  const d = diverPos(p);
  camera.position.set(d.x + 1.6, d.y - 1.6, 6.2);
  camera.lookAt(d.x - 0.4, d.y - 0.2, 0);
  return null;
};

export const TestDiver: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const p = frame / durationInFrames;
  const t = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #3fb0c4 0%, #13627c 45%, #062a3d 100%)",
        fontFamily,
      }}
    >
      <ThreeCanvas width={width} height={height} camera={{ fov: 42, near: 0.1, far: 80 }}>
        <fog attach="fog" args={[FOG, 5, 30]} />
        <hemisphereLight args={["#bff4ff", "#0b3346", 1.5]} />
        <directionalLight position={[3, 20, 4]} intensity={2.2} color="#e6fbff" />
        <CameraRig p={p} />
        <SurfaceAndRays frame={frame} />
        <Seabed frame={frame} />
        <Fish frame={frame} />
        <Rope p={p} />
        <Diver frame={frame} p={p} />
        <Bubbles frame={frame} p={p} />
        <MarineSnow frame={frame} />
      </ThreeCanvas>
      <div
        lang="tr"
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 330,
          textAlign: "center",
          color: "white",
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.15,
          opacity: t * out,
          transform: `translateY(${(1 - t) * 20}px)`,
          textShadow: "0 3px 14px rgba(0,0,0,0.75)",
        }}
      >
        Romalı dalgıçlar nefeslerini tutup bir taşla dibe inerdi
      </div>
    </AbsoluteFill>
  );
};
