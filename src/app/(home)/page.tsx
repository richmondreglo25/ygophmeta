"use client";

import { useEffect, useState } from "react";
import { HomePageJson } from "../types/json";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HomePageJson[]>([]);

  useEffect(() => {
    fetch("/data/home.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>TODO LOADING COMPONENT!</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      {data.map((item, index) => (
        <Card
          key={index}
          className="w-full border-[0.5px] shadow-none bg-[#fcfcfc] dark:bg-gray-900"
        >
          <CardHeader>
            <CardTitle className="text-xl">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{item.description}</p>
          </CardContent>
          {item.link && (
            <CardFooter>
              <a href={item.link} className="text-blue-600 hover:underline">
                Learn more
              </a>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
