export const PAGE_TRANSITION_CONFIG = {
  riseSeconds: 0.75,
  drainSeconds: 0.7,
  ease: "power3.inOut",
  crestRows: ["~^~~-.~~^^~-~~.~^~-~~", "-.:~~=~-.~:~~-=~.:~-~", ".:  .:.  :. .:  .::  . "],
  crestRepeat: 40,
  crestDriftSeconds: 9,
  crestHeightRem: 3.4,
  rowCount: 80,
  rowFade: 0.075,
  minRowOpacity: 0.07,
  bodyColour: "#02060a",
} as const;
