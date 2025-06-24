/**
 * API route for individual document operations
 * Handles GET, PUT, DELETE operations for specific documents
 */

import { NextRequest, NextResponse } from "next/server"
import { executeQuery, executeQuerySingle } from "@/lib/database"
import type { APIResponse, Document } from "@/lib/types"

/**
 * GET /api/documents/[documentId] - Get a specific document
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
): Promise<NextResponse<APIResponse<Document>>> {
  try {
    const { documentId } = params
    // In real app, get user from authentication middleware
    const userId = "user-123" // Mock user ID

    const row = await executeQuerySingle(
      "SELECT * FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, userId]
    )

    if (!row) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found",
        },
        { status: 404 }
      )
    }

    const document: Document = {
      id: row.id,
      title: row.title,
      content: row.content,
      documentType: row.document_type,
      insertedCards: JSON.parse(row.inserted_cards || "[]"),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      userId: row.user_id,
    }

    return NextResponse.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch document",
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/documents/[documentId] - Update a document
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { documentId: string } }
): Promise<NextResponse<APIResponse<Document>>> {
  try {
    const { documentId } = params
    const body = await request.json()
    const { title, content, insertedCards } = body

    // In real app, get user from authentication middleware
    const userId = "user-123" // Mock user ID

    // Check if document exists and belongs to user
    const existingDoc = await executeQuerySingle(
      "SELECT * FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, userId]
    )

    if (!existingDoc) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found",
        },
        { status: 404 }
      )
    }

    const now = new Date()
    const insertedCardsJson = JSON.stringify(insertedCards || [])

    await executeQuery(
      `UPDATE documents 
       SET title = $1, content = $2, inserted_cards = $3, updated_at = $4
       WHERE id = $5 AND user_id = $6`,
      [title || existingDoc.title, content || existingDoc.content, insertedCardsJson, now, documentId, userId]
    )

    const updatedDocument: Document = {
      id: documentId,
      title: title || existingDoc.title,
      content: content || existingDoc.content,
      documentType: existingDoc.document_type,
      insertedCards: insertedCards || JSON.parse(existingDoc.inserted_cards || "[]"),
      createdAt: new Date(existingDoc.created_at),
      updatedAt: now,
      userId,
    }

    return NextResponse.json({
      success: true,
      data: updatedDocument,
    })
  } catch (error) {
    console.error("Error updating document:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update document",
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/documents/[documentId] - Delete a document
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { documentId: string } }
): Promise<NextResponse<APIResponse<null>>> {
  try {
    const { documentId } = params
    // In real app, get user from authentication middleware
    const userId = "user-123" // Mock user ID

    const result = await executeQuery(
      "DELETE FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, userId]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: null,
    })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete document",
      },
      { status: 500 }
    )
  }
}