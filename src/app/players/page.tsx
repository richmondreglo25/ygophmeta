"use client";

import { useEffect, useState } from "react";
import { columns, Player } from "@/columns/players";
import { DataTable } from "@/components/data-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loading from "@/components/loading";

export default function Players() {
  // Players Data.
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);

  // Judges Data.
  const [judgesData, setJudgesData] = useState<Player[]>([]);
  const [judgesLoading, setJudgesLoading] = useState(true);

  useEffect(() => {
    fetch("/data/players.json")
      .then((res) => res.json())
      .then((json) => setPlayersData(json))
      .catch(() => setPlayersData([]))
      .finally(() => setPlayersLoading(false));

    fetch("/data/judges.json")
      .then((res) => res.json())
      .then((json) => setJudgesData(json))
      .catch(() => setJudgesData([]))
      .finally(() => setJudgesLoading(false));
  }, []);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="players"
    >
      <AccordionItem value="players" className="border-b-[0.5px]">
        <AccordionTrigger>
          {playersData?.length > 1 ? "Players" : "Player"} ({playersData.length}
          )
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance py-2">
          {playersLoading ? (
            <Loading />
          ) : (
            <DataTable
              columns={columns}
              data={playersData}
              searchColumn={`name`}
            />
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="judges" className="border-b-[0.5px]">
        <AccordionTrigger>
          {judgesData?.length > 1 ? "Judges" : "Judge"} ({judgesData.length})
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance py-2">
          {judgesLoading ? (
            <Loading />
          ) : (
            <DataTable
              columns={columns}
              data={judgesData}
              searchColumn={`name`}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
