const reducedQuery = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () => window.matchMedia(reducedQuery).matches;

export const isDesktopWidth = () => window.matchMedia("(min-width: 768px)").matches;

/**
 * Marks <html> once, before first render, so animation start states only exist
 * when we know motion is allowed. If JS fails nothing is hidden.
 */
export function initMotionFlag() {
  const root = document.documentElement;
  const apply = () => root.classList.toggle("motion-ok", !prefersReducedMotion());
  apply();
  window.matchMedia(reducedQuery).addEventListener("change", apply);
}
