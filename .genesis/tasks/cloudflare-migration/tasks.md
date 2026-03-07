# Tasks: cloudflare-migration

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Plan:** `.genesis/plans/cloudflare-migration/plan.md`
**Spec:** `.genesis/specs/cloudflare-migration/spec.md`
**Branch:** genesis/001-cloudflare-migration

---

## Summary

- **Total Tasks:** 7
- **Complexity:** 5 Small, 2 Medium, 0 Large
- **Critical Path:** T-001 → T-002 → T-003 → T-006 → T-007
- **Progress:** 6 of 7 complete

## Dependency Graph

```
T-001 (Remove base path) ──► T-002 (Simplify asset refs) ──► T-006 (Build verify)
                                                                    │
T-003 (Swap accent color) ─────────────────────────────────────────►│
        [P]                                                         │
T-004 (Security headers) ─────────────────────────────────────────►│
        [P]                                                         │
T-005 (Delete GH Pages workflow) ──────────────────────────────────►│
        [P]                                                         ▼
                                                              T-007 (Cloudflare setup)
```

Note: T-003, T-004, T-005 can all run in parallel after T-001.
T-002 depends on T-001. T-006 depends on all code changes (T-001 through T-005).
T-007 is manual and depends on T-006 passing.

---

## Group 1: Foundation

### T-001: Remove base path hack

**Status:** Complete
**Complexity:** Small
**Dependencies:** None
**Parallel:** —

#### Objective
Remove the conditional `/Landing-Page` base path from the SvelteKit config so the site builds for root deployment.

#### Acceptance Criteria
- [ ] `svelte.config.js` has no `paths.base` property (or it is set to `''`)
- [ ] No reference to `Landing-Page` exists anywhere in the codebase
- [ ] `npm run build` succeeds after the change

#### File Paths
- Modifies: `svelte.config.js`

#### Constitution References
- Section 2 (Infrastructure): Domain is `natoken.dev`, no subpath
- Section 12 (Legacy): Base path hack is "Immediate" priority

#### Commit Message
`fix(config): remove base path hack for root deployment`

---

### T-002: Simplify asset references

**Status:** Complete
**Complexity:** Medium
**Dependencies:** T-001
**Parallel:** —

#### Objective
Remove all `base` path ternary logic from components and the `<base>` tag from the layout. Images and assets use direct paths (`/filename.ext`).

#### Acceptance Criteria
- [ ] `+layout.svelte` has no `<base>` tag and no `import { base }` from `$app/paths`
- [ ] `CenterPanelContent.svelte` uses direct image paths (no `base` ternary)
- [ ] `RightPanelContent.svelte` uses direct image paths
- [ ] `ProductDrawer.svelte` uses direct image paths
- [ ] `ProductSpotlight.svelte` uses direct image paths
- [ ] All images render correctly in `npm run preview`

#### File Paths
- Modifies: `src/routes/+layout.svelte`
- Modifies: `src/lib/components/CenterPanelContent.svelte`
- Modifies: `src/lib/components/RightPanelContent.svelte`
- Modifies: `src/lib/components/ProductDrawer.svelte`
- Modifies: `src/lib/components/ProductSpotlight.svelte`

#### Constitution References
- Section 3 (Architecture): Clean, simple asset loading
- Section 12 (Legacy): Base path hack removal

#### Commit Message
`refactor(assets): remove base path ternaries from all components`

---

## Group 2: Core Changes

### T-003: Swap accent color to brand #ed0049

**Status:** Complete
**Complexity:** Medium
**Dependencies:** None
**Parallel:** [P] — can run in parallel with T-004, T-005

#### Objective
Replace all instances of the old blue accent color (`#2563eb`, `#3b82f6`, `#58a6ff`, and all `rgba(88, 166, 255, ...)` variants) with the constitutional brand color `#ed0049` and its derived variants.

