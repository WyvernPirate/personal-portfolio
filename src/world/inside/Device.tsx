import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PresentationControls, RoundedBox } from "@react-three/drei";
import { Color, Object3D, type Group, type InstancedMesh, type Texture } from "three";
import type { Project } from "@/content/projects";
import { world } from "../progress";
import { keyClick } from "@/audio/sfx";
import { loadShot, makePlaceholder } from "./textures";

function useScreen(project: Project, w: number, h: number) {
  // Created synchronously so the very first compiled material already has its map.
  const placeholder = useMemo(() => makePlaceholder(project, w, h), [project, w, h]);
  const [shot, setShot] = useState<Texture | null>(null);

  useEffect(() => () => placeholder.dispose(), [placeholder]);

  useEffect(() => {
    if (!project.shot) return;
    let cancelled = false;
    let loaded: Texture | null = null;
    loadShot(project.shot).then((t) => {
      if (cancelled || !t) return t?.dispose();
      loaded = t;
      setShot(t);
    });
    return () => {
      cancelled = true;
      loaded?.dispose();
      setShot(null);
    };
  }, [project]);

  return shot ?? placeholder;
}

function Phone({ project }: { project: Project }) {
  const screen = useScreen(project, 512, 1060);
  return (
    <group>
      <RoundedBox args={[1.08, 2.24, 0.13]} radius={0.16} smoothness={4}>
        <meshStandardMaterial color="#2a2845" roughness={0.28} metalness={0.85} />
      </RoundedBox>
      <mesh position={[0, 0, 0.0685]}>
        <planeGeometry args={[0.98, 2.12]} />
        <meshBasicMaterial key={screen.uuid} map={screen} toneMapped={false} />
      </mesh>
      {/* dynamic island */}
      <mesh position={[0, 0.97, 0.0705]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.05, 0.2, 4, 12]} />
        <meshBasicMaterial color="#05050f" />
      </mesh>
      {/* back camera bump */}
      <RoundedBox args={[0.42, 0.42, 0.04]} radius={0.08} position={[-0.26, 0.82, -0.085]}>
        <meshStandardMaterial color="#14132a" roughness={0.3} metalness={0.8} />
      </RoundedBox>
    </group>
  );
}

const KEY_COLS = 14;
const KEY_ROWS = 5;

/** Instanced keycaps on the laptop deck. */
function LaptopKeys() {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    const base = new Color("#4a4875");
    const accent = new Color("#75AADB");
    const sand = new Color("#E3A869");
    const pitch = 0.205;
    let i = 0;
    for (let r = 0; r < KEY_ROWS; r++) {
      for (let c = 0; c < KEY_COLS; c++) {
        // bottom row: a long space bar instead of the middle keys
        if (r === KEY_ROWS - 1 && c > 3 && c < 9) continue;
        const wide = r === KEY_ROWS - 1 && c === 3 ? 5.3 : 1;
        const cx = (c - (KEY_COLS - 1) / 2) * pitch + (wide > 1 ? (wide - 1) * pitch * 0.5 : 0);
        dummy.position.set(cx, 0.122, 0.17 + r * pitch);
        dummy.scale.set(wide, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, r === 0 && c === 0 ? sand : (r + c) % 9 === 0 ? accent : base);
        i++;
      }
    }
    mesh.count = i;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, KEY_COLS * KEY_ROWS]}>
      <boxGeometry args={[0.175, 0.05, 0.175]} />
      <meshStandardMaterial roughness={0.45} metalness={0.3} />
    </instancedMesh>
  );
}

function Laptop({ project }: { project: Project }) {
  const screen = useScreen(project, 1280, 800);
  return (
    <group position={[0, -1.15, 0]}>
      {/* base */}
      <RoundedBox args={[3.7, 0.09, 2.5]} radius={0.05} smoothness={3} position={[0, 0.045, 0.65]}>
        <meshStandardMaterial color="#2a2845" roughness={0.35} metalness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.096, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.0, 1.2]} />
        <meshStandardMaterial color="#14132a" roughness={0.8} />
      </mesh>
      <LaptopKeys />
      <mesh position={[0, 0.096, 1.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 0.62]} />
        <meshStandardMaterial color="#201e3c" roughness={0.5} />
      </mesh>
      {/* lid, hinged at the back edge and tilted slightly back */}
      <group position={[0, 0.09, -0.6]} rotation={[-0.1, 0, 0]}>
        <RoundedBox args={[3.7, 2.4, 0.08]} radius={0.06} smoothness={3} position={[0, 1.2, 0]}>
          <meshStandardMaterial color="#2a2845" roughness={0.3} metalness={0.85} />
        </RoundedBox>
        <mesh position={[0, 1.2, 0.0435]}>
          <planeGeometry args={[3.5, 2.2]} />
          <meshBasicMaterial color="#05050f" />
        </mesh>
        <mesh position={[0, 1.2, 0.0455]}>
          <planeGeometry args={[3.4, 2.125]} />
          <meshBasicMaterial key={screen.uuid} map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

type DeviceProps = { project: Project; position: [number, number, number]; side: 1 | -1 };

/** A project's phone or laptop. Idles with a slow sway; drag to spin it. */
export default function Device({ project, position, side }: DeviceProps) {
  const sway = useRef<Group>(null);
  const seed = useRef(Math.random() * 6);

  useFrame(({ clock }) => {
    const g = sway.current;
    if (!g) return;
    const t = clock.elapsedTime + seed.current;
    const amp = world.reduced ? 0 : 1;
    g.rotation.y = Math.sin(t * 0.55) * 0.14 * amp - side * 0.18;
    g.position.y = Math.sin(t * 0.8) * 0.06 * amp;
  });

  return (
    <group position={position}>
      <PresentationControls
        global={false}
        cursor={false}
        snap
        speed={1.6}
        polar={[0, 0]}
        azimuth={[-Infinity, Infinity]}
        damping={0.12}
      >
        <group
          ref={sway}
          onPointerOver={() => (world.hoverDraggable = true)}
          onPointerOut={() => (world.hoverDraggable = false)}
          onPointerDown={() => {
            world.dragging = true;
            keyClick(0.8);
          }}
          onPointerUp={() => (world.dragging = false)}
        >
          {project.device === "phone" ? <Phone project={project} /> : <Laptop project={project} />}
        </group>
      </PresentationControls>
    </group>
  );
}
