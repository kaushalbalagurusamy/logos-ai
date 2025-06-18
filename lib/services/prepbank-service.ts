import { BaseService } from "./base-service"
import type { PrepBankEntry, Tag, APIResponse } from "@/lib/types"

export class PrepBankService extends BaseService {
  async createEntry(entryData: Partial<PrepBankEntry>): Promise<APIResponse<PrepBankEntry>> {
    try {
      this.validateRequired(entryData, ["title", "entry_type", "author_id"])

      // Build dynamic insert based on entry type
      const baseFields = ["title", "summary", "author_id", "entry_type"]
      const baseValues = [entryData.title, entryData.summary, entryData.author_id, entryData.entry_type]

      const additionalFields: string[] = []
      const additionalValues: any[] = []

      switch (entryData.entry_type) {
        case "Evidence":
          if (entryData.quote_text) {
            additionalFields.push(
              "quote_text",
              "source_url",
              "pdf_url",
              "mla_citation",
              "author_qualifications",
              "methodology_details",
              "warrant_text",
            )
            additionalValues.push(
              entryData.quote_text,
              entryData.source_url,
              entryData.pdf_url,
              entryData.mla_citation,
              entryData.author_qualifications,
              entryData.methodology_details,
              entryData.warrant_text,
            )
          }
          break
        case "Analytics":
          if (entryData.content) {
            additionalFields.push("content")
            additionalValues.push(entryData.content)
          }
          break
        case "Definition":
          if (entryData.definition_text) {
            additionalFields.push("definition_text", "clustered_card_ids")
            additionalValues.push(entryData.definition_text, entryData.clustered_card_ids)
          }
          break
        case "SLR":
        case "MetaStudy":
          if (entryData.nodes && entryData.edges) {
            additionalFields.push("nodes", "edges")
            additionalValues.push(JSON.stringify(entryData.nodes), JSON.stringify(entryData.edges))
          }
          break
      }

      const allFields = [...baseFields, ...additionalFields]
      const allValues = [...baseValues, ...additionalValues]
      const placeholders = allFields.map((_, i) => `$${i + 1}`).join(", ")

      const entry = await this.executeQuerySingle<PrepBankEntry>(
        `INSERT INTO prep_bank_entries (${allFields.join(", ")}) 
         VALUES (${placeholders}) 
         RETURNING *`,
        allValues,
      )

      if (!entry) {
        return this.createErrorResponse("Failed to create entry")
      }

      return this.createSuccessResponse(entry, "Entry created successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to create entry")
    }
  }

  async getEntries(filters: {
    type?: string
    tags?: string[]
    search?: string
    authorId?: string
    limit?: number
    offset?: number
  }): Promise<APIResponse<PrepBankEntry[]>> {
    try {
      let query = `
        SELECT 
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
      `

      const conditions: string[] = []
      const values: any[] = []
      let paramIndex = 1

      if (filters.type) {
        conditions.push(`pbe.entry_type = $${paramIndex++}`)
        values.push(filters.type)
      }

      if (filters.authorId) {
        conditions.push(`pbe.author_id = $${paramIndex++}`)
        values.push(filters.authorId)
      }

      if (filters.search) {
        conditions.push(`
          to_tsvector('english', 
            COALESCE(pbe.title, '') || ' ' || 
            COALESCE(pbe.summary, '') || ' ' || 
            COALESCE(pbe.quote_text, '') || ' ' || 
            COALESCE(pbe.content, '') || ' ' || 
            COALESCE(pbe.definition_text, '')
          ) @@ plainto_tsquery('english', $${paramIndex++})
        `)
        values.push(filters.search)
      }

      if (filters.tags && filters.tags.length > 0) {
        conditions.push(`t.label = ANY($${paramIndex++})`)
        values.push(filters.tags)
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ")
      }

      query += `
        GROUP BY pbe.id, u.name
        ORDER BY pbe.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `

      values.push(filters.limit || 50, filters.offset || 0)

      const entries = await this.executeQuery<PrepBankEntry>(query, values)

      return this.createSuccessResponse(entries)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch entries")
    }
  }

  async getEntryById(entryId: string): Promise<APIResponse<PrepBankEntry>> {
    try {
      const entry = await this.executeQuerySingle<PrepBankEntry>(
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
        [entryId],
      )

      if (!entry) {
        return this.createErrorResponse("Entry not found")
      }

      return this.createSuccessResponse(entry)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch entry")
    }
  }

