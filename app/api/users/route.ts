import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"
import { executeQuery } from "@/lib/database"
import type { User } from "@/lib/types"

export async function GET() {
  try {
    const users = await executeQuery<User>(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
    )

    return createSuccessResponse(users)
  } catch (error) {
    return createErrorResponse("Failed to fetch users", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{ name: string; email: string; role?: string }>(request)
    validateRequired(body, ["name", "email"])

    const user = await executeQuery<User>(
      `INSERT INTO users (name, email, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, role, created_at`,
      [body.name, body.email, body.role || "Debater"],
    )

    return createSuccessResponse(user[0], "User created successfully")
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Failed to create user", 500)
  }
}
