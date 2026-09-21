const USERNAME = process.env.GITHUB_USERNAME ?? "8liam";
const TOKEN = process.env.GITHUB_TOKEN;

function ghHeaders(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
  return h;
}

export interface GithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface Contributions {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

export interface Repo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
  updated_at: string;
  topics: string[];
}

export interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export const githubUsername = USERNAME;

export async function getProfile(): Promise<GithubProfile | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}`, {
      headers: ghHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as GithubProfile;
  } catch {
    return null;
  }
}

export async function getContributions(): Promise<Contributions | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${USERNAME}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as Contributions;
  } catch {
    return null;
  }
}

export async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`,
      { headers: ghHeaders(), next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return (await res.json()) as Repo[];
  } catch {
    return [];
  }
}

export async function getEvents(): Promise<GithubEvent[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/events/public?per_page=30`,
      { headers: ghHeaders(), next: { revalidate: 600 } },
    );
    if (!res.ok) return [];
    return (await res.json()) as GithubEvent[];
  } catch {
    return [];
  }
}

export function computeStreaks(days: ContributionDay[]): {
  current: number;
  longest: number;
} {
  const today = Date.now();
  const valid = days
    .filter((d) => new Date(d.date + "T00:00:00Z").getTime() <= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  let current = 0;
  for (let i = valid.length - 1; i >= 0; i--) {
    if (valid[i].count > 0) current++;
    else break;
  }

  let longest = 0;
  let run = 0;
  for (const d of valid) {
    if (d.count > 0) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  return { current, longest };
}

export function buildContributionWeeks(
  days: ContributionDay[],
  weeks = 53,
): ContributionDay[][] {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) return [];

  const first = new Date(sorted[0].date + "T00:00:00Z");
  const start = new Date(
    Date.UTC(
      first.getUTCFullYear(),
      first.getUTCMonth(),
      first.getUTCDate() - first.getUTCDay(),
    ),
  );
  const today = new Date();

  const result: ContributionDay[][] = [];
  let week: ContributionDay[] = [];
  const cur = new Date(start);

  while (cur.getTime() <= today.getTime()) {
    const iso = cur.toISOString().slice(0, 10);
    week.push(byDate.get(iso) ?? { date: iso, count: 0, level: 0 });
    if (week.length === 7) {
      result.push(week);
      week = [];
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  if (week.length) result.push(week);

  return result.slice(-weeks);
}
