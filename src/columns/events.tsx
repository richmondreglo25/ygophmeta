import { Event } from "@/types/event";
import { getBadgeClass } from "@/utils/featured";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Title",
    minSize: 140,
  },
  {
    accessorKey: "host",
    header: "Host",
    minSize: 140,
    enableColumnFilter: true,
  },
  {
    accessorKey: "when",
    header: "When",
    cell: ({ row }) =>
      row.original.when
        ? format(new Date(row.original.when), "MMM dd yyyy EEE")
        : "—",
    minSize: 120,
  },
  {
    accessorKey: "format",
    header: "Format",
    minSize: 50,
    enableColumnFilter: true,
  },
  {
    accessorKey: "official",
    header: "Official",
    cell: ({ row }) => {
      const type = row.original.official ? "official" : "unofficial";
      return (
        <span
          className={`text-xs capitalize px-2 py-1 rounded-sm font-semibold ${getBadgeClass(
            type
          )}`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      );
    },
    minSize: 50,
  },
  {
    accessorKey: "winners",
    header: "Winner",
    cell: ({ row }) => {
      const winners = row.original.winners;
      return winners?.length ? winners[0].name : "—";
    },
    minSize: 140,
  },
];
