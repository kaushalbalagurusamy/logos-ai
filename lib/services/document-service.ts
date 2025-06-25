/**
 * Document service for managing documents and document folders
 * Handles CRUD operations, search functionality, and @ mention integration
 */

import { BaseService } from "./base-service"
import type { 
  Document, 
  DocumentFolder, 
  EvidenceCard, 
  Analytics, 
  Source,
  InsertionItem,
  CardInsertionData,
  AnalyticsInsertionData 
} from "@/lib/types"
import { executeQuery } from "@/lib/database"

export class DocumentService extends BaseService {
  /**
   * Gets all documents for a user
   */
  async getDocuments(userId: string): Promise<Document[]> {
    const result = await executeQuery(
      "SELECT * FROM documents WHERE user_id = $1 ORDER BY updated_at DESC",
      [userId]
    )
    return result.rows as Document[]
  }

  /**
   * Gets all document folders for a user
   */
  async getDocumentFolders(userId: string): Promise<DocumentFolder[]> {
    const result = await executeQuery(
      "SELECT * FROM document_folders WHERE user_id = $1 ORDER BY name ASC",
      [userId]
    )
    return result.rows as DocumentFolder[]
  }

  /**
   * Gets a specific document by ID
   */
  async getDocument(documentId: string, userId: string): Promise<Document | null> {
    const result = await executeQuery(
      "SELECT * FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, userId]
    )
    return result.rows[0] as Document || null
  }

