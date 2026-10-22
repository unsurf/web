import { Wordmark } from "../wordmark/wordmark.component";

/** The stage stays pinned while the waterline climbs past the viewer. */
export function HeroStage() {
  return (
    <section aria-label="Introduction" className="relative z-10 h-[140svh] md:h-[150svh]">
      <div
        className="sticky top-0 flex h-svh flex-col justify-start px-6 pt-[22svh] md:px-10 md:pt-[24svh]"
        style={{ opacity: "calc(1 - var(--hero-out, 0))", translate: "0 calc(var(--hero-out, 0) * -6vh)" }}
      >
        <Wordmark />
      </div>
    </section>
  );
}
