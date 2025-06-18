"use client"

import { LogosAIShell } from "@/components/logos-ai-shell"

export default function LogosAI() {
  // Mock user data - in production, this would come from authentication
  const user = {
    id: "user-123",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Debater",
  }

  return <LogosAIShell user={user} />
}
