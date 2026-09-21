import { buildContributionWeeks, type ContributionDay } from "../lib/github";

const COLORS = ["#16161e", "#1f3d2a", "#2f7a43", "#6fb05a", "#9ece6a"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CELL = 11;
const GAP = 3;
const LABEL_W = 28;

function computeMonthLabels(weeks: ContributionDay[][]): string[] {
  const labels: string[] = [];
  let last = -1;
  for (const w of weeks) {
    const m = new Date(w[0].date + "T00:00:00Z").getUTCMonth();
    const show = m !== last;
    last = m;
    labels.push(show ? MONTHS[m] : "");
  }
  return labels;
}

export function ContributionGraph({
  days,
  yearTotal,
  year,
}: {
  days: ContributionDay[];
  yearTotal: number;
  year: number;
}) {
  const weeks = buildContributionWeeks(days);
  const monthLabels = computeMonthLabels(weeks);

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="inline-block min-w-full">
          <div
            className="flex mb-[6px]"
            style={{ paddingLeft: LABEL_W + GAP }}
          >
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="text-[10px] leading-[14px] text-white/40 whitespace-nowrap"
                style={{ width: CELL, height: 14, marginRight: i === monthLabels.length - 1 ? 0 : GAP }}
              >
                {m}
              </div>
            ))}
          </div>

          <div className="flex" style={{ gap: GAP }}>
            <div className="flex flex-col" style={{ width: LABEL_W, gap: GAP }}>
              {WEEKDAYS.map((wd, i) => (
                <div
                  key={i}
                  className="text-[10px] leading-[11px] text-white/40"
                  style={{ height: CELL }}
                >
                  {wd}
                </div>
              ))}
            </div>

            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, ${CELL}px)`,
                gridTemplateRows: `repeat(7, ${CELL}px)`,
                gridAutoFlow: "column",
                gap: GAP,
              }}
            >
              {weeks.flat().map((d, i) => (
                <div
                  key={i}
                  title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                  className="rounded-[2px]"
                  style={{
                    backgroundColor: COLORS[Math.min(d.level, 4)],
                    width: CELL,
                    height: CELL,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between mt-4"
        style={{ paddingLeft: LABEL_W + GAP }}
      >
        <span className="font-mono text-xs text-white/50">
          <span className="text-green-400 tabular-nums">{yearTotal}</span> contributions in {year}
        </span>
        <div className="flex items-center gap-1.5 font-mono text-xs text-white/40">
          <span>Less</span>
          {COLORS.map((c, i) => (
            <span
              key={i}
              className="rounded-[2px]"
              style={{ backgroundColor: c, width: CELL, height: CELL }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
