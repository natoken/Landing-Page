# Tasks: Constellation

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Plan:** `.genesis/plans/constellation/plan.md`
**Spec:** `.genesis/specs/constellation/spec.md`
**Branch:** genesis/002-constellation

---

## Summary

- **Total Tasks:** 10
- **Complexity:** 4 Small, 5 Medium, 1 Large (split into subtasks)
- **Critical Path:** T-001 → T-002 → T-004 → T-005 → T-008 → T-009 → T-010
- **Progress:** 1 of 10 complete

## Dependency Graph

```
T-001 (Install deps) ──► T-002 (Stores + tokens) ──► T-004 (StarField)
                                    │                       │
                                    ├──► T-003 (Fallback)   │
                                    │         [P]           │
                                    │                       ▼
                                    │                 T-005 (CameraController)
                                    │                       │
                                    │                       ▼
                                    ├──────────────► T-006 (SixCorners) [P]
                                    │                       │
                                    ├──────────────► T-007 (ProductBranches) [P]
                                    │                       │
                                    │                       ▼
                                    │                 T-008 (ConstellationScene)
                                    │                       │
                                    │                       ▼
                                    │                 T-009 (Layout integration)
                                    │                       │
                                    │                       ▼
                                    └────────────────T-010 (Cleanup + verification)
```

T-003 can run in parallel with T-004.
T-006 and T-007 can run in parallel after T-002 (data layer ready), but integrate into the scene via T-008.

---

## Group 1: Foundation

### T-001: Install Threlte and Three.js dependencies

**Status:** Complete
**Complexity:** Small
**Dependencies:** None
**Parallel:** —

#### Objective
Add `@threlte/core`, `@threlte/extras`, and `three` as devDependencies. Verify the build still passes with the new dependencies.

#### Acceptance Criteria
- [ ] `@threlte/core`, `@threlte/extras`, and `three` are listed in `package.json` devDependencies
- [ ] `npm install` completes without errors
- [ ] `npm run build` succeeds with zero errors and zero warnings
- [ ] No other dependencies are added

#### File Paths
- Modifies: `package.json`

#### Constitution References
- Section 2 (Technology Stack): Threlte ^8.x, Three.js ^0.170.x are pre-approved
- Section 6 (Quality Gates): No new deps without constitutional justification

#### Commit Message
`feat(deps): add Threlte and Three.js for constellation scene`

---

### T-002: Create stores and design tokens

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-001
**Parallel:** —

#### Objective
Create the reactive stores needed by the constellation (reducedMotion, webglAvailable, constellationReady) and extend `app.css` with missing design tokens from the design system. Create the constellation data module with 6 Corners positions and product branch layout.

#### Acceptance Criteria
- [ ] `src/lib/stores/motion.js` exports a `reducedMotion` store that reactively tracks `prefers-reduced-motion` and responds to runtime changes
- [ ] `src/lib/stores/webgl.js` exports a `webglAvailable` store (boolean, checked once)
- [ ] `src/lib/stores/constellation.js` exports a `constellationReady` store (writable boolean)
- [ ] `src/lib/data/constellation.js` exports corner positions (6 hexagonal coords with filled status), product branch positions, and star density bias configuration
- [ ] `app.css` includes new tokens: `--color-accent-glow`, `--color-accent-subtle`, `--color-star`, `--color-star-dim`, `--glass-bg-hover`, `--glass-border-hover`, `--glass-blur-heavy`
- [ ] `npm run build` succeeds

#### File Paths
- Creates: `src/lib/stores/motion.js`
- Creates: `src/lib/stores/webgl.js`
- Creates: `src/lib/stores/constellation.js`
- Creates: `src/lib/data/constellation.js`
- Modifies: `src/app.css`

#### Constitution References
- Section 3 (Architecture): State via Svelte stores, data as modules
- Section 4 (Code Standards): CSS custom properties with semantic prefixes, camelCase modules
- Section 7 (Motion): `prefers-reduced-motion` support

#### Commit Message
`feat(constellation): add stores, data module, and design tokens`

---

## Group 2: Core 3D Components

### T-003: Build ConstellationFallback component

