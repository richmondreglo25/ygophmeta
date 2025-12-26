"use client";

import { getJsonPath } from "@/utils/enviroment";
import { useMemo } from "react";
import { useEventsByYearMonthRange, useJsonData } from "../data/api";
import { Player } from "@/columns/players";
import { RecentDeckWinners } from "./(charts)/recent-deck-winners";
import { Loading } from "@/components/loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Crown, Hammer, Megaphone, Sparkle } from "lucide-react";
import { TopPlayers } from "./(charts)/top-players";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Meta() {
  // -- Data Loading -- //

  // Events (last 12 months).
  const now = useMemo(() => new Date(), []);
  const start = useMemo(() => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 11);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }, [now]);
  const end = useMemo(
    () => ({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    }),
    [now]
  );

  // Events.
  const { data: events = [], loading: eventsLoading } =
    useEventsByYearMonthRange(start, end);

  // Players.
  const { data: players = [], loading: playersLoading } = useJsonData<Player[]>(
    getJsonPath("players.json")
  );

  if (eventsLoading || playersLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Announcements */}
      <Alert
        variant="default"
        className="border-red-300 bg-red-50 text-red-900 rounded-sm p-5"
      >
        <AlertTitle className="flex items-center gap-2 pb-2">
          <Megaphone size={12} />
          Disclaimer!
        </AlertTitle>
        <AlertDescription>
          The meta insights presented here are based on the events and player
          data we have collected. There may be events or results that are not
          included, which could affect the overall analysis. Please consider
          this when interpreting the data.
        </AlertDescription>
      </Alert>

      <Accordion
        type="multiple"
        defaultValue={["top-players", "recent-deck-winners"]}
      >
        <AccordionItem value="top-players">
          <AccordionTrigger>
            <div className="flex items-center gap-1.5">
              <Crown size={10} />
              <span>Top Players (Most Wins, Placements)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <TopPlayers events={events} players={players} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="recent-deck-winners">
          <AccordionTrigger>
            <div className="flex items-center gap-1.5">
              <Sparkle size={10} />
              <span>1st Place Deck Winners Distribution (Last 6 Months)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RecentDeckWinners events={events} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="todo-list">
          <AccordionTrigger>
            <div className="flex items-center gap-1.5">
              <Hammer size={14} />
              <span>Meta Dashboard - Upcoming Features</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2 text-xs">
              <li>Event Format Breakdown (number of events per format)</li>
              <li>Official vs Unofficial Events (ratio, deck popularity)</li>
              <li>Monthly Trends (events, decks, winners over time)</li>
              <li>Event Participation (if available)</li>
            </ul>
            <p className="mt-6 text-muted-foreground text-xs">
              We will implement these meta insights one by one.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
