"use client";

import { DataTable } from "@/components/data-table";
import { columns as playerColumns, Player } from "@/columns/players";
import { columns as judgesColumns, Judge } from "@/columns/judges";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loading } from "@/components/loading";
import { getJsonPath } from "@/utils/enviroment";
import { useJsonData } from "../data/api";
import { IconX } from "@/components/IconX";
import { ProfileDrawer, useProfileDrawer } from "@/components/profile-drawer";
import { useState } from "react";

export default function Community() {
  const [data, setData] = useState<unknown>(null);
  const { open, openDrawer, closeDrawer } = useProfileDrawer();

  // Data Sources.
  const sources = [
    {
      key: "players",
      label: "Player",
      plural: "Players",
      data: useJsonData<Player[]>(getJsonPath("players.json")),
      columns: playerColumns,
    },
    {
      key: "judges",
      label: "Judge",
      plural: "Judges",
      data: useJsonData<Judge[]>(getJsonPath("judges.json")),
      columns: judgesColumns,
    },
  ];

  function onClick(row: unknown) {
    if (!row) return; // Invalid row.

    setData(row);
    openDrawer();
  }

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="players"
      >
        {sources.map(({ key, label, plural, data, columns }, idx) => (
          <AccordionItem
            key={key}
            value={key}
            className={
              idx === 0
                ? "border-y-[1px]"
                : idx === sources.length - 1
                ? "border-b-[1px]"
                : ""
            }
          >
            <AccordionTrigger className="px-3 border-x-[1px]">
              <div className="flex items-center gap-2">
                <IconX type={`${key}`} size={16} />
                {data.data.length > 1 ? plural : label} ({data.data.length})
              </div>
            </AccordionTrigger>
            <AccordionContent
              className={`flex flex-col gap-4 text-balance px-1 py-5 border-t-[1px]`}
            >
              {data.loading ? (
                <Loading />
              ) : (
                <DataTable
                  columns={columns}
                  data={data.data}
                  searchColumn="name"
                  onClick={onClick}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Profile Drawer */}
      <ProfileDrawer
        open={open}
        onOpenChange={(o) => (o ? openDrawer() : closeDrawer())}
        data={data}
      />
    </>
  );
}