  /**
   * Creates a new document
   */
  async createDocument(
    title: string,
    content: string,
    userId: string,
    folderId?: string
  ): Promise<Document> {
    const document: Document = {
      id: this.generateId(),
      title,
      content,
      folderId,
      embeddedCards: [],
      embeddedAnalytics: [],
      version: 1,
      userId,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp()
    }

    await executeQuery(
      `INSERT INTO documents (id, title, content, folder_id, embedded_cards, embedded_analytics, version, user_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        document.id,
        document.title,
        document.content,
        document.folderId,
        JSON.stringify(document.embeddedCards),
        JSON.stringify(document.embeddedAnalytics),
        document.version,
        document.userId,
        document.createdAt,
        document.updatedAt
      ]
    )

    return document
  }

  /**
   * Updates an existing document
   */
  async updateDocument(
    documentId: string,
    updates: Partial<Document>,
    userId: string
  ): Promise<Document | null> {
    const existing = await this.getDocument(documentId, userId)
    if (!existing) return null

    const updatedDocument = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: this.getCurrentTimestamp()
    }

    await executeQuery(
      `UPDATE documents SET 
        title = $1, content = $2, folder_id = $3, embedded_cards = $4, embedded_analytics = $5, 
        formatting_data = $6, version = $7, updated_at = $8
       WHERE id = $9 AND user_id = $10`,
      [
        updatedDocument.title,
        updatedDocument.content,
        updatedDocument.folderId,
        JSON.stringify(updatedDocument.embeddedCards),
        JSON.stringify(updatedDocument.embeddedAnalytics),
        JSON.stringify(updatedDocument.formattingData),
        updatedDocument.version,
        updatedDocument.updatedAt,
        documentId,
        userId
      ]
    )

    return updatedDocument
  }

  /**
   * Deletes a document
   */
  async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    const result = await executeQuery(
      "DELETE FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, userId]
    )
    return result.rowCount > 0
  }

  /**
   * Creates a new document folder
   */
  async createDocumentFolder(
    name: string,
    userId: string,
    parentId?: string
  ): Promise<DocumentFolder> {
    const folder: DocumentFolder = {
      id: this.generateId(),
      name,
      parentId,
      userId,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
      documents: []
    }

    await executeQuery(
      `INSERT INTO document_folders (id, name, parent_id, user_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [folder.id, folder.name, folder.parentId, folder.userId, folder.createdAt, folder.updatedAt]
    )

    return folder
  }

  /**
   * Searches for evidence cards and analytics for @ mention functionality
   */
  async searchForInsertions(query: string, userId: string): Promise<InsertionItem[]> {
    const items: InsertionItem[] = []
    
    // Search evidence cards
    const cardsResult = await executeQuery(
      `SELECT ec.*, s.* FROM evidence_cards ec 
       JOIN sources s ON ec.source_id = s.id 
       WHERE ec.user_id = $1 AND (
         ec.tag_line LIKE $2 OR 
         ec.shorthand LIKE $3 OR 
         ec.evidence LIKE $4 OR
         s.title LIKE $5 OR
         s.author LIKE $6
       )
       ORDER BY ec.updated_at DESC
       LIMIT 10`,
      [userId, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    )

    for (const row of cardsResult.rows) {
      const card = row as EvidenceCard & Source
      const source: Source = {
        id: card.sourceId,
        title: card.title,
        author: card.author,
        publication: card.publication,
        date: card.date,
        url: card.url,
        citationStyle: card.citationStyle,
        authorQualifications: card.authorQualifications,
        studyMethodology: card.studyMethodology,
        version: card.version,
        userId: card.userId,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        cards: []
      }

      const formattedText = this.formatCardInsertion(card, source)
      
      items.push({
        id: card.id,
        type: "card",
        title: card.tagLine,
        searchableText: `${card.tagLine} ${card.shorthand} ${card.evidence} ${source.title} ${source.author}`,
        insertionData: {
          type: "card",
          card,
          source,
          formattedText
        } as CardInsertionData
      })
    }

    // Search analytics
    const analyticsResult = await executeQuery(
      `SELECT * FROM analytics 
       WHERE user_id = $1 AND (
         title LIKE $2 OR 
         content LIKE $3 OR 
         summary LIKE $4
       )
       ORDER BY updated_at DESC
       LIMIT 10`,
      [userId, `%${query}%`, `%${query}%`, `%${query}%`]
    )

    for (const row of analyticsResult.rows) {
      const analytics = row as Analytics
      const formattedText = this.formatAnalyticsInsertion(analytics)
      
      items.push({
        id: analytics.id,
        type: "analytics",
        title: analytics.title,
        searchableText: `${analytics.title} ${analytics.content} ${analytics.summary}`,
        insertionData: {
          type: "analytics",
          analytics,
          formattedText
        } as AnalyticsInsertionData
      })
    }

    return items.sort((a, b) => a.title.localeCompare(b.title))
  }

  /**
   * Formats a card insertion according to the specified format:
   * <[Impact = Size 12 Bold Times New Roman] Tagline> <[Impact] Author> <[Impact] Date> 
   * (<[Minimize] Author Qualifications>) (<[Minimize] Study Methodology>) <[Preserve Cut Format] Evidence>
   */
  private formatCardInsertion(card: EvidenceCard, source: Source): string {
    const tagline = card.tagLine
    const author = source.author || "Unknown Author"
    const date = source.date ? source.date.getFullYear().toString() : "Unknown Date"
    const authorQuals = source.authorQualifications || ""
    const methodology = source.studyMethodology || ""
    const evidence = card.evidence

    // Format with the specified structure
    let formatted = `<[Impact = Size 12 Bold Times New Roman] ${tagline}> `
    formatted += `<[Impact] ${author}> `
    formatted += `<[Impact] ${date}> `
    
    if (authorQuals) {
      formatted += `(<[Minimize] ${authorQuals}>) `
    }
    
    if (methodology) {
      formatted += `(<[Minimize] ${methodology}>) `
    }
    
    formatted += `<[Preserve Cut Format] ${evidence}>`

    return formatted
  }

  /**
   * Formats analytics insertion in Impact formatting
   */
  private formatAnalyticsInsertion(analytics: Analytics): string {
    return `<[Impact] ${analytics.content}>`
  }
}