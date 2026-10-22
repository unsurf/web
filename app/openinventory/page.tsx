import { ArrowLeft, ArrowDownRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "../lib/seo/seo.utils";

import { Screenshot } from "./screenshot";

export const metadata: Metadata = pageMetadata({
  path: "/openinventory",
  title: "openinventory",
  description:
    "Self-hosted CS2 inventory and storage unit tracker. Sign in with the Steam mobile app and see what you own, where it is, and what it's worth.",
});

const REPO_URL = "https://github.com/8liam/openinventory";

const SCREENSHOT_DIR = "/openinventory";

const FEATURES = [
  {
    name: "Dashboard",
    shot: "dashboard.png",
    body: "Total value with 24h/7d/30d change, a value history chart (total, inventory or storage units, 1D to all time), a donut breakdown by type, rarity, wear and location, top holdings, lowest floats, highest floats and largest stacks.",
  },
  {
    name: "Items",
    shot: "items.png",
    body: "Every item across your inventory and all storage units, searchable and filterable, with images, floats, stickers, charms (with pattern ids) and prices.",
  },
  {
    name: "Storage units",
    shot: "storage-units.png",
    body: "All units load automatically and contents are cached so restarts are instant. Capacity (1,000 items) is checked before a move starts.",
  },
  {
    name: "Cases",
    shot: "cases.png",
    body: "Case, souvenir, capsule, trade-up and drop stats from your Steam inventory history: rarity split, rarest pulls, most opened, per-month volume and your gold drought. Synced in the background and stored locally.",
  },
  {
    name: "Trade-up calculator",
    shot: "tradeup.png",
    body: "Read-only estimate of expected value from your cheapest tradable skins and their collections. It cannot perform trade-ups.",
  },
  {
    name: "Move items",
    body: "Move items between your inventory and storage units (unit to unit goes through your inventory). Each move is confirmed by the Game Coordinator with live progress, cancel and a per-item error report. Nothing is ever listed or traded.",
  },
] as const;

const CONFIG = [
  ["OPENINVENTORY_PASSWORD", "unset", "Require HTTP basic auth (any username). Unset means no auth."],
  ["OPENINVENTORY_PORT", "3000 in Docker, 4174 otherwise", "Listen port."],
  ["OPENINVENTORY_HOST", "0.0.0.0 in Docker, 127.0.0.1 otherwise", "Listen address."],
  ["OPENINVENTORY_DATA_DIR", "/data in Docker, ~/.openinventory otherwise", "SQLite database and Steam session."],
  ["OPENINVENTORY_WEB_DIR", "set in Docker", "Built web app to serve. Unset in dev."],
] as const;

const SOURCES = [
  {
    name: "ByMykel/CSGO-API",
    url: "https://github.com/ByMykel/CSGO-API",
    body: "Item names, rarities and images (images are served from Steam's CDN).",
  },
  {
    name: "Skinport",
    url: "https://skinport.com",
    body: "Prices from the public item list (lowest listing). Items with no listing count as zero.",
  },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6 text-xs uppercase tracking-widest text-white/60">
      <span className="text-green-400">▌</span>
      <span>{children}</span>
      <span className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 text-sm font-semibold text-white/80">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] leading-relaxed text-white/60">{children}</p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre tabIndex={0} className="mt-3 p-4 bg-white/[0.03] border border-white/5 rounded-lg overflow-x-auto text-[13px] leading-relaxed text-white/70">
      <code>{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-white/[0.05] border border-white/5 rounded text-[12px] text-green-400/80">
      {children}
    </code>
  );
}

function Callout({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 p-4 bg-green-400/[0.04] border border-green-400/10 rounded-lg text-[13px] leading-relaxed text-white/60">
      <span className="text-green-400 font-semibold">{label}</span>{" "}
      {children}
    </div>
  );
}

export default function OpenInventoryPage() {
  return (
    <div className="min-h-screen text-white font-mono">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          ~/unsurf
        </Link>

        <header className="mt-10">
          <p className="text-sm text-white/60">
            <span className="text-green-400">visitor</span>
            <span className="text-white/60">@</span>
            <span className="text-blue-300">unsurf</span>
            <span className="text-white/60">:</span>
            <span className="text-violet-300">~</span>
            <span className="text-white/60">$</span> docker compose up{" "}
            <span className="text-white/70">openinventory</span>
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            openinventory
          </h1>
          <p className="mt-2 text-white/60 max-w-xl">
            Self-hosted CS2 inventory and storage unit tracker. Sign in once
            with the Steam mobile app and see what you own, where it is, and
            what it&apos;s worth, with history that builds up over time.
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-[11px]">
            {["self-hosted", "local SQLite", "no listing or trading"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-white/[0.04] border border-white/5 rounded-full text-green-400/80"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </header>

        <section className="mt-14">
          <SectionTitle>Features</SectionTitle>
          <div className="flex flex-col divide-y divide-white/10">
            {FEATURES.map((f) => (
              <div key={f.name} className="py-4">
                <span className="text-green-400 text-sm">{f.name}/</span>
                <p className="mt-1 text-[13px] leading-relaxed text-white/60">
                  {f.body}
                </p>
                {"shot" in f && (
                  <Screenshot
                    src={`${SCREENSHOT_DIR}/${f.shot}`}
                    alt={f.name}
                  />
                )}
              </div>
            ))}
          </div>
          <P>
            Everything is cached in a local SQLite file on your own server.
            OpenInventory talks to Steam (with your login), fetches public item
            data and Skinport prices, and your browser loads item images from
            Steam&apos;s CDN.
          </P>
        </section>

        <section className="mt-14">
          <SectionTitle>Run with Docker</SectionTitle>
          <Code>docker compose up -d</Code>
          <P>
            <br />
            Open <InlineCode>http://localhost:3000</InlineCode>, press{" "}
            <InlineCode>Show QR code</InlineCode>, and scan it in the Steam
            mobile app.
          </P>

          <H3>Password</H3>
          <P>
            Set a password if the port is reachable by anyone but you (the
            browser will ask for any username plus this password):
          </P>
          <Code>{`OPENINVENTORY_PASSWORD='something-long' docker compose up -d`}</Code>
          <P>
            <br />
            Data (SQLite database, value history and your Steam session) lives
            in the <InlineCode>openinventory-data</InlineCode> volume.
          </P>

          <Callout label="Heads up.">
            OpenInventory connects to the CS2 Game Coordinator the way the game
            does, and Steam allows one game session per account. If CS2 is
            already running elsewhere, OpenInventory waits (it never forces the
            session) and connects when you close the game. If you launch CS2
            while OpenInventory is connected, Steam asks whether to end its
            session; it reconnects once you&apos;re done.
          </Callout>

          <H3>Configuration</H3>
          <div tabIndex={0} className="mt-3 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/10">
                  {["Variable", "Default", "Purpose"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 pr-4 text-white/60 font-normal"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONFIG.map(([name, def, purpose]) => (
                  <tr key={name} className="border-b border-white/5 last:border-0">
                    <td className="py-2 pr-4 align-top">
                      <InlineCode>{name}</InlineCode>
                    </td>
                    <td className="py-2 pr-4 text-white/60 align-top">{def}</td>
                    <td className="py-2 pr-4 text-white/60 align-top">
                      {purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <SectionTitle>Security</SectionTitle>
          <ul className="flex flex-col gap-3 text-[13px] leading-relaxed text-white/60 list-disc pl-5">
            <li>
              Your Steam <span className="text-white/70">refresh token</span> is
              stored in <InlineCode>session.json</InlineCode> inside the data
              directory (mode <InlineCode>0600</InlineCode>). Anyone who can
              read it can act as your account until you press{" "}
              <span className="text-white/70">Sign out</span>, which deletes it.
              Protect the volume.
            </li>
            <li>
              Without <InlineCode>OPENINVENTORY_PASSWORD</InlineCode>, anyone
              who can reach the port can see your inventory{" "}
              <span className="text-white/70">and move your items</span>. Set a
              password, and put OpenInventory behind a VPN or a TLS reverse
              proxy if you expose it.
            </li>
            <li>
              State-changing requests are same-origin only and require a JSON
              body, so another website can&apos;t drive your instance from your
              browser.
            </li>
          </ul>
        </section>

        <section className="mt-14">
          <SectionTitle>Develop</SectionTitle>
          <P>
            Requires Node 24+ and pnpm 12 (
            <a
              href="https://viteplus.dev"
              target="_blank"
              rel="noreferrer"
              className="text-green-400/80 underline underline-offset-2 hover:text-green-400"
            >
              Vite+
            </a>{" "}
            provides <InlineCode>vp</InlineCode>).
          </P>
          <Code>{`pnpm install
pnpm api          # API on 127.0.0.1:4174 (SQLite in ~/.openinventory)
pnpm dev          # web on :5173, proxying /api
pnpm build        # type-check + production build into dist/
vp check          # format, lint and type-check`}</Code>
          <P>
            <br />
            Stack: React 19, TanStack Router and Virtual, Tailwind 4, Zustand,
            Vite+. The server is plain Node with the built-in{" "}
            <InlineCode>node:sqlite</InlineCode>; Steam access uses{" "}
            <InlineCode>steam-session</InlineCode>,{" "}
            <InlineCode>steam-user</InlineCode> and{" "}
            <InlineCode>globaloffensive</InlineCode>.
          </P>
        </section>

        <section className="mt-14">
          <SectionTitle>Data sources</SectionTitle>
          <div className="flex flex-col divide-y divide-white/10">
            {SOURCES.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline gap-4 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-white/70 text-sm">{s.name}</span>
                <span className="text-white/60 text-[13px] flex-1">
                  {s.body}
                </span>
                <ArrowDownRight
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            ))}
          </div>
          <P>
            <br />
            Value history is recorded hourly while OpenInventory runs, for every
            currency you&apos;ve viewed the dashboard in, starting from your
            first sign-in; there is no way to backfill it.
          </P>
        </section>

        <section className="mt-14">
          <SectionTitle>Links</SectionTitle>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-baseline gap-4 py-4 hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-white/60 text-sm flex-1">GitHub</span>
            <span className="text-white/60 text-sm">
              github.com/8liam/openinventory
            </span>
            <ArrowDownRight
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </a>
        </section>

        <footer className="mt-16 pt-6 border-t border-white/10 text-xs text-white/60">
          Not affiliated with or endorsed by Valve, Steam or Skinport.
        </footer>
      </div>
    </div>
  );
}
