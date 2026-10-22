import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../reveal/reveal.component";
import { PROJECTS, PROJECT_INDEX_CONFIG as C } from "./project-index.config";

const EASE = "ease-[cubic-bezier(.16,1,.3,1)]";
const CORNERS = ["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"] as const;

export function ProjectIndex() {
  return (
    <section id={C.sectionId} aria-labelledby="work-title" className="relative z-10 mx-auto max-w-[88rem]">
      <h2 id="work-title" className="sr-only">
        {C.heading}
      </h2>
      <ul aria-label={C.listLabel} className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 md:gap-6">
        {PROJECTS.map((p, i) => {
          const Wrapper = p.external ? "a" : Link;
          const extra = p.external ? { target: "_blank", rel: "noreferrer" } : {};
          return (
            <Reveal as="li" key={p.name} delayMs={i * C.staggerMs}>
              <Wrapper
                href={p.href}
                data-ripple=""
                {...extra}
                className="group relative flex min-h-[15rem] flex-col justify-between overflow-hidden border border-white/15 bg-[#02060a]/15 p-5 outline-none transition-colors duration-500 hover:border-white/70 focus-visible:border-white/70 md:min-h-[17rem] md:p-8"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-white/[0.06] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                {CORNERS.map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`absolute ${pos} size-2 bg-white/60 transition-colors duration-500 group-hover:bg-white group-focus-visible:bg-white`}
                  />
                ))}
                <div className={`relative flex items-start justify-between font-mono text-xs tracking-[0.2em] text-white/60 transition-colors duration-300`}>
                  <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                  <ArrowUpRight
                    aria-hidden
                    className={`size-6 transition-transform duration-700 ${EASE} group-hover:rotate-45 group-focus-visible:rotate-45 md:size-8`}
                  />
                </div>
                <div className="relative">
                  <span
                    className={`block font-display text-[clamp(1.9rem,3.5vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white transition-transform duration-700 ${EASE} group-hover:translate-x-2 group-focus-visible:translate-x-2`}
                  >
                    {p.name}
                  </span>
                  <span className={`mt-3 block max-w-[28ch] text-sm text-white/70 transition-colors duration-300 md:text-base`}>
                    {p.blurb}
                  </span>
                </div>
                {p.external ? <span className="sr-only">{C.externalHint}</span> : null}
              </Wrapper>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
