import type { Quality } from "./progress";

type Hints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export function hasWebGL() {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") || probe.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/** Starting quality tier. A runtime PerformanceMonitor can still step it down. */
export function detectTier(): Quality {
  // ?tier=low|mid|high forces a tier, for testing on any device.
  const forced = new URLSearchParams(window.location.search).get("tier");
  if (forced === "low" || forced === "mid" || forced === "high") return forced;
  const nav = navigator as Hints;
  const mem = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  if (nav.connection?.saveData || mem <= 2 || cores <= 2) return "low";
  if (coarse || small || mem <= 4 || cores <= 4) return "mid";
  return "high";
}

export const tierSettings = {
  high: { dpr: [1, 2] as [number, number], windows: 40, sparkles: 260, shadows: true, composer: true },
  mid: { dpr: [1, 1.5] as [number, number], windows: 24, sparkles: 120, shadows: false, composer: true },
  low: { dpr: [1, 1] as [number, number], windows: 12, sparkles: 40, shadows: false, composer: false },
} as const;

export const stepDown = (q: Quality): Quality => (q === "high" ? "mid" : "low");
