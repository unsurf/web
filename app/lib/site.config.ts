export const SITE_CONFIG = {
  name: "unsurf",
  /** production domain; override with NEXT_PUBLIC_SITE_URL for previews */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://unsurf.sh",
  title: "unsurf",
  description: "Developer tools and self-hosted apps by unsurf.",
  skipLabel: "Skip to content",
  pages: ["/", "/cs-movement", "/openinventory"],
} as const;
