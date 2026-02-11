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
import {
  ChartSpline,
  Crown,
  Megaphone,
  Users,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Star,
  Store,
  Send,
} from "lucide-react";
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
import { AddShopFormDrawer } from "@/components/add-shop-form-drawer";
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
  const [openShopFormDrawer, setOpenShopFormDrawer] = useState(false);

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

  function handleOpenShopFormDrawer() {
    setOpenShopFormDrawer(true);
  }

  function handleCloseShopFormDrawer() {
    setOpenShopFormDrawer(false);
  }

  // Calculate quick stats
  const totalPlayers = players.length;
  const totalEvents = events.length;
  const recentEvents = events.filter((event) => {
    const eventDate = new Date(event.when);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return eventDate >= sevenDaysAgo;
  }).length;
  const uniqueDecks = [
    ...new Set(
      events.flatMap((event) => event.winners.map((winner) => winner.deck)),
    ),
  ].length;

  if (loading || eventsLoading || playersLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 py-12 px-6 rounded-lg border border-blue-200 dark:border-blue-700 shadow-none">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold mb-3 text-blue-900 dark:text-blue-100">
            Welcome to YGOPhMeta
          </h1>
          <p className="text-sm md:text-base mb-6 text-blue-700 dark:text-blue-200 mx-auto">
            Your ultimate Yu-Gi-Oh! community hub. Track meta trends, discover
            top players, and join the competitive scene.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={handleOpenProfileFormDrawer}
            >
              <Users className="w-4 h-4 mr-2" />
              Join Community
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md"
              onClick={handleOpenDeckDrawer}
            >
              <Target className="w-4 h-4 mr-2" />
              Submit Deck
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center shadow-sm rounded-sm border hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {totalPlayers}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Players
          </div>
        </Card>
        <Card className="p-4 text-center shadow-sm rounded-sm border hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {totalEvents}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total Events
          </div>
        </Card>
        <Card className="p-4 text-center shadow-sm rounded-sm border hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {recentEvents}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            This Week
          </div>
        </Card>
        <Card className="p-4 text-center shadow-sm rounded-sm border hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {uniqueDecks}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Meta Decks
          </div>
        </Card>
      </div>

      {/* User Guides & Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Star size={14} className="text-yellow-600" />
            <span className="text-sm font-medium">Get Started</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <Card
              key={index}
              className="flex flex-col border rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                      <Megaphone size={14} />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getBadgeClass(
                      "guide",
                    )}`}
                  >
                    Guide
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm p-4 pt-0 flex-1 text-gray-600 dark:text-gray-300">
                {item.description}
              </CardContent>
              {item.link && (
                <CardFooter className="flex justify-end p-4 pt-0 mt-auto">
                  <Button variant="default" size="sm">
                    <Link href={item.link} className="flex items-center gap-2">
                      Learn more
                      <TrendingUp size={12} />
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}

          {/* Profile Submission Card */}
          <Card className="flex flex-col border rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="p-4">
              <CardTitle className="text-sm flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Join as Player</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${getBadgeClass("player")}`}
                >
                  Profile
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm p-4 pt-0 flex-1 text-gray-600 dark:text-gray-300">
              Add yourself to the player database and get recognized in the
              rankings and event results. Join {totalPlayers}+ players!
            </CardContent>
            <CardFooter className="flex justify-end p-4 pt-0 mt-auto">
              <Button
                variant="submit"
                size="sm"
                className="rounded-md"
                onClick={handleOpenProfileFormDrawer}
              >
                <Users className="w-3 h-3" />
                Submit Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Deck Submission Card */}
          <Card className="flex flex-col border rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="p-4">
              <CardTitle className="text-sm flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Share Your Deck</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${getBadgeClass("guide")}`}
                >
                  Deck
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm p-4 pt-0 flex-1 text-gray-600 dark:text-gray-300">
              Upload your deck to share with the community and appear in deck
              statistics. Help build the meta database!
            </CardContent>
            <CardFooter className="flex justify-end p-4 pt-0 mt-auto">
              <Button
                variant="submit"
                size="sm"
                className="rounded-md"
                onClick={handleOpenDeckDrawer}
              >
                <Send className="w-3 h-3" />
                Submit Deck
              </Button>
            </CardFooter>
          </Card>

          {/* Shop Submission Card */}
          <Card className="flex flex-col border rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="p-4">
              <CardTitle className="text-sm flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">List Your Shop</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${getBadgeClass("shop")}`}
                >
                  Shop
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm p-4 pt-0 flex-1 text-gray-600 dark:text-gray-300">
              Register your card shop to connect with local players and host
              tournaments. Join the community marketplace!
            </CardContent>
            <CardFooter className="flex justify-end p-4 pt-0 mt-auto">
              <Button
                variant="submit"
                size="sm"
                className="rounded-md"
                onClick={handleOpenShopFormDrawer}
              >
                <Store className="w-3 h-3" />
                Submit Shop
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Drawers */}
      {openProfileFormDrawer && (
        <AddProfileFormDrawer onClose={handleCloseProfileFormDrawer} />
      )}
      {openDeckDrawer && <UploadDeckDrawer onClose={handleCloseDeckDrawer} />}
      {openShopFormDrawer && (
        <AddShopFormDrawer onClose={handleCloseShopFormDrawer} />
      )}

      {/* Community Data & Analytics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ChartSpline size={14} className="text-blue-600" />
            <span className="text-sm font-medium">Community Analytics</span>
          </h2>
          <div className="text-xs text-gray-500">Updated weekly</div>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["recent-winners", "deck-distribution", "top-players"]}
          className="space-y-3"
        >
          <AccordionItem value="recent-winners">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-yellow-100 text-yellow-600">
                  <Crown size={14} />
                </div>
                <div className="text-left">
                  <span className="font-medium text-sm">Recent Winners</span>
                  <div className="text-xs text-gray-500">Last 10 Days</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <RecentWinners events={events} players={players} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="top-players">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                  <Crown size={14} />
                </div>
                <div className="text-left">
                  <span className="font-medium text-sm">Top Players</span>
                  <div className="text-xs text-gray-500">
                    {getCurrentMonthYearLabel(now)} • Most Championships
                  </div>
                </div>
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
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                  <ChartSpline size={14} />
                </div>
                <div className="text-left">
                  <span className="font-medium text-sm">Meta Analysis</span>
                  <div className="text-xs text-gray-500">
                    {getCurrentMonthYearLabel(now)} • Deck Distribution
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <DeckDistribution events={events} previousMonthCount={1} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Featured */}
      <Featured />
    </div>
  );
}
