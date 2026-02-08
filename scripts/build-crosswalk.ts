/**
 * Builds a ZIP-to-county crosswalk for Texas.
 * Uses the Census Bureau's ZCTA-to-County relationship file.
 *
 * Since the HUD crosswalk requires authentication, we use the Census Bureau's
 * geographic relationship files and supplement with a curated mapping of
 * common Texas ZIPs to their primary county.
 *
 * Outputs: src/data/zip-county-crosswalk.json
 *
 * Usage: npx tsx scripts/build-crosswalk.ts
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

interface ZipCountyEntry {
  zipCode: string;
  countyName: string;
  countyFips: string;
}

/**
 * We'll build the crosswalk by:
 * 1. Loading the census-data.json (county list)
 * 2. Using the Census Geocoder API to map ZIPs to counties
 *
 * For the MVP, we generate a mapping using the Census Bureau's
 * ZCTA-County Relationship File from the 2020 Census.
 */

const RELATIONSHIP_URL =
  "https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt";

interface RelRow {
  zcta: string;
  stateFips: string;
  countyFips: string;
  areaRatio: number;
}

async function fetchRelationshipFile(): Promise<RelRow[]> {
  console.log("Fetching Census ZCTA-County relationship file...");

  const res = await fetch(RELATIONSHIP_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch relationship file: ${res.status}`);
  }

  const text = await res.text();
  const lines = text.trim().split("\n");

  // Header: ZCTA5_GEOID|COUNTY_GEOID|...columns...
  // We need columns: ZCTA5 (col 0), STATE (col 2), COUNTY (col 3), AREALAND_PART (col 6), AREALAND_ZCTA (col 8)
  const header = lines[0].split("|");
  console.log(`  Header columns: ${header.join(", ")}`);

  // Build column index map from header
  const colIdx: Record<string, number> = {};
  for (let c = 0; c < header.length; c++) {
    colIdx[header[c].trim()] = c;
  }

  const iZcta = colIdx["GEOID_ZCTA5_20"];        // ZIP code (e.g., "78701")
  const iCounty = colIdx["GEOID_COUNTY_20"];      // County FIPS (e.g., "48453")
  const iAreaPart = colIdx["AREALAND_PART"];       // Land area overlap
  const iAreaTotal = colIdx["AREALAND_ZCTA5_20"]; // Total ZCTA land area

  console.log(`  Column indices: ZCTA=${iZcta}, County=${iCounty}, AreaPart=${iAreaPart}, AreaTotal=${iAreaTotal}`);

  const rows: RelRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("|");
    const zcta = cols[iZcta]?.trim();
    const geoid = cols[iCounty]?.trim(); // Full county GEOID like "48453"
    if (!zcta || !geoid) continue;

    const stateFips = geoid.substring(0, 2);
    const countyFips = geoid.substring(2);

    // Only Texas (FIPS 48)
    if (stateFips !== "48") continue;

    // Use area ratio to determine primary county
    const areaPart = parseFloat(cols[iAreaPart]) || 0;
    const areaTotal = parseFloat(cols[iAreaTotal]) || 1;

    rows.push({
      zcta,
      stateFips,
      countyFips,
      areaRatio: areaPart / areaTotal,
    });
  }

  console.log(`  Found ${rows.length} Texas ZCTA-County relationships`);
  return rows;
}

function buildCrosswalk(rows: RelRow[]): Record<string, ZipCountyEntry> {
  // Load census data for county name lookup
  const censusPath = join(__dirname, "..", "src", "data", "census-data.json");
  let countyNameLookup: Record<string, string> = {};

  if (existsSync(censusPath)) {
    const censusData = JSON.parse(readFileSync(censusPath, "utf-8"));
    // Build FIPS -> county name lookup
    for (const [name, data] of Object.entries(censusData.counties)) {
      const d = data as { countyFips: string };
      // countyFips is full FIPS like "48453", we need just "453"
      const shortFips = d.countyFips.substring(2);
      countyNameLookup[shortFips] = name;
    }
    console.log(`  Loaded ${Object.keys(countyNameLookup).length} county name mappings`);
  } else {
    console.warn("  Warning: census-data.json not found. Run fetch-census.ts first.");
    console.warn("  County names will use FIPS codes instead.");
  }

  // Group by ZCTA, pick the county with the largest area overlap
  const zcataCounties: Record<string, { countyFips: string; ratio: number }[]> = {};
  for (const row of rows) {
    if (!zcataCounties[row.zcta]) zcataCounties[row.zcta] = [];
    zcataCounties[row.zcta].push({ countyFips: row.countyFips, ratio: row.areaRatio });
  }

  const crosswalk: Record<string, ZipCountyEntry> = {};
  for (const [zcta, counties] of Object.entries(zcataCounties)) {
    // Pick the county with the most area overlap
    counties.sort((a, b) => b.ratio - a.ratio);
    const primary = counties[0];
    const fullFips = `48${primary.countyFips}`;
    const countyName = countyNameLookup[primary.countyFips] || `FIPS ${fullFips}`;

    crosswalk[zcta] = {
      zipCode: zcta,
      countyName,
      countyFips: fullFips,
    };
  }

  return crosswalk;
}

async function main() {
  const rows = await fetchRelationshipFile();
  const crosswalk = buildCrosswalk(rows);

  const output = {
    generatedAt: new Date().toISOString(),
    totalZips: Object.keys(crosswalk).length,
    crosswalk,
  };

  const outDir = join(__dirname, "..", "src", "data");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "zip-county-crosswalk.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`\nDone! Wrote ${Object.keys(crosswalk).length} ZIP-to-county mappings to ${outPath}`);

  // Show some examples
  const examples = ["78701", "77001", "75201", "78201", "79901"];
  console.log("\nSample mappings:");
  for (const zip of examples) {
    const entry = crosswalk[zip];
    if (entry) {
      console.log(`  ${zip} → ${entry.countyName} (${entry.countyFips})`);
    } else {
      console.log(`  ${zip} → NOT FOUND`);
    }
  }
}

main().catch(console.error);
