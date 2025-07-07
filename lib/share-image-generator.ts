interface ShareImageData {
  freedomPercentage: number
  totalExpenses: number
  totalIncome: number
  monthsToFreedom: number
  growthRate: number
  currency: string
}

export function generateShareImage(data: ShareImageData): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Set canvas size (Twitter optimized)
    canvas.width = 1200
    canvas.height = 675

    const currencySymbols: Record<string, string> = {
      USD: "$",
      NGN: "₦",
      GBP: "£",
      EUR: "€",
    }
    const symbol = currencySymbols[data.currency] || "$"

    // Background
    ctx.fillStyle = "#FAFAFA"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Main headline
    ctx.fillStyle = "#1F2937"
    ctx.font = "bold 72px system-ui, -apple-system, sans-serif"
    ctx.textAlign = "center"
    const headline = `I'm ${data.freedomPercentage}% financially free 🎯`
    ctx.fillText(headline, canvas.width / 2, 120)

    // Freedom meter (circular progress)
    const centerX = canvas.width / 2
    const centerY = 280
    const radius = 80
    const lineWidth = 16

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#E5E7EB"
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Progress circle
    const progressAngle = (data.freedomPercentage / 100) * 2 * Math.PI
    const startAngle = -Math.PI / 2 // Start from top

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + progressAngle)

    // Color based on percentage
    if (data.freedomPercentage >= 100) {
      ctx.strokeStyle = "#10B981" // Green
    } else if (data.freedomPercentage >= 50) {
      ctx.strokeStyle = "#F59E0B" // Yellow
    } else {
      ctx.strokeStyle = "#EF4444" // Red
    }

    ctx.lineWidth = lineWidth
    ctx.lineCap = "round"
    ctx.stroke()

    // Percentage text in center
    ctx.fillStyle = "#1F2937"
    ctx.font = "bold 48px system-ui, -apple-system, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${data.freedomPercentage}%`, centerX, centerY + 15)

    // Time to freedom
    let timeText = ""
    if (data.freedomPercentage >= 100) {
      timeText = "🎉 Ready to quit now!"
    } else if (data.monthsToFreedom > 0 && data.monthsToFreedom < 120) {
      timeText = `⏳ Quit in ~${data.monthsToFreedom} months`
    } else {
      timeText = "📈 Keep growing!"
    }

    ctx.font = "600 32px system-ui, -apple-system, sans-serif"
    ctx.fillText(timeText, centerX, 400)

    // Key stats
    ctx.font = "400 24px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "#6B7280"

    const stats = [
      `💸 Freedom Target: ${symbol}${data.totalExpenses.toLocaleString()}/month`,
      `💰 Current Income: ${symbol}${data.totalIncome.toLocaleString()}/month`,
      `📈 Growth Rate: ${data.growthRate}%/month`,
    ]

    let yPos = 460
    stats.forEach((stat) => {
      ctx.fillText(stat, centerX, yPos)
      yPos += 35
    })

    // Branding
    ctx.font = "400 20px system-ui, -apple-system, sans-serif"
    ctx.fillStyle = "#9CA3AF"
    ctx.textAlign = "right"
    ctx.fillText("bootstrapplanner.app", canvas.width - 40, canvas.height - 30)

    // Convert to data URL
    const dataURL = canvas.toDataURL("image/png", 0.9)
    resolve(dataURL)
  })
}

export function downloadImage(dataURL: string, filename: string): void {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function shareToTwitter(data: ShareImageData): void {
  const text = `I'm ${data.freedomPercentage}% financially free! 🎯

💸 Freedom Goal: ${data.totalExpenses.toLocaleString()}/month
💰 Current Income: ${data.totalIncome.toLocaleString()}/month

${
  data.freedomPercentage >= 100
    ? "Ready to quit my job! 🎉"
    : data.monthsToFreedom > 0 && data.monthsToFreedom < 120
      ? `${data.monthsToFreedom} months until I can quit! 💪`
      : "Working towards financial freedom! 🚀"
}

Check your freedom score:`

  const url = encodeURIComponent(window.location.href)
  const tweetText = encodeURIComponent(text)
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${url}&hashtags=IndieHacker,FinancialFreedom,SideHustle`

  window.open(twitterUrl, "_blank", "width=550,height=420")
}
