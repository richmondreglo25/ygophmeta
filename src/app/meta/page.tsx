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
import { Sparkle } from "lucide-react";
import { TopPlayers } from "./(charts)/top-players";

export default function Meta() {
  // -- Data Loading -- //

  // Events.
  const start = useMemo(() => ({ year: 2025, month: 1 }), []);
  const end = useMemo(() => ({ year: 2025, month: 12 }), []);
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
    <div>
      <Accordion
        type="multiple"
        defaultValue={["top-players", "recent-deck-winners"]}
      >
        <AccordionItem value="top-players">
          <AccordionTrigger>
            <div className="flex items-center gap-1.5">
              <Sparkle size={10} />
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
          <AccordionTrigger>Meta Dashboard TODO</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li>Event Format Breakdown (number of events per format)</li>
              <li>Deck Distribution by Format</li>
              <li>Official vs Unofficial Events (ratio, deck popularity)</li>
              <li>Monthly Trends (events, decks, winners over time)</li>
              <li>Winner Decks (most common winning decks)</li>
              <li>Event Participation (if available)</li>
            </ul>
            <p className="mt-6 text-muted-foreground">
              We will implement these meta insights one by one.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
