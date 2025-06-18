import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody } from "@/lib/api-utils"
import { executeQuery } from "@/lib/database"
import type { Tag } from "@/lib/types"

export async function PUT(request: NextRequest, { params }: { params: { tagId: string } }) {
  try {
    const body = await parseRequestBody<{ label?: string; color?: string }>(request)

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (body.label) {
      updates.push(`label = $${paramIndex++}`)
      values.push(body.label)
    }
    if (body.color) {
      updates.push(`color = $${paramIndex++}`)
      values.push(body.color)
    }

    if (updates.length === 0) {
      return createErrorResponse("No fields to update", 400)
    }

    values.push(params.tagId)

    const tag = await executeQuery<Tag>(
      `UPDATE tags SET ${updates.join(", ")} 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values,
    )

    if (tag.length === 0) {
      return createErrorResponse("Tag not found", 404)
    }

    return createSuccessResponse(tag[0], "Tag updated successfully")
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Failed to update tag", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { tagId: string } }) {
  try {
    const result = await executeQuery("DELETE FROM tags WHERE id = $1 RETURNING id", [params.tagId])

    if (result.length === 0) {
      return createErrorResponse("Tag not found", 404)
    }

    return createSuccessResponse(null, "Tag deleted successfully")
  } catch (error) {
    return createErrorResponse("Failed to delete tag", 500)
  }
}
