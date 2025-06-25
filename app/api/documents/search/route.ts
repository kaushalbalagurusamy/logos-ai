/**
 * API route for searching insertable items (cards and analytics)
 * Used by the @ mention functionality
 */

import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils"

/**
 * GET /api/documents/search - Search for cards and analytics for insertion
 */
export const GET = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    
    if (query.length < 2) {
      return NextResponse.json(createSuccessResponse([], "Search query too short"))
    }
    
    const results = await services.documents.searchForInsertions(query, user.id)
    
    return NextResponse.json(createSuccessResponse(results, "Search completed successfully"))
  } catch (error) {
    return NextResponse.json(createErrorResponse(error instanceof Error ? error.message : "Search failed"))
  }
})