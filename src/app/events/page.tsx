"use client";

import { Loading } from "@/components/loading";
import { useEventsByYearMonthRange } from "../data/api";
import { useMemo } from "react";
import { columns, Event } from "@/columns/events";
import { DataTable } from "@/components/data-table";

export default function Events() {
  const start = useMemo(() => ({ year: 2025, month: 1 }), []);
  const end = useMemo(() => ({ year: 2025, month: 12 }), []);
  const { data: events, loading } = useEventsByYearMonthRange(start, end);

  if (loading) {
    return <Loading />;
  }

  function onClick(row: Event) {
    console.log("Clicked event:", row);
  }

  return (
    <DataTable
      columns={columns}
      data={events}
      searchColumn="title"
      onClick={onClick}
    />
  );
}
