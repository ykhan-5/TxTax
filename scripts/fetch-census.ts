/**
 * Fetches population and median income data from the US Census ACS 5-Year API.
 * - County-level population and median income for all Texas counties
 * - State-level median income for Texas
 *
 * Outputs: src/data/census-data.json
 *
 * Usage: npx tsx scripts/fetch-census.ts
 *
 * Requires CENSUS_API_KEY in .env.local
 */

import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

// Load .env.local
config({ path: join(__dirname, "..", ".env.local") });

const API_KEY = process.env.CENSUS_API_KEY;
if (!API_KEY) {
  console.error("Error: CENSUS_API_KEY not found in .env.local");
  console.error("Get a free key at: https://api.census.gov/data/key_signup.html");
  process.exit(1);
}

const CENSUS_BASE = "https://api.census.gov/data/2022/acs/acs5";
const TX_FIPS = "48";

interface CountyCensus {
  countyFips: string;
  countyName: string;
  population: number;
  medianHouseholdIncome: number;
}

interface CensusOutput {
  generatedAt: string;
  stateMedianIncome: number;
  statePopulation: number;
  counties: Record<string, CountyCensus>;
}

async function fetchCountyData(): Promise<CountyCensus[]> {
  console.log("Fetching county population and income data...");

  // B01003_001E = Total population
  // B19013_001E = Median household income
  const url = `${CENSUS_BASE}?get=NAME,B01003_001E,B19013_001E&for=county:*&in=state:${TX_FIPS}&key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Census API error: ${res.status} ${res.statusText}`);
  }

  const data: string[][] = await res.json();
  // First row is headers: ["NAME", "B01003_001E", "B19013_001E", "state", "county"]
  const rows = data.slice(1);

  const counties: CountyCensus[] = [];
  for (const row of rows) {
    const name = row[0]; // "Travis County, Texas"
    const population = parseInt(row[1]) || 0;
    const income = parseInt(row[2]) || 0;
    const stateFips = row[3];
    const countyFips = row[4];

    // Extract just the county name (remove " County, Texas")
    const countyName = name.replace(/ County, Texas$/, "").trim();

    counties.push({
      countyFips: `${stateFips}${countyFips}`, // Full FIPS: "48453"
      countyName,
      population,
      medianHouseholdIncome: income,
    });
  }

  console.log(`  Fetched ${counties.length} counties`);
  return counties;
}

async function fetchStateMedianIncome(): Promise<{ income: number; population: number }> {
  console.log("Fetching Texas state median income...");

  const url = `${CENSUS_BASE}?get=B19013_001E,B01003_001E&for=state:${TX_FIPS}&key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Census API error: ${res.status} ${res.statusText}`);
  }

  const data: string[][] = await res.json();
  const row = data[1]; // Skip header
  const income = parseInt(row[0]) || 0;
  const population = parseInt(row[1]) || 0;

  console.log(`  State median income: $${income.toLocaleString()}`);
  console.log(`  State population: ${population.toLocaleString()}`);

  return { income, population };
}

async function main() {
  const counties = await fetchCountyData();
  const { income: stateMedianIncome, population: statePopulation } =
    await fetchStateMedianIncome();

  // Build output keyed by uppercase county name (to match Comptroller data)
  const countiesMap: Record<string, CountyCensus> = {};
  for (const county of counties) {
    countiesMap[county.countyName.toUpperCase()] = county;
  }

  const output: CensusOutput = {
    generatedAt: new Date().toISOString(),
    stateMedianIncome,
    statePopulation,
    counties: countiesMap,
  };

  const outDir = join(__dirname, "..", "src", "data");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "census-data.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`\nDone! Wrote ${counties.length} counties to ${outPath}`);

  // Show top 5 most populous counties
  const sorted = counties.sort((a, b) => b.population - a.population);
  console.log("\nTop 5 most populous counties:");
  for (const c of sorted.slice(0, 5)) {
    console.log(
      `  ${c.countyName}: ${c.population.toLocaleString()} people, $${c.medianHouseholdIncome.toLocaleString()} median income`
    );
  }
}

main().catch(console.error);
