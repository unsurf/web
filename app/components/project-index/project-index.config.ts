import type { Project } from "./project-index.types";

export const PROJECTS = [
  { name: "dotship", blurb: "CLI dotfile manager", href: "https://www.npmjs.com/package/dotship", external: true },
  { name: "spire", blurb: "Self-hosted financial dashboard", href: "https://github.com/unsurf/spire#spire", external: true },
  { name: "cs-movement", blurb: "Source-engine movement physics library", href: "/cs-movement", external: false },
  { name: "openinventory", blurb: "Self-hosted CS2 inventory tracker", href: "/openinventory", external: false },
] as const satisfies readonly Project[];

export const PROJECT_INDEX_CONFIG = {
  sectionId: "work",
  heading: "Projects",
  listLabel: "Projects",
  staggerMs: 80,
  externalHint: "opens in a new tab",
} as const;