#### Color Replacement Map
| Old | New | Context |
|-----|-----|---------|
| `#2563eb` | `#ed0049` | `--color-accent` |
| `#3b82f6` | `#ff1a5e` | `--color-accent-hover` |
| `#58a6ff` | `#ed0049` | ParticleRenderer, misc |
| `rgba(88, 166, 255, 0.5)` | `rgba(237, 0, 73, 0.4)` | Focus outlines |
| `rgba(88, 166, 255, 0.06)` | `rgba(237, 0, 73, 0.06)` | Btn hover bg |
| `rgba(88, 166, 255, 0.08)` | `rgba(237, 0, 73, 0.08)` | Panel gradients, hero glow |
| `rgba(88, 166, 255, 0.03)` | `rgba(237, 0, 73, 0.03)` | Panel gradient mid |
| `rgba(88, 166, 255, 0.04)` | `rgba(237, 0, 73, 0.04)` | Panel gradient end |
| `rgba(88, 166, 255, 0.05)` | `rgba(237, 0, 73, 0.05)` | Subtle tints |
| `rgba(88, 166, 255, 0.12)` | `rgba(237, 0, 73, 0.12)` | ParticleRenderer gradient |
| `rgba(88, 166, 255, 0.15)` | `rgba(237, 0, 73, 0.15)` | Product card hover glow |

#### Acceptance Criteria
- [ ] `--color-accent` in `app.css` is `#ed0049`
- [ ] `--color-accent-hover` in `app.css` is `#ff1a5e`
- [ ] Grep for `#2563eb`, `#3b82f6`, `#58a6ff`, and `88, 166, 255` returns zero results in `src/`
- [ ] Focus outlines use the new brand color
- [ ] ParticleRenderer uses the new brand color
- [ ] Panel background gradients use the new brand color
- [ ] All hover/interactive states use the new brand color

#### File Paths
- Modifies: `src/app.css`
- Modifies: `src/lib/components/ParticleRenderer.svelte`
- Modifies: `src/lib/components/ProductDrawer.svelte`
- Modifies: `src/lib/components/ProductSpotlight.svelte`
- Modifies: `src/routes/+layout.svelte`

#### Constitution References
- Section 2 (Brand): Primary accent is `#ed0049`
- Section 4 (Code Standards): CSS tokens as single source of truth
- Section 12 (Legacy): Blue accent is "Immediate" priority

#### Commit Message
`style(brand): replace blue accent with #ed0049 brand color`

---

## Group 3: Infrastructure

### T-004: Add security headers

**Status:** Complete
**Complexity:** Small
**Dependencies:** None
**Parallel:** [P]

#### Objective
Create a `_headers` file in the static directory that configures security headers for Cloudflare Pages.

#### Acceptance Criteria
- [ ] `static/_headers` exists with headers for all routes (`/*`)
- [ ] Headers include: `X-Frame-Options: DENY`
- [ ] Headers include: `X-Content-Type-Options: nosniff`
- [ ] Headers include: `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Headers include: `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [ ] Headers include: a `Content-Security-Policy` allowing self, inline, and Google Fonts

#### File Paths
- Creates: `static/_headers`

#### Constitution References
- Section 7 (Security): CSP, HSTS, X-Frame-Options via `_headers` file

#### Commit Message
`feat(security): add Cloudflare Pages security headers`

---

### T-005: Delete GitHub Pages deploy workflow

**Status:** Complete
**Complexity:** Small
**Dependencies:** None
**Parallel:** [P]

#### Objective
Remove the GitHub Pages deploy workflow to prevent conflicting deployments and formally tear down the old hosting.

#### Acceptance Criteria
- [ ] `.github/workflows/deploy.yml` does not exist
- [ ] No GitHub Pages-specific configuration remains in the repo

#### File Paths
- Deletes: `.github/workflows/deploy.yml`

#### Constitution References
- Section 2 (Infrastructure): Cloudflare Pages replaces GitHub Pages
- Section 12 (Legacy): GitHub Pages workflow is "Immediate" priority

#### Commit Message
`chore(deploy): remove GitHub Pages workflow`

---

## Group 4: Verification

### T-006: Build verification and local testing

**Status:** Complete
**Complexity:** Small
**Dependencies:** T-001, T-002, T-003, T-004, T-005
**Parallel:** —

#### Objective
Verify the build passes with zero errors/warnings and the site renders correctly locally with all changes applied.

#### Acceptance Criteria
- [ ] `npm run build` exits with code 0, zero errors, zero warnings
- [ ] `npm run preview` shows the site with correct brand colors
- [ ] All images load without 404 errors
- [ ] Grep for `Landing-Page` in entire codebase returns zero results
- [ ] Grep for `#2563eb`, `#3b82f6`, `#58a6ff`, `88, 166, 255` in `src/` returns zero results
- [ ] No console errors in browser dev tools

