/**
 * Database migrations for PostgreSQL
 * Creates the necessary tables and indexes for the application
 */

import getConnection from './db'

/**
 * Creates all required tables for the application
 */
export async function runMigrations(): Promise<void> {
  console.log('Running database migrations...')

  const sql = getConnection()

  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        school_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Sources table
    await sql`
      CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        publication TEXT,
        date DATE,
        url TEXT,
        citation_style TEXT DEFAULT 'MLA',
        author_qualifications TEXT,
        study_methodology TEXT,
        version INTEGER DEFAULT 1,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Evidence cards table
    await sql`
      CREATE TABLE IF NOT EXISTS evidence_cards (
        id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        tag_line TEXT NOT NULL,
        evidence TEXT NOT NULL,
        shorthand TEXT,
        author_qualifications TEXT,
        study_methodology TEXT,
        formatting_data JSONB,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Analytics table
    await sql`
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        tags JSONB DEFAULT '[]',
        folder_id TEXT,
        linked_source_id TEXT REFERENCES sources(id) ON DELETE SET NULL,
        linked_card_id TEXT REFERENCES evidence_cards(id) ON DELETE SET NULL,
        link_type TEXT CHECK (link_type IN ('paraphrase', 'comparison', 'extension', 'response')),
        formatting_preferences JSONB,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Analytics folders table
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        parent_id TEXT REFERENCES analytics_folders(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT DEFAULT '',
        folder_id TEXT,
        embedded_cards JSONB DEFAULT '[]',
        embedded_analytics JSONB DEFAULT '[]',
        formatting_data JSONB,
        version INTEGER DEFAULT 1,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Document folders table
    await sql`
      CREATE TABLE IF NOT EXISTS document_folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        parent_id TEXT REFERENCES document_folders(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_sources_user_id ON sources(user_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_evidence_cards_user_id ON evidence_cards(user_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_evidence_cards_source_id ON evidence_cards(source_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_analytics_folder_id ON analytics(folder_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_folder_id ON documents(folder_id);`

    console.log('Database migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

/**
 * Inserts default user data if no users exist
 */
export async function seedDatabase(): Promise<void> {
  const sql = getConnection()
  
  try {
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users;`
    const userCount = parseInt(existingUsers[0].count)

    if (userCount === 0) {
      console.log('Seeding database with default user...')
      
      await sql`
        INSERT INTO users (id, email, name, role, created_at, updated_at)
        VALUES ('user-123', 'alice@example.com', 'Alice Johnson', 'student', NOW(), NOW());
      `
      
      console.log('Database seeded successfully')
    } else {
      console.log('Database already contains users, skipping seed')
    }
  } catch (error) {
    console.error('Seeding failed:', error)
    throw error
  }
}

/**
 * Drops all tables (use with caution!)
 */
export async function dropTables(): Promise<void> {
  console.log('Dropping all tables...')
  
  const sql = getConnection()
  
  try {
    await sql`DROP TABLE IF EXISTS evidence_cards CASCADE;`
    await sql`DROP TABLE IF EXISTS analytics CASCADE;`
    await sql`DROP TABLE IF EXISTS analytics_folders CASCADE;`
    await sql`DROP TABLE IF EXISTS documents CASCADE;`
    await sql`DROP TABLE IF EXISTS document_folders CASCADE;`
    await sql`DROP TABLE IF EXISTS sources CASCADE;`
    await sql`DROP TABLE IF EXISTS users CASCADE;`
    
    console.log('All tables dropped successfully')
  } catch (error) {
    console.error('Failed to drop tables:', error)
    throw error
  }
}