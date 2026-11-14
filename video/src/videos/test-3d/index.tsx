// 3D style test: clay-style nursery, mother carrying a baby in a stretchy wrap.
// Everything is procedural (no external models, no API keys). All motion is driven by
// useCurrentFrame() (Remotion rule: no useFrame()).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  wall: "#f6dccd",
  wall2: "#f0cfbe",
  floor: "#e3c09c",
  rug: "#f3c6d3",
  skin: "#f1c3a1",
  hair: "#5b3a2e",
  top: "#f19f8e",
  pants: "#7f9bb8",
  shoe: "#4a3a36",
  wrap: "#b7a0e0",
  wrapDark: "#9a83c8",
  babySkin: "#f6cfb0",
  babyHat: "#fff4e0",
  wood: "#d7a77a",
  leaf: "#79b98a",
  pot: "#e3a07c",
  white: "#fffaf3",
};

const Clay: React.FC<{ color: string; rough?: number }> = ({
  color,
  rough = 0.78,
}) => <meshStandardMaterial color={color} roughness={rough} metalness={0} />;

/** Animated camera: slow dolly-in + small orbit. */
const Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const camera = useThree((s) => s.camera);
  const p = frame / durationInFrames;
  const angle = interpolate(p, [0, 1], [-0.28, 0.22]);
  const dist = interpolate(p, [0, 1], [5.6, 4.7]);
  camera.position.set(Math.sin(angle) * dist, 2.0, Math.cos(angle) * dist);
  camera.lookAt(0, 1.55, 0);
  return null;
};

/** Flat fabric band following a curve (the wrap passes). */
const Band: React.FC<{
  points: [number, number, number][];
  width: number;
  color: string;
}> = ({ points, width, color }) => {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
    );
    const g = new THREE.TubeGeometry(curve, 48, width, 12, false);
    return g;
  }, [points, width]);
  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <Clay color={color} rough={0.9} />
    </mesh>
  );
};

