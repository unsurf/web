import { DEPTH_CONFIG as C } from "./depth.config";
import type { Rgb } from "./depth.types";

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export function seaColour(depth: number): Rgb {
  const t = clamp01(depth);
  return [lerp(C.foam[0], C.deep[0], t), lerp(C.foam[1], C.deep[1], t), lerp(C.foam[2], C.deep[2], t)];
}
