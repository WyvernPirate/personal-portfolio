import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Waybar from "./Waybar";
import Scratchpad from "./Scratchpad";
import Wallpaper from "./wallpaper/Wallpaper";
import { startSmoothScroll, scrollToWorkspace, workspaceByIndex } from "./scroll";
import { useWorkspaceScroll } from "./useWorkspaceScroll";
import HomeWorkspace from "@/sections/Home";
import LogWorkspace from "@/sections/Log";
import WorkWorkspace from "@/sections/Work";
import StackWorkspace from "@/sections/Stack";
import CrewWorkspace from "@/sections/Crew";
import { workspaces, type WorkspaceId } from "@/content/profile";

const MailWorkspace = lazy(() => import("@/sections/Mail"));

const isEditable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export default function Desktop() {
  const active = useWorkspaceScroll();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const toggleTerminal = useCallback(() => setTerminalOpen((o) => !o), []);

  useEffect(() => startSmoothScroll(), []);

  // Deep link: /#work etc.
  useEffect(() => {
    const id = window.location.hash.slice(1) as WorkspaceId;
    if (workspaces.some((w) => w.id === id) && id !== "home") {
      window.setTimeout(() => scrollToWorkspace(id), 300);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        // Allow closing from inside the terminal's own input, but never hijack other fields.
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
  }, [toggleTerminal]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Wallpaper />
      <Waybar active={active} onToggleTerminal={toggleTerminal} terminalOpen={terminalOpen} />
      <Scratchpad open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <main id="main-content" tabIndex={-1}>
        <HomeWorkspace />
        <LogWorkspace />
        <WorkWorkspace />
        <StackWorkspace />
        <CrewWorkspace />
        <Suspense fallback={<section id="mail" className="ws" tabIndex={-1} />}>
          <MailWorkspace />
        </Suspense>
      </main>
    </>
  );
}
