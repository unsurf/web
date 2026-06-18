"use client";

import { ArrowDownRight } from "lucide-react";
import { useEffect, useState } from "react";

const ASCII = `██╗   ██╗███╗   ██╗███████╗██╗   ██╗██████╗ ███████╗███████╗██╗  ██╗
██║   ██║████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██║  ██║
██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝█████╗  ███████╗███████║
██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══██║
╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║██║██╗  ███████║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚══════╝╚═╝  ╚═╝`;

const W = 200;
const H = 26;
const SURFACE = [".", "-", "~", "^"];

function Wave() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((p) => p + 0.05), 1000 / 24);
    return () => clearInterval(id);
  }, []);

  const heights = Array.from({ length: W }, (_, col) =>
    Math.sin(col * 0.18 + t) * (H * 0.28) +
    Math.sin(col * 0.41 + t * 1.8) * (H * 0.12) +
    Math.sin(col * 0.09 + t * 0.55) * (H * 0.1) +
    H * 0.38
  );

  const wave = Array.from({ length: H }, (_, row) => {
    const r = H - 1 - row;
    return heights.map((h) => {
      if (r < h - 1) return "~";
      if (r < h) return SURFACE[Math.floor((h % 1) * SURFACE.length)];
      return " ";
    }).join("");
  }).join("\n");

  return (
    <div className="hidden md:flex mt-auto min-h-[30vh] items-end overflow-hidden border-t border-black/10 dark:border-white/10 pt-4">
      <pre className="select-none pointer-events-none leading-none w-full text-[0.4rem] md:text-[0.55rem] lg:text-[0.7rem] text-black/25 dark:text-white/25">
        {wave}
      </pre>
    </div>
  );
}

export default function LayoutD() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen dark:bg-black bg-white dark:text-white text-black font-mono">
      <aside className="md:sticky md:top-0 md:h-screen w-full md:w-1/2 flex flex-col justify-start pt-8 pb-8 md:pb-0 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10">
        <pre className="select-none pointer-events-none leading-none text-[0.4rem] md:text-[0.55rem] lg:text-[0.7rem] px-10">
          {ASCII}
        </pre>
        <Wave />
      </aside>

      <main className="w-full md:w-1/2 flex flex-col justify-center px-10">
        <div className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
          <a
            href="https://www.npmjs.com/package/dotship"
            target="_blank"
            className="group flex items-baseline gap-4 py-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-green-600 dark:text-green-400 text-lg">dotship/</span>
            <span className="text-black/50 dark:text-white/50 text-sm flex-1">
              CLI dotfile manager
            </span>
            <ArrowDownRight
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </a>
          <a
            href="https://github.com/unsurf/spire#spire"
            target="_blank"
            className="group flex items-baseline gap-4 py-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-green-600 dark:text-green-400 text-lg">spire/</span>
            <span className="text-black/50 dark:text-white/50 text-sm flex-1">
              self-hosted financial dashboard
            </span>
            <ArrowDownRight
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
      </main>
    </div>
  );
}
