# Implementation Plan: cloudflare-migration

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Version:** 1.0
**Status:** Approved
**Spec:** `.genesis/specs/cloudflare-migration/spec.md`
**Branch:** genesis/001-cloudflare-migration

---

## 1. Input References

- **Specification:** `.genesis/specs/cloudflare-migration/spec.md`
- **Constitution:** `.genesis/constitution.md` (Sections 2, 7, 8, 12)
- **Design Docs:**
  - `.genesis/design/overview.md` — Convergence Path step 1
  - `.genesis/design/technical/architecture.md` — Build & Deploy Pipeline (Section 6)
  - `.genesis/design/system.md` — Color Palette (Section 2)

## 2. Technical Context

- **Language:** JavaScript (ES Modules)
- **Framework:** SvelteKit ^2.x with Svelte ^5.x
- **Build:** Vite ^6.x
- **Adapter:** `@sveltejs/adapter-static` (unchanged — works with Cloudflare Pages)
- **Hosting target:** Cloudflare Pages (connected to GitHub repo, auto-deploys on push to `main`)
- **No new dependencies required** — this is purely config and CSS changes

## 3. Constitution Compliance

| Constitutional Section | How This Plan Complies | Tensions/Justifications |
|-----------------------|----------------------|------------------------|
| 2. Tech Stack | Cloudflare Pages is the declared hosting target. adapter-static preserved. No new deps. | None |
| 3. Architecture | Static-first maintained. No server logic introduced. | None |
| 4. Code Standards | CSS tokens updated per naming conventions (`--color-*`). No new file patterns. | None |
| 7. Security | Security headers added via `static/_headers` file per constitution spec. | CSP allows `unsafe-inline` for Svelte SSR output — necessary, documented in architecture |
| 8. Performance | Cloudflare CDN improves global latency. No bundle size changes. | None |
| 10. Version Control | Working on feature branch, conventional commits. | None |
| 12. Legacy Handling | Addresses 3 "Immediate" items: base path, deploy workflow, accent color. | None |

## 4. Component Architecture

### New Components

| Component | Responsibility | Location |
|-----------|---------------|----------|
| None | — | — |

### Modified Components

| Component | Modification | Reason |
|-----------|-------------|--------|
| `svelte.config.js` | Remove `paths.base` conditional | FR-003: No base path in production |
| `src/app.css` | Update `--color-accent`, `--color-accent-hover`, and all hardcoded blue `rgba()` values | FR-005, FR-006, FR-007 |
| `src/routes/+layout.svelte` | Remove `<base>` tag, simplify asset references, update hardcoded blue `rgba()` values | FR-003, FR-005 |
| `src/lib/components/CenterPanelContent.svelte` | Simplify image `src` (remove base path ternary) | FR-003 |
| `src/lib/components/RightPanelContent.svelte` | Simplify image `src` | FR-003 |
| `src/lib/components/ProductDrawer.svelte` | Simplify image `src`, update blue focus outline | FR-003, FR-005 |
| `src/lib/components/ProductSpotlight.svelte` | Simplify image `src`, update blue focus outline | FR-003, FR-005 |
| `src/lib/components/ParticleRenderer.svelte` | Update particle color from `#58a6ff` to brand color, update blue gradient values | FR-005 |

### New Files

| File | Purpose |
|------|---------|
| `static/_headers` | Cloudflare Pages security headers (FR-008, FR-009, FR-010) |

### Deleted Files

| File | Reason |
|------|--------|
| `.github/workflows/deploy.yml` | FR-013: Remove GitHub Pages deploy workflow |

### Component Interactions
No new component interactions. All changes are config-level (build, deploy) or cosmetic (color tokens). The component tree and data flow remain identical.

## 5. Data Model Changes

### New Entities
None

### Modified Entities
None

### Migrations
None — no data changes.

## 6. API/Interface Design

Not applicable — static site, no API endpoints.

## 7. Implementation Strategy

### Build Order

1. **Remove base path hack** — Update `svelte.config.js` to remove the conditional `paths.base`. This is the foundation — all other changes depend on clean paths.

2. **Simplify asset references** — Update all 4 components that use `base ? ...` ternaries for image sources. Remove the `<base>` tag from `+layout.svelte`. Remove the `import { base } from '$app/paths'` where it's no longer needed.

3. **Swap accent color** — Update `app.css` design tokens (`--color-accent`, `--color-accent-hover`). Then sweep all source files for hardcoded blue values (`#58a6ff`, `rgba(88, 166, 255, ...)`), replacing them with the new brand color equivalents.

4. **Add security headers** — Create `static/_headers` file with constitutional security headers.

5. **Delete GitHub Pages workflow** — Remove `.github/workflows/deploy.yml`.

6. **Verify build** — Run `npm run build` to confirm zero errors/warnings.

7. **Cloudflare Pages setup** — Manual step: connect GitHub repo to Cloudflare Pages, configure build command and output directory, add custom domain `natoken.dev`. Guide the user through this.

8. **Disable GitHub Pages** — Manual step: disable GitHub Pages in repo settings.

### Color Replacement Map

