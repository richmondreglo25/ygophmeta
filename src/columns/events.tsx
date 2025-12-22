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
    minSize: 150,
  },
  {
    accessorKey: "host",
    header: "Host",
    minSize: 150,
  },
  {
    accessorKey: "when",
    header: "When",
    cell: ({ row }) => {
      return row.original.when
        ? format(new Date(row.original.when), "MMM dd yyyy")
        : "—";
    },
    minSize: 100,
  },
  {
    accessorKey: "winners",
    header: "Winner",
    cell: ({ row }) => {
      const winners = row.original.winners;
      return winners && winners.length > 0 ? winners[0].name : "—";
    },
    minSize: 150,
  },
];
