import { CanvasTexture, SRGBColorSpace, TextureLoader, type Texture } from "three";
import { experience } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import type { Project } from "@/content/projects";

const MONO = '"Martian Mono Variable", ui-monospace, monospace';
const BODY = '"Atkinson Hyperlegible Next Variable", system-ui, sans-serif';

function tex(canvas: HTMLCanvasElement) {
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function frame(g: CanvasRenderingContext2D, w: number, h: number, app: string, title: string, active: boolean) {
  g.clearRect(0, 0, w, h);
  g.beginPath();
  g.roundRect(4, 4, w - 8, h - 8, 34);
  g.fillStyle = "rgba(30,28,52,0.96)";
  g.fill();
  g.lineWidth = active ? 5 : 3;
  const grad = g.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, active ? "#75AADB" : "rgba(156,153,180,0.45)");
  grad.addColorStop(1, active ? "#E3A869" : "rgba(156,153,180,0.25)");
  g.strokeStyle = grad;
  g.stroke();
  g.font = `600 24px ${MONO}`;
  g.fillStyle = "#E3A869";
  g.fillText(app, 36, 58);
  g.font = `400 24px ${MONO}`;
  g.fillStyle = "#9C99B4";
  g.fillText(` ${title}`, 36 + g.measureText(app).width, 58);
}

/** Four decorative "windows" built from real content, shared across the corridor. */
export function makeWindowTextures(): CanvasTexture[] {
  const W = 700;
  const H = 460;
  const out: CanvasTexture[] = [];

  // 0: code
  {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    frame(g, W, H, "nvim", "projects.ts", true);
    const colors = ["#75AADB", "#E3A869", "#ECEAF4", "#9C99B4", "#8fe0a8"];
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let row = 0; row < 11; row++) {
      let x = 40 + (row % 3 === 1 ? 36 : row % 3 === 2 ? 72 : 0);
      g.fillStyle = "#4a4875";
      g.font = `400 18px ${MONO}`;
      g.fillText(String(row + 1).padStart(2, " "), 10, 112 + row * 30);
      for (let k = 0; k < 4; k++) {
        const wd = 40 + rnd() * 110;
        g.fillStyle = colors[Math.floor(rnd() * colors.length)];
        g.beginPath();
        g.roundRect(x, 98 + row * 30, wd, 14, 6);
        g.fill();
        x += wd + 14;
        if (x > W - 120) break;
      }
    }
    out.push(tex(c));
  }

  // 1: git log
  {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    frame(g, W, H, "kitty", "git log --oneline", false);
    g.font = `500 26px ${MONO}`;
    experience.slice(0, 5).forEach((e, i) => {
      g.fillStyle = "#E3A869";
      g.fillText(e.hash, 36, 118 + i * 58);
      g.fillStyle = "#ECEAF4";
      g.font = `400 24px ${BODY}`;
      g.fillText(e.title.length > 34 ? e.title.slice(0, 33) + "…" : e.title, 190, 118 + i * 58);
      g.font = `500 26px ${MONO}`;
    });
    out.push(tex(c));
  }

  // 2: btop-style bars
  {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    frame(g, W, H, "btop", "shipping", false);
    const rows: [string, number][] = [
      ["react", 0.9],
      ["node", 0.78],
      ["python", 0.62],
      ["flutter", 0.5],
      ["firebase", 0.84],
      ["qualys", 0.4],
    ];
    rows.forEach(([name, v], i) => {
      const y = 108 + i * 52;
      g.fillStyle = "#9C99B4";
      g.font = `400 24px ${MONO}`;
      g.fillText(name, 36, y + 22);
      g.fillStyle = "rgba(156,153,180,0.2)";
      g.beginPath();
      g.roundRect(190, y, 440, 26, 13);
      g.fill();
      const grad = g.createLinearGradient(190, 0, 630, 0);
      grad.addColorStop(0, "#75AADB");
      grad.addColorStop(1, "#E3A869");
      g.fillStyle = grad;
      g.beginPath();
      g.roundRect(190, y, 440 * v, 26, 13);
      g.fill();
    });
    out.push(tex(c));
  }

  // 3: tree
  {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    frame(g, W, H, "kitty", "tree ~/stack", false);
    g.font = `500 24px ${MONO}`;
    skillGroups.slice(0, 5).forEach((grp, i) => {
      const y = 112 + i * 64;
      g.fillStyle = "#75AADB";
      g.fillText(`${grp.name}/`, 36, y);
      g.fillStyle = "#9C99B4";
      g.font = `400 22px ${BODY}`;
      g.fillText(grp.items.slice(0, 3).join(", "), 56, y + 30);
      g.font = `500 24px ${MONO}`;
    });
    out.push(tex(c));
  }

  return out;
}

