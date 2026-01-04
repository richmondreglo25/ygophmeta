import { NavigationTab } from "@/types/navigation";

// App navigation tabs.
const tabs: NavigationTab[] = [
  { title: "Home", path: "/", icon: "home" },
  { title: "Events", path: "/events", icon: "calendar" },
  { title: "Meta", path: "/meta", icon: "chart" },
  { title: "Shops", path: "/shops", icon: "shops" },
  { title: "Community", path: "/community", icon: "community" },
  { title: "Banlist", path: "/banlist", icon: "banlist" },
  { title: "About", path: "/about", icon: "info" },
];

/**
 * Get the navigation tabs.
 * @returns {NavigationTab[]} Array of navigation tab objects.
 */
export function getNavigationTabs() {
  return tabs;
}

/**
 * Get a navigation tab by its nav identifier.
 * @param {string} nav - The navigation identifier.
 * @returns {NavigationTab | undefined} The matching navigation tab or undefined if not found.
 */
export function getTabByPath(path: string) {
  return tabs.find((tab) => tab.path === path);
}
