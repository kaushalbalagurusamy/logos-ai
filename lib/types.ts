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

// Evidence Card types
export interface EvidenceCard {
  id: string
  sourceId: string
  tagLine: string
  evidence: string
  shorthand?: string
  formattingData?: {
    emphasis: Array<{
      start: number
      end: number
      style: "bold-underline"
      font: string
      size: number
    }>
    highlights: Array<{
      start: number
      end: number
      color: "pastel-blue" | "pastel-pink" | "pastel-green" | "pastel-yellow"
    }>
    minimized: Array<{
      start: number
      end: number
      size: number
    }>
  }
  positionInSource?: number
  userId: string
  createdAt: Date
  updatedAt: Date
  source?: Source
}

// Formatting types shared across components
export interface FormattingData {
  emphasis: Array<{
    start: number
    end: number
    style: "bold-underline"
    font: string
    size: number
  }>
  highlights: Array<{
    start: number
    end: number
    color: "pastel-blue" | "pastel-pink" | "pastel-green" | "pastel-yellow"
  }>
  minimized: Array<{
    start: number
    end: number
    size: number
  }>
}

// Analytics types
export interface Analytics {
  id: string
  title: string
  content: string
  summary?: string
  authorId: string
  folderId?: string // For organizational structure
  linkedSourceId?: string // Optional link to source
  linkedCardId?: string // Optional link to evidence card
  linkType?: "paraphrase" | "comparison" | "extension" | "response" | null
  formattingPreferences: {
    font: "Times New Roman" | "Arial" | "Georgia"
    size: number
    bold: boolean
    italic: boolean
  }
  formattingData?: FormattingData // Rich text formatting for content
  tags: string[]
  version: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface AnalyticsFolder {
  id: string
  name: string
  parentId?: string // For nested folder structure
  userId: string
  createdAt: Date
  updatedAt: Date
  analytics: Analytics[]
}

export interface AnalyticsLink {
  id: string
  analyticsId: string
  targetType: "source" | "card"
  targetId: string
  linkType: "paraphrase" | "comparison" | "extension" | "response"
  description?: string
  createdAt: Date
}

// Analytics-specific API types for prep-bank integration
export interface AnalyticsFormattingPreferences {
  font: "Times New Roman" | "Arial" | "Georgia"
  size: number
  bold: boolean
  italic: boolean
}

export interface AnalyticsContentData {
  content: string
  formatting: AnalyticsFormattingPreferences
}

export interface FolderNode {
  name: string
  path: string
  children: FolderNode[]
  analytics: PrepBankEntry[]
}

export interface CreateFolderRequest {
  name: string
  parentPath?: string
}

export interface UpdateFormattingRequest {
  formattingPreferences: AnalyticsFormattingPreferences
}

export interface CreateLinkRequest {
  sourceEntryId: string
  linkType: "paraphrase" | "comparison" | "extension" | "response"
  description?: string
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

// Document Writer types
export interface Document {
  id: string
  title: string
  content: string
  documentType: "case" | "brief" | "notes"
  insertedCards: Array<{
    id: string
    cardId: string
    position: number
    insertedAt: Date
  }>
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface DocumentInsertedCard {
  id: string
  cardId: string
  position: number
  insertedAt: Date
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
