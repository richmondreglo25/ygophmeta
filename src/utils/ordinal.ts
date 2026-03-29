import { OrdinalType } from "@/enums/ordinal-type";

/**
 * Returns the ordinal representation of a number (e.g., 1st, 2nd, 3rd, 4th).
 * @param n - The number to convert.
 * @param type - The type of ordinal representation to use (Simple or Grouped).
 * @returns {string} The ordinal representation of the number.
 */
export function getOrdinal(n: number, type: OrdinalType = OrdinalType.SIMPLE) {
  if (type === OrdinalType.GROUPED) {
    return getGroupedOrdinal(n);
  }

  // Simple ordinal (default)
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Returns the grouped ordinal representation of a number.
 * E.g., 1st, 2nd, 3rd - 4th, 5th-8th, 9th-16th, etc.
 * @param n - The number to convert.
 * @returns {string} The grouped ordinal representation of the number.
 */
function getGroupedOrdinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd - 4th";
  if (n === 4) return "3rd - 4th";
  if (n >= 5 && n <= 8) return "5th-8th";
  if (n >= 9 && n <= 16) return "9th-16th";
  if (n >= 17 && n <= 32) return "17th-32nd";
  if (n >= 33 && n <= 64) return "33rd-64th";
  if (n >= 65 && n <= 128) return "65th-128th";

  // For larger numbers, return simple ordinal
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
