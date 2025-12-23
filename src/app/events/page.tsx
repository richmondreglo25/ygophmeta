"use client";

import { Loading } from "@/components/loading";
import { useEventsByYearMonthRange } from "../data/api";
import { useMemo, useState } from "react";
import { columns, Event } from "@/columns/events";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";
import { AddEventFormModal } from "@/components/add-event-form-modal";

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
      <button
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
        onClick={handleAddEvent}
      >
        Add Event
      </button>
      {showForm && <AddEventFormModal onClose={handleCloseForm} />}
      {loading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={events}
          searchColumn="title"
          onClick={onClick}
        />
      )}
    </div>
  );
}
