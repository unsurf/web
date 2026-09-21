import type { GithubEvent } from "../lib/github";

function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo`;
  return `${Math.floor(d / 365)}y`;
}

const VERB_COLOR: Record<string, string> = {
  push: "text-green-400",
  pr: "text-violet-400",
  create: "text-blue-400",
  delete: "text-rose-400",
  star: "text-yellow-400",
  fork: "text-cyan-400",
  issue: "text-amber-400",
  release: "text-emerald-400",
};

function describe(ev: GithubEvent): { verb: string; detail: string; repo: string } {
  const repo = ev.repo.name;
  switch (ev.type) {
    case "PushEvent": {
      const size = ev.payload?.size ?? ev.payload?.commits?.length ?? 0;
      return { verb: "push", detail: `${size} commit${size === 1 ? "" : "s"}`, repo };
    }
    case "PullRequestEvent": {
      const merged = ev.payload?.pull_request?.merged;
      const action = ev.payload?.action ?? "pr";
      return { verb: "pr", detail: merged ? "merged" : action, repo };
    }
    case "CreateEvent":
      return {
        verb: "create",
        detail: `${ev.payload?.ref_type ?? "ref"} ${ev.payload?.ref ?? ""}`.trim(),
        repo,
      };
    case "DeleteEvent":
      return {
        verb: "delete",
        detail: `${ev.payload?.ref_type ?? ""} ${ev.payload?.ref ?? ""}`.trim(),
        repo,
      };
    case "WatchEvent":
      return { verb: "star", detail: "starred", repo };
    case "ForkEvent":
      return { verb: "fork", detail: "forked", repo };
    case "IssuesEvent":
      return { verb: "issue", detail: ev.payload?.action ?? "issue", repo };
    case "ReleaseEvent":
      return { verb: "release", detail: ev.payload?.release?.name ?? "release", repo };
    case "PublicEvent":
      return { verb: "create", detail: "made public", repo };
    default:
      return {
        verb: ev.type.replace(/Event$/, "").toLowerCase(),
        detail: "",
        repo,
      };
  }
}

export function ActivityFeed({ events }: { events: GithubEvent[] }) {
  const recent = events.slice(0, 12);

  if (!recent.length) {
    return (
      <p className="font-mono text-sm text-white/40">No recent public activity.</p>
    );
  }

  return (
    <div className="font-mono">
      {recent.map((ev) => {
        const { verb, detail, repo } = describe(ev);
        const color = VERB_COLOR[verb] ?? "text-white/60";
        return (
          <a
            key={ev.id}
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.03] -mx-2 px-2 rounded transition-colors"
          >
            <span className="text-white/30 w-9 text-right tabular-nums shrink-0">
              {relTime(ev.created_at)}
            </span>
            <span className={`${color} w-14 shrink-0`}>{verb}</span>
            <span className="text-white/80 flex-1 truncate group-hover:text-white">
              {repo}
            </span>
            <span className="text-white/40 text-xs truncate hidden sm:block max-w-[40%]">
              {detail}
            </span>
          </a>
        );
      })}
    </div>
  );
}
