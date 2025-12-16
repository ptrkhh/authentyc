# Database Migration Guide

This directory contains the consolidated database schema for the Authentyc landing page.

## Files

- **migration.sql** - Complete database schema including all tables, indexes, constraints, and functions
- **cleanup.sql** - Script to drop all existing tables and objects before running a fresh migration

## Usage

### Fresh Installation

```bash
psql -d your_database -f migration.sql
```

### Reset Database (Clean + Migrate)

⚠️ **WARNING**: This will delete ALL existing data!

```bash
# Step 1: Clean existing schema
psql -d your_database -f cleanup.sql

# Step 2: Run fresh migration
psql -d your_database -f migration.sql
```

### Using Supabase

If you're using Supabase, you can run these in the SQL Editor:

1. Copy the contents of `cleanup.sql` and execute
2. Copy the contents of `migration.sql` and execute

## Schema Overview

The migration creates the following tables:

1. **waitlist_leads** - Stores email signups with multiple interest categories support
2. **chat_analyses** - Stores personality analysis results with character generation
3. **rate_limits** - Rate limiting for API endpoints
4. **email_jobs** - Email queue and delivery tracking

## Key Features

- Multiple interest selection (JSONB array)
- Character generation support (hiring, dating, founder categories)
- Completeness rating (1-10 scale)
- Row-level security policies
- Helper functions for common queries
- Automatic cleanup of expired analyses

## Notes

- The schema uses PostgreSQL-specific features (JSONB, uuid-ossp extension)
- Row-level security is enabled with service role access
- All timestamps are stored with timezone information
