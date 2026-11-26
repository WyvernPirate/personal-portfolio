import { useEffect, useState } from "react";
import { profile, workspaces, type WorkspaceId } from "@/content/profile";
import { scrollToWorkspace } from "./scroll";

type WaybarProps = {
  active: WorkspaceId;
  onToggleTerminal: () => void;
  terminalOpen: boolean;
};

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timezone,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function useBotswanaClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: number;
    const tick = () => {
      setNow(new Date());
      // Re-sync to the next minute boundary so the clock never drifts.
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    return () => window.clearTimeout(timer);
  }, []);
  return clockFormat.format(now).replace(",", "");
}

export default function Waybar({ active, onToggleTerminal, terminalOpen }: WaybarProps) {
  const clock = useBotswanaClock();

  return (
    <header className="waybar">
      <nav aria-label="Workspaces">
        {workspaces.map((w, i) => (
          <a
            key={w.id}
            className="ws-pill"
            href={`#${w.id}`}
            aria-current={active === w.id ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              scrollToWorkspace(w.id);
            }}
          >
            <span aria-hidden="true">{active === w.id ? w.label : i + 1}</span>
            <span className="sr-only">
              {w.title}, workspace {i + 1}
            </span>
          </a>
        ))}
      </nav>

      <span className="waybar-clock" title="Local time in Botswana">
        {clock} CAT
      </span>

      <div className="waybar-right">
        <span className="waybar-status">{profile.status.toLowerCase()}</span>
        <a className="waybar-btn waybar-cv" href={profile.cv} download>
          cv.pdf
        </a>
        <button
          type="button"
          className="waybar-btn"
          onClick={onToggleTerminal}
          aria-expanded={terminalOpen}
          aria-controls="scratchpad"
        >
          <span aria-hidden="true">&gt;_</span>
          <span className="sr-only">Toggle terminal (backtick)</span>
        </button>
      </div>
    </header>
  );
}
