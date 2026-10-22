export const NOT_FOUND_CONFIG = {
  code: "404",
  title: "Page not found",
  body: "",
  cta: "Back home",
  /** SF Pro is not a web font: it resolves on Apple devices and falls back to the system UI font elsewhere */
  fontClass: "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro',system-ui,sans-serif]",
} as const;
