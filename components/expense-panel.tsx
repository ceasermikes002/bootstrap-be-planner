"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePlannerStore } from "@/lib/store"

export function ExpensePanel() {
  const { expenses, updateExpense, getTotalExpenses, currency } = usePlannerStore()

  const handleInputChange = (key: keyof typeof expenses, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    updateExpense(key, numValue)
  }

  const expenseItems = [
    { key: "rent" as const, label: "Rent", icon: "🏠" },
    { key: "food" as const, label: "Food", icon: "🍕" },
    { key: "transport" as const, label: "Transport", icon: "🚗" },
    { key: "subscriptions" as const, label: "Subscriptions", icon: "📱" },
    { key: "other" as const, label: "Other", icon: "💳" },
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
        <CardTitle className="flex items-center gap-2 text-lg font-normal">💸 Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {expenseItems.map(({ key, label, icon }) => (
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
                value={expenses[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        ))}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center font-medium">
            <span>Total Monthly Expenses:</span>
            <span className="text-lg">
              {currencySymbols[currency]}
              {getTotalExpenses().toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
