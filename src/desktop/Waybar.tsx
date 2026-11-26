import { useEffect, useState } from "react";
import { profile, workspaces } from "@/content/profile";
import { scrollToWorkspace } from "./scroll";
import { subscribe, world } from "@/world/progress";
import { isSoundOn, setSound } from "@/audio/sfx";

type WaybarProps = { onToggleTerminal: () => void; terminalOpen: boolean };

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
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    return () => window.clearTimeout(timer);
  }, []);
  return clockFormat.format(now).replace(",", "");
}

export default function Waybar({ onToggleTerminal, terminalOpen }: WaybarProps) {
  const clock = useBotswanaClock();
  const [active, setActive] = useState(world.act);
  const [pct, setPct] = useState(0);
  const [sound, setSoundState] = useState(isSoundOn());

  useEffect(() => {
    const off = subscribe((act, p) => {
      setActive(act);
      setPct(p);
    });
    const onSound = (e: Event) => setSoundState((e as CustomEvent<boolean>).detail);
    window.addEventListener("sound-change", onSound);
    return () => {
      off();
      window.removeEventListener("sound-change", onSound);
    };
  }, []);

  return (
    <header className="waybar">
      <nav aria-label="Sections">
        {workspaces.map((w, i) => (
          <a
            key={w.id}
            className="ws-pill"
            href={`#${w.id}`}
            aria-current={active === i ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              scrollToWorkspace(w.id);
            }}
          >
            <span aria-hidden="true">{active === i ? w.label : i + 1}</span>
            <span className="sr-only">
              {w.title}, section {i + 1}
            </span>
          </a>
        ))}
      </nav>

      <span className="waybar-clock" title="Local time in Botswana">
        {clock} CAT
      </span>

      <div className="waybar-right">
        <span className="waybar-uptime" aria-hidden="true" title="How far through the page you are">
          uptime {String(pct).padStart(2, "0")}%
        </span>
        <span className="waybar-status">{profile.status.toLowerCase()}</span>
        <a className="waybar-btn waybar-cv" href={profile.cv} download>
          cv.pdf
        </a>
        <button type="button" className="waybar-btn" aria-pressed={sound} onClick={() => setSound(!sound)}>
          <span aria-hidden="true">{sound ? "snd on" : "snd off"}</span>
          <span className="sr-only">Sound {sound ? "on" : "off"}. Toggle sound.</span>
        </button>
        <button type="button" className="waybar-btn" onClick={onToggleTerminal} aria-expanded={terminalOpen} aria-controls="scratchpad">
          <span aria-hidden="true">&gt;_</span>
          <span className="sr-only">Toggle terminal (backtick)</span>
        </button>
      </div>
    </header>
  );
}
