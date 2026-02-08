export type SpendingCategory =
  | "education"
  | "health"
  | "transportation"
  | "public_safety"
  | "other";

export interface CategorySpending {
  category: SpendingCategory;
  label: string;
  totalAmount: number;
  perCapita: number;
  percentage: number;
  color: string;
  subcategories: SubcategorySpending[];
}

export interface SubcategorySpending {
  name: string;
  amount: number;
  perCapita: number;
  percentage: number;
}

export interface WeirdItem {
  id: string;
  emoji: string;
  description: string;
  calculation: string;
  value: number;
  unit: string;
  dollarAmount: number;
  category: SpendingCategory;
}

export interface ZipSpendingResult {
  zipCode: string;
  countyName: string;
  countyFips: string;
  fiscalYear: string;
  population: number;
  medianIncome: number;
  stateMedianIncome: number;
  incomeMultiplier: number;
  estimatedPerCapitaTax: number;
  totalCountySpending: number;
  categories: CategorySpending[];
  weirdItems: WeirdItem[];
  metadata: {
    dataSource: string;
    lastUpdated: string;
    disclaimer: string;
  };
}

export interface ZipCountyEntry {
  zipCode: string;
  countyFips: string;
  countyName: string;
  residentialRatio: number;
  state: string;
}

export interface ComptrollerRecord {
  fiscal_year: string;
  agency_number: string;
  agency_name: string;
  major_spending_category: string;
  county?: string;
  amount: string;
}

export interface CensusData {
  population: number;
  medianHouseholdIncome: number;
  name: string;
}
