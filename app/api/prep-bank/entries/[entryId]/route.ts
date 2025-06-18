import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody } from "@/lib/api-utils"
import { executeQuery, executeQuerySingle } from "@/lib/database"
import type { PrepBankEntry } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const entry = await executeQuerySingle<PrepBankEntry>(
      `SELECT 
        pbe.*,
        u.name as author_name,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'label', t.label, 'color', t.color)
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as tags
      FROM prep_bank_entries pbe
      LEFT JOIN users u ON pbe.author_id = u.id
      LEFT JOIN prep_bank_entry_tags pbet ON pbe.id = pbet.prep_bank_entry_id
      LEFT JOIN tags t ON pbet.tag_id = t.id
      WHERE pbe.id = $1
      GROUP BY pbe.id, u.name`,
      [params.entryId],
    )

    if (!entry) {
      return createErrorResponse("Entry not found", 404)
    }

    return createSuccessResponse(entry)
  } catch (error) {
    return createErrorResponse("Failed to fetch entry", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const body = await parseRequestBody<Partial<PrepBankEntry>>(request)

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    // Handle common fields
    if (body.title) {
      updates.push(`title = $${paramIndex++}`)
      values.push(body.title)
    }
    if (body.summary) {
      updates.push(`summary = $${paramIndex++}`)
      values.push(body.summary)
    }

    // Handle type-specific fields
    if (body.quote_text !== undefined) {
      updates.push(`quote_text = $${paramIndex++}`)
      values.push(body.quote_text)
    }
    if (body.source_url !== undefined) {
      updates.push(`source_url = $${paramIndex++}`)
      values.push(body.source_url)
    }
    if (body.content !== undefined) {
      updates.push(`content = $${paramIndex++}`)
      values.push(body.content)
    }
    if (body.definition_text !== undefined) {
      updates.push(`definition_text = $${paramIndex++}`)
      values.push(body.definition_text)
    }

    if (updates.length === 0) {
      return createErrorResponse("No fields to update", 400)
    }

    updates.push(`updated_at = NOW()`)
    values.push(params.entryId)

    const entry = await executeQuery<PrepBankEntry>(
      `UPDATE prep_bank_entries SET ${updates.join(", ")} 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values,
    )

    if (entry.length === 0) {
      return createErrorResponse("Entry not found", 404)
    }

    return createSuccessResponse(entry[0], "Entry updated successfully")
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Failed to update entry", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const result = await executeQuery("DELETE FROM prep_bank_entries WHERE id = $1 RETURNING id", [params.entryId])

    if (result.length === 0) {
      return createErrorResponse("Entry not found", 404)
    }

    return createSuccessResponse(null, "Entry deleted successfully")
  } catch (error) {
    return createErrorResponse("Failed to delete entry", 500)
  }
}
