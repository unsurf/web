import type { Metadata } from "next";
import { SITE_CONFIG } from "../site.config";
import { SEO_CONFIG as C } from "./seo.config";
import type { PageSeo } from "./seo.types";

const image = { url: C.ogImage.url, width: C.ogImage.width, height: C.ogImage.height, alt: C.ogImage.alt };

/** Per-page metadata with canonical, Open Graph and Twitter all pointing at the page itself (Next does not merge nested openGraph). */
export function pageMetadata({ path, title, description }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: C.ogType, siteName: SITE_CONFIG.name, locale: C.locale, url: path, title, description, images: [image] },
    twitter: { card: C.twitterCard, title, description, images: [C.ogImage.url] },
  };
}

export const absoluteUrl = (path: string): string => new URL(path, SITE_CONFIG.url).toString();
