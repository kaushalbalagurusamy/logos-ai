import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody } from "@/lib/api-utils"
import { executeQuery, executeQuerySingle } from "@/lib/database"
import type { User } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const user = await executeQuerySingle<User>("SELECT id, name, email, role, created_at FROM users WHERE id = $1", [
      params.userId,
    ])

    if (!user) {
      return createErrorResponse("User not found", 404)
    }

    return createSuccessResponse(user)
  } catch (error) {
    return createErrorResponse("Failed to fetch user", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const body = await parseRequestBody<{ name?: string; email?: string; role?: string }>(request)

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (body.name) {
      updates.push(`name = $${paramIndex++}`)
      values.push(body.name)
    }
    if (body.email) {
      updates.push(`email = $${paramIndex++}`)
      values.push(body.email)
    }
    if (body.role) {
      updates.push(`role = $${paramIndex++}`)
      values.push(body.role)
    }

    if (updates.length === 0) {
      return createErrorResponse("No fields to update", 400)
    }

    values.push(params.userId)

    const user = await executeQuery<User>(
      `UPDATE users SET ${updates.join(", ")}, updated_at = NOW() 
       WHERE id = $${paramIndex} 
       RETURNING id, name, email, role, created_at`,
      values,
    )

    if (user.length === 0) {
      return createErrorResponse("User not found", 404)
    }

    return createSuccessResponse(user[0], "User updated successfully")
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Failed to update user", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const result = await executeQuery("DELETE FROM users WHERE id = $1 RETURNING id", [params.userId])

    if (result.length === 0) {
      return createErrorResponse("User not found", 404)
    }

    return createSuccessResponse(null, "User deleted successfully")
  } catch (error) {
    return createErrorResponse("Failed to delete user", 500)
  }
}
