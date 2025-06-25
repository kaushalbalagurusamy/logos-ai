/**
 * API routes for individual document operations
 * Handles GET, PUT, DELETE for specific documents
 */

import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils"

/**
 * GET /api/documents/[documentId] - Get a specific document
 */
export const GET = withAuth(async (
  request: NextRequest,
  { user, params }: { user: any; params: Promise<{ documentId: string }> }
) => {
  try {
    const { documentId } = await params
    const document = await services.documents.getDocument(documentId, user.id)
    
    if (!document) {
      throw new Error("Document not found")
    }
    
    return NextResponse.json(createSuccessResponse(document, "Document retrieved successfully"))
  } catch (error) {
    return NextResponse.json(createErrorResponse(error instanceof Error ? error.message : "Failed to fetch document"))
  }
})

/**
 * PUT /api/documents/[documentId] - Update a specific document
 */
export const PUT = withAuth(async (
  request: NextRequest,
  { user, params }: { user: any; params: Promise<{ documentId: string }> }
) => {
  try {
    const { documentId } = await params
    const body = await request.json()
    const { title, content, folderId, embeddedCards, embeddedAnalytics, formattingData } = body

    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (content !== undefined) updates.content = content
    if (folderId !== undefined) updates.folderId = folderId
    if (embeddedCards !== undefined) updates.embeddedCards = embeddedCards
    if (embeddedAnalytics !== undefined) updates.embeddedAnalytics = embeddedAnalytics
    if (formattingData !== undefined) updates.formattingData = formattingData

    const document = await services.documents.updateDocument(documentId, updates, user.id)
    
    if (!document) {
      throw new Error("Document not found")
    }
    
    return NextResponse.json(createSuccessResponse(document, "Document updated successfully"))
  } catch (error) {
    return NextResponse.json(createErrorResponse(error instanceof Error ? error.message : "Failed to update document"))
  }
})

/**
 * DELETE /api/documents/[documentId] - Delete a specific document
 */
export const DELETE = withAuth(async (
  request: NextRequest,
  { user, params }: { user: any; params: Promise<{ documentId: string }> }
) => {
  try {
    const { documentId } = await params
    const success = await services.documents.deleteDocument(documentId, user.id)
    
    if (!success) {
      throw new Error("Document not found or could not be deleted")
    }
    
    return NextResponse.json(createSuccessResponse({ deleted: true }, "Document deleted successfully"))
  } catch (error) {
    return NextResponse.json(createErrorResponse(error instanceof Error ? error.message : "Failed to delete document"))
  }
})