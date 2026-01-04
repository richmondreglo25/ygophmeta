/**
 * Converts a singular English noun to its plural form.
 * Handles common cases (not all irregulars).
 * @param word The singular word to pluralize.
 * @param capitalizeFirst If true, returns the plural with the first letter uppercase.
 */
export function pluralize(
  word: string,
  capitalizeFirst: boolean = false
): string {
  if (!word) return word;

  const lower = word.toLowerCase();

  let plural: string;
  // Words ending with s, x, z, ch, sh -> add "es"
  if (/(s|x|z|ch|sh)$/i.test(lower)) {
    plural = word + "es";
  }
  // Words ending with y preceded by a consonant -> replace y with ies
  else if (/[bcdfghjklmnpqrstvwxyz]y$/i.test(lower)) {
    plural = word.slice(0, -1) + "ies";
  }
  // Default: just add "s"
  else {
    plural = word + "s";
  }

  if (capitalizeFirst) {
    return plural.charAt(0).toUpperCase() + plural.slice(1);
  }
  return plural;
}
