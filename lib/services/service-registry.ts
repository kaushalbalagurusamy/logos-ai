import { AuthService } from "./auth-service"
import { PrepBankService } from "./prepbank-service"
import { CaseBuilderService } from "./casebuilder-service"
import { RoundService } from "./round-service"
import { AIService } from "./ai-service"

export class ServiceRegistry {
  private static instance: ServiceRegistry

  public readonly auth: AuthService
  public readonly prepBank: PrepBankService
  public readonly caseBuilder: CaseBuilderService
  public readonly round: RoundService
  public readonly ai: AIService

  private constructor() {
    this.auth = new AuthService()
    this.prepBank = new PrepBankService()
    this.caseBuilder = new CaseBuilderService()
    this.round = new RoundService()
    this.ai = new AIService()
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry()
    }
    return ServiceRegistry.instance
  }
}

// Export singleton instance
export const services = ServiceRegistry.getInstance()
