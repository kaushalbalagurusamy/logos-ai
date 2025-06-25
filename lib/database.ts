/**
 * Database connection and query utilities
 * Provides a consistent interface for database operations across the application
 * Uses real PostgreSQL when DATABASE_URL is set, otherwise falls back to mock database
 */

import getConnection from './db'

interface DatabaseRow {
  [key: string]: any
}

interface QueryResult {
  rows: DatabaseRow[]
  rowCount: number
}

// Mock database storage
const mockDatabase: Record<string, DatabaseRow[]> = {
  users: [
    {
      id: "user-123",
      email: "alice@example.com",
      name: "Alice Johnson",
      role: "student",
      school_id: null,
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
  ],
  sources: [],
  evidence_cards: [],
  analytics: [],
  analytics_folders: [],
  analytics_links: [],
  prep_bank_entries: [],
  tags: [],
  case_templates: [],
  rounds: [],
  documents: [],
  document_folders: [],
}

/**
 * Executes a parameterized query and returns multiple rows
 */
export async function executeQuery(
  query: string,
  params: any[] = []
): Promise<QueryResult> {
  try {
    // Use real PostgreSQL if DATABASE_URL is configured
    if (process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
      const sql = getConnection()
      const result = await sql.unsafe(query, params)
      return {
        rows: Array.isArray(result) ? result : [result],
        rowCount: Array.isArray(result) ? result.length : 1
      }
    }

    // Fall back to mock implementation for development/testing
    return mockQueryExecution(query, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Database operation failed")
  }
}

/**
 * Executes a parameterized query and returns a single row
 */
export async function executeQuerySingle(
  query: string,
  params: any[] = []
): Promise<DatabaseRow | null> {
  const result = await executeQuery(query, params)
  return result.rows[0] || null
}

/**
 * Mock query execution for development
 * This simulates basic SQL operations against our in-memory database
 */
function mockQueryExecution(query: string, params: any[]): QueryResult {
  const normalizedQuery = query.toLowerCase().trim()

  // Handle SELECT queries
  if (normalizedQuery.startsWith("select")) {
    return handleMockSelect(query, params)
  }

  // Handle INSERT queries
  if (normalizedQuery.startsWith("insert")) {
    return handleMockInsert(query, params)
  }

  // Handle UPDATE queries
  if (normalizedQuery.startsWith("update")) {
    return handleMockUpdate(query, params)
  }

  // Handle DELETE queries
  if (normalizedQuery.startsWith("delete")) {
    return handleMockDelete(query, params)
  }

  // Fallback for unsupported queries
  console.warn("Unsupported query type:", query)
  return { rows: [], rowCount: 0 }
}

/**
 * Handles mock SELECT operations
 */
function handleMockSelect(query: string, params: any[]): QueryResult {
  // Parse table name from query
  const tableMatch = query.match(/from\s+(\w+)/i)
  if (!tableMatch) {
    return { rows: [], rowCount: 0 }
  }

  const tableName = tableMatch[1]
  const table = mockDatabase[tableName] || []

  // For this mock, we'll return all rows
  // In a real implementation, you'd parse WHERE clauses, JOINs, etc.
  
  // Handle sources with evidence cards aggregation
  if (tableName === "sources" && query.includes("evidence_cards")) {
    const rows = table.map(source => ({
      ...source,
      cards: mockDatabase.evidence_cards
        .filter(card => card.source_id === source.id)
        .map(card => card.id)
    }))
    return { rows, rowCount: rows.length }
  }

  // Simple filtering by user_id if present in params
  let filteredRows = table
  if (params.length > 0 && query.includes("user_id")) {
    const userId = params[0]
    filteredRows = table.filter(row => row.user_id === userId || row.userId === userId)
  }

  // Handle ID-based filtering
  if (params.length >= 2 && query.includes("id = $1")) {
    const id = params[0]
    filteredRows = table.filter(row => row.id === id)
  }
  
  // Handle combined ID and user_id filtering for documents
  if (params.length >= 2 && query.includes("id = $1 AND user_id = $2")) {
    const id = params[0]
    const userId = params[1]
    filteredRows = table.filter(row => row.id === id && (row.user_id === userId || row.userId === userId))
  }

  return { rows: filteredRows, rowCount: filteredRows.length }
}

/**
 * Handles mock INSERT operations
 */
function handleMockInsert(query: string, params: any[]): QueryResult {
  // Parse table name
  const tableMatch = query.match(/insert\s+into\s+(\w+)/i)
  if (!tableMatch) {
    return { rows: [], rowCount: 0 }
  }

  const tableName = tableMatch[1]
  
  // Parse column names
  const columnsMatch = query.match(/\(([^)]+)\)/i)
  if (!columnsMatch) {
    return { rows: [], rowCount: 0 }
  }

  const columns = columnsMatch[1].split(",").map(col => col.trim().replace(/["`]/g, ''))
  
  // Create new row
  const newRow: DatabaseRow = {}
  columns.forEach((col, index) => {
    newRow[col] = params[index]
  })

  // Add to mock database
  if (!mockDatabase[tableName]) {
    mockDatabase[tableName] = []
  }
  mockDatabase[tableName].push(newRow)

  return { rows: [newRow], rowCount: 1 }
}

/**
 * Handles mock UPDATE operations
 */
function handleMockUpdate(query: string, params: any[]): QueryResult {
  const tableMatch = query.match(/update\s+(\w+)/i)
  if (!tableMatch) {
    return { rows: [], rowCount: 0 }
  }

  const tableName = tableMatch[1]
  const table = mockDatabase[tableName] || []

  // For simplicity, update the first matching row by ID
  // In reality, you'd parse the WHERE clause properly
  const id = params[params.length - 2] // Assuming ID is second to last param
  const userId = params[params.length - 1] // Assuming user_id is last param

  const rowIndex = table.findIndex(row => row.id === id && (row.user_id === userId || row.userId === userId))
  
  if (rowIndex >= 0) {
    // Update the row with new values
    // This is a simplified implementation
    const updatedRow = { ...table[rowIndex] }
    
    // Parse SET clause and update fields
    const setMatch = query.match(/set\s+(.+?)\s+where/i)
    if (setMatch) {
      const updates = setMatch[1].split(",")
      let paramIndex = 0
      
      updates.forEach(update => {
        const [field] = update.trim().split("=")
        const fieldName = field.trim()
        if (fieldName !== "updated_at") {
          updatedRow[fieldName] = params[paramIndex]
          paramIndex++
        }
      })
    }

    table[rowIndex] = updatedRow
    return { rows: [updatedRow], rowCount: 1 }
  }

  return { rows: [], rowCount: 0 }
}

/**
 * Handles mock DELETE operations
 */
function handleMockDelete(query: string, params: any[]): QueryResult {
  const tableMatch = query.match(/delete\s+from\s+(\w+)/i)
  if (!tableMatch) {
    return { rows: [], rowCount: 0 }
  }

  const tableName = tableMatch[1]
  const table = mockDatabase[tableName] || []

  // Find and remove the matching row
  const id = params[0]
  const userId = params[1]

  const rowIndex = table.findIndex(row => row.id === id && (row.user_id === userId || row.userId === userId))
  
  if (rowIndex >= 0) {
    const deletedRow = table.splice(rowIndex, 1)[0]
    return { rows: [deletedRow], rowCount: 1 }
  }

  return { rows: [], rowCount: 0 }
}

/**
 * Initializes database connection
 * Tests the connection and sets up any necessary configuration
 */
export async function initializeDatabase(): Promise<void> {
  try {
    if (process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
      // Test the connection
      const sql = getConnection()
      await sql`SELECT 1 as test`
      console.log("PostgreSQL database connection initialized successfully")
    } else {
      console.log("Database connection initialized (mock mode)")
    }
  } catch (error) {
    console.error("Failed to initialize database:", error)
    throw error
  }
}

/**
 * Closes database connections
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
      const sql = getConnection()
      await sql.end()
      console.log("PostgreSQL database connections closed")
    } else {
      console.log("Database connections closed (mock mode)")
    }
  } catch (error) {
    console.error("Error closing database:", error)
    throw error
  }
}

/**
 * Health check for database connectivity
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    if (process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
      const sql = getConnection()
      await sql`SELECT 1 as health_check`
      return true
    }
    // For mock database, always return true
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
} 