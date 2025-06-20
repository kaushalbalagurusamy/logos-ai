import { AIService } from "./ai-service"
import { AuthService } from "./auth-service"
import { CaseBuilderService } from "./casebuilder-service"
import { PrepBankService } from "./prepbank-service"
import { RoundService } from "./round-service"
import { SourceService } from "./source-service"

class ServiceRegistry {
  private static instance: ServiceRegistry

  public readonly ai: AIService
  public readonly auth: AuthService
  public readonly caseBuilder: CaseBuilderService
  public readonly prepBank: PrepBankService
  public readonly rounds: RoundService
  public readonly sources: SourceService

  private constructor() {
    this.ai = new AIService()
    this.auth = new AuthService()
    this.caseBuilder = new CaseBuilderService()
    this.prepBank = new PrepBankService()
    this.rounds = new RoundService()
    this.sources = new SourceService()
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry()
    }
    return ServiceRegistry.instance
  }
}

export const services = ServiceRegistry.getInstance()
