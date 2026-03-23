import { ArrowDownRight } from "lucide-react";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black">
      <section className="mx-8">

      <Hero />
      </section>
      <main className="w-full border-t border-black/30 dark:border-white/30 dark:text-white/80 text-black/80">
      <section>
        <div className="grid grid-cols-12 lg:gap-4 border-b border-black/30 dark:border-white/30 lg:px-8 ">
          <div className="col-span-12 lg:col-span-2  lg:border-r  border-black/30 dark:border-white/30 border-b lg:border-b-0">
            <h2 className="text-5xl font-semibold py-4 px-8 lg:px-0 "><a href="https://www.npmjs.com/package/dotship" target="_blank" className="flex flex-row">dotship<span><ArrowDownRight /></span></a></h2>
          </div>
          <div className="col-span-12 lg:col-span-10 py-4 flex items-center px-8 lg:px-0">
            <h2 className="text-2xl font-semibold text-black/70 dark:text-white/70 ">a command-line interface<sup className="text-sm font-mono">(CLI)</sup> tool for managing dotfiles right in the terminal.</h2>
          </div>
        </div>
      </section>
      
      </main>
    </div>
  );
}
