import { type NextRequest, NextResponse } from "next/server"
import { services } from "@/lib/services/service-registry"

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
  }

  const authResult = await services.auth.verifyToken(token)

  if (!authResult.success) {
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
  }

  // Add user info to request headers for downstream use
  const response = NextResponse.next()
  response.headers.set("x-user-id", authResult.data!.userId)
  response.headers.set("x-user-email", authResult.data!.email)
  response.headers.set("x-user-role", authResult.data!.role)

  return response
}

export function withAuth(handler: (request: NextRequest, context: any) => Promise<Response>) {
  return async (request: NextRequest, context: any) => {
    const authResponse = await authMiddleware(request)

    if (authResponse.status !== 200) {
      return authResponse
    }

    // Extract user info from headers
    const userId = authResponse.headers.get("x-user-id")!
    const userEmail = authResponse.headers.get("x-user-email")!
    const userRole = authResponse.headers.get("x-user-role")!

    // Add user context
    const enhancedContext = {
      ...context,
      user: { id: userId, email: userEmail, role: userRole },
    }

    return handler(request, enhancedContext)
  }
}
