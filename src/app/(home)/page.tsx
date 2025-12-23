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
import { useJsonData } from "../data/api";
import Featured from "./featured/featured";
import { getTypeBadgeClass } from "@/utils/featured";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Megaphone } from "lucide-react";

export default function Home() {
  const { data, loading } = useJsonData<HomeJson[]>(getJsonPath("home.json"));

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Announcements */}
      <Alert variant="default" className="rounded-none p-5">
        <AlertTitle className="flex items-center gap-2 pb-2">
          <Megaphone size={12} />
          Announcement!
        </AlertTitle>
        <AlertDescription>
          Welcome to YGO Ph Meta! Stay tuned for the latest updates on events,
          decks, and more in the Yu-Gi-Oh! community.
          <br />
          <span className="block mt-2 text-xs text-gray-500">
            <strong>Note:</strong> This site is still in development and
            currently in the data gathering phase.
          </span>
        </AlertDescription>
      </Alert>

      {/* User Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.map((item, index) => (
          <Card
            key={index}
            className="flex flex-col p-0 rounded-none border-[1px] shadow-none"
          >
            <CardHeader className="p-5">
              <CardTitle className="text-md flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <Megaphone size={12} />
                  {item.title}
                </div>
                <span
                  className={`px-2 py-1 text-xs capitalize ${getTypeBadgeClass(
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
              <CardFooter className="text-sm p-5 pt-0 mt-auto">
                <Link
                  href={item.link}
                  className="text-blue-600 hover:underline"
                >
                  Learn more
                </Link>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {/* Featured */}
      <Featured />
    </div>
  );
}
