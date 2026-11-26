import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";
import { profile, workspaces } from "@/content/profile";
import { projects } from "@/content/projects";

const projectCount = projects.length;
const liveCount = projects.filter((p) => p.live).length;

export const SCREEN_W = 2048;
export const SCREEN_H = 864;

const FONT_MONO = '"Martian Mono Variable", ui-monospace, monospace';
const FONT_BODY = '"Atkinson Hyperlegible Next Variable", system-ui, sans-serif';

type Ctx = CanvasRenderingContext2D & { fontStretch?: string };

function roundRect(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

function windowFrame(c: Ctx, x: number, y: number, w: number, h: number, primary = false) {
  roundRect(c, x, y, w, h, 30);
  c.fillStyle = "rgba(36,34,58,0.94)";
  c.fill();
  c.lineWidth = primary ? 4 : 2;
  if (primary) {
    const g = c.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, "#75AADB");
    g.addColorStop(1, "#E3A869");
    c.strokeStyle = g;
  } else {
    c.strokeStyle = "rgba(156,153,180,0.28)";
  }
  c.stroke();
}

function appId(c: Ctx, x: number, y: number, app: string, title: string) {
  c.font = `600 22px ${FONT_MONO}`;
  c.fillStyle = "#E3A869";
  c.fillText(app, x, y);
  const w = c.measureText(app + " ").width;
  c.fillStyle = "#9C99B4";
  c.font = `400 22px ${FONT_MONO}`;
  c.fillText(title, x + w, y);
}

function wrap(c: Ctx, text: string, x: number, y: number, maxW: number, lh: number) {
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (c.measureText(test).width > maxW && line) {
      c.fillText(line, x, y);
      line = word;
      y += lh;
    } else line = test;
  }
  if (line) c.fillText(line, x, y);
  return y;
}

