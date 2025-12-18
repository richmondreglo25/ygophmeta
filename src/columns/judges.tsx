"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gender } from "@/enums/gender";
import { Mars, Venus } from "lucide-react";
import { getImagePath } from "@/utils/enviroment";

export type Judge = {
  name: string;
  ign: string;
  konamiId: string;
  imagePath: string;
  gender: Gender;
  city: string;
  team: string;
  deck: string[];
  others: string;
};

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
    accessorKey: "konamiId",
    header: "Konami ID",
    minSize: 100,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const size = 15;
      return row.original.gender === Gender.MALE ? (
        <Mars className="text-blue-500" size={size} />
      ) : (
        <Venus className="text-pink-500" size={size} />
      );
    },
    minSize: 100,
  },
  {
    accessorKey: "city",
    header: "City",
    minSize: 100,
  },
];
