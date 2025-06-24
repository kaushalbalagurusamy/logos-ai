import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"

export const GET = withAuth(
  async (request: NextRequest, { params, user }: { params?: { analyticsId: string }; user: any }) => {
    try {
      const analyticsId = params?.analyticsId

      if (!analyticsId) {
        return NextResponse.json(createErrorResponse("Analytics ID is required"), { status: 400 })
      }

      const analytics = await services.analytics.getAnalyticsById(analyticsId, user.id)

      if (!analytics) {
        return NextResponse.json(createErrorResponse("Analytics not found"), { status: 404 })
      }

      return NextResponse.json(createSuccessResponse(analytics, "Analytics retrieved successfully"))
    } catch (error) {
      console.error("Error in GET /api/analytics/[analyticsId]:", error)
      return NextResponse.json(createErrorResponse("Failed to retrieve analytics"), { status: 500 })
    }
  },
)

export const PUT = withAuth(
  async (request: NextRequest, { params, user }: { params?: { analyticsId: string }; user: any }) => {
    try {
      const analyticsId = params?.analyticsId

      if (!analyticsId) {
        return NextResponse.json(createErrorResponse("Analytics ID is required"), { status: 400 })
      }

      const body = await parseRequestBody(request)

      // Validate link type if provided
      if (body.linkType && !["paraphrase", "comparison", "extension", "response"].includes(body.linkType)) {
        return NextResponse.json(
          createErrorResponse("Invalid link type. Must be paraphrase, comparison, extension, or response"),
          { status: 400 }
        )
      }

      // Validate formatting preferences if provided
      if (body.formattingPreferences) {
        const requiredFormattingFields = ["font", "size", "bold", "italic"]
        const formattingValidation = validateRequired(body.formattingPreferences, requiredFormattingFields)
        if (!formattingValidation.isValid) {
          return NextResponse.json(
            createErrorResponse(`Invalid formatting preferences. Missing: ${formattingValidation.missingFields.join(", ")}`),
            { status: 400 },
          )
        }
      }

      const updatedAnalytics = await services.analytics.updateAnalytics(analyticsId, user.id, body)

      if (!updatedAnalytics) {
        return NextResponse.json(createErrorResponse("Analytics not found or access denied"), { status: 404 })
      }

      return NextResponse.json(createSuccessResponse(updatedAnalytics, "Analytics updated successfully"))
    } catch (error) {
      console.error("Error in PUT /api/analytics/[analyticsId]:", error)
      return NextResponse.json(createErrorResponse("Failed to update analytics"), { status: 500 })
    }
  },
)

export const DELETE = withAuth(
  async (request: NextRequest, { params, user }: { params?: { analyticsId: string }; user: any }) => {
    try {
      const analyticsId = params?.analyticsId

      if (!analyticsId) {
        return NextResponse.json(createErrorResponse("Analytics ID is required"), { status: 400 })
      }

      const deleted = await services.analytics.deleteAnalytics(analyticsId, user.id)

      if (!deleted) {
        return NextResponse.json(createErrorResponse("Analytics not found or access denied"), { status: 404 })
      }

      return NextResponse.json(createSuccessResponse(null, "Analytics deleted successfully"))
    } catch (error) {
      console.error("Error in DELETE /api/analytics/[analyticsId]:", error)
      return NextResponse.json(createErrorResponse("Failed to delete analytics"), { status: 500 })
    }
  },
) 