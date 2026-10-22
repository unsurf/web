"use client";

import { gsap } from "gsap";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { DEPTH_CONFIG as C } from "../../lib/depth/depth.config";
import { depthState } from "../../lib/depth/depth.store";
import { clamp01, lerp } from "../../lib/depth/depth.utils";
import { useReducedMotion } from "../../lib/use-reduced-motion";

/** Smooth scroll plus the single scroll-driven variable (depth) every visual reads, all on the GSAP ticker. */
export function ScrollDriver() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const calmRef = useRef(false);

  useEffect(() => {
    calmRef.current = pathname !== C.homePath;
    depthState.calm = calmRef.current;
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const lenis = reduced ? null : new Lenis({ lerp: C.lenisLerp });
    lenisRef.current = lenis;
    let lastDepth = -1;
    let lastHero = -1;

    const tick = (time: number) => {
      lenis?.raf(time * 1000);
      const y = lenis ? lenis.scroll : window.scrollY;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const calm = calmRef.current;
      const targetDepth = calm ? C.calmDepth : clamp01(y / max);
      const targetSubmerge = calm ? 1 : clamp01(y / (window.innerHeight * C.submergeViewports));
      const k = reduced ? 1 : C.ease;
      depthState.depth = lerp(depthState.depth, targetDepth, k);
      depthState.submerge = lerp(depthState.submerge, targetSubmerge, k);

      if (Math.abs(depthState.depth - lastDepth) > C.epsilon / 4) {
        lastDepth = depthState.depth;
        const gauge = document.querySelector<HTMLElement>(C.gaugeSelector);
        const track = gauge?.parentElement;
        if (gauge && track) gauge.style.transform = `translate3d(0, ${depthState.depth * track.clientHeight}px, 0)`;
      }

      const hero = clamp01((y / window.innerHeight - C.heroOutStart) / (C.heroOutEnd - C.heroOutStart));
      if (Math.abs(hero - lastHero) > C.epsilon) {
        lastHero = hero;
        root.style.setProperty(C.cssHeroVar, hero.toFixed(3));
      }
    };

    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return null;
}
