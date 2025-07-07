import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Expenses {
  rent: number
  food: number
  transport: number
  subscriptions: number
  other: number
}

interface Income {
  mrr: number
  freelance: number
  passive: number
  salary: number
}

type Currency = "USD" | "NGN" | "GBP" | "EUR"

interface PlannerState {
  expenses: Expenses
  income: Income
  growthRate: number
  currency: Currency
  exchangeRates: Record<string, number>
  lastRateUpdate: number
  useBuffer: boolean
  userSavings: number
  warChest: number
  updateExpense: (key: keyof Expenses, value: number) => void
  updateIncome: (key: keyof Income, value: number) => void
  setGrowthRate: (rate: number) => void
  setCurrency: (currency: Currency) => void
  setExchangeRates: (rates: Record<string, number>) => void
  setUseBuffer: (use: boolean) => void
  setUserSavings: (amount: number) => void
  setWarChest: (amount: number) => void
  convertToCurrency: (targetCurrency: Currency) => Promise<void>
  getTotalExpenses: () => number
  getTotalIncome: () => number
  getFreedomPercentage: () => number
  getMonthsToFreedom: () => number
  getRunwayMonths: () => number
  hasValues: () => boolean
  getSafetyBuffer: () => number
  isFinanciallyReady: () => boolean
  getMonthlyDeficit: () => number
  resetAll: () => void
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      expenses: {
        rent: 0,
        food: 0,
        transport: 0,
        subscriptions: 0,
        other: 0,
      },
      income: {
        mrr: 0,
        freelance: 0,
        passive: 0,
        salary: 0,
      },
      growthRate: 10,
      currency: "USD",
      exchangeRates: {},
      lastRateUpdate: 0,
      useBuffer: true,
      userSavings: 0,
      warChest: 0,
      updateExpense: (key, value) =>
        set((state) => ({
          expenses: { ...state.expenses, [key]: value },
        })),
      updateIncome: (key, value) =>
        set((state) => ({
          income: { ...state.income, [key]: value },
        })),
      setGrowthRate: (rate) => set({ growthRate: rate }),
      setCurrency: (currency) => set({ currency }),
      setExchangeRates: (rates) =>
        set({
          exchangeRates: rates,
          lastRateUpdate: Date.now(),
        }),
      setUseBuffer: (use) => set({ useBuffer: use }),
      setUserSavings: (amount) => set({ userSavings: amount }),
      setWarChest: (amount) => set({ warChest: amount }),
      convertToCurrency: async (targetCurrency) => {
        const state = get()
        if (state.currency === targetCurrency) return

        try {
          const rates = await fetchExchangeRates(state.currency)
          const conversionRate = rates[targetCurrency]

          if (!conversionRate) throw new Error("Currency not supported")

          const newExpenses = Object.entries(state.expenses).reduce((acc, [key, value]) => {
            acc[key as keyof Expenses] = Math.round(value * conversionRate)
            return acc
          }, {} as Expenses)

          const newIncome = Object.entries(state.income).reduce((acc, [key, value]) => {
            acc[key as keyof Income] = Math.round(value * conversionRate)
            return acc
          }, {} as Income)

          set({
            expenses: newExpenses,
            income: newIncome,
            currency: targetCurrency,
            exchangeRates: rates,
            lastRateUpdate: Date.now(),
          })
        } catch (error) {
          console.error("Currency conversion failed:", error)
          throw error
        }
      },
      getTotalExpenses: () => {
        const { expenses } = get()
        return Object.values(expenses).reduce((sum, val) => sum + val, 0)
      },
      getTotalIncome: () => {
        const { income } = get()
        return Object.values(income).reduce((sum, val) => sum + val, 0)
      },
      getSafetyBuffer: () => {
        const totalExpenses = get().getTotalExpenses()
        const { useBuffer } = get()
        return useBuffer ? Math.round(totalExpenses * 0.25) : 0
      },
      getMonthlyDeficit: () => {
        const totalIncome = get().getTotalIncome()
        const totalExpenses = get().getTotalExpenses()
        const safetyBuffer = get().getSafetyBuffer()
        const warChest = get().warChest
        const trueFreedomNumber = totalExpenses + safetyBuffer + warChest
        return Math.max(0, trueFreedomNumber - totalIncome)
      },
      getFreedomPercentage: () => {
        const totalIncome = get().getTotalIncome()
        const totalExpenses = get().getTotalExpenses()
        const safetyBuffer = get().getSafetyBuffer()
        const warChest = get().warChest
        const trueFreedomNumber = totalExpenses + safetyBuffer + warChest
        if (trueFreedomNumber === 0) return 0
        const percentage = Math.round((totalIncome / trueFreedomNumber) * 100)
        return percentage
      },
      isFinanciallyReady: () => {
        const deficit = get().getMonthlyDeficit()
        return deficit === 0
      },
      getMonthsToFreedom: () => {
        const { income, growthRate } = get()
        const totalExpenses = get().getTotalExpenses()
        const safetyBuffer = get().getSafetyBuffer()
        const warChest = get().warChest
        const currentIncome = get().getTotalIncome()
        const trueFreedomTarget = totalExpenses + safetyBuffer + warChest
        if (currentIncome >= trueFreedomTarget) return 0
        if (trueFreedomTarget === 0) return 0
        if (growthRate === 0) return Number.POSITIVE_INFINITY
        if (currentIncome === 0) return Number.POSITIVE_INFINITY
        const currentMRR = income.mrr
        const staticIncome = income.freelance + income.passive + income.salary
        if (staticIncome >= trueFreedomTarget) return 0
        const neededMRRGrowth = trueFreedomTarget - staticIncome
        if (currentMRR >= neededMRRGrowth) return 0
        if (currentMRR === 0) return Number.POSITIVE_INFINITY
        const monthlyGrowthRate = growthRate / 100
        const months = Math.log(neededMRRGrowth / currentMRR) / Math.log(1 + monthlyGrowthRate)
        return Math.min(Math.ceil(Math.max(0, months)), 120)
      },
      getRunwayMonths: () => {
        const totalIncome = get().getTotalIncome()
        const totalExpenses = get().getTotalExpenses()
        const deficit = get().getMonthlyDeficit()
        const userSavings = get().userSavings
        const assumedSavings = userSavings > 0 ? userSavings : totalExpenses * 3
        if (totalExpenses === 0) return 0
        if (totalIncome === 0) return 0
        if (deficit > 0) {
          const monthlyBurn = deficit
          const runwayMonths = Math.floor(assumedSavings / monthlyBurn)
          return Math.max(0, runwayMonths)
        } else {
          const monthlySurplus = totalIncome - totalExpenses
          const emergencyFundTarget = totalExpenses * 6
          if (monthlySurplus <= 0) return 0
          return Math.ceil(emergencyFundTarget / monthlySurplus)
        }
      },
      hasValues: () => {
        const state = get()
        const totalExpenses = state.getTotalExpenses()
        const totalIncome = state.getTotalIncome()
        return totalExpenses > 0 || totalIncome > 0
      },
      resetAll: () => {
        set({
          expenses: {
            rent: 0,
            food: 0,
            transport: 0,
            subscriptions: 0,
            other: 0,
          },
          income: {
            mrr: 0,
            freelance: 0,
            passive: 0,
            salary: 0,
          },
          growthRate: 10,
          useBuffer: true,
          userSavings: 0,
          warChest: 0,
        })
      },
    }),
    {
      name: "bootstrap-planner-storage",
    },
  ),
)

// Currency conversion utility
async function fetchExchangeRates(baseCurrency: Currency): Promise<Record<string, number>> {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const data = await response.json()
    return data.rates
  } catch (error) {
    const fallbackRates: Record<Currency, Record<string, number>> = {
      USD: { NGN: 800, GBP: 0.79, EUR: 0.85, USD: 1 },
      NGN: { USD: 0.00125, GBP: 0.00099, EUR: 0.00106, NGN: 1 },
      GBP: { USD: 1.27, NGN: 1010, EUR: 1.08, GBP: 1 },
      EUR: { USD: 1.18, NGN: 944, GBP: 0.93, EUR: 1 },
    }

    console.warn("Using fallback exchange rates")
    return fallbackRates[baseCurrency] || fallbackRates.USD
  }
}
