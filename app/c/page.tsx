import { ArrowDownRight } from "lucide-react";

const ASCII = `██╗   ██╗███╗   ██╗███████╗██╗   ██╗██████╗ ███████╗███████╗██╗  ██╗
██║   ██║████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██║  ██║
██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝█████╗  ███████╗███████║
██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══██║
╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║██║██╗  ███████║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚══════╝╚═╝  ╚═╝`;

export default function LayoutC() {
  return (
    <div className="min-h-screen dark:bg-black bg-white font-mono">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <pre className="select-none pointer-events-none leading-none text-[0.35rem] sm:text-[0.5rem] mb-12 dark:text-white text-black">
          {ASCII}
        </pre>

        <div className="space-y-8 dark:text-white text-black">
          <div>
            <p className="text-black/40 dark:text-white/40 text-sm">$ whoami</p>
            <p className="mt-1">unsurf — developer, builder of small tools.</p>
          </div>

          <div>
            <p className="text-black/40 dark:text-white/40 text-sm">$ ls projects/</p>
            <a
              href="https://www.npmjs.com/package/dotship"
              target="_blank"
              className="group mt-1 flex items-baseline gap-3 hover:underline w-fit"
            >
              <span className="text-green-600 dark:text-green-400">dotship/</span>
              <span className="text-black/50 dark:text-white/50 text-sm">
                — CLI dotfile manager
              </span>
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
        </div>
      </div>
    </div>
  );
}
