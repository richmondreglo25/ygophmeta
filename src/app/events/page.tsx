"use client";

import { Loading } from "@/components/loading";
import { useEventsByYearMonthRange } from "../data/api";
import { useMemo, useState } from "react";
import { columns, Event } from "@/columns/events";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";
import { AddEventFormModal } from "@/components/add-event-form-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Megaphone } from "lucide-react";

export default function Events() {
  const router = useRouter();
  const start = useMemo(() => ({ year: 2025, month: 1 }), []);
  const end = useMemo(() => ({ year: 2025, month: 12 }), []);
  const { data: events, loading } = useEventsByYearMonthRange(start, end);

  const [showForm, setShowForm] = useState(false);

  function onClick(row: Event) {
    // Navigate to the dynamic Next.js route.
    router.push(`/events/${row.id}`);
  }

  function handleAddEvent() {
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
  }

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-4">
          <DataTable
            columns={columns}
            data={events}
            searchColumn="title"
            onClick={onClick}
          />
          <Alert className="border-blue-300 bg-blue-50 text-blue-900 rounded-none">
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
              className="flex gap-0.5 rounded-none"
              onClick={handleAddEvent}
            >
              <Plus size={14} />
              <span>Submit Event</span>
            </Button>
          </div>
          {showForm && <AddEventFormModal onClose={handleCloseForm} />}
        </div>
      )}
    </div>
  );
}
