/**
 * Synthesised sound, so there are no audio files to download. Everything stays
 * silent until the visitor opts in on the lock screen.
 */
let ctx: AudioContext | null = null;
let enabled = false;
let hum: { gain: GainNode; stop: () => void } | null = null;

const KEY = "sound";

export function soundPreference() {
  try {
    return sessionStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

function ensure() {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isSoundOn() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    sessionStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* storage unavailable; preference just won't persist */
  }
  if (on) {
    ensure();
    startHum();
  } else {
    stopHum();
  }
  window.dispatchEvent(new CustomEvent("sound-change", { detail: on }));
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Mechanical key click: a short filtered noise burst plus a low thock. */
export function keyClick(pitch = 1) {
  if (!enabled) return;
  const c = ensure();
  if (!c) return;
  const t = c.currentTime;

  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 0.05);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2400 * pitch;
  bp.Q.value = 1.2;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t);

  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(150 * pitch, t);
  o.frequency.exponentialRampToValueAtTime(70 * pitch, t + 0.05);
  const og = c.createGain();
  og.gain.setValueAtTime(0.12, t);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  o.connect(og).connect(c.destination);
  o.start(t);
  o.stop(t + 0.07);
}

/** Two-note unlock chime. */
export function chime() {
  if (!enabled) return;
  const c = ensure();
  if (!c) return;
  [659.25, 987.77].forEach((f, i) => {
    const t = c.currentTime + i * 0.09;
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.75);
  });
}

/** Rising filtered-noise sweep used when diving into the screen. */
export function whoosh() {
  if (!enabled) return;
  const c = ensure();
  if (!c) return;
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 1.2);
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(300, t);
  f.frequency.exponentialRampToValueAtTime(5200, t + 0.9);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t);
}

function startHum() {
  const c = ensure();
  if (!c || hum) return;
  const gain = c.createGain();
  gain.gain.value = 0.0001;
  gain.gain.exponentialRampToValueAtTime(0.035, c.currentTime + 2);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 220;
  const a = c.createOscillator();
  const b = c.createOscillator();
  a.type = "sawtooth";
  b.type = "sawtooth";
  a.frequency.value = 55;
  b.frequency.value = 55.7;
  a.connect(lp);
  b.connect(lp);
  lp.connect(gain).connect(c.destination);
  a.start();
  b.start();
  hum = {
    gain,
    stop: () => {
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
      window.setTimeout(() => {
        a.stop();
        b.stop();
      }, 500);
    },
  };
}

function stopHum() {
  hum?.stop();
  hum = null;
}
