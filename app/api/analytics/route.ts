import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"

export const GET = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      folderId: searchParams.get("folderId") || undefined,
      search: searchParams.get("search") || undefined,
      tags: searchParams.get("tags")?.split(",") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined,
    }

    const analytics = await services.analytics.getAnalytics(user.id, filters)

    return NextResponse.json(createSuccessResponse(analytics, "Analytics retrieved successfully"))
  } catch (error) {
    console.error("Error in GET /api/analytics:", error)
    return NextResponse.json(createErrorResponse("Failed to retrieve analytics"), { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const body = await parseRequestBody(request)

    // Validate required fields
    const validation = validateRequired(body, ["title", "content"])
    if (!validation.isValid) {
      return NextResponse.json(createErrorResponse(`Missing required fields: ${validation.missingFields.join(", ")}`), {
        status: 400,
      })
    }

    // Validate formatting preferences
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

    // Validate link type if provided
    if (body.linkType && !["paraphrase", "comparison", "extension", "response"].includes(body.linkType)) {
      return NextResponse.json(
        createErrorResponse("Invalid link type. Must be paraphrase, comparison, extension, or response"),
        { status: 400 }
      )
    }

    const analyticsData = {
      title: body.title,
      content: body.content,
      summary: body.summary,
      authorId: user.id,
      folderId: body.folderId,
      linkedSourceId: body.linkedSourceId,
      linkedCardId: body.linkedCardId,
      linkType: body.linkType,
      formattingPreferences: body.formattingPreferences || {
        font: "Times New Roman",
        size: 12,
        bold: false,
        italic: false,
      },
      tags: body.tags || [],
      userId: user.id,
    }

    const analytics = await services.analytics.createAnalytics(analyticsData)

    return NextResponse.json(createSuccessResponse(analytics, "Analytics created successfully"), { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/analytics:", error)
    return NextResponse.json(createErrorResponse("Failed to create analytics"), { status: 500 })
  }
}) 