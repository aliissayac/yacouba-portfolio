# Amplify Portfolio CMS

## What This Is

A dynamic, CMS-driven portfolio built with Next.js 15, React 19, and Tailwind CSS. The application features a secure admin dashboard powered by Supabase, enabling real-time content management for all primary portfolio sections (Hero, Skills, Projects, Experience) while allowing external users to send direct messages via the Resend email API.

## Core Value

To provide an effortlessly manageable portfolio experience where the owner can update content in real-time through an intuitive admin panel without touching the frontend code.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Responsive portfolio layout with Hero, Skills, Projects, Experience, and Contact sections
- ✓ Context-driven Light/Dark mode theming
- ✓ Context-driven multi-language support (i18n)
- ✓ TypeScript and modern Next.js App Router foundational architecture

### Active

<!-- Current scope. Building toward these. -->

- [ ] Connect portfolio to a Supabase backend project
- [ ] Implement Admin secure login/authentication system via Supabase Auth
- [ ] Create an Admin Dashboard landing page
- [ ] Build Hero section editor (text updates and photo uploads via Supabase Storage)
- [ ] Build Skills section editor (manage technical skills)
- [ ] Build Projects section editor (manage portfolio pieces, images, descriptions)
- [ ] Build Experience section editor (manage work history)
- [ ] Refactor portfolio public pages to utilize Server-Side Rendering (SSR) for fetching content dynamically from Supabase
- [ ] Integrate Resend API into the Contact Form to forward messages directly to email

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Static Site Generation (SSG) with Revalidation — Explicitly deferred in favor of direct Server-Side Rendering (SSR)/Real-time data fetching for maximum freshness.
- General public user authentication — Only the owner/admin needs to log in.

## Context

The application is an existing local static portfolio using Next.js 15, meaning all Next.js best practices and `rocketCritical` dependency warnings from `package.json` must be strictly respected. It uses React 19 patterns. Because of the requirement for SSR data fetching, we will heavily utilize Next.js server components rather than client components where feasible to ensure performance remains high despite real-time database queries.

## Constraints

- **Tech Stack**: Next.js 15, React 19, Tailwind CSS 3.4
- **Dependencies**: Native versions in package.json must not be mutated (per `rocketCritical`)
- **Backend Infrastructure**: Supabase exclusively for Database, Auth, and Storage.
- **Email Delivery**: Dependent strictly on the Resend API for outgoing messages.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js SSR vs SSG | Chosen SSR to provide true real-time content updates for visitors the moment the admin changes data in the CRM. | — Pending |
| Supabase Auth | Provides an out-of-the-box secure JWT mechanism easily integrated via Supabase's SSR auth package. | — Pending |
| Resend API | Lightweight, modern API for email sending that plays perfectly inside Next.js API routes/Server Actions without bloated SDKs. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-14 after initialization*
