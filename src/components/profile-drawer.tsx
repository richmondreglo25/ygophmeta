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
import { Gender } from "@/enums/gender";
import { Mars, Venus } from "lucide-react";
import { getImagePath } from "@/utils/enviroment";

// Drawer hook for open/close state
export function useProfileDrawer(initialOpen = false) {
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
    .replace(/Id$/, "ID")
    .replace(/ign/i, "IGN");
}

// Helper to render value based on key
function renderValue(key: string, value: unknown) {
  if (key === "gender") {
    if (value === Gender.MALE)
      return <Mars className="text-blue-500 inline" size={18} />;
    if (value === Gender.FEMALE)
      return <Venus className="text-pink-500 inline" size={18} />;
    return String(value);
  }
  if (Array.isArray(value)) {
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
  }
  if (typeof value === "object" && value !== null) {
    return <span className="text-sm font-medium">{JSON.stringify(value)}</span>;
  }
  return (
    <span className="text-sm font-medium">{value ? String(value) : "-"}</span>
  );
}

// Generic Drawer component
interface ProfileDrawerProps<T = Record<string, unknown>> {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T;
}

export function ProfileDrawer<T = Record<string, unknown>>({
  title = "Profile",
  open,
  onOpenChange,
  data,
}: ProfileDrawerProps<T>) {
  // Show image at the top if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imagePath = (data as any)?.imagePath;
  const imageSize = 200;
  const hasImage = typeof imagePath === "string" && imagePath.trim() !== "";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="rounded-none fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-sm">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle
            className={`flex justify-between items-center p-4 text-sm font-medium border-b`}
          >
            <div className="flex items-center gap-2">
              {/* <IconX type="players" size={18} /> */}
              {title}
            </div>
            <DrawerClose>
              <X size={18} />
            </DrawerClose>
          </DrawerTitle>
          <div className="p-4 flex flex-col items-center flex-1 overflow-auto">
            {hasImage && (
              <Avatar
                className="mb-10"
                style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
              >
                <AvatarImage src={getImagePath(imagePath)} alt="Profile" />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            )}
            {!hasImage && (
              <div className="text-sm pt-5 pb-10 italic">
                No Image Available
              </div>
            )}
            <div className="w-full space-y-3">
              {data ? (
                Object.entries(data)
                  .filter(([key]) => key !== "imagePath")
                  .map(([key, value]) => {
                    return key !== "gender" ? (
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
                    ) : null;
                  })
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
