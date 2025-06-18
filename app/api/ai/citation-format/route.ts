import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse, parseRequestBody, validateRequired } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{
      author: string
      title: string
      publication?: string
      year?: string
      volume?: string
      issue?: string
      pages?: string
      url?: string
    }>(request)
    validateRequired(body, ["author", "title"])

    // Generate MLA citation
    let citation = `${body.author}. "${body.title}."`

    if (body.publication) {
      citation += ` ${body.publication}`
      if (body.volume) citation += `, vol. ${body.volume}`
      if (body.issue) citation += `, no. ${body.issue}`
      if (body.year) citation += `, ${body.year}`
      if (body.pages) citation += `, pp. ${body.pages}`
    }

    citation += "."

    if (body.url) {
      citation += ` Web. ${new Date().toLocaleDateString()}.`
    }

    return createSuccessResponse(
      {
        mla_citation: citation,
        apa_citation: `${body.author} (${body.year}). ${body.title}. ${body.publication}.`,
        chicago_citation: `${body.author}. "${body.title}." ${body.publication} ${body.year}.`,
      },
      "Citation formatted successfully",
    )
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "Citation formatting failed", 500)
  }
}
