import jsPDF from "jspdf"

interface PlannerData {
  expenses: Record<string, number>
  income: Record<string, number>
  currency: string
  freedomPercentage: number
  totalExpenses: number
  totalIncome: number
  monthsToFreedom: number
  growthRate: number
  runwayMonths: number
  safetyBuffer: number
  warChest: number
  freedomNumber: number
  savingsUsed: number
  deficit: number
}

export function generatePDF(data: PlannerData): void {
  const doc = new jsPDF()
  const currencySymbols: Record<string, string> = {
    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
  }
  const symbol = currencySymbols[data.currency] || "$"

  // Header
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("Startup Bootstrap Break-even Plan", 20, 30)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40)

  // Freedom Score Section
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("🎯 Financial Freedom Analysis", 20, 60)

  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  const freedomStatus =
    data.freedomPercentage >= 100
      ? "You're financially free! 🎉"
      : data.freedomPercentage >= 50
        ? "You're getting close 👏"
        : "You're not ready yet 😬"

  doc.text(`Freedom Score: ${data.freedomPercentage}%`, 20, 75)
  doc.text(`Status: ${freedomStatus}`, 20, 85)

  // Summary Table Section
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Key Metrics Summary", 20, 105)
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  let yPos = 120
  doc.text(`Monthly Expenses: ${symbol}${data.totalExpenses.toLocaleString()}  (Your total recurring monthly costs)`, 20, yPos)
  yPos += 8
  doc.text(`Safety Buffer: ${symbol}${data.safetyBuffer.toLocaleString()}  (Extra 25% for unexpected costs)`, 20, yPos)
  yPos += 8
  doc.text(`War Chest: ${symbol}${data.warChest.toLocaleString()}  (Extra monthly surplus goal)`, 20, yPos)
  yPos += 8
  doc.text(`Freedom Number: ${symbol}${data.freedomNumber.toLocaleString()}  (Required monthly income to safely quit)`, 20, yPos)
  yPos += 8
  doc.text(`Current Income: ${symbol}${data.totalIncome.toLocaleString()}  (All your income sources combined)`, 20, yPos)
  yPos += 8
  doc.text(`Deficit/Surplus: ${symbol}${data.deficit.toLocaleString()}  (How much you need to add or have extra per month)`, 20, yPos)
  yPos += 8
  doc.text(`Savings Used: ${symbol}${data.savingsUsed.toLocaleString()}  (Used for runway calculation)`, 20, yPos)
  yPos += 8
  doc.text(`Runway: ${data.runwayMonths} months  (How long you can last at your current burn)`, 20, yPos)

  // Monthly Expenses Breakdown
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("💸 Monthly Expenses", 20, 140)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  let expensesY = 155
  Object.entries(data.expenses).forEach(([key, value]) => {
    if (value > 0) {
      const label = key.charAt(0).toUpperCase() + key.slice(1)
      doc.text(`${label}: ${symbol}${value.toLocaleString()}`, 25, expensesY)
      expensesY += 10
    }
  })
  doc.setFont("helvetica", "bold")
  doc.text(`Total Expenses: ${symbol}${data.totalExpenses.toLocaleString()}`, 25, expensesY + 5)

  // Monthly Income Breakdown
  yPos += 25
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("💰 Monthly Income Sources", 20, yPos)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  yPos += 15
  Object.entries(data.income).forEach(([key, value]) => {
    if (value > 0) {
      const labels: Record<string, string> = {
        mrr: "MRR (Monthly Recurring Revenue)",
        freelance: "Freelance Income",
        passive: "Passive Income",
        salary: "Salary",
      }
      doc.text(`${labels[key]}: ${symbol}${value.toLocaleString()}`, 25, yPos)
      yPos += 10
    }
  })
  doc.setFont("helvetica", "bold")
  doc.text(`Total Income: ${symbol}${data.totalIncome.toLocaleString()}`, 25, yPos + 5)

  // Growth Projection
  yPos += 25
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("📈 Growth Projection", 20, yPos)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  yPos += 15
  doc.text(`Monthly Growth Rate: ${data.growthRate}%`, 25, yPos)
  yPos += 10

  if (data.monthsToFreedom > 0 && data.monthsToFreedom < 120) {
    doc.text(`Time to Financial Freedom: ${data.monthsToFreedom} months`, 25, yPos)
    yPos += 10
    const quitDate = new Date()
    quitDate.setMonth(quitDate.getMonth() + data.monthsToFreedom)
    doc.text(
      `Estimated Quit Date: ${quitDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
      25,
      yPos,
    )
  } else if (data.freedomPercentage >= 100) {
    doc.text("Time to Financial Freedom: You're ready now! 🎉", 25, yPos)
  } else {
    doc.text("Time to Financial Freedom: Increase your growth rate", 25, yPos)
  }

  yPos += 10
  if (data.runwayMonths > 0) {
    doc.text(`Current Runway: ${data.runwayMonths} months`, 25, yPos)
  }

  // Key Insights
  yPos += 25
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("💡 Key Insights", 20, yPos)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  yPos += 15
  const gap = data.totalExpenses - data.totalIncome
  if (gap > 0) {
    doc.text(`• You need ${symbol}${gap.toLocaleString()} more monthly income to reach freedom`, 25, yPos)
    yPos += 10
  }
  doc.text(`• Focus on growing MRR as it's your most scalable income stream`, 25, yPos)
  yPos += 10
  doc.text(`• Consider reducing expenses or increasing income growth rate`, 25, yPos)

  // Footer
  doc.setFontSize(10)
  doc.setFont("helvetica", "italic")
  doc.text("Generated by Startup Bootstrap Break-even Planner", 20, 280)
  doc.text("Built for indie hackers, by an indie hacker", 20, 290)

  // Save the PDF
  doc.save(`bootstrap-breakeven-plan-${new Date().toISOString().split("T")[0]}.pdf`)
}
