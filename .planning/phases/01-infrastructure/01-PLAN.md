---
wave: 1
depends_on: []
files_modified:
  - "supabase/migrations/00000000000000_init_schema.sql"
  - "src/utils/supabase/client.ts"
  - "src/utils/supabase/server.ts"
  - "src/utils/supabase/middleware.ts"
  - ".env.example"
  - ".env.local"
autonomous: true
---

# Phase 1: Infrastructure

## Goal
Setup Supabase backend and connect it to Next.js

## Requirements Covered
- INFRA-01
- INFRA-02

## Tasks

<task>
  <description>Create Supabase database schema for portfolio content</description>
  <action>
    Create a new directory `supabase/migrations/` and write a SQL file `00000000000000_init_schema.sql`.
    Define 4 tables: `hero_content`, `skills`, `projects`, and `experience`.
    Ensure appropriate primary keys, text fields, and simple standard typings for each (e.g., `projects` has `id`, `title`, `description`, `image_url`, `repo_url`, `live_url`).
    Add basic RLS (Row Level Security) policies allowing public read, but restricting updates to authenticated users (admin).
  </action>
  <read_first>
    - c:\Users\Hander Tech\OneDrive\Bureau\portfolio_1\.planning\ROADMAP.md
  </read_first>
  <acceptance_criteria>
    - `supabase/migrations/` directory contains an SQL file.
    - SQL file contains `CREATE TABLE` and `CREATE POLICY` statements.
  </acceptance_criteria>
</task>

<task>
  <description>Setup Supabase Next.js SSR Clients</description>
  <action>
    Install `@supabase/supabase-js` and `@supabase/ssr` (using `npm install`).
    Create standard Supabase SSR utility files inside `src/utils/supabase/`:
    - `client.ts` (Creates browser client)
    - `server.ts` (Creates server-side client with cookie handling)
    Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.example`.
  </action>
  <read_first>
    - c:\Users\Hander Tech\OneDrive\Bureau\portfolio_1\package.json
  </read_first>
  <acceptance_criteria>
    - `package.json` contains `@supabase/ssr` and `@supabase/supabase-js`.
    - `src/utils/supabase/client.ts` exports `createClient`.
    - `src/utils/supabase/server.ts` exports `createClient`.
    - `.env.example` lists the required supabase keys.
  </acceptance_criteria>
</task>

<task>
  <description>[BLOCKING] Initialize Supabase project and push schema</description>
  <action>
    Use the provided Supabase MCP tools (`mcp_supabase_create_project`) or use local `npx supabase start` if keeping it local for now, then push the schema migration.
    Assuming the agent has access to the Supabase MCP, it should provision the project or instruct the user to provide project credentials, and then apply the migration.
  </action>
  <read_first>
    - c:\Users\Hander Tech\OneDrive\Bureau\portfolio_1\supabase\migrations\00000000000000_init_schema.sql
  </read_first>
  <acceptance_criteria>
    - Supabase project is active, OR local supabase is running.
    - Database tables successfully created.
  </acceptance_criteria>
</task>

## Verification
<must_haves>
- Supabase SSR utility files are created and typed correctly.
- Database schema scripts are committed and valid.
</must_haves>
