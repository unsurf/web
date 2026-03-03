"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import {
  ASCII_SETS,
  CELL,
  ZOOM_STEP,
  MIN_ZOOM,
  MAX_ZOOM,
  type AsciiSetKey,
  type ExportFormat,
  type ExportScale,
  type Mode,
  type BgOption,
  type Cell,
  makeGrid,
  randomChar,
  getCols,
  getRows,
  resizeGrid,
  getBgColor,
  getScaleMultiplier,
  renderGridToCtx,
  exportToBitmap,
  exportToSVG,
} from "./draw.utils";

import DrawSidebar from "@/app/components/draw/DrawSidebar";
import DrawTopBar from "@/app/components/draw/DrawTopBar";
import DrawToolbar from "@/app/components/draw/DrawToolbar";
import ExportPanel from "@/app/components/draw/ExportPanel";

export default function DrawPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<Cell[][]>(makeGrid(getCols(960), getRows(640)));
  const rafRef = useRef(0);
  const isDrawing = useRef(false);
  const lastPaintPos = useRef<{ x: number; y: number } | null>(null);
  const smoothedPos = useRef<{ x: number; y: number } | null>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const [canvasW, setCanvasW] = useState(960);
  const [canvasH, setCanvasH] = useState(640);
  const [inputW, setInputW] = useState("960");
  const [inputH, setInputH] = useState("640");
  const [mode, setMode] = useState<Mode>("brush");
  const [brushSize, setBrushSize] = useState(3);
  const [charSet, setCharSet] = useState<AsciiSetKey>("full");
  const [density, setDensity] = useState(0.7);
  const [smoothing, setSmoothing] = useState(0.5);
  const [drawColor, setDrawColor] = useState("#ffffff");
  const [bgOption, setBgOption] = useState<BgOption>("black");
  const [bgColor, setBgColor] = useState("#000000");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [showExport, setShowExport] = useState(false);
  const [exportSize, setExportSize] = useState<ExportScale>("2x");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const cols = getCols(canvasW);
  const rows = getRows(canvasH);

  const applySize = useCallback((w: number, h: number) => {
    const result = resizeGrid(gridRef.current, w, h);
    gridRef.current = result.grid;
    setCanvasW(result.w);
    setCanvasH(result.h);
    setInputW(String(result.w));
    setInputH(String(result.h));
  }, []);

  const commitCustomSize = useCallback(() => {
    const w = parseInt(inputW, 10);
    const h = parseInt(inputH, 10);
    if (!isNaN(w) && !isNaN(h)) applySize(w, h);
  }, [inputW, inputH, applySize]);

  const bg = getBgColor(bgOption, bgColor);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const pxW = canvasW * dpr;
    const pxH = canvasH * dpr;
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderGridToCtx(
      ctx,
      gridRef.current,
      canvasW,
      canvasH,
      drawColor,
      bg,
      `${CELL}px var(--font-geist-mono), ui-monospace, monospace`
    );
  }, [drawColor, bg, canvasW, canvasH]);

  useEffect(() => {
    const loop = () => {
      renderCanvas();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [renderCanvas]);

  const paint = useCallback(
    (cx: number, cy: number) => {
      const grid = gridRef.current;
      const chars = ASCII_SETS[charSet];
      const radius = brushSize;
      const curCols = grid[0]?.length ?? 0;
      const curRows = grid.length;
      const minC = Math.max(0, Math.floor((cx - radius * CELL) / CELL));
      const maxC = Math.min(curCols - 1, Math.ceil((cx + radius * CELL) / CELL));
      const minR = Math.max(0, Math.floor((cy - radius * CELL) / CELL));
      const maxR = Math.min(curRows - 1, Math.ceil((cy + radius * CELL) / CELL));
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          const dx = c * CELL + CELL / 2 - cx;
          const dy = r * CELL + CELL / 2 - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) / CELL;
          if (dist > radius) continue;
          if (mode === "eraser") {
            grid[r][c] = { char: " ", alpha: 0 };
          } else {
            const falloff = 1 - dist / radius;
            if (Math.random() < density * falloff) {
              grid[r][c] = {
                char: randomChar(chars),
                alpha: Math.min(1, (grid[r][c].alpha || 0) + falloff * 0.5),
              };
            }
          }
        }
      }
    },
    [mode, brushSize, charSet, density]
  );

  const paintLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number) => {
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(len / (CELL * 0.35)));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        paint(x0 + dx * t, y0 + dy * t);
      }
    },
    [paint]
  );

  const getCanvasPos = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvasW,
      y: ((e.clientY - rect.top) / rect.height) * canvasH,
    };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (mode === "pan") {
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, panX, panY };
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
      return;
    }
    if (e.button !== 0) return;
    isDrawing.current = true;
    const pos = getCanvasPos(e);
    smoothedPos.current = pos;
    lastPaintPos.current = pos;
    paint(pos.x, pos.y);
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isPanning.current) {
      setPanX(panStart.current.panX + (e.clientX - panStart.current.x));
      setPanY(panStart.current.panY + (e.clientY - panStart.current.y));
      return;
    }
    if (!isDrawing.current) return;
    const raw = getCanvasPos(e);
    const prev = smoothedPos.current ?? raw;
    const alpha = 1 - smoothing * 0.85;
    const sx = prev.x + (raw.x - prev.x) * alpha;
    const sy = prev.y + (raw.y - prev.y) * alpha;
    smoothedPos.current = { x: sx, y: sy };
    if (lastPaintPos.current) {
      paintLine(lastPaintPos.current.x, lastPaintPos.current.y, sx, sy);
    }
    lastPaintPos.current = { x: sx, y: sy };
  };

  const onPointerUp = () => {
    isDrawing.current = false;
    isPanning.current = false;
    lastPaintPos.current = null;
    smoothedPos.current = null;
  };

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = viewportRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const oldZoom = zoom;
    const delta = -e.deltaY * ZOOM_STEP;
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldZoom + delta * oldZoom));
    const wx = (mx - panX) / oldZoom;
    const wy = (my - panY) / oldZoom;
    setPanX(mx - wx * newZoom);
    setPanY(my - wy * newZoom);
    setZoom(newZoom);
  };

  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const fitToView = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const pad = 48;
    const scaleX = (rect.width - pad * 2) / canvasW;
    const scaleY = (rect.height - pad * 2) / canvasH;
    const newZoom = Math.min(1, Math.min(scaleX, scaleY));
    setZoom(newZoom);
    setPanX((rect.width - canvasW * newZoom) / 2);
    setPanY((rect.height - canvasH * newZoom) / 2);
  }, [canvasW, canvasH]);

  const clearCanvas = () => {
    gridRef.current = makeGrid(cols, rows);
  };

  const handleExport = useCallback(() => {
    const scale = getScaleMultiplier(exportSize);
    if (exportFormat === "svg") {
      exportToSVG(gridRef.current, canvasW, canvasH, drawColor, bg, scale);
    } else {
      exportToBitmap(gridRef.current, canvasW, canvasH, drawColor, bg, scale, exportFormat);
    }
  }, [exportFormat, exportSize, drawColor, bg, canvasW, canvasH]);

  const cursorStyle =
    mode === "pan"
      ? "grab"
      : mode === "eraser"
        ? "cell"
        : "crosshair";

  return (
    <div className="flex h-dvh w-full bg-neutral-950 text-white font-sans select-none overflow-hidden">
      <DrawSidebar
        open={sidebarOpen}
        density={density}
        onDensityChange={setDensity}
        smoothing={smoothing}
        onSmoothingChange={setSmoothing}
        charSet={charSet}
        onCharSetChange={setCharSet}
        canvasW={canvasW}
        canvasH={canvasH}
        inputW={inputW}
        inputH={inputH}
        onInputWChange={setInputW}
        onInputHChange={setInputH}
        onApplySize={applySize}
        onCommitSize={commitCustomSize}
        bgOption={bgOption}
        onBgOptionChange={setBgOption}
        bgColor={bgColor}
        onBgColorChange={setBgColor}
        onClear={clearCanvas}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <DrawTopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          zoom={zoom}
          onZoomChange={setZoom}
          onResetView={resetView}
          onFitToView={fitToView}
          canvasW={canvasW}
          canvasH={canvasH}
          onToggleExport={() => setShowExport(!showExport)}
        />

        <div
          ref={viewportRef}
          className="relative flex-1 overflow-hidden bg-neutral-900/50"
          onWheel={onWheel}
        >
          <div
            className="absolute origin-top-left"
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
              willChange: "transform",
            }}
          >
            {bgOption === "transparent" && (
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(#1a1a1a 0% 25%, #222 0% 50%)",
                  backgroundSize: "16px 16px",
                }}
              />
            )}
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              className="relative rounded-sm shadow-2xl"
              style={{
                width: canvasW,
                height: canvasH,
                cursor: cursorStyle,
                touchAction: "none",
              }}
            />
          </div>

          {showExport && (
            <ExportPanel
              canvasW={canvasW}
              canvasH={canvasH}
              exportFormat={exportFormat}
              onFormatChange={setExportFormat}
              exportSize={exportSize}
              onSizeChange={setExportSize}
              onExport={handleExport}
            />
          )}
        </div>

        <DrawToolbar
          mode={mode}
          onModeChange={setMode}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          drawColor={drawColor}
          onDrawColorChange={setDrawColor}
        />
      </div>
    </div>
  );
}
