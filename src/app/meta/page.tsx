"use client";

import { getJsonPath } from "@/utils/enviroment";
import { useMemo } from "react";
import { useEventsByYearMonthRange, useJsonData } from "../data/api";
import { ChampionDeckDistribution } from "./(charts)/champion-deck-distribution";
import { Loading } from "@/components/loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChartSpline, Crown, Megaphone } from "lucide-react";
import { TopPlayers } from "./(charts)/top-players";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DeckDistribution } from "./(charts)/deck-distribution";
import { DataExtractionChart } from "@/components/charts/data-extraction-chart";
import { Player } from "@/types/player";

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
    [now],
  );

  // Events.
  const { data: events = [], loading: eventsLoading } =
    useEventsByYearMonthRange(start, end);

  // Players.
  const { data: players = [], loading: playersLoading } = useJsonData<Player[]>(
    getJsonPath("players.json"),
  );

  if (eventsLoading || playersLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Announcements */}
      <Alert
        variant="warning"
        className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 shadow-sm"
      >
        <AlertTitle className="flex items-center gap-2 pb-2 text-yellow-800 dark:text-yellow-200">
          <Megaphone size={14} />
          Disclaimer!
        </AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-300">
          The meta insights presented here are based on the events and player
          data we have collected. There may be events or results that are not
          included, which could affect the overall analysis. Please consider
          this when interpreting the data.
        </AlertDescription>
      </Alert>

      {/* Meta Insights Accordions */}
      <Accordion
        type="multiple"
        defaultValue={[
          "top-players",
          "champion-deck-distribution",
          "deck-distribution",
        ]}
      >
        <AccordionItem value="data-extraction-chart">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <ChartSpline size={14} className="text-blue-600" />
              <span className="text-sm font-medium">
                Event Extraction Chart
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <DataExtractionChart events={events} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="top-players">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-yellow-600" />
              <span className="text-sm font-medium">
                Top Players (Most Championships)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <TopPlayers events={events} players={players} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="champion-deck-distribution">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <ChartSpline size={14} className="text-purple-600" />
              <span className="text-sm font-medium">
                Champion Decks - Distribution (Last 6 Months)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ChampionDeckDistribution events={events} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deck-distribution">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <ChartSpline size={14} className="text-green-600" />
              <span className="text-sm font-medium">
                Decks - Distribution (Last 6 Months)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <DeckDistribution events={events} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
