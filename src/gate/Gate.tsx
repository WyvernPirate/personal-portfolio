import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { prefersReducedMotion } from "@/lib/motion";
import { chime, setSound } from "@/audio/sfx";

type GateProps = { onEnter: () => void };

const bootLines = [
  ["ok", "Reached target Graphical Interface"],
  ["ok", "Started Hyprland compositor"],
  ["ok", "Started waybar"],
  ["ok", "Mounted ~/work (8 projects)"],
  ["ok", "Loaded 3D session for phemelo"],
  ["..", "Starting hyprlock"],
] as const;

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timezone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timezone,
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function Gate({ onEnter }: GateProps) {
  const reduced = prefersReducedMotion();
  const [stage, setStage] = useState<"boot" | "lock">(reduced ? "lock" : "boot");
  const [lines, setLines] = useState(reduced ? bootLines.length : 0);
  const [dots, setDots] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);

  // Boot log: a few lines, then hand over to the lock screen.
  useEffect(() => {
    if (stage !== "boot") return;
    const id = window.setInterval(() => {
      setLines((n) => {
        if (n + 1 >= bootLines.length) {
          window.clearInterval(id);
          window.setTimeout(() => setStage("lock"), 380);
        }
        return n + 1;
      });
    }, 150);
    return () => window.clearInterval(id);
  }, [stage]);

  // The "password" fills itself, as if the session were already trusted.
  useEffect(() => {
    if (stage !== "lock") return;
    if (reduced) return setDots(6);
    const id = window.setInterval(() => setDots((d) => (d >= 6 ? 6 : d + 1)), 110);
    return () => window.clearInterval(id);
  }, [stage, reduced]);

  useEffect(() => {
    if (stage === "lock") firstButton.current?.focus();
  }, [stage]);

  const enter = (sound: boolean) => {
    if (leaving) return;
    setSound(sound); // runs inside the click, so the browser allows audio
    if (sound) chime();
    setLeaving(true);
    window.setTimeout(onEnter, reduced ? 0 : 650);
  };

  return (
    <div className="gate" data-leaving={leaving} role="dialog" aria-modal="true" aria-label="Lock screen">
      {stage === "boot" && (
        <div className="boot mono" aria-hidden="true">
          {bootLines.slice(0, lines).map(([state, text]) => (
            <p key={text}>
              <span className={state === "ok" ? "boot-ok" : "boot-wait"}>[ {state === "ok" ? " OK " : " .. "} ]</span> {text}
            </p>
          ))}
          <span className="caret" />
        </div>
      )}

      {stage === "boot" && (
        <button type="button" className="gate-skip" onClick={() => setStage("lock")}>
          Skip intro
        </button>
      )}

      {stage === "lock" && (
        <div className="lock">
          <p className="lock-clock mono">{clockFormat.format(new Date())}</p>
          <p className="lock-date">{dateFormat.format(new Date())}</p>

          <picture>
            <source srcSet="/profile.avif" type="image/avif" />
            <img className="lock-photo" src="/profile.webp" alt="" width={96} height={96} />
          </picture>
          <p className="lock-user mono">phemelo</p>

          <div className="lock-field mono" aria-hidden="true">
            {"•".repeat(dots)}
            <span className="caret" />
          </div>
          <p className="lock-hint">Software engineer. Press enter to log in.</p>

          <div className="lock-actions">
            <button ref={firstButton} type="button" className="btn btn-primary" onClick={() => enter(true)}>
              Enter with sound
            </button>
            <button type="button" className="btn" onClick={() => enter(false)}>
              Without sound
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
