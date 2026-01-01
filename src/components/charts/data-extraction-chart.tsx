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

  events.forEach((event) => {
    let eventDate: Date;
    if (typeof event.when === "string" && event.when.match(/^[A-Za-z]{3}/)) {
      eventDate = parse(event.when, "MMM d yyyy", new Date());
    } else {
      eventDate = new Date(event.when);
    }
    const week = getWeekRange(eventDate);
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

  const allWeeks = Object.keys(weekHostMap).sort(
    (a, b) =>
      new Date(a.split(" - ")[0]).getTime() -
      new Date(b.split(" - ")[0]).getTime()
  );
  const allHosts = Array.from(new Set(events.map((e) => e.host))).sort();

  return { weekHostMap, allWeeks, allHosts };
}

export function DataExtractionChart({ events }: Props) {
  const { weekHostMap, allWeeks, allHosts } = groupEventsByHostAndWeek(events);

  return (
    <div className="overflow-x-auto">
      <div className="mb-2 flex gap-4 items-center text-xs">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm" />{" "}
          Official
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-400 rounded-sm" />{" "}
          Unofficial
        </span>
        <span className="text-gray-500 ml-4">
          <b>Format:</b>{" "}
          <span className="font-mono">AE (official/unofficial)</span>
        </span>
      </div>
      <table className="min-w-full border text-xs">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left bg-gray-100">Host</th>
            {allWeeks.map((week) => (
              <th key={week} className="border px-2 py-1 bg-gray-50">
                {week}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allHosts.map((host) => (
            <tr key={host}>
              <td className="border px-2 py-1 font-semibold bg-gray-50">
                {host}
              </td>
              {allWeeks.map((week) => {
                const formats = weekHostMap[week]?.[host] || {};
                const cells = Object.entries(formats)
                  .map(([format, counts]) => {
                    const { official, unofficial } = counts;
                    let cell = "";
                    if (official > 0) {
                      cell +=
                        `<span style="color:#2563eb;font-weight:bold">` +
                        `${format} (${official}` +
                        (unofficial > 0 ? "/" : "") +
                        `</span>`;
                    }
                    if (unofficial > 0) {
                      cell +=
                        (official > 0 ? "" : "") +
                        `<span style="color:#6b7280;">` +
                        `${official > 0 ? "" : format + " ("}${unofficial}` +
                        `</span>`;
                    }
                    if (official > 0 || unofficial > 0) cell += ")";
                    return cell;
                  })
                  .filter(Boolean)
                  .join(" ");
                return (
                  <td
                    key={week}
                    className="border px-2 py-1 text-center"
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
  );
}
