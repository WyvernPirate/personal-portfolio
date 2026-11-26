import type { ReactNode } from "react";
import type { WorkspaceId } from "@/content/profile";

type WorkspaceProps = { id: WorkspaceId; label: string; children: ReactNode };

/** One Hyprland workspace: a full-height section holding a grid of tiled windows. */
export default function Workspace({ id, label, children }: WorkspaceProps) {
  return (
    <section id={id} className="ws" aria-label={label} tabIndex={-1}>
      <div className="ws-stage">{children}</div>
    </section>
  );
}
