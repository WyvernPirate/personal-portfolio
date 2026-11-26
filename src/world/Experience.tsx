import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import Scene from "./Scene";
import { tierSettings, stepDown } from "./tier";
import { world, type Quality } from "./progress";

type ExperienceProps = { initialTier: Quality; paused: boolean; onReady: () => void };

export default function Experience({ initialTier, paused, onReady }: ExperienceProps) {
  const [tier, setTier] = useState<Quality>(initialTier);
  world.quality = tier;
  const cfg = tierSettings[tier];

  return (
    <div className="world" aria-hidden="true">
      <Canvas
        // Rendering waits while the lock screen is up; the first frames still compile shaders.
        frameloop={paused ? "demand" : "always"}
        dpr={cfg.dpr}
        gl={{ antialias: tier === "high", powerPreference: tier === "low" ? "low-power" : "high-performance", alpha: false }}
        camera={{ fov: 40, near: 0.08, far: 220, position: [0, 0.62, 1.95] }}
        style={{ touchAction: "pan-y" }}
        onCreated={() => onReady()}
      >
        <PerformanceMonitor flipflops={2} onDecline={() => setTier((t) => stepDown(t))}>
          <Suspense fallback={null}>
            <Scene tier={tier} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
      {tier === "low" && <div className="crt-lite" />}
    </div>
  );
}
