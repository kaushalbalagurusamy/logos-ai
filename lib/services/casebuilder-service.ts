import { BaseService } from "./base-service"
import type { CaseTemplate, JudgeProfile, OpponentProfile, APIResponse } from "@/lib/types"

export class CaseBuilderService extends BaseService {
  async createTemplate(templateData: {
    name: string
    description?: string
    card_sequence?: string[]
    created_by: string
  }): Promise<APIResponse<CaseTemplate>> {
    try {
      this.validateRequired(templateData, ["name", "created_by"])

      const template = await this.executeQuerySingle<CaseTemplate>(
        `INSERT INTO case_templates (name, description, card_sequence, created_by) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [templateData.name, templateData.description, templateData.card_sequence || [], templateData.created_by],
      )

      if (!template) {
        return this.createErrorResponse("Failed to create template")
      }

      return this.createSuccessResponse(template, "Template created successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to create template")
    }
  }

  async getTemplates(userId?: string): Promise<APIResponse<CaseTemplate[]>> {
    try {
      let query = `
        SELECT ct.*, u.name as created_by_name 
        FROM case_templates ct
        LEFT JOIN users u ON ct.created_by = u.id
      `
      const values: any[] = []

      if (userId) {
        query += " WHERE ct.created_by = $1"
        values.push(userId)
      }

      query += " ORDER BY ct.created_at DESC"

      const templates = await this.executeQuery<CaseTemplate>(query, values)

      return this.createSuccessResponse(templates)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch templates")
    }
  }

  async getTemplateById(templateId: string): Promise<APIResponse<CaseTemplate>> {
    try {
      const template = await this.executeQuerySingle<CaseTemplate>(
        `SELECT ct.*, u.name as created_by_name 
         FROM case_templates ct
         LEFT JOIN users u ON ct.created_by = u.id
         WHERE ct.id = $1`,
        [templateId],
      )

      if (!template) {
        return this.createErrorResponse("Template not found")
      }

      return this.createSuccessResponse(template)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch template")
    }
  }

  async updateTemplate(
    templateId: string,
    updates: {
      name?: string
      description?: string
      card_sequence?: string[]
    },
  ): Promise<APIResponse<CaseTemplate>> {
    try {
      const updateFields: string[] = []
      const values: any[] = []
      let paramIndex = 1

      if (updates.name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`)
        values.push(updates.name)
      }
      if (updates.description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`)
        values.push(updates.description)
      }
      if (updates.card_sequence !== undefined) {
        updateFields.push(`card_sequence = $${paramIndex++}`)
        values.push(updates.card_sequence)
      }

      if (updateFields.length === 0) {
        return this.createErrorResponse("No fields to update")
      }

      values.push(templateId)

      const template = await this.executeQuerySingle<CaseTemplate>(
        `UPDATE case_templates SET ${updateFields.join(", ")} 
         WHERE id = $${paramIndex} 
         RETURNING *`,
        values,
      )

      if (!template) {
        return this.createErrorResponse("Template not found")
      }

      return this.createSuccessResponse(template, "Template updated successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to update template")
    }
  }

  async deleteTemplate(templateId: string): Promise<APIResponse<null>> {
    try {
      const result = await this.executeQuery("DELETE FROM case_templates WHERE id = $1 RETURNING id", [templateId])

      if (result.length === 0) {
        return this.createErrorResponse("Template not found")
      }

      return this.createSuccessResponse(null, "Template deleted successfully")
    } catch (error) {
      return this.createErrorResponse("Failed to delete template")
    }
  }

  // Judge Profile Management
  async createJudgeProfile(profileData: {
    judge_name: string
    profile_data: any
  }): Promise<APIResponse<JudgeProfile>> {
    try {
      this.validateRequired(profileData, ["judge_name"])

      const profile = await this.executeQuerySingle<JudgeProfile>(
        `INSERT INTO judge_profiles (judge_name, profile_data) 
         VALUES ($1, $2) 
         RETURNING *`,
        [profileData.judge_name, profileData.profile_data || {}],
      )

      if (!profile) {
        return this.createErrorResponse("Failed to create judge profile")
      }

      return this.createSuccessResponse(profile, "Judge profile created successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to create judge profile")
    }
  }

  async getJudgeProfiles(): Promise<APIResponse<JudgeProfile[]>> {
    try {
      const profiles = await this.executeQuery<JudgeProfile>("SELECT * FROM judge_profiles ORDER BY created_at DESC")

      return this.createSuccessResponse(profiles)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch judge profiles")
    }
  }

  // Opponent Profile Management
  async createOpponentProfile(profileData: {
    opponent_name: string
    profile_data: any
  }): Promise<APIResponse<OpponentProfile>> {
    try {
      this.validateRequired(profileData, ["opponent_name"])

      const profile = await this.executeQuerySingle<OpponentProfile>(
        `INSERT INTO opponent_profiles (opponent_name, profile_data) 
         VALUES ($1, $2) 
         RETURNING *`,
        [profileData.opponent_name, profileData.profile_data || {}],
      )

      if (!profile) {
        return this.createErrorResponse("Failed to create opponent profile")
      }

      return this.createSuccessResponse(profile, "Opponent profile created successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to create opponent profile")
    }
  }

  async getOpponentProfiles(): Promise<APIResponse<OpponentProfile[]>> {
    try {
      const profiles = await this.executeQuery<OpponentProfile>(
        "SELECT * FROM opponent_profiles ORDER BY created_at DESC",
      )

      return this.createSuccessResponse(profiles)
    } catch (error) {
      return this.createErrorResponse("Failed to fetch opponent profiles")
    }
  }

  // Template Generation with AI
  async generateTemplateFromPrompt(prompt: string, userId: string): Promise<APIResponse<CaseTemplate>> {
    try {
      // Mock AI-generated template structure
      // In production, this would call an AI service
      const aiGeneratedStructure = {
        name: `AI Generated: ${prompt.substring(0, 50)}...`,
        description: `Template generated from prompt: "${prompt}"`,
        card_sequence: [], // Would be populated by AI analysis
        sections: [
          { name: "Definitions", cards: [] },
          { name: "Contentions", cards: [] },
          { name: "Impacts", cards: [] },
          { name: "Solvency", cards: [] },
        ],
      }

      const template = await this.executeQuerySingle<CaseTemplate>(
        `INSERT INTO case_templates (name, description, card_sequence, created_by) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [aiGeneratedStructure.name, aiGeneratedStructure.description, aiGeneratedStructure.card_sequence, userId],
      )

      if (!template) {
        return this.createErrorResponse("Failed to generate template")
      }

      return this.createSuccessResponse(template, "Template generated successfully")
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : "Failed to generate template")
    }
  }
}
