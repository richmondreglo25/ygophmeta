"use client";

import { Loading } from "@/components/loading";
import { useEventsByYearMonthRange } from "../data/api";
import { useMemo, useState } from "react";
import { columns, Event } from "@/columns/events";
import { DataTable } from "@/components/data-table";
import { EventDrawer, useEventDrawer } from "@/components/event-drawer";

export default function Events() {
  const start = useMemo(() => ({ year: 2025, month: 1 }), []);
  const end = useMemo(() => ({ year: 2025, month: 12 }), []);
  const { data: events, loading } = useEventsByYearMonthRange(start, end);

  // Drawer state
  const { open, openDrawer, closeDrawer } = useEventDrawer();
  const [selected, setSelected] = useState<Event | null>(null);

  function onClick(row: Event) {
    setSelected(row);
    openDrawer();
  }

  return (
    <div>
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
      {/* Event Drawer */}
      {selected && (
        <EventDrawer open={open} onOpenChange={closeDrawer} data={selected} />
      )}
    </div>
  );
}
