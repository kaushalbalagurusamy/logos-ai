import type { NextRequest } from "next/server"
import { createErrorResponse } from "@/lib/api-utils"
import { executeQuerySingle } from "@/lib/database"
import type { PrepBankEntry } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const entry = await executeQuerySingle<PrepBankEntry>("SELECT * FROM prep_bank_entries WHERE id = $1", [
      params.entryId,
    ])

    if (!entry) {
      return createErrorResponse("Entry not found", 404)
    }

    // Return JSON export
    return new Response(JSON.stringify(entry, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="entry-${params.entryId}.json"`,
      },
    })
  } catch (error) {
    return createErrorResponse("Export failed", 500)
  }
}
