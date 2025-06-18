import { type NextRequest, NextResponse } from "next/server"
import type { APIResponse } from "./types"

export function createSuccessResponse<T>(data: T, message?: string): NextResponse<APIResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

export function createErrorResponse(error: string, status = 400): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  )
}

export async function parseRequestBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json()
  } catch (error) {
    throw new Error("Invalid JSON in request body")
  }
}

export function getSearchParams(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries())
}

export function validateRequired(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`)
    }
  }
}
