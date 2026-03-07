# Specification: cloudflare-migration

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Version:** 1.0
**Status:** Approved
**Branch:** genesis/001-cloudflare-migration

---

## 1. Overview

The site currently deploys to GitHub Pages under a subpath (`/Landing-Page`), requiring a base path hack in the build configuration. This feature migrates hosting to Cloudflare Pages, deploying directly to the `natoken.dev` domain with no subpath. It also addresses three immediate legacy items from the constitution: removing the base path hack, replacing the old blue accent color with the brand color `#ed0049`, and establishing security headers.

This is a foundational infrastructure change that every future feature depends on. After this migration, the site will be live at `natoken.dev` with clean URLs, proper security headers, and the correct brand identity.

## 2. Design Document References

- [Design Overview](../../design/overview.md) — Section 4c (Convergence Path, step 1)
- [Architecture](../../design/technical/architecture.md) — Section 6 (Build & Deploy Pipeline)
- [Design System](../../design/system.md) — Section 2 (Color Palette)
- [Constitution](../../constitution.md) — Section 2 (Infrastructure), Section 7 (Security), Section 12 (Legacy Handling)

## 3. User Stories

### US-001: Clean URL Access
**As a** visitor, **I want to** access the site at `natoken.dev` **so that** I see a professional, branded domain without subpath artifacts.

### US-002: Correct Brand Identity
**As a** visitor, **I want to** see the Natoken brand color (`#ed0049`) used consistently throughout the site **so that** the visual identity matches the company brand.

### US-003: Secure Browsing
**As a** visitor, **I want to** browse the site over HTTPS with proper security headers **so that** my connection is secure and the site follows modern web security practices.

### US-004: Fast Global Access
**As a** visitor anywhere in the world, **I want to** load the site quickly **so that** I don't abandon the page before content appears.

### US-005: Continuous Deployment
**As a** developer, **I want to** push to `main` and have the site automatically deploy to `natoken.dev` **so that** the deployment process requires zero manual steps.

## 4. Functional Requirements

### From US-001: Clean URL Access

- **FR-001:** The site must be accessible at `https://natoken.dev` as the primary URL.
- **FR-002:** The site must be accessible at `https://www.natoken.dev` and redirect to the non-www version (or vice versa — one canonical domain).
- **FR-003:** All internal links and asset references must work without any base path prefix.
- **FR-004:** The old GitHub Pages deployment at the `/Landing-Page` subpath must no longer be the production target.

### From US-002: Correct Brand Identity

- **FR-005:** All instances of the old accent color (`#2563eb` and its hover variant `#3b82f6`) must be replaced with the constitutional brand color (`#ed0049`) and its appropriate hover/glow variants.
- **FR-006:** The design token system must define the new accent color as the single source of truth for brand color throughout the site.
- **FR-007:** Focus outlines and interactive element highlights must use the new brand color.

### From US-003: Secure Browsing

- **FR-008:** The site must serve security headers on all responses: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Content-Security-Policy`.
- **FR-009:** The site must enforce HTTPS. HTTP requests must redirect to HTTPS.
- **FR-010:** The Content-Security-Policy must allow the site's own scripts, styles, Google Fonts, and nothing else.

### From US-005: Continuous Deployment

- **FR-011:** Pushing a commit to the `main` branch must trigger an automatic build and deploy to the production domain.
- **FR-012:** The build process must produce a static site output compatible with the hosting platform.
- **FR-013:** The old GitHub Pages deploy workflow must be removed or disabled to prevent conflicting deployments.
- **FR-014:** GitHub Pages must be disabled in the repository settings to fully tear down the old deployment.

## 5. Non-Functional Requirements

- **NFR-001:** The site must achieve a Lighthouse Performance score of 90+ after migration.
- **NFR-002:** First Contentful Paint must be under 1.5 seconds on a simulated 4G connection.
- **NFR-003:** The migration must not introduce any visual regressions — the site must look identical (except for the color change) before and after migration.
- **NFR-004:** The build must complete in under 60 seconds.
- **NFR-005:** All existing pages must return HTTP 200 with correct content after migration.

## 6. Acceptance Criteria

- [ ] **AC-001:** Navigating to `https://natoken.dev` displays the site's homepage with correct content and styling.
- [ ] **AC-002:** No page, link, or asset reference contains `/Landing-Page` or any base path prefix.
- [ ] **AC-003:** The build configuration has no conditional base path logic.
- [ ] **AC-004:** All instances of `#2563eb` and `#3b82f6` in the codebase are replaced with the brand color `#ed0049` and its variants.
- [ ] **AC-005:** The CSS design tokens define `--color-accent: #ed0049` as the accent color.
- [ ] **AC-006:** Response headers include `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy`.
- [ ] **AC-007:** HTTP requests redirect to HTTPS.
- [ ] **AC-008:** Pushing to `main` triggers an automatic build and deployment to `natoken.dev`.
- [ ] **AC-009:** The GitHub Pages deploy workflow is removed from the repository.
- [ ] **AC-010:** `npm run build` succeeds with zero errors and zero warnings.
- [ ] **AC-011:** The site renders correctly on Chrome, Firefox, and Safari (latest).
- [ ] **AC-012:** All static assets (images, fonts, favicon) load correctly without 404 errors.

## 7. Out of Scope

- **Custom domain email** — DNS is configured for web only, email is not part of this spec.
- **Analytics or tracking** — No analytics added during this migration (requires constitutional amendment).
- **Design changes beyond color** — The layout, components, and structure remain unchanged. This is infrastructure + brand color only.
- **New pages or features** — No new routes, components, or content added.
- **DNS provider migration** — This spec assumes DNS can be pointed to the hosting provider. The actual DNS registrar setup is a manual step guided by documentation.

## 8. Open Questions

- [x] **OQ-001:** ~~Is the domain `natoken.dev` already registered and under Nagi's control?~~ **Resolved:** Yes, domain is registered and DNS is under owner's control.
- [x] **OQ-002:** ~~Should `www.natoken.dev` redirect to `natoken.dev` or vice versa?~~ **Resolved:** Both `www` and non-www will work via Cloudflare Pages (both served, canonical handled by Cloudflare).
- [x] **OQ-003:** ~~Should the old GitHub Pages site be torn down?~~ **Resolved:** Yes, tear it down. Remove the deploy workflow and disable GitHub Pages in repo settings.

## 9. Constitution Compliance Check

| Constitution Section | Compliance | Notes |
|---------------------|------------|-------|
| 1. Mission | Compliant | Clean domain reinforces professional identity |
| 2. Tech Stack | Compliant | Cloudflare Pages is the declared hosting target |
| 3. Architecture | Compliant | Static-first principle maintained; no server-side logic added |
| 5. Testing | Compliant | Build verification maintained |
| 6. Quality Gates | Compliant | All gates addressed in acceptance criteria |
| 7. Security | Compliant | Security headers explicitly specified (FR-008 through FR-010) |
| 8. Performance | Compliant | Lighthouse 90+ and FCP targets in NFRs |
| 10. Version Control | Compliant | Auto-deploy on push to main as declared |
| 12. Legacy Handling | Compliant | Addresses 3 "Immediate" legacy items: base path hack, GitHub Pages workflow, blue accent |

## 10. Changelog

| Version | Date | Change | Reason |
|---------|------|--------|--------|
| 1.0 | 2026-03-07 | Initial specification | — |
