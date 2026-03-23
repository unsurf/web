"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";

const COLUMNS = 12;
const FADE_MS = 200;

export function ColumnGridOverlay() {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  useHotkey(
    "Mod+B",
    () => {
      if (!mounted) {
        setMounted(true);
        setExiting(false);
      } else if (!exiting) {
        setExiting(true);
      }
    },
    { preventDefault: true, enabled: !exiting },
  );

  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(() => {
      setMounted(false);
      setExiting(false);
    }, FADE_MS + 40);
    return () => window.clearTimeout(t);
  }, [exiting]);

  if (!mounted) return null;

  return (
    <div
      className={
        exiting
          ? "column-grid-overlay pointer-events-none fixed inset-0 z-[9999] box-border min-h-full w-full max-w-[100vw] overflow-hidden animate-[column-overlay-fade-out_200ms_ease-in_forwards]"
          : "column-grid-overlay pointer-events-none fixed inset-0 z-[9999] box-border min-h-full w-full max-w-[100vw] overflow-hidden animate-[column-overlay-fade-in_200ms_ease-out_forwards]"
      }
      aria-hidden
    >
      <div className="box-border grid h-full min-h-full w-full min-w-0 grid-cols-12 gap-4 px-8">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <div
            key={i}
            data-column
            className="box-border min-h-full bg-red-500/20"
          />
        ))}
      </div>
    </div>
  );
}
