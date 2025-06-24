import { executeQuery, executeQuerySingle } from "@/lib/database"
import type { Source } from "@/lib/types"
import { BaseService } from "./base-service"

export class SourceService extends BaseService {
  async getSources(
    userId: string,
    filters: {
      search?: string
      citationStyle?: "MLA" | "APA" | "Chicago"
      limit?: number
      offset?: number
    } = {},
  ): Promise<Source[]> {
    try {
      let query = `
        SELECT s.*, 
               COALESCE(
                 JSON_AGG(
                   CASE WHEN ec.id IS NOT NULL 
                   THEN ec.id 
                   ELSE NULL END
                 ) FILTER (WHERE ec.id IS NOT NULL), 
                 '[]'::json
               ) as cards
        FROM sources s
        LEFT JOIN evidence_cards ec ON s.id = ec.source_id
        WHERE s.user_id = $1
      `

      const params: any[] = [userId]
      let paramIndex = 2

      // Add search filter
      if (filters.search) {
        query += ` AND (
          s.title ILIKE $${paramIndex} OR 
          s.author ILIKE $${paramIndex} OR 
          s.publication ILIKE $${paramIndex}
        )`
        params.push(`%${filters.search}%`)
        paramIndex++
      }

      // Add citation style filter
      if (filters.citationStyle) {
        query += ` AND s.citation_style = $${paramIndex}`
        params.push(filters.citationStyle)
        paramIndex++
      }

      query += ` GROUP BY s.id ORDER BY s.updated_at DESC`

      // Add pagination
      if (filters.limit) {
        query += ` LIMIT $${paramIndex}`
        params.push(filters.limit)
        paramIndex++
      }

      if (filters.offset) {
        query += ` OFFSET $${paramIndex}`
        params.push(filters.offset)
      }

      const result = await executeQuery(query, params)
      return result.rows.map(this.mapRowToSource)
    } catch (error) {
      console.error("Error getting sources:", error)
      throw new Error("Failed to retrieve sources")
    }
  }

  async getSourceById(id: string, userId: string): Promise<Source | null> {
    try {
      const query = `
        SELECT s.*, 
               COALESCE(
                 JSON_AGG(
                   CASE WHEN ec.id IS NOT NULL 
                   THEN ec.id 
                   ELSE NULL END
                 ) FILTER (WHERE ec.id IS NOT NULL), 
                 '[]'::json
               ) as cards
        FROM sources s
        LEFT JOIN evidence_cards ec ON s.id = ec.source_id
        WHERE s.id = $1 AND s.user_id = $2
        GROUP BY s.id
      `

      const result = await executeQuerySingle(query, [id, userId])
      return result ? this.mapRowToSource(result) : null
    } catch (error) {
      console.error("Error getting source by ID:", error)
      throw new Error("Failed to retrieve source")
    }
  }

  async createSource(
    sourceData: Omit<Source, "id" | "version" | "createdAt" | "updatedAt" | "cards">,
  ): Promise<Source> {
    try {
      const id = this.generateId()
      const now = new Date()

      const query = `
        INSERT INTO sources (
          id, title, author, publication, date, url, citation_style,
          author_qualifications, study_methodology, file_path, file_metadata,
          version, user_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `

      const params = [
        id,
        sourceData.title,
        sourceData.author || null,
        sourceData.publication || null,
        sourceData.date || null,
        sourceData.url || null,
        sourceData.citationStyle,
        sourceData.authorQualifications || null,
        sourceData.studyMethodology || null,
        sourceData.filePath || null,
        sourceData.fileMetadata ? JSON.stringify(sourceData.fileMetadata) : null,
        1, // Initial version
        sourceData.userId,
        now,
        now,
      ]

      const result = await executeQuerySingle(query, params)
      return this.mapRowToSource(result)
    } catch (error) {
      console.error("Error creating source:", error)
      throw new Error("Failed to create source")
    }
  }

  async updateSource(
    id: string,
    userId: string,
    updates: Partial<Omit<Source, "id" | "userId" | "createdAt" | "cards">>,
  ): Promise<Source | null> {
    try {
      // First check if source exists and belongs to user
      const existingSource = await this.getSourceById(id, userId)
      if (!existingSource) {
        return null
      }

      const now = new Date()
      const newVersion = existingSource.version + 1

      const query = `
        UPDATE sources SET
          title = COALESCE($1, title),
          author = COALESCE($2, author),
          publication = COALESCE($3, publication),
          date = COALESCE($4, date),
          url = COALESCE($5, url),
          citation_style = COALESCE($6, citation_style),
          author_qualifications = COALESCE($7, author_qualifications),
          study_methodology = COALESCE($8, study_methodology),
          file_path = COALESCE($9, file_path),
          file_metadata = COALESCE($10, file_metadata),
          version = $11,
          updated_at = $12
        WHERE id = $13 AND user_id = $14
        RETURNING *
      `

      const params = [
        updates.title,
        updates.author,
        updates.publication,
        updates.date,
        updates.url,
        updates.citationStyle,
        updates.authorQualifications,
        updates.studyMethodology,
        updates.filePath,
        updates.fileMetadata ? JSON.stringify(updates.fileMetadata) : null,
        newVersion,
        now,
        id,
        userId,
      ]

      const result = await executeQuerySingle(query, params)
      return result ? this.mapRowToSource(result) : null
    } catch (error) {
      console.error("Error updating source:", error)
      throw new Error("Failed to update source")
    }
  }

  async deleteSource(id: string, userId: string): Promise<boolean> {
    try {
      // First check if source exists and belongs to user
      const existingSource = await this.getSourceById(id, userId)
      if (!existingSource) {
        return false
      }

      // Delete associated evidence cards first
      await executeQuery(
        "DELETE FROM evidence_cards WHERE source_id = $1 AND user_id = $2",
        [id, userId]
      )

      // Delete the source
      const result = await executeQuery(
        "DELETE FROM sources WHERE id = $1 AND user_id = $2",
        [id, userId]
      )

      return result.rowCount > 0
    } catch (error) {
      console.error("Error deleting source:", error)
      throw new Error("Failed to delete source")
    }
  }

  /**
   * Maps database row to Source domain object
   */
  private mapRowToSource(row: any): Source {
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      publication: row.publication,
      date: row.date ? new Date(row.date) : undefined,
      url: row.url,
      citationStyle: row.citation_style,
      authorQualifications: row.author_qualifications,
      studyMethodology: row.study_methodology,
      filePath: row.file_path,
      fileMetadata: row.file_metadata ? JSON.parse(row.file_metadata) : undefined,
      version: row.version,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      cards: Array.isArray(row.cards) ? row.cards.filter(Boolean) : [],
    }
  }
}
