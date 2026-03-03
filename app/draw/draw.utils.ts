export const ASCII_SETS = {
  full: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?",
  symbols: "@#$%&*!?/\\|[]{}()<>~^+=_-.:;",
  blocks: "█▓▒░▄▀■□▪▫",
  dots: "·•●○◦◎◉⊙",
  minimal: ".:-=+*#%@",
} as const;

export type AsciiSetKey = keyof typeof ASCII_SETS;
export type ExportFormat = "png" | "webp" | "svg";
export type Mode = "brush" | "eraser" | "pan";
export type BgOption = "black" | "custom" | "transparent";
export type ExportScale = "1x" | "2x" | "3x";

export const CELL = 14;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5;
export const ZOOM_STEP = 0.001;

export const PRESETS = [
  { label: "Square", w: 500, h: 500 },
  { label: "Landscape", w: 960, h: 640 },
  { label: "Portrait", w: 640, h: 960 },
  { label: "Wide", w: 1200, h: 400 },
  { label: "Banner", w: 800, h: 200 },
] as const;

export interface Cell {
  char: string;
  alpha: number;
}

export function makeGrid(cols: number, rows: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ char: " ", alpha: 0 }))
  );
}

export function randomChar(set: string) {
  return set[Math.floor(Math.random() * set.length)];
}

export function getCols(w: number) {
  return Math.ceil(w / CELL);
}

export function getRows(h: number) {
  return Math.ceil(h / CELL);
}

export function resizeGrid(
  oldGrid: Cell[][],
  newW: number,
  newH: number
): { grid: Cell[][]; w: number; h: number } {
  const w = Math.max(100, Math.min(3000, Math.round(newW)));
  const h = Math.max(100, Math.min(3000, Math.round(newH)));
  const newCols = getCols(w);
  const newRows = getRows(h);
  const newGrid = makeGrid(newCols, newRows);
  const copyR = Math.min(oldGrid.length, newRows);
  const copyC = Math.min(oldGrid[0]?.length ?? 0, newCols);
  for (let r = 0; r < copyR; r++) {
    for (let c = 0; c < copyC; c++) {
      newGrid[r][c] = oldGrid[r][c];
    }
  }
  return { grid: newGrid, w, h };
}

export function getBgColor(
  bgOption: BgOption,
  bgColor: string
): string | null {
  if (bgOption === "transparent") return null;
  if (bgOption === "black") return "#000000";
  return bgColor;
}

export function getScaleMultiplier(exportSize: ExportScale): number {
  return exportSize === "1x" ? 1 : exportSize === "2x" ? 2 : 3;
}

export function renderGridToCtx(
  ctx: CanvasRenderingContext2D,
  grid: Cell[][],
  w: number,
  h: number,
  drawColor: string,
  bg: string | null,
  font: string
) {
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.clearRect(0, 0, w, h);
  }
  ctx.font = font;
  ctx.textBaseline = "top";
  ctx.textRendering = "optimizeLegibility";
  const rCount = grid.length;
  const cCount = grid[0]?.length ?? 0;
  for (let r = 0; r < rCount; r++) {
    for (let c = 0; c < cCount; c++) {
      const cell = grid[r][c];
      if (cell.alpha <= 0 || cell.char === " ") continue;
      ctx.globalAlpha = cell.alpha;
      ctx.fillStyle = drawColor;
      ctx.fillText(cell.char, c * CELL + 1, r * CELL);
    }
  }
  ctx.globalAlpha = 1;
}

export function exportToBitmap(
  grid: Cell[][],
  canvasW: number,
  canvasH: number,
  drawColor: string,
  bg: string | null,
  scale: number,
  format: "png" | "webp"
) {
  const w = canvasW * scale;
  const h = canvasH * scale;
  const offscreen = document.createElement("canvas");
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext("2d")!;
  ctx.scale(scale, scale);
  renderGridToCtx(
    ctx,
    grid,
    canvasW,
    canvasH,
    drawColor,
    bg,
    `${CELL}px monospace`
  );
  const mime = format === "png" ? "image/png" : "image/webp";
  offscreen.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ascii-drawing.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    mime,
    0.95
  );
}

export function exportToSVG(
  grid: Cell[][],
  canvasW: number,
  canvasH: number,
  drawColor: string,
  bg: string | null,
  scale: number
) {
  const w = canvasW * scale;
  const h = canvasH * scale;
  const fontSize = CELL * scale;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
  svg += `<style>text{font-family:ui-monospace,monospace;font-size:${fontSize}px;}</style>`;
  if (bg) svg += `<rect width="100%" height="100%" fill="${bg}"/>`;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c];
      if (cell.alpha <= 0 || cell.char === " ") continue;
      const x = c * CELL * scale + scale;
      const y = r * CELL * scale + fontSize;
      const escaped = cell.char
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      svg += `<text x="${x}" y="${y}" fill="${drawColor}" opacity="${cell.alpha.toFixed(2)}">${escaped}</text>`;
    }
  }
  svg += `</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ascii-drawing.svg";
  a.click();
  URL.revokeObjectURL(url);
}
