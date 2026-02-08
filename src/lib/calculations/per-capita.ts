import type { ZipSpendingResult, SpendingCategory } from "@/lib/types/spending";
import {
  getCountyForZip,
  getCountySpending,
  getCountyCensus,
  getStateMedianIncome,
  buildCategoryBreakdown,
} from "@/lib/data/spending";
import { generateWeirdItems } from "@/lib/data/weird-items";

/**
 * Main calculation pipeline:
 *
 * ZIP → County (crosswalk)
 *   → County spending by agency (Comptroller data)
 *   → Map agencies → 5 categories
 *   → County population (Census)
 *   → Per-capita = total / population
 *   → Adjust by income multiplier (ZIP median / state median)
 *   → Generate weird items
 */
export async function calculateSpending(
  zipCode: string
): Promise<ZipSpendingResult | null> {
  // 1. Look up county for this ZIP
  const countyInfo = await getCountyForZip(zipCode);
  if (!countyInfo) return null;

  // 2. Get county spending data
  const spending = await getCountySpending(countyInfo.countyName);
  if (!spending) return null;

  // 3. Get county census data (population + income)
  const census = await getCountyCensus(countyInfo.countyName);
  if (!census || census.population === 0) return null;

  // 4. Get state median income for multiplier
  const stateMedian = await getStateMedianIncome();

  // 5. Calculate income multiplier
  // ZIP-level income data isn't available without ZCTA queries, so
  // we use the county median income as a proxy for now.
  // In a future version, we could fetch ZCTA-level income from Census.
  const incomeMultiplier =
    stateMedian > 0 ? census.medianHouseholdIncome / stateMedian : 1;

  // 6. Calculate base per-capita (county spending / county population)
  const basePerCapita = spending.totalSpending / census.population;

  // 7. Adjust by income multiplier
  const adjustedPerCapita = Math.round(basePerCapita * incomeMultiplier);

  // 8. Build category breakdown (adjusted proportionally)
  const categories = buildCategoryBreakdown(
    spending.byCategory,
    spending.byAgency,
    census.population
  );

  // Adjust per-capita amounts by income multiplier
  for (const cat of categories) {
    cat.perCapita = Math.round(cat.perCapita * incomeMultiplier);
    for (const sub of cat.subcategories) {
      sub.perCapita = Math.round(sub.perCapita * incomeMultiplier);
    }
  }

  // 9. Generate weird/fun items from per-capita category amounts
  const categoryPerCapita: Record<SpendingCategory, number> = {
    education: 0,
    health: 0,
    transportation: 0,
    public_safety: 0,
    other: 0,
  };
  for (const cat of categories) {
    categoryPerCapita[cat.category] = cat.perCapita;
  }
  const weirdItems = generateWeirdItems(categoryPerCapita);

  // Title case county name (data stores as UPPERCASE)
  const displayCountyName = countyInfo.countyName
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return {
    zipCode,
    countyName: displayCountyName,
    countyFips: countyInfo.countyFips,
    fiscalYear: spending.fiscalYear,
    population: census.population,
    medianIncome: census.medianHouseholdIncome,
    stateMedianIncome: stateMedian,
    incomeMultiplier: Math.round(incomeMultiplier * 100) / 100,
    estimatedPerCapitaTax: adjustedPerCapita,
    totalCountySpending: spending.totalSpending,
    categories,
    weirdItems,
    metadata: {
      dataSource: "Texas Comptroller of Public Accounts, U.S. Census Bureau ACS 5-Year",
      lastUpdated: new Date().toISOString().split("T")[0],
      disclaimer:
        "This is an estimate based on county-level averages and median household income. Actual tax burden varies by individual income, spending habits, and property ownership.",
    },
  };
}
