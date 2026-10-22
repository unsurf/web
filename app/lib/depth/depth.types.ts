export type DepthState = {
  /** smoothed overall page progress, 0 (surface) to 1 (bottom) */
  depth: number;
  /** smoothed hero progress, 0 (waterline mid-screen) to 1 (fully submerged) */
  submerge: number;
  /** inner pages: pinned underwater and quiet */
  calm: boolean;
};

export type Rgb = readonly [number, number, number];
