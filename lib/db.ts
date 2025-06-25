/**
 * PostgreSQL database connection using postgres.js
 * Provides a connection to the Supabase PostgreSQL database
 */

import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL

// Create a conditional connection - only when DATABASE_URL is available
const sql = connectionString ? postgres(connectionString, {
  // Configuration options for production
  max: 10, // Maximum connections
  idle_timeout: 20, // Idle timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
}) : null

// Export a function that throws an error if no connection is available when needed
export default function getConnection() {
  if (!sql) {
    throw new Error('DATABASE_URL environment variable is not set - PostgreSQL connection not available')
  }
  return sql
}