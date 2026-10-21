export const SCREENSHOT_CONFIG = {
  width: 1600,
  height: 1000,
  // displayed 100% renders at this real scale
  baseScale: 1.5,
  minZoom: 0.5,
  maxZoom: 4,
  zoomStep: 0.25,
  wheelStep: 0.15,
  doubleClickZoom: 2,
  closeKey: "Escape",
  zoomInKeys: ["+", "="],
  zoomOutKey: "-",
  labels: {
    open: "Enlarge screenshot",
    close: "Close",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetZoom: "Reset zoom to 100%",
    zoomInIcon: "+",
    zoomOutIcon: "−",
    closeIcon: "✕",
  },
} as const;