/** Stand-in screen for projects without a screenshot yet: a believable app skeleton in the site's colours. */
export function makePlaceholder(project: Project, w: number, h: number): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const phone = project.device === "phone";
  const pad = w * (phone ? 0.07 : 0.035);

  const bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#1B1A2E");
  bg.addColorStop(1, "#262248");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  const glow = (x: number, y: number, col: string) => {
    const r = g.createRadialGradient(x, y, 0, x, y, w * 0.85);
    r.addColorStop(0, col);
    r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, w, h);
  };
  glow(w, 0, "rgba(117,170,219,0.30)");
  glow(0, h, "rgba(227,168,105,0.24)");

  const card = (x: number, y: number, cw: number, ch: number, r = 18) => {
    g.fillStyle = "rgba(36,34,58,0.92)";
    g.beginPath();
    g.roundRect(x, y, cw, ch, r);
    g.fill();
    g.strokeStyle = "rgba(156,153,180,0.22)";
    g.lineWidth = 2;
    g.stroke();
  };
  const line = (x: number, y: number, lw: number, lh: number, col = "rgba(156,153,180,0.35)") => {
    g.fillStyle = col;
    g.beginPath();
    g.roundRect(x, y, lw, lh, lh / 2);
    g.fill();
  };
  const grad = (x: number, lw: number) => {
    const t = g.createLinearGradient(x, 0, x + lw, 0);
    t.addColorStop(0, "#75AADB");
    t.addColorStop(1, "#E3A869");
    return t;
  };

  // app bar
  const barH = h * (phone ? 0.075 : 0.09);
  line(pad, barH * 0.4, w * 0.22, barH * 0.22, "#ECEAF4");
  g.fillStyle = grad(w - pad - w * 0.1, w * 0.1);
  g.beginPath();
  g.arc(w - pad - barH * 0.3, barH * 0.5, barH * 0.26, 0, Math.PI * 2);
  g.fill();

  // title block (on laptops it sits right of the sidebar so nothing covers it)
  const tx = phone ? pad : pad + w * 0.17 + pad * 0.6;
  const size = Math.max(22, Math.round(w * (phone ? 0.082 : 0.04)));
  g.fillStyle = "#ECEAF4";
  g.font = `700 ${size}px ${MONO}`;
  let y = barH + size * 1.6;
  let row = "";
  for (const word of project.name.split(" ")) {
    const test = row ? `${row} ${word}` : word;
    if (g.measureText(test).width > w - tx - pad && row) {
      g.fillText(row, tx, y);
      row = word;
      y += size * 1.15;
    } else row = test;
  }
  g.fillText(row, tx, y);
  g.fillStyle = grad(tx, w * 0.2);
  g.beginPath();
  g.roundRect(tx, y + size * 0.4, w * 0.2, size * 0.16, 8);
  g.fill();

  // content cards
  const top = y + size * 1.4;
  if (phone) {
    const cw = w - pad * 2;
    for (let i = 0; i < 3; i++) {
      const cy = top + i * h * 0.15;
      card(pad, cy, cw, h * 0.125);
      g.fillStyle = i === 0 ? grad(pad, cw) : "rgba(156,153,180,0.25)";
      g.beginPath();
      g.roundRect(pad + 16, cy + h * 0.03, h * 0.065, h * 0.065, 14);
      g.fill();
      line(pad + h * 0.065 + 34, cy + h * 0.036, cw * 0.5, h * 0.016, "#ECEAF4");
      line(pad + h * 0.065 + 34, cy + h * 0.066, cw * 0.34, h * 0.012);
    }
    // tab bar
    card(pad * 0.6, h - h * 0.1, w - pad * 1.2, h * 0.075, 26);
    for (let i = 0; i < 4; i++) {
      g.fillStyle = i === 0 ? grad(w * 0.15, 40) : "rgba(156,153,180,0.4)";
      g.beginPath();
      g.arc(w * (0.2 + i * 0.2), h - h * 0.062, h * 0.014, 0, Math.PI * 2);
      g.fill();
    }
  } else {
    const side = w * 0.17;
    card(pad, barH + pad * 0.5, side, h - barH - pad * 1.5);
    for (let i = 0; i < 6; i++) line(pad + 20, barH + pad + 24 + i * 44, side * (i === 0 ? 0.7 : 0.5), 12, i === 0 ? "#75AADB" : undefined);
    const cx = pad + side + pad * 0.6;
    const cw = (w - cx - pad - pad * 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      card(cx + i * (cw + pad * 0.3), top, cw, h * 0.16);
      g.fillStyle = grad(cx, cw);
      g.font = `700 ${size * 1.1}px ${MONO}`;
      g.fillText(["24", "87%", "3.2k"][i], cx + i * (cw + pad * 0.3) + 24, top + h * 0.09);
      line(cx + i * (cw + pad * 0.3) + 24, top + h * 0.12, cw * 0.5, 10);
    }
    const chartY = top + h * 0.2;
    card(cx, chartY, w - cx - pad, h - chartY - pad);
    g.strokeStyle = grad(cx, w - cx);
    g.lineWidth = 6;
    g.beginPath();
    for (let i = 0; i <= 24; i++) {
      const px = cx + 30 + (i / 24) * (w - cx - pad - 60);
      const py = chartY + (h - chartY - pad) * (0.65 - 0.3 * Math.sin(i * 0.5) * 0.7 - i * 0.008);
      if (i) g.lineTo(px, py);
      else g.moveTo(px, py);
    }
    g.stroke();
  }

  g.fillStyle = "#9C99B4";
  g.font = `400 ${Math.round(size * 0.45)}px ${MONO}`;
  g.fillText(project.stack.slice(0, 3).join(" · "), pad, h - pad * (phone ? 5.2 : 0.7));

  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Loads /shots/<shot>.webp, resolving to null if it is missing so callers keep the placeholder. */
export function loadShot(shot: string): Promise<Texture | null> {
  return new Promise((resolve) => {
    new TextureLoader().load(
      `/shots/${shot}.webp`,
      (t) => {
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 8;
        resolve(t);
      },
      undefined,
      () => resolve(null)
    );
  });
}
