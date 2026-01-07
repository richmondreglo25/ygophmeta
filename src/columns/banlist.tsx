"use client";

import { BanlistCard } from "@/types/banlist";
import { getBadgeClass } from "@/utils/banlist";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<BanlistCard>[] = [
  {
    accessorKey: "name",
    header: "Card",
    cell: ({ row }) => (
      <div
        className={`flex items-center gap-5 ${getBadgeClass(
          row.original.type
        )}`}
      >
        <span className="flex-1 font-medium">{row.original.name}</span>
        <span>{row.original.type}</span>
      </div>
    ),
  },
];
