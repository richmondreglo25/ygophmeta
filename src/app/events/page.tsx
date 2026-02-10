"use client";

import { Loading } from "@/components/loading";
import { useEventsByYearMonthRange } from "../data/api";
import { useMemo, useState } from "react";
import { columns } from "@/columns/events";
import { DataTable } from "@/components/data-table";
import { AddEventFormDrawer } from "@/components/add-event-form-drawer";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, SquareArrowOutUpRight, Calendar, Send } from "lucide-react";
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
          <Alert variant="info" className="shadow-sm">
            <AlertDescription className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Info size={14} className="text-blue-600" />
              <div>
                <span className="font-semibold">Click</span> an event to learn
                more.
              </div>
            </AlertDescription>
          </Alert>
          <DataTable columns={columns} data={events} onClick={onClick} />
          <Alert variant="info" className="shadow-sm">
            <AlertTitle className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <SquareArrowOutUpRight size={14} className="text-blue-600" />
              Share Your Event Results!
            </AlertTitle>
            <AlertDescription className="text-sm pt-2 text-blue-700 dark:text-blue-300">
              Help the community grow by submitting your event results. Your
              contribution makes the meta more accurate and helps other
              duelists!
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-2">
            <Button
              variant="submit"
              size="sm"
              className="rounded-md"
              onClick={handleAddEventFormDrawer}
            >
              <Calendar className="w-3 h-3" />
              Submit Event
            </Button>
            {/* Example button to open UploadDeckDrawer */}
            <Button
              variant="submit"
              size="sm"
              className="rounded-md"
              onClick={() => handleOpenUploadDeckDrawer()}
            >
              <Send className="w-3 h-3" />
              Submit Deck
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
