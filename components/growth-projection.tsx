"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { usePlannerStore } from "@/lib/store"
import { useMemo } from "react"

export function GrowthProjection() {
  const {
    growthRate,
    setGrowthRate,
    getMonthsToFreedom,
    getTotalExpenses,
    getTotalIncome,
    getSafetyBuffer,
    isFinanciallyReady,
    getMonthlyDeficit,
    income,
    currency,
  } = usePlannerStore()

  const monthsToFreedom = getMonthsToFreedom()
  const totalExpenses = getTotalExpenses()
  const currentIncome = getTotalIncome()
  const safetyBuffer = getSafetyBuffer()
  const isReady = isFinanciallyReady()
  const monthlyDeficit = getMonthlyDeficit()

  const currencySymbols = {
    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
  }

  // Generate realistic chart data with safety buffer
  const chartData = useMemo(() => {
    const data = []
    let currentMRR = income.mrr
    const staticIncome = income.freelance + income.passive + income.salary
    const monthlyGrowthRate = growthRate / 100
    const trueFreedomTarget = totalExpenses + safetyBuffer

    const maxMonths = Math.min(24, monthsToFreedom > 0 ? monthsToFreedom + 3 : 12)

    for (let month = 0; month <= maxMonths; month++) {
      const totalIncome = currentMRR + staticIncome
      data.push({
        month,
        monthLabel: month === 0 ? "Now" : `M${month}`,
        income: Math.round(totalIncome),
        expenses: totalExpenses,
        safetyTarget: trueFreedomTarget,
        mrr: Math.round(currentMRR),
        breakEvenReached: totalIncome >= trueFreedomTarget,
      })

      if (month < maxMonths) {
        currentMRR *= 1 + monthlyGrowthRate
      }
    }
    return data
  }, [income, growthRate, totalExpenses, safetyBuffer, monthsToFreedom])

  const getFreedomMessage = () => {
    if (monthlyDeficit > 0) {
      return {
        text: `Fix ${currencySymbols[currency]}${monthlyDeficit.toLocaleString()} deficit first! 🚨`,
        color: "text-red-600",
      }
    }

    if (isReady) {
      return { text: "You're financially ready! 🎉", color: "text-green-600" }
    }

    if (monthsToFreedom === Number.POSITIVE_INFINITY || monthsToFreedom > 120) {
      return { text: "Need higher growth rate or more MRR", color: "text-red-600" }
    }

    if (monthsToFreedom <= 6) {
      return { text: `${monthsToFreedom} months to safety! 🚀`, color: "text-green-600" }
    }

    if (monthsToFreedom <= 12) {
      return { text: `${monthsToFreedom} months to go 💪`, color: "text-yellow-600" }
    }

    return { text: `${monthsToFreedom} months (${Math.round(monthsToFreedom / 12)} years)`, color: "text-blue-600" }
  }

  const freedomMessage = getFreedomMessage()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-normal">📈 Growth Projection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Growth Rate Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Monthly MRR Growth Rate:</span>
            <span className="font-medium">{growthRate}%</span>
          </div>
          <Slider
            value={[growthRate]}
            onValueChange={(value) => setGrowthRate(value[0])}
            max={30}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">
            Realistic range: 5-15% for established products, 15-30% for early growth
          </div>
        </div>

        {/* Time to Freedom */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">⏳ Financial Status:</div>
          <div className={`text-2xl font-light ${freedomMessage.color}`}>{freedomMessage.text}</div>
          {monthlyDeficit === 0 && income.mrr > 0 && monthsToFreedom > 0 && monthsToFreedom < 120 && (
            <div className="text-xs text-gray-500 mt-2">
              Target includes 25% safety buffer: {currencySymbols[currency]}
              {(totalExpenses + safetyBuffer).toLocaleString()}/month
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="space-y-2">
          <div className="text-sm font-medium">📊 Income Growth vs Safety Target</div>
          <div className="w-full h-[250px]">
            <ChartContainer
              config={{
                income: {
                  label: "Total Income",
                  color: "hsl(142, 76%, 36%)",
                },
                expenses: {
                  label: "Basic Expenses",
                  color: "hsl(0, 84%, 60%)",
                },
                safetyTarget: {
                  label: "Safety Target",
                  color: "hsl(25, 95%, 53%)",
                },
                mrr: {
                  label: "MRR Only",
                  color: "hsl(217, 91%, 60%)",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `${currencySymbols[currency]}${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${currencySymbols[currency]}${Number(value).toLocaleString()}`,
                          name,
                        ]}
                      />
                    }
                  />

                  {/* Basic expenses line */}
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="var(--color-expenses)"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    name="Basic Expenses"
                    dot={false}
                  />

                  {/* Safety target line */}
                  <Line
                    type="monotone"
                    dataKey="safetyTarget"
                    stroke="var(--color-safetyTarget)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    name="Safety Target"
                    dot={false}
                  />

                  {/* Total income line */}
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="var(--color-income)"
                    strokeWidth={3}
                    name="Total Income"
                    dot={{ fill: "var(--color-income)", strokeWidth: 2, r: 3 }}
                  />

                  {/* MRR only line */}
                  <Line
                    type="monotone"
                    dataKey="mrr"
                    stroke="var(--color-mrr)"
                    strokeWidth={2}
                    name="MRR Only"
                    dot={false}
                    opacity={0.7}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-600"></div>
              <span>Total Income</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-orange-500 opacity-60" style={{ borderTop: "2px dashed" }}></div>
              <span>Safety Target</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-red-500 opacity-60" style={{ borderTop: "2px dashed" }}></div>
              <span>Basic Expenses</span>
            </div>
          </div>
        </div>

        {/* BRUTAL HONESTY - Don't sugarcoat deficits */}
        {monthlyDeficit > 0 && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium text-red-800">🚨 STOP: You Have a Monthly Deficit</div>
            <div className="text-xs text-red-700 space-y-1">
              <div>
                • You're losing {currencySymbols[currency]}
                {monthlyDeficit.toLocaleString()} every month
              </div>
              <div>• Growth projections are meaningless with a deficit</div>
              <div>• Fix your cash flow before planning to quit</div>
              <div>• Increase MRR or cut expenses immediately</div>
            </div>
          </div>
        )}

        {/* Success Insights - Only show when actually ready */}
        {isReady && monthlyDeficit === 0 && (
          <div className="bg-green-50 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium text-green-800">✅ You're Ready! Next Steps:</div>
            <div className="text-xs text-green-700 space-y-1">
              <div>• You have sufficient income + safety buffer</div>
              <div>• Consider building 3-6 more months of runway</div>
              <div>• Plan your transition timeline carefully</div>
              <div>• Keep growing MRR for long-term security</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
