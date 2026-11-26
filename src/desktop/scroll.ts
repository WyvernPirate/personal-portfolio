import type Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";
import type { WorkspaceId } from "@/content/profile";

let lenis: Lenis | null = null;

/**
 * Smooth scrolling for fine pointers only; touch devices keep native momentum.
 * Lenis loads after first paint so it stays out of the initial bundle.
 */
export function startSmoothScroll() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (!fine || prefersReducedMotion()) return () => {};

  let cancelled = false;
  let raf = 0;
  let instance: Lenis | null = null;

  import("lenis").then(({ default: LenisCtor }) => {
    if (cancelled) return;
    instance = new LenisCtor({ lerp: 0.1, wheelMultiplier: 0.85 });
    lenis = instance;
    const tick = (time: number) => {
      instance?.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    instance?.destroy();
    lenis = null;
  };
}

/** Jump to an act. Each act's section id matches its workspace id. */
export function scrollToWorkspace(id: WorkspaceId) {
  const el = document.getElementById(id);
  if (!el) return;
  history.replaceState(null, "", `#${id}`);
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  window.setTimeout(() => el.focus({ preventScroll: true }), 50);
}

export function workspaceByIndex(n: number) {
  const ids: WorkspaceId[] = ["home", "dive", "work", "log", "stack", "mail"];
  return ids[n - 1];
}
