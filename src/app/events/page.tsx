"use client";

import { Loading } from "@/components/loading";
import { useEventsByYearMonthRange } from "../data/api";
import { useMemo, useState } from "react";
import { columns, Event } from "@/columns/events";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";
import { AddEventFormDrawer } from "@/components/add-event-form-drawer";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Megaphone } from "lucide-react";

export default function Events() {
  const router = useRouter();

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
    [now]
  );

  // Data fetching.
  const { data: events, loading } = useEventsByYearMonthRange(start, end);
  const [openDrawer, setOpenDrawer] = useState(false);

  function onClick(row: Event) {
    // Navigate to the dynamic Next.js route.
    router.push(`/events/${row.id}`);
  }

  function handleAddEvent() {
    setOpenDrawer(true);
  }

  function handleCloseForm() {
    setOpenDrawer(false);
  }

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-4">
          <Alert className="border-blue-300 bg-blue-50 text-blue-900 rounded-sm">
            <AlertDescription className="text-sm">
              <span className="font-semibold">Tip:</span> You can click on an
              event row to view more details about that event.
            </AlertDescription>
          </Alert>
          <DataTable
            columns={columns}
            data={events}
            searchColumn="title"
            onClick={onClick}
          />
          <Alert className="border-blue-300 bg-blue-50 text-blue-900 rounded-sm">
            <AlertTitle className="font-semibold flex items-center gap-2">
              <Megaphone size={16} />
              Share Your Event Results!
            </AlertTitle>
            <AlertDescription className="text-sm pt-2">
              Help the community grow by submitting your event results. Your
              contribution makes the meta more accurate and helps other
              duelists!
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button
              variant="submit"
              className="rounded-sm"
              onClick={handleAddEvent}
            >
              <span>Submit Event</span>
            </Button>
          </div>
          {openDrawer && <AddEventFormDrawer onClose={handleCloseForm} />}
        </div>
      )}
    </div>
  );
}
