import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { world } from "../progress";
import { CrtEffect } from "./CrtEffect";

const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export default function Effects() {
  const crt = useMemo(() => new CrtEffect(), []);
  const state = useMemo(() => ({ distort: 0, aberr: 0, scan: 0 }), []);

  useFrame((_, dt) => {
    const act = world.act;
    const inside = act >= 2 && act <= 4;
    // The lens is subtle in the room, heavier once you are inside the screen.
    let distort = inside ? 0.16 : 0.02;
    let aberr = inside ? 0.0016 : 0.0004;
    let scan = inside ? 0.07 : 0.02;
    if (act === 1) {
      const e = smooth(world.t);
      distort = lerp(0.02, 0.2, e);
      aberr = lerp(0.0004, 0.004, e);
      scan = lerp(0.02, 0.12, e);
    }
    if (world.reduced) {
      distort *= 0.4;
      aberr *= 0.3;
    }
    const k = 1 - Math.exp(-dt * 6);
    state.distort = lerp(state.distort, distort, k);
    state.aberr = lerp(state.aberr, aberr + world.flash * 0.012, k);
    state.scan = lerp(state.scan, scan, k);
    crt.set(state.distort, state.aberr, state.scan, world.flash * 0.35);
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass={false} stencilBuffer>
      <Bloom intensity={0.6} luminanceThreshold={0.92} luminanceSmoothing={0.2} mipmapBlur />
      <Noise opacity={0.14} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette offset={0.28} darkness={0.75} />
      <primitive object={crt} dispose={null} />
    </EffectComposer>
  );
}
