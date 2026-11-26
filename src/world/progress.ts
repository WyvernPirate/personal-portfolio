import { workspaces, type WorkspaceId } from "@/content/profile";

export type Quality = "high" | "mid" | "low";

/** Mutable world state, written by scroll/pointer and read every frame. Never React state. */
export const world = {
  /** 0..1 over the whole page */
  global: 0,
  /** index into `workspaces` */
  act: 0,
  /** 0..1 inside the active act */
  t: 0,
  /** pointer in -1..1 */
  px: 0,
  py: 0,
  quality: "high" as Quality,
  reduced: false,
  /** fractional card index inside the work and log acts (0 = first card centred in view) */
  u: 0,
  /** brief brightness/CRT pulse that hides the hard cut when the active act changes (decays with time) */
  flash: 0,
  /** drag in progress on a 3D object (cursor + scroll hint) */
  dragging: false,
  hoverDraggable: false,
};

let tops: number[] = [];
let total = 1;
// Document-space Y of each card's centre, so the camera lines up with the text it explains.
let centers: Record<"work" | "log", number[]> = { work: [], log: [] };

export const actIndex = (id: WorkspaceId) => workspaces.findIndex((w) => w.id === id);

/** Cache section offsets. Call after layout settles (fonts, resize). */
export function measure() {
  tops = workspaces.map((w) => document.getElementById(w.id)?.offsetTop ?? 0);
  total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const centre = (sel: string) =>
    [...document.querySelectorAll<HTMLElement>(sel)].map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + window.scrollY + r.height / 2;
    });
  centers = { work: centre("#work .card"), log: centre("#log .card") };
}

function indexAlong(cs: number[], y: number) {
  if (cs.length < 2) return 0;
  if (y <= cs[0]) return 0;
  for (let k = 0; k < cs.length - 1; k++) {
    if (y <= cs[k + 1]) return k + (y - cs[k]) / Math.max(1, cs[k + 1] - cs[k]);
  }
  return cs.length - 1;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** Reads the scroll position into `world`. Cheap; safe to call every frame. */
export function sample() {
  if (!tops.length) measure();
  const y = window.scrollY;
  world.global = clamp01(y / total);

  let i = tops.length - 1;
  while (i > 0 && tops[i] > y + 1) i--;
  const end = i + 1 < tops.length ? tops[i + 1] : total + window.innerHeight;
  world.act = i;
  world.t = clamp01((y - tops[i]) / Math.max(1, end - tops[i]));

  const mid = y + window.innerHeight / 2;
  world.u = i === 2 ? indexAlong(centers.work, mid) : i === 3 ? indexAlong(centers.log, mid) : 0;

}

// Tiny subscription so the HUD can follow the active act without per-frame renders.
type Listener = (act: number, global: number) => void;
const listeners = new Set<Listener>();
let lastAct = -1;
let lastPct = -1;

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notify() {
  const pct = Math.round(world.global * 100);
  if (world.act !== lastAct || pct !== lastPct) {
    lastAct = world.act;
    lastPct = pct;
    listeners.forEach((fn) => fn(world.act, pct));
  }
}
