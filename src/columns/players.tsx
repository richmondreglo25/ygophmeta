"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gender } from "@/enums/gender";
import { getImagePath } from "@/utils/enviroment";

export type Player = {
  name: string;
  ign: string;
  imagePath: string;
  gender: Gender;
  city: string;
  team: string;
  deck: string[];
  others: string;
};

export const columns: ColumnDef<Player>[] = [
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
              <AvatarImage src={imagePath} alt={row.original.name} />
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
  },
  {
    accessorKey: "ign",
    header: "IGN",
    minSize: 150,
  },
  {
    accessorKey: "city",
    header: "City",
    minSize: 100,
  },
];