| Old Value | New Value | Context |
|-----------|-----------|---------|
| `#2563eb` | `#ed0049` | `--color-accent` token |
| `#3b82f6` | `#ff1a5e` | `--color-accent-hover` token |
| `#58a6ff` | `#ed0049` | ParticleRenderer color, CSS hover states |
| `rgba(88, 166, 255, 0.5)` | `rgba(237, 0, 73, 0.4)` | Focus outlines |
| `rgba(88, 166, 255, 0.06)` | `rgba(237, 0, 73, 0.06)` | Button hover backgrounds |
| `rgba(88, 166, 255, 0.08)` | `rgba(237, 0, 73, 0.08)` | Panel gradient tints, hero glow |
| `rgba(88, 166, 255, 0.03)` | `rgba(237, 0, 73, 0.03)` | Panel gradient mid |
| `rgba(88, 166, 255, 0.04)` | `rgba(237, 0, 73, 0.04)` | Panel gradient end |
| `rgba(88, 166, 255, 0.05)` | `rgba(237, 0, 73, 0.05)` | Subtle tints |
| `rgba(88, 166, 255, 0.12)` | `rgba(237, 0, 73, 0.12)` | ParticleRenderer gradient |
| `rgba(88, 166, 255, 0.15)` | `rgba(237, 0, 73, 0.15)` | Product card hover glow |

### Files Touched (Ordered)

| # | File | Changes |
|---|------|---------|
| 1 | `svelte.config.js` | Remove `paths.base` conditional |
| 2 | `src/routes/+layout.svelte` | Remove `<base>` tag, remove `base` import, simplify; update blue gradients |
| 3 | `src/lib/components/CenterPanelContent.svelte` | Simplify image src |
| 4 | `src/lib/components/RightPanelContent.svelte` | Simplify image src |
| 5 | `src/lib/components/ProductDrawer.svelte` | Simplify image src, update focus outline |
| 6 | `src/lib/components/ProductSpotlight.svelte` | Simplify image src, update focus outline |
| 7 | `src/app.css` | Update `--color-accent`, `--color-accent-hover`, all hardcoded blue rgba values |
| 8 | `src/lib/components/ParticleRenderer.svelte` | Update particle color and gradient |
| 9 | `static/_headers` | Create with security headers |
| 10 | `.github/workflows/deploy.yml` | Delete |

### Risk Areas

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missed blue color instance | Low | Low | Grep sweep for all blue variants before commit. Pre-commit hook warns on `#2563eb`/`#3b82f6`. |
| Cloudflare Pages build failure | Low | Medium | Test `npm run build` locally first. Cloudflare uses same Node 20 + npm ci flow. |
| DNS propagation delay | Medium | Low | Expected — site may be unavailable for 0-48h during DNS switch. Not a code issue. |
| Broken asset paths after base removal | Low | High | Test all images load locally after removing base path logic. |
| CSP too restrictive | Medium | Medium | Test in browser dev tools for CSP violations. Loosen if needed (e.g., Svelte inline styles). |

## 8. Research Items

No technical unknowns — all technologies and patterns are well-documented and familiar.

## 9. Testing Strategy

| Acceptance Criterion | Test Type | Approach |
|---------------------|-----------|----------|
| AC-001 | Manual | Navigate to `https://natoken.dev` after deploy, verify homepage |
| AC-002 | Automated | Grep codebase for `/Landing-Page` — must return zero results |
| AC-003 | Manual | Inspect `svelte.config.js` — no conditional base path |
| AC-004 | Automated | Grep codebase for `#2563eb`, `#3b82f6`, `#58a6ff` — must return zero results |
| AC-005 | Manual | Inspect `app.css` — `--color-accent: #ed0049` |
| AC-006 | Manual | Check response headers in browser dev tools or `curl -I` |
| AC-007 | Manual | Navigate to `http://natoken.dev` — should redirect to HTTPS (Cloudflare default) |
| AC-008 | Manual | Push to main, verify Cloudflare Pages triggers build and deploys |
| AC-009 | Automated | Check `.github/workflows/deploy.yml` does not exist |
| AC-010 | Automated | Run `npm run build` — exit code 0, no warnings |
| AC-011 | Manual | Open site in Chrome, Firefox, Safari — visual check |
| AC-012 | Manual | Check browser network tab — no 404 errors for assets |

## 10. Deployment Considerations

- **Migrations:** None — no data to migrate.
- **Feature Flags:** None needed — this is an all-or-nothing infrastructure switch.
- **Backward Compatibility:** The GitHub Pages site will go offline when the workflow is removed and Pages is disabled. The new Cloudflare Pages site should be verified working before tearing down the old one.
- **Rollback Plan:** Re-add the `deploy.yml` workflow and restore the `paths.base` conditional in `svelte.config.js`. Re-enable GitHub Pages in repo settings. The old deploy should resume on next push to main.

### Deployment Sequence

1. Make all code changes (base path, colors, headers, delete workflow)
2. Test locally with `npm run build && npm run preview`
3. Set up Cloudflare Pages project (manual, guided)
4. Push to main — Cloudflare deploys automatically
5. Verify site at `natoken.dev`
6. Point DNS to Cloudflare (manual, guided)
7. Verify DNS propagation
8. Disable GitHub Pages in repo settings (manual, guided)

## 11. Integration with Existing Code

- **Existing Modules Touched:** `svelte.config.js`, `app.css`, `+layout.svelte`, 4 components (CenterPanelContent, RightPanelContent, ProductDrawer, ProductSpotlight), ParticleRenderer
- **Interfaces to Preserve:** All component props and public interfaces remain unchanged. Only internal template and style changes.
- **Data Migration:** None
- **Deprecation:**
  - `import { base } from '$app/paths'` — removed from `+layout.svelte` (no longer needed when base is empty)
  - `base ? ... : ...` ternary pattern in image sources — replaced with direct `/{path}` references
  - `.github/workflows/deploy.yml` — deleted entirely

## Changelog

| Version | Date | Change | Reason |
|---------|------|--------|--------|
| 1.0 | 2026-03-07 | Initial plan | — |
