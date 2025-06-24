/**
 * Prep Bank Service
 * Manages prep bank entries and organization
 */

import type { PrepBankEntry } from "@/lib/types"
import { BaseService } from "./base-service"

export class PrepBankService extends BaseService {
  /**
   * Gets prep bank entries for a user
   */
  async getEntries(userId: string): Promise<PrepBankEntry[]> {
    // Stub implementation for now
    console.log("PrepBankService.getEntries called - stub implementation")
    return []
  }

  /**
   * Creates a new prep bank entry
   */
  async createEntry(entryData: Omit<PrepBankEntry, "id" | "createdAt" | "updatedAt">): Promise<PrepBankEntry> {
    // Stub implementation for now
    console.log("PrepBankService.createEntry called - stub implementation")
    throw new Error("Not implemented")
  }
} 