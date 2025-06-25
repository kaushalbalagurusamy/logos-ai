#!/usr/bin/env tsx

/**
 * Database migration script
 * Run with: npx tsx scripts/migrate.ts
 */

import { runMigrations, seedDatabase } from '../lib/migrations'

async function main() {
  try {
    console.log('Starting database setup...')
    
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set')
      console.log('Please set DATABASE_URL in your .env.local file')
      process.exit(1)
    }

    console.log('✅ DATABASE_URL is configured')
    
    // Run migrations
    await runMigrations()
    console.log('✅ Migrations completed')
    
    // Seed database with default data
    await seedDatabase()
    console.log('✅ Database seeded')
    
    console.log('🎉 Database setup complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

main()