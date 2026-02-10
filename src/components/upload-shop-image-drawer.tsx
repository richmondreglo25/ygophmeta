"use client";

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { isDevelopment } from "@/utils/enviroment";
import { X } from "lucide-react";
import { useJsonData } from "@/app/data/api";
import { getJsonPath } from "@/utils/enviroment";
import { Shop } from "@/types/shop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  onClose: () => void;
};

export function UploadShopImageDrawer({ onClose }: Props) {
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: shops = [] } = useJsonData<Shop[]>(getJsonPath("shops.json"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("shopName", selectedShop);
    if (file) formData.append("image", file);

    await fetch("/api/upload-shop-image", {
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
            <span>Upload Shop Image</span>
            <X size={18} className="cursor-pointer" onClick={onClose} />
          </DrawerTitle>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full p-4"
          >
            <label className="flex flex-col gap-1 text-sm font-medium">
              Select Shop
              <Select
                value={selectedShop}
                onValueChange={setSelectedShop}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Shop" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop.name} value={shop.name}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Shop Image
              <Input
                type="file"
                name="image"
                accept="image/*"
                className="w-full text-xs"
                required
                disabled={!selectedShop}
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
                disabled={uploading || !selectedShop || !file}
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
