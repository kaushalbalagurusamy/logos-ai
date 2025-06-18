import { createSuccessResponse } from "@/lib/api-utils"

export async function POST() {
  // In a real app, you'd invalidate the token
  return createSuccessResponse(null, "Logout successful")
}