**Status:** Pending
**Complexity:** Small
**Dependencies:** T-002
**Parallel:** [P] — can run in parallel with T-004

#### Objective
Create the 2D CSS fallback background for when WebGL is unavailable. Uses layered radial gradients, static dots, and brand color glow to approximate the star field aesthetic.

#### Acceptance Criteria
- [ ] `ConstellationFallback.svelte` renders a full-viewport dark background with layered CSS gradients
- [ ] Brand-colored glow (`#ed0049`) is visible at the bottom
- [ ] Static dot elements (CSS-only, no canvas) approximate star positions
- [ ] Component uses design tokens from `app.css` (no hardcoded colors)
- [ ] Component has `aria-hidden="true"`
- [ ] Looks premium — not a broken placeholder

#### File Paths
- Creates: `src/lib/components/ConstellationFallback.svelte`

#### Constitution References
- Section 3 (Architecture): Graceful degradation, progressive enhancement
- Section 4 (Code Standards): PascalCase component, colocated styles

#### Commit Message
`feat(constellation): add 2D CSS fallback background`

---

### T-004: Build StarField component

**Status:** Pending
**Complexity:** Large → split into implementation phases within one task
**Dependencies:** T-002
**Parallel:** [P] — can run in parallel with T-003

#### Objective
Create the core star rendering component using Three.js InstancedMesh within Threlte. Implements tiered star count (500/750/1000 by viewport), depth distribution across a 3D volume, twinkle effect via shader uniforms, depth fog, and logo-shaped hexagonal density bias.

#### Implementation Phases
1. Basic InstancedMesh with random star positions and varied sizes — get points on screen
2. Depth distribution (z-axis) with size/brightness scaling by distance
3. Twinkle effect via animated shader uniform (randomized per-star phase)
4. Viewport tier logic (500/750/1000) with smooth add/remove on resize
5. Logo-shaped hexagonal density bias (subtle clustering along 6 axes)

#### Acceptance Criteria
- [ ] StarField renders inside a Threlte `<Canvas>` with InstancedMesh (single draw call)
- [ ] Star count follows viewport tiers: ~500 (<640px), ~750 (640–1279px), ~1000 (1280px+)
- [ ] Stars have at least 3 visible size/brightness tiers from depth distribution
- [ ] Stars twinkle — periodic brightness variation driven by shader, not JS per-frame
- [ ] Star density subtly clusters along 6 hexagonal axes (visible when looking for it, not overt)
- [ ] Viewport resize across tier boundaries adds/removes stars without visual jarring
- [ ] `reducedMotion` store disables twinkle animation (stars render static)
- [ ] Component respects `aria-hidden="true"` on parent canvas
- [ ] Performance: renders at 60fps on mid-range desktop GPU

#### File Paths
- Creates: `src/lib/components/three/StarField.svelte`

#### Constitution References
- Section 2 (Technology Stack): Threlte + Three.js, managed through Threlte
- Section 3 (Architecture): Layered rendering (Layer 1)
- Section 8 (Performance): 60fps, InstancedMesh for efficiency

#### Commit Message
`feat(constellation): add StarField with instanced rendering and twinkle shader`

---

### T-005: Build CameraController component

**Status:** Pending
**Complexity:** Small
**Dependencies:** T-004
**Parallel:** —

#### Objective
Create the camera controller that produces slow orbital drift, creating gentle parallax across the star field. Pauses when tab is hidden. Disabled in reduced motion mode.

#### Acceptance Criteria
- [ ] Camera drifts slowly in a continuous orbital pattern (subconscious, not obvious)
- [ ] `reducedMotion` store gates the drift — camera is static when reduced motion is active
- [ ] Camera pauses rendering when `document.visibilityState` is `hidden`
- [ ] Camera resumes smoothly (no jump) when tab regains visibility
- [ ] Drift speed is subtle enough to be perceived subconsciously over 10+ seconds

#### File Paths
- Creates: `src/lib/components/three/CameraController.svelte`

#### Constitution References
- Section 3 (Architecture): Motion with purpose
- Section 8 (Performance): Pause when tab hidden (zero CPU/GPU when inactive)

