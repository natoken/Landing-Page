# Implementation Plan: Constellation

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Version:** 1.0
**Status:** Approved
**Spec:** `.genesis/specs/constellation/spec.md`
**Branch:** genesis/002-constellation

---

## 1. Input References

- **Specification:** `.genesis/specs/constellation/spec.md`
- **Constitution:** `.genesis/constitution.md`
- **Design Docs:**
  - `.genesis/design/overview.md` — Convergence path, rendering layers
  - `.genesis/design/system.md` — Color palette, glass properties, motion patterns
  - `.genesis/design/technical/architecture.md` — Threlte scene graph, performance strategy, layer communication

## 2. Technical Context

- **Language:** JavaScript (ES Modules, JSDoc annotations)
- **Framework:** Svelte 5 (Runes) + SvelteKit 2
- **3D Engine:** Threlte 8 (`@threlte/core` + `@threlte/extras`) wrapping Three.js ~0.170
- **Styling:** Vanilla CSS with design tokens from `app.css`
- **Build:** Vite 6, `@sveltejs/adapter-static`

### New Dependencies Required

| Package | Version | Purpose | Constitutional? |
|---------|---------|---------|----------------|
| `@threlte/core` | ^8.x | Svelte-native Three.js canvas, scene management | Yes (Section 2) |
| `@threlte/extras` | ^8.x | Utility components (HTML overlays, instanced mesh helpers) | Yes (Section 2) |
| `three` | ^0.170.x | 3D rendering engine (peer dep of Threlte) | Yes (Section 2) |

All three are explicitly pre-approved in the constitution.

## 3. Constitution Compliance

| Constitutional Section | How This Plan Complies | Tensions/Justifications |
|-----------------------|----------------------|------------------------|
| 2 - Technology Stack | Threlte + Three.js are pre-approved. No unconstitutional deps. | None |
| 3 - Architecture: Layered rendering | Constellation is Layer 1 (atmosphere). Does not touch Layers 2-4. | None |
| 3 - Architecture: Progressive enhancement | Core content accessible without 3D. Scene is decorative. | None |
| 3 - Architecture: Graceful degradation | WebGL fallback to 2D CSS gradient + dots. | None |
| 3 - Architecture: Motion with purpose | Camera drift and twinkle serve immersion. `prefers-reduced-motion` fully respected. | None |
| 4 - Code Standards: File structure | 3D components go in `src/lib/components/three/` per constitution. | None |
| 4 - Code Standards: Naming | PascalCase components, camelCase modules, `--kebab-case` tokens. | None |
| 6 - Quality Gates: Reduced motion | All animation gated by `reducedMotion` store. | None |
| 6 - Quality Gates: Design tokens | New tokens added to `app.css`, no hardcoded values in components. | None |
| 8 - Performance: Bundle size | Threlte + Three.js dynamically imported. Initial bundle impact < 5KB. | Three.js is ~150KB gzipped but lazy-loaded per constitution Section 8. |
| 8 - Performance: 60fps | InstancedMesh for stars (single draw call). Shader-based twinkle. | None |
| 12 - Legacy: ParticleRenderer | Constitution explicitly marks this as "Progressive — during constellation feature". | Full replacement. |

## 4. Component Architecture

### New Components

