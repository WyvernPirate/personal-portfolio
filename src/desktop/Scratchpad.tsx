import { useEffect, useRef, useState } from "react";
import { profile, workspaces } from "@/content/profile";
import { projects } from "@/content/projects";
import { scrollToWorkspace } from "./scroll";

type ScratchpadProps = { open: boolean; onClose: () => void };

const banner = ["phemelo-os · scratchpad terminal", "type 'help' for commands, esc to close", ""];

export default function Scratchpad({ open, onClose }: ScratchpadProps) {
  const [log, setLog] = useState<string[]>(banner);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Focus only when the user opens it; never on page load.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const run = (raw: string): string[] => {
    const [cmd, ...args] = raw.trim().toLowerCase().split(/\s+/);
    switch (cmd) {
      case "help":
        return ["help  whoami  neofetch  ls  projects  cv  ws <1-6|name>  contact  clear  exit"];
      case "whoami":
        return [`${profile.name} · ${profile.role.toLowerCase()} · ${profile.status.toLowerCase()}`];
      case "neofetch":
        return [
          `${profile.handle}`,
          `role   ${profile.role}`,
          `focus  ${profile.focus}`,
          `base   ${profile.base}`,
          `repos  ${projects.length} featured, more on github`,
        ];
      case "ls":
        return projects.map((p) => `${p.slug.padEnd(22)} ${p.status}`);
      case "projects":
        scrollToWorkspace("work");
        return ["switching to workspace 3 (work)"];
      case "contact":
        scrollToWorkspace("mail");
        return ["switching to workspace 6 (mail)"];
      case "cv":
        window.open(profile.cv, "_blank", "noopener");
        return ["opening cv.pdf"];
      case "ws": {
        const arg = args[0];
        const target = workspaces.find((w, i) => String(i + 1) === arg || w.id === arg || w.label === arg);
        if (!target) return ["usage: ws <1-6|home|dive|work|log|stack|mail>"];
        scrollToWorkspace(target.id);
        return [`switching to workspace ${workspaces.indexOf(target) + 1} (${target.label})`];
      }
      case "sudo":
        return ["phemelo is not in the sudoers file. This incident will be reported."];
      case "clear":
        return ["\u0000clear"];
      case "exit":
        onClose();
        return [];
      case "":
        return [];
      default:
        return [`zsh: command not found: ${cmd}`];
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const out = run(input);
    setLog((prev) =>
      out[0] === "\u0000clear" ? banner : [...prev, `$ ${input}`, ...out]
    );
    setInput("");
  };

  return (
    <div
      id="scratchpad"
      className="scratchpad"
      data-open={open}
      role="dialog"
      aria-label="Terminal"
      aria-hidden={!open}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div ref={logRef} className="scratchpad-log" aria-live="polite">
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <form className="scratchpad-row" onSubmit={submit}>
        <span className="prompt" aria-hidden="true">
          $
        </span>
        <label className="sr-only" htmlFor="scratchpad-input">
          Command
        </label>
        <input
          id="scratchpad-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          tabIndex={open ? 0 : -1}
        />
      </form>
    </div>
  );
}
