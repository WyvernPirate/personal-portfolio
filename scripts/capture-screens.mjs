// One-off dev script: screenshots the live project sites for the device mockups.
// Usage: node scripts/capture-screens.mjs   (needs a local Chromium at CHROMIUM_PATH or /usr/bin/chromium)
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const targets = [
  // arrowgate and medisync are not captured here: their public URLs are admin login screens,
  // which misrepresent the customer-facing apps. Drop real app screens into public/shots instead.
  { shot: "growth-beyond-books", url: "https://growthbeyondbooks.org", device: "laptop", settle: 6000 },
  { shot: "pioneer-ventures", url: "https://pioneer-ventures-society.org/", device: "laptop" },
  { shot: "training-portal", url: "https://employee-training-portal-6a36e.web.app/", device: "laptop" },
];
const sizes = { phone: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, laptop: { width: 1280, height: 800, deviceScaleFactor: 1 } };

mkdirSync("public/shots", { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });

for (const t of targets) {
  const page = await browser.newPage();
  try {
    await page.setViewport(sizes[t.device]);
    await page.goto(t.url, { waitUntil: "networkidle2", timeout: 45000 });
    await new Promise((r) => setTimeout(r, t.settle ?? 1500));
    const png = await page.screenshot({ type: "png" });
    const w = t.device === "phone" ? 390 : 1280;
    await sharp(png).resize({ width: w }).avif({ quality: 50 }).toFile(`public/shots/${t.shot}.avif`);
    await sharp(png).resize({ width: w }).webp({ quality: 72 }).toFile(`public/shots/${t.shot}.webp`);
    console.log("captured", t.shot);
  } catch (e) {
    console.warn("skipped", t.shot, e.message);
  } finally {
    await page.close();
  }
}
await browser.close();
