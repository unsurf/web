"use client";

import { useEffect } from "react";

export default function OverscrollKill() {
  useEffect(() => {
    const preventBounce = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) {
        e.preventDefault();
        return;
      }

      let el: HTMLElement | null = target;
      while (el && el !== document.body) {
        const { overflowY, overflowX } = getComputedStyle(el);
        const scrollable =
          overflowY === "auto" ||
          overflowY === "scroll" ||
          overflowX === "auto" ||
          overflowX === "scroll";

        if (scrollable && (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)) {
          return;
        }
        el = el.parentElement;
      }

      e.preventDefault();
    };

    document.addEventListener("wheel", preventBounce, { passive: false });
    document.addEventListener("touchmove", preventBounce, { passive: false });

    return () => {
      document.removeEventListener("wheel", preventBounce);
      document.removeEventListener("touchmove", preventBounce);
    };
  }, []);

  return null;
}
