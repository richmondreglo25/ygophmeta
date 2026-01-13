"use client";

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { isDevelopment } from "@/utils/enviroment";
import PlayerSearch from "./player-search";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export function UploadProfileImageDrawer({ onClose }: Props) {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("name", name || "");
    if (file) formData.append("image", file);

    await fetch("/api/upload-profile-image", {
      method: "POST",
      body: formData,
    });

    setTimeout(() => {
      setUploading(false);
    }, 1000);
  }

  if (!isDevelopment()) return null; // Only render in development.

  return (
    <Drawer open dismissible={false} onClose={onClose} direction="right">
      <DrawerContent className="rounded-sm fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-lg">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle className="flex justify-between items-center p-4 text-sm font-medium border-b">
            <span>Upload Profile Image</span>
            <X size={18} className="cursor-pointer" onClick={onClose} />
          </DrawerTitle>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full p-4"
          >
            <label className="flex flex-col gap-1 text-sm font-medium">
              Search Player
              <PlayerSearch
                placeholder="Select Player"
                onValueChange={(e) =>
                  setName(e.target.value ? e.target.value : "")
                }
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Profile Image
              <Input
                type="file"
                name="image"
                accept="image/*"
                className="w-full text-xs"
                required
                disabled={!name}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="cancel"
                className="rounded-sm"
                onClick={onClose}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                variant="submit"
                type="submit"
                className="rounded-sm"
                disabled={uploading || !name || !file}
              >
                {uploading ? "Uploading..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
