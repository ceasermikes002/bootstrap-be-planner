"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { usePlannerStore } from "@/lib/store"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"

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
    useBuffer,
    warChest,
    userSavings,
  } = usePlannerStore()

  // Advanced: Expense growth rate (optional)
  const [expenseGrowthRate, setExpenseGrowthRate] = useState(0)

  const monthsToFreedom = getMonthsToFreedom()
  const totalExpenses = getTotalExpenses()
  const currentIncome = getTotalIncome()
  const safetyBuffer = useBuffer ? Math.round(totalExpenses * 0.25) : 0
  const isReady = isFinanciallyReady()
  const monthlyDeficit = getMonthlyDeficit()

  const currencySymbols = {
    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
  }

  // Generate realistic chart data with safety buffer, war chest, buffer toggle, and optional expense growth
  const chartData = useMemo(() => {
    const data = []
    let currentMRR = income.mrr
    const staticIncome = income.freelance + income.passive + income.salary
    const monthlyGrowthRate = growthRate / 100
    let totalExpenses = getTotalExpenses()
    const safetyBuffer = useBuffer ? Math.round(totalExpenses * 0.25) : 0
    const trueFreedomTarget = totalExpenses + safetyBuffer + warChest
    const maxMonths = Math.min(24, monthsToFreedom > 0 ? monthsToFreedom + 3 : 12)
    const expenseGrowth = expenseGrowthRate / 100
    for (let month = 0; month <= maxMonths; month++) {
      const totalIncome = currentMRR + staticIncome
      data.push({
        month,
        monthLabel: month === 0 ? "Now" : `M${month}`,
        income: Math.round(totalIncome),
        expenses: Math.round(totalExpenses),
        safetyTarget: Math.round(totalExpenses + (useBuffer ? totalExpenses * 0.25 : 0) + warChest),
        mrr: Math.round(currentMRR),
        breakEvenReached: totalIncome >= trueFreedomTarget,
      })
      if (month < maxMonths) {
        currentMRR *= 1 + monthlyGrowthRate
        totalExpenses *= 1 + expenseGrowth // Apply expense growth if set
      }
    }
    return data
  }, [income, growthRate, getTotalExpenses, useBuffer, warChest, monthsToFreedom, expenseGrowthRate])

  // Warnings for chart
  const staticIncome = income.freelance + income.passive + income.salary
  const mrrWarning = income.mrr === 0
  const staticWarning = staticIncome > 0 && income.mrr > 0 && staticIncome > income.mrr * 3

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

  // Find the first month where income crosses the safety target
  const freedomPoint = chartData.find((d) => d.income >= d.safetyTarget)
  const nowPoint = chartData[0]

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

        {/* Advanced: Expense Growth Rate */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-600">Expense Growth Rate (optional):</span>
          <Input
            type="number"
            min={0}
            max={20}
            step={0.1}
            value={expenseGrowthRate}
            onChange={e => setExpenseGrowthRate(Number(e.target.value) || 0)}
            className="w-20 h-7 text-xs"
            placeholder="0%"
          />
          <span className="text-xs text-gray-400">% per month</span>
        </div>

        {/* Chart Warnings */}
        {mrrWarning && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded p-2 mb-2">
            Add MRR to see growth projections. Only static income is present.
          </div>
        )}
        {staticWarning && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded p-2 mb-2">
            Most of your income is static. MRR growth will have little effect on the chart.
          </div>
        )}

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
          <div className="text-sm font-medium">Income Growth vs Safety Target</div>
          <div className="w-full h-[250px] overflow-x-auto">
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
              className="h-full w-full max-w-full"
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
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="var(--color-expenses)"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    name="Basic Expenses"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="safetyTarget"
                    stroke="var(--color-safetyTarget)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    name="Safety Target"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="var(--color-income)"
                    strokeWidth={3}
                    name="Total Income"
                    dot={{ fill: "var(--color-income)", strokeWidth: 2, r: 3 }}
                  />
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

          {/* Chart Insights / Summary */}
          <div className="mt-4">
            {freedomPoint ? (
              <div className="bg-green-50 border border-green-200 rounded p-3 mb-2">
                <div className="text-sm font-medium text-green-800 mb-1">Freedom Point</div>
                <div className="text-xs text-green-700 mb-2">
                  You reach your freedom number in <b>{freedomPoint.month} month{freedomPoint.month === 1 ? '' : 's'}</b> ({freedomPoint.monthLabel}).
                  <br />At that point, your income is <b>{currencySymbols[currency]}{freedomPoint.income.toLocaleString()}</b> and your target is <b>{currencySymbols[currency]}{freedomPoint.safetyTarget.toLocaleString()}</b>.
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[300px] text-xs border rounded bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="px-2 py-1 text-left font-semibold">Metric</th>
                        <th className="px-2 py-1 text-left font-semibold">Now</th>
                        <th className="px-2 py-1 text-left font-semibold">Freedom Month</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-1">Total Income</td>
                        <td className="px-2 py-1">{currencySymbols[currency]}{nowPoint.income.toLocaleString()}</td>
                        <td className="px-2 py-1">{currencySymbols[currency]}{freedomPoint.income.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1">Safety Target</td>
                        <td className="px-2 py-1">{currencySymbols[currency]}{nowPoint.safetyTarget.toLocaleString()}</td>
                        <td className="px-2 py-1">{currencySymbols[currency]}{freedomPoint.safetyTarget.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1">MRR</td>
                        <td className="px-2 py-1">{currencySymbols[currency]}{nowPoint.mrr.toLocaleString()}</td>
                        <td className="px-2 py-1">{currencySymbols[currency]}{freedomPoint.mrr.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
                Your income never crosses your freedom number in this projection. Adjust your growth rate, MRR, or expenses to see a path to freedom.
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ backgroundColor: "hsl(142, 76%, 36%)" }}></div>
              <span>Total Income</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ backgroundColor: "hsl(25, 95%, 53%)" }}></div>
              <span>Safety Target</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ backgroundColor: "hsl(0, 84%, 60%)" }}></div>
              <span>Basic Expenses</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ backgroundColor: "hsl(217, 91%, 60%)" }}></div>
              <span>MRR Only</span>
            </div>
          </div>
        </div>

        {/* Professional Deficit Warning */}
        {monthlyDeficit > 0 && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium text-red-800">Warning: You Have a Monthly Deficit</div>
            <div className="text-xs text-red-700 space-y-1">
              <div>
                You're losing {currencySymbols[currency]}{monthlyDeficit.toLocaleString()} every month.
              </div>
              <div>Growth projections are not meaningful until you fix your cash flow.</div>
              <div>Increase MRR or cut expenses to see a viable path to freedom.</div>
            </div>
          </div>
        )}

        {/* Success Insights - Only show when actually ready */}
        {isReady && monthlyDeficit === 0 && (
          <div className="bg-green-50 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium text-green-800">You're Ready! Next Steps:</div>
            <div className="text-xs text-green-700 space-y-1">
              <div>You have sufficient income + safety buffer</div>
              <div>Consider building 3-6 more months of runway</div>
              <div>Plan your transition timeline carefully</div>
              <div>Keep growing MRR for long-term security</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
