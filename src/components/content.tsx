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
    <div className="flex-1 flex flex-col bg-[#f5f5f5] w-full overflow-auto">
      <div className="flex-1 flex w-full">
        <div className="flex-1" />
        <div className="bg-white w-full max-w-6xl px-5 md:px-10">
          {currentTab && (
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 py-5">
              <IconX type={currentTab.icon} size={14} />
              <span className="text-sm font-medium">{currentTab.title}</span>
            </h2>
          )}
          <div className="pb-5">{children}</div>
        </div>
        <div className="flex-1" />
      </div>
      <Footer />
    </div>
  );
}
