// User and authentication types
export interface User {
  id: string
  email: string
  name: string
  role: "student" | "coach" | "admin"
  schoolId?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthToken {
  token: string
  refreshToken: string
  expiresAt: Date
  user: User
}

// Source management types
export interface Source {
  id: string
  title: string
  author?: string
  publication?: string
  date?: Date
  url?: string
  citationStyle: "MLA" | "APA" | "Chicago"
  authorQualifications?: string
  studyMethodology?: string
  filePath?: string
  fileMetadata?: {
    size: number
    type: string
    uploadDate: Date
    originalName: string
  }
  version: number
  userId: string
  createdAt: Date
  updatedAt: Date
  cards: string[] // Evidence card IDs
}

// Prep bank types
export interface PrepBankEntry {
  id: string
  title: string
  content: string
  type: "evidence" | "case" | "speech" | "analytics"
  tags: string[]
  userId: string
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}

export interface Tag {
  id: string
  name: string
  color: string
  userId: string
  createdAt: Date
}

// Case building types
export interface CaseTemplate {
  id: string
  name: string
  structure: any
  userId: string
  createdAt: Date
}

// Round and analytics types
export interface Round {
  id: string
  tournament: string
  opponent: string
  side: "aff" | "neg"
  result: "win" | "loss"
  notes: string
  userId: string
  createdAt: Date
}

// AI service types
export interface AIRequest {
  prompt: string
  context?: string
  type: "ask" | "summarize" | "citation-format"
}

export interface AIResponse {
  response: string
  confidence?: number
  sources?: string[]
}

// API response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Search and filtering types
export interface SearchFilters {
  query?: string
  type?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}
