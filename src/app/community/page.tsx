"use client";

import { DataTable } from "@/components/data-table";
import { columns as playerColumns } from "@/columns/players";
import { columns as judgesColumns } from "@/columns/judges";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddProfileFormDrawer } from "@/components/add-profile-form-drawer";
import { Player } from "@/types/player";
import { Judge } from "@/types/judge";

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

  // Add Profile Drawer.
  const [openAddProfileFormDrawer, setOpenAddProfileFormDrawer] =
    useState(false);

  function onClick(row: unknown) {
    if (!row) return; // Invalid row.

    setData(row);
    openDrawer();
  }

  function handleAddProfileFormDrawer() {
    setOpenAddProfileFormDrawer(true);
  }

  function handleCloseProfileFormDrawer() {
    setOpenAddProfileFormDrawer(false);
  }

  return (
    <>
      <Alert variant="info">
        <AlertDescription className="flex items-center gap-1.5 text-sm">
          <Info size={14} />
          <div>
            <span className="font-semibold">Click</span> a community member to
            learn more.
          </div>
        </AlertDescription>
      </Alert>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="players"
      >
        {sources.map(({ key, label, plural, data, columns }) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <IconX type={`${key}`} size={16} />
                {data.data.length > 1 ? plural : label} ({data.data.length})
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
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

      <div className="flex flex-col gap-4 pt-4">
        <Alert variant="info">
          <AlertTitle className="font-semibold flex items-center gap-2">
            <SquareArrowOutUpRight size={12} />
            Share Your Profile!
          </AlertTitle>
          <AlertDescription className="text-sm pt-1">
            Showcase your profile, highlight your strengths, and support the
            community.
          </AlertDescription>
        </Alert>
        <div className="flex justify-end">
          <Button
            variant="submit"
            className="rounded-sm"
            onClick={handleAddProfileFormDrawer}
          >
            <span>Submit Profile</span>
          </Button>
        </div>
        {openAddProfileFormDrawer && (
          <AddProfileFormDrawer onClose={handleCloseProfileFormDrawer} />
        )}
      </div>
    </>
  );
}
