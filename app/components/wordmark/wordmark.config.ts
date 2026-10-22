export const WORDMARK_ART = `██╗   ██╗███╗   ██╗███████╗██╗   ██╗██████╗ ███████╗███████╗██╗  ██╗
██║   ██║████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██║  ██║
██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝█████╗  ███████╗███████║
██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══██║
╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║██║██╗  ███████║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚══════╝╚═╝  ╚═╝`;

export const WORDMARK_CONFIG = {
  scrambleGlyphs: "01~^-.:=+*#",
  durationSeconds: 1.5,
  delaySeconds: 0.15,
  /** columns of scrambled glyphs trailing the reveal edge */
  edgeSpread: 18,
  accessibleName: "unsurf",
  seedMultiplier: 9301,
  seedOffset: 49297,
  seedModulus: 233280,
} as const;
