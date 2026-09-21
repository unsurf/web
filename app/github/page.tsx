import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  computeStreaks,
  getContributions,
  getEvents,
  getProfile,
  getRepos,
  githubUsername,
} from "./lib/github";
import { ContributionGraph } from "./components/ContributionGraph";
import { ActivityFeed } from "./components/ActivityFeed";
import { RepoList } from "./components/RepoList";

export const metadata: Metadata = {
  title: "unsurf · github",
  description: `GitHub activity for @${githubUsername}`,
};

export const revalidate = 1800;

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-2xl text-green-400 tabular-nums">{value}</span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
        {label}
      </span>
    </div>
  );
}

function SectionTitle({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-6 font-mono text-xs uppercase tracking-widest text-white/50">
      <span className="text-green-400">▌</span>
      <span>{children}</span>
      <span className="flex-1 h-px bg-white/10" />
      {right && <span className="text-white/30 normal-case tracking-normal">{right}</span>}
    </div>
  );
}

export default async function GithubPage() {
  const [profile, contributions, repos, events] = await Promise.all([
    getProfile(),
    getContributions(),
    getRepos(),
    getEvents(),
  ]);

  const year = new Date().getFullYear();
  const yearTotal =
    contributions?.total?.[String(year)] ??
    (contributions
      ? contributions.contributions
          .filter((d) => d.date.startsWith(String(year)))
          .reduce((sum, d) => sum + d.count, 0)
      : 0);
  const streaks = contributions
    ? computeStreaks(contributions.contributions)
    : { current: 0, longest: 0 };

  const topRepos = repos
    .filter((r) => !r.fork)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        b.pushed_at.localeCompare(a.pushed_at),
    )
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* top bar */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          ~/unsurf
        </Link>

        {/* header / prompt */}
        <header className="mt-10">
          <p className="text-sm text-white/40">
            <span className="text-green-400">visitor</span>
            <span className="text-white/30">@</span>
            <span className="text-blue-300">unsurf</span>
            <span className="text-white/30">:</span>
            <span className="text-violet-300">~</span>
            <span className="text-white/30">$</span> git --activity{" "}
            <span className="text-white/70">{githubUsername}</span>
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            {profile?.name ?? githubUsername}
          </h1>
          <p className="mt-1 text-white/60">
            {profile?.bio ?? "Software Engineer"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/40">
            {profile?.company && <span>{profile.company}</span>}
            {profile?.location && (
              <>
                <span className="text-white/20">·</span>
                <span>{profile.location}</span>
              </>
            )}
            {profile?.blog && (
              <>
                <span className="text-white/20">·</span>
                <a
                  href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  {profile.blog.replace(/^https?:\/\//, "")}
                </a>
              </>
            )}
          </div>
        </header>

        {/* stats */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-4 border-y border-white/10 py-6">
          <Stat value={yearTotal} label={`${year} contribs`} />
          <Stat value={streaks.current} label="day streak" />
          <Stat value={streaks.longest} label="best streak" />
          <Stat value={profile?.public_repos ?? "—"} label="repos" />
          <Stat value={profile?.followers ?? "—"} label="followers" />
        </div>

        {/* contributions */}
        {contributions && (
          <section className="mt-14">
            <SectionTitle right={`${year - 1} → ${year}`}>Contributions</SectionTitle>
            <ContributionGraph
              days={contributions.contributions}
              yearTotal={yearTotal}
              year={year}
            />
          </section>
        )}

        {/* repos */}
        {topRepos.length > 0 && (
          <section className="mt-14">
            <SectionTitle>Top Repositories</SectionTitle>
            <RepoList repos={topRepos} />
          </section>
        )}

        {/* activity */}
        <section className="mt-14">
          <SectionTitle right="live feed">Recent Activity</SectionTitle>
          <ActivityFeed events={events} />
        </section>

        {/* footer */}
        <footer className="mt-16 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/30">
          <span>
            data cached · updates hourly
          </span>
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-green-400 transition-colors"
          >
            github.com/{githubUsername} →
          </a>
        </footer>
      </div>
    </div>
  );
}
