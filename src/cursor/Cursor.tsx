import { useEffect, useRef } from "react";
import { world } from "@/world/progress";

type Mode = "dot" | "link" | "drag" | "text" | "press";

/** Fine-pointer cursor: a dot that grows over links, shows "drag" over 3D devices and becomes an I-beam in fields. */
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const node = el.current;
    if (!node) return;
    document.documentElement.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let mode: Mode = "dot";
    let overDom: Mode = "dot";
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      world.px = (e.clientX / window.innerWidth - 0.5) * 2;
      world.py = (e.clientY / window.innerHeight - 0.5) * 2;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea")) overDom = "text";
      else if (t?.closest("a, button, summary, [role=button]")) overDom = "link";
      else overDom = "dot";
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const next: Mode = world.dragging ? "press" : world.hoverDraggable ? "drag" : overDom;
      if (next !== mode) {
        mode = next;
        node.dataset.mode = mode;
        if (label.current) label.current.textContent = mode === "drag" ? "drag" : "";
      }
      const k = reduced ? 1 : 0.28;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    const up = () => (world.dragging = false);
    window.addEventListener("pointerup", up);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={el} className="cursor" data-mode="dot" aria-hidden="true">
      <span ref={label} className="cursor-label mono" />
    </div>
  );
}
