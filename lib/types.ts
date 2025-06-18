export type UserRole = "Debater" | "Admin"
export type PrepBankEntryType = "Evidence" | "Analytics" | "Definition" | "SLR" | "MetaStudy"
export type FlowAction = "Added" | "Dropped" | "Cited"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface Tag {
  id: string
  label: string
  color: string
}

export interface PrepBankEntry {
  id: string
  title: string
  summary: string
  author_id: string
  entry_type: PrepBankEntryType
  created_at: string
  updated_at: string

  // Evidence-specific fields
  quote_text?: string
  source_url?: string
  pdf_url?: string
  mla_citation?: string
  author_qualifications?: string
  methodology_details?: string
  warrant_text?: string

  // Analytics-specific fields
  content?: string

  // Definition-specific fields
  definition_text?: string
  clustered_card_ids?: string[]

  // SLR/MetaStudy-specific fields
  nodes?: any
  edges?: any

  // Relations
  tags?: Tag[]
  author?: User
}

export interface CaseTemplate {
  id: string
  name: string
  description: string
  card_sequence: string[]
  created_by: string
  created_at: string
}

export interface Round {
  id: string
  user_id: string
  start_time: string
  end_time?: string
}

export interface RoundPrepEntry {
  id: string
  entry_id: string
  round_id: string
  added_at: string
}

export interface FlowLog {
  id: string
  round_id: string
  entry_id: string
  action: FlowAction
  timestamp: string
}

export interface JudgeProfile {
  id: string
  judge_name: string
  profile_data: any
  created_at: string
}

export interface OpponentProfile {
  id: string
  opponent_name: string
  profile_data: any
  created_at: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
