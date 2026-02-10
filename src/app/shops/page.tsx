"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/columns/shops";
import { getJsonPath } from "@/utils/enviroment";
import { useJsonData } from "../data/api";
import { Loading } from "@/components/loading";
import { ShopDrawer, useShopDrawer } from "@/components/shop-drawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, SquareArrowOutUpRight } from "lucide-react";
import { Shop } from "@/types/shop";
import { AddShopFormDrawer } from "@/components/add-shop-form-drawer";
import { Button } from "@/components/ui/button";

export default function Shops() {
  const { data, loading } = useJsonData<Shop[]>(getJsonPath("shops.json"));
  const [selected, setSelected] = useState<Shop | null>(null);
  const { open, openDrawer, closeDrawer } = useShopDrawer();
  const [openShopFormDrawer, setOpenShopFormDrawer] = useState(false);

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

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Alert variant="info">
            <AlertDescription className="flex items-center gap-1.5 text-sm">
              <Info size={14} />
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
        <Alert variant="info">
          <AlertTitle className="font-semibold flex items-center gap-2">
            <SquareArrowOutUpRight size={12} />
            Share Your Shop!
          </AlertTitle>
          <AlertDescription className="text-sm pt-1">
            Showcase your shop, highlight your offerings, and support the
            community.
          </AlertDescription>
        </Alert>
        <div className="flex justify-end gap-2">
          <Button
            variant="submit"
            className="rounded-sm"
            onClick={handleOpenShopFormDrawer}
          >
            <span>Submit Shop</span>
          </Button>
        </div>
        {openShopFormDrawer && (
          <AddShopFormDrawer onClose={handleCloseShopFormDrawer} />
        )}
      </div>
    </div>
  );
}
