import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"
import { executeQuery } from "@/lib/database"
import type { Round } from "@/lib/types"

export async function GET() {
  try {
    const rounds = await executeQuery<Round>(
      `SELECT r.*, u.name as user_name 
       FROM rounds r
       LEFT JOIN users u ON r.user_id = u.id
       ORDER BY r.start_time DESC`,
    )

    return createSuccessResponse(rounds)
  } catch (error) {
    return createErrorResponse("Failed to fetch rounds", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{ user_id: string; start_time?: string }>(request)
    validateRequired(body, ["user_id"])

    const round = await executeQuery<Round>(
      `INSERT INTO rounds (user_id, start_time) 
       VALUES ($1, $2) 
       RETURNING *`,
      [body.user_id, body.start_time || new Date().toISOString()],
    )

    return createSuccessResponse(round[0], "Round started successfully")
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Failed to start round", 500)
  }
}
