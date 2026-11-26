import { useEffect, useRef, useState } from "react";
import type { Device } from "@/content/projects";
import { prefersReducedMotion } from "@/lib/motion";

type DeviceMockupProps = { device: Device; shot?: string; name: string; stack: string[] };

const SLAB_LAYERS = 8;

export default function DeviceMockup({ device, shot, name, stack }: DeviceMockupProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const missing = !shot || failed;

  // Tilt with scroll. GSAP loads lazily so the first paint doesn't wait on it.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return;
    let cleanup = () => {};
    let cancelled = false;

    import("../gsap").then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".device",
          { rotateY: -18, rotateX: 7 },
          {
            rotateY: 18,
            rotateX: -3,
            ease: "none",
            scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      }, stage);
      cleanup = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const screen = missing ? (
    <div className="screen placeholder" aria-hidden="true">
      <span className="ph-bar" />
      <strong className="mono">{name}</strong>
      <span className="ph-line" />
      <span className="ph-line short" />
      <span className="ph-tags mono">{stack.slice(0, 3).join(" · ")}</span>
    </div>
  ) : (
    <div className="screen">
      <picture>
        <source srcSet={`/shots/${shot}.avif`} type="image/avif" />
        <img
          src={`/shots/${shot}.webp`}
          alt={`${name} ${device === "phone" ? "mobile" : "desktop"} screenshot`}
          loading="lazy"
          decoding="async"
          width={device === "phone" ? 390 : 1280}
          height={device === "phone" ? 844 : 800}
          onError={() => setFailed(true)}
        />
      </picture>
    </div>
  );

  return (
    <div className="stage3d" ref={stageRef}>
      <div className={`device device-${device}`} role="img" aria-label={`${name} on a ${device}`}>
        <div className="lid">
          <div className="slab" aria-hidden="true">
            {Array.from({ length: SLAB_LAYERS }, (_, i) => (
              <i key={i} style={{ "--z": -(i + 1) * 1.6 } as React.CSSProperties} />
            ))}
          </div>
          <div className="front">{screen}</div>
        </div>
        {device === "laptop" && (
          <div className="deck" aria-hidden="true">
            <div className="deck-top" />
            <div className="deck-front" />
          </div>
        )}
      </div>
    </div>
  );
}
