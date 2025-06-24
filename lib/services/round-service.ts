/**
 * Round Service
 * Manages debate round tracking and analytics
 */

import type { Round } from "@/lib/types"
import { BaseService } from "./base-service"

export class RoundService extends BaseService {
  /**
   * Gets rounds for a user
   */
  async getRounds(userId: string): Promise<Round[]> {
    // Stub implementation for now
    console.log("RoundService.getRounds called - stub implementation")
    return []
  }

  /**
   * Creates a new round record
   */
  async createRound(roundData: Omit<Round, "id" | "createdAt">): Promise<Round> {
    // Stub implementation for now
    console.log("RoundService.createRound called - stub implementation")
    throw new Error("Not implemented")
  }
} 