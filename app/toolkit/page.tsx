import Link from "next/link"

export default function ToolkitPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bootstrap Planner Toolkit</h1>
        <Link href="/" className="text-sm text-blue-600 underline">Back to Home</Link>
      </div>
      <p className="mb-8 text-gray-700">
        This toolkit explains the key concepts and fields used in the Bootstrap Planner. Use it as a reference to understand how your numbers are calculated and what they mean for your financial journey as a founder.
      </p>
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-1">Monthly Expenses</h2>
          <p className="text-gray-600">Your total recurring monthly costs (rent, food, transport, subscriptions, etc.).</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Safety Buffer</h2>
          <p className="text-gray-600">An optional 25% added to your expenses for unexpected costs. Only affects your required income to quit, not runway.</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Monthly War Chest</h2>
          <p className="text-gray-600">An extra monthly surplus goal for growth, reinvestment, or extra security. Only affects your required income to quit, not runway.</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Freedom Number</h2>
          <p className="text-gray-600">The minimum monthly income you need to safely quit: Expenses + Buffer + War Chest.</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Current Income</h2>
          <p className="text-gray-600">All your income sources combined (MRR, freelance, passive, salary, etc.).</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Deficit / Surplus</h2>
          <p className="text-gray-600">How much you need to add (deficit) or have extra (surplus) per month to reach your freedom number.</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Savings Used</h2>
          <p className="text-gray-600">The amount of cash savings used for runway calculation. If blank, defaults to 3× expenses.</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Runway</h2>
          <p className="text-gray-600">How long you can last at your current burn rate (if deficit), or how long to build an emergency fund (if surplus).</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Financial Freedom %</h2>
          <p className="text-gray-600">Current Income divided by Freedom Number, as a percentage. 100% means you can safely quit.</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-1">Growth Projection</h2>
          <p className="text-gray-600">
            This section visualizes how your income could grow over time, based on your current Monthly Recurring Revenue (MRR), static income, and your chosen monthly MRR growth rate. It helps you see how long it might take to reach your Freedom Number, and what your financial trajectory looks like if you keep growing at your current pace.
          </p>
          <ul className="list-disc pl-5 text-gray-600 mt-2 text-sm">
            <li><b>MRR Growth Rate:</b> The percentage your MRR increases each month.</li>
            <li><b>Expense Growth Rate (optional):</b> Models inflation or scaling costs.</li>
            <li><b>Freedom Point:</b> The month when your income first meets or exceeds your Freedom Number.</li>
            <li><b>Chart Lines:</b> Shows your projected income, expenses, and safety target over time.</li>
            <li><b>Insights:</b> The chart summary highlights when you can safely quit, or if your current plan never reaches your goal.</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center">
        <Link href="/" className="text-blue-600 underline">Back to Home</Link>
      </div>
    </main>
  )
}
