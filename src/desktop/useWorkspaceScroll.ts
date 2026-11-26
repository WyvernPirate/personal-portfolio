import { useEffect, useState } from "react";
import { workspaces, type WorkspaceId } from "@/content/profile";

/**
 * Tracks the active workspace and drives the 3D "expo" switch: each workspace
 * tilts up out of perspective as it scrolls in while the previous one recedes.
 * Scroll-scrubbed, so the user always controls it; no scroll hijacking.
 */
export function useWorkspaceScroll() {
  const [active, setActive] = useState<WorkspaceId>("home");

  useEffect(() => {
    let cancelled = false;
    let teardown = () => {};

    // GSAP is loaded after first paint; nothing here is needed to read the page.
    import("./gsap").then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      teardown = setup(gsap, ScrollTrigger);
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return active;

  function setup(gsap: typeof import("gsap").gsap, ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger) {
    const mm = gsap.matchMedia();
    const stage = (id: string) => document.querySelector<HTMLElement>(`#${id} .ws-stage`);
    // Only the leading window tilts. Rotating a multi-thousand-pixel stage under
    // perspective swings its far end toward the camera and blows up the layout.
    const head = (id: string) => document.querySelector<HTMLElement>(`#${id} .ws-stage > :first-child`);

    // Active workspace tracking runs regardless of motion preference.
    const triggers = workspaces.map((w) =>
      ScrollTrigger.create({
        trigger: `#${w.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(w.id),
      })
    );

    const build = (tilt: number, travel: number) => {
      workspaces.forEach((w, i) => {
        if (i === 0) return;
        const incoming = head(w.id);
        const outgoing = stage(workspaces[i - 1].id);
        if (!incoming || !outgoing) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: `#${w.id}`,
            start: "top 95%",
            end: "top 30%",
            scrub: 0.6,
          },
        });
        tl.fromTo(
          incoming,
          { rotateX: tilt, transformPerspective: 1400, transformOrigin: "50% 0", scale: 0.9, y: travel, opacity: 0.35 },
          { rotateX: 0, scale: 1, y: 0, opacity: 1, ease: "power2.out" },
          0
        );
        tl.fromTo(
          outgoing,
          { scale: 1, opacity: 1, transformOrigin: "50% 100%" },
          { scale: 0.95, opacity: 0.55, ease: "none", immediateRender: false },
          0
        );
      });
    };

    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
      () => build(16, 90)
    );
    // Phones: flat vertical slide only (no perspective tilt).
    mm.add(
      "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
      () => build(0, 48)
    );

    // Section heights change once fonts and images settle.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      triggers.forEach((t) => t.kill());
      mm.revert();
    };
  }
}
