export const DEPTH_CONFIG = {
  ease: 0.09,
  /** viewports of scroll it takes for the waterline to clear the screen */
  submergeViewports: 0.85,
  heroOutStart: 0.12,
  heroOutEnd: 0.5,
  calmDepth: 0.62,
  cssHeroVar: "--hero-out",
  gaugeSelector: "[data-scroll-gauge]",
  epsilon: 0.002,
  foam: [159, 245, 212],
  deep: [132, 138, 142],
  lenisLerp: 0.1,
  homePath: "/",
} as const;
