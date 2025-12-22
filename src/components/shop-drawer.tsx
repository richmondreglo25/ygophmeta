"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImagePath } from "@/utils/enviroment";
import Image from "next/image";

// Drawer hook for open/close state
export function useShopDrawer(initialOpen = false) {
  const [open, setOpen] = React.useState(initialOpen);
  const openDrawer = React.useCallback(() => setOpen(true), []);
  const closeDrawer = React.useCallback(() => setOpen(false), []);
  return { open, openDrawer, closeDrawer, setOpen };
}

function beautifyKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/Id$/, "ID")
    .replace(/ign/i, "IGN");
}

function renderValue(key: string, value: unknown) {
  if (key === "logo") {
    if (typeof value === "string" && value.trim() !== "") {
      return (
        <Avatar className="h-12 w-12">
          <AvatarImage src={getImagePath(value)} alt="Logo" loading="lazy" />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      );
    }
    return <span className="italic text-muted-foreground">No Logo</span>;
  } else if (key === "images" && Array.isArray(value)) {
    // Use Next.js Image for optimization
    return (
      <div className="flex flex-row gap-2 flex-wrap">
        {value.map((img, i) => (
          <Image
            key={i}
            src={getImagePath(img)}
            alt={``}
            loading="lazy"
            width={100}
            height={100}
            className="text-sm rounded flex-1 object-cover border"
          />
        ))}
      </div>
    );
  } else if (key === "googleMaps" && typeof value === "string") {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline"
      >
        View on Google Maps
      </a>
    );
  } else if (key === "tournamentSchedule" && Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-1">
        {value.map((v, i) => (
          <div key={i} className="text-sm font-medium">
            {v.day} {v.time && `- ${v.time}`}: {v.event}
          </div>
        ))}
      </div>
    );
  } else if (Array.isArray(value)) {
    return (
      <span>
        {value.map((v, i) => (
          <span className="text-sm font-medium" key={i}>
            {String(v)}
            {i < value.length - 1 && ", "}
          </span>
        ))}
      </span>
    );
  } else if (typeof value === "object" && value !== null) {
    return <span className="text-sm font-medium">{JSON.stringify(value)}</span>;
  } else {
    return (
      <span className="text-sm font-medium">{value ? String(value) : "-"}</span>
    );
  }
}

interface ShopDrawerProps<T = Record<string, unknown>> {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T;
}

export function ShopDrawer<T = Record<string, unknown>>({
  title = "Shop Details",
  open,
  onOpenChange,
  data,
}: ShopDrawerProps<T>) {
  // Show logo at the top if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _data = data as any;
  const logo = _data?.logo;
  const hasLogo = typeof logo === "string" && logo.trim() !== "";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="rounded-none fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-md">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle
            className={`flex justify-between items-center p-4 text-sm font-medium border-b`}
          >
            <div className="flex items-center gap-2">{title}</div>
            <DrawerClose>
              <X size={18} />
            </DrawerClose>
          </DrawerTitle>
          <div className="p-4 flex flex-col items-center flex-1 overflow-auto">
            {hasLogo && (
              <Avatar
                className="mb-10"
                style={{ width: `120px`, height: `120px` }}
              >
                <AvatarImage
                  src={getImagePath(logo)}
                  alt="Shop Logo"
                  loading="lazy"
                />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            )}
            {!hasLogo && (
              <div className="text-sm pt-5 pb-10 italic">No Logo Available</div>
            )}
            <div className="w-full space-y-3">
              {data ? (
                Object.entries(data)
                  .filter(([key]) => key !== "logo")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col border-b pb-2 last:border-b-0 last:pb-0"
                    >
                      <span className="font-medium text-sm text-muted-foreground">
                        {beautifyKey(key)}
                      </span>
                      <span className="text-left text-sm font-medium mt-1">
                        {renderValue(key, value)}
                      </span>
                    </div>
                  ))
              ) : (
                <span className="text-muted-foreground">No data</span>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