| Component | Responsibility | Location |
|-----------|---------------|----------|
| `ConstellationScene.svelte` | Root 3D scene wrapper. Dynamically imports Threlte `<Canvas>`, detects WebGL, mounts scene or fallback. Handles async loading + entrance animation trigger. | `src/lib/components/three/ConstellationScene.svelte` |
| `StarField.svelte` | Procedural star particles using `InstancedMesh`. Manages tiered star count (500/750/1000), depth distribution, twinkle shader, logo-shaped density bias. | `src/lib/components/three/StarField.svelte` |
| `SixCorners.svelte` | Six hexagonal anchor points. Two filled (CEO/CTO) with brand glow, four unfilled with hover pulse. Positioned in hexagonal arrangement. | `src/lib/components/three/SixCorners.svelte` |
| `ProductBranches.svelte` | Two product cluster markers (RuneForge near CTO, Taledom near CEO). Small bright regions, non-interactive. | `src/lib/components/three/ProductBranches.svelte` |
| `CameraController.svelte` | Slow orbital drift. Pauses on tab hidden. Disabled in reduced motion. | `src/lib/components/three/CameraController.svelte` |
| `ConstellationFallback.svelte` | 2D CSS fallback when WebGL unavailable. Layered radial gradients + static dots + brand glow. | `src/lib/components/ConstellationFallback.svelte` |

### New Stores

| Store | Purpose | Location |
|-------|---------|----------|
| `reducedMotion` | Reactive boolean from `prefers-reduced-motion` media query. Responds to runtime changes. | `src/lib/stores/motion.js` |
| `webglAvailable` | Boolean, checked once at startup. Gates 3D vs fallback. | `src/lib/stores/webgl.js` |
| `constellationReady` | Boolean, set to `true` when scene is initialized. Triggers entrance animation. | `src/lib/stores/constellation.js` |

### Modified Components

| Component | Modification | Reason |
|-----------|-------------|--------|
| `+layout.svelte` | Replace `<ParticleRenderer />` with `<ConstellationScene />`. Move scene to full-viewport fixed position behind all content. Remove `.particles-desktop` and `.particles-mobile` wrappers. | Star field becomes the global background layer. |
| `+layout.svelte` | Update panel CSS: replace opaque `background` and `background-image` with glass-based semi-transparent values using `--glass-bg` and `backdrop-filter`. | Panels must be see-through to the constellation. |
| `app.css` | Add new design tokens: `--color-accent-glow`, `--color-accent-subtle`, `--color-star`, `--color-star-dim`, `--glass-bg-hover`, `--glass-border-hover`, `--glass-blur-heavy`. | Design system tokens from system.md not yet in CSS. |

### Deleted Components

| Component | Reason |
|-----------|--------|
| `ParticleRenderer.svelte` | Fully replaced by `ConstellationScene`. FR-019 requires complete removal. |

### Component Interaction Diagram

```
+layout.svelte
|
+-- ConstellationScene.svelte (fixed, full viewport, z-index: 0)
|   |
|   +-- [if webglAvailable]
|   |   +-- <Canvas> (Threlte)
|   |   |   +-- StarField.svelte (InstancedMesh, tiered count)
|   |   |   +-- SixCorners.svelte (6 anchor points)
|   |   |   +-- ProductBranches.svelte (2 product clusters)
|   |   |   +-- CameraController.svelte (orbital drift)
|   |   |   +-- <T.AmbientLight> (minimal)
|   |   |   +-- <T.Fog> (depth fog, near/far → void color)
|   |   |
|   +-- [if !webglAvailable]
|       +-- ConstellationFallback.svelte (CSS gradients + dots)
|
+-- .layout (z-index: 1, panels with glass bg)
    +-- header, panels, content (all semi-transparent)
```

## 5. Data Model Changes

### New Data

| File | Contents | Purpose |
|------|----------|---------|
| `src/lib/data/constellation.js` | Corner positions (6 hexagonal coords), filled status, product branch positions, star density bias map | Static configuration for the 6 Corners and product branch layout |

No database changes. No migrations. All data is static JS exports.

## 6. API/Interface Design

None. This is a purely visual feature with no endpoints.

## 7. Implementation Strategy

### Build Order

1. **Install dependencies** — Add `@threlte/core`, `@threlte/extras`, `three` to devDependencies. Verify build still passes.

2. **Create stores** — `motion.js` (reducedMotion), `webgl.js` (webglAvailable), `constellation.js` (constellationReady). These are standalone and testable immediately.

