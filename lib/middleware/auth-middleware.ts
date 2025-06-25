/**
 * Authentication middleware for Next.js API routes
 * Provides user authentication and authorization for protected endpoints
 */

import { NextRequest, NextResponse } from "next/server"
import type { User } from "@/lib/types"

interface AuthenticatedRequest {
  user: User
}

type AuthenticatedHandler = (
  request: NextRequest,
  context: AuthenticatedRequest & { params?: any }
) => Promise<NextResponse>

/**
 * Authentication middleware wrapper for API routes
 * Validates user session and injects user data into request context
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context?: { params?: any }) => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }
    
    try {
      // Extract authorization header
      const authHeader = request.headers.get("authorization")
      const token = authHeader?.replace("Bearer ", "")

      // For now, we'll mock authentication - in production, this would validate JWT tokens
      // or session cookies and fetch user data from database
      if (!token && !isMockEnvironment()) {
        const response = NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        )
        response.headers.set('Access-Control-Allow-Origin', '*')
        return response
      }

      // Mock user for development - replace with actual token validation
      const user: User = {
        id: "user-123", // Would come from token validation
        email: "alice@example.com",
        name: "Alice Johnson",
        role: "student",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // In production, validate token and fetch user:
      // const user = await validateTokenAndGetUser(token)
      // if (!user) {
      //   return NextResponse.json(
      //     { success: false, error: "Invalid token" },
      //     { status: 401 }
      //   )
      // }

      const response = await handler(request, { user, params: context?.params })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    } catch (error) {
      console.error("Auth middleware error:", error)
      const response = NextResponse.json(
        { success: false, error: "Authentication failed" },
        { status: 500 }
      )
      response.headers.set('Access-Control-Allow-Origin', '*')
      return response
    }
  }
}

/**
 * Check if we're in a development/mock environment
 */
function isMockEnvironment(): boolean {
  return process.env.NODE_ENV === "development" || process.env.MOCK_AUTH === "true"
}

/**
 * Extract user ID from JWT token (placeholder for production implementation)
 */
async function validateTokenAndGetUser(token: string): Promise<User | null> {
  // In production, this would:
  // 1. Verify JWT signature
  // 2. Check token expiration
  // 3. Fetch user data from database
  // 4. Return user object or null if invalid
  
  try {
    // Mock implementation
    if (token === "mock-token") {
      return {
        id: "user-123",
        email: "alice@example.com", 
        name: "Alice Johnson",
        role: "student",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    return null
  } catch (error) {
    console.error("Token validation error:", error)
    return null
  }
} 