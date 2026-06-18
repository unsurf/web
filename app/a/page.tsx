import { ArrowDownRight } from "lucide-react";

const ASCII = `██╗   ██╗███╗   ██╗███████╗██╗   ██╗██████╗ ███████╗███████╗██╗  ██╗
██║   ██║████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██║  ██║
██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝█████╗  ███████╗███████║
██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══██║
╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║██║██╗  ███████║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚══════╝╚═╝  ╚═╝`;

export default function LayoutA() {
  return (
    <div className="flex min-h-screen dark:bg-black bg-white dark:text-white text-black">
      <aside className="sticky top-0 h-screen w-1/2 flex items-center justify-center border-r border-black/20 dark:border-white/20 px-6">
        <pre className="select-none pointer-events-none leading-none text-[0.45rem] md:text-[0.6rem] lg:text-[0.8rem]">
          {ASCII}
        </pre>
      </aside>

      <main className="w-1/2 flex flex-col divide-y divide-black/20 dark:divide-white/20">
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
          <span className="text-xs font-mono text-black/30 dark:text-white/30">CLI · npm</span>
        </a>
      </main>
    </div>
  );
}
