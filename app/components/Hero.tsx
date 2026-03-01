"use client";

import { useEffect, useRef } from "react";

const ASCII_RAMP = " .:-=+*#%@";
const CELL = 14;
const WAVE_SPEED = 3;
const WAVE_DECAY = 0.985;
const MAX_WAVES = 12;

interface Wave {
  ox: number;
  oy: number;
  radius: number;
  amplitude: number;
  birth: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const wavesRef = useRef<Wave[]>([]);
  const rafRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      const prev = mouseRef.current;
      const dx = nx - prev.x;
      const dy = ny - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 40) {
        wavesRef.current.push({
          ox: nx,
          oy: ny,
          radius: 0,
          amplitude: 1,
          birth: timeRef.current,
        });
        if (wavesRef.current.length > MAX_WAVES) {
          wavesRef.current.shift();
        }
      }

      mouseRef.current = { x: nx, y: ny };
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      wavesRef.current.push({
        ox: e.clientX - rect.left,
        oy: e.clientY - rect.top,
        radius: 0,
        amplitude: 1.5,
        birth: timeRef.current,
      });
      if (wavesRef.current.length > MAX_WAVES) {
        wavesRef.current.shift();
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    const draw = () => {
      timeRef.current++;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${CELL - 2}px var(--font-geist-mono), monospace`;
      ctx.textBaseline = "top";

      const waves = wavesRef.current;

      for (const wave of waves) {
        wave.radius += WAVE_SPEED;
        wave.amplitude *= WAVE_DECAY;
      }

      wavesRef.current = waves.filter((w) => w.amplitude > 0.01);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL;
          const y = r * CELL;
          const cx = x + CELL / 2;
          const cy = y + CELL / 2;

          let totalDisplacement = 0;

          for (const wave of wavesRef.current) {
            const dx = cx - wave.ox;
            const dy = cy - wave.oy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ringDist = Math.abs(dist - wave.radius);
            const thickness = 60;

            if (ringDist < thickness) {
              const envelope = 1 - ringDist / thickness;
              const phase = Math.sin((dist - wave.radius) * 0.15);
              totalDisplacement += phase * envelope * wave.amplitude;
            }
          }

          const baseNoise =
            Math.sin(c * 0.3 + timeRef.current * 0.008) *
            Math.cos(r * 0.2 + timeRef.current * 0.006) *
            0.15;

          const value = Math.abs(totalDisplacement + baseNoise);
          const rampIdx = Math.min(
            ASCII_RAMP.length - 1,
            Math.floor(value * (ASCII_RAMP.length - 1)),
          );
          const ch = ASCII_RAMP[rampIdx];

          if (ch === " " || value < 0.02) continue;

          const alpha = Math.min(1, value * 1.2);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.85})`;
          ctx.fillText(ch, x, y);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full items-center justify-center bg-black overflow-hidden cursor-crosshair"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <h1 className="relative z-10 select-none text-[clamp(3rem,12vw,10rem)] font-bold tracking-tighter text-white/90 font-sans pointer-events-none">
        unsurf
      </h1>
    </div>
  );
}
