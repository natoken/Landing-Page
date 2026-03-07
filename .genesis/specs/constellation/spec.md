# Specification: Constellation

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Version:** 1.0
**Status:** Approved
**Branch:** genesis/002-constellation

---

## 1. Overview

The site's current background is a flat 2D canvas particle renderer — 48 dots drifting upward in a single color. It's functional but forgettable. The Constellation feature replaces it with an immersive 3D star field that becomes the visual foundation of the entire Natoken experience.

The new background renders a procedural star field with hundreds of points at varying depths, sizes, and brightness levels. Stars twinkle subtly. The camera drifts slowly, creating a sense of living depth. A faint ambient glow in the brand color rises from the bottom edge, grounding the UI panels in the void. The effect should feel like looking out from a command deck into deep space — vast, quiet, alive.

This is the "atmosphere layer" of the Constellation Terminal design language. It replaces a single component but transforms the entire site's feel. The 3D scene must load without blocking content, degrade gracefully when 3D rendering is unavailable, and respect the user's motion preferences.

## 2. Design Document References

- [Design Overview](.genesis/design/overview.md) — Section 4c (Convergence Path, step 2: Atmosphere)
- [Design System](.genesis/design/system.md) — Section 2 (Color Palette: star colors, accent glow), Section 7 (Motion: reduced motion rules)
- [Architecture](.genesis/design/technical/architecture.md) — Section 1 (Rendering Pipeline, Layer 1), Section 3 (Threlte Scene Architecture), Section 7 (Performance: lazy init, instanced rendering)

## 3. User Stories

### US-001: Immersive First Impression
**As a** first-time visitor, **I want to** see a deep, atmospheric star field behind the UI panels **so that** I immediately feel the site is premium and unlike typical company pages.

### US-002: Living Background
**As a** returning visitor, **I want to** notice subtle movement in the background (twinkling stars, gentle camera drift) **so that** the site feels alive rather than static, even on repeat visits.

### US-003: Accessible Experience
**As a** visitor with motion sensitivity, **I want to** see the star field in a static state with no animation **so that** I can browse the site comfortably without triggering discomfort.

### US-004: Low-End Device Experience
**As a** visitor on a device without 3D rendering support, **I want to** see a visually appealing 2D fallback background **so that** the site still feels polished even without the full 3D effect.

### US-005: Uninterrupted Content Access
**As a** visitor on any connection speed, **I want to** see the site's content immediately while the 3D background loads in the background **so that** I'm never staring at a blank screen waiting for the star field.

## 4. Functional Requirements

### From US-001: Immersive First Impression

- **FR-001:** The background displays a procedural star field with a tiered star count based on viewport size: approximately 500 stars on mobile (below 640px), 750 on laptop-sized viewports (640px–1279px), and 1000 on full desktop viewports (1280px+). When the viewport resizes across a tier boundary, stars are added or removed smoothly without visual jarring or performance spikes.
- **FR-002:** Stars are distributed across a 3D volume so that depth parallax is visible — closer stars appear larger and brighter, distant stars appear smaller and dimmer.
- **FR-003:** A subtle ambient glow in the brand color (`#ed0049`) emanates from the lower portion of the viewport, creating a warm ground plane effect.
- **FR-004:** The star field spans the full viewport — including behind the header, navigation tabs, and all panels — and remains behind all UI content at all times. It is the foundational layer of the entire Constellation Terminal experience.

### From US-002: Living Background

- **FR-005:** The camera drifts slowly and continuously in an orbital pattern, creating a gentle parallax shift across the star field. The drift is slow enough to be perceived subconsciously rather than consciously.
- **FR-006:** Individual stars exhibit a subtle twinkle effect — periodic, slight variations in brightness at randomized intervals.
- **FR-007:** The star field animation runs continuously while the browser tab is active and pauses automatically when the tab is hidden.

### From US-003: Accessible Experience

- **FR-008:** When the user's system indicates a preference for reduced motion, the star field renders in a fully static state — no camera drift, no twinkle, no animation of any kind.
- **FR-009:** The reduced motion preference is detected once at initialization and also responds to changes during the session (e.g., user toggles the OS setting).
- **FR-010:** In reduced motion mode, the star field still displays the full visual composition (stars, depth, glow) — only movement is removed.

### From US-004: Low-End Device Experience

- **FR-011:** If 3D rendering is not available, a 2D fallback background is displayed instead. The fallback uses layered gradients and static or minimally animated dot elements to approximate the star field aesthetic.
- **FR-012:** The 3D availability check happens once at startup. The result is stored and does not re-check.
- **FR-013:** The fallback background must still use the brand color glow and dark void aesthetic, maintaining visual consistency with the full 3D version.

