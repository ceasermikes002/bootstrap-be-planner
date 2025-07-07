"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { usePlannerStore } from "@/lib/store"

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
            <span className="flex items-center gap-2">💡 Monthly Freedom Goal:</span>
            <span className="font-medium">
              {currencySymbols[currency]}
              {(totalExpenses + safetyBuffer).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">🎯 Current Income:</span>
            <span className="font-medium">
              {currencySymbols[currency]}
              {totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">🛡️ Safety Buffer (25%):</span>
            <span className="font-medium">
              {currencySymbols[currency]}
              {safetyBuffer.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              {monthlyDeficit > 0 ? "⏰ Time Until Broke:" : "🕒 Financial Timeline:"}
            </span>
            <span className={`font-medium ${getRunwayColor(runwayMonths, monthlyDeficit)}`}>
              {getRunwayMessage(runwayMonths, monthlyDeficit)}
            </span>
          </div>
        </div>

        {/* Honest Gap Analysis */}
        {totalExpenses > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium text-gray-800">📊 Brutal Financial Analysis</div>
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
