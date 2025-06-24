import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"

export const GET = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)

    const sourceId = searchParams.get("sourceId")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    let cards

    if (sourceId) {
      // Get cards for a specific source
      cards = await services.evidenceCards.getCardsBySourceId(sourceId, user.id)
    } else if (search) {
      // Search across all cards
      cards = await services.evidenceCards.searchCards(user.id, search, { limit, offset })
    } else {
      // Return empty array if no specific query
      cards = []
    }

    return NextResponse.json(createSuccessResponse(cards, "Evidence cards retrieved successfully"))
  } catch (error) {
    console.error("Error in GET /api/evidence-cards:", error)
    return NextResponse.json(createErrorResponse("Failed to retrieve evidence cards"), { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const body = await parseRequestBody(request)

    // Validate required fields
    const validation = validateRequired(body, ["sourceId", "tagLine", "evidence"])
    if (!validation.isValid) {
      return NextResponse.json(createErrorResponse(`Missing required fields: ${validation.missingFields.join(", ")}`), {
        status: 400,
      })
    }

    const cardData = {
      sourceId: body.sourceId,
      tagLine: body.tagLine,
      evidence: body.evidence,
      shorthand: body.shorthand,
      formattingData: body.formattingData,
      positionInSource: body.positionInSource,
      userId: user.id,
    }

    const card = await services.evidenceCards.createCard(cardData)

    return NextResponse.json(createSuccessResponse(card, "Evidence card created successfully"), { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/evidence-cards:", error)
    return NextResponse.json(createErrorResponse("Failed to create evidence card"), { status: 500 })
  }
}) 