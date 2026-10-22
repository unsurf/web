"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../lib/use-reduced-motion";
import { WORDMARK_ART, WORDMARK_CONFIG as C } from "./wordmark.config";

const LINES = WORDMARK_ART.split("\n");
const WIDTH = Math.max(...LINES.map((l) => l.length));

/** Deterministic noise so server and client render the same first paint. */
function seeded(n: number): number {
  return ((n * C.seedMultiplier + C.seedOffset) % C.seedModulus) / C.seedModulus;
}

function frame(progress: number, random: (i: number) => number): string {
  const edge = progress * (WIDTH + C.edgeSpread);
  let i = 0;
  return LINES.map((line) =>
    Array.from(line, (ch, x) => {
      i++;
      if (ch === " ") return ch;
      if (x < edge - C.edgeSpread) return ch;
      return C.scrambleGlyphs[Math.floor(random(i) * C.scrambleGlyphs.length)];
    }).join(""),
  ).join("\n");
}

const FIRST_PAINT = frame(0, seeded);

export function Wordmark() {
  const ref = useRef<HTMLPreElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = WORDMARK_ART;
      return;
    }
    const state = { p: 0 };
    const tween = gsap.to(state, {
      p: 1,
      duration: C.durationSeconds,
      delay: C.delaySeconds,
      ease: "power2.inOut",
      onUpdate: () => {
        el.textContent = frame(state.p, () => Math.random());
      },
      onComplete: () => {
        el.textContent = WORDMARK_ART;
      },
    });
    return () => {
      tween.kill();
      el.textContent = WORDMARK_ART;
    };
  }, [reduced]);

  return (
    <div className="w-full">
      <h1 className="sr-only">{C.accessibleName}</h1>
      <pre
        ref={ref}
        aria-hidden
        suppressHydrationWarning
        className="m-0 w-full select-none overflow-hidden whitespace-pre font-mono leading-none text-white wordmark [text-shadow:0_0_28px_color-mix(in_srgb,var(--accent)_40%,transparent)]"
      >
        {FIRST_PAINT}
      </pre>
    </div>
  );
}
