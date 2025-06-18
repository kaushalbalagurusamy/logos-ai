import { BaseService } from "./base-service"
import type { Round, RoundPrepEntry, FlowLog, APIResponse } from "@/lib/types"

export class RoundService extends BaseService {
  async startRound(userId: string): Promise<APIResponse<Round>> {
    try {
      const round = await this.executeQuerySingle<Round>(
        `INSERT INTO rounds (user_id, start_time) 
         VALUES ($1, NOW()) 
         RETURNING *`,
        [userId],
      )

      if (!round) {
        return this.createErrorResponse("Failed to start round")
      }

      return this.createSuccessResponse(round, "Round started successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to start round")
    }
  }

  async endRound(roundId: string): Promise<APIResponse<Round>> {
    try {
      const round = await this.executeQuerySingle<Round>(
        `UPDATE rounds SET end_time = NOW() 
         WHERE id = $1 AND end_time IS NULL
         RETURNING *`,
        [roundId],
      )

      if (!round) {
        return this.createErrorResponse("Round not found or already ended")
      }

      return this.createSuccessResponse(round, "Round ended successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to end round")
    }
  }

  async getRounds(userId?: string): Promise<APIResponse<Round[]>> {
    try {
      let query = `
        SELECT r.*, u.name as user_name 
        FROM rounds r
        LEFT JOIN users u ON r.user_id = u.id
      `
      const values: any[] = []

      if (userId) {
        query += " WHERE r.user_id = $1"
        values.push(userId)
      }

      query += " ORDER BY r.start_time DESC"

      const rounds = await this.executeQuery<Round>(query, values)

      return this.createSuccessResponse(rounds)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch rounds")
    }
  }

  async getRoundById(roundId: string): Promise<APIResponse<Round>> {
    try {
      const round = await this.executeQuerySingle<Round>(
        `SELECT r.*, u.name as user_name 
         FROM rounds r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.id = $1`,
        [roundId],
      )

      if (!round) {
        return this.createErrorResponse("Round not found")
      }

      return this.createSuccessResponse(round)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch round")
    }
  }

  // Round Prep Entry Management
  async addPrepEntry(roundId: string, entryId: string): Promise<APIResponse<RoundPrepEntry>> {
    try {
      const prepEntry = await this.executeQuerySingle<RoundPrepEntry>(
        `INSERT INTO round_prep_entries (round_id, entry_id) 
         VALUES ($1, $2) 
         RETURNING *`,
        [roundId, entryId],
      )

      if (!prepEntry) {
        return this.createErrorResponse("Failed to add prep entry")
      }

      return this.createSuccessResponse(prepEntry, "Prep entry added to round")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to add prep entry")
    }
  }

  async getRoundPrepEntries(roundId: string): Promise<APIResponse<RoundPrepEntry[]>> {
    try {
      const prepEntries = await this.executeQuery<RoundPrepEntry>(
        `SELECT rpe.*, pbe.title, pbe.entry_type, pbe.summary
         FROM round_prep_entries rpe
         LEFT JOIN prep_bank_entries pbe ON rpe.entry_id = pbe.id
         WHERE rpe.round_id = $1
         ORDER BY rpe.added_at DESC`,
        [roundId],
      )

      return this.createSuccessResponse(prepEntries)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch round prep entries")
    }
  }

  async removePrepEntry(roundId: string, prepEntryId: string): Promise<APIResponse<null>> {
    try {
      const result = await this.executeQuery(
        "DELETE FROM round_prep_entries WHERE id = $1 AND round_id = $2 RETURNING id",
        [prepEntryId, roundId],
      )

      if (result.length === 0) {
        return this.createErrorResponse("Prep entry not found")
      }

      return this.createSuccessResponse(null, "Prep entry removed from round")
    } catch (error) {
      return this.createErrorResponse("Failed to remove prep entry")
    }
  }

  // Flow Log Management
  async logFlowAction(
    roundId: string,
    entryId: string,
    action: "Added" | "Dropped" | "Cited",
  ): Promise<APIResponse<FlowLog>> {
    try {
      const flowLog = await this.executeQuerySingle<FlowLog>(
        `INSERT INTO flow_logs (round_id, entry_id, action, timestamp) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING *`,
        [roundId, entryId, action],
      )

      if (!flowLog) {
        return this.createErrorResponse("Failed to log flow action")
      }

      return this.createSuccessResponse(flowLog, "Flow action logged")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to log flow action")
    }
  }

  async getFlowLogs(roundId: string): Promise<APIResponse<FlowLog[]>> {
    try {
      const flowLogs = await this.executeQuery<FlowLog>(
        `SELECT fl.*, pbe.title, pbe.entry_type
         FROM flow_logs fl
         LEFT JOIN prep_bank_entries pbe ON fl.entry_id = pbe.id
         WHERE fl.round_id = $1
         ORDER BY fl.timestamp ASC`,
        [roundId],
      )

      return this.createSuccessResponse(flowLogs)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch flow logs")
    }
  }

  // Migration of temp entries to main prep bank
  async migratePrepEntries(roundId: string, prepEntryIds: string[], userId: string): Promise<APIResponse<null>> {
    try {
      // This would involve complex logic to convert temporary round entries
      // into permanent prep bank entries
      for (const prepEntryId of prepEntryIds) {
        // Get the temp entry details
        const tempEntry = await this.executeQuerySingle(
          `SELECT rpe.*, pbe.* 
           FROM round_prep_entries rpe
           LEFT JOIN prep_bank_entries pbe ON rpe.entry_id = pbe.id
           WHERE rpe.id = $1 AND rpe.round_id = $2`,
          [prepEntryId, roundId],
        )

        if (tempEntry) {
          // Create permanent entry (implementation would depend on specific requirements)
          // This is a simplified version
          await this.executeQuery(
            `INSERT INTO prep_bank_entries (title, summary, entry_type, author_id, content)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              `Round ${roundId} - ${tempEntry.title}`,
              tempEntry.summary,
              "Analytics",
              userId,
              `Migrated from round ${roundId}`,
            ],
          )
        }
      }

      return this.createSuccessResponse(null, "Prep entries migrated successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to migrate prep entries")
    }
  }
}
