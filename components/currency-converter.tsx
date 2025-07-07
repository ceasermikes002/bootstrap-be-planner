"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, DollarSign, PoundSterling } from "lucide-react"
import { usePlannerStore } from "@/lib/store"

const currencies = [
  { code: "USD" as const, name: "US Dollar", symbol: "$", icon: DollarSign, flag: "🇺🇸" },
  { code: "NGN" as const, name: "Nigerian Naira", symbol: "₦", icon: null, flag: "🇳🇬" },
  { code: "GBP" as const, name: "British Pound", symbol: "£", icon: PoundSterling, flag: "🇬🇧" },
  { code: "EUR" as const, name: "Euro", symbol: "€", icon: null, flag: "🇪🇺" },
]

export function CurrencyConverter() {
  const { currency, convertToCurrency, hasValues } = usePlannerStore()
  const [converting, setConverting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Don't show if no values entered
  if (!hasValues()) return null

  const handleConvert = async (targetCurrency: typeof currency) => {
    if (targetCurrency === currency) return

    setConverting(targetCurrency)
    setError(null)

    try {
      await convertToCurrency(targetCurrency)
    } catch (err) {
      setError("Failed to convert currency. Please try again.")
      console.error("Conversion error:", err)
    } finally {
      setConverting(null)
    }
  }

  const currentCurrency = currencies.find((c) => c.code === currency)
  const otherCurrencies = currencies.filter((c) => c.code !== currency)

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-normal">🌍 Currency Converter</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Currently showing in:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            <span>{currentCurrency?.flag}</span>
            <span>
              {currentCurrency?.name} ({currentCurrency?.symbol})
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <div className="text-sm text-gray-600 mb-3">Convert all your values to a different currency:</div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {otherCurrencies.map((curr) => (
            <Button
              key={curr.code}
              onClick={() => handleConvert(curr.code)}
              disabled={converting !== null}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 justify-start h-auto p-3"
            >
              {converting === curr.code ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-base">{curr.flag}</span>
              )}
              <div className="text-left">
                <div className="font-medium text-xs">{curr.code}</div>
                <div className="text-xs text-gray-500">{curr.symbol}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          💡 Exchange rates are fetched in real-time. Conversions are rounded to whole numbers.
        </div>
      </CardContent>
    </Card>
  )
}
