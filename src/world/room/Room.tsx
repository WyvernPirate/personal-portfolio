import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { CanvasTexture, Color, InstancedMesh, Object3D, SRGBColorSpace, type Group } from "three";
import { createScreen, SCREEN_H, SCREEN_W, type Screen } from "./screenTexture";
import { world } from "../progress";

export const MONITOR_Z = -0.36;
export const SCREEN_WIDTH_M = 1.2;
const SCREEN_HEIGHT_M = (SCREEN_WIDTH_M * SCREEN_H) / SCREEN_W;
const MONITOR_Y = 0.43;

const KEY_ROWS = [
  { n: 14, y: 0 },
  { n: 14, y: 1 },
  { n: 13, y: 2 },
  { n: 12, y: 3 },
  { n: 10, y: 4 },
];

function Monitor({ screen }: { screen: Screen }) {
  return (
    <group position={[0, MONITOR_Y, MONITOR_Z]}>
      {/* bezel */}
      <RoundedBox args={[SCREEN_WIDTH_M + 0.07, SCREEN_HEIGHT_M + 0.07, 0.035]} radius={0.012} smoothness={3}>
        <meshStandardMaterial color="#0c0b18" roughness={0.45} metalness={0.4} />
      </RoundedBox>
      {/* screen */}
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[SCREEN_WIDTH_M, SCREEN_HEIGHT_M]} />
        <meshBasicMaterial map={screen.texture} toneMapped={false} />
      </mesh>
      {/* neck and foot */}
      <mesh position={[0, -SCREEN_HEIGHT_M / 2 - 0.13, -0.03]}>
        <boxGeometry args={[0.07, 0.24, 0.025]} />
        <meshStandardMaterial color="#14132a" roughness={0.5} metalness={0.5} />
      </mesh>
      <RoundedBox args={[0.34, 0.012, 0.2]} radius={0.005} position={[0, -SCREEN_HEIGHT_M / 2 - 0.245, 0.02]}>
        <meshStandardMaterial color="#14132a" roughness={0.5} metalness={0.5} />
      </RoundedBox>

      {/* Botswana flag sticker, bottom-right of the bezel */}
      <group position={[SCREEN_WIDTH_M / 2 - 0.03, -SCREEN_HEIGHT_M / 2 - 0.0, 0.0225]} scale={0.8}>
        <mesh>
          <planeGeometry args={[0.05, 0.034]} />
          <meshBasicMaterial color="#75AADB" />
        </mesh>
        <mesh position={[0, 0, 0.0002]}>
          <planeGeometry args={[0.05, 0.014]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.0004]}>
          <planeGeometry args={[0.05, 0.0085]} />
          <meshBasicMaterial color="#05050f" />
        </mesh>
      </group>
    </group>
  );
}

function Keyboard() {
  const ref = useRef<InstancedMesh>(null);
  const total = KEY_ROWS.reduce((n, r) => n + r.n, 0);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    const base = new Color("#2d2b4a");
    const sky = new Color("#75AADB");
    const sand = new Color("#E3A869");
    let i = 0;
    for (const row of KEY_ROWS) {
      const rowWidth = row.n * 0.0295;
      for (let k = 0; k < row.n; k++) {
        const x = -rowWidth / 2 + k * 0.0295 + 0.015 + (row.y === 3 ? 0.012 : 0);
        const z = -0.062 + row.y * 0.0295;
        const wide = row.y === 4 && (k === 3 || k === 4) ? 2.2 : 1;
        dummy.position.set(wide > 1 ? x + (k === 3 ? 0.03 : 0.04) : x, 0.029, z);
        dummy.scale.set(wide, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        const accent = (row.y === 0 && k === 0) || (row.y === 2 && k === row.n - 1);
        mesh.setColorAt(i, accent ? sand : (row.y + k) % 11 === 0 ? sky : base);
        i++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  return (
    <group position={[0, 0, 0.2]}>
      <RoundedBox args={[0.46, 0.022, 0.17]} radius={0.008} position={[0, 0.011, 0]}>
        <meshStandardMaterial color="#14132a" roughness={0.4} metalness={0.5} />
      </RoundedBox>
      <instancedMesh ref={ref} args={[undefined, undefined, total]}>
        <boxGeometry args={[0.025, 0.012, 0.025]} />
        <meshStandardMaterial roughness={0.5} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}

function phoneTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 540;
  const g = c.getContext("2d")!;
  const bg = g.createLinearGradient(0, 0, 0, 540);
  bg.addColorStop(0, "#1B1A2E");
  bg.addColorStop(1, "#2b2750");
  g.fillStyle = bg;
  g.fillRect(0, 0, 256, 540);
  g.fillStyle = "#ECEAF4";
  g.font = '700 74px "Martian Mono Variable", monospace';
  g.textAlign = "center";
  g.fillText("14:02", 128, 150);
  g.fillStyle = "#9C99B4";
  g.font = '400 20px "Atkinson Hyperlegible Next Variable", sans-serif';
  g.fillText("phemelo.work", 128, 188);
  g.fillStyle = "rgba(36,34,58,0.95)";
  g.beginPath();
  g.roundRect(20, 250, 216, 72, 18);
  g.fill();
  g.fillStyle = "#6fd08c";
  g.beginPath();
  g.arc(46, 286, 7, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#ECEAF4";
  g.textAlign = "left";
  g.font = '600 20px "Atkinson Hyperlegible Next Variable", sans-serif';
  g.fillText("Open to work", 64, 281);
  g.fillStyle = "#9C99B4";
  g.font = '400 16px "Atkinson Hyperlegible Next Variable", sans-serif';
  g.fillText("Full-time or projects", 64, 304);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function Phone() {
  const tex = useMemo(phoneTexture, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group position={[0.62, 0, 0.22]} rotation={[0, -0.5, 0]}>
      {/* propped on a little stand so the screen faces the camera */}
      <group position={[0, 0.036, 0]} rotation={[0.46, 0, 0]}>
        <RoundedBox args={[0.075, 0.008, 0.155]} radius={0.012} smoothness={3}>
          <meshStandardMaterial color="#0c0b18" roughness={0.3} metalness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0.0058, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.068, 0.148]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
      <RoundedBox args={[0.07, 0.03, 0.02]} radius={0.006} position={[0, 0.015, -0.062]}>
        <meshStandardMaterial color="#1c1a34" roughness={0.5} metalness={0.4} />
      </RoundedBox>
    </group>
  );
}

function Lamp() {
  const head = useRef<Group>(null);
  return (
    <group position={[-0.78, 0, 0.0]}>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.02, 24]} />
        <meshStandardMaterial color="#b9824a" roughness={0.35} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.38, 10]} />
        <meshStandardMaterial color="#b9824a" roughness={0.35} metalness={0.8} />
      </mesh>
      <group ref={head} position={[0.07, 0.4, 0.02]} rotation={[0, 0, -0.5]}>
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[0.1, 0.12, 28, 1, true]} />
          <meshStandardMaterial color="#b9824a" emissive="#E3A869" emissiveIntensity={0.3} roughness={0.4} metalness={0.5} side={2} />
        </mesh>
      </group>
      <pointLight position={[0.2, 0.26, 0.16]} color="#E3A869" intensity={1.5} distance={2.6} decay={2} />
    </group>
  );
}

