"use client";

import { Loading } from "@/components/loading";
import { useEventsByYearMonthRange } from "../data/api";
import { useMemo, useState } from "react";
import { columns } from "@/columns/events";
import { DataTable } from "@/components/data-table";
import { AddEventFormDrawer } from "@/components/add-event-form-drawer";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, SquareArrowOutUpRight } from "lucide-react";
import { Event } from "@/types/event";
import { UploadDeckDrawer } from "@/components/upload-deck-drawer";

export default function Events() {
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

  // Data fetching.
  const { data: events, loading } = useEventsByYearMonthRange(start, end);
  const [openEventFormDrawer, setOpenEventFormDrawer] = useState(false);
  const [openUploadDeckDrawer, setOpenUploadDeckDrawer] = useState(false);

  function onClick(row: Event) {
    // Open the event in a new browser tab.
    window.open(`/events/${row.id}`, "_blank", "noopener,noreferrer");
  }

  function handleAddEventFormDrawer() {
    setOpenEventFormDrawer(true);
  }

  function handleCloseEventFormDrawer() {
    setOpenEventFormDrawer(false);
  }

  function handleOpenUploadDeckDrawer() {
    setOpenUploadDeckDrawer(true);
  }

  function handleCloseUploadDeckDrawer() {
    setOpenUploadDeckDrawer(false);
  }

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-4">
          <Alert variant="info">
            <AlertDescription className="flex items-center gap-1.5 text-sm">
              <Info size={14} />
              <div>
                <span className="font-semibold">Click</span> an event to learn
                more.
              </div>
            </AlertDescription>
          </Alert>
          <DataTable columns={columns} data={events} onClick={onClick} />
          <Alert variant="info">
            <AlertTitle className="font-semibold flex items-center gap-2">
              <SquareArrowOutUpRight size={12} />
              Share Your Event Results!
            </AlertTitle>
            <AlertDescription className="text-sm pt-1">
              Help the community grow by submitting your event results. Your
              contribution makes the meta more accurate and helps other
              duelists!
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-2">
            <Button
              variant="submit"
              className="rounded-sm"
              onClick={handleAddEventFormDrawer}
            >
              <span>Submit Event</span>
            </Button>
            {/* Example button to open UploadDeckDrawer */}
            <Button
              variant="submit"
              className="rounded-sm"
              onClick={() => handleOpenUploadDeckDrawer()}
            >
              <span>Submit Deck</span>
            </Button>
          </div>
          {openEventFormDrawer && (
            <AddEventFormDrawer onClose={handleCloseEventFormDrawer} />
          )}
          {openUploadDeckDrawer && (
            <UploadDeckDrawer onClose={handleCloseUploadDeckDrawer} />
          )}
        </div>
      )}
    </div>
  );
}
