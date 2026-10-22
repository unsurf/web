export const SCROLL_GAUGE_CONFIG = {
  wrapperClass: "pointer-events-none fixed right-3 top-[12vh] bottom-[12vh] z-20 hidden w-2 md:block",
  trackClass:
    "absolute inset-y-0 right-0 w-px bg-white/20 [mask-image:repeating-linear-gradient(to_bottom,#000_0_6px,transparent_6px_12px)]",
  markerClass: "absolute right-0 top-0 h-px w-2 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]",
} as const;
