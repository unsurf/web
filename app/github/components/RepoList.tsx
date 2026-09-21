import { ArrowDownRight, Star } from "lucide-react";
import type { Repo } from "../lib/github";

export function RepoList({ repos }: { repos: Repo[] }) {
  return (
    <div className="flex flex-col divide-y divide-white/10">
      {repos.map((r) => (
        <a
          key={r.full_name}
          href={r.html_url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-baseline gap-4 py-4 hover:bg-white/[0.02] transition-colors"
        >
          <span className="text-green-400 text-lg">{r.name}/</span>
          <span className="text-white/50 text-sm flex-1 truncate">
            {r.description ?? "—"}
          </span>
          {r.language && (
            <span className="text-white/40 text-xs hidden sm:block">
              {r.language}
            </span>
          )}
          {r.stargazers_count > 0 && (
            <span className="text-white/40 text-xs flex items-center gap-1">
              <Star size={11} className="fill-current" />
              {r.stargazers_count}
            </span>
          )}
          <ArrowDownRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          />
        </a>
      ))}
    </div>
  );
}
