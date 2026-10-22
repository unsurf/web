export type Ripple = {
  readonly col: number;
  readonly row: number;
  readonly bornAt: number;
};

export type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  active: boolean;
};