const Baby: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 14) * 0.012;
  return (
    <group position={[0, 1.5, 0.44]} scale={breathe}>
      {/* head turned to the side, resting on mum's chest */}
      <mesh position={[0, 0.22, 0.02]} castShadow>
        <sphereGeometry args={[0.2, 48, 48]} />
        <Clay color={C.babySkin} />
      </mesh>
      {/* knit hat */}
      <mesh position={[0, 0.33, -0.01]} castShadow>
        <sphereGeometry args={[0.19, 40, 40, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Clay color={C.babyHat} rough={1} />
      </mesh>
      {/* closed sleeping eyes + cheeks */}
      {[-0.07, 0.07].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.19]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.025, 0.006, 8, 16, Math.PI]} />
          <Clay color="#4a3a36" />
        </mesh>
      ))}
      {[-0.11, 0.11].map((x) => (
        <mesh key={`c${x}`} position={[x, 0.15, 0.17]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#f29a8f"
            roughness={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      {/* body tucked in the wrap (only the bulge shows) */}
      <mesh position={[0, -0.1, 0]} scale={[1, 1.15, 0.85]} castShadow>
        <sphereGeometry args={[0.24, 40, 40]} />
        <Clay color={C.wrap} rough={0.92} />
      </mesh>
      {/* legs in M position, peeking out of the wrap */}
      {[-1, 1].map((s) => (
        <group
          key={s}
          position={[s * 0.27, -0.2, 0.08]}
          rotation={[0.9, 0, s * 1.15]}
        >
          <mesh castShadow>
            <capsuleGeometry args={[0.06, 0.12, 8, 16]} />
            <Clay color={C.babySkin} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Mother: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 22) * 0.04;
  const blink = frame % 96 > 92;
  return (
    <group rotation={[0, sway, 0]}>
      {/* legs */}
      {[-0.17, 0.17].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.55, 0]} castShadow>
            <capsuleGeometry args={[0.13, 0.75, 8, 24]} />
            <Clay color={C.pants} />
          </mesh>
          <mesh position={[x, 0.08, 0.08]} scale={[1, 0.55, 1.5]} castShadow>
            <sphereGeometry args={[0.14, 24, 24]} />
            <Clay color={C.shoe} />
          </mesh>
        </group>
      ))}
      {/* torso */}
      <mesh
        position={[0, 1.45, 0]}
        scale={[1, 1, 0.78]}
        castShadow
        receiveShadow
      >
        <capsuleGeometry args={[0.38, 0.55, 12, 32]} />
        <Clay color={C.top} />
      </mesh>
      {/* neck + head */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.18, 24]} />
        <Clay color={C.skin} />
      </mesh>
      <mesh position={[0, 2.38, 0]} castShadow>
        <sphereGeometry args={[0.3, 48, 48]} />
        <Clay color={C.skin} />
      </mesh>
      {/* hair: cap + bun */}
      <mesh position={[0, 2.46, -0.03]} castShadow>
        <sphereGeometry
          args={[0.315, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.55]}
        />
        <Clay color={C.hair} rough={0.6} />
      </mesh>
      <mesh position={[0, 2.62, -0.24]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <Clay color={C.hair} rough={0.6} />
      </mesh>
      {/* face: eyes looking down at the baby, smile, cheeks */}
      {[-0.1, 0.1].map((x) => (
        <mesh
          key={x}
          position={[x, 2.36, 0.27]}
          scale={[1, blink ? 0.15 : 1, 1]}
        >
          <sphereGeometry args={[0.032, 16, 16]} />
          <Clay color="#3d2e2a" rough={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 2.25, 0.27]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.06, 0.012, 8, 24, Math.PI]} />
        <Clay color="#8a4b45" />
      </mesh>
      {[-0.17, 0.17].map((x) => (
        <mesh key={`k${x}`} position={[x, 2.28, 0.22]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#f29a8f"
            roughness={1}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
      {/* stretchy wrap: waist band (pocket) + two cross passes over the shoulders */}
      <mesh position={[0, 1.42, 0.06]} scale={[1, 1, 0.82]} castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.3, 48, 1, true]} />
        <meshStandardMaterial
          color={C.wrap}
          roughness={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Band
        points={[
          [-0.3, 1.95, -0.05],
          [-0.18, 1.85, 0.32],
          [0.12, 1.55, 0.5],
          [0.33, 1.3, 0.3],
        ]}
        width={0.11}
        color={C.wrap}
      />
      <Band
        points={[
          [0.3, 1.95, -0.05],
          [0.18, 1.85, 0.32],
          [-0.12, 1.55, 0.5],
          [-0.33, 1.3, 0.3],
        ]}
        width={0.11}
        color={C.wrapDark}
      />
      <Baby />
      {/* arms cradling the baby */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh
            position={[s * 0.44, 1.62, 0.12]}
            rotation={[0.5, 0, s * 0.35]}
            castShadow
          >
            <capsuleGeometry args={[0.1, 0.42, 8, 20]} />
            <Clay color={C.top} />
          </mesh>
          <mesh
            position={[s * 0.3, 1.38, 0.42]}
            rotation={[1.35, 0, -s * 1.05]}
            castShadow
          >
            <capsuleGeometry args={[0.09, 0.32, 8, 20]} />
            <Clay color={C.top} />
          </mesh>
          <mesh position={[s * 0.1, 1.42, 0.58]} castShadow>
            <sphereGeometry args={[0.085, 24, 24]} />
            <Clay color={C.skin} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Room: React.FC = () => (
  <group>
    {/* floor + back walls */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <Clay color={C.floor} rough={0.9} />
    </mesh>
    <mesh position={[0, 4, -2.2]} receiveShadow>
      <planeGeometry args={[20, 8]} />
      <Clay color={C.wall} rough={1} />
    </mesh>
    <mesh position={[-3.2, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[20, 8]} />
      <Clay color={C.wall2} rough={1} />
    </mesh>
    {/* rounded rug */}
    <mesh position={[0, 0.012, 0.2]} receiveShadow>
      <cylinderGeometry args={[1.6, 1.6, 0.02, 64]} />
      <Clay color={C.rug} rough={1} />
    </mesh>
    {/* window with warm light */}
    <group position={[1.6, 2.5, -2.18]}>
      <mesh>
        <boxGeometry args={[1.5, 1.7, 0.08]} />
        <Clay color={C.white} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.3, 1.5]} />
        <meshStandardMaterial
          color="#fff1cf"
          emissive="#ffe3a6"
          emissiveIntensity={1.1}
        />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[0.06, 1.5, 0.02]} />
        <Clay color={C.white} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.9, -0.1, 0.12]} castShadow>
          <capsuleGeometry args={[0.14, 1.5, 8, 16]} />
          <Clay color="#9fd3c7" rough={1} />
        </mesh>
      ))}
    </group>
    {/* crib corner */}
    <group position={[-2.2, 0, -1.2]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.1, 0.8]} />
        <Clay color={C.wood} />
      </mesh>
      {new Array(7).fill(0).map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.2, 0.9, 0.38]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
          <Clay color={C.wood} />
        </mesh>
      ))}
      <mesh position={[0, 1.25, 0.38]} castShadow>
        <boxGeometry args={[1.3, 0.08, 0.08]} />
        <Clay color={C.wood} />
      </mesh>
    </group>
    {/* plant */}
    <group position={[2.4, 0, -0.6]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.17, 0.5, 32]} />
        <Clay color={C.pot} />
      </mesh>
      {[0, 1.2, 2.4, 3.6, 4.8].map((a, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(a) * 0.12,
            0.85 + (i % 2) * 0.15,
            Math.cos(a) * 0.12,
          ]}
          rotation={[Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5]}
          castShadow
        >
          <sphereGeometry args={[0.13, 20, 20]} />
          <Clay color={C.leaf} />
        </mesh>
      ))}
    </group>
    {/* floating soft shapes on the wall (heart + stars) */}
    <mesh position={[-1.4, 3, -2.15]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.32, 0.32, 0.06]} />
      <Clay color="#f19a8f" />
    </mesh>
  </group>
);

export const Test3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.wall }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        camera={{ fov: 38, near: 0.1, far: 60, position: [0, 1.9, 7] }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Camera />
        <hemisphereLight args={["#fff4ea", "#d8b49a", 0.9]} />
        <directionalLight
          position={[3.5, 6, 4]}
          intensity={2.2}
          color="#fff2e2"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0002}
          shadow-normalBias={0.04}
          shadow-radius={6}
        />
        <pointLight
          position={[1.6, 2.5, -1.4]}
          intensity={6}
          distance={6}
          color="#ffd9a0"
        />
        <directionalLight
          position={[-4, 3, 2]}
          intensity={0.5}
          color="#dfe8ff"
        />
        <Room />
        <Mother />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
