import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"

export const GET = withAuth(
  async (request: NextRequest, { params, user }: { params: { sourceId: string }; user: any }) => {
    try {
      const { sourceId } = params

      if (!sourceId) {
        return NextResponse.json(createErrorResponse("Source ID is required"), { status: 400 })
      }

      const source = await services.sources.getSourceById(sourceId, user.id)

      if (!source) {
        return NextResponse.json(createErrorResponse("Source not found"), { status: 404 })
      }

      return NextResponse.json(createSuccessResponse(source, "Source retrieved successfully"))
    } catch (error) {
      console.error("Error in GET /api/sources/[sourceId]:", error)
      return NextResponse.json(createErrorResponse("Failed to retrieve source"), { status: 500 })
    }
  },
)

export const PUT = withAuth(
  async (request: NextRequest, { params, user }: { params: { sourceId: string }; user: any }) => {
    try {
      const { sourceId } = params

      if (!sourceId) {
        return NextResponse.json(createErrorResponse("Source ID is required"), { status: 400 })
      }

      const body = await parseRequestBody(request)

      // Validate citation style if provided
      if (body.citationStyle && !["MLA", "APA", "Chicago"].includes(body.citationStyle)) {
        return NextResponse.json(createErrorResponse("Invalid citation style. Must be MLA, APA, or Chicago"), {
          status: 400,
        })
      }

      // Validate date format if provided
      if (body.date) {
        const date = new Date(body.date)
        if (isNaN(date.getTime())) {
          return NextResponse.json(createErrorResponse("Invalid date format"), { status: 400 })
        }
        body.date = date
      }

      // Validate file metadata if provided
      if (body.fileMetadata) {
        const requiredMetadataFields = ["size", "type", "uploadDate", "originalName"]
        const metadataValidation = validateRequired(body.fileMetadata, requiredMetadataFields)
        if (!metadataValidation.isValid) {
          return NextResponse.json(
            createErrorResponse(`Invalid file metadata. Missing: ${metadataValidation.missingFields.join(", ")}`),
            { status: 400 },
          )
        }
        body.fileMetadata.uploadDate = new Date(body.fileMetadata.uploadDate)
      }

      const updatedSource = await services.sources.updateSource(sourceId, user.id, body)

      if (!updatedSource) {
        return NextResponse.json(createErrorResponse("Source not found or access denied"), { status: 404 })
      }

      return NextResponse.json(createSuccessResponse(updatedSource, "Source updated successfully"))
    } catch (error) {
      console.error("Error in PUT /api/sources/[sourceId]:", error)
      return NextResponse.json(createErrorResponse("Failed to update source"), { status: 500 })
    }
  },
)

export const DELETE = withAuth(
  async (request: NextRequest, { params, user }: { params: { sourceId: string }; user: any }) => {
    try {
      const { sourceId } = params

      if (!sourceId) {
        return NextResponse.json(createErrorResponse("Source ID is required"), { status: 400 })
      }

      const deleted = await services.sources.deleteSource(sourceId, user.id)

      if (!deleted) {
        return NextResponse.json(createErrorResponse("Source not found or access denied"), { status: 404 })
      }

      return NextResponse.json(createSuccessResponse(null, "Source deleted successfully"))
    } catch (error) {
      console.error("Error in DELETE /api/sources/[sourceId]:", error)
      return NextResponse.json(createErrorResponse("Failed to delete source"), { status: 500 })
    }
  },
)
