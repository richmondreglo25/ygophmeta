"use client";

import { HomeJson } from "@/types/json";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/loading";
import { getJsonPath } from "@/utils/enviroment";
import Link from "next/link";
import { useEventsByYearMonthRange, useJsonData } from "../data/api";
import Featured from "./featured/featured";
import { getBadgeClass } from "@/utils/featured";
import { ChartSpline, Crown, Megaphone, Slash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopPlayers } from "../meta/(charts)/top-players";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DeckDistribution } from "../meta/(charts)/deck-distribution";
import { Player } from "@/types/player";
import { AddProfileFormDrawer } from "@/components/add-profile-form-drawer";
import { UploadDeckDrawer } from "@/components/upload-deck-drawer";
import { RecentWinners } from "../meta/(charts)/recent-winners";

function getCurrentMonthYearLabel(date = new Date()) {
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

export default function Home() {
  // Home Guides.
  const { data, loading } = useJsonData<HomeJson[]>(getJsonPath("home.json"));

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

  // Drawer open states
  const [openProfileFormDrawer, setOpenProfileFormDrawer] = useState(false);
  const [openDeckDrawer, setOpenDeckDrawer] = useState(false);

  function handleOpenProfileFormDrawer() {
    setOpenProfileFormDrawer(true);
  }

  function handleCloseProfileFormDrawer() {
    setOpenProfileFormDrawer(false);
  }

  function handleOpenDeckDrawer() {
    setOpenDeckDrawer(true);
  }

  function handleCloseDeckDrawer() {
    setOpenDeckDrawer(false);
  }

  if (loading || eventsLoading || playersLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* User Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, index) => (
          <Card
            key={index}
            className="flex flex-col p-0 rounded-sm border-[1px] shadow-none select-none"
          >
            <CardHeader className="p-5">
              <CardTitle className="text-md flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <Megaphone size={12} className="text-blue-700" />
                  {item.title}
                </div>
                <span
                  className={`text-xs capitalize px-2 py-1 rounded-sm ${getBadgeClass(
                    "guide",
                  )}`}
                >
                  Guide
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm p-5 pt-0 flex-1">
              {item.description}
            </CardContent>
            {item.link && (
              <CardFooter className="flex justify-end text-sm p-5 pt-0 mt-auto">
                <Button variant="submit" className="rounded-sm">
                  <Link href={item.link}>Learn more</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}

        {/* Profile Submission Card */}
        <Card className="flex flex-col p-0 rounded-sm border-[1px] shadow-none select-none">
          <CardHeader className="p-5">
            <CardTitle className="text-md flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <Megaphone size={12} className="text-green-700" />
                Submit Your Player Profile
              </div>
              <span
                className={`text-xs capitalize px-2 py-1 rounded-sm ${getBadgeClass(
                  "guide",
                )}`}
              >
                Profile
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm p-5 pt-0 flex-1">
            Add yourself to the player database and get recognized in the
            rankings and event results.
          </CardContent>
          <CardFooter className="flex justify-end text-sm p-5 pt-0 mt-auto">
            <Button
              variant="submit"
              className="rounded-sm"
              onClick={handleOpenProfileFormDrawer}
            >
              Submit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Deck Submission Card */}
        <Card className="flex flex-col p-0 rounded-sm border-[1px] shadow-none select-none">
          <CardHeader className="p-5">
            <CardTitle className="text-md flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <Megaphone size={12} className="text-purple-700" />
                Submit a Deck
              </div>
              <span
                className={`text-xs capitalize px-2 py-1 rounded-sm ${getBadgeClass(
                  "guide",
                )}`}
              >
                Deck
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm p-5 pt-0 flex-1">
            Upload your deck to share with the community and appear in deck
            statistics.
          </CardContent>
          <CardFooter className="flex justify-end text-sm p-5 pt-0 mt-auto">
            <Button
              variant="submit"
              className="rounded-sm"
              onClick={handleOpenDeckDrawer}
            >
              Submit Deck
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Drawers */}
      {openProfileFormDrawer && (
        <AddProfileFormDrawer onClose={handleCloseProfileFormDrawer} />
      )}
      {openDeckDrawer && <UploadDeckDrawer onClose={handleCloseDeckDrawer} />}

      <Accordion
        type="multiple"
        defaultValue={["recent-winners", "deck-distribution", "top-players"]}
      >
        <AccordionItem value="recent-winners">
          <AccordionTrigger>
            <div className="flex items-center gap-1.5">
              <Crown size={10} />
              <span>Recent Winners (Last 10 Days)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RecentWinners events={events} players={players} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="top-players">
          <AccordionTrigger>
            <div className="flex items-center gap-1.5">
              <Crown size={12} />
              <span>Top Players (Most Championships)</span>
              <Slash size={12} />
              <span>{getCurrentMonthYearLabel(now)}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <TopPlayers
              events={events}
              players={players}
              showSelection={false}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deck-distribution">
          <AccordionTrigger>
            <div className="flex items-center gap-1.5">
              <ChartSpline size={12} />
              <span>Deck Distribution</span>
              <Slash size={12} />
              <span>{getCurrentMonthYearLabel(now)}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <DeckDistribution events={events} previousMonthCount={1} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Featured */}
      <Featured />
    </div>
  );
}
