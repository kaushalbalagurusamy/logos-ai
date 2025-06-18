import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { services } from "@/lib/services/service-registry"
import { withAuth } from "@/lib/middleware/auth-middleware"

export const GET = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const url = new URL(request.url)
    const filters = {
      type: url.searchParams.get("type") || undefined,
      tags: url.searchParams.get("tags")?.split(",") || undefined,
      search: url.searchParams.get("search") || undefined,
      authorId: url.searchParams.get("authorId") || undefined,
      limit: Number.parseInt(url.searchParams.get("limit") || "50"),
      offset: Number.parseInt(url.searchParams.get("offset") || "0"),
    }

    const result = await services.prepBank.getEntries(filters)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch entries" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, { user }: { user: any }) => {
  try {
    const body = await request.json()
    body.author_id = user.id // Ensure the authenticated user is set as author

    const result = await services.prepBank.createEntry(body)

    return NextResponse.json(result, { status: result.success ? 201 : 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create entry" }, { status: 500 })
  }
})
