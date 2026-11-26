# phemelo.work

Personal portfolio of Phemelo Moloi. You log in to a lock screen, land at a real-time 3D desk at night, and scroll to dive into the monitor. Inside you travel past each project as a 3D phone or laptop, watch a git graph of the career grow, and press the skill keycaps.

All copy is real DOM text laid over the canvas, so it is accessible and indexable, and it is exactly what renders when WebGL is unavailable.

## Stack

React 19, TypeScript, Vite, react-three-fiber + drei + postprocessing (three.js), Lenis, Tailwind base. Fonts (Martian Mono, Atkinson Hyperlegible Next) are self-hosted. Hosted on Firebase Hosting.

## How it works

- `src/content/` holds all copy (`profile`, `experience`, `projects`, `skills`). `github.json` is generated at build time.
- `src/sections/Acts.tsx` is the DOM text, one section per act: `home`, `dive`, `work`, `log`, `stack`, `mail`.
- `src/world/` is the 3D world. `progress.ts` turns scroll into act and position, `CameraRig.tsx` flies the camera, `room/` is the desk, `inside/` is the corridor, git graph and keycaps, `fx/` is the CRT lens, bloom and grain.
- Regions are built one act ahead of the visitor, and the 3D chunk loads behind the lock screen.
- Quality tiers (`high`, `mid`, `low`) are chosen from the device and stepped down at runtime if frames drop. Force one with `?tier=low`.
- Sound is synthesised in `src/audio/sfx.ts` (no audio files) and off unless chosen on the lock screen.

## Develop

```bash
npm install --legacy-peer-deps   # lenis declares an optional Nuxt peer that conflicts with Tailwind's jiti
npm run dev                      # http://localhost:8080
npm run build                    # type-check, fetch GitHub stats, bundle to dist/
npm run preview
```

## Project screenshots

Screens shown on the 3D phones and laptops live in `public/shots/<shot>.webp`. Set `shot` on a project in `src/content/projects.ts` once the file exists; without it the device shows a generated app mock-up. `node scripts/capture-screens.mjs` captures the live sites with a local Chromium.

## Contact form

Copy `.env.example` to `.env` and fill in the EmailJS keys. They are public by design, so also restrict allowed origins to `phemelo.work` and set a rate limit in the EmailJS dashboard. The form has validation, a honeypot field, a minimum fill time and a client cooldown.

## Deploy

```bash
npm run build
firebase deploy --only hosting
```

Security headers (CSP, nosniff, frame denial, referrer and permissions policy, caching) are defined in [firebase.json](firebase.json). The CSP allows no external scripts, fonts or images, so the 3D world uses only canvas-drawn and same-origin textures.

## Keyboard

`` ` `` toggles the terminal, `1`–`6` or `Alt+1`–`6` jump between acts, `Esc` closes the terminal.
