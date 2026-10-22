"use client";

import { gsap } from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../lib/use-reduced-motion";
import { PAGE_TRANSITION_CONFIG as C } from "./page-transition.config";

type Mode = "idle" | "push" | "pop";

/** The tide: water rises over the page, the router swaps, the water drains. */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const mode = useRef<Mode>("idle");
  const first = useRef(true);

  useEffect(() => {
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    const crest = crestRef.current;
    if (!wrap || !panel || !crest) return;
    gsap.set(panel, { yPercent: 100 });
    const drift = gsap.to(crest, { xPercent: -50, duration: C.crestDriftSeconds, ease: "none", repeat: -1 });
    return () => {
      drift.kill();
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      if (mode.current !== "idle") return;
      mode.current = "push";
      const wrap = wrapRef.current;
      const panel = panelRef.current;
      if (!wrap || !panel) return;
      const href = url.pathname + url.search + url.hash;
      router.prefetch(href);
      wrap.style.visibility = "visible";
      wrap.style.pointerEvents = "auto";
      gsap.to(panel, {
        yPercent: 0,
        duration: C.riseSeconds,
        ease: C.ease,
        onComplete: () => router.push(href),
      });
    };
    const onPop = () => {
      mode.current = "pop";
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [router, reduced]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    const wasPush = mode.current === "push";
    mode.current = "idle";
    window.scrollTo(0, 0);
    if (!wrap || !panel || !wasPush) return;
    gsap.to(panel, {
      yPercent: 100,
      duration: C.drainSeconds,
      ease: C.ease,
      delay: 0.08,
      onComplete: () => {
        wrap.style.visibility = "hidden";
        wrap.style.pointerEvents = "none";
      },
    });
  }, [pathname]);

  const row = (i: number) => C.crestRows[i % C.crestRows.length].repeat(C.crestRepeat);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[90] overflow-hidden">
      <div ref={panelRef} className="absolute inset-0" style={{ background: C.bodyColour }}>
        <div
          ref={crestRef}
          className="absolute left-0 w-[400%] font-mono text-[13px] leading-[1.1] text-[#9ff5d4]"
          style={{ top: `-${C.crestHeightRem}rem` }}
        >
          {Array.from({ length: C.rowCount }, (_, i) => (
            <div key={i} className="whitespace-pre" style={{ opacity: Math.max(C.minRowOpacity, 1 - i * C.rowFade) }}>
              {row(i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
