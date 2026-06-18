import { ArrowDownRight } from "lucide-react";

const ASCII = `██╗   ██╗███╗   ██╗███████╗██╗   ██╗██████╗ ███████╗███████╗██╗  ██╗
██║   ██║████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██║  ██║
██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝█████╗  ███████╗███████║
██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══██║
╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║██║██╗  ███████║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚══════╝╚═╝  ╚═╝`;

export default function LayoutB() {
  return (
    <div className="dark:bg-black bg-white dark:text-white text-black">
      <section className="h-screen flex items-center justify-center px-4">
        <pre className="select-none pointer-events-none leading-none text-[0.5rem] sm:text-[0.7rem] md:text-[0.9rem] lg:text-[1.2rem]">
          {ASCII}
        </pre>
      </section>

      <main className="border-t border-black/20 dark:border-white/20">
        <a
          href="https://www.npmjs.com/package/dotship"
          target="_blank"
          className="group flex items-center justify-between px-8 md:px-16 py-14 border-b border-black/20 dark:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
        >
          <span className="text-5xl md:text-7xl font-semibold tracking-tight">dotship</span>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-mono text-black/40 dark:text-white/40">CLI · npm</span>
            <ArrowDownRight
              size={32}
              className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all"
            />
          </div>
        </a>
      </main>
    </div>
  );
}