#### Commit Message
`feat(constellation): add orbital camera drift controller`

---

### T-006: Build SixCorners component

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-002
**Parallel:** [P] — can run in parallel with T-007

#### Objective
Create the six hexagonal anchor points representing Natoken's leadership seats. Two filled corners (CEO at top, CTO at top-right) glow with brand color. Four unfilled corners are dimmer with a subtle hover pulse.

#### Acceptance Criteria
- [ ] Six anchor points are positioned in a hexagonal arrangement in 3D space
- [ ] CEO corner (top) and CTO corner (top-right) glow with `#ed0049` at higher intensity
- [ ] Four unfilled corners are visually distinct — fainter, hollow appearance
- [ ] Unfilled corners show a subtle brightening/pulse on hover (raycasting)
- [ ] No text labels are displayed (hover just pulses, no content)
- [ ] Positions are read from `constellation.js` data module
- [ ] `reducedMotion` disables the hover pulse animation (corners still highlight on hover, just instantly)

#### File Paths
- Creates: `src/lib/components/three/SixCorners.svelte`

#### Constitution References
- Section 2 (Brand): `#ed0049` for filled corners
- Section 3 (Architecture): Data as modules

#### Commit Message
`feat(constellation): add 6 Corners hexagonal anchor points`

---

### T-007: Build ProductBranches component

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-002
**Parallel:** [P] — can run in parallel with T-006

#### Objective
Create the two product branch cluster markers. RuneForge is positioned near the CTO corner (top-right), Taledom near the CEO corner (top). Rendered as small bright particle clusters, non-interactive.

#### Acceptance Criteria
- [ ] Two product clusters are visible as distinct bright regions in the star field
- [ ] RuneForge cluster is positioned near the CTO corner (top-right)
- [ ] Taledom cluster is positioned near the CEO corner (top)
- [ ] Clusters are visually distinguishable from regular stars (brighter, denser grouping)
- [ ] Clusters are not interactive (no hover, no click, no labels)
- [ ] Positions are read from `constellation.js` data module
- [ ] Visual layout leaves room for future sub-product nodes and edge connections

#### File Paths
- Creates: `src/lib/components/three/ProductBranches.svelte`

#### Constitution References
- Section 3 (Architecture): Data as modules, future extensibility (FR-029)

#### Commit Message
`feat(constellation): add product branch cluster markers`

---

## Group 3: Integration

### T-008: Build ConstellationScene orchestrator

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-003, T-004, T-005, T-006, T-007
**Parallel:** —

#### Objective
Create the root scene wrapper that orchestrates everything: detects WebGL availability, dynamically imports Threlte, mounts the scene or fallback, adds fog and lighting, and triggers the entrance cascade animation (stars radiating from center along 6 axes in ~2 seconds).

#### Acceptance Criteria
- [ ] Component dynamically imports Threlte `<Canvas>` (not in initial bundle)
- [ ] If WebGL unavailable, renders `ConstellationFallback` instead
- [ ] Scene includes: StarField, SixCorners, ProductBranches, CameraController, ambient light, fog
- [ ] Three.js Fog is configured with void color (`#0d1117`) for depth fade effect
- [ ] Entrance animation: stars cascade in from center outward along 6 axes, completing in ~2 seconds
- [ ] Sets `constellationReady` store to `true` after scene initializes
- [ ] While loading, background is plain void color (no flash, no jarring)
- [ ] `aria-hidden="true"` is set on the scene container
- [ ] Scene is `position: fixed`, full viewport, behind all content (`z-index: 0`)

#### File Paths
- Creates: `src/lib/components/three/ConstellationScene.svelte`

#### Constitution References
- Section 3 (Architecture): Layered rendering, progressive enhancement, graceful degradation
- Section 8 (Performance): Dynamic import, lazy initialization after FCP

#### Commit Message
`feat(constellation): add scene orchestrator with entrance animation`

---

### T-009: Integrate constellation into layout and update panel styles

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-008
**Parallel:** —

#### Objective
Replace the old ParticleRenderer with ConstellationScene in the root layout. Update panel CSS to use semi-transparent glass backgrounds so the star field is visible through them. Remove the `.particles-desktop` and `.particles-mobile` wrappers.

