"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gender } from "@/enums/gender";
import { Mars, Venus } from "lucide-react";
import { getImagePath } from "@/utils/enviroment";

export type Player = {
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

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const imagePath = getImagePath(row.original.imagePath);
      return (
        <div className="flex items-center gap-1.5">
          <Avatar className="h-4 w-4">
            <AvatarImage src={imagePath} alt={row.original.name} />
            <AvatarFallback>
              <span className="text-xs">{row.original.name.charAt(0)}</span>
            </AvatarFallback>
          </Avatar>
          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "ign",
    header: "IGN",
  },
  {
    accessorKey: "konamiId",
    header: "Konami ID",
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
  },
  {
    accessorKey: "city",
    header: "City",
  },
];
