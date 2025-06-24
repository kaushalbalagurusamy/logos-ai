/**
 * Base service class providing common functionality for all domain services
 * Includes ID generation, database connection management, and shared utilities
 */

import { randomUUID } from "crypto"

export abstract class BaseService {
  /**
   * Generates a unique identifier using UUID v4
   */
  protected generateId(): string {
    return randomUUID()
  }

  /**
   * Gets the current timestamp
   */
  protected getCurrentTimestamp(): Date {
    return new Date()
  }

  /**
   * Validates that a string is a valid UUID
   */
  protected isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }

  /**
   * Sanitizes user input to prevent SQL injection
   */
  protected sanitizeInput(input: string): string {
    if (typeof input !== "string") return ""
    return input.replace(/['"\\;]/g, "").trim()
  }

  /**
   * Validates pagination parameters
   */
  protected validatePagination(
    limit?: number,
    offset?: number
  ): { limit: number; offset: number } {
    const validatedLimit = Math.min(Math.max(limit || 20, 1), 100) // Between 1 and 100
    const validatedOffset = Math.max(offset || 0, 0) // Non-negative
    
    return {
      limit: validatedLimit,
      offset: validatedOffset,
    }
  }

  /**
   * Converts database row to camelCase object
   */
  protected convertToCamelCase(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = value
    }
    
    return result
  }

  /**
   * Converts camelCase object to snake_case for database
   */
  protected convertToSnakeCase(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      result[snakeKey] = value
    }
    
    return result
  }

  /**
   * Handles service errors with consistent logging
   */
  protected handleError(error: unknown, operation: string): never {
    console.error(`Error in ${this.constructor.name}.${operation}:`, error)
    
    if (error instanceof Error) {
      throw new Error(`${operation} failed: ${error.message}`)
    }
    
    throw new Error(`${operation} failed: Unknown error`)
  }

  /**
   * Validates that required fields are present
   */
  protected validateRequiredFields(
    data: Record<string, any>,
    fields: string[]
  ): void {
    const missing = fields.filter(field => 
      data[field] === undefined || 
      data[field] === null || 
      data[field] === ""
    )
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`)
    }
  }

  /**
   * Creates a safe partial update object, excluding undefined values
   */
  protected createPartialUpdate<T extends Record<string, any>>(
    updates: Partial<T>
  ): Partial<T> {
    const result: Partial<T> = {}
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        result[key as keyof T] = value
      }
    }
    
    return result
  }

  /**
   * Validates that a user ID belongs to the requesting user (authorization check)
   */
  protected validateUserAccess(resourceUserId: string, requestingUserId: string): void {
    if (resourceUserId !== requestingUserId) {
      throw new Error("Access denied: Resource does not belong to user")
    }
  }

  /**
   * Calculates version incrementing for optimistic concurrency control
   */
  protected incrementVersion(currentVersion: number): number {
    return currentVersion + 1
  }

  /**
   * Formats date for database storage
   */
  protected formatDateForDb(date: Date): string {
    return date.toISOString()
  }

  /**
   * Parses date from database string
   */
  protected parseDateFromDb(dateString: string): Date {
    return new Date(dateString)
  }
} 