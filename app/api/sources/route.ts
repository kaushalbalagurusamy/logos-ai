import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth-middleware"
import { services } from "@/lib/services/service-registry"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"

export const GET = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      search: searchParams.get("search") || undefined,
      citationStyle: (searchParams.get("citationStyle") as "MLA" | "APA" | "Chicago") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined,
    }

    // Validate citation style if provided
    if (filters.citationStyle && !["MLA", "APA", "Chicago"].includes(filters.citationStyle)) {
      return NextResponse.json(createErrorResponse("Invalid citation style. Must be MLA, APA, or Chicago"), {
        status: 400,
      })
    }

    const sources = await services.sources.getSources(user.id, filters)

    return NextResponse.json(createSuccessResponse(sources, "Sources retrieved successfully"))
  } catch (error) {
    console.error("Error in GET /api/sources:", error)
    return NextResponse.json(createErrorResponse("Failed to retrieve sources"), { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const body = await parseRequestBody(request)

    // Validate required fields
    const validation = validateRequired(body, ["title", "citationStyle"])
    if (!validation.isValid) {
      return NextResponse.json(createErrorResponse(`Missing required fields: ${validation.missingFields.join(", ")}`), {
        status: 400,
      })
    }

    // Validate citation style
    if (!["MLA", "APA", "Chicago"].includes(body.citationStyle)) {
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

    const sourceData = {
      title: body.title,
      author: body.author,
      publication: body.publication,
      date: body.date,
      url: body.url,
      citationStyle: body.citationStyle,
      authorQualifications: body.authorQualifications,
      studyMethodology: body.studyMethodology,
      filePath: body.filePath,
      fileMetadata: body.fileMetadata,
      userId: user.id,
    }

    const source = await services.sources.createSource(sourceData)

    return NextResponse.json(createSuccessResponse(source, "Source created successfully"), { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/sources:", error)
    return NextResponse.json(createErrorResponse("Failed to create source"), { status: 500 })
  }
})
