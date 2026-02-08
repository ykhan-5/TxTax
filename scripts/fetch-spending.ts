/**
 * Fetches Texas state expenditure data from the Comptroller's SODA API (data.texas.gov).
 * Groups spending by county and agency, then maps agencies to our 5 display categories.
 * Outputs: src/data/spending-by-county.json
 *
 * Usage: npx tsx scripts/fetch-spending.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// Dataset ID for FY2022 expenditures by county
const DATASET_ID = "xys8-xb33";
const BASE_URL = `https://data.texas.gov/resource/${DATASET_ID}.json`;
const PAGE_SIZE = 50000;

// Agency-to-category mapping (duplicated here to avoid importing from src with path aliases)
type SpendingCategory =
  | "education"
  | "health"
  | "transportation"
  | "public_safety"
  | "other";

const AGENCY_CATEGORY: Record<string, SpendingCategory> = {
  // Education
  "701": "education",
  "710": "education", "713": "education", "714": "education", "715": "education",
  "716": "education", "717": "education", "718": "education", "719": "education",
  "720": "education", "721": "education", "723": "education", "724": "education",
  "726": "education", "727": "education", "728": "education", "729": "education",
  "730": "education", "731": "education", "733": "education", "734": "education",
  "735": "education", "736": "education", "737": "education", "738": "education",
  "739": "education", "742": "education", "743": "education", "744": "education",
  "745": "education", "747": "education", "749": "education", "750": "education",
  "751": "education", "752": "education", "753": "education", "754": "education",
  "756": "education", "757": "education", "758": "education", "759": "education",
  "760": "education", "761": "education", "763": "education", "764": "education",
  "765": "education", "769": "education", "770": "education", "771": "education",
  "772": "education", "773": "education", "774": "education", "775": "education",
  "781": "education", "783": "education", "784": "education", "785": "education",
  "787": "education", "788": "education", "789": "education",
  // Health
  "503": "health", "504": "health", "507": "health", "508": "health",
  "510": "health", "512": "health", "514": "health", "515": "health",
  "520": "health", "529": "health", "530": "health", "537": "health",
  "538": "health", "539": "health", "542": "health",
  // Transportation
  "601": "transportation", "608": "transportation",
  // Public Safety
  "401": "public_safety", "403": "public_safety", "405": "public_safety",
  "407": "public_safety", "409": "public_safety", "454": "public_safety",
  "644": "public_safety", "696": "public_safety",
};

function getCategory(agencyNumber: string): SpendingCategory {
  return AGENCY_CATEGORY[agencyNumber] ?? "other";
}

interface RawRecord {
  fiscal_year: string;
  agency_number: string;
  agency_name: string;
  county?: string;
  major_spending_category: string;
  amount: string;
}

interface CountySpending {
  county: string;
  totalSpending: number;
  byCategory: Record<SpendingCategory, number>;
  byAgency: Record<string, { name: string; amount: number; category: SpendingCategory }>;
  byExpenditureType: Record<string, number>;
}

async function fetchAllRecords(): Promise<RawRecord[]> {
  const allRecords: RawRecord[] = [];
  let offset = 0;
  let hasMore = true;

  console.log("Fetching expenditure data from data.texas.gov...");

  while (hasMore) {
    const url = `${BASE_URL}?$limit=${PAGE_SIZE}&$offset=${offset}&$where=county IS NOT NULL`;
    console.log(`  Fetching offset ${offset}...`);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const records: RawRecord[] = await res.json();
    allRecords.push(...records);

    if (records.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      offset += PAGE_SIZE;
    }
  }

  console.log(`  Total records fetched: ${allRecords.length}`);
  return allRecords;
}

function aggregateByCounty(records: RawRecord[]): Record<string, CountySpending> {
  const counties: Record<string, CountySpending> = {};

  for (const record of records) {
    const county = record.county?.trim().toUpperCase();
    if (!county) continue;

    const amount = parseFloat(record.amount) || 0;
    if (amount <= 0) continue;

    const category = getCategory(record.agency_number);

    if (!counties[county]) {
      counties[county] = {
        county,
        totalSpending: 0,
        byCategory: {
          education: 0,
          health: 0,
          transportation: 0,
          public_safety: 0,
          other: 0,
        },
        byAgency: {},
        byExpenditureType: {},
      };
    }

    const c = counties[county];
    c.totalSpending += amount;
    c.byCategory[category] += amount;

    // Track by agency for subcategory breakdown
    const agencyKey = record.agency_number;
    if (!c.byAgency[agencyKey]) {
      c.byAgency[agencyKey] = {
        name: record.agency_name,
        amount: 0,
        category,
      };
    }
    c.byAgency[agencyKey].amount += amount;

    // Track by expenditure type
    const expType = record.major_spending_category;
    c.byExpenditureType[expType] = (c.byExpenditureType[expType] || 0) + amount;
  }

  return counties;
}

async function main() {
  const records = await fetchAllRecords();
  const counties = aggregateByCounty(records);

  // Determine fiscal year from data
  const fiscalYear = records[0]?.fiscal_year || "2022";

  const output = {
    fiscalYear,
    generatedAt: new Date().toISOString(),
    totalCounties: Object.keys(counties).length,
    counties,
  };

  // Write to src/data/
  const outDir = join(__dirname, "..", "src", "data");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "spending-by-county.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`\nDone! Wrote ${Object.keys(counties).length} counties to ${outPath}`);

  // Print summary
  const totalSpending = Object.values(counties).reduce(
    (sum, c) => sum + c.totalSpending,
    0
  );
  console.log(`Total state spending (county-allocated): $${(totalSpending / 1e9).toFixed(2)}B`);

  // Top 5 counties by spending
  const sorted = Object.values(counties).sort(
    (a, b) => b.totalSpending - a.totalSpending
  );
  console.log("\nTop 5 counties by spending:");
  for (const c of sorted.slice(0, 5)) {
    console.log(`  ${c.county}: $${(c.totalSpending / 1e9).toFixed(2)}B`);
  }
}

main().catch(console.error);
