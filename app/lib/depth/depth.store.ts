import type { DepthState } from "./depth.types";

/** Mutable singleton read by the canvas on the shared GSAP ticker. Never React state: it changes every frame. */
export const depthState: DepthState = { depth: 0, submerge: 0, calm: false };
