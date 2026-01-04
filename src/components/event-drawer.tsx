"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { Event, EventDesc, EventWinner } from "@/types/event";

// Drawer hook for open/close state
export function useEventDrawer(initialOpen = false) {
  const [open, setOpen] = React.useState(initialOpen);
  const openDrawer = React.useCallback(() => setOpen(true), []);
  const closeDrawer = React.useCallback(() => setOpen(false), []);
  return { open, openDrawer, closeDrawer, setOpen };
}

// Helper to beautify attribute names
function beautifyKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/Id$/, "ID");
}

// Helper to render value based on key
function renderValue(key: string, value: unknown) {
  if (key === "desc" && typeof value === "object" && value !== null) {
    // loop object entries. expect name and desc. display name and desc.
    const descs = value as EventDesc[];
    return (
      <div className="space-y-1">
        {descs.map((desc, index) => (
          <div key={index} className="text-left text-sm font-medium">
            <span className="font-semibold">{beautifyKey(desc.name)}:</span>{" "}
            <span>{desc.desc}</span>
          </div>
        ))}
      </div>
    );
  } else if (key === "winners" && Array.isArray(value)) {
    const winners = value as EventWinner[];
    return (
      <div className="flex flex-col space-y-1">
        {winners.map((winner, index) => (
          <div key={index} className="flex flex-col text-sm">
            <div className="flex gap-2">
              <span>Name:</span>
              <span className="font-semibold">{winner.name}:</span>
            </div>
            <div className="flex gap-2">
              <span>Position:</span>
              <span className="font-semibold">{winner.position}</span>
            </div>
            <div className="flex gap-2">
              <span>Deck:</span>
              <span className="font-semibold">{winner.deck}</span>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((v, i) => (
            <div key={i} className="text-left text-sm font-medium">
              {typeof v === "object" ? JSON.stringify(v) : String(v)}
            </div>
          ))}
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <span className="text-sm font-medium">{JSON.stringify(value)}</span>
      );
    } else {
      return (
        <span className="text-sm font-medium">
          {value ? String(value) : "-"}
        </span>
      );
    }
  }
}

// EventDrawer component
interface EventDrawerProps {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Event;
}

export function EventDrawer({
  title = "Event Details",
  open,
  onOpenChange,
  data,
}: EventDrawerProps) {
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
            <div className="w-full space-y-3">
              {/* Dynamically Render Event Details */}
              {Object.entries(data).map(([key, value]) => {
                if (key === "id") return null; // Skip ID field.
                return (
                  <div
                    key={key}
                    className="flex flex-col border-b pb-2 last:border-b-0 last:pb-0"
                  >
                    <span className="font-medium text-sm text-muted-foreground">
                      {beautifyKey(key)}
                    </span>
                    <div className="text-left text-sm font-medium mt-1">
                      {renderValue(key, value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
