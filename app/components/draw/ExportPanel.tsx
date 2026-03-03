"use client";

import {
  type ExportFormat,
  type ExportScale,
  getScaleMultiplier,
} from "@/app/draw/draw.utils";

interface ExportPanelProps {
  canvasW: number;
  canvasH: number;
  exportFormat: ExportFormat;
  onFormatChange: (f: ExportFormat) => void;
  exportSize: ExportScale;
  onSizeChange: (s: ExportScale) => void;
  onExport: () => void;
}

export default function ExportPanel({
  canvasW,
  canvasH,
  exportFormat,
  onFormatChange,
  exportSize,
  onSizeChange,
  onExport,
}: ExportPanelProps) {
  const scale = getScaleMultiplier(exportSize);

  return (
    <div className="absolute right-4 top-4 flex w-60 flex-col gap-4 rounded-xl border border-white/10 bg-neutral-900 p-4 shadow-2xl z-20">
      <h3 className="text-sm font-medium">Export</h3>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-white/50">Format</span>
        <div className="flex gap-1.5">
          {(["png", "webp", "svg"] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => onFormatChange(f)}
              className={`flex-1 rounded px-2 py-1.5 text-xs font-mono uppercase transition-colors ${
                exportFormat === f
                  ? "bg-white text-black"
                  : "bg-white/10 hover:bg-white/15"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-white/50">Scale</span>
        <div className="flex gap-1.5">
          {(["1x", "2x", "3x"] as ExportScale[]).map((s) => (
            <button
              key={s}
              onClick={() => onSizeChange(s)}
              className={`flex-1 rounded px-2 py-1.5 text-xs font-mono transition-colors ${
                exportSize === s
                  ? "bg-white text-black"
                  : "bg-white/10 hover:bg-white/15"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </label>

      <div className="text-[10px] font-mono text-white/30 text-center">
        {canvasW * scale}&times;{canvasH * scale} px
      </div>

      <button
        onClick={onExport}
        className="rounded-lg bg-white py-2 text-sm font-medium text-black hover:opacity-80 transition-opacity"
      >
        Download .{exportFormat}
      </button>
    </div>
  );
}
