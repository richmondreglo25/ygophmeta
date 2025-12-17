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

export function Navigation() {
  const pathname = usePathname();
  const tabs = getNavigationTabs();
  const isMobile = true;

  return (
    <div className="flex justify-center items-center px-3 py-2 border-b-[0.5px]">
      <NavigationMenu orientation={isMobile ? "vertical" : "horizontal"}>
        <NavigationMenuList className="flex-wrap">
          {tabs.map((tab) => {
            // Determine if this tab is selected
            const isSelected = pathname === tab.path;
            return (
              <NavigationMenuItem key={tab.path}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link
                    className={isSelected ? " !text-blue-600" : ""}
                    href={tab.path}
                  >
                    {tab.title}
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
