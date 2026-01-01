"use client";

import { useMemo } from "react";
import type { Event, EventDeck, EventWinner } from "@/columns/events";
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

type DeckDistributionProps = {
  events: Event[];
  previousMonthCount?: number;
  officialResultsOnly?: boolean;
};

type DeckParticipant = {
  deck: string;
  event: string;
  date: string;
  month: string;
};

type DeckParticipantsByMonth = Record<string, DeckParticipant[]>;
type DeckDistributionGroup = {
  format: string;
  official: boolean;
  participants: DeckParticipant[];
  participantsByMonth: DeckParticipantsByMonth;
};

// Type guard to check if the deck is of type EventDeck.
function isEventDeck(deck: EventDeck | EventWinner): deck is EventDeck {
  // EventDeck has "count" property, EventWinner does not.
  return typeof (deck as EventDeck).count !== "undefined";
}

/**
 * Displays deck distribution grouped by format and month.
 * @param props Events.
 * @returns JSX.Element.
 */
export function DeckDistribution({
  events,
  previousMonthCount = 6,
  officialResultsOnly = false,
}: DeckDistributionProps) {
  const grouped = useMemo(() => {
    const now = new Date();
    const groups: Record<string, DeckDistributionGroup> = {};

    // Iterate over the past n months.
    for (let i = 0; i < previousMonthCount; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();

      // Find all events in this month.
      const monthEvents = events.filter((event) => {
        if (officialResultsOnly === true && event.official !== true) {
          return false;
        }

        const date = event.when ? new Date(event.when) : null;
        return date && date.getMonth() === month && date.getFullYear() === year;
      });

      // For each event, get all decks (prioritize decks over winners).
      monthEvents.forEach((event) => {
        const decks: (EventDeck | EventWinner)[] =
          event.decks && event.decks.length > 0
            ? event.decks
            : event.winners || [];

        (decks || [])
          .filter((deck) => (isEventDeck(deck) ? deck.name : deck.deck))
          .forEach((deck) => {
            // Group by format and official status.
            const groupKey = `${event.format}__${
              event.official ? "Official" : "Unofficial"
            }`;

            // Initialize group if not exists.
            if (!groups[groupKey]) {
              groups[groupKey] = {
                format: event.format,
                official: !!event.official,
                participants: [],
                participantsByMonth: {},
              };
            }

            const _isEventDeck = isEventDeck(deck);
            const deckName = _isEventDeck ? deck.name : deck.deck;
            const deckCount = _isEventDeck ? deck.count ?? 1 : 1;

            for (let c = 0; c < deckCount; c++) {
              const participantObj: DeckParticipant = {
                deck: deckName,
                event: event.title,
                date: event.when,
                month: `${year}-${month + 1}`,
              };
              groups[groupKey].participants.push(participantObj);

              // Group by month label
              const label = participantObj.date
                ? new Date(participantObj.date).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : "—";

              // Initialize month group if not exists.
              if (!groups[groupKey].participantsByMonth[label]) {
                groups[groupKey].participantsByMonth[label] = [];
              }

              // Add participant to month group.
              groups[groupKey].participantsByMonth[label].push(participantObj);
            }
          });
      });
    }

    // Sort participants in each group by date descending.
    Object.values(groups).forEach((group) => {
      group.participants = group.participants.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Also sort each month group.
      Object.values(group.participantsByMonth).forEach((arr) =>
        arr.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    });

    return groups;
  }, [events, previousMonthCount, officialResultsOnly]);

  if (!Object.keys(grouped).length) {
    return (
      <div className="text-muted-foreground text-sm">
        No recent data available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Swipe Info */}
      {previousMonthCount > 1 && (
        <Alert variant="info">
          <AlertDescription className="flex items-center gap-1.5 text-sm">
            <Info size={14} />
            <div>
              <span className="font-semibold">Swipe</span> left or right to view
              other months.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Deck Distribution Groups */}
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
                  {Object.entries(group.participantsByMonth).map(
                    ([monthLabel, participants]) => {
                      // Prepare pie chart data: count decks for this month.
                      const deckCount: Record<string, number> = {};
                      participants.forEach((p) => {
                        deckCount[p.deck] = (deckCount[p.deck] || 0) + 1;
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
                            description={`Decks for ${group.format} - ${
                              group.official ? "Official" : "Unofficial"
                            } Events in ${monthLabel}`}
                            maxItems={10}
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
