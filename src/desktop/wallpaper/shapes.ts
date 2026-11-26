type Pt = [number, number];

/** Seeded RNG so the shapes are identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Resample polylines into `n` points spread by length, with a touch of jitter. */
function sampleLines(lines: Pt[][], n: number, jitter = 0.012, seed = 1): Float32Array {
  const rand = rng(seed);
  const segs: { a: Pt; b: Pt; len: number }[] = [];
  let total = 0;
  for (const line of lines) {
    for (let i = 0; i < line.length - 1; i++) {
      const len = Math.hypot(line[i + 1][0] - line[i][0], line[i + 1][1] - line[i][1]);
      segs.push({ a: line[i], b: line[i + 1], len });
      total += len;
    }
  }
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let t = rand() * total;
    let seg = segs[0];
    for (const s of segs) {
      if (t <= s.len) {
        seg = s;
        break;
      }
      t -= s.len;
    }
    const u = seg.len ? t / seg.len : 0;
    out[i * 3] = seg.a[0] + (seg.b[0] - seg.a[0]) * u + (rand() - 0.5) * jitter * 2;
    out[i * 3 + 1] = seg.a[1] + (seg.b[1] - seg.a[1]) * u + (rand() - 0.5) * jitter * 2;
    out[i * 3 + 2] = (rand() - 0.5) * 0.18;
  }
  return out;
}

const rect = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
  [x, y],
];

// Botswana, stylised from lon/lat and recentred on the unit square.
const botswana: Pt[] = (
  [
    [20.0, -24.8], [20.0, -22.0], [21.0, -22.0], [21.0, -18.0], [23.5, -18.0], [25.25, -17.8],
    [25.8, -18.5], [26.5, -19.5], [27.3, -20.5], [28.0, -21.6], [27.0, -23.0], [26.0, -24.5],
    [25.5, -25.3], [24.5, -25.8], [23.0, -25.3], [22.0, -26.5], [20.7, -26.9], [20.0, -24.8],
  ] as Pt[]
).map(([lon, lat]) => [(lon - 24) / 4.6, (lat + 22.2) / 4.6]);

function gitGraph(): Pt[][] {
  const main: Pt[] = [[-0.9, 0], [0.9, 0]];
  const branch = (x0: number, x1: number, y: number): Pt[] => [
    [x0, 0], [x0 + 0.12, y * 0.6], [x0 + 0.25, y], [x1 - 0.25, y], [x1 - 0.12, y * 0.6], [x1, 0],
  ];
  return [main, branch(-0.6, -0.1, 0.38), branch(-0.25, 0.45, -0.34), branch(0.2, 0.75, 0.3), ...[-0.6, -0.1, -0.25, 0.45, 0.2, 0.75].map((x): Pt[] => [[x, -0.05], [x, 0.05]])];
}

function devices(): Pt[][] {
  return [
    rect(-0.82, -0.32, 0.9, 0.58), // laptop lid
    [[-0.92, -0.32], [-0.92, -0.38], [0.18, -0.38], [0.18, -0.32]], // laptop base
    rect(0.4, -0.45, 0.32, 0.7), // phone
    [[0.51, 0.19], [0.61, 0.19]],
  ];
}

function tree(): Pt[][] {
  const lines: Pt[][] = [];
  const grow = (x: number, y: number, angle: number, len: number, depth: number) => {
    const x2 = x + Math.sin(angle) * len;
    const y2 = y + Math.cos(angle) * len;
    lines.push([[x, y], [x2, y2]]);
    if (depth === 0) return;
    grow(x2, y2, angle - 0.5, len * 0.72, depth - 1);
    grow(x2, y2, angle + 0.45, len * 0.72, depth - 1);
  };
  grow(0, -0.85, 0, 0.42, 7);
  return lines;
}

function network(): Pt[][] {
  const rand = rng(7);
  const nodes: Pt[] = Array.from({ length: 16 }, () => [(rand() - 0.5) * 1.7, (rand() - 0.5) * 1.3]);
  const lines: Pt[][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ b, j, d: Math.hypot(a[0] - b[0], a[1] - b[1]) }))
      .filter((o) => o.j > i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach((o) => lines.push([a, o.b]));
  });
  return lines;
}

const envelope: Pt[][] = [
  rect(-0.75, -0.45, 1.5, 0.9),
  [[-0.75, 0.45], [0, -0.05], [0.75, 0.45]],
  [[-0.75, -0.45], [-0.2, 0.0]],
  [[0.75, -0.45], [0.2, 0.0]],
];

export function buildShapes(count: number): Float32Array[] {
  return [
    sampleLines([botswana], count, 0.01, 11),
    sampleLines(gitGraph(), count, 0.012, 12),
    sampleLines(devices(), count, 0.01, 13),
    sampleLines(tree(), count, 0.01, 14),
    sampleLines(network(), count, 0.01, 15),
    sampleLines(envelope, count, 0.01, 16),
  ];
}
