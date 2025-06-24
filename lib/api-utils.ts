/**
 * Utility functions for Next.js API routes
 * Provides consistent response formatting, request parsing, and validation
 */

import { NextRequest } from "next/server"
import type { APIResponse } from "@/lib/types"

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = "Success"
): APIResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: string,
  message: string = "An error occurred"
): APIResponse {
  return {
    success: false,
    error,
    message,
  }
}

/**
 * Safely parses request body with error handling
 */
export async function parseRequestBody(request: NextRequest): Promise<any> {
  try {
    const contentType = request.headers.get("content-type")
    
    if (contentType?.includes("application/json")) {
      return await request.json()
    }
    
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData()
      const body: Record<string, any> = {}
      
      for (const [key, value] of formData.entries()) {
        body[key] = value
      }
      
      return body
    }
    
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData()
      const body: Record<string, any> = {}
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          body[key] = {
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified,
            // In production, you'd handle file uploads here
            buffer: await value.arrayBuffer(),
          }
        } else {
          body[key] = value
        }
      }
      
      return body
    }
    
    // For other content types, try to parse as text
    const text = await request.text()
    
    try {
      return JSON.parse(text)
    } catch {
      return { text }
    }
  } catch (error) {
    console.error("Error parsing request body:", error)
    throw new Error("Invalid request body")
  }
}

/**
 * Validates that required fields are present in an object
 */
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = []
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      missingFields.push(field)
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitizes string input by removing potentially harmful characters
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
}

/**
 * Generates a paginated response with metadata
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number = 1,
  limit: number = 10,
  message: string = "Data retrieved successfully"
): APIResponse<{
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  const totalPages = Math.ceil(total / limit)
  
  return createSuccessResponse(
    {
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    message
  )
}

/**
 * Rate limiting helper (basic implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  
  let record = rateLimitMap.get(key)
  
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + windowMs,
    }
  }
  
  record.count++
  rateLimitMap.set(key, record)
  
  return {
    allowed: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    resetTime: record.resetTime,
  }
} 