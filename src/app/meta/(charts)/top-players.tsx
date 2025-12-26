"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/columns/events";
import type { Player } from "@/columns/players";
import { Slash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImagePath } from "@/utils/enviroment";

type TopPlayer = {
  name: string;
  count: number;
  decks: string[];
};

type TopPlayersGroup = {
  format: string;
  official: boolean;
  players: TopPlayer[];
};

const monthOptions = [
  { label: "Last Month", value: 1 },
  { label: "Last 2 Months", value: 2 },
  { label: "Last 3 Months", value: 3 },
  { label: "Last 6 Months", value: 6 },
  { label: "Last 12 Months", value: 12 },
];

export function TopPlayers({
  events,
  players,
}: {
  events: Event[];
  players: Player[];
}) {
  const [months, setMonths] = useState(1);

  // Filter events by selected months
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => {
      const date = event.when ? new Date(event.when) : null;
      if (!date) return false;
      const diff =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());
      return diff < months;
    });
  }, [events, months]);

  // Group 1st place winners by format and official
  const grouped = useMemo(() => {
    const groups: Record<string, TopPlayersGroup> = {};

    filteredEvents.forEach((event) => {
      const groupKey = `${event.format}__${
        event.official ? "Official" : "Unofficial"
      }`;
      if (!groups[groupKey]) {
        groups[groupKey] = {
          format: event.format,
          official: !!event.official,
          players: [],
        };
      }
      const playerMap: Record<string, { count: number; decks: Set<string> }> =
        {};
      (event.winners || [])
        .filter((w) => w.position === 1)
        .forEach((w) => {
          if (!playerMap[w.name]) {
            playerMap[w.name] = { count: 0, decks: new Set() };
          }
          playerMap[w.name].count += 1;
          if (w.deck) playerMap[w.name].decks.add(w.deck);
        });
      Object.entries(playerMap).forEach(([name, data]) => {
        let player = groups[groupKey].players.find((p) => p.name === name);
        if (!player) {
          player = { name, count: 0, decks: [] };
          groups[groupKey].players.push(player);
        }
        player.count += data.count;
        player.decks = Array.from(
          new Set([...player.decks, ...Array.from(data.decks)])
        );
      });
    });

    // Sort players in each group by count desc, then name asc
    Object.values(groups).forEach((group) => {
      group.players = group.players.sort((a, b) =>
        b.count !== a.count ? b.count - a.count : a.name.localeCompare(b.name)
      );
    });

    // Sort groups: official first, then by format
    return Object.entries(groups).sort(([, a], [, b]) => {
      if (a.official !== b.official) return a.official ? -1 : 1;
      return a.format.localeCompare(b.format);
    });
  }, [filteredEvents]);

  if (!grouped.length) {
    return (
      <div className="text-muted-foreground text-sm">
        No player data available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <span className="font-semibold">Show:</span>
        <select
          className="border rounded-sm px-2 py-1 text-sm"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
        >
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grouped.map(([key, group]) => (
          <div key={key} className="flex flex-col gap-3">
            <div className="flex gap-2 items-center font-semibold text-sm">
              <div>
                Format: <span className="text-blue-700">{group.format}</span>
              </div>
              <Slash size={12} />
              <span
                className={group.official ? "text-blue-700" : "text-red-500"}
              >
                {group.official ? "Official" : "Unofficial"}
              </span>
            </div>
            <div
              id="data-table-wrapper"
              className="border rounded-sm overflow-auto"
            >
              <table id="data-table" className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none">
                      Player
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none">
                      Wins
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none">
                      Decks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.players.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-sm border-b last:border-b-0 hover:bg-gray-50 transition"
                      >
                        No data
                      </td>
                    </tr>
                  )}
                  {group.players.map((p) => {
                    const _player = players.find(
                      (pl) => pl.name.toLowerCase() === p.name.toLowerCase()
                    );
                    const hasImage =
                      _player?.imagePath && _player.imagePath.trim() !== "";
                    const imagePath = hasImage
                      ? getImagePath(_player.imagePath)
                      : "";
                    return (
                      <tr
                        key={p.name}
                        className="text-sm border-b last:border-b-0 hover:bg-gray-50 transition"
                      >
                        <td>
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-4 w-4">
                              {hasImage && (
                                <AvatarImage
                                  src={imagePath}
                                  alt={p.name}
                                  loading="lazy"
                                />
                              )}
                              <AvatarFallback>
                                <span className="text-xs">
                                  {p.name.charAt(0)}
                                </span>
                              </AvatarFallback>
                            </Avatar>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td>{p.count}</td>
                        <td>
                          {p.decks.length > 0 ? (
                            p.decks.join(", ")
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
