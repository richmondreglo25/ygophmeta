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
import { getJsonPath, isDevelopment } from "@/utils/enviroment";
import { useJsonData } from "../data/api";
import { IconX } from "@/components/IconX";
import { ProfileDrawer, useProfileDrawer } from "@/components/profile-drawer";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, SquareArrowOutUpRight, Users, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddProfileFormDrawer } from "@/components/add-profile-form-drawer";
import { UploadProfileImageDrawer } from "@/components/upload-profile-image-drawer";
import { EditProfileFormDrawer } from "@/components/edit-profile-form-drawer";
import { Player } from "@/types/player";
import { Judge } from "@/types/judge";

export default function Community() {
  const [data, setData] = useState<unknown>(null);
  const [selectedType, setSelectedType] = useState<"Player" | "Judge">(
    "Player",
  );
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
  const [openUploadProfileImageDrawer, setOpenUploadProfileImageDrawer] =
    useState(false);
  const [openEditProfileDrawer, setOpenEditProfileDrawer] = useState(false);

  function onClick(row: unknown, type: "Player" | "Judge") {
    if (!row) return; // Invalid row.

    setData(row);
    setSelectedType(type);
    openDrawer();
  }

  function handleAddProfileFormDrawer() {
    setOpenAddProfileFormDrawer(true);
  }

  function handleCloseProfileFormDrawer() {
    setOpenAddProfileFormDrawer(false);
  }

  function handleOpenUploadProfileImageDrawer() {
    setOpenUploadProfileImageDrawer(true);
  }

  function handleCloseUploadProfileImageDrawer() {
    setOpenUploadProfileImageDrawer(false);
  }

  function handleOpenEditProfileDrawer() {
    setOpenEditProfileDrawer(true);
  }

  function handleCloseEditProfileDrawer() {
    setOpenEditProfileDrawer(false);
  }

  function handleEditSuccess() {
    // Close only the edit drawer, keep profile detail drawer open
    setOpenEditProfileDrawer(false);
  }

  return (
    <>
      <Alert variant="info" className="shadow-sm">
        <AlertDescription className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
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
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <IconX type={`${key}`} size={16} />
                <span className="font-medium text-sm">
                  {data.data.length > 1 ? plural : label} ({data.data.length})
                </span>
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
                  onClick={(row) => onClick(row, label as "Player" | "Judge")}
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
        onEdit={handleOpenEditProfileDrawer}
      />

      {data && openEditProfileDrawer && (
        <EditProfileFormDrawer
          profile={data as Player | Judge}
          profileType={selectedType}
          onClose={handleCloseEditProfileDrawer}
          onSuccess={handleEditSuccess}
        />
      )}

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
        <div className="flex justify-end gap-2">
          <Button
            variant="submit"
            size="sm"
            className="rounded-md"
            onClick={handleAddProfileFormDrawer}
          >
            <Users className="w-3 h-3" />
            Submit Profile
          </Button>
          {isDevelopment() && (
            <Button
              variant="submit"
              size="sm"
              className="rounded-md"
              onClick={handleOpenUploadProfileImageDrawer}
            >
              <Upload className="w-3 h-3" />
              Upload Image
            </Button>
          )}
        </div>
        {openAddProfileFormDrawer && (
          <AddProfileFormDrawer onClose={handleCloseProfileFormDrawer} />
        )}
        {openUploadProfileImageDrawer && (
          <UploadProfileImageDrawer
            onClose={handleCloseUploadProfileImageDrawer}
          />
        )}
      </div>
    </>
  );
}