  async updateEntry(entryId: string, updates: Partial<PrepBankEntry>): Promise<APIResponse<PrepBankEntry>> {
    try {
      const updateFields: string[] = []
      const values: any[] = []
      let paramIndex = 1

      // Handle common fields
      if (updates.title !== undefined) {
        updateFields.push(`title = $${paramIndex++}`)
        values.push(updates.title)
      }
      if (updates.summary !== undefined) {
        updateFields.push(`summary = $${paramIndex++}`)
        values.push(updates.summary)
      }

      // Handle type-specific fields
      if (updates.quote_text !== undefined) {
        updateFields.push(`quote_text = $${paramIndex++}`)
        values.push(updates.quote_text)
      }
      if (updates.source_url !== undefined) {
        updateFields.push(`source_url = $${paramIndex++}`)
        values.push(updates.source_url)
      }
      if (updates.content !== undefined) {
        updateFields.push(`content = $${paramIndex++}`)
        values.push(updates.content)
      }
      if (updates.definition_text !== undefined) {
        updateFields.push(`definition_text = $${paramIndex++}`)
        values.push(updates.definition_text)
      }

      if (updateFields.length === 0) {
        return this.createErrorResponse("No fields to update")
      }

      updateFields.push(`updated_at = NOW()`)
      values.push(entryId)

      const entry = await this.executeQuerySingle<PrepBankEntry>(
        `UPDATE prep_bank_entries SET ${updateFields.join(", ")} 
         WHERE id = $${paramIndex} 
         RETURNING *`,
        values,
      )

      if (!entry) {
        return this.createErrorResponse("Entry not found")
      }

      return this.createSuccessResponse(entry, "Entry updated successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to update entry")
    }
  }

  async deleteEntry(entryId: string): Promise<APIResponse<null>> {
    try {
      const result = await this.executeQuery("DELETE FROM prep_bank_entries WHERE id = $1 RETURNING id", [entryId])

      if (result.length === 0) {
        return this.createErrorResponse("Entry not found")
      }

      return this.createSuccessResponse(null, "Entry deleted successfully")
    } catch (error) {
      return this.createErrorResponse("Failed to delete entry")
    }
  }

  async searchEntries(
    query: string,
    options: {
      tags?: string[]
      limit?: number
      offset?: number
    },
  ): Promise<APIResponse<PrepBankEntry[]>> {
    try {
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

      if (options.tags && options.tags.length > 0) {
        searchQuery += " AND t.label = ANY($2)"
        values.push(options.tags)
      }

      searchQuery += `
        GROUP BY pbe.id, u.name
        ORDER BY rank DESC, pbe.created_at DESC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
      `

      values.push(options.limit || 20, options.offset || 0)

      const results = await this.executeQuery<PrepBankEntry>(searchQuery, values)

      return this.createSuccessResponse(results)
    } catch (error) {
      return this.createErrorResponse("Search failed")
    }
  }

  // Tag management methods
  async getTags(): Promise<APIResponse<Tag[]>> {
    try {
      const tags = await this.executeQuery<Tag>("SELECT * FROM tags ORDER BY label ASC")
      return this.createSuccessResponse(tags)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch tags")
    }
  }

  async createTag(tagData: { label: string; color?: string }): Promise<APIResponse<Tag>> {
    try {
      this.validateRequired(tagData, ["label"])

      const tag = await this.executeQuerySingle<Tag>(
        `INSERT INTO tags (label, color) 
         VALUES ($1, $2) 
         RETURNING *`,
        [tagData.label, tagData.color || "#3B82F6"],
      )

      if (!tag) {
        return this.createErrorResponse("Failed to create tag")
      }

      return this.createSuccessResponse(tag, "Tag created successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to create tag")
    }
  }

  async addTagToEntry(entryId: string, tagId: string): Promise<APIResponse<null>> {
    try {
      await this.executeQuery(
        `INSERT INTO prep_bank_entry_tags (prep_bank_entry_id, tag_id) 
         VALUES ($1, $2) 
         ON CONFLICT DO NOTHING`,
        [entryId, tagId],
      )

      return this.createSuccessResponse(null, "Tag added to entry")
    } catch (error) {
      return this.createErrorResponse("Failed to add tag to entry")
    }
  }

  async removeTagFromEntry(entryId: string, tagId: string): Promise<APIResponse<null>> {
    try {
      await this.executeQuery("DELETE FROM prep_bank_entry_tags WHERE prep_bank_entry_id = $1 AND tag_id = $2", [
        entryId,
        tagId,
      ])

      return this.createSuccessResponse(null, "Tag removed from entry")
    } catch (error) {
      return this.createErrorResponse("Failed to remove tag from entry")
    }
  }
}
