"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns, Shop } from "@/columns/shops";
import { getJsonPath } from "@/utils/enviroment";
import { useJsonData } from "../data/api";
import { Loading } from "@/components/loading";
import { ShopDrawer, useShopDrawer } from "@/components/shop-drawer";

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
        <>
          <DataTable
            columns={columns}
            data={data}
            searchColumn="name"
            onClick={onClick}
          />
        </>
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
