"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImagePath } from "@/utils/enviroment";
import { Judge } from "@/types/judge";

export const columns: ColumnDef<Judge>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const hasImage =
        row.original.imagePath && row.original.imagePath.trim() !== "";
      const imagePath = hasImage ? getImagePath(row.original.imagePath) : "";
      return (
        <div className="flex items-center gap-1.5">
          <Avatar className="h-4 w-4">
            {hasImage && (
              <AvatarImage
                src={imagePath}
                alt={row.original.name}
                loading="lazy"
              />
            )}
            <AvatarFallback>
              <span className="text-xs">{row.original.name.charAt(0)}</span>
            </AvatarFallback>
          </Avatar>
          <span>{row.original.name}</span>
        </div>
      );
    },
    minSize: 150,
    enableSorting: true,
  },
  {
    accessorKey: "ign",
    header: "IGN",
    minSize: 150,
    enableSorting: true,
  },
  {
    accessorKey: "city",
    header: "City",
    minSize: 100,
    enableSorting: true,
  },
  {
    accessorKey: "team",
    header: "Team",
    minSize: 100,
    cell: ({ row }) => row.original.team || "-",
  },
];
