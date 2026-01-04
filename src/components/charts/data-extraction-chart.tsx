"use client";

import { Event } from "@/types/event";
import { format, startOfWeek, endOfWeek, parse } from "date-fns";

// Props: pass your events array here
type Props = {
  events: Event[];
};

function getWeekRange(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
  // If month is the same, show as "Dec 8-14, 2025"
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "MMM d")}-${format(end, "d, yyyy")}`;
  }
  // If months differ, show as "Nov 30-Dec 6, 2025"
  return `${format(start, "MMM d")}-${format(end, "MMM d, yyyy")}`;
}

function groupEventsByHostAndWeek(events: Event[]) {
  // weekHostMap[week][host][format] = { official: number, unofficial: number }
  const weekHostMap: Record<
    string,
    Record<string, Record<string, { official: number; unofficial: number }>>
  > = {};
  const weekLabelToStartDate = new Map<string, Date>();

  events.forEach((event) => {
    let eventDate: Date;
    if (typeof event.when === "string" && event.when.match(/^[A-Za-z]{3}/)) {
      eventDate = parse(event.when, "MMM d yyyy", new Date());
    } else {
      eventDate = new Date(event.when);
    }
    const week = getWeekRange(eventDate);
    // Track the start date for sorting
    const start = startOfWeek(eventDate, { weekStartsOn: 1 });
    weekLabelToStartDate.set(week, start);

    if (!weekHostMap[week]) weekHostMap[week] = {};
    if (!weekHostMap[week][event.host]) weekHostMap[week][event.host] = {};
    if (!weekHostMap[week][event.host][event.format]) {
      weekHostMap[week][event.host][event.format] = {
        official: 0,
        unofficial: 0,
      };
    }
    if (event.official) {
      weekHostMap[week][event.host][event.format].official += 1;
    } else {
      weekHostMap[week][event.host][event.format].unofficial += 1;
    }
  });

  // Sort weeks by their actual start date, not by label, and reverse for latest first
  const allWeeks = Array.from(weekLabelToStartDate.keys()).sort(
    (a, b) =>
      weekLabelToStartDate.get(b)!.getTime() -
      weekLabelToStartDate.get(a)!.getTime()
  );
  const allHosts = Array.from(new Set(events.map((e) => e.host))).sort();

  return { weekHostMap, allWeeks, allHosts };
}

export function DataExtractionChart({ events }: Props) {
  const { weekHostMap, allWeeks, allHosts } = groupEventsByHostAndWeek(events);

  return (
    <div>
      <div className="mb-2 flex gap-4 items-center text-xs">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm" />{" "}
          Official
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-400 rounded-sm" />{" "}
          Unofficial
        </span>
      </div>
      <div className="flex w-full">
        {/* Fixed Host Column */}
        <table className="border text-xs">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left bg-gray-100 sticky left-0 z-10">
                Host
              </th>
            </tr>
          </thead>
          <tbody>
            {allHosts.map((host) => (
              <tr key={host}>
                <td className="border px-2 py-1 font-semibold bg-gray-50 whitespace-nowrap sticky left-0 z-10">
                  {host}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Scrollable Weeks Columns */}
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full border text-xs">
            <thead>
              <tr>
                {allWeeks.map((week) => (
                  <th
                    key={week}
                    className="border px-2 py-1 bg-gray-50 whitespace-nowrap text-center min-w-[120px]"
                  >
                    {week}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allHosts.map((host) => (
                <tr key={host}>
                  {allWeeks.map((week) => {
                    const formats = weekHostMap[week]?.[host] || {};
                    const cells = Object.entries(formats)
                      .flatMap(([format, counts]) => {
                        const parts = [];
                        if (counts.official > 0) {
                          parts.push(
                            `<span style="color:#2563eb;font-weight:bold">${format} (${counts.official})</span>`
                          );
                        }
                        if (counts.unofficial > 0) {
                          parts.push(
                            `<span style="color:#6b7280;">${format} (${counts.unofficial})</span>`
                          );
                        }
                        return parts;
                      })
                      .filter(Boolean)
                      .join(", ");
                    return (
                      <td
                        key={week}
                        className="border px-2 py-1 text-center whitespace-nowrap min-w-[120px]"
                        dangerouslySetInnerHTML={{
                          __html: cells || "-",
                        }}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
