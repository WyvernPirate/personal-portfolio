import type Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";
import { workspaces, type WorkspaceId } from "@/content/profile";

let lenis: Lenis | null = null;

/**
 * Smooth scrolling only for fine pointers; touch devices keep native momentum.
 * Lenis and GSAP load after first paint so they stay out of the initial bundle.
 */
export function startSmoothScroll() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (!fine || prefersReducedMotion()) return () => {};

  let cancelled = false;
  let stop = () => {};

  Promise.all([import("lenis"), import("./gsap")]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
    if (cancelled) return;
    const instance = new LenisCtor({ lerp: 0.12, wheelMultiplier: 0.9 });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    stop = () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  });

  return () => {
    cancelled = true;
    stop();
  };
}

export function scrollToWorkspace(id: WorkspaceId) {
  const el = document.getElementById(id);
  if (!el) return;
  history.replaceState(null, "", `#${id}`);
  if (lenis) lenis.scrollTo(el, { duration: 1.1 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  // Move keyboard focus to the new workspace without a second scroll.
  window.setTimeout(() => el.focus({ preventScroll: true }), 50);
}

export function workspaceByIndex(n: number) {
  return workspaces[n - 1]?.id;
}

/**
 * Fractional workspace position (0 … n-1) used to morph the wallpaper.
 * Interpolates between each section's top edge.
 */
export function workspaceFloat(): number {
  const tops = workspaces.map((w) => document.getElementById(w.id)?.offsetTop ?? 0);
  const y = window.scrollY + window.innerHeight * 0.35;
  for (let i = tops.length - 1; i >= 0; i--) {
    if (y >= tops[i]) {
      const next = tops[i + 1];
      if (next === undefined) return i;
      return i + Math.min(1, (y - tops[i]) / Math.max(1, next - tops[i]));
    }
  }
  return 0;
}
