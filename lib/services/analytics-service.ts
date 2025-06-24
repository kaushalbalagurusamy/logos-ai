/**
 * Analytics Service
 * Manages CRUD operations for analytics entries and organizational folders
 */

import { executeQuery, executeQuerySingle } from "@/lib/database"
import type { Analytics, AnalyticsFolder, AnalyticsLink } from "@/lib/types"
import { BaseService } from "./base-service"

export class AnalyticsService extends BaseService {
  /**
   * Retrieves analytics entries for a user, optionally filtered by folder
   */
  async getAnalytics(
    userId: string,
    filters: {
      folderId?: string
      search?: string
      tags?: string[]
      limit?: number
      offset?: number
    } = {}
  ): Promise<Analytics[]> {
    try {
      let query = `
        SELECT a.*, af.name as folder_name
        FROM analytics a
        LEFT JOIN analytics_folders af ON a.folder_id = af.id
        WHERE a.user_id = $1
      `

      const params: any[] = [userId]
      let paramIndex = 2

      // Add folder filter
      if (filters.folderId) {
        query += ` AND a.folder_id = $${paramIndex}`
        params.push(filters.folderId)
        paramIndex++
      }

      // Add search filter
      if (filters.search) {
        query += ` AND (
          a.title ILIKE $${paramIndex} OR 
          a.content ILIKE $${paramIndex} OR
          a.summary ILIKE $${paramIndex}
        )`
        params.push(`%${filters.search}%`)
        paramIndex++
      }

      // Add tags filter
      if (filters.tags && filters.tags.length > 0) {
        query += ` AND a.tags && $${paramIndex}`
        params.push(filters.tags)
        paramIndex++
      }

      query += ` ORDER BY a.updated_at DESC`

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
      return result.rows.map(this.mapRowToAnalytics)
    } catch (error) {
      console.error("Error getting analytics:", error)
      throw new Error("Failed to retrieve analytics")
    }
  }

  /**
   * Retrieves a specific analytics entry by ID
   */
  async getAnalyticsById(id: string, userId: string): Promise<Analytics | null> {
    try {
      const query = `
        SELECT a.*, af.name as folder_name
        FROM analytics a
        LEFT JOIN analytics_folders af ON a.folder_id = af.id
        WHERE a.id = $1 AND a.user_id = $2
      `

      const result = await executeQuerySingle(query, [id, userId])
      return result ? this.mapRowToAnalytics(result) : null
    } catch (error) {
      console.error("Error getting analytics by ID:", error)
      throw new Error("Failed to retrieve analytics")
    }
  }

  /**
   * Creates a new analytics entry
   */
  async createAnalytics(
    analyticsData: Omit<Analytics, "id" | "version" | "createdAt" | "updatedAt">
  ): Promise<Analytics> {
    try {
      const id = this.generateId()
      const now = new Date()

      const query = `
        INSERT INTO analytics (
          id, title, content, summary, author_id, folder_id, linked_source_id,
          linked_card_id, link_type, formatting_preferences, tags, version,
          user_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `

      const params = [
        id,
        analyticsData.title,
        analyticsData.content,
        analyticsData.summary || null,
        analyticsData.authorId,
        analyticsData.folderId || null,
        analyticsData.linkedSourceId || null,
        analyticsData.linkedCardId || null,
        analyticsData.linkType || null,
        JSON.stringify(analyticsData.formattingPreferences),
        JSON.stringify(analyticsData.tags),
        1, // Initial version
        analyticsData.userId,
        now,
        now,
      ]

      const result = await executeQuerySingle(query, params)
      return this.mapRowToAnalytics(result)
    } catch (error) {
      console.error("Error creating analytics:", error)
      throw new Error("Failed to create analytics")
    }
  }

  /**
   * Updates an existing analytics entry
   */
  async updateAnalytics(
    id: string,
    userId: string,
    updates: Partial<Omit<Analytics, "id" | "userId" | "createdAt">>
  ): Promise<Analytics | null> {
    try {
      // Check if analytics exists and belongs to user
      const existingAnalytics = await this.getAnalyticsById(id, userId)
      if (!existingAnalytics) {
        return null
      }

      const now = new Date()
      const newVersion = existingAnalytics.version + 1

      const query = `
        UPDATE analytics SET
          title = COALESCE($1, title),
          content = COALESCE($2, content),
          summary = COALESCE($3, summary),
          folder_id = COALESCE($4, folder_id),
          linked_source_id = COALESCE($5, linked_source_id),
          linked_card_id = COALESCE($6, linked_card_id),
          link_type = COALESCE($7, link_type),
          formatting_preferences = COALESCE($8, formatting_preferences),
          tags = COALESCE($9, tags),
          version = $10,
          updated_at = $11
        WHERE id = $12 AND user_id = $13
        RETURNING *
      `

      const params = [
        updates.title,
        updates.content,
        updates.summary,
        updates.folderId,
        updates.linkedSourceId,
        updates.linkedCardId,
        updates.linkType,
        updates.formattingPreferences ? JSON.stringify(updates.formattingPreferences) : null,
        updates.tags ? JSON.stringify(updates.tags) : null,
        newVersion,
        now,
        id,
        userId,
      ]

      const result = await executeQuerySingle(query, params)
      return result ? this.mapRowToAnalytics(result) : null
    } catch (error) {
      console.error("Error updating analytics:", error)
      throw new Error("Failed to update analytics")
    }
  }

  /**
   * Deletes an analytics entry
   */
  async deleteAnalytics(id: string, userId: string): Promise<boolean> {
    try {
      // Delete associated links first
      await executeQuery(
        "DELETE FROM analytics_links WHERE analytics_id = $1",
        [id]
      )

      const result = await executeQuery(
        "DELETE FROM analytics WHERE id = $1 AND user_id = $2",
        [id, userId]
      )

      return result.rowCount > 0
    } catch (error) {
      console.error("Error deleting analytics:", error)
      throw new Error("Failed to delete analytics")
    }
  }

  /**
   * Creates a copy of an analytics entry
   */
  async duplicateAnalytics(id: string, userId: string): Promise<Analytics | null> {
    try {
      const original = await this.getAnalyticsById(id, userId)
      if (!original) {
        return null
      }

      const duplicateData = {
        ...original,
        title: `${original.title} (Copy)`,
        authorId: userId, // Set current user as author of duplicate
        userId,
      }

      // Remove fields that shouldn't be duplicated
      delete (duplicateData as any).id
      delete (duplicateData as any).version
      delete (duplicateData as any).createdAt
      delete (duplicateData as any).updatedAt

      return this.createAnalytics(duplicateData)
    } catch (error) {
      console.error("Error duplicating analytics:", error)
      throw new Error("Failed to duplicate analytics")
    }
  }

  /**
   * Maps database row to Analytics domain object
   */
  private mapRowToAnalytics(row: any): Analytics {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      summary: row.summary,
      authorId: row.author_id,
      folderId: row.folder_id,
      linkedSourceId: row.linked_source_id,
      linkedCardId: row.linked_card_id,
      linkType: row.link_type,
      formattingPreferences: JSON.parse(row.formatting_preferences),
      tags: JSON.parse(row.tags),
      version: row.version,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
} 