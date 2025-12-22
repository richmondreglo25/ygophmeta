"use client";

import { Loading } from "@/components/loading";
import { useEventsByYearMonthRange } from "../data/api";
import { useMemo } from "react";
import { columns, Event } from "@/columns/events";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";

export default function Events() {
  const router = useRouter();
  const start = useMemo(() => ({ year: 2025, month: 1 }), []);
  const end = useMemo(() => ({ year: 2025, month: 12 }), []);
  const { data: events, loading } = useEventsByYearMonthRange(start, end);

  function onClick(row: Event) {
    // Navigate to the dynamic Next.js route.
    router.push(`/events/${row.id}`);
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
    </div>
  );
}
