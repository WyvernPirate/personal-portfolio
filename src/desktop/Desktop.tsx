import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Waybar from "./Waybar";
import Scratchpad from "./Scratchpad";
import Gate from "@/gate/Gate";
import Cursor from "@/cursor/Cursor";
import Acts from "@/sections/Acts";
import { startSmoothScroll, scrollToWorkspace, workspaceByIndex } from "./scroll";
import { workspaces, type WorkspaceId } from "@/content/profile";
import { prefersReducedMotion } from "@/lib/motion";
import { detectTier, hasWebGL } from "@/world/tier";
import { measure, notify, sample, world } from "@/world/progress";

const loadExperience = () => import("@/world/Experience");
const Experience = lazy(loadExperience);

const GATE_KEY = "gate-seen";
const gateSeen = () => {
  try {
    return sessionStorage.getItem(GATE_KEY) === "1";
  } catch {
    return false;
  }
};

const isEditable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export default function Desktop() {
  const webgl = useMemo(hasWebGL, []);
  const initialTier = useMemo(detectTier, []);
  // Without WebGL there is nothing to wait for: show the content directly.
  const [gateOpen, setGateOpen] = useState(() => webgl && !gateSeen());
  const [terminalOpen, setTerminalOpen] = useState(false);
  const toggleTerminal = useCallback(() => setTerminalOpen((o) => !o), []);

  useEffect(() => {
    document.documentElement.classList.toggle("no-webgl", !webgl);
    document.documentElement.classList.toggle("gate-open", gateOpen);
  }, [webgl, gateOpen]);

  const enter = useCallback(() => {
    try {
      sessionStorage.setItem(GATE_KEY, "1");
    } catch {
      /* private mode: the gate just shows again next visit */
    }
    setGateOpen(false);
  }, []);

  // Start fetching the 3D chunk straight away so it is ready by the time the lock screen is dismissed.
  useEffect(() => {
    if (webgl) void loadExperience();
  }, [webgl]);

  useEffect(() => {
    world.reduced = prefersReducedMotion();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => (world.reduced = mq.matches);
    mq.addEventListener("change", onChange);

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const hash = window.location.hash.slice(1) as WorkspaceId;
    if (!workspaces.some((w) => w.id === hash)) window.scrollTo(0, 0);

    // Keeps the HUD in step even when there is no canvas (no WebGL).
    const onScroll = () => {
      sample();
      notify();
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(() => {
      measure();
      onScroll();
    });
    const stop = startSmoothScroll();
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      stop();
    };
  }, []);

  useEffect(() => {
    if (gateOpen) return;
    const hash = window.location.hash.slice(1) as WorkspaceId;
    if (workspaces.some((w) => w.id === hash) && hash !== "home") {
      const id = window.setTimeout(() => scrollToWorkspace(hash), 400);
      return () => window.clearTimeout(id);
    }
  }, [gateOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gateOpen) return;
      if (e.key === "`" || e.key === "~") {
        if (isEditable(e.target) && (e.target as HTMLElement).id !== "scratchpad-input") return;
        e.preventDefault();
        toggleTerminal();
        return;
      }
      if (e.key === "Escape") setTerminalOpen(false);

      const n = Number(e.key);
      if (n >= 1 && n <= workspaces.length) {
        const wantsJump = e.altKey || (!e.ctrlKey && !e.metaKey && !isEditable(e.target));
        const id = workspaceByIndex(n);
        if (wantsJump && id) {
          e.preventDefault();
          scrollToWorkspace(id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTerminal, gateOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {webgl && (
        <Suspense fallback={null}>
          <Experience initialTier={initialTier} paused={gateOpen} onReady={() => {}} />
        </Suspense>
      )}
      <Waybar onToggleTerminal={toggleTerminal} terminalOpen={terminalOpen} />
      <Scratchpad open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <Acts />
      <Cursor />
      {gateOpen && <Gate onEnter={enter} />}
    </>
  );
}
