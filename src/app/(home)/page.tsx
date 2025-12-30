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
import { getTypeBadgeClass } from "@/utils/featured";
import { Crown, Megaphone, Slash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopPlayers } from "../meta/(charts)/top-players";
import { useMemo } from "react";
import { Player } from "@/columns/players";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Facebook } from "@/components/facebook";

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
    [now]
  );

  // Events.
  const { data: events = [], loading: eventsLoading } =
    useEventsByYearMonthRange(start, end);

  // Players.
  const { data: players = [], loading: playersLoading } = useJsonData<Player[]>(
    getJsonPath("players.json")
  );

  if (loading || eventsLoading || playersLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Facebook Follow */}
      <Facebook />

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
                  <Megaphone size={12} />
                  {item.title}
                </div>
                <span
                  className={`text-xs capitalize px-2 py-1 rounded-sm ${getTypeBadgeClass(
                    "guide"
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
      </div>

      <Accordion type="multiple" defaultValue={["top-players"]}>
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
      </Accordion>

      {/* Featured */}
      <Featured />
    </div>
  );
}
