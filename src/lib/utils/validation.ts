/**
 * Texas ZIP code ranges:
 * 750-799 (most of Texas)
 * 733-738 (parts of Oklahoma border area assigned TX)
 * 885 (El Paso area, shares with NM)
 */
const TX_ZIP_PREFIXES = new Set([
  "750", "751", "752", "753", "754", "755", "756", "757", "758", "759",
  "760", "761", "762", "763", "764", "765", "766", "767", "768", "769",
  "770", "771", "772", "773", "774", "775", "776", "777", "778", "779",
  "780", "781", "782", "783", "784", "785", "786", "787", "788", "789",
  "790", "791", "792", "793", "794", "795", "796", "797", "798", "799",
  "733", "734", "735", "736", "737", "738",
  "885",
]);

/**
 * Check if a string is a valid 5-digit ZIP code format
 */
export function isValidZipFormat(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

/**
 * Check if a ZIP code is in Texas
 */
export function isTexasZip(zip: string): boolean {
  if (!isValidZipFormat(zip)) return false;
  const prefix = zip.substring(0, 3);
  return TX_ZIP_PREFIXES.has(prefix);
}

/**
 * Validate a ZIP code input as the user types (partial validation)
 */
export function validateZipInput(
  value: string
): { isValid: boolean; error: string | null } {
  if (value.length === 0) return { isValid: false, error: null };
  if (!/^\d*$/.test(value))
    return { isValid: false, error: "ZIP code must be numbers only" };
  if (value.length < 5) return { isValid: false, error: null };
  if (value.length > 5)
    return { isValid: false, error: "ZIP code must be 5 digits" };
  if (!isTexasZip(value))
    return { isValid: false, error: "Please enter a Texas ZIP code" };
  return { isValid: true, error: null };
}