3. **Add design tokens** — Extend `app.css` with missing tokens from the design system (glass hover, star colors, accent glow, etc.).

4. **Build ConstellationFallback** — The 2D CSS fallback. Build this first so we have a working background before Threlte is wired up. Brand glow gradient + static dot field.

5. **Build StarField** — Core star rendering with InstancedMesh. Tiered count logic. Depth distribution. Twinkle shader. Logo-shaped density bias. This is the most complex component.

6. **Build CameraController** — Orbital drift, tab visibility pause, reduced motion gate. Relatively simple — uses Threlte's `useFrame` and `useThrelte`.

7. **Build SixCorners** — Six anchor meshes in hexagonal arrangement. Brand glow on filled corners (CEO/CTO). Hover pulse on unfilled. Raycasting for hover detection.

8. **Build ProductBranches** — Small particle clusters near CEO and CTO corners. Non-interactive bright regions.

9. **Build ConstellationScene** — The orchestrator. WebGL detection, dynamic Threlte import, async mounting, entrance cascade animation (stars radiating from center along 6 axes over ~2s).

10. **Integrate into layout** — Replace ParticleRenderer with ConstellationScene. Update panel CSS to glass transparency. Remove particle wrappers.

11. **Delete ParticleRenderer** — Remove the old component file. Grep to confirm zero references remain.

12. **Build verification** — `npm run build`, cross-browser check, mobile check, reduced motion check, Lighthouse.

### Risk Areas

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Three.js bundle too large, FCP regression | Medium | High | Dynamic import via `import()`. Threlte canvas mounts after FCP. Verify with Lighthouse. |
| InstancedMesh shader complexity — twinkle + depth fog combined | Low | Medium | Start with simple point-based stars, add shader effects incrementally. Test on integrated GPU. |
| Threlte 8 + Svelte 5 Runes compatibility | Low | High | Threlte 8 officially supports Svelte 5. If issues arise, check Threlte GitHub issues/discussions. |
| Glass panel backdrop-filter performance on mobile | Medium | Medium | Test on real devices. Fall back to solid semi-transparent bg if blur causes jank. |
| Star entrance cascade (FR-016) timing/choreography | Low | Low | Prototype with simple opacity stagger first, refine timing. |
| Hexagonal density bias makes star field look unnatural | Low | Medium | Subtle bias only — majority of stars remain random. Iterate visually. |

### Fallback Plans

- **If Threlte has Svelte 5 issues:** Fall back to raw Three.js with a manual canvas mount (less ergonomic but functional). Would require amendment discussion since constitution says "managed through Threlte."
- **If InstancedMesh performance is insufficient:** Reduce to `Points` geometry (simpler, faster, less visual fidelity). Stars become flat dots without individual size variation.
- **If backdrop-filter causes mobile jank:** Remove `backdrop-filter: blur()` on mobile breakpoints. Use higher-opacity `--glass-bg` instead for a solid-glass look.

## 8. Research Items

No research items. Threlte 8's Svelte 5 support is documented and stable. InstancedMesh is a well-known Three.js pattern. All technical approaches are proven.

## 9. Testing Strategy

