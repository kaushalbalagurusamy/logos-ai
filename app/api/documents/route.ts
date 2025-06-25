/**
 * API routes for document management
 * Handles CRUD operations for documents and folders
 */

import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils"

/**
 * GET /api/documents - Get all documents for authenticated user
 */
export const GET = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const documents = await services.documents.getDocuments(user.id)
    const folders = await services.documents.getDocumentFolders(user.id)
    
    return NextResponse.json(createSuccessResponse({
      documents,
      folders
    }, "Documents retrieved successfully"))
  } catch (error) {
    return NextResponse.json(createErrorResponse(error instanceof Error ? error.message : "Failed to fetch documents"))
  }
})

/**
 * POST /api/documents - Create a new document
 */
export const POST = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const body = await request.json()
    const { title, content = "", folderId } = body

    if (!title?.trim()) {
      throw new Error("Document title is required")
    }

    const document = await services.documents.createDocument(title.trim(), content, user.id, folderId)
    
    return NextResponse.json(createSuccessResponse(document, "Document created successfully"))
  } catch (error) {
    return NextResponse.json(createErrorResponse(error instanceof Error ? error.message : "Failed to create document"))
  }
})