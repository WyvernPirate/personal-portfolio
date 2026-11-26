import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { buildShapes } from "./shapes";
import { workspaceFloat } from "../scroll";

const SHAPES = 6;

const vertex = /* glsl */ `
  attribute vec3 aT0; attribute vec3 aT1; attribute vec3 aT2;
  attribute vec3 aT3; attribute vec3 aT4; attribute vec3 aT5;
  attribute float aRnd;
  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  varying float vRnd;
  varying float vEdge;

  float w(float k, float m) { return max(0.0, 1.0 - abs(m - k)); }

  void main() {
    // Ease inside each step so shapes settle instead of sliding linearly.
    float i = floor(uMorph);
    float m = i + smoothstep(0.0, 1.0, uMorph - i);
    vec3 p = aT0 * w(0.0, m) + aT1 * w(1.0, m) + aT2 * w(2.0, m)
           + aT3 * w(3.0, m) + aT4 * w(4.0, m) + aT5 * w(5.0, m);

    // Particles scatter slightly while travelling between shapes.
    float travel = 1.0 - abs(2.0 * fract(uMorph) - 1.0);
    p += (vec3(sin(aRnd * 40.0 + uTime), cos(aRnd * 23.0 + uTime * 0.8), sin(aRnd * 31.0)) * 0.05)
       + (vec3(aRnd - 0.5, fract(aRnd * 7.0) - 0.5, fract(aRnd * 13.0) - 0.5) * travel * 0.9);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aRnd * 0.9) * (3.2 / -mv.z);
    vRnd = aRnd;
    vEdge = travel;
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  varying float vRnd;
  varying float vEdge;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    vec3 sky = vec3(0.459, 0.667, 0.859);
    vec3 sand = vec3(0.89, 0.659, 0.412);
    vec3 col = mix(sky, sand, smoothstep(0.35, 0.85, vRnd));
    float a = smoothstep(0.5, 0.1, d) * (0.42 - vEdge * 0.16);
    gl_FragColor = vec4(col, a);
  }
`;

export type WallpaperHandle = { dispose: () => void };

export function startWallpaper(canvas: HTMLCanvasElement, onLost: () => void): WallpaperHandle | null {
  const compact = window.innerWidth < 768;
  const count = compact ? 2500 : 6000;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
  } catch {
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 20);
  camera.position.z = 3.2;

  const shapes = buildShapes(count);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(shapes[0], 3));
  shapes.forEach((s, i) => geometry.setAttribute(`aT${i}`, new BufferAttribute(s, 3)));
  const rnd = new Float32Array(count);
  for (let i = 0; i < count; i++) rnd[i] = Math.random();
  geometry.setAttribute("aRnd", new BufferAttribute(rnd, 1));

  const uniforms = { uMorph: { value: 0 }, uTime: { value: 0 }, uSize: { value: 26 } };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
  });
  const points = new Points(geometry, material);
  scene.add(points);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the whole shape in frame on narrow screens.
    camera.position.z = compact ? 4.4 : 3.2;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  let px = 0;
  let py = 0;
  const onPointer = (e: PointerEvent) => {
    px = (e.clientX / window.innerWidth - 0.5) * 2;
    py = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  if (window.matchMedia("(pointer: fine)").matches) window.addEventListener("pointermove", onPointer, { passive: true });

  let raf = 0;
  let morph = 0;
  const clock = performance.now();
  let last = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // The wallpaper is ambient; 30fps is plenty and halves the GPU and battery cost.
    if (now - last < 33) return;
    last = now;
    const target = Math.min(SHAPES - 1, workspaceFloat());
    morph += (target - morph) * 0.08;
    uniforms.uMorph.value = morph;
    uniforms.uTime.value = (now - clock) / 1000;
    points.rotation.y += (px * 0.25 - points.rotation.y) * 0.04;
    points.rotation.x += (py * 0.15 - points.rotation.x) * 0.04;
    renderer.render(scene, camera);
  };

  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(frame);

  const lost = (e: Event) => {
    e.preventDefault();
    onLost();
  };
  canvas.addEventListener("webglcontextlost", lost);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", lost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
