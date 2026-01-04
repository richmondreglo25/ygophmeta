"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/columns/shops";
import { getJsonPath } from "@/utils/enviroment";
import { useJsonData } from "../data/api";
import { Loading } from "@/components/loading";
import { ShopDrawer, useShopDrawer } from "@/components/shop-drawer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Shop } from "@/types/shop";

export default function Shops() {
  const { data, loading } = useJsonData<Shop[]>(getJsonPath("shops.json"));
  const [selected, setSelected] = useState<Shop | null>(null);
  const { open, openDrawer, closeDrawer } = useShopDrawer();

  function onClick(row: Shop) {
    if (!row) return; // Invalid row.

    setSelected(row);
    openDrawer();
  }

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-4">
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
        </div>
      )}

      {/* Profile Drawer */}
      <ShopDrawer
        open={open}
        onOpenChange={(o) => (o ? openDrawer() : closeDrawer())}
        data={selected}
      />
    </div>
  );
}
