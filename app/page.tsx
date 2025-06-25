"use client"

import { LogosAIShell } from "@/components/logos-ai-shell"
import { useEffect, useState } from "react"

export default function LogosAI() {
  const [mounted, setMounted] = useState(false)
  
  // Mock user data - in production, this would come from authentication
  const user = {
    id: "user-123",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Debater",
    preferences: {
      defaultCitationStyle: "MLA" as const,
    },
  }

  useEffect(() => {
    setMounted(true)
    console.log("LogosAI component mounted")
  }, [])

  console.log("LogosAI component rendering", { mounted, user })

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1e1e1e] text-[#cccccc]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  try {
    return <LogosAIShell user={user} />
  } catch (error) {
    console.error("Error rendering LogosAIShell:", error)
    return (
      <div className="h-screen flex items-center justify-center bg-[#1e1e1e] text-[#cccccc]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Application</h1>
          <p className="text-[#a1a1a1]">Check the console for details</p>
        </div>
      </div>
    )
  }
}
