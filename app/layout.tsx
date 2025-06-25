import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Logos AI - Debate Platform",
  description: "AI-powered debate preparation and analysis platform",
    generator: 'v0.dev'
}

import { ErrorBoundary } from "@/components/error-boundary"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1e1e1e] text-[#cccccc]`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
