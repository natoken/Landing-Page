# Plan: Constellation Navigation

**Feature:** constellation-nav
**Version:** 1.0
**Status:** Approved
**Created:** 2026-03-07
**Spec:** `.genesis/specs/constellation-nav/spec.md`

---

## Input References

- **Spec:** `.genesis/specs/constellation-nav/spec.md` (Approved)
- **Constitution:** `.genesis/constitution.md`
- **Design:** `.genesis/design/overview.md`, `.genesis/design/system.md`, `.genesis/design/technical/architecture.md`, `.genesis/design/content.md`
- **Foundation:** `.genesis/specs/constellation/spec.md` (existing 3D star field, corners, camera)

## Technical Context

| Technology | Version | Role |
|-----------|---------|------|
| Svelte 5 | ^5.x | UI components, reactivity (Runes) |
| SvelteKit 2 | ^2.x | Routing, SSR/SSG |
| Threlte 8 | ^8.4.1 | 3D scene (Canvas, raycasting, scene graph) |
| Three.js | ^0.183.2 | 3D rendering (via Threlte) |
| Vanilla CSS | — | Glass panels, overlays, mobile drawer |

No new dependencies required. Everything builds on the existing stack.

## Constitution Compliance

| Architectural Choice | Constitutional Section | Compliance | Notes |
|---------------------|----------------------|------------|-------|
| Reuse existing Threlte scene | 2 (Tech Stack) | Yes | Already approved and installed |
| Data-driven node positions | 3 (Data as modules) | Yes | Extend `constellation.js` with graph model |
| Glass panels as Svelte components | 3 (Component-driven) | Yes | HTML/CSS overlays, not 3D elements |
| Content panels via HTML overlay | 3 (Progressive enhancement) | Yes | Content accessible without 3D |
| Mobile bottom nav bar | 3 (Mobile-first) | Yes | Compact, touch-friendly |
| Reduced motion gates all animations | 3 (Motion with purpose) | Yes | Ping, dim, panel transitions gated |
| No new dependencies | 6 (Quality Gates) | Yes | Uses existing stack only |
| Keyboard navigation | NFR-003 + Constitution 3 | Yes | Tab/Enter/Escape standard patterns |

## Component Architecture

### New Components

| Component | Responsibility |
|-----------|---------------|
| `NodeInfoPanel.svelte` | Floating glass panel that displays content for any clicked node (about, team member, product). Positioned near the node in viewport space. HTML overlay, not a 3D element. |
| `MobileContentDrawer.svelte` | Bottom sheet drawer for mobile. Slides up when a node is tapped. Swipe-down or tap-outside to dismiss. |
| `MobileNavBar.svelte` | Compact bottom navigation bar for mobile. Three buttons: About, Team, Products. Opens drawer with filtered content. |
| `TeamNodes.svelte` | Threlte component rendering team members as radar-blip nodes with ping animation. Positioned by data. Replaces team grid cards. |
| `ProductConstellations.svelte` | Threlte component rendering products as mini-constellations (connected star patterns). Replaces `ProductBranches.svelte` (particle clusters). |
| `CoreNode.svelte` | Threlte component for the Natoken center node. Distinct visual — anchor of the hexagon. |
| `ConstellationOverlay.svelte` | HTML overlay layer for hover labels (nicknames), interaction hint on first visit, and panel positioning. Uses CSS `position: fixed` to float over the 3D canvas. |

### Modified Components

| Component | Changes |
|-----------|---------|
| `+layout.svelte` | Remove the 3-panel grid layout, mobile header, and all panel components. Replace with the constellation as the full-viewport primary surface + overlay layer for panels. Keep brand name/slogan at top. |
| `ConstellationCanvas.svelte` | Add `CoreNode`, `TeamNodes`, `ProductConstellations`. Remove `ProductBranches`. Wire up raycasting click events to a shared store. |
| `SixCorners.svelte` | Make corners clickable (open panel for leadership info). Keep existing hover/scale. |
| `constellation.js` (data) | Restructure as a graph model: core node, team member positions derived from their domain, product tree with parent/child relationships, weight-based sizing. |
| `ConstellationScene.svelte` | Enable pointer events on the canvas (remove `pointer-events: none` when constellation is the primary surface). |

### Removed Components

| Component | Reason |
|-----------|--------|
| `LeftPanelContent.svelte` | Content moves to NodeInfoPanel (About/Contact via core node) |
| `CenterPanelContent.svelte` | Content moves to NodeInfoPanel (Team via team nodes) |
| `RightPanelContent.svelte` | Content moves to NodeInfoPanel (Products via product nodes) |
| `ProductBranches.svelte` | Replaced by `ProductConstellations.svelte` |
| `ProductDrawer.svelte` | Replaced by `NodeInfoPanel` / `MobileContentDrawer` |
| `ProductSpotlight.svelte` | No longer needed — products accessed via constellation |

### Preserved Components

