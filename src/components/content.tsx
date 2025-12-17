"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { getTabByPath } from "@/utils/navigation";
import { IconX } from "./IconX";
import { Footer } from "./footer";

export function Content({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentTab = getTabByPath(pathname);
  return (
    <>
      <div className="flex-1 flex flex-col w-full overflow-auto">
        <div className="flex-1 flex w-full">
          <div className="flex-1" />
          <div className="w-full max-w-3xl px-5">
            {currentTab && (
              <div className="flex items-center gap-1.5 py-5">
                <IconX type={currentTab.icon} height={15} width={15} />
                <h1>{currentTab.title}</h1>
              </div>
            )}
            <div className="pb-5">{children}</div>
          </div>
          <div className="flex-1" />
        </div>
        <Footer />
      </div>
    </>
  );
}
