import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils"

export const POST = withAuth(
  async (request: NextRequest, { params, user }: { params?: { analyticsId: string }; user: any }) => {
    try {
      const analyticsId = params?.analyticsId

      if (!analyticsId) {
        return NextResponse.json(createErrorResponse("Analytics ID is required"), { status: 400 })
      }

      const duplicatedAnalytics = await services.analytics.duplicateAnalytics(analyticsId, user.id)

      if (!duplicatedAnalytics) {
        return NextResponse.json(createErrorResponse("Analytics not found or access denied"), { status: 404 })
      }

      return NextResponse.json(createSuccessResponse(duplicatedAnalytics, "Analytics duplicated successfully"), { status: 201 })
    } catch (error) {
      console.error("Error in POST /api/analytics/[analyticsId]/duplicate:", error)
      return NextResponse.json(createErrorResponse("Failed to duplicate analytics"), { status: 500 })
    }
  },
) 