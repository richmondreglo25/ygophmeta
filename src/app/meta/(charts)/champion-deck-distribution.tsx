"use client";

import { useMemo } from "react";
import { Event } from "@/types/event";
import { getGraphColors } from "@/utils/colors";
import { ChartPie } from "@/components/charts/pie-chart";
import { Info, Slash } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselSlideInfo,
} from "@/components/ui/carousel";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ChampionDeckWinner = {
  name: string;
  deck: string;
  event: string;
  date: string;
  month: string;
};

type ChampionDeckWinnersByMonth = Record<string, ChampionDeckWinner[]>;
type ChampionDeckDistributionGroup = {
  format: string;
  official: boolean;
  winners: ChampionDeckWinner[];
  winnersByMonth: ChampionDeckWinnersByMonth;
};

/**
 * Displays recent champions' decks grouped by format and month.
 * @param props Events.
 * @returns JSX.Element.
 */
export function ChampionDeckDistribution({ events }: { events: Event[] }) {
  const grouped = useMemo(() => {
    const now = new Date();
    const groups: Record<string, ChampionDeckDistributionGroup> = {};

    // Iterate over the past 6 months.
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();

      // Find all events in this month.
      const monthEvents = events.filter((event) => {
        const date = event.when ? new Date(event.when) : null;
        return date && date.getMonth() === month && date.getFullYear() === year;
      });

      // For each event, get all champions' decks.
      monthEvents.forEach((event) => {
        (event.winners || [])
          .filter((w) => w.position === 1)
          .forEach((winner) => {
            // Group by format and official status.
            const groupKey = `${event.format}__${
              event.official ? "Official" : "Unofficial"
            }`;

            // Initialize group if not exists.
            if (!groups[groupKey]) {
              groups[groupKey] = {
                format: event.format,
                official: !!event.official,
                winners: [],
                winnersByMonth: {},
              };
            }

            const winnerObj: ChampionDeckWinner = {
              name: winner.name,
              deck: winner.deck || "?",
              event: event.title,
              date: event.when,
              month: `${year}-${month + 1}`,
            };
            groups[groupKey].winners.push(winnerObj);

            // Group by month label
            const label = winnerObj.date
              ? new Date(winnerObj.date).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })
              : "—";

            // Initialize month group if not exists.
            if (!groups[groupKey].winnersByMonth[label]) {
              groups[groupKey].winnersByMonth[label] = [];
            }

            // Add winner to month group.
            groups[groupKey].winnersByMonth[label].push(winnerObj);
          });
      });
    }

    // Sort winners in each group by date descending.
    Object.values(groups).forEach((group) => {
      group.winners = group.winners.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Also sort each month group.
      Object.values(group.winnersByMonth).forEach((arr) =>
        arr.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    });

    return groups;
  }, [events]);

  if (!Object.keys(grouped).length) {
    return (
      <div className="text-muted-foreground text-sm">
        No recent data available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="info">
        <AlertDescription className="flex items-center gap-1.5 text-sm">
          <Info size={14} />
          <div>
            <span className="font-semibold">Swipe</span> left or right to view
            other months.
          </div>
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(grouped)
          // Sort by official first, then by format.
          .sort(([, a], [, b]) => {
            if (a.official !== b.official) return a.official ? -1 : 1;
            return a.format.localeCompare(b.format);
          })
          .map(([key, group]) => (
            <div key={key} className="flex flex-col gap-3">
              <div className="flex gap-2 items-center font-semibold text-sm">
                <div className="flex gap-2 items-center">
                  <span>Format:</span>
                  <span className="text-violet-700">{group.format}</span>
                </div>
                <Slash size={12} />
                <span
                  className={
                    group.official ? "text-violet-700" : "text-red-500"
                  }
                >
                  {group.official ? "Official" : "Unofficial"}
                </span>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {Object.entries(group.winnersByMonth).map(
                    ([monthLabel, winners]) => {
                      // Prepare pie chart data: count decks for this month.
                      const deckCount: Record<string, number> = {};
                      winners.forEach((w) => {
                        deckCount[w.deck] = (deckCount[w.deck] || 0) + 1;
                      });
                      // Sort decks by count descending, then by name ascending.
                      const pieData = Object.entries(deckCount)
                        .map(([deck, value]) => ({
                          name: deck,
                          value,
                        }))
                        .sort((a, b) =>
                          Number(b.value) - Number(a.value) !== 0
                            ? Number(b.value) - Number(a.value)
                            : String(a.name).localeCompare(String(b.name))
                        );
                      const COLORS = getGraphColors(pieData.length, "#2563eb");
                      const pieConfig = pieData.reduce((acc, item, idx) => {
                        acc[item.name] = {
                          color: COLORS[idx % COLORS.length],
                          label: `${item.name} (${item.value})`,
                        };
                        return acc;
                      }, {} as Record<string, { color: string; label: string }>);

                      return (
                        <CarouselItem key={monthLabel}>
                          <ChartPie
                            data={pieData}
                            config={pieConfig}
                            dataKey="value"
                            nameKey="name"
                            title={`Deck Distribution (${monthLabel})`}
                            description={`Champion Decks for ${
                              group.format
                            } - ${
                              group.official ? "Official" : "Unofficial"
                            } Events in ${monthLabel}`}
                          />
                        </CarouselItem>
                      );
                    }
                  )}
                </CarouselContent>
                <CarouselSlideInfo />
              </Carousel>
            </div>
          ))}
      </div>
    </div>
  );
}
