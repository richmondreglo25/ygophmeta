import { getTypeBadgeClass } from "@/utils/featured";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type EventDesc = {
  name: string;
  desc: number | string;
};

export type EventWinner = {
  name: string;
  position: number;
  deck: string;
  deckImagePath: string;
};

export type EventDeck = {
  name: string;
  count: number;
};

export type Event = {
  id: string;
  title: string;
  host: string;
  when: string;
  where: string;
  format: string;
  official: boolean;
  rounds?: number;
  images?: string[];
  winners: EventWinner[];
  decks: EventDeck[];
  notes?: string;
};

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
  },
  {
    accessorKey: "when",
    header: "When",
    cell: ({ row }) =>
      row.original.when
        ? format(new Date(row.original.when), "MMM dd yyyy")
        : "—",
    minSize: 80,
  },
  {
    accessorKey: "format",
    header: "Format",
    minSize: 50,
  },
  {
    accessorKey: "official",
    header: "Official",
    cell: ({ row }) => {
      const type = row.original.official ? "official" : "unofficial";
      return (
        <span
          className={`text-xs capitalize px-2 py-1 rounded-sm font-semibold ${getTypeBadgeClass(
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
