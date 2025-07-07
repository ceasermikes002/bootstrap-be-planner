"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePlannerStore } from "@/lib/store"

export function IncomePanel() {
  const { income, updateIncome, getTotalIncome, currency } = usePlannerStore()

  const handleInputChange = (key: keyof typeof income, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    updateIncome(key, numValue)
  }

  const incomeItems = [
    { key: "mrr" as const, label: "MRR", icon: "📈" },
    { key: "freelance" as const, label: "Freelance", icon: "💼" },
    { key: "passive" as const, label: "Passive Income", icon: "💰" },
    { key: "salary" as const, label: "Salary (Optional)", icon: "🏢" },
  ]

  const currencySymbols = {
    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-normal">💰 Income Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {incomeItems.map(({ key, label, icon }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="flex items-center gap-2 text-sm font-normal">
              <span>{icon}</span>
              {label}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {currencySymbols[currency]}
              </span>
              <Input
                id={key}
                type="number"
                placeholder="0"
                value={income[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        ))}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center font-medium">
            <span>Total Monthly Income:</span>
            <span className="text-lg">
              {currencySymbols[currency]}
              {getTotalIncome().toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
