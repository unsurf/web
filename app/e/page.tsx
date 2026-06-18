import { ArrowDownRight } from "lucide-react";

const ASCII = `██╗   ██╗███╗   ██╗███████╗██╗   ██╗██████╗ ███████╗███████╗██╗  ██╗
██║   ██║████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██║  ██║
██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝█████╗  ███████╗███████║
██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══██║
╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║██║██╗  ███████║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚══════╝╚═╝  ╚═╝`;

export default function LayoutE() {
  return (
    <div className="dark:bg-black bg-white dark:text-white text-black font-mono">
      {/* sticky header: ASCII art */}
      <header className="sticky top-0 z-10 dark:bg-black bg-white border-b border-black/20 dark:border-white/20 flex justify-center py-3 px-4">
        <pre className="select-none pointer-events-none leading-none text-[0.3rem] sm:text-[0.4rem] md:text-[0.5rem]">
          {ASCII}
        </pre>
      </header>

      {/* C-style terminal content scrolls below */}
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div>
          <p className="text-black/40 dark:text-white/40 text-sm">$ whoami</p>
          <p className="mt-1">unsurf — developer, builder of small tools.</p>
        </div>

        <div>
          <p className="text-black/40 dark:text-white/40 text-sm">$ ls projects/</p>
          <a
            href="https://www.npmjs.com/package/dotship"
            target="_blank"
            className="group mt-2 flex items-baseline gap-3 hover:underline w-fit"
          >
            <span className="text-green-600 dark:text-green-400">dotship/</span>
            <span className="text-black/50 dark:text-white/50 text-sm">— CLI dotfile manager</span>
            <ArrowDownRight
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity self-center"
            />
          </a>
        </div>

        <div>
          <p className="text-black/40 dark:text-white/40 text-sm">
            $ <span className="animate-pulse">▋</span>
          </p>
        </div>
      </main>
    </div>
  );
}
