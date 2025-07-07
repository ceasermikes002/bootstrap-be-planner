"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, FileText, ImageIcon } from "lucide-react"
import { usePlannerStore } from "@/lib/store"
import { generatePDF } from "@/lib/pdf-generator"
import { generateShareImage, downloadImage, shareToTwitter } from "@/lib/share-image-generator"

export function ShareExport() {
  const {
    getFreedomPercentage,
    getTotalExpenses,
    getTotalIncome,
    getMonthsToFreedom,
    getRunwayMonths,
    growthRate,
    currency,
    expenses,
    income,
  } = usePlannerStore()

  const [generating, setGenerating] = useState<string | null>(null)

  const handleShareImage = async () => {
    setGenerating("image")
    try {
      const imageData = await generateShareImage({
        freedomPercentage: getFreedomPercentage(),
        totalExpenses: getTotalExpenses(),
        totalIncome: getTotalIncome(),
        monthsToFreedom: getMonthsToFreedom(),
        growthRate,
        currency,
      })

      downloadImage(imageData, `freedom-score-${getFreedomPercentage()}%.png`)
    } catch (error) {
      console.error("Failed to generate share image:", error)
    } finally {
      setGenerating(null)
    }
  }

  const handleShareTwitter = () => {
    shareToTwitter({
      freedomPercentage: getFreedomPercentage(),
      totalExpenses: getTotalExpenses(),
      totalIncome: getTotalIncome(),
      monthsToFreedom: getMonthsToFreedom(),
      growthRate,
      currency,
    })
  }

  const handleExportPDF = () => {
    setGenerating("pdf")
    try {
      generatePDF({
        expenses,
        income,
        currency,
        freedomPercentage: getFreedomPercentage(),
        totalExpenses: getTotalExpenses(),
        totalIncome: getTotalIncome(),
        monthsToFreedom: getMonthsToFreedom(),
        growthRate,
        runwayMonths: getRunwayMonths(),
      })
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Primary Share Button */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handleShareImage}
          disabled={generating !== null}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {generating === "image" ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
          Share My Score
        </Button>

        <Button onClick={handleShareTwitter} variant="outline" className="flex items-center gap-2 bg-transparent">
          <Share2 className="w-4 h-4" />
          Tweet
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handleExportPDF}
          disabled={generating !== null}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          {generating === "pdf" ? (
            <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileText className="w-3 h-3" />
          )}
          Export PDF
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">💡 Share your progress to inspire other indie hackers!</div>
    </div>
  )
}
