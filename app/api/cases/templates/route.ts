import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"
import { executeQuery } from "@/lib/database"
import type { CaseTemplate } from "@/lib/types"

export async function GET() {
  try {
    const templates = await executeQuery<CaseTemplate>(
      `SELECT ct.*, u.name as created_by_name 
       FROM case_templates ct
       LEFT JOIN users u ON ct.created_by = u.id
       ORDER BY ct.created_at DESC`,
    )

    return createSuccessResponse(templates)
  } catch (error) {
    return createErrorResponse("Failed to fetch templates", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{
      name: string
      description?: string
      card_sequence?: string[]
      created_by: string
    }>(request)
    validateRequired(body, ["name", "created_by"])

    const template = await executeQuery<CaseTemplate>(
      `INSERT INTO case_templates (name, description, card_sequence, created_by) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [body.name, body.description, body.card_sequence || [], body.created_by],
    )

    return createSuccessResponse(template[0], "Template created successfully")
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Failed to create template", 500)
  }
}
