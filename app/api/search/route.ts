import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, getSearchParams } from "@/lib/api-utils"
import { executeQuery } from "@/lib/database"
import type { PrepBankEntry } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const params = getSearchParams(request)
    const { query, tags, limit = "20" } = params

    if (!query) {
      return createErrorResponse("Query parameter is required", 400)
    }

    let searchQuery = `
      SELECT 
        pbe.*,
        u.name as author_name,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'label', t.label, 'color', t.color)
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as tags,
        ts_rank(
          to_tsvector('english', 
            COALESCE(pbe.title, '') || ' ' || 
            COALESCE(pbe.summary, '') || ' ' || 
            COALESCE(pbe.quote_text, '') || ' ' || 
            COALESCE(pbe.content, '') || ' ' || 
            COALESCE(pbe.definition_text, '')
          ),
          plainto_tsquery('english', $1)
        ) as rank
      FROM prep_bank_entries pbe
      LEFT JOIN users u ON pbe.author_id = u.id
      LEFT JOIN prep_bank_entry_tags pbet ON pbe.id = pbet.prep_bank_entry_id
      LEFT JOIN tags t ON pbet.tag_id = t.id
      WHERE to_tsvector('english', 
        COALESCE(pbe.title, '') || ' ' || 
        COALESCE(pbe.summary, '') || ' ' || 
        COALESCE(pbe.quote_text, '') || ' ' || 
        COALESCE(pbe.content, '') || ' ' || 
        COALESCE(pbe.definition_text, '')
      ) @@ plainto_tsquery('english', $1)
    `

    const values = [query]

    if (tags) {
      const tagList = tags.split(",")
      searchQuery += " AND t.label = ANY($2)"
      values.push(tagList)
    }

    searchQuery += `
      GROUP BY pbe.id, u.name
      ORDER BY rank DESC, pbe.created_at DESC
      LIMIT $${values.length + 1}
    `

    values.push(Number.parseInt(limit))

    const results = await executeQuery<PrepBankEntry>(searchQuery, values)

    return createSuccessResponse(results)
  } catch (error) {
    return createErrorResponse("Search failed", 500)
  }
}
