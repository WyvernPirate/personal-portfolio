import { useCallback, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Preload } from "@react-three/drei";
import type { Group } from "three";
import Room from "./room/Room";
import Corridor from "./inside/Corridor";
import GitGraph from "./inside/GitGraph";
import Keycaps from "./inside/Keycaps";
import CameraRig from "./CameraRig";
import Effects from "./fx/Effects";
import type { Screen } from "./room/screenTexture";
import { tierSettings } from "./tier";
import { world, type Quality } from "./progress";
import { whoosh } from "@/audio/sfx";

/** Everything in the 3D world. Regions sit far apart; only the active one is visible. */
export default function Scene({ tier }: { tier: Quality }) {
  const cfg = tierSettings[tier];
  const room = useRef<Group>(null);
  const work = useRef<Group>(null);
  const log = useRef<Group>(null);
  const stack = useRef<Group>(null);
  const screen = useRef<Screen | null>(null);
  const lastAct = useRef(-1);
  // Regions are built one act before they are needed, so the load only pays for the room.
  const [built, setBuilt] = useState({ work: false, log: false, stack: false });

  const onScreen = useCallback((s: Screen) => {
    screen.current = s;
  }, []);

  useFrame(() => {
    const a = world.act;
    if ((a >= 1 && !built.work) || (a >= 2 && !built.log) || (a >= 3 && !built.stack)) {
      setBuilt((b) => ({ work: b.work || a >= 1, log: b.log || a >= 2, stack: b.stack || a >= 3 }));
    }
    if (room.current) room.current.visible = a <= 1 || a === 5;
    if (work.current) work.current.visible = a === 2;
    if (log.current) log.current.visible = a === 3;
    if (stack.current) stack.current.visible = a === 4;

    if (a !== lastAct.current) {
      if (a === 2 && lastAct.current === 1) whoosh();
      lastAct.current = a;
      screen.current?.setMode(a === 5 ? "terminal" : "rice");
      screen.current?.setActive(Math.min(a, 1));
    }
  });

  return (
    <>
      <color attach="background" args={["#0c0b19"]} />
      {/* In-scene lightformers give the glass and metal something to reflect without fetching an HDR. */}
      {tier !== "low" && (
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={2.2} color="#75AADB" position={[0, 2, 3]} scale={[8, 1.5, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#E3A869" position={[-4, 1, 1]} scale={[3, 3, 1]} />
          <Lightformer form="ring" intensity={0.8} color="#ffffff" position={[3, 2, -2]} scale={3} />
        </Environment>
      )}
      <CameraRig />
      <group ref={room}>
        <Room onScreen={onScreen} shadows={cfg.shadows} />
      </group>
      <group ref={work} visible={false}>
        {built.work && <Corridor windowCount={cfg.windows} sparkles={cfg.sparkles} />}
      </group>
      <group ref={log} visible={false}>
        {built.log && <GitGraph />}
      </group>
      <group ref={stack} visible={false}>
        {built.stack && <Keycaps />}
      </group>
      {cfg.composer && <Effects />}
      <Preload all />
    </>
  );
}
