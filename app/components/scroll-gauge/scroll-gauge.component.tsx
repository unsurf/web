import { SCROLL_GAUGE_CONFIG as C } from "./scroll-gauge.config";

export function ScrollGauge() {
  return (
    <div aria-hidden className={C.wrapperClass}>
      <div className={C.trackClass} />
      <div data-scroll-gauge className={C.markerClass} />
    </div>
  );
}
