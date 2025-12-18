"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { getNavigationTabs } from "@/utils/navigation";
import { IconX } from "./IconX";

export function Navigation() {
  const pathname = usePathname();
  const tabs = getNavigationTabs();
  const isMobile = true;

  return (
    <div className="flex justify-center items-center px-3 py-2 border-b-[1px]">
      <NavigationMenu orientation={isMobile ? "vertical" : "horizontal"}>
        <NavigationMenuList className="flex-wrap">
          {tabs.map((tab) => {
            const isSelected = pathname === tab.path;
            return (
              <NavigationMenuItem key={tab.path}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link
                    className={`flex items-center gap-1.5 ${
                      isSelected ? " !text-blue-600" : ""
                    }`}
                    href={tab.path}
                  >
                    <IconX type={tab.icon} size={14} />
                    <span className="hidden sm:inline">{tab.title}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
