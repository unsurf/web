import { ArrowDownRight } from "lucide-react";

const ASCII = `██╗   ██╗███╗   ██╗███████╗██╗   ██╗██████╗ ███████╗███████╗██╗  ██╗
██║   ██║████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██║  ██║
██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝█████╗  ███████╗███████║
██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══██║
╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║██║██╗  ███████║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚══════╝╚═╝  ╚═╝`;

export default function LayoutF() {
  return (
    <div className="flex min-h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* narrow sticky left: terminal identity */}
      <aside className="sticky top-0 h-screen w-1/3 flex flex-col justify-between py-12 px-8 border-r border-black/20 dark:border-white/20 font-mono">
        <pre className="select-none pointer-events-none leading-none text-[0.28rem] md:text-[0.38rem]">
          {ASCII}
        </pre>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-black/40 dark:text-white/40">$ whoami</p>
            <p className="mt-1">unsurf</p>
          </div>
          <div>
            <p className="text-black/40 dark:text-white/40">$ pwd</p>
            <p className="mt-1 text-green-600 dark:text-green-400">~/projects</p>
          </div>
          <p className="text-black/30 dark:text-white/30">
            $ <span className="animate-pulse">▋</span>
          </p>
        </div>
      </aside>

      {/* right: A-style project cards, sans-serif */}
      <main className="w-2/3 flex flex-col divide-y divide-black/20 dark:divide-white/20">
        <a
          href="https://www.npmjs.com/package/dotship"
          target="_blank"
          className="group flex flex-col gap-3 p-10 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-4xl font-semibold tracking-tight">dotship</span>
            <ArrowDownRight className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-lg text-black/50 dark:text-white/50">
            a command-line interface tool for managing dotfiles right in the terminal.
          </p>
          <span className="font-mono text-xs text-black/30 dark:text-white/30">CLI · npm</span>
        </a>
      </main>
    </div>
  );
}
