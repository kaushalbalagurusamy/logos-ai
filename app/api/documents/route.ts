/**
 * API route for document management
 * Handles CRUD operations for documents in the document writer feature
 */

import { NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/database"
import type { APIResponse, Document } from "@/lib/types"

/**
 * GET /api/documents - Retrieve all documents for authenticated user
 */
export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<Document[]>>> {
  try {
    // In real app, get user from authentication middleware
    const userId = "user-123" // Mock user ID

    const result = await executeQuery(
      "SELECT * FROM documents WHERE user_id = $1 ORDER BY updated_at DESC",
      [userId]
    )

    const documents: Document[] = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      documentType: row.document_type,
      insertedCards: JSON.parse(row.inserted_cards || "[]"),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      userId: row.user_id,
    }))

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch documents",
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/documents - Create a new document
 */
export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<Document>>> {
  try {
    const body = await request.json()
    const { title, content, documentType } = body

    // Basic validation
    if (!title || !content || !documentType) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, content, and documentType are required",
        },
        { status: 400 }
      )
    }

    if (!["case", "brief", "notes"].includes(documentType)) {
      return NextResponse.json(
        {
          success: false,
          error: "documentType must be one of: case, brief, notes",
        },
        { status: 400 }
      )
    }

    // In real app, get user from authentication middleware
    const userId = "user-123" // Mock user ID
    const documentId = `doc-${Date.now()}`
    const now = new Date()

    await executeQuery(
      `INSERT INTO documents (id, title, content, document_type, inserted_cards, user_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [documentId, title, content, documentType, "[]", userId, now, now]
    )

    const newDocument: Document = {
      id: documentId,
      title,
      content,
      documentType: documentType as "case" | "brief" | "notes",
      insertedCards: [],
      createdAt: now,
      updatedAt: now,
      userId,
    }

    return NextResponse.json({
      success: true,
      data: newDocument,
    })
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create document",
      },
      { status: 500 }
    )
  }
}