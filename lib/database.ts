/**
 * Database connection and query utilities
 * Provides a consistent interface for database operations across the application
 */

// For now, we'll use an in-memory mock database for development
// In production, this would connect to PostgreSQL, MySQL, or your preferred database

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
}

/**
 * Executes a parameterized query and returns multiple rows
 */
export async function executeQuery(
  query: string,
  params: any[] = []
): Promise<QueryResult> {
  try {
    // In production, this would execute against a real database:
    // const client = await pool.connect()
    // const result = await client.query(query, params)
    // client.release()
    // return result

    // Mock implementation for development
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
    filteredRows = table.filter(row => row.user_id === userId)
  }

  // Handle ID-based filtering
  if (params.length >= 2 && query.includes("id = $1")) {
    const id = params[0]
    filteredRows = table.filter(row => row.id === id)
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

  const columns = columnsMatch[1].split(",").map(col => col.trim())
  
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

  const rowIndex = table.findIndex(row => row.id === id && row.user_id === userId)
  
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

  const rowIndex = table.findIndex(row => row.id === id && row.user_id === userId)
  
  if (rowIndex >= 0) {
    const deletedRow = table.splice(rowIndex, 1)[0]
    return { rows: [deletedRow], rowCount: 1 }
  }

  return { rows: [], rowCount: 0 }
}

/**
 * Initializes database connection pool
 * In production, this would set up connection pooling for PostgreSQL/MySQL
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // In production:
    // const pool = new Pool({
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT || '5432'),
    //   database: process.env.DB_NAME,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   max: 20,
    //   idleTimeoutMillis: 30000,
    //   connectionTimeoutMillis: 2000,
    // })

    console.log("Database connection initialized (mock)")
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
    // In production: await pool.end()
    console.log("Database connections closed (mock)")
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
    // In production: await executeQuery('SELECT 1')
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
} 