#### Acceptance Criteria
- [ ] `ConstellationScene` is mounted in `+layout.svelte` at full-viewport fixed position
- [ ] `ParticleRenderer` import and usage are removed from `+layout.svelte`
- [ ] `.particles-desktop` and `.particles-mobile` wrapper divs and their CSS are removed
- [ ] Panel `.panel` CSS uses `--glass-bg` (semi-transparent) instead of opaque `var(--color-bg)`
- [ ] Panel `background-image` gradient uses lower-opacity values so stars show through
- [ ] `backdrop-filter: blur(var(--glass-blur))` is applied to panels
- [ ] Star field is visible through panels on both desktop and mobile
- [ ] Mobile panel switching still works correctly
- [ ] Product drawer still renders above the constellation
- [ ] All content in panels remains readable against the glass + star field background

#### File Paths
- Modifies: `src/routes/+layout.svelte`

#### Constitution References
- Section 3 (Architecture): Layered rendering — UI layer floats above atmosphere layer
- Section 4 (Code Standards): Design tokens for all style values

#### Commit Message
`feat(layout): replace particle renderer with constellation scene`

---

## Group 4: Cleanup & Verification

### T-010: Delete ParticleRenderer and full verification

**Status:** Pending
**Complexity:** Small
**Dependencies:** T-009
**Parallel:** —

#### Objective
Delete the old ParticleRenderer component. Run full verification: build passes, grep confirms no remnants, visual check across browsers, mobile test, reduced motion test, Lighthouse audit.

#### Acceptance Criteria
- [ ] `src/lib/components/ParticleRenderer.svelte` is deleted
- [ ] `grep -r "ParticleRenderer" src/` returns zero results
- [ ] `npm run build` succeeds with zero errors and zero warnings
- [ ] Star field visible behind all panels on desktop (Chrome, Firefox, Safari)
- [ ] Star field visible on mobile (375px viewport), smooth scrolling, no dropped frames
- [ ] Camera drift visible on desktop idle
- [ ] Stars twinkle visibly
- [ ] 6 Corners visible: 2 brand-glowing, 4 dimmer with hover pulse
- [ ] Product clusters visible near respective corners
- [ ] Entrance cascade works on hard refresh (~2s star cascade)
- [ ] `prefers-reduced-motion: reduce` produces fully static scene
- [ ] WebGL fallback works when 3D context is blocked
- [ ] Lighthouse Performance score >= 90
- [ ] Scene persists across route navigations (if multiple routes exist)
- [ ] Tab switch: scene pauses and resumes cleanly

#### File Paths
- Deletes: `src/lib/components/ParticleRenderer.svelte`

#### Constitution References
- Section 5 (Testing): Build verification
- Section 6 (Quality Gates): Build success, cross-browser, mobile, reduced motion
- Section 8 (Performance): Lighthouse 90+
- Section 12 (Legacy): ParticleRenderer replacement complete

#### Commit Message
`chore(constellation): remove legacy ParticleRenderer`

---

## Convergence Milestone

**After Task:** T-010
**Description:** The site's rendering pipeline now has Layer 1 (Atmosphere) operational. The 3D constellation star field replaces the flat 2D particle renderer, establishing the visual foundation for all future features (Team Constellation, Product Regions, GSAP scroll-linked camera). The Constellation Terminal design language is now visually real.

**Criteria:**
- [ ] 3D star field is the site's global background
- [ ] 6 Corners structural anchors are in place
- [ ] Product branches are positioned
- [ ] Glass panel aesthetic is active
- [ ] WebGL fallback works
- [ ] Reduced motion is fully supported
- [ ] Legacy ParticleRenderer is gone
- [ ] Build passes, Lighthouse 90+

---

## Coverage Verification

### Functional Requirements → Tasks

