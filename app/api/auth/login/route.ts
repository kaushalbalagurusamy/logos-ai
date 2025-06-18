import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"
import { executeQuerySingle } from "@/lib/database"
import type { User } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{ email: string; password: string }>(request)
    validateRequired(body, ["email", "password"])

    // In a real app, you'd verify the password hash
    const user = await executeQuerySingle<User>(
      "SELECT id, name, email, role, created_at FROM users WHERE email = $1",
      [body.email],
    )

    if (!user) {
      return createErrorResponse("Invalid credentials", 401)
    }

    // In a real app, you'd generate a JWT token
    const token = "mock-jwt-token"

    return createSuccessResponse(
      {
        user,
        token,
      },
      "Login successful",
    )
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Login failed", 500)
  }
}
