"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { depthState } from "../../lib/depth/depth.store";
import { clamp01, lerp, seaColour } from "../../lib/depth/depth.utils";
import { useReducedMotion } from "../../lib/use-reduced-motion";
import { ASCII_FIELD_CONFIG as C } from "./ascii-field.config";
import type { PointerState, Ripple } from "./ascii-field.types";

const LAST = C.ramp.length - 1;

export function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pointer: PointerState = { x: C.idle, y: C.idle, targetX: C.idle, targetY: C.idle, active: false };
    const ripples: Ripple[] = [];
    const buckets: number[][] = Array.from({ length: C.alphaBuckets }, () => []);
    const chars: string[][] = Array.from({ length: C.alphaBuckets }, () => []);
    let cols = 0;
    let rows = 0;
    let cell: { w: number; h: number; font: number } = C.cell.desktop;
    let family = "monospace";
    let frame = 0;
    let started = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, C.dprCap);
      const { innerWidth: w, innerHeight: h } = window;
      cell = w < C.compactBreakpoint ? C.cell.compact : C.cell.desktop;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      cols = Math.ceil(w / cell.w);
      rows = Math.ceil(h / cell.h);
      family = getComputedStyle(canvas).fontFamily || family;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${cell.font}px ${family}`;
      ctx.textBaseline = "top";
    };

    const toCell = (x: number, y: number) => ({ col: x / cell.w, row: y / cell.h });

    const onMove = (e: PointerEvent) => {
      const { col, row } = toCell(e.clientX, e.clientY);
      pointer.targetX = col;
      pointer.targetY = row;
      if (!pointer.active) {
        pointer.x = col;
        pointer.y = row;
        pointer.active = true;
      }
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.targetX = C.idle;
      pointer.targetY = C.idle;
    };
    const onDown = (e: PointerEvent) => {
      const { col, row } = toCell(e.clientX, e.clientY);
      ripples.push({ col, row, bornAt: gsap.ticker.time });
    };
    let hovered: Element | null = null;
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element).closest(C.rippleAttr);
      if (el === hovered) return;
      hovered = el;
      if (el) {
        const { col, row } = toCell(e.clientX, e.clientY);
        ripples.push({ col, row, bornAt: gsap.ticker.time });
      }
    };

    const draw = (t: number) => {
      const { submerge, depth, calm } = depthState;
      const [r, g, b] = seaColour(depth);
      const wl = rows * (C.waterLine - submerge * C.waterLineRise);
      const waveAmp = lerp(1, C.waveCalm, clamp01(depth * 1.6)) * (calm ? C.waveCalm : 1);
      const alphaMax = lerp(C.maxAlpha.surface, C.maxAlpha.deep, clamp01(submerge)) * (calm ? C.calmAlpha : 1);
      const fade = Math.min(1, Math.max(0, (t - started) / C.fadeInSeconds));

      pointer.x += (pointer.targetX - pointer.x) * C.pointer.ease;
      pointer.y += (pointer.targetY - pointer.y) * C.pointer.ease;
      while (ripples.length && t - ripples[0].bornAt > C.ripple.life) ripples.shift();

      for (let i = 0; i < C.alphaBuckets; i++) {
        buckets[i].length = 0;
        chars[i].length = 0;
      }

      const surface = (c: number): number => {
        let s = 0;
        for (const w of C.waves) s += Math.sin(c * w.k + t * w.speed) * w.amp;
        const dx = c - pointer.x;
        const bump = C.pointer.bump * Math.exp(-(dx * dx) / (2 * C.pointer.bumpSigma * C.pointer.bumpSigma));
        return wl + s * waveAmp - (pointer.active ? bump : 0);
      };

      let prev = surface(0);
      for (let c = 0; c < cols; c++) {
        const s = prev;
        const next = surface(c + 1);
        prev = next;
        const slope = Math.abs(next - s);
        const startRow = Math.max(0, Math.floor(s));
        for (let row = startRow; row < rows; row++) {
          const d = row - s;
          let v: number;
          let ch: string;
          if (d < 1) {
            v = 1;
            ch = slope > C.surfaceSlope ? C.surfaceGlyphs.steep : next < s ? C.surfaceGlyphs.crest : C.surfaceGlyphs.flat;
          } else {
            const tex =
              0.55 +
              0.45 *
                Math.sin(c * C.texture.kc + row * C.texture.kr + t * C.texture.ks) *
                Math.sin(c * C.texture.kc2 - row * C.texture.kr2 - t * C.texture.ks2);
            const current = 1 - C.currentDepth + C.currentDepth * Math.sin(row * C.currentK.r - t * C.currentK.s + c * C.currentK.c);
            v = (C.floorLevel + (1 - C.floorLevel) * Math.exp(-d / C.falloffRows)) * (0.5 + tex * 0.5) * current;
            const dxp = c - pointer.x;
            const dyp = (row - pointer.y) * C.aspect;
            const lift = Math.max(0, 1 - Math.hypot(dxp, dyp) / C.pointer.radius);
            v += lift * lift * C.pointer.torch;
            for (const rp of ripples) {
              const age = t - rp.bornAt;
              const edge = Math.abs(Math.hypot(c - rp.col, (row - rp.row) * C.aspect) - age * C.ripple.speed);
              if (edge < C.ripple.width) {
                v += (1 - edge / C.ripple.width) * (1 - age / C.ripple.life) * C.ripple.strength;
              }
            }
            v = Math.min(1, Math.max(0, v));
            if (v < C.minLevel) continue;
            ch = C.ramp[Math.min(LAST, Math.floor(v * LAST + 0.5))];
            if (ch === " ") continue;
          }
          const bi = Math.min(C.alphaBuckets - 1, Math.floor(v * C.alphaBuckets));
          buckets[bi].push(c * cell.w, row * cell.h);
          chars[bi].push(ch);
        }
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 0; i < C.alphaBuckets; i++) {
        if (!buckets[i].length) continue;
        const a = ((i + 1) / C.alphaBuckets) * alphaMax * fade;
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
        const pos = buckets[i];
        const cs = chars[i];
        for (let j = 0; j < cs.length; j++) ctx.fillText(cs[j], pos[j * 2], pos[j * 2 + 1]);
      }
    };

    const compact = window.innerWidth < C.compactBreakpoint;
    const tick = () => {
      if (compact && ++frame % C.compactFrameSkip) return;
      draw(gsap.ticker.time);
    };

    resize();
    started = gsap.ticker.time;
    window.addEventListener("resize", resize);
    if (reduced) {
      started = -C.fadeInSeconds;
      draw(C.staticTime);
      const redraw = () => {
        resize();
        draw(C.staticTime);
      };
      window.addEventListener("resize", redraw);
      document.fonts?.ready.then(redraw);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("resize", redraw);
      };
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 font-mono" />;
}
