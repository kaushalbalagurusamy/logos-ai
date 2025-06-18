import { BaseService } from "./base-service"
import type { User, APIResponse } from "@/lib/types"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export class AuthService extends BaseService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "temporary-dev-secret-please-change-in-production"
  private readonly JWT_EXPIRES_IN = "24h"

  async register(userData: {
    name: string
    email: string
    password: string
    role?: "Debater" | "Admin"
  }): Promise<APIResponse<{ user: User; token: string }>> {
    try {
      this.validateRequired(userData, ["name", "email", "password"])

      // Check if user already exists
      const existingUser = await this.executeQuerySingle<User>("SELECT id FROM users WHERE email = $1", [
        userData.email,
      ])

      if (existingUser) {
        return this.createErrorResponse("User already exists with this email")
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create user
      const user = await this.executeQuerySingle<User>(
        `INSERT INTO users (name, email, password_hash, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, name, email, role, created_at`,
        [userData.name, userData.email, hashedPassword, userData.role || "Debater"],
      )

      if (!user) {
        return this.createErrorResponse("Failed to create user")
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      })

      return this.createSuccessResponse({ user, token }, "User registered successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Registration failed")
    }
  }

  async login(credentials: {
    email: string
    password: string
  }): Promise<APIResponse<{ user: User; token: string }>> {
    try {
      this.validateRequired(credentials, ["email", "password"])

      // Find user with password hash
      const userWithPassword = await this.executeQuerySingle<User & { password_hash: string }>(
        "SELECT id, name, email, role, created_at, password_hash FROM users WHERE email = $1",
        [credentials.email],
      )

      if (!userWithPassword) {
        return this.createErrorResponse("Invalid credentials")
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, userWithPassword.password_hash)
      if (!isValidPassword) {
        return this.createErrorResponse("Invalid credentials")
      }

      // Remove password hash from response
      const { password_hash, ...user } = userWithPassword

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      })

      return this.createSuccessResponse({ user, token }, "Login successful")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Login failed")
    }
  }

  async verifyToken(token: string): Promise<APIResponse<{ userId: string; email: string; role: string }>> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any
      return this.createSuccessResponse({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      })
    } catch (error) {
      return this.createErrorResponse("Invalid or expired token")
    }
  }

  async refreshToken(oldToken: string): Promise<APIResponse<{ token: string }>> {
    try {
      const decoded = jwt.verify(oldToken, this.JWT_SECRET) as any

      // Generate new token
      const newToken = jwt.sign({ userId: decoded.userId, email: decoded.email, role: decoded.role }, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      })

      return this.createSuccessResponse({ token: newToken }, "Token refreshed successfully")
    } catch (error) {
      return this.createErrorResponse("Token refresh failed")
    }
  }
}
