import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** Skip the WebGL wallpaper on constrained devices; the CSS gradient stays as the fallback. */
function canRunWebGL() {
  if (prefersReducedMotion()) return false;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") || probe.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

export default function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !canRunWebGL()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    // Wait until the page is idle so the three.js chunk never competes with first paint.
    const load = () =>
      import("./scene").then(({ startWallpaper }) => {
        if (cancelled) return;
        const handle = startWallpaper(canvas, () => setEnabled(false));
        if (!handle) return setEnabled(false);
        dispose = handle.dispose;
        setReady(true);
      });

    // Start on the first interaction, or after a long quiet period, so the three.js
    // chunk and shader compile never compete with first paint and input readiness.
    const events = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"] as const;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      events.forEach((e) => window.removeEventListener(e, start));
      load();
    };
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    const timer = window.setTimeout(start, 6000);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => reduced.matches && setEnabled(false);
    reduced.addEventListener("change", onReduce);

    return () => {
      cancelled = true;
      reduced.removeEventListener("change", onReduce);
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, start));
      dispose?.();
      setReady(false);
    };
  }, [enabled]);

  return (
    <div className="wallpaper" aria-hidden="true">
      <canvas ref={canvasRef} data-ready={ready} hidden={!enabled} />
    </div>
  );
}
