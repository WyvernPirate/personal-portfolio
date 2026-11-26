import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Grid, Sparkles } from "@react-three/drei";
import type { Mesh } from "three";
import { projects } from "@/content/projects";
import { INSIDE_Y, stationSide, stationZ, STATION_GAP } from "../layout";
import { world } from "../progress";
import Device from "./Device";
import { makeWindowTextures } from "./textures";

type Win = { x: number; y: number; z: number; w: number; h: number; ry: number; rx: number; tex: number; phase: number };

function buildWindows(count: number): Win[] {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const length = (projects.length + 1) * STATION_GAP;
  return Array.from({ length: count }, (_, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const x = side * (4.2 + rnd() * 6);
    const w = 2.4 + rnd() * 2.2;
    return {
      x,
      y: INSIDE_Y - 1.2 + rnd() * 6.5,
      z: 4 - (i / count) * length - rnd() * 2,
      w,
      h: w * 0.66,
      ry: -side * (0.25 + rnd() * 0.35),
      rx: (rnd() - 0.5) * 0.18,
      tex: Math.floor(rnd() * 4),
      phase: rnd() * 6,
    };
  });
}

export default function Corridor({ windowCount, sparkles }: { windowCount: number; sparkles: number }) {
  const { size } = useThree();
  const portrait = size.width / size.height < 0.9;
  const wins = useMemo(() => buildWindows(windowCount), [windowCount]);
  const textures = useMemo(() => makeWindowTextures(), []);
  const refs = useRef<(Mesh | null)[]>([]);

  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  useFrame(({ clock }) => {
    if (world.act !== 2) return;
    const amp = world.reduced ? 0 : 1;
    refs.current.forEach((m, i) => {
      if (m) m.position.y = wins[i].y + Math.sin(clock.elapsedTime * 0.5 + wins[i].phase) * 0.18 * amp;
    });
  });

  const length = (projects.length + 1) * STATION_GAP;

  return (
    <group>
      <fog attach="fog" args={["#0c0b19", 9, 38]} />
      <ambientLight intensity={0.55} color="#9aa0d0" />
      <pointLight position={[0, INSIDE_Y + 6, 0]} intensity={30} color="#75AADB" distance={40} />
      <pointLight position={[0, INSIDE_Y + 5, -length * 0.6]} intensity={30} color="#E3A869" distance={50} />

      <Grid
        position={[0, INSIDE_Y - 1.7, -length / 2]}
        args={[40, length + 40]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#2b2a52"
        sectionSize={5}
        sectionThickness={1.1}
        sectionColor="#75AADB"
        fadeDistance={44}
        fadeStrength={1.4}
        infiniteGrid
      />

      {wins.map((w, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={[w.x, w.y, w.z]}
          rotation={[w.rx, w.ry, 0]}
        >
          <planeGeometry args={[w.w, w.h]} />
          <meshBasicMaterial map={textures[w.tex]} transparent alphaTest={0.02} toneMapped={false} />
        </mesh>
      ))}

      {projects.map((p, k) => (
        <Device
          key={p.slug}
          project={p}
          side={stationSide(k) as 1 | -1}
          position={[portrait ? 0 : stationSide(k) * 2.5, INSIDE_Y + 0.15, stationZ(k)]}
        />
      ))}

      <Sparkles count={sparkles} scale={[24, 12, length + 20]} position={[0, INSIDE_Y + 2, -length / 2]} size={3} speed={0.3} color="#bcd4ee" opacity={0.7} />
    </group>
  );
}