| Acceptance Criterion | Test Type | Approach |
|---------------------|-----------|----------|
| AC-001 (full viewport star field) | Visual | Manual: verify star field visible behind all UI elements on homepage |
| AC-002 (tiered star count) | Visual + DevTools | Resize viewport across tier boundaries, verify star count changes smoothly |
| AC-003 (depth variation + fog) | Visual | Verify at least 3 size/brightness tiers visible; distant stars fade |
| AC-004 (brand glow) | Visual | Verify `#ed0049` gradient glow at viewport bottom |
| AC-005 (camera drift) | Visual | Observe desktop idle — stars should shift subtly over 10+ seconds |
| AC-006 (twinkle) | Visual | Observe star field for 5+ seconds — brightness variations visible |
| AC-007 (reduced motion) | Visual + OS | Enable reduced motion in OS settings; verify static scene, no drift/twinkle |
| AC-008 (WebGL fallback) | Manual | Block WebGL context in DevTools; verify 2D fallback renders |
| AC-009 (async load + cascade) | Visual | Hard refresh; verify content appears before stars; stars cascade in ~2s |
| AC-010 (tab switch) | Manual | Switch tabs and return; verify no glitches, smooth resume |
| AC-011 (ParticleRenderer removed) | Automated | `grep -r "ParticleRenderer" src/` returns zero results |
| AC-012 (build success) | Automated | `npm run build` exits 0, zero errors/warnings |
| AC-013 (decorative/a11y) | Automated + Manual | Verify `aria-hidden="true"` on scene container; screen reader test |
| AC-014 (mobile performance) | Manual | Test on 375px viewport; no dropped frames during scroll |
| AC-015 (Lighthouse 90+) | Automated | Run Lighthouse on built preview; Performance >= 90 |
| AC-016 (6 Corners) | Visual | Verify 6 hexagonal points; 2 glow brand color; 4 dimmer; hover pulse on empty |
| AC-017 (logo-shaped density) | Visual | Subtle hexagonal radiating pattern visible in star distribution |
| AC-018 (product branches) | Visual | Bright regions near CEO (Taledom) and CTO (RuneForge) corners |
| AC-019 (glass panels) | Visual | Stars faintly visible through panel backgrounds |

## 10. Deployment Considerations

- **Migrations:** None — no data persistence.
- **Feature Flags:** None needed. The old ParticleRenderer is fully replaced; no gradual rollout required for a static site.
- **Backward Compatibility:** The ParticleRenderer is deleted. If rollback is needed, the previous commit on `main` restores it.
- **Rollback Plan:** Revert the squash merge commit on `main`. Cloudflare Pages auto-deploys the reverted state. Total rollback time: < 5 minutes.
- **Bundle Size Impact:** Three.js adds ~150KB gzipped but is lazy-loaded (dynamic import). Initial bundle increase < 5KB (just the import statement and WebGL detection). The Threlte wrapper adds ~15KB gzipped on top of Three.js. Total lazy-loaded increase: ~165KB. This is within the constitutional 350KB total budget since the current bundle is well under 200KB.

## 11. Integration with Existing Code

### Existing Modules Touched

| File | Change | Impact |
|------|--------|--------|
| `src/routes/+layout.svelte` | Replace ParticleRenderer import/usage with ConstellationScene. Update panel CSS to glass. Remove `.particles-desktop` and `.particles-mobile` wrappers. | High — layout restructure |
| `src/app.css` | Add new design tokens (glass hover, star colors, glow). No existing tokens changed. | Low — additive only |
| `package.json` | Add 3 devDependencies (threlte/core, threlte/extras, three). | Low |
| `svelte.config.js` | No changes needed. | None |
| `static/_headers` | No changes needed. | None |

### Interfaces to Preserve

- Mobile panel switching (`activeMobilePanel` store) — must continue working
- Product drawer overlay (`ProductDrawer`) — must render above constellation
- All content in panels (`LeftPanelContent`, `CenterPanelContent`, `RightPanelContent`) — unchanged
- Scroll behavior within panels — unchanged

### Deprecation

| Old Code | Replacement | Timeline |
|----------|-------------|----------|
| `src/lib/components/ParticleRenderer.svelte` | `src/lib/components/three/ConstellationScene.svelte` | Deleted in this feature |
| `.particles-desktop` / `.particles-mobile` wrappers in layout | Single full-viewport `ConstellationScene` | Deleted in this feature |

The ParticleRenderer is not used anywhere else. Its removal is clean with no downstream dependencies.

## Changelog

| Version | Date | Change | Reason |
|---------|------|--------|--------|
| 1.0 | 2026-03-07 | Initial plan | — |
