import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { sample, notify, world, measure } from "./progress";
import { INSIDE_Y, LOG_X, STACK_X, stationSide, stationZ } from "./layout";

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = MathUtils.lerp;

type Pose = { pos: Vector3; look: Vector3; fov: number };
const target: Pose = { pos: new Vector3(), look: new Vector3(), fov: 40 };

/** Fills `target` with the camera pose for the given point in the journey. */
function computePose(act: number, t: number, portrait: boolean) {
  const { px, py } = world;
  const parallax = world.reduced ? 0 : 1;
  const p = target.pos;
  const l = target.look;
  target.fov = 40;

  switch (act) {
    case 0: {
      // Room: a slow push-in on the desk
      const e = smooth(t);
      p.set(px * 0.1 * parallax, 0.62 - py * 0.04 * parallax, 1.95 - 0.4 * e + (portrait ? 2.3 : 0));
      l.set(-px * 0.03 * parallax, 0.36, -0.3);
      break;
    }
    case 1: {
      // Dive into the monitor
      const e = smooth(t);
      const z0 = 1.55 + (portrait ? 2.3 : 0);
      const dive = Math.pow(e, 1.25);
      p.set(0, lerp(0.58, 0.43, dive), lerp(z0, 0.02, dive));
      l.set(0, lerp(0.38, 0.43, e), lerp(-0.3, -0.5, e));
      target.fov = lerp(40, portrait ? 76 : 70, e);
      break;
    }
    case 2: {
      // Inside the rice: travel station to station
      const n = projects.length;
      const u = Math.min(n - 1, Math.max(0, world.u));
      const i = Math.floor(u);
      const f = smooth(u - i);
      const j = Math.min(n - 1, i + 1);
      const side = (k: number) => stationSide(k);
      const camZ = (k: number) => stationZ(k) + (portrait ? 6.8 : 5.2);
      const lookX = (k: number) => (portrait ? 0 : side(k) * 1.15);
      p.set(lerp(-side(i) * 0.6, -side(j) * 0.6, f) * (portrait ? 0 : 1) + px * 0.3 * parallax, INSIDE_Y + 1.3 - py * 0.2 * parallax, lerp(camZ(i), camZ(j), f));
      l.set(lerp(lookX(i), lookX(j), f), INSIDE_Y + (portrait ? -0.3 : 0.55), lerp(stationZ(i), stationZ(j), f));
      target.fov = portrait ? 46 : 40;
      break;
    }
    case 3: {
      // Git graph: slide along the timeline
      const n = experience.length;
      const span = (n - 1) * 5;
      const x = LOG_X - span / 2 + Math.min(n - 1, Math.max(0, world.u)) * 5;
      // Look slightly left of the active commit so it sits right of the card.
      const shift = portrait ? 0 : -3.4;
      p.set(x + shift + px * 0.4 * parallax, INSIDE_Y + 1.6 - py * 0.3 * parallax, portrait ? 21 : 15);
      l.set(x + shift, INSIDE_Y + 0.4 + (portrait ? 2.4 : 0), 0);
      target.fov = portrait ? 50 : 42;
      break;
    }
    case 4: {
      // Keycaps: a slow orbit
      const a = lerp(-0.35, 0.35, t) * (world.reduced ? 0.3 : 1);
      const r = portrait ? 19 : 11.5;
      const height = portrait ? 19 : 11;
      const shift = portrait ? 0 : -4.2; // plate sits right of the card
      p.set(STACK_X + shift + Math.sin(a) * r + px * 0.5 * parallax, INSIDE_Y + height - py * 0.4 * parallax, Math.cos(a) * r);
      l.set(STACK_X + shift, INSIDE_Y + 0.2 + (portrait ? 2.6 : 0), 0);
      target.fov = portrait ? 52 : 42;
      break;
    }
    default: {
      // Exit: pull back out of the monitor to the desk
      const e = smooth(clamp01(t / 0.4));
      // End on a wide desk shot with the monitor held in the upper half; the cards rest below it.
      p.set(px * 0.1 * parallax, lerp(0.43, 0.9, e), lerp(0.1, 2.6 + (portrait ? 1.6 : 0), e));
      l.set(0, lerp(0.4, -0.22, e), -0.3);
    }
  }
}

export default function CameraRig() {
  const { camera, size } = useThree();
  const lookCur = useRef(new Vector3(0, 0.36, -0.3));
  const lastAct = useRef(-1);

  // Keep measurements fresh as layout settles.
  useEffect(() => {
    const remeasure = () => measure();
    window.addEventListener("resize", remeasure);
    document.fonts?.ready.then(remeasure);
    const id = window.setTimeout(remeasure, 800);
    return () => {
      window.removeEventListener("resize", remeasure);
      window.clearTimeout(id);
    };
  }, []);

  useFrame((_, dt) => {
    sample();
    notify();

    const portrait = size.width / size.height < 0.9;
    computePose(world.act, world.t, portrait);

    const cam = camera as PerspectiveCamera;
    const far = cam.position.distanceTo(target.pos) > 20;
    const changed = world.act !== lastAct.current;
    const snap = changed || far;
    // The pulse fires when the act changes, covering the cut, then fades. It is never a resting state.
    if (changed && lastAct.current !== -1) world.flash = 1;
    world.flash = Math.max(0, world.flash - dt * (world.reduced ? 6 : 2.8));
    lastAct.current = world.act;

    const k = snap ? 1 : 1 - Math.exp(-dt * (world.reduced ? 14 : 6.5));
    cam.position.lerp(target.pos, k);
    lookCur.current.lerp(target.look, k);
    cam.lookAt(lookCur.current);
    if (Math.abs(cam.fov - target.fov) > 0.01) {
      cam.fov = lerp(cam.fov, target.fov, snap ? 1 : k);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