| Requirement | Covered By |
|-------------|-----------|
| FR-001 (tiered star count) | T-004 |
| FR-002 (depth parallax) | T-004 |
| FR-003 (brand glow) | T-004, T-008 |
| FR-004 (full viewport) | T-008, T-009 |
| FR-005 (camera drift) | T-005 |
| FR-006 (twinkle) | T-004 |
| FR-007 (pause on tab hidden) | T-005 |
| FR-008 (reduced motion static) | T-002, T-004, T-005 |
| FR-009 (runtime motion detection) | T-002 |
| FR-010 (static composition preserved) | T-004 |
| FR-011 (2D fallback) | T-003 |
| FR-012 (WebGL check once) | T-002 |
| FR-013 (fallback brand consistency) | T-003 |
| FR-014 (async init, no FCP block) | T-008 |
| FR-015 (void bg while loading) | T-008 |
| FR-016 (entrance cascade) | T-008 |
| FR-017 (decorative, aria-hidden) | T-008, T-003 |
| FR-018 (mobile reduced count/drift) | T-004, T-005 |
| FR-019 (delete old renderer) | T-009, T-010 |
| FR-020 (depth fog) | T-008 |
| FR-021 (glass panels) | T-009 |
| FR-022 (persist across routes) | T-008, T-009 |
| FR-023 (6 anchor points hexagonal) | T-006 |
| FR-024 (2 filled corners) | T-006 |
| FR-025 (4 unfilled with hover) | T-006 |
| FR-026 (logo-shaped density) | T-004 |
| FR-027 (product branch positions) | T-007 |
| FR-028 (non-interactive clusters) | T-007 |
| FR-029 (future extensibility) | T-007 |

### Acceptance Criteria → Task Criteria

| Spec AC | Task AC |
|---------|---------|
| AC-001 (full viewport star field) | T-009 criterion 1, T-010 criterion 4 |
| AC-002 (tiered star count) | T-004 criterion 2 |
| AC-003 (depth + fog) | T-004 criterion 3, T-008 criterion 4 |
| AC-004 (brand glow) | T-004 (via fog/ambient), T-003 criterion 2 |
| AC-005 (camera drift) | T-005 criterion 1, T-010 criterion 6 |
| AC-006 (twinkle) | T-004 criterion 4, T-010 criterion 7 |
| AC-007 (reduced motion) | T-004 criterion 7, T-005 criterion 2, T-010 criterion 11 |
| AC-008 (WebGL fallback) | T-003, T-008 criterion 2, T-010 criterion 12 |
| AC-009 (async + cascade) | T-008 criteria 5-7, T-010 criterion 10 |
| AC-010 (tab switch) | T-005 criteria 3-4, T-010 criterion 15 |
| AC-011 (ParticleRenderer removed) | T-010 criteria 1-2 |
| AC-012 (build success) | T-010 criterion 3 |
| AC-013 (decorative a11y) | T-008 criterion 8, T-003 criterion 5 |
| AC-014 (mobile smooth) | T-010 criterion 5 |
| AC-015 (Lighthouse 90+) | T-010 criterion 13 |
| AC-016 (6 Corners) | T-006 criteria 1-5, T-010 criterion 8 |
| AC-017 (logo density) | T-004 criterion 5 |
| AC-018 (product branches) | T-007 criteria 1-4, T-010 criterion 9 |
| AC-019 (glass panels) | T-009 criteria 4-6 |

### Testing Strategy → Test Tasks

| Plan Test | Task |
|-----------|------|
| Visual: full viewport star field | T-010 criterion 4 |
| Visual: tiered star count resize | T-004 criterion 6 |
| Visual: depth + fog | T-010 (visual check) |
| Visual: brand glow | T-010 (visual check) |
| Visual: camera drift | T-010 criterion 6 |
| Visual: twinkle | T-010 criterion 7 |
| OS setting: reduced motion | T-010 criterion 11 |
| DevTools: block WebGL | T-010 criterion 12 |
| Visual: entrance cascade | T-010 criterion 10 |
| Manual: tab switch | T-010 criterion 15 |
| Automated: grep ParticleRenderer | T-010 criterion 2 |
| Automated: npm run build | T-010 criterion 3 |
| Automated: Lighthouse | T-010 criterion 13 |
| Visual: 6 Corners | T-010 criterion 8 |
| Visual: product branches | T-010 criterion 9 |
| Visual: glass panels | T-009 criterion 7 |