#### File Paths
- Modifies: None (verification only)

#### Constitution References
- Section 6 (Quality Gates): Build must succeed with zero errors/warnings
- Section 8 (Performance): Verify no regressions

#### Commit Message
N/A — verification task, no code changes

---

## Group 5: Deploy & Teardown

### T-007: Cloudflare Pages setup and GitHub Pages teardown

**Status:** Pending
**Complexity:** Small
**Dependencies:** T-006
**Parallel:** —

#### Objective
Guide the user through connecting the GitHub repo to Cloudflare Pages, configuring the custom domain `natoken.dev`, and disabling GitHub Pages in repo settings.

#### Acceptance Criteria
- [ ] Cloudflare Pages project is connected to the GitHub repo
- [ ] Build command is set to `npm run build`, output directory is `build`
- [ ] Custom domain `natoken.dev` is configured and DNS is pointed
- [ ] HTTPS is enforced (Cloudflare default)
- [ ] Site is accessible at `https://natoken.dev`
- [ ] GitHub Pages is disabled in repo settings (Settings → Pages → Source: None)

#### File Paths
- No code changes — manual configuration steps

#### Constitution References
- Section 2 (Infrastructure): Cloudflare Pages hosting, `natoken.dev` domain
- Section 7 (Security): HTTPS enforcement

#### Commit Message
N/A — manual setup, no code changes

---

## Convergence Milestone

**After Task:** T-007
**Description:** With Cloudflare Pages live and GitHub Pages torn down, the project's hosting infrastructure matches the constitutional target. All subsequent features deploy cleanly to `natoken.dev` with proper security headers and brand identity.

**Criteria:**
- [ ] Site live at `https://natoken.dev`
- [ ] Brand color `#ed0049` active throughout
- [ ] Security headers served on all responses
- [ ] Auto-deploy on push to `main`
- [ ] No legacy base path or GitHub Pages artifacts remain

---

## Coverage Verification

### Functional Requirements → Tasks

| Requirement | Covered By |
|-------------|-----------|
| FR-001 (Site at natoken.dev) | T-007 |
| FR-002 (www + non-www) | T-007 |
| FR-003 (No base path prefix) | T-001, T-002 |
| FR-004 (Old GH Pages not production) | T-005, T-007 |
| FR-005 (Replace blue accent) | T-003 |
| FR-006 (Design token single source) | T-003 |
| FR-007 (Focus outlines use brand) | T-003 |
| FR-008 (Security headers) | T-004 |
| FR-009 (HTTPS enforcement) | T-007 |
| FR-010 (CSP) | T-004 |
| FR-011 (Auto-deploy on push) | T-007 |
| FR-012 (Static output compatible) | T-001, T-006 |
| FR-013 (Remove GH Pages workflow) | T-005 |
| FR-014 (Disable GH Pages) | T-007 |

### Acceptance Criteria → Task Criteria

| Spec AC | Task AC |
|---------|---------|
| AC-001 (natoken.dev shows homepage) | T-007 criterion 5 |
| AC-002 (No /Landing-Page refs) | T-001 criterion 2, T-006 criterion 4 |
| AC-003 (No conditional base path) | T-001 criterion 1 |
| AC-004 (No blue color in codebase) | T-003 criteria 3-7, T-006 criterion 5 |
| AC-005 (--color-accent: #ed0049) | T-003 criterion 1 |
| AC-006 (Security headers present) | T-004 criteria 2-6 |
| AC-007 (HTTP redirects to HTTPS) | T-007 criterion 4 |
| AC-008 (Auto-deploy on push) | T-007 criteria 1-2 |
| AC-009 (deploy.yml removed) | T-005 criterion 1 |
| AC-010 (Build succeeds) | T-006 criterion 1 |
| AC-011 (Cross-browser rendering) | T-006 criterion 2 |
| AC-012 (Assets load without 404) | T-006 criterion 3 |

### Testing Strategy → Test Tasks

| Plan Test | Task |
|-----------|------|
| Grep for Landing-Page | T-006 criterion 4 |
| Grep for old blue colors | T-006 criterion 5 |
| npm run build passes | T-006 criterion 1 |
| Visual check in browsers | T-006 criterion 2 |
| Response headers check | T-007 (post-deploy) |
