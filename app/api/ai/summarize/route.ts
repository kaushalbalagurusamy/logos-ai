import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{ text: string; max_length?: number }>(request)
    validateRequired(body, ["text"])

    // Mock summarization - in real app, use AI service
    const wordCount = body.text.split(" ").length
    const summary = body.text.length > 200 ? body.text.substring(0, body.max_length || 200) + "..." : body.text

    const response = {
      summary,
      original_length: wordCount,
      summary_length: summary.split(" ").length,
      compression_ratio: summary.split(" ").length / wordCount,
    }

    return createSuccessResponse(response, "Summarization completed")
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Summarization failed", 500)
  }
}
