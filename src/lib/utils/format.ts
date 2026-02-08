/**
 * Format a number as US currency (e.g., $4,847)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as currency with cents (e.g., $0.82)
 */
export function formatCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a large number with abbreviation (e.g., $4.2B, $523M)
 */
export function formatLargeNumber(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(amount);
}

/**
 * Format a percentage (e.g., 37.5%)
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format a number with commas (e.g., 4,700,000)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format a weird item value with appropriate precision
 * e.g., 2.7 days, 0.003 miles, 47 seconds
 */
export function formatWeirdValue(value: number): string {
  if (value >= 100) return Math.round(value).toLocaleString();
  if (value >= 10) return value.toFixed(1);
  if (value >= 1) return value.toFixed(1);
  if (value >= 0.01) return value.toFixed(2);
  return value.toFixed(3);
}
