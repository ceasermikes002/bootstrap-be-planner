/**
 * Calculate months to reach financial freedom using compound growth
 * @param currentIncome - Current total monthly income
 * @param freedomNumber - Target monthly income needed (expenses)
 * @param monthlyGrowthRate - Monthly growth rate as decimal (e.g., 0.10 for 10%)
 * @returns Number of months to reach freedom, or Infinity if impossible
 */
export function calculateMonthsToBreakEven(
  currentIncome: number,
  freedomNumber: number,
  monthlyGrowthRate: number,
): number {
  // Edge cases
  if (currentIncome >= freedomNumber) return 0
  if (freedomNumber <= 0) return 0
  if (monthlyGrowthRate <= 0) return Number.POSITIVE_INFINITY
  if (currentIncome <= 0) return Number.POSITIVE_INFINITY

  // Compound growth formula: n = log(target/current) / log(1 + rate)
  const months = Math.log(freedomNumber / currentIncome) / Math.log(1 + monthlyGrowthRate)

  // Return reasonable timeframe (cap at 10 years)
  return Math.min(Math.ceil(Math.max(0, months)), 120)
}

/**
 * Generate month-by-month income projection
 * @param initialIncome - Starting income
 * @param monthlyGrowthRate - Growth rate as decimal
 * @param months - Number of months to project
 * @returns Array of monthly income values
 */
export function generateIncomeProjection(initialIncome: number, monthlyGrowthRate: number, months: number): number[] {
  const projection = []
  let currentIncome = initialIncome

  for (let i = 0; i <= months; i++) {
    projection.push(Math.round(currentIncome))
    currentIncome *= 1 + monthlyGrowthRate
  }

  return projection
}

/**
 * Format currency for display
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}k`
  }
  return `$${amount.toLocaleString()}`
}
