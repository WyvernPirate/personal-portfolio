import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, CatmullRomCurve3, Color, DoubleSide, SRGBColorSpace, TubeGeometry, Vector3, type Group, type Mesh } from "three";
import { experience, type LogEntry } from "@/content/experience";
import { INSIDE_Y, LOG_X } from "../layout";
import { world } from "../progress";

const SPACING = 5;
// Indices per tube cross-section (8 radial segments x 2 triangles x 3). Draw ranges must end on a whole
// ring, otherwise the growing tip is cut mid-ring and shows as a thin spike.
const RING = 8 * 6;
const ringAligned = (count: number, frac: number) => Math.floor((count * frac) / RING) * RING;
const Y0 = INSIDE_Y + 0.6;
const kindColor: Record<LogEntry["kind"], string> = { work: "#75AADB", study: "#9C99B4", lead: "#E3A869" };

function label(entry: LogEntry) {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 240;
  const g = c.getContext("2d")!;
  g.beginPath();
  g.roundRect(4, 4, 632, 232, 30);
  g.fillStyle = "rgba(30,28,52,0.95)";
  g.fill();
  g.lineWidth = 4;
  g.strokeStyle = kindColor[entry.kind];
  g.stroke();
  g.font = '600 30px "Martian Mono Variable", monospace';
  g.fillStyle = "#E3A869";
  g.fillText(entry.hash, 34, 62);
  g.fillStyle = "#9C99B4";
  g.font = '400 26px "Martian Mono Variable", monospace';
  g.fillText(entry.period, 190, 62);
  g.fillStyle = "#ECEAF4";
  g.font = '600 34px "Atkinson Hyperlegible Next Variable", sans-serif';
  const title = entry.title.length > 30 ? entry.title.slice(0, 29) + "…" : entry.title;
  g.fillText(title, 34, 130);
  g.fillStyle = "#9C99B4";
  g.font = '400 27px "Atkinson Hyperlegible Next Variable", sans-serif';
  const org = entry.org.length > 40 ? entry.org.slice(0, 39) + "…" : entry.org;
  g.fillText(org, 34, 184);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** A commit history that draws itself as you scroll: trunk, one feature branch per role. */
export default function GitGraph() {
  // chronological, oldest on the left
  const commits = useMemo(() => [...experience].reverse(), []);
  const n = commits.length;
  const span = (n - 1) * SPACING;
  const x0 = LOG_X - span / 2;

  const geos = useMemo(() => {
    const trunk = new TubeGeometry(
      new CatmullRomCurve3([new Vector3(x0 - 5, Y0, 0), new Vector3(x0 + span + 5, Y0, 0)]),
      64,
      0.05,
      8,
      false
    );
    const branches = commits.map((_, i) => {
      const x = x0 + i * SPACING;
      const up = i % 2 === 0 ? 1 : -1;
      const curve = new CatmullRomCurve3([
        new Vector3(x - 1.9, Y0, 0),
        new Vector3(x - 1.0, Y0 + 0.9 * up, 0),
        new Vector3(x, Y0 + 1.7 * up, 0),
        new Vector3(x + 1.0, Y0 + 0.9 * up, 0),
        new Vector3(x + 1.9, Y0, 0),
      ]);
      return new TubeGeometry(curve, 40, 0.045, 8, false);
    });
    return { trunk, branches };
  }, [commits, x0, span]);

  const labels = useMemo(() => commits.map(label), [commits]);
  useEffect(
    () => () => {
      labels.forEach((t) => t.dispose());
      geos.trunk.dispose();
      geos.branches.forEach((g) => g.dispose());
    },
    [labels, geos]
  );

  const group = useRef<Group>(null);
  const nodes = useRef<(Mesh | null)[]>([]);
  const tags = useRef<(Mesh | null)[]>([]);
  const trunkIdx = geos.trunk.index!.count;
  const color = useMemo(() => commits.map((c) => new Color(kindColor[c.kind])), [commits]);

  useFrame(({ clock }) => {
    if (world.act !== 3) return;
    // Everything up to the commit in view is fully drawn; the next one grows in as you approach it.
    const u = Math.min(n - 1, Math.max(0, world.u));
    const trunkFrac = Math.min(1, (u * SPACING + 5 + 3.2) / (span + 10));
    geos.trunk.setDrawRange(0, ringAligned(trunkIdx, trunkFrac));
    commits.forEach((_, i) => {
      const local = Math.min(1, Math.max(0, (u - (i - 0.9)) / 0.8));
      const g = geos.branches[i];
      g.setDrawRange(0, ringAligned(g.index!.count, local));
      // The node sits at the apex (halfway along the branch): it appears only once the tube has reached it.
      const reached = Math.min(1, Math.max(0, (local - 0.5) / 0.12));
      const node = nodes.current[i];
      const tag = tags.current[i];
      const pulse = world.reduced ? 1 : 1 + Math.sin(clock.elapsedTime * 2 + i) * 0.05;
      if (node) node.scale.setScalar(Math.max(0.001, reached) * pulse);
      if (tag) tag.scale.setScalar(Math.max(0.001, reached));
    });
  });

  return (
    <group ref={group}>
      <fog attach="fog" args={["#0c0b19", 16, 46]} />
      <ambientLight intensity={0.5} />
      <mesh geometry={geos.trunk}>
        <meshBasicMaterial color="#9C99B4" toneMapped={false} side={DoubleSide} />
      </mesh>
      {commits.map((c, i) => {
        const x = x0 + i * SPACING;
        const up = i % 2 === 0 ? 1 : -1;
        return (
          <group key={c.hash}>
            <mesh geometry={geos.branches[i]}>
              <meshBasicMaterial color={color[i]} toneMapped={false} side={DoubleSide} />
            </mesh>
            <mesh
              ref={(m) => {
                nodes.current[i] = m;
              }}
              position={[x, Y0 + 1.7 * up, 0]}
            >
              <sphereGeometry args={[0.24, 24, 24]} />
              <meshBasicMaterial color={color[i]} toneMapped={false} />
            </mesh>
            <mesh
              ref={(m) => {
                tags.current[i] = m;
              }}
              position={[x, Y0 + 1.7 * up + up * 1.35, 0]}
            >
              <planeGeometry args={[3.4, 1.28]} />
              <meshBasicMaterial map={labels[i]} transparent toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
