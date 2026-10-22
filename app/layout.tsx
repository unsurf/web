import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Martian_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AsciiField } from "./components/ascii-field/ascii-field.component";
import { ColumnGridOverlay } from "./components/ColumnGridOverlay";
import { PageTransition } from "./components/page-transition/page-transition.component";
import { ScrollDriver } from "./components/scroll-driver/scroll-driver.component";
import { ScrollGauge } from "./components/scroll-gauge/scroll-gauge.component";
import { SEO_CONFIG } from "./lib/seo/seo.config";
import { pageMetadata } from "./lib/seo/seo.utils";
import { SITE_CONFIG } from "./lib/site.config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const martian = Martian_Mono({ variable: "--font-martian", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  ...pageMetadata({ path: "/", title: SEO_CONFIG.homeTitle, description: SEO_CONFIG.homeDescription }),
  title: { default: SEO_CONFIG.homeTitle, template: `%s | ${SITE_CONFIG.name}` },
  icons: "/unsurf.svg",
};

export const viewport: Viewport = { themeColor: "#02060a", colorScheme: "dark" };

const FLAGS = "document.documentElement.classList.add('js')";

const JSON_LD = {
  "@context": SEO_CONFIG.jsonLdContext,
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  description: SEO_CONFIG.homeDescription,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FLAGS }} />
      </head>
      <body className="antialiased">
        <a className="skip-link" href="#main">
          {SITE_CONFIG.skipLabel}
        </a>
        <AsciiField />
        <ScrollGauge />
        <main id="main" className="relative z-10" tabIndex={-1}>
          {children}
        </main>
        <PageTransition />
        <ScrollDriver />
        <ColumnGridOverlay />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
