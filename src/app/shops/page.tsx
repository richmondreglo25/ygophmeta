"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/columns/shops";
import { getJsonPath, isDevelopment } from "@/utils/enviroment";
import { useJsonData } from "../data/api";
import { Loading } from "@/components/loading";
import { ShopDrawer, useShopDrawer } from "@/components/shop-drawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, SquareArrowOutUpRight, Store, Upload } from "lucide-react";
import { Shop } from "@/types/shop";
import { AddShopFormDrawer } from "@/components/add-shop-form-drawer";
import { UploadShopImageDrawer } from "@/components/upload-shop-image-drawer";
import { Button } from "@/components/ui/button";

export default function Shops() {
  const { data, loading } = useJsonData<Shop[]>(getJsonPath("shops.json"));
  const [selected, setSelected] = useState<Shop | null>(null);
  const { open, openDrawer, closeDrawer } = useShopDrawer();
  const [openShopFormDrawer, setOpenShopFormDrawer] = useState(false);
  const [openUploadShopImageDrawer, setOpenUploadShopImageDrawer] =
    useState(false);

  function onClick(row: Shop) {
    if (!row) return; // Invalid row.

    setSelected(row);
    openDrawer();
  }

  function handleOpenShopFormDrawer() {
    setOpenShopFormDrawer(true);
  }

  function handleCloseShopFormDrawer() {
    setOpenShopFormDrawer(false);
  }

  function handleOpenUploadShopImageDrawer() {
    setOpenUploadShopImageDrawer(true);
  }

  function handleCloseUploadShopImageDrawer() {
    setOpenUploadShopImageDrawer(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Alert variant="info" className="shadow-sm">
            <AlertDescription className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Info size={14} className="text-blue-600" />
              <div>
                <span className="font-semibold">Click</span> a shop to learn
                more.
              </div>
            </AlertDescription>
          </Alert>
          <DataTable
            columns={columns}
            data={data}
            searchColumn="name"
            onClick={onClick}
          />
        </>
      )}

      <ShopDrawer
        open={open}
        onOpenChange={(o) => (o ? openDrawer() : closeDrawer())}
        data={selected}
      />

      <div className="flex flex-col gap-4 pt-4">
        <Alert variant="info" className="shadow-sm">
          <AlertTitle className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <SquareArrowOutUpRight size={14} className="text-blue-600" />
            Share Your Shop!
          </AlertTitle>
          <AlertDescription className="text-sm pt-2 text-blue-700 dark:text-blue-300">
            Showcase your shop, highlight your offerings, and support the
            community.
          </AlertDescription>
        </Alert>
        <div className="flex justify-end gap-2">
          <Button
            variant="submit"
            size="sm"
            className="rounded-md"
            onClick={handleOpenShopFormDrawer}
          >
            <Store className="w-3 h-3" />
            Submit Shop
          </Button>
          {isDevelopment() && (
            <Button
              variant="submit"
              size="sm"
              className="rounded-md"
              onClick={handleOpenUploadShopImageDrawer}
            >
              <Upload className="w-3 h-3" />
              Upload Image
            </Button>
          )}
        </div>
        {openShopFormDrawer && (
          <AddShopFormDrawer onClose={handleCloseShopFormDrawer} />
        )}
        {openUploadShopImageDrawer && (
          <UploadShopImageDrawer onClose={handleCloseUploadShopImageDrawer} />
        )}
      </div>
    </div>
  );
}
