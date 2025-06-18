import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"
import { executeQuery } from "@/lib/database"
import type { Tag } from "@/lib/types"

export async function GET() {
  try {
    const tags = await executeQuery<Tag>("SELECT * FROM tags ORDER BY label ASC")

    return createSuccessResponse(tags)
  } catch (error) {
    return createErrorResponse("Failed to fetch tags", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{ label: string; color?: string }>(request)
    validateRequired(body, ["label"])

    const tag = await executeQuery<Tag>(
      `INSERT INTO tags (label, color) 
       VALUES ($1, $2) 
       RETURNING *`,
      [body.label, body.color || "#3B82F6"],
    )

    return createSuccessResponse(tag[0], "Tag created successfully")
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Failed to create tag", 500)
  }
}
