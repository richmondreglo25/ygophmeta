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

export default function Home() {
  const { data, loading } = useJsonData<HomeJson[]>(getJsonPath("home.json"));

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, index) => (
          <Card
            key={index}
            className="w-full p-0 rounded-none border-[1px] shadow-none flex flex-col h-full"
          >
            <CardHeader className="p-5">
              <CardTitle className="text-md">{item.title}</CardTitle>
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
      <Featured />
    </div>
  );
}
