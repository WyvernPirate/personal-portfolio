import { Effect, EffectAttribute } from "postprocessing";
import { Uniform } from "three";

const fragment = /* glsl */ `
  uniform float uDistort;
  uniform float uAberr;
  uniform float uScan;
  uniform float uFlash;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Barrel distortion: sample pulled in toward the centre, corners fall off to black.
    vec2 c = uv * 2.0 - 1.0;
    float r2 = dot(c, c);
    vec2 d = c * (1.0 + uDistort * r2);
    vec2 suv = d * 0.5 + 0.5;
    float inside = step(0.0, suv.x) * step(suv.x, 1.0) * step(0.0, suv.y) * step(suv.y, 1.0);

    // Chromatic aberration grows toward the edges of the lens.
    vec2 dir = normalize(c + 1e-4) * uAberr * (0.35 + r2);
    float r = texture2D(inputBuffer, suv + dir).r;
    float g = texture2D(inputBuffer, suv).g;
    float b = texture2D(inputBuffer, suv - dir).b;
    vec3 col = vec3(r, g, b);

    // Scanlines
    float line = sin(suv.y * resolution.y * 1.6) * 0.5 + 0.5;
    col *= 1.0 - uScan * (1.0 - line) * 0.4;

    // Cut flash between regions
    col += uFlash * vec3(0.55, 0.72, 1.0);

    outputColor = vec4(col * inside, inputColor.a);
  }
`;

/** CRT lens: barrel distortion, chromatic aberration, scanlines and a cut flash in one pass. */
export class CrtEffect extends Effect {
  constructor() {
    super("CrtEffect", fragment, {
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, Uniform>([
        ["uDistort", new Uniform(0)],
        ["uAberr", new Uniform(0)],
        ["uScan", new Uniform(0)],
        ["uFlash", new Uniform(0)],
      ]),
    });
  }

  set(distort: number, aberr: number, scan: number, flash: number) {
    this.uniforms.get("uDistort")!.value = distort;
    this.uniforms.get("uAberr")!.value = aberr;
    this.uniforms.get("uScan")!.value = scan;
    this.uniforms.get("uFlash")!.value = flash;
  }
}
