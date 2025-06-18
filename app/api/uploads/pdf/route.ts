import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return createErrorResponse("No file provided", 400)
    }

    if (file.type !== "application/pdf") {
      return createErrorResponse("Only PDF files are allowed", 400)
    }

    // In a real app, you'd upload to cloud storage (Vercel Blob, S3, etc.)
    const fileUrl = `https://example.com/uploads/${Date.now()}-${file.name}`

    return createSuccessResponse(
      {
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        upload_time: new Date().toISOString(),
      },
      "File uploaded successfully",
    )
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : "File upload failed", 500)
  }
}
