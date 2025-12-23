/**
 * Returns the ordinal representation of a number (e.g., 1st, 2nd, 3rd, 4th).
 * @param n - The number to convert.
 * @returns {string} The ordinal representation of the number.
 */
export function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
