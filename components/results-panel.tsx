"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle, Info } from "lucide-react"
import { usePlannerStore } from "@/lib/store"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResultsPanel() {
  const {
    getFreedomPercentage,
    getTotalExpenses,
    getTotalIncome,
    getRunwayMonths,
    getSafetyBuffer,
    isFinanciallyReady,
    getMonthlyDeficit,
    currency,
    resetAll,
    useBuffer,
    setUseBuffer,
    userSavings,
    setUserSavings,
    warChest,
    setWarChest,
  } = usePlannerStore()

  const freedomPercentage = getFreedomPercentage()
  const totalExpenses = getTotalExpenses()
  const totalIncome = getTotalIncome()
  const runwayMonths = getRunwayMonths()
  const safetyBuffer = getSafetyBuffer()
  const isReady = isFinanciallyReady()
  const monthlyDeficit = getMonthlyDeficit()

  const currencySymbols = {
    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
  }

  const getFreedomMessage = (percentage: number, deficit: number) => {
    if (deficit > 0) {
      if (deficit > totalExpenses * 0.5) return "Far from ready - major deficit 🚨"
      if (deficit > totalExpenses * 0.2) return "Not ready - significant deficit ⚠️"
      return "Close but not safe - small deficit 📉"
    }

    if (percentage >= 100) return "Financially ready to quit! 🎉"
    return "Ready but build more buffer 💪"
  }

  const getFreedomColor = (percentage: number, deficit: number) => {
    if (deficit > 0) {
      if (deficit > totalExpenses * 0.2) return "text-red-600"
      return "text-yellow-600"
    }
    return "text-green-600"
  }

  const getRunwayMessage = (months: number, deficit: number) => {
    if (deficit > 0) {
      if (months === 0) return "No runway - immediate danger 🚨"
      if (months <= 2) return `${months} months until broke 🚨`
      if (months <= 6) return `${months} months burn rate ⚠️`
      return `${months} months before savings depleted`
    } else {
      if (months <= 6) return `${months} months to emergency fund`
      if (months <= 12) return `${months} months to full buffer`
      return `${months}+ months - excellent position`
    }
  }

  const getRunwayColor = (months: number, deficit: number) => {
    if (deficit > 0) {
      if (months <= 2) return "text-red-600"
      if (months <= 6) return "text-red-500"
      return "text-yellow-600"
    } else {
      if (months <= 6) return "text-yellow-600"
      return "text-green-600"
    }
  }

  // Dynamic label for runway/timeline
  const runwayLabel = monthlyDeficit > 0 ? "Runway (Time Until Broke):" : "Runway (Months to Emergency Fund):"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-normal">📊 Results Panel</CardTitle>
          <Button variant="outline" size="sm" onClick={resetAll} className="flex items-center gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Startup Bro Settings */}
        <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 border rounded-lg p-6 mb-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="buffer-switch" className="text-sm font-medium flex items-center gap-1 mb-1">
              Add 25% safety buffer
              <span className="group relative inline-block">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                  Adds 25% to your expenses for unexpected costs. Only affects your required income to quit, not runway.
                </span>
              </span>
            </Label>
            <Switch id="buffer-switch" checked={useBuffer} onCheckedChange={setUseBuffer} className="mt-1" />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="savings-input" className="text-sm font-medium flex items-center gap-1 mb-1">
              Savings (runway override)
              <span className="group relative inline-block">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                  Enter your actual cash savings. Used only for runway calculation. If blank, defaults to 3× expenses.
                </span>
              </span>
            </Label>
            <Input
              id="savings-input"
              type="number"
              min={0}
              value={userSavings || ""}
              onChange={e => setUserSavings(Number(e.target.value) || 0)}
              className="w-full max-w-xs"
              placeholder="0"
            />
            <span className="text-xs text-gray-500">Default: 3x expenses if blank</span>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="warchest-input" className="text-sm font-medium flex items-center gap-1 mb-1">
              Monthly War Chest
              <span className="group relative inline-block">
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                  Extra monthly surplus goal for growth or reinvestment. Only affects your required income to quit, not runway.
                </span>
              </span>
            </Label>
            <Input
              id="warchest-input"
              type="number"
              min={0}
              value={warChest || ""}
              onChange={e => setWarChest(Number(e.target.value) || 0)}
              className="w-full max-w-xs"
              placeholder="0"
            />
            <span className="text-xs text-gray-500">Optional: extra surplus goal</span>
          </div>
        </div>

        {/* Summary Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border rounded-lg bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-2 py-1 text-left font-semibold">Metric</th>
                <th className="px-2 py-1 text-left font-semibold">Value</th>
                <th className="px-2 py-1 text-left font-normal">Explanation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1">Monthly Expenses</td>
                <td className="px-2 py-1">{currencySymbols[currency]}{totalExpenses.toLocaleString()}</td>
                <td className="px-2 py-1">Your total recurring monthly costs</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Safety Buffer</td>
                <td className="px-2 py-1">{currencySymbols[currency]}{safetyBuffer.toLocaleString()}</td>
                <td className="px-2 py-1">Extra 25% (if enabled) for unexpected costs</td>
              </tr>
              <tr>
                <td className="px-2 py-1">War Chest</td>
                <td className="px-2 py-1">{currencySymbols[currency]}{warChest.toLocaleString()}</td>
                <td className="px-2 py-1">Your extra monthly surplus goal</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-2 py-1 font-semibold">Freedom Number</td>
                <td className="px-2 py-1 font-semibold">{currencySymbols[currency]}{(totalExpenses + safetyBuffer + warChest).toLocaleString()}</td>
                <td className="px-2 py-1">Required monthly income to safely quit</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Current Income</td>
                <td className="px-2 py-1">{currencySymbols[currency]}{totalIncome.toLocaleString()}</td>
                <td className="px-2 py-1">All your income sources combined</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Deficit / Surplus</td>
                <td className="px-2 py-1">{currencySymbols[currency]}{(totalIncome - (totalExpenses + safetyBuffer + warChest)).toLocaleString()}</td>
                <td className="px-2 py-1">How much you need to add or have extra per month</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Savings Used</td>
                <td className="px-2 py-1">{currencySymbols[currency]}{(userSavings > 0 ? userSavings : totalExpenses * 3).toLocaleString()}</td>
                <td className="px-2 py-1">Used for runway calculation (defaults to 3× expenses)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-2 py-1 font-semibold">{runwayLabel}</td>
                <td className="px-2 py-1 font-semibold">{runwayMonths} months</td>
                <td className="px-2 py-1">How long you can last at your current burn</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Freedom Meter */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-3xl font-light">
              You are <span className="font-normal">{freedomPercentage}%</span> financially free
            </div>
            <div className={`text-lg ${getFreedomColor(freedomPercentage, monthlyDeficit)}`}>
              {getFreedomMessage(freedomPercentage, monthlyDeficit)}
            </div>
          </div>
          <Progress value={Math.min(freedomPercentage, 100)} className="h-3" />
        </div>

        {/* BRUTAL REALITY CHECK - Show when there's a deficit */}
        {monthlyDeficit > 0 && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-3">
              <AlertTriangle className="h-5 w-5" />🚨 FINANCIAL REALITY: YOU'RE LOSING MONEY
            </div>
            <div className="text-sm text-red-700 space-y-2">
              <div className="font-medium">
                Monthly Deficit: {currencySymbols[currency]}
                {monthlyDeficit.toLocaleString()}
              </div>
              <div>• You're spending MORE than you earn every month</div>
              <div>• This is NOT sustainable - you'll go broke</div>
              <div>• DO NOT quit your job with a monthly deficit</div>
              <div>• Increase income or cut expenses immediately</div>
            </div>
          </div>
        )}

        {/* Success message when truly ready */}
        {isReady && monthlyDeficit === 0 && (
          <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
            <div className="text-green-800 font-medium mb-2">✅ YOU'RE FINANCIALLY READY!</div>
            <div className="text-sm text-green-700 space-y-1">
              <div>• Income covers expenses + 25% safety buffer</div>
              <div>• You have a sustainable financial foundation</div>
              <div>• Consider building 3-6 more months runway</div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">Monthly Freedom Goal:</span>
            <span className="font-medium">
              {currencySymbols[currency]}
              {(totalExpenses + safetyBuffer + warChest).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">Current Income:</span>
            <span className="font-medium">
              {currencySymbols[currency]}
              {totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">Safety Buffer (25%):</span>
            <span className="font-medium">
              {currencySymbols[currency]}
              {safetyBuffer.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">{runwayLabel}</span>
            <span className={`font-medium ${getRunwayColor(runwayMonths, monthlyDeficit)}`}>
              {getRunwayMessage(runwayMonths, monthlyDeficit)}
            </span>
          </div>
        </div>

        {/* Honest Gap Analysis */}
        {totalExpenses > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium text-gray-800">📊 Financial Analysis</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                Monthly Expenses: {currencySymbols[currency]}
                {totalExpenses.toLocaleString()}
              </div>
              <div>
                Safety Buffer (25%): {currencySymbols[currency]}
                {safetyBuffer.toLocaleString()}
              </div>
              <div>
                Total Needed: {currencySymbols[currency]}
                {(totalExpenses + safetyBuffer).toLocaleString()}
              </div>
              <div>
                Current Income: {currencySymbols[currency]}
                {totalIncome.toLocaleString()}
              </div>
              <div className={monthlyDeficit === 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {monthlyDeficit === 0 ? "✅ SURPLUS" : "❌ DEFICIT"}: {currencySymbols[currency]}
                {monthlyDeficit === 0
                  ? (totalIncome - totalExpenses - safetyBuffer).toLocaleString()
                  : monthlyDeficit.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Action Items */}
        {monthlyDeficit > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">🎯 Action Plan to Fix This:</div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>
                1. Increase MRR by {currencySymbols[currency]}
                {Math.ceil(monthlyDeficit / 2).toLocaleString()}/month
              </div>
              <div>
                2. Cut expenses by {currencySymbols[currency]}
                {Math.floor(monthlyDeficit / 2).toLocaleString()}/month
              </div>
              <div>
                3. Build emergency fund of {currencySymbols[currency]}
                {(totalExpenses * 6).toLocaleString()}
              </div>
              <div>4. Only then consider quitting your job</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