| Component | Status |
|-----------|--------|
| `NatokenLogo.svelte` | Kept — used in brand overlay at top |
| `StarField.svelte` | Kept — background atmosphere |
| `CameraController.svelte` | Kept — mouse parallax + drift |
| `ConstellationLines.svelte` | Kept and extended — new lines for team→domain and product→children connections |
| `ConstellationFallback.svelte` | Kept — WebGL fallback (needs adaptation for nav-less layout) |

## Data Model Changes

### `constellation.js` — Graph Model

The flat arrays of corners and products become a rooted graph:

```
constellationGraph = {
  core: { position, label, type: 'core' },
  corners: [ { id, label, position, filled, teamMemberId? } ],
  team: [ { id, nickname, fullName, title, image, position, domain, connections[] } ],
  products: [ { id, name, description, status, url, image, position, parentCorner, children[], weight } ],
  edges: [ { from, to, type: 'hierarchy'|'team'|'bridge', opacity } ]
}
```

**Weight calculation:** A product's weight = 1 + sum of children's weights (recursive). Weight drives the star's visual size.

**Position derivation:**
- Core: `[0, 0, 0]`
- Corners: existing hexagonal positions (radius 4)
- Products: radiate outward from parent corner at 1.2-1.5x radius, angle offset from corner
- Children: orbit parent product at 0.5-0.8 radius offset
- Team at corners: slight offset from corner position (don't overlap)
- Team at products: positioned near their product node

### `team.js` — Extended

Add `domain` field mapping each member to their position anchor:

```js
{ slug: 'nagi', domain: 'ceo', ... }
{ slug: 'crauzer', domain: 'cto', ... }
{ slug: 'martynas', domain: 'cco', nearCorner: 'ceo', ... }
{ slug: 'void', domain: 'product', product: 'taledom', ... }
{ slug: 'scuttlecrab', domain: 'product', product: 'arisce', ... }
```

### `products.js` — Extended

Add parent/child relationships:

```js
{ slug: 'runeforge', parentCorner: 'cto', children: ['champion-trials'], ... }
{ slug: 'taledom', parentCorner: 'ceo', children: [], ... }
{ slug: 'arisce', parentCorner: null, bridges: ['taledom', 'runeforge'], ... }
{ slug: 'champion-trials', parent: 'runeforge', ... }
{ slug: 'genesis', parentCorner: null, type: 'tool', ... }
```

## Interaction Model

### Click Flow (Desktop)

1. User hovers a node → glow intensifies, cursor becomes pointer, nickname label appears (team only)
2. User clicks → `selectedNode` store updates with node data
3. `ConstellationOverlay` reads `selectedNode`, calculates screen-space position of the node using Three.js `.project()`, positions `NodeInfoPanel` near it
4. Constellation dims (reduce star opacity via uniform, reduce corner/line opacity)
5. Panel fades in (CSS transition, 200ms)
6. User clicks outside / presses Escape → `selectedNode` set to null → panel fades out, constellation un-dims

### Click Flow (Mobile)

1. User taps a node → same store update
2. Instead of `NodeInfoPanel`, `MobileContentDrawer` slides up from bottom
3. Drawer shows same content as the panel
4. Swipe down or tap overlay to dismiss

### Keyboard Flow

1. Tab cycles through nodes (needs tabindex on invisible hit areas or an accessible overlay)
2. Enter/Space opens the panel for the focused node
3. Escape closes the active panel
4. Focus returns to the node that was clicked

## Implementation Strategy

### Build Order

1. **Data layer** — Restructure `constellation.js`, extend `team.js` and `products.js` with graph relationships
2. **Core node** — Add the center Natoken node to the scene
3. **Team nodes** — Replace team grid with radar-blip nodes in 3D, positioned by domain
4. **Product constellations** — Replace particle clusters with connected star patterns, sized by weight
5. **Updated lines** — Extend `ConstellationLines` with team→domain, product→children, product→core edges
6. **Click/select system** — `selectedNode` store, raycasting click handlers on all interactive nodes
7. **NodeInfoPanel** — Floating glass panel with content rendering (about, team, product templates)
8. **Constellation dim** — When panel is open, dim the scene
9. **Layout overhaul** — Strip old panel layout from `+layout.svelte`, make constellation full-viewport primary
10. **Overlay layer** — Hover labels, interaction hint, panel positioning via screen projection
11. **Mobile drawer** — `MobileContentDrawer` + `MobileNavBar`
12. **Keyboard a11y** — Tab order, Enter/Escape, ARIA labels
13. **Polish & verify** — Cross-browser, mobile, reduced motion, performance

### Risk Areas

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Screen-space panel positioning jitters during camera drift | Medium | Pause camera drift while panel is open, or anchor panel to fixed viewport position with a connecting line to the node |
| Raycasting click targets too small on mobile | High | Increase node hit-area radius on mobile (invisible larger collision sphere), plus mobile nav bar as fallback |
| Removing all panels breaks content accessibility | High | Build NodeInfoPanel and mobile drawer BEFORE removing old layout. Feature-flag the switch. |
| Performance with many new 3D nodes (team + products) | Low | Total interactive nodes is ~15 (5 team + 5 products + 6 corners + 1 core). Negligible vs 1000 stars. |
| Three.js `.project()` for screen positioning may be unreliable during transitions | Medium | Calculate position once on click, don't re-project every frame |

### Fallback Plan

If the constellation-as-navigation proves unusable in testing:
- Keep the constellation as a visual backdrop
- Use the overlay layer as a lightweight navigation system (HTML buttons positioned over the canvas at node locations)
- This preserves the spatial feel without requiring 3D interaction

## Integration with Existing Code

### Existing Modules Touched

| Module | Change |
|--------|--------|
| `src/routes/+layout.svelte` | Major rewrite — remove 3-panel grid, mobile header, panel imports |
| `src/lib/data/constellation.js` | Major rewrite — flat arrays → graph model |
| `src/lib/data/team.js` | Extend with `domain`, `slug` fields |
| `src/lib/data/products.js` | Extend with `slug`, `parentCorner`, `children`, `bridges` |
| `src/lib/components/three/ConstellationCanvas.svelte` | Add new scene children, remove ProductBranches |
| `src/lib/components/three/ConstellationScene.svelte` | Remove `pointer-events: none` |
| `src/lib/components/three/ConstellationLines.svelte` | Extend with new edge types |
| `src/lib/components/three/SixCorners.svelte` | Add click handlers |
| `src/lib/stores/spotlight.js` | Replace with `selectedNode` store or repurpose |

### Interfaces Preserved

- `team.js` exports remain backward-compatible (new fields are additive)
- `products.js` exports remain backward-compatible (new fields are additive)
- `reducedMotion` store interface unchanged
- `webglAvailable` store interface unchanged
- `ConstellationFallback.svelte` kept (may need a non-3D nav fallback)

### Deprecation Timeline

| Component | Deprecated | Removed |
|-----------|-----------|---------|
| `LeftPanelContent.svelte` | During this feature | End of this feature |
| `CenterPanelContent.svelte` | During this feature | End of this feature |
| `RightPanelContent.svelte` | During this feature | End of this feature |
| `ProductBranches.svelte` | During this feature | End of this feature |
| `ProductDrawer.svelte` | During this feature | End of this feature |
| `ProductSpotlight.svelte` | During this feature | End of this feature |
| `mobilePanel.js` store | During this feature | End of this feature |
| `mobileDrawer.js` store | During this feature | End of this feature |
| `spotlight.js` store | During this feature | End of this feature |

## Testing Strategy

| Spec AC | Test Type | How |
|---------|-----------|-----|
| AC-001 (no panels on load) | Visual | Load site, verify full constellation visible |
| AC-002 (4 node types) | Visual | Inspect scene — core, corners, radar blips, constellation stars all present |
| AC-003 (click opens panel) | Manual | Click each node type, verify glass panel appears with correct content |
| AC-004 (one panel at a time) | Manual | Open panel A, click node B, verify A closes and B opens |
| AC-005 (all content accessible) | Manual | Verify About text, email+copy, address, all 5 team members, all 3 products with status/links |
| AC-006 (Escape/click-outside closes) | Manual | Open panel, press Escape → closes. Open panel, click outside → closes |
| AC-007 (mobile drawer) | Manual | Test at 375px viewport, tap node → bottom drawer slides up |
| AC-008 (mobile nav bar) | Visual | Compact bottom bar visible on mobile with About/Team/Products |
| AC-009 (hover states) | Manual | Hover each node type — glow, scale, cursor pointer |
| AC-010 (nickname labels) | Manual | Hover team node → nickname appears |
| AC-011 (keyboard nav) | Manual | Tab through nodes, Enter to open, Escape to close |
| AC-012 (dim on panel open) | Visual | Open panel → constellation dims. Close → un-dims |
| AC-013 (reduced motion) | Manual | Enable reduced motion → no transition animations, instant show/hide |
| AC-014 (60fps) | DevTools | Chrome Performance tab, verify no frame drops during interaction |
| AC-015 (build success) | Automated | `npm run build` exits 0 |
| AC-016 (product size by weight) | Visual | Products with children have visibly larger stars |
| AC-017 (constellation patterns) | Visual | Products show connected star lines, not clusters |
| AC-018 (radar ping) | Visual | Team nodes show periodic outward ring animation |

## Deployment Considerations

- **No migrations** — static site, data modules updated in-place
- **No feature flags** — this is a full layout replacement; feature branch isolates the work
- **Backward compatibility** — none needed; this replaces the current layout entirely
- **Rollback** — revert the merge to main (squash merge makes this one commit)
- **Bundle impact** — new components are lightweight HTML/CSS overlays. The 3D additions are minimal (few extra meshes). Expected delta: < 10KB gzipped.

## Research Items

None — all technical approaches use proven patterns already in the codebase (Threlte raycasting, CSS glass panels, Svelte stores, Three.js `.project()` for screen-space positioning).
