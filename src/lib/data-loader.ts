/**
 * Data loading utilities
 * Handles reading and writing JSON data files
 */

import fs from "fs/promises";
import { PATHS } from "./constants";

/**
 * Generic data loader with type safety
 */
export async function loadJsonData<T>(filepath: string): Promise<T> {
  const data = await fs.readFile(filepath, "utf-8");
  return JSON.parse(data) as T;
}

/**
 * Generic data saver with type safety
 */
export async function saveJsonData<T>(
  filepath: string,
  data: T,
): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  await fs.writeFile(filepath, jsonString, "utf-8");
}

/**
 * Loads players data
 */
export async function loadPlayers() {
  return loadJsonData(PATHS.DATA.PLAYERS);
}

/**
 * Loads shops data
 */
export async function loadShops() {
  return loadJsonData(PATHS.DATA.SHOPS);
}

/**
 * Loads events data
 */
export async function loadEvents() {
  return loadJsonData(PATHS.DATA.EVENTS);
}

/**
 * Loads decks data
 */
export async function loadDecks() {
  return loadJsonData(PATHS.DATA.DECKS);
}

/**
 * Loads banlist data
 */
export async function loadBanlist() {
  return loadJsonData(PATHS.DATA.BANLIST);
}

/**
 * Safely checks if a file exists
 */
export async function fileExists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}
