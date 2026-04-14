# Requirements: Amplify Portfolio CMS

**Defined:** 2026-04-14
**Core Value:** To provide an effortlessly manageable portfolio experience where the owner can update content in real-time through an intuitive admin panel without touching the frontend code.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [ ] **INFRA-01**: Initialize and configure Supabase project and database schema
- [ ] **INFRA-02**: Connect Next.js application to Supabase seamlessly

### Authentication

- [ ] **AUTH-01**: Build secure Admin login page
- [ ] **AUTH-02**: Implement protected routing middleware for all `/admin` paths

### Content Management (Admin)

- [ ] **CMS-01**: Build main Admin Dashboard overview
- [ ] **CMS-02**: Build Hero section editor (manage title, subtitle, image uploads)
- [ ] **CMS-03**: Build Skills section editor (CRUD technical skills)
- [ ] **CMS-04**: Build Projects section editor (CRUD portfolio items)
- [ ] **CMS-05**: Build Experience section editor (CRUD work history)

### Public Frontend (SSR Updates)

- [ ] **APP-01**: Refactor Hero component to fetch data from Supabase via SSR
- [ ] **APP-02**: Refactor Skills component to fetch data from Supabase via SSR
- [ ] **APP-03**: Refactor Projects component to fetch data from Supabase via SSR
- [ ] **APP-04**: Refactor Experience component to fetch data from Supabase via SSR

### Contact Flow

- [ ] **MAIL-01**: Create secure Next.js Server Action or API Route integrating Resend API
- [ ] **MAIL-02**: Update public Contact form to submit messages through Resend

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics

- **STAT-01**: Implement page view tracking in the admin dashboard.
- **STAT-02**: Track resume downloads.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Public user authentication/comments | Not needed for a portfolio site; only the owner requires access. |
| Automatic SSG revalidation paths | We are opting for SSR per user preference for real-time immediate updates. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| CMS-01 | Phase 3 | Pending |
| CMS-02 | Phase 3 | Pending |
| CMS-03 | Phase 3 | Pending |
| CMS-04 | Phase 3 | Pending |
| CMS-05 | Phase 3 | Pending |
| APP-01 | Phase 4 | Pending |
| APP-02 | Phase 4 | Pending |
| APP-03 | Phase 4 | Pending |
| APP-04 | Phase 4 | Pending |
| MAIL-01 | Phase 5 | Pending |
| MAIL-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-14*
*Last updated: 2026-04-14 after initial definition*
