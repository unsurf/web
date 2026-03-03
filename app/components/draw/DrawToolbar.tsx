"use client";

import type { Mode } from "@/app/draw/draw.utils";

interface DrawToolbarProps {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  brushSize: number;
  onBrushSizeChange: (v: number) => void;
  drawColor: string;
  onDrawColorChange: (v: string) => void;
}

export default function DrawToolbar({
  mode,
  onModeChange,
  brushSize,
  onBrushSizeChange,
  drawColor,
  onDrawColorChange,
}: DrawToolbarProps) {
  return (
    <div className="flex items-center justify-center gap-3 border-t border-white/10 px-4 py-2.5 text-xs shrink-0">
      <div className="flex items-center gap-1">
        {(["pan", "brush", "eraser"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`rounded px-3 py-1.5 capitalize transition-colors ${
              mode === m
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/15"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-white/10" />

      <label className="flex items-center gap-2">
        <span className="text-white/40">Size</span>
        <input
          type="range"
          min={1}
          max={10}
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-24 accent-white"
        />
        <span className="w-4 text-center font-mono text-white/50">
          {brushSize}
        </span>
      </label>

      <div className="h-6 w-px bg-white/10" />

      <label className="flex items-center gap-2">
        <span className="text-white/40">Color</span>
        <input
          type="color"
          value={drawColor}
          onChange={(e) => onDrawColorChange(e.target.value)}
          className="h-6 w-6 cursor-pointer rounded border border-white/20 bg-transparent"
        />
      </label>
    </div>
  );
}
