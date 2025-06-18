import { sql } from "@/lib/database"
import type { APIResponse } from "@/lib/types"

export abstract class BaseService {
  protected async executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const result = await sql(query, params)
      return result as T[]
    } catch (error) {
      console.error(`Database query error in ${this.constructor.name}:`, error)
      throw new Error(`Database operation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  protected async executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
    const results = await this.executeQuery<T>(query, params)
    return results.length > 0 ? results[0] : null
  }

  protected createSuccessResponse<T>(data: T, message?: string): APIResponse<T> {
    return {
      success: true,
      data,
      message,
    }
  }

  protected createErrorResponse(error: string): APIResponse {
    return {
      success: false,
      error,
    }
  }

  protected validateRequired(data: any, fields: string[]): void {
    for (const field of fields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }
  }
}
