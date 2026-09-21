import {
  buildContributionWeeks,
  computeStreaks,
  githubUsername,
  type Contributions,
  type GithubProfile,
  type Repo,
} from "../../github/lib/github";

const FG = "#c0caf5";
const DIM = "#565f89";
const GREEN = "#9ece6a";
const PANEL = "#1f2335";
const BORDER = "#292e42";

const MONO = "'SFMono-Regular', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace";
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const W = 540;
const H = 304;
const PAD = 22;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function text(opts: {
  x: number;
  y: number;
  content: string;
  size: number;
  fill?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}): string {
  const {
    x, y, content, size, fill = FG, weight = 400, anchor = "start",
  } = opts;
  return `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(content)}</text>`;
}

interface Pt { x: number; y: number; }

function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function buildGithubCardSvg(
  profile: GithubProfile | null,
  contributions: Contributions | null,
  repos: Repo[],
): string {
  const name = profile?.name ?? githubUsername;
  const username = githubUsername;
  const year = new Date().getFullYear();

  const days = contributions?.contributions ?? [];
  const yearTotal =
    contributions?.total?.[String(year)] ??
    days.filter((d) => d.date.startsWith(String(year))).reduce((s, d) => s + d.count, 0);
  const streaks = computeStreaks(days);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  // weekly series (last 26 weeks)
  const weeks = buildContributionWeeks(days, 26);
  const vals = weeks.map((w) => w.reduce((s, d) => s + d.count, 0));
  const max = Math.max(...vals, 1);
  const avg = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;

  const el: string[] = [];

  // defs + background
  el.push(
    `<defs>
      <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${GREEN}" stop-opacity="0.45"/>
        <stop offset="1" stop-color="${GREEN}" stop-opacity="0"/>
      </linearGradient>
    </defs>`,
  );
  el.push(`<rect width="${W}" height="${H}" rx="14" fill="#1a1b26" stroke="${BORDER}" stroke-width="1"/>`);

  // ── header ────────────────────────────────────────────────────
  const tileS = 38;
  const tileX = PAD;
  const tileY = 14;
  el.push(
    `<rect x="${tileX}" y="${tileY}" width="${tileS}" height="${tileS}" rx="9" fill="${PANEL}" stroke="${GREEN}" stroke-width="1.5"/>`,
  );
  const initial = (name.trim()[0] ?? username[0] ?? "?").toUpperCase();
  el.push(text({ x: tileX + tileS / 2, y: tileY + tileS / 2 + 7, content: initial, size: 19, weight: 700, fill: GREEN, anchor: "middle" }));

  const idX = tileX + tileS + 16;
  el.push(text({ x: idX, y: 32, content: name, size: 18, weight: 600, fill: FG }));
  el.push(text({ x: idX, y: 48, content: `@${username}`, size: 11, fill: GREEN }));

  el.push(text({ x: W - PAD, y: 34, content: String(yearTotal), size: 24, weight: 700, fill: GREEN, anchor: "end" }));
  el.push(text({ x: W - PAD, y: 49, content: `CONTRIBUTIONS · ${year}`, size: 8, fill: DIM, anchor: "end" }));

  el.push(`<line x1="${PAD}" y1="66" x2="${W - PAD}" y2="66" stroke="${BORDER}" stroke-width="1"/>`);

  // ── chart ─────────────────────────────────────────────────────
  el.push(`<rect x="${PAD}" y="78" width="3" height="11" fill="${GREEN}"/>`);
  el.push(text({ x: PAD + 9, y: 88, content: "WEEKLY CONTRIBUTIONS", size: 10, fill: DIM, weight: 600 }));
  el.push(text({ x: W - PAD, y: 88, content: "LAST 6 MONTHS", size: 8, fill: DIM, anchor: "end" }));

  const chartLeft = 44;
  const chartRight = W - PAD;
  const chartW = chartRight - chartLeft;
  const chartTop = 100;
  const chartBase = 198;
  const chartH = chartBase - chartTop;

  // points
  const pts: Pt[] = vals.map((v, i) => ({
    x: chartLeft + (vals.length > 1 ? (i / (vals.length - 1)) * chartW : 0),
    y: chartBase - (v / max) * chartH,
  }));

  // gridlines + baseline
  el.push(`<line x1="${chartLeft}" y1="${chartTop}" x2="${chartRight}" y2="${chartTop}" stroke="${BORDER}" stroke-width="1" stroke-dasharray="2 3"/>`);
  el.push(`<line x1="${chartLeft}" y1="${chartTop + chartH / 2}" x2="${chartRight}" y2="${chartTop + chartH / 2}" stroke="${BORDER}" stroke-width="1" stroke-dasharray="2 3"/>`);
  el.push(`<line x1="${chartLeft}" y1="${chartBase}" x2="${chartRight}" y2="${chartBase}" stroke="${BORDER}" stroke-width="1"/>`);

  // average reference line
  const avgY = chartBase - (avg / max) * chartH;
  el.push(`<line x1="${chartLeft}" y1="${avgY.toFixed(1)}" x2="${chartRight}" y2="${avgY.toFixed(1)}" stroke="${GREEN}" stroke-width="1" stroke-opacity="0.4" stroke-dasharray="4 4"/>`);
  el.push(text({ x: chartRight, y: avgY - 4, content: `avg ${Math.round(avg)}`, size: 7, fill: DIM, anchor: "end" }));

  // area + line
  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${chartBase} L ${pts[0].x.toFixed(1)} ${chartBase} Z`;
  el.push(`<path d="${areaPath}" fill="url(#area)"/>`);
  el.push(`<path d="${linePath}" fill="none" stroke="${GREEN}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);

  // peak marker
  let peakIdx = 0;
  for (let i = 1; i < vals.length; i++) if (vals[i] > vals[peakIdx]) peakIdx = i;
  if (vals[peakIdx] > 0) {
    const pk = pts[peakIdx];
    el.push(`<circle cx="${pk.x.toFixed(1)}" cy="${pk.y.toFixed(1)}" r="2.5" fill="${GREEN}"/>`);
    el.push(text({ x: pk.x, y: pk.y - 7, content: String(vals[peakIdx]), size: 8, weight: 600, fill: GREEN, anchor: "middle" }));
  }

  // latest marker
  const last = pts[pts.length - 1];
  el.push(`<circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="3.5" fill="#1a1b26" stroke="${GREEN}" stroke-width="1.5"/>`);

  // month labels
  let lastM = -1;
  weeks.forEach((w, i) => {
    const first = w.find((d) => d);
    if (!first) return;
    const m = new Date(first.date + "T00:00:00Z").getUTCMonth();
    if (m !== lastM) {
      lastM = m;
      el.push(text({ x: pts[i].x, y: chartBase + 14, content: MONTHS[m], size: 8, fill: DIM, anchor: i === 0 ? "start" : "middle" }));
    }
  });

  el.push(`<line x1="${PAD}" y1="222" x2="${W - PAD}" y2="222" stroke="${BORDER}" stroke-width="1"/>`);

  // ── stats ─────────────────────────────────────────────────────
  const stats = [
    { v: String(profile?.public_repos ?? repos.filter((r) => !r.fork).length), l: "PUBLIC REPOS" },
    { v: String(profile?.followers ?? "—"), l: "FOLLOWERS" },
    { v: String(totalStars), l: "STARS EARNED" },
    { v: `${streaks.longest}d`, l: "BEST STREAK" },
  ];
  const colW = (W - 2 * PAD) / stats.length;
  stats.forEach((s, i) => {
    const cx = PAD + colW * (i + 0.5);
    el.push(text({ x: cx, y: 246, content: s.v, size: 17, weight: 600, fill: GREEN, anchor: "middle" }));
    el.push(text({ x: cx, y: 262, content: s.l, size: 8, fill: DIM, anchor: "middle" }));
    if (i < stats.length - 1) {
      const dx = PAD + colW * (i + 1);
      el.push(`<line x1="${dx}" y1="234" x2="${dx}" y2="266" stroke="${BORDER}" stroke-width="1"/>`);
    }
  });

  // footer
  el.push(text({ x: PAD, y: 290, content: `github.com/${username}`, size: 9, fill: DIM }));
  el.push(text({ x: W - PAD, y: 290, content: "unsurf · auto-updated hourly", size: 9, fill: DIM, anchor: "end" }));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub activity for ${esc(name)}">${el.join("")}</svg>`;
}
