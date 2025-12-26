import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImagePath } from "@/utils/enviroment";

export type Shop = {
  name: string;
  logo: string;
  images: string[];
  address: string;
  googleMaps: string;
  openHours: string;
  tournamentSchedule: { day: string; time: string; event: string }[];
  accolades: string[];
  activePlayers: number;
  about: string;
};

export const columns: ColumnDef<Shop>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const hasLogo = row.original.logo && row.original.logo.trim() !== "";
      const logoPath = hasLogo ? getImagePath(row.original.logo) : "";

      return (
        <div className="flex items-center gap-1.5">
          <Avatar className="h-4 w-4">
            {hasLogo && (
              <AvatarImage
                src={logoPath}
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
    minSize: 250,
    enableSorting: true,
  },
  {
    accessorKey: "address",
    header: "Address",
    minSize: 200,
  },
  {
    accessorKey: "openHours",
    header: "Open Hours",
    minSize: 200,
  },
  {
    accessorKey: "about",
    header: "About",
    minSize: 200,
  },
];
