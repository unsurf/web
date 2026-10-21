"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { SCREENSHOT_CONFIG as C } from "./screenshot.config";
import type { Point, ScreenshotProps } from "./screenshot.types";

const clampZoom = (z: number) => Math.min(C.maxZoom, Math.max(C.minZoom, z));
const ORIGIN: Point = { x: 0, y: 0 };

export function Screenshot({ src, alt }: ScreenshotProps) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>(ORIGIN);
  const drag = useRef<Point | null>(null);
  const moved = useRef(false);

  const changeZoom = useCallback((next: number) => {
    setZoom(clampZoom(next));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setOffset(ORIGIN);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setZoom(1);
    setOffset(ORIGIN);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === C.closeKey) close();
      else if ((C.zoomInKeys as readonly string[]).includes(e.key))
        changeZoom(zoom + C.zoomStep);
      else if (e.key === C.zoomOutKey) changeZoom(zoom - C.zoomStep);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, zoom, close, changeZoom]);

  return (
    <>
      <button
        type="button"
        aria-label={C.labels.open}
        onClick={() => setOpen(true)}
        className="mt-3 block w-full cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          width={C.width}
          height={C.height}
          className="w-full h-auto rounded-lg border border-white/10 hover:border-green-400/40 transition-colors"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 overflow-hidden bg-black/90"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          onWheel={(e) =>
            changeZoom(zoom + (e.deltaY < 0 ? C.wheelStep : -C.wheelStep))
          }
        >
          <button
            type="button"
            aria-label={C.labels.close}
            onClick={close}
            className="absolute top-4 right-4 z-10 rounded-md border border-white/10 bg-black/80 px-2.5 py-1 text-sm text-white/60 hover:text-white hover:border-green-400/40 transition-colors"
          >
            {C.labels.closeIcon}
          </button>

          <div
            className="absolute inset-0 flex cursor-grab items-center justify-center px-6 pt-6 pb-24 active:cursor-grabbing"
            onMouseDown={(e) => {
              drag.current = {
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
              };
              moved.current = false;
            }}
            onMouseMove={(e) => {
              if (drag.current) {
                moved.current = true;
                setOffset({
                  x: e.clientX - drag.current.x,
                  y: e.clientY - drag.current.y,
                });
              }
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !moved.current) close();
            }}
            onMouseUp={() => (drag.current = null)}
            onMouseLeave={() => (drag.current = null)}
            onDoubleClick={() =>
              zoom > 1 ? resetZoom() : changeZoom(C.doubleClickZoom)
            }
          >
            <Image
              src={src}
              alt={alt}
              width={C.width}
              height={C.height}
              sizes="100vw"
              draggable={false}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom * C.baseScale})`,
              }}
              className="max-h-full w-auto max-w-full select-none rounded-lg border border-white/10"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900/90 p-1.5 text-sm backdrop-blur">
            <button
              type="button"
              aria-label={C.labels.zoomOut}
              onClick={() => changeZoom(zoom - C.zoomStep)}
              className="h-8 w-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              {C.labels.zoomOutIcon}
            </button>
            <button
              type="button"
              aria-label={C.labels.resetZoom}
              onClick={resetZoom}
              className="min-w-14 text-center text-white tabular-nums"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              aria-label={C.labels.zoomIn}
              onClick={() => changeZoom(zoom + C.zoomStep)}
              className="h-8 w-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              {C.labels.zoomInIcon}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