### From US-005: Uninterrupted Content Access

- **FR-014:** The 3D scene initializes asynchronously after the page's primary content has rendered. It must not block the first contentful paint.
- **FR-015:** While the 3D scene loads, the page background is the standard dark void color (`#0d1117`), ensuring no visual jarring or flash.
- **FR-016:** The 3D scene entrance is a rapid staggered cascade — stars appear in quick succession radiating outward from the center along the six directional axes of the logo geometry, completing within approximately 2 seconds. The effect should feel intentional and premium, not slow or gimmicky.

### Cross-Cutting

### The 6 Corners

- **FR-023:** The star field contains six anchor points positioned in a hexagonal arrangement, echoing the six-spoke geometry of the Natoken logo. These represent the "6 Corners" — Natoken's leadership seats.
- **FR-024:** Two of the six corners are visually "filled" — glowing with the brand color (`#ed0049`) at slightly higher intensity. The top corner represents the CEO position and the top-right corner represents the CTO position (the CEO's right hand).
- **FR-025:** The four unfilled corners are dimmer and visually distinct from filled ones (fainter glow, hollow or muted appearance). On hover, they give a subtle visual hint that something may come (a brief brightening or pulse) but display no text or label.
- **FR-026:** The overall star field density and distribution subtly echoes the logo's hexagonal radiating spike pattern — not a literal logo shape, but the stars cluster and align in a way that hints at the underlying geometry.

### Product Branches

- **FR-027:** Two product branches are represented near their respective leadership corners: RuneForge is positioned near the CTO corner (top-right), and Taledom is positioned near the CEO corner (top). Their placement can be within the hexagonal ring or near the outer spikes, whichever produces the best visual result.
- **FR-028:** Product branches are rendered as small clusters or subtle bright regions — distinct from regular stars but not interactive at this stage. They are visually identifiable as "something" but do not display labels or respond to clicks.
- **FR-029:** The visual structure supports future extension: sub-products (Champion Trials under RuneForge, Arisce under Taledom) and node-graph-style edge connections between parent and child products will be added in later features. The current layout should not preclude this expansion.

### Persistence & Continuity

- **FR-022:** The star field persists seamlessly across route navigations. It is mounted once at the root layout level and remains alive throughout the user's session, maintaining camera position and star state. Route changes never cause the star field to reset or re-render.

- **FR-021:** UI panels transition from their current opaque backgrounds to semi-transparent glass surfaces (`--glass-bg`) so the star field is faintly visible through them. Panels retain their subtle brand-colored gradient tint overlay, reinforcing the glass morphism aesthetic.

- **FR-017:** The star field is purely decorative. It is hidden from assistive technologies and conveys no meaningful content.
- **FR-018:** On mobile viewports (below 640px), the star count is at the lowest tier (500) and camera drift is either removed or minimized to maintain performance.
- **FR-020:** A depth fog effect fades distant stars toward the void color (`#0d1117`), creating a sense of atmospheric depth. Closer stars remain fully visible while the most distant stars dissolve into the background.
- **FR-019:** The existing 2D particle renderer is fully replaced — no remnants of the old component remain in the codebase.

## 5. Non-Functional Requirements

- **NFR-001:** The 3D scene must render at a sustained 60 frames per second on a mid-range desktop (e.g., 2020-era integrated graphics) with the full star count.
- **NFR-002:** On mobile devices, the scene must render at a sustained 30+ frames per second with the reduced star count.
- **NFR-003:** The 3D rendering library must be loaded asynchronously and must not increase the initial page bundle size by more than 5KB (the bulk loads on demand).
- **NFR-004:** First contentful paint must not regress beyond 1.5s on a 4G connection as a result of this feature.
- **NFR-005:** The 3D scene must not consume more than 100MB of GPU memory on any device.
- **NFR-006:** When the browser tab is hidden, the scene must consume zero CPU/GPU cycles for rendering.
- **NFR-007:** The star field must render correctly on the latest versions of Chrome, Firefox, and Safari on both desktop and mobile.
- **NFR-008:** The 3D scene's decorative elements must be fully hidden from screen readers — no phantom focusable elements, no aria announcements.

## 6. Acceptance Criteria

- [ ] **AC-001:** The star field is visible behind all UI panels on the homepage, spanning the full viewport.
- [ ] **AC-002:** Star count follows viewport tiers: ~500 on mobile (<640px), ~750 on laptop (640px–1279px), ~1000 on desktop (1280px+). Resizing across tiers adjusts the count without lag or visual glitches.
- [ ] **AC-003:** Stars have visible depth variation — at least 3 distinct size/brightness tiers. Distant stars fade into the void via a depth fog effect.
- [ ] **AC-004:** A brand-colored (`#ed0049`) ambient glow is visible at the bottom of the viewport.
- [ ] **AC-005:** On desktop, the camera drifts slowly and continuously when the page is idle.
- [ ] **AC-006:** Stars twinkle — visible periodic brightness variation across the field.
- [ ] **AC-007:** With `prefers-reduced-motion: reduce` enabled, the star field is fully static (no drift, no twinkle). Visual composition is preserved.
- [ ] **AC-008:** When 3D rendering is unavailable (simulated by blocking the rendering context), a 2D fallback background is displayed with brand-colored gradients.
- [ ] **AC-009:** The page content (text, panels, navigation) renders before the 3D scene appears. Stars cascade in rapidly from center outward along six axes, completing within ~2 seconds.
- [ ] **AC-010:** Switching to another browser tab and back does not cause visual glitches; the scene pauses and resumes cleanly.
- [ ] **AC-011:** The old 2D particle renderer component is fully removed from the codebase. Grep for the old component name returns zero results.
- [ ] **AC-012:** `npm run build` succeeds with zero errors and zero warnings after the change.
- [ ] **AC-013:** The 3D scene is marked as decorative — screen readers do not announce any star field elements.
- [ ] **AC-014:** On mobile (375px viewport), the site remains responsive and smooth — no dropped frames during normal scrolling.
- [ ] **AC-015:** Lighthouse Performance score remains 90+ after the change.
- [ ] **AC-016:** Six anchor points are visible in a hexagonal arrangement. Two glow with brand color (top = CEO, top-right = CTO); four are dimmer with a subtle hover response.
- [ ] **AC-017:** The overall star distribution subtly echoes the logo's hexagonal radiating pattern — visible when looking for it, not overt.
- [ ] **AC-018:** Two product branch clusters are visible near their respective corners (RuneForge near CTO/top-right, Taledom near CEO/top). They appear as distinct bright regions but are not interactive.
- [ ] **AC-019:** UI panels use semi-transparent glass backgrounds so the star field is faintly visible through them.

## 7. Out of Scope

- **Team constellation nodes** — Team members as interactive labeled 3D points are a separate feature (Team Constellation). This spec includes the 6 Corners as structural anchors but not full team member interactivity.
- **Product region clusters with labels and navigation** — Full interactive product regions with labels, click-to-navigate, and sub-product node graphs are a separate feature. This spec includes product branch positioning as visual markers only.
- **Sub-product connections** — Edge links between RuneForge→Champion Trials and Taledom→Arisce are planned for a future feature when the node graph expands.
- **Scroll-linked camera movement** — Camera responding to scroll position is part of the GSAP Integration feature. This spec covers only ambient drift.
- **Interactive star hover effects** — Stars do not respond to mouse interaction in this feature.
- **GSAP integration** — No GSAP animations are introduced in this feature. The star field uses its own animation loop.
- **Navigation changes** — The site navigation structure is unchanged.

## 8. Open Questions

- [x] **OQ-001:** ~~Should the star field extend behind the mobile header/tab bar, or only behind the panel content area?~~ **Resolved:** Full viewport. The star field is the foundation — everything (header, tabs, panels) floats on top of it. This aligns with the Constellation Terminal concept where the entire UI is a command deck overlaying the star field.
- [x] **OQ-002:** ~~Should there be a subtle depth fog effect?~~ **Resolved:** Yes. Depth fog fades distant stars into the void color, adding atmospheric realism and depth.

## 9. Constitution Compliance Check

| Constitution Section | Compliance | Notes |
|---------------------|------------|-------|
| 2 - Technology Stack | Compliant | Uses Threlte + Three.js (pre-approved in constitution) |
| 3 - Architecture Principles | Compliant | Layered rendering (Layer 1), progressive enhancement, graceful degradation, reduced motion |
| 4 - Code Standards | Compliant at plan phase | Naming, structure, imports will follow constitution |
| 5 - Testing Philosophy | Addressed in AC-012 | Build verification required |
| 6 - Quality Gates | Addressed in ACs | Build success, cross-browser, mobile, reduced motion, design tokens |
| 7 - Security & Compliance | N/A | No user data, no external requests |
| 8 - Performance | Addressed in NFRs | 60fps target, lazy load, bundle size, FCP < 1.5s, Lighthouse 90+ |
| 12 - Legacy Handling | Compliant | Constitution explicitly lists ParticleRenderer replacement as progressive migration |

## 10. Changelog

| Version | Date | Change | Reason |
|---------|------|--------|--------|
| 1.0 | 2026-03-07 | Initial specification | — |
