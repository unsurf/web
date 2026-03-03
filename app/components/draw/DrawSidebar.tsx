"use client";

import { PRESETS, type AsciiSetKey, type BgOption } from "@/app/draw/draw.utils";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-widest text-white/30">
        {title}
      </span>
      {children}
    </div>
  );
}

interface DrawSidebarProps {
  open: boolean;
  density: number;
  onDensityChange: (v: number) => void;
  smoothing: number;
  onSmoothingChange: (v: number) => void;
  charSet: AsciiSetKey;
  onCharSetChange: (v: AsciiSetKey) => void;
  canvasW: number;
  canvasH: number;
  inputW: string;
  inputH: string;
  onInputWChange: (v: string) => void;
  onInputHChange: (v: string) => void;
  onApplySize: (w: number, h: number) => void;
  onCommitSize: () => void;
  bgOption: BgOption;
  onBgOptionChange: (v: BgOption) => void;
  bgColor: string;
  onBgColorChange: (v: string) => void;
  onClear: () => void;
}

export default function DrawSidebar({
  open,
  density,
  onDensityChange,
  smoothing,
  onSmoothingChange,
  charSet,
  onCharSetChange,
  canvasW,
  canvasH,
  inputW,
  inputH,
  onInputWChange,
  onInputHChange,
  onApplySize,
  onCommitSize,
  bgOption,
  onBgOptionChange,
  bgColor,
  onBgColorChange,
  onClear,
}: DrawSidebarProps) {
  return (
    <div
      className={`shrink-0 border-r border-white/10 flex flex-col transition-all duration-200 overflow-hidden ${
        open ? "w-56" : "w-0 border-r-0"
      }`}
    >
      <div className="flex flex-col gap-5 p-4 pt-5 overflow-y-auto flex-1 min-w-56">
        <Section title="Brush Settings">
          <label className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Density</span>
              <span className="text-xs font-mono text-white/40">
                {Math.round(density * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={density * 100}
              onChange={(e) => onDensityChange(Number(e.target.value) / 100)}
              className="w-full accent-white"
            />
          </label>
          <label className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Smoothing</span>
              <span className="text-xs font-mono text-white/40">
                {Math.round(smoothing * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={smoothing * 100}
              onChange={(e) => onSmoothingChange(Number(e.target.value) / 100)}
              className="w-full accent-white"
            />
          </label>
        </Section>

        <Section title="Characters">
          <select
            value={charSet}
            onChange={(e) => onCharSetChange(e.target.value as AsciiSetKey)}
            className="w-full rounded bg-white/10 px-2 py-1.5 text-xs text-white outline-none"
          >
            <option value="full">Full</option>
            <option value="symbols">Symbols</option>
            <option value="blocks">Blocks</option>
            <option value="dots">Dots</option>
            <option value="minimal">Minimal</option>
          </select>
        </Section>

        <Section title="Canvas Size">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => onApplySize(p.w, p.h)}
                className={`rounded px-2 py-1 text-xs transition-colors ${
                  canvasW === p.w && canvasH === p.h
                    ? "bg-white/20 text-white"
                    : "bg-white/8 text-white/50 hover:bg-white/12"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <input
              type="text"
              inputMode="numeric"
              value={inputW}
              onChange={(e) => onInputWChange(e.target.value)}
              onBlur={onCommitSize}
              onKeyDown={(e) => e.key === "Enter" && onCommitSize()}
              className="w-full rounded bg-white/8 px-2 py-1.5 text-center text-xs font-mono text-white outline-none focus:bg-white/12 focus:ring-1 focus:ring-white/20"
            />
            <span className="text-white/30 text-xs shrink-0">&times;</span>
            <input
              type="text"
              inputMode="numeric"
              value={inputH}
              onChange={(e) => onInputHChange(e.target.value)}
              onBlur={onCommitSize}
              onKeyDown={(e) => e.key === "Enter" && onCommitSize()}
              className="w-full rounded bg-white/8 px-2 py-1.5 text-center text-xs font-mono text-white outline-none focus:bg-white/12 focus:ring-1 focus:ring-white/20"
            />
          </div>
        </Section>

        <Section title="Background">
          <div className="flex gap-1.5">
            {(["black", "custom", "transparent"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => onBgOptionChange(opt)}
                className={`flex-1 rounded px-1 py-1.5 text-xs capitalize transition-colors ${
                  bgOption === opt
                    ? "bg-white text-black"
                    : "bg-white/10 hover:bg-white/15"
                }`}
              >
                {opt === "transparent" ? "None" : opt}
              </button>
            ))}
          </div>
          {bgOption === "custom" && (
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="mt-1 h-8 w-full cursor-pointer rounded border border-white/20 bg-transparent"
            />
          )}
        </Section>

        <button
          onClick={onClear}
          className="rounded bg-white/10 px-3 py-2 text-xs hover:bg-white/15 transition-colors text-white/60 hover:text-white"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
