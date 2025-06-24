/**
 * Evidence Card Service
 * Manages CRUD operations for evidence cards associated with sources
 */

import { executeQuery, executeQuerySingle } from "@/lib/database"
import type { EvidenceCard } from "@/lib/types"
import { BaseService } from "./base-service"

export class EvidenceCardService extends BaseService {
  /**
   * Retrieves evidence cards for a specific source
   */
  async getCardsBySourceId(sourceId: string, userId: string): Promise<EvidenceCard[]> {
    try {
      const query = `
        SELECT ec.*, s.title as source_title, s.author as source_author
        FROM evidence_cards ec
        JOIN sources s ON ec.source_id = s.id
        WHERE ec.source_id = $1 AND ec.user_id = $2
        ORDER BY ec.position_in_source ASC, ec.created_at ASC
      `

      const result = await executeQuery(query, [sourceId, userId])
      return result.rows.map(this.mapRowToEvidenceCard)
    } catch (error) {
      console.error("Error getting evidence cards by source ID:", error)
      throw new Error("Failed to retrieve evidence cards")
    }
  }

  /**
   * Retrieves a specific evidence card by ID
   */
  async getCardById(id: string, userId: string): Promise<EvidenceCard | null> {
    try {
      const query = `
        SELECT ec.*, s.title as source_title, s.author as source_author
        FROM evidence_cards ec
        JOIN sources s ON ec.source_id = s.id
        WHERE ec.id = $1 AND ec.user_id = $2
      `

      const result = await executeQuerySingle(query, [id, userId])
      return result ? this.mapRowToEvidenceCard(result) : null
    } catch (error) {
      console.error("Error getting evidence card by ID:", error)
      throw new Error("Failed to retrieve evidence card")
    }
  }

  /**
   * Creates a new evidence card
   */
  async createCard(
    cardData: Omit<EvidenceCard, "id" | "createdAt" | "updatedAt" | "source">
  ): Promise<EvidenceCard> {
    try {
      const id = this.generateId()
      const now = new Date()

      // Validate that the source exists and belongs to the user
      const sourceCheck = await executeQuerySingle(
        "SELECT id FROM sources WHERE id = $1 AND user_id = $2",
        [cardData.sourceId, cardData.userId]
      )

      if (!sourceCheck) {
        throw new Error("Source not found or access denied")
      }

      const query = `
        INSERT INTO evidence_cards (
          id, source_id, tag_line, evidence, shorthand, formatting_data,
          position_in_source, user_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `

      const params = [
        id,
        cardData.sourceId,
        cardData.tagLine,
        cardData.evidence,
        cardData.shorthand || null,
        cardData.formattingData ? JSON.stringify(cardData.formattingData) : null,
        cardData.positionInSource || null,
        cardData.userId,
        now,
        now,
      ]

      const result = await executeQuerySingle(query, params)
      return this.mapRowToEvidenceCard(result)
    } catch (error) {
      console.error("Error creating evidence card:", error)
      throw new Error("Failed to create evidence card")
    }
  }

  /**
   * Updates an existing evidence card
   */
  async updateCard(
    id: string,
    userId: string,
    updates: Partial<Omit<EvidenceCard, "id" | "userId" | "createdAt" | "source">>
  ): Promise<EvidenceCard | null> {
    try {
      // Check if card exists and belongs to user
      const existingCard = await this.getCardById(id, userId)
      if (!existingCard) {
        return null
      }

      const now = new Date()

      const query = `
        UPDATE evidence_cards SET
          tag_line = COALESCE($1, tag_line),
          evidence = COALESCE($2, evidence),
          shorthand = COALESCE($3, shorthand),
          formatting_data = COALESCE($4, formatting_data),
          position_in_source = COALESCE($5, position_in_source),
          updated_at = $6
        WHERE id = $7 AND user_id = $8
        RETURNING *
      `

      const params = [
        updates.tagLine,
        updates.evidence,
        updates.shorthand,
        updates.formattingData ? JSON.stringify(updates.formattingData) : null,
        updates.positionInSource,
        now,
        id,
        userId,
      ]

      const result = await executeQuerySingle(query, params)
      return result ? this.mapRowToEvidenceCard(result) : null
    } catch (error) {
      console.error("Error updating evidence card:", error)
      throw new Error("Failed to update evidence card")
    }
  }

  /**
   * Deletes an evidence card
   */
  async deleteCard(id: string, userId: string): Promise<boolean> {
    try {
      const result = await executeQuery(
        "DELETE FROM evidence_cards WHERE id = $1 AND user_id = $2",
        [id, userId]
      )

      return result.rowCount > 0
    } catch (error) {
      console.error("Error deleting evidence card:", error)
      throw new Error("Failed to delete evidence card")
    }
  }

  /**
   * Searches evidence cards across all sources for a user
   */
  async searchCards(
    userId: string,
    searchQuery: string,
    filters: {
      sourceId?: string
      limit?: number
      offset?: number
    } = {}
  ): Promise<EvidenceCard[]> {
    try {
      let query = `
        SELECT ec.*, s.title as source_title, s.author as source_author
        FROM evidence_cards ec
        JOIN sources s ON ec.source_id = s.id
        WHERE ec.user_id = $1 AND (
          ec.tag_line ILIKE $2 OR 
          ec.evidence ILIKE $2 OR
          ec.shorthand ILIKE $2
        )
      `

      const params: any[] = [userId, `%${searchQuery}%`]
      let paramIndex = 3

      // Add source filter if specified
      if (filters.sourceId) {
        query += ` AND ec.source_id = $${paramIndex}`
        params.push(filters.sourceId)
        paramIndex++
      }

      query += ` ORDER BY ec.updated_at DESC`

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
      return result.rows.map(this.mapRowToEvidenceCard)
    } catch (error) {
      console.error("Error searching evidence cards:", error)
      throw new Error("Failed to search evidence cards")
    }
  }

  /**
   * Maps database row to EvidenceCard domain object
   */
  private mapRowToEvidenceCard(row: any): EvidenceCard {
    return {
      id: row.id,
      sourceId: row.source_id,
      tagLine: row.tag_line,
      evidence: row.evidence,
      shorthand: row.shorthand,
      formattingData: row.formatting_data ? JSON.parse(row.formatting_data) : undefined,
      positionInSource: row.position_in_source,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      // Note: Only partial source data available from this query
      // Full source object would require additional query if needed
    }
  }
} 