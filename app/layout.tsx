import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "Startup Bootstrap Break-even Planner",
  description: "Know when you're free to quit. Calculate your path to financial freedom from your side income.",
  openGraph: {
    title: "Startup Bootstrap Break-even Planner",
    description: "Calculate when your side income becomes sustainable enough to quit your job",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Bootstrap Break-even Planner",
    description: "Know when you're free to quit your job",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
