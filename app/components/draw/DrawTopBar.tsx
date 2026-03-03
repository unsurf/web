"use client";

import { MIN_ZOOM, MAX_ZOOM } from "@/app/draw/draw.utils";

interface DrawTopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  onResetView: () => void;
  onFitToView: () => void;
  canvasW: number;
  canvasH: number;
  onToggleExport: () => void;
}

export default function DrawTopBar({
  sidebarOpen,
  onToggleSidebar,
  zoom,
  onZoomChange,
  onResetView,
  onFitToView,
  canvasW,
  canvasH,
  onToggleExport,
}: DrawTopBarProps) {
  const zoomPct = Math.round(zoom * 100);

  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2 text-xs shrink-0">
      <button
        onClick={onToggleSidebar}
        className="rounded p-1 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {sidebarOpen ? (
            <path d="M10 3L5 8L10 13" />
          ) : (
            <path d="M3 4h10M3 8h10M3 12h10" />
          )}
        </svg>
      </button>

      <span className="font-mono text-white/50 tracking-wider">
        unsurf/draw
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onZoomChange(Math.max(MIN_ZOOM, zoom / 1.25))}
          className="rounded bg-white/10 px-1.5 py-0.5 hover:bg-white/15 transition-colors font-mono"
        >
          −
        </button>
        <button
          onClick={onResetView}
          className="rounded bg-white/10 px-2 py-0.5 hover:bg-white/15 transition-colors font-mono min-w-14 text-center"
        >
          {zoomPct}%
        </button>
        <button
          onClick={() => onZoomChange(Math.min(MAX_ZOOM, zoom * 1.25))}
          className="rounded bg-white/10 px-1.5 py-0.5 hover:bg-white/15 transition-colors font-mono"
        >
          +
        </button>
        <button
          onClick={onFitToView}
          className="rounded bg-white/10 px-2 py-0.5 hover:bg-white/15 transition-colors ml-1"
        >
          Fit
        </button>
      </div>

      <div className="h-4 w-px bg-white/10" />

      <span className="text-white/30 font-mono">
        {canvasW}&times;{canvasH}
      </span>

      <div className="h-4 w-px bg-white/10" />

      <button
        onClick={onToggleExport}
        className="rounded bg-white px-3 py-1 font-medium text-black hover:opacity-80 transition-opacity"
      >
        Export
      </button>
    </div>
  );
}