function waybar(c: Ctx, active: number) {
  roundRect(c, 20, 18, SCREEN_W - 40, 66, 33);
  c.fillStyle = "rgba(36,34,58,0.92)";
  c.fill();
  c.strokeStyle = "rgba(156,153,180,0.25)";
  c.lineWidth = 2;
  c.stroke();

  let x = 36;
  workspaces.forEach((w, i) => {
    const on = i === active;
    const label = on ? w.label : String(i + 1);
    c.font = `${on ? 700 : 500} 24px ${FONT_MONO}`;
    const pw = on ? 120 : 62;
    if (on) {
      const g = c.createLinearGradient(x, 0, x + pw, 0);
      g.addColorStop(0, "#75AADB");
      g.addColorStop(1, "#E3A869");
      roundRect(c, x, 28, pw, 46, 23);
      c.fillStyle = g;
      c.fill();
    }
    c.fillStyle = on ? "#1B1A2E" : "#9C99B4";
    c.textAlign = "center";
    c.fillText(label, x + pw / 2, 59);
    c.textAlign = "left";
    x += pw + 8;
  });

  const time = new Intl.DateTimeFormat("en-GB", { timeZone: profile.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
    .format(new Date())
    .replace(",", "");
  c.font = `500 24px ${FONT_MONO}`;
  c.fillStyle = "#ECEAF4";
  c.textAlign = "center";
  c.fillText(`${time} CAT`, SCREEN_W / 2, 59);

  c.textAlign = "right";
  c.fillText("open to work   cv.pdf   >_", SCREEN_W - 40, 59);
  c.fillStyle = "#6fd08c";
  c.beginPath();
  c.arc(SCREEN_W - 40 - c.measureText("open to work   cv.pdf   >_").width - 22, 52, 7, 0, Math.PI * 2);
  c.fill();
  c.textAlign = "left";
}

function background(c: Ctx) {
  const g = c.createLinearGradient(0, 0, 0, SCREEN_H);
  g.addColorStop(0, "#1B1A2E");
  g.addColorStop(1, "#13122a");
  c.fillStyle = g;
  c.fillRect(0, 0, SCREEN_W, SCREEN_H);
  const r1 = c.createRadialGradient(SCREEN_W * 0.15, 0, 0, SCREEN_W * 0.15, 0, 900);
  r1.addColorStop(0, "rgba(117,170,219,0.30)");
  r1.addColorStop(1, "rgba(117,170,219,0)");
  c.fillStyle = r1;
  c.fillRect(0, 0, SCREEN_W, SCREEN_H);
  const r2 = c.createRadialGradient(SCREEN_W * 0.85, SCREEN_H, 0, SCREEN_W * 0.85, SCREEN_H, 900);
  r2.addColorStop(0, "rgba(227,168,105,0.26)");
  r2.addColorStop(1, "rgba(227,168,105,0)");
  c.fillStyle = r2;
  c.fillRect(0, 0, SCREEN_W, SCREEN_H);
}

export type ScreenMode = "rice" | "terminal";

export function createScreen() {
  const canvas = document.createElement("canvas");
  canvas.width = SCREEN_W;
  canvas.height = SCREEN_H;
  const c = canvas.getContext("2d") as Ctx;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.anisotropy = 8;

  let mode: ScreenMode = "rice";
  let activeWs = 0;
  let photo: HTMLImageElement | null = null;

  const photoImg = new Image();
  photoImg.onload = () => {
    photo = photoImg;
    draw();
  };
  photoImg.src = "/profile.webp";

  function drawRice() {
    background(c);
    waybar(c, activeWs);

    // kitty: fastfetch
    windowFrame(c, 20, 104, 800, 740, true);
    appId(c, 56, 148, "kitty", "fastfetch");
    if (photo) {
      c.save();
      roundRect(c, 56, 176, 250, 310, 22);
      c.clip();
      const ratio = photo.width / photo.height;
      const dh = 310;
      const dw = dh * ratio;
      c.drawImage(photo, 56 - (dw - 250) / 2, 176, dw, dh);
      c.restore();
    }
    const rows: [string, string][] = [
      ["user", profile.handle],
      ["role", profile.role],
      ["focus", "Full stack, applied AI"],
      ["", "enterprise IT, security"],
      ["base", `${profile.base} (CAT)`],
      ["edu", "BSc CS & SE, BIUST 2026"],
      ["status", profile.status],
    ];
    let y = 214;
    rows.forEach(([k, v]) => {
      c.font = `500 25px ${FONT_MONO}`;
      c.fillStyle = "#E3A869";
      c.fillText(k, 340, y);
      c.fillStyle = "#ECEAF4";
      c.font = `400 26px ${FONT_BODY}`;
      c.fillText(v, 470, y);
      y += 46;
    });
    ["#1B1A2E", "#24223A", "#9C99B4", "#75AADB", "#E3A869", "#ECEAF4"].forEach((col, i) => {
      c.fillStyle = col;
      roundRect(c, 340 + i * 38, 560, 32, 18, 5);
      c.fill();
      c.strokeStyle = "rgba(156,153,180,0.3)";
      c.lineWidth = 1;
      c.stroke();
    });
    c.fillStyle = "#9C99B4";
    c.font = `400 26px ${FONT_BODY}`;
    wrap(c, "Scroll to dive into the screen.", 56, 760, 700, 36);

    // foot: whoami
    windowFrame(c, 832, 104, 1196, 480);
    appId(c, 868, 148, "foot", "whoami");
    c.fontStretch = "expanded";
    c.font = `700 150px ${FONT_MONO}`;
    c.fillStyle = "#ECEAF4";
    c.fillText("Phemelo", 868, 330);
    const g = c.createLinearGradient(868, 0, 1700, 0);
    g.addColorStop(0, "#75AADB");
    g.addColorStop(1, "#E3A869");
    c.fillStyle = g;
    c.fillText("Moloi", 868, 480);
    c.fontStretch = "normal";
    c.fillStyle = "#ECEAF4";
    c.font = `400 30px ${FONT_BODY}`;
    wrap(c, "Software engineer in Botswana. Full-stack products, applied AI and the secure IT behind them.", 1380, 380, 600, 42);

    // notify: now
    windowFrame(c, 832, 596, 1196, 248);
    appId(c, 868, 640, "notify", "now");
    c.fillStyle = "#ECEAF4";
    c.font = `700 44px ${FONT_MONO}`;
    c.fillText(profile.now.title, 868, 710);
    c.fillStyle = "#9C99B4";
    c.font = `400 28px ${FONT_BODY}`;
    wrap(c, profile.now.detail, 868, 762, 1100, 38);
  }

  function drawTerminal() {
    background(c);
    waybar(c, workspaces.length - 1);
    windowFrame(c, 20, 104, SCREEN_W - 40, 740, true);
    appId(c, 56, 148, "kitty", "~");
    c.font = `500 34px ${FONT_MONO}`;
    const lines: [string, string][] = [
      ["$", "whoami"],
      ["", "phemelo, software engineer"],
      ["", ""],
      ["$", "ls ~/work | wc -l"],
      ["", `${projectCount} projects, ${liveCount} of them live`],
      ["", ""],
      ["$", "echo $STATUS"],
      ["", "open to work"],
      ["", ""],
      ["$", "exit"],
      ["", "thanks for scrolling"],
    ];
    let y = 214;
    for (const [p, t] of lines) {
      c.fillStyle = "#E3A869";
      c.fillText(p, 56, y);
      c.fillStyle = "#ECEAF4";
      c.fillText(t, 100, y);
      y += 52;
    }
    c.fillStyle = "#E3A869";
    c.fillText("$", 56, y);
    c.fillRect(100, y - 30, 20, 38);
  }

  function draw() {
    c.clearRect(0, 0, SCREEN_W, SCREEN_H);
    if (mode === "rice") drawRice();
    else drawTerminal();
    texture.needsUpdate = true;
  }

  // Redraw once the webfonts are available so the first frame isn't in a fallback face.
  const fontsReady = document.fonts
    ? Promise.all([
        document.fonts.load(`700 40px ${FONT_MONO}`),
        document.fonts.load(`400 30px ${FONT_BODY}`),
      ]).then(draw)
    : Promise.resolve();
  draw();

  return {
    texture,
    fontsReady,
    setMode(next: ScreenMode) {
      if (next === mode) return;
      mode = next;
      draw();
    },
    setActive(i: number) {
      if (i === activeWs) return;
      activeWs = i;
      draw();
    },
    dispose() {
      texture.dispose();
    },
  };
}

export type Screen = ReturnType<typeof createScreen>;
