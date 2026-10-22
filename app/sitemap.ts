import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "./lib/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return SITE_CONFIG.pages.map((path) => ({ url: `${SITE_CONFIG.url}${path}`, lastModified }));
}