function Mug() {
  return (
    <group position={[-0.42, 0, 0.3]}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.04, 0.036, 0.08, 24]} />
        <meshStandardMaterial color="#ECEAF4" roughness={0.5} />
      </mesh>
      {/* coffee sits a few millimetres above the rim plane so it never z-fights with the lid of the cylinder */}
      <mesh position={[0, 0.0835, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.0345, 28]} />
        <meshStandardMaterial color="#4a2c1a" roughness={0.25} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.0805, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.0385, 0.0035, 8, 32]} />
        <meshStandardMaterial color="#ECEAF4" roughness={0.4} />
      </mesh>
      <mesh position={[0.045, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.02, 0.006, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#ECEAF4" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Backdrop() {
  return (
    <group>
      {/* desk */}
      <RoundedBox args={[3.2, 0.05, 1.3]} radius={0.01} position={[0, -0.025, -0.1]}>
        <meshStandardMaterial color="#201d38" roughness={0.55} metalness={0.15} />
      </RoundedBox>
      {/* desk mat */}
      <RoundedBox args={[1.2, 0.004, 0.46]} radius={0.002} position={[0, 0.002, 0.21]}>
        <meshStandardMaterial color="#14122a" roughness={0.9} />
      </RoundedBox>
      {/* wall */}
      <mesh position={[0, 0.9, -1.1]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#12112a" roughness={1} />
      </mesh>
      {/* neon strip behind the monitor */}
      <mesh position={[0, 1.05, -1.08]}>
        <boxGeometry args={[2.4, 0.012, 0.01]} />
        <meshBasicMaterial color="#75AADB" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.76, -1.08]}>
        <boxGeometry args={[1.6, 0.008, 0.01]} />
        <meshBasicMaterial color="#E3A869" toneMapped={false} />
      </mesh>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#0a0914" roughness={0.9} />
      </mesh>
    </group>
  );
}

export type RoomProps = { onScreen: (s: Screen) => void; shadows: boolean };

export default function Room({ onScreen, shadows }: RoomProps) {
  const screen = useMemo(() => createScreen(), []);
  const monitorLight = useRef<import("three").PointLight>(null);

  useEffect(() => {
    onScreen(screen);
    return () => screen.dispose();
  }, [screen, onScreen]);

  // The monitor breathes very slightly, like a real backlight.
  useFrame(({ clock }) => {
    const l = monitorLight.current;
    if (l) l.intensity = 2.4 + Math.sin(clock.elapsedTime * 1.3) * 0.12 * (world.reduced ? 0 : 1);
  });

  return (
    <group>
      <ambientLight intensity={0.22} color="#8a8fb8" />
      <pointLight ref={monitorLight} position={[0, MONITOR_Y, 0.25]} color="#75AADB" intensity={2.4} distance={3.2} decay={2} />
      <Backdrop />
      <Monitor screen={screen} />
      <Keyboard />
      <Phone />
      <Lamp />
      <Mug />
      {shadows && <ContactShadows position={[0, 0.001, 0.1]} opacity={0.55} scale={3} blur={2.4} far={0.8} resolution={512} frames={1} />}
    </group>
  );
}

