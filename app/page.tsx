import { ExpensePanel } from "@/components/expense-panel"
import { IncomePanel } from "@/components/income-panel"
import { ResultsPanel } from "@/components/results-panel"
import { GrowthProjection } from "@/components/growth-projection"
import { ShareExport } from "@/components/share-export"
import { CurrencyConverter } from "@/components/currency-converter"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Startup Bootstrap Break-even Planner</h1>
          <p className="text-lg text-gray-600 font-light">"Know when you're free to quit."</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Expenses */}
          <div className="space-y-6">
            <ExpensePanel />
          </div>

          {/* Middle Column - Income */}
          <div className="space-y-6">
            <IncomePanel />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <ResultsPanel />
          </div>
        </div>

        {/* Currency Converter - only shows when user has values */}
        <CurrencyConverter />

        {/* Bottom Section - Growth Projection */}
        <div className="space-y-6 mb-8">
          <GrowthProjection />

          {/* Share Section */}
          <div className="bg-white p-6 rounded-lg border text-center space-y-4">
            <h3 className="text-lg font-normal">Ready to share your progress?</h3>
            <p className="text-sm text-gray-600">
              Generate a beautiful share image or export a detailed PDF report of your financial freedom plan.
            </p>
            <ShareExport />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Built for indie hackers, by{" "}
            <a
              href="https://github.com/ceasermikes002"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              an indie hacker
            </a>
            . No signup required.
          </p>
        </div>
      </div>
    </div>
  )
}
