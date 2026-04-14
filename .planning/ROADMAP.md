# Roadmap: Amplify Portfolio CMS

## Phase 1: Infrastructure
**Goal:** Setup Supabase backend and connect it to Next.js
**Scope:**
- Initialize Supabase project
- Establish database schema for Hero, Skills, Projects, Experience
- Connect frontend via Supabase SSR client
**Requirements:** INFRA-01, INFRA-02

## Phase 2: Authentication
**Goal:** Secure the admin sections
**Scope:**
- Setup Supabase Auth
- Build login page
- Add Next.js middleware for protected `/admin` routing
**Requirements:** AUTH-01, AUTH-02

## Phase 3: Content Management (Admin)
**Goal:** Build the secure CMS dashboard
**Scope:**
- Admin dashboard layout
- Hero editor form (with storage upload)
- Skills CRUD interface
- Projects CRUD interface
- Experience CRUD interface
**Requirements:** CMS-01, CMS-02, CMS-03, CMS-04, CMS-05

## Phase 4: Public Frontend (SSR)
**Goal:** Wire the public portfolio to fetch real-time data
**Scope:**
- Refactor Hero component strictly with SSR fetches
- Refactor Skills component
- Refactor Projects component
- Refactor Experience component
**Requirements:** APP-01, APP-02, APP-03, APP-04

## Phase 5: Contact Flow
**Goal:** Implement server-side email delivery via Resend
**Scope:**
- Create Next.js API route / Server Action integrating Resend
- Wire the public contact form
**Requirements:** MAIL-01, MAIL-02
