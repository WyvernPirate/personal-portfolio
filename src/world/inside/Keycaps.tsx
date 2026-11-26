import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace, type Group } from "three";
import { skillGroups } from "@/content/skills";
import { INSIDE_Y, STACK_X } from "../layout";
import { world } from "../progress";
import { keyClick } from "@/audio/sfx";

const CAP = 1.12;
const PITCH = 1.3;

function capTexture(text: string, hue: string) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#3a3860";
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = hue;
  g.font = '600 30px "Martian Mono Variable", monospace';
  g.textAlign = "center";
  const words = text.replace(/\(.*\)/, "").trim().split(/[\s/]+/).filter(Boolean).slice(0, 3);
  const lineH = 38;
  const top = 128 - ((words.length - 1) * lineH) / 2 + 10;
  words.forEach((w, i) => g.fillText(w.length > 9 ? w.slice(0, 8) + "." : w, 128, top + i * lineH));
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function groupLabel(name: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 96;
  const g = c.getContext("2d")!;
  g.fillStyle = "#75AADB";
  g.font = '600 46px "Martian Mono Variable", monospace';
  g.fillText(`${name}/`, 8, 64);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

type Cap = { x: number; z: number; tex: CanvasTexture; delay: number };

export default function Keycaps() {
  const { caps, labels, plate } = useMemo(() => {
    const caps: Cap[] = [];
    const labels: { x: number; z: number; tex: CanvasTexture }[] = [];
    const cols = 2;
    const colX = [-4.6, 4.6];
    const rowZ = [-3.7, 0, 3.7];
    let delay = 0;
    skillGroups.forEach((grp, gi) => {
      const cx = colX[gi % cols];
      const cz = rowZ[Math.floor(gi / cols)];
      const rowW = (grp.items.length - 1) * PITCH;
      labels.push({ x: cx - rowW / 2 - 0.4, z: cz + 1.25, tex: groupLabel(grp.name) });
      grp.items.forEach((item, k) => {
        const hue = gi % 2 === 0 ? "#75AADB" : "#E3A869";
        caps.push({ x: cx - rowW / 2 + k * PITCH, z: cz, tex: capTexture(item, hue), delay: delay++ * 0.028 });
      });
    });
    return { caps, labels, plate: { w: 17.4, d: 11.6 } };
  }, []);

  useEffect(
    () => () => {
      caps.forEach((c) => c.tex.dispose());
      labels.forEach((l) => l.tex.dispose());
    },
    [caps, labels]
  );

  const refs = useRef<(Group | null)[]>([]);
  const press = useRef<number[]>([]);

  useFrame(({ clock }, dt) => {
    if (world.act !== 4) return;
    caps.forEach((c, i) => {
      const g = refs.current[i];
      if (!g) return;
      const rise = Math.min(1, Math.max(0, world.t * 5 + 0.35 - c.delay));
      const eased = 1 - Math.pow(1 - rise, 3);
      press.current[i] = Math.max(0, (press.current[i] ?? 0) - dt * 5);
      const bob = world.reduced ? 0 : Math.sin(clock.elapsedTime * 1.2 + i) * 0.03;
      g.position.y = INSIDE_Y - 2.5 + eased * 2.5 + bob - press.current[i] * 0.22;
      g.scale.setScalar(Math.max(0.001, eased));
    });
  });

  return (
    <group position={[STACK_X, 0, 0]}>
      <fog attach="fog" args={["#0c0b19", 22, 58]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[0, INSIDE_Y + 9, 3]} intensity={260} color="#cfd8ff" distance={45} />
      <pointLight position={[-8, INSIDE_Y + 4, -5]} intensity={120} color="#E3A869" distance={34} />

      <RoundedBox args={[plate.w, 0.5, plate.d]} radius={0.2} position={[0, INSIDE_Y - 0.45, 0]}>
        <meshStandardMaterial color="#1d1b3a" roughness={0.5} metalness={0.5} />
      </RoundedBox>

      {labels.map((l, i) => (
        <mesh key={i} position={[l.x + 1.9, INSIDE_Y - 0.19, l.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.8, 0.71]} />
          <meshBasicMaterial map={l.tex} transparent toneMapped={false} />
        </mesh>
      ))}

      {caps.map((c, i) => (
        <group
          key={i}
          ref={(g) => {
            refs.current[i] = g;
          }}
          position={[c.x, INSIDE_Y - 2.5, c.z]}
          onPointerDown={() => {
            press.current[i] = 1;
            keyClick(0.9 + (i % 5) * 0.06);
          }}
          onPointerOver={() => (world.hoverDraggable = true)}
          onPointerOut={() => (world.hoverDraggable = false)}
        >
          <RoundedBox args={[CAP, 0.55, CAP]} radius={0.12} smoothness={3} position={[0, 0.27, 0]}>
            <meshStandardMaterial color="#47447a" roughness={0.4} metalness={0.2} />
          </RoundedBox>
          <mesh position={[0, 0.552, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[CAP * 0.86, CAP * 0.86]} />
            <meshBasicMaterial map={c.tex} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
