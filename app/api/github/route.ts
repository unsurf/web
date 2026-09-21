import { buildGithubCardSvg } from "./card";
import { getContributions, getProfile, getRepos } from "../../github/lib/github";

export const revalidate = 3600;

export async function GET() {
  const [profile, contributions, repos] = await Promise.all([
    getProfile(),
    getContributions(),
    getRepos(),
  ]);

  const svg = buildGithubCardSvg(profile, contributions, repos);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
