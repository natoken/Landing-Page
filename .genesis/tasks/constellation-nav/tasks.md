# Tasks: Constellation Navigation

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Plan:** `.genesis/plans/constellation-nav/plan.md`
**Spec:** `.genesis/specs/constellation-nav/spec.md`
**Branch:** genesis/003-constellation-nav

---

## Summary

- **Total Tasks:** 14
- **Complexity:** 5 Small, 7 Medium, 2 Large (split into phases)
- **Critical Path:** T-001 → T-002 → T-005 → T-006 → T-007 → T-009 → T-010 → T-011 → T-014
- **Progress:** 4 of 14 complete

## Dependency Graph

```
T-001 (Data model) ──► T-002 (Core node) ──► T-005 (Select system)
       │                                            │
       ├──► T-003 (Team nodes) [P] ────────────────►│
       │                                            │
       ├──► T-004 (Product constellations) [P] ────►│
       │                                            ▼
       └──► T-006 (Updated lines) ◄──── T-005 ──► T-007 (Info panel)
                                                    │
                                                    ▼
                                          T-008 (Constellation dim) [P]
                                                    │
                                                    ▼
                                          T-009 (Overlay layer)
                                                    │
                                                    ▼
                                          T-010 (Layout overhaul)
                                                    │
                                                    ▼
                                          T-011 (Mobile drawer + nav)
                                                    │
                                                    ▼
                                          T-012 (Keyboard a11y) [P]
                                                    │
                                                    ▼
                                          T-013 (Pointer events fix) [P]
                                                    │
                                                    ▼
                                          T-014 (Cleanup + verify)
```

T-002, T-003, T-004 can run in parallel after T-001.
T-006 and T-008 can run in parallel after T-005.
T-012 and T-013 can run in parallel after T-011.

---

## Group 1: Foundation

### T-001: Restructure data model as constellation graph

**Status:** Complete
**Complexity:** Medium
**Dependencies:** None
**Parallel:** —

#### Objective
Transform the flat data arrays in `constellation.js`, `team.js`, and `products.js` into a rooted graph model. Add `slug`, `domain`, `parentCorner`, `children`, and `bridges` fields. Implement weight calculation for product sizing. Derive node positions from graph relationships.

#### Acceptance Criteria
- [x] `constellation.js` exports a graph model with `core`, `corners`, `team`, `products`, and `edges` collections
- [x] Each product has a `weight` computed from its descendant count (1 + recursive children)
- [x] `team.js` includes `slug` and `domain` fields for all 4 members
- [x] `products.js` includes `slug`, `parentCorner`, `children`, and `bridges` fields
- [x] Products with `parentCorner` have positions derived outward from that corner
- [x] Champion Trials and Project Genesis are added to the product data
- [x] Arisce bridges both Taledom and RuneForge in the graph
- [x] `npm run build` succeeds

#### File Paths
- Modifies: `src/lib/data/constellation.js`
- Modifies: `src/lib/data/team.js`
- Modifies: `src/lib/data/products.js`

#### Constitution References
- Section 3 (Architecture): Data as modules
- Section 4 (Code Standards): JSDoc type annotations on exports

#### Commit Message
`feat(data): restructure constellation as rooted graph model`

---

## Group 2: Core 3D Components

### T-002: Add CoreNode component

**Status:** Complete
**Complexity:** Small
**Dependencies:** T-001
**Parallel:** [P] — can run in parallel with T-003, T-004

#### Objective
Create the Natoken core node at the center of the hexagon. Visually distinct — larger, brighter, with brand color glow. Acts as the About access point.

#### Acceptance Criteria
- [x] `CoreNode.svelte` renders a prominent sphere at `[0, 0, 0]` with brand color glow
- [x] Core node is visually larger and brighter than corner nodes
- [x] Core node has a subtle pulse animation (gated by `reducedMotion`)
- [x] Core node is distinguishable from all other node types

#### File Paths
- Creates: `src/lib/components/three/CoreNode.svelte`
- Modifies: `src/lib/components/three/ConstellationCanvas.svelte`

#### Constitution References
- Section 2 (Brand): `#ed0049` glow
- Section 3 (Architecture): Motion with purpose

#### Commit Message
`feat(constellation): add central core node`

---

### T-003: Add TeamNodes component with radar-blip style

**Status:** Complete
**Complexity:** Medium
**Dependencies:** T-001
**Parallel:** [P] — can run in parallel with T-002, T-004

#### Objective
Create team member nodes as radar-blip styled points: bright center, thin ring outline, periodic ping animation radiating outward. Positioned by their domain (corner or product node).

#### Acceptance Criteria
- [x] `TeamNodes.svelte` renders one node per team member from data
- [x] Each node has a bright point center + thin ring outline
- [x] A periodic ping/blip animation radiates outward from each node (ring expands and fades)
- [x] Ping animation is gated by `reducedMotion` (static ring when reduced)
- [x] CEO node is near the CEO corner, CTO near CTO corner
- [x] Void is positioned near Taledom's product node
- [x] Scuttlecrab is positioned near Arisce's product node
- [x] Martynas removed from team (per owner request)
- [x] Team nodes are visually distinct from product stars and corner nodes

#### File Paths
- Creates: `src/lib/components/three/TeamNodes.svelte`
- Modifies: `src/lib/components/three/ConstellationCanvas.svelte`

#### Constitution References
- Section 3 (Architecture): Data as modules, motion with purpose
- Section 2 (Brand): Consistent visual language

#### Commit Message
`feat(constellation): add team radar-blip nodes with ping animation`

---

### T-004: Add ProductConstellations component

**Status:** Complete
**Complexity:** Large → split into phases within one task
**Dependencies:** T-001
**Parallel:** [P] — can run in parallel with T-002, T-003

#### Objective
Replace `ProductBranches.svelte` (particle clusters) with mini-constellation patterns. Each product is a star connected by lines to its children. Star size scales with weight. Parent-child relationships create spatial proximity.

#### Implementation Phases
1. Render each product as a single star, sized by weight
2. Add children as smaller connected stars with line segments
3. Add bridge connections (Arisce → both Taledom and RuneForge)

#### Acceptance Criteria
- [x] `ProductConstellations.svelte` renders each product as a star
- [x] Product star size visually scales with weight (more children = larger star)
- [x] Child products (e.g., Champion Trials) appear as smaller connected stars near their parent
- [x] Lines connect parent to children forming a mini-constellation shape
- [x] Arisce is connected to both Taledom and RuneForge via bridge lines
- [x] Product nodes are visually distinct from team nodes and corner nodes
- [x] `ProductBranches.svelte` is no longer used (removed from canvas)

#### File Paths
- Creates: `src/lib/components/three/ProductConstellations.svelte`
- Modifies: `src/lib/components/three/ConstellationCanvas.svelte`
- Deletes: `src/lib/components/three/ProductBranches.svelte`

#### Constitution References
- Section 3 (Architecture): Data as modules, graph relationships
- Section 8 (Performance): Minimal draw calls

#### Commit Message
`feat(constellation): add product mini-constellations replacing particle clusters`

---

### T-005: Build click/select system with shared store

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-002, T-003, T-004
**Parallel:** —

#### Objective
Create the `selectedNode` store and wire up raycasting click handlers on all interactive node types (core, corners, team, products). Clicking a node sets the store. Clicking empty space or pressing Escape clears it.

#### Acceptance Criteria
- [ ] `selectedNode` store exists with node type, id, data, and screen position
- [ ] Clicking core node sets `selectedNode` with type `'core'`
- [ ] Clicking a corner sets `selectedNode` with type `'corner'` and corner data
- [ ] Clicking a team node sets `selectedNode` with type `'team'` and member data
- [ ] Clicking a product star sets `selectedNode` with type `'product'` and product data
- [ ] Clicking the same node again or empty space clears `selectedNode`
- [ ] Pressing Escape clears `selectedNode`
- [ ] Only one node can be selected at a time

#### File Paths
- Creates: `src/lib/stores/selectedNode.js`
- Modifies: `src/lib/components/three/CoreNode.svelte`
- Modifies: `src/lib/components/three/SixCorners.svelte`
- Modifies: `src/lib/components/three/TeamNodes.svelte`
- Modifies: `src/lib/components/three/ProductConstellations.svelte`

#### Constitution References
- Section 3 (Architecture): State via Svelte stores

#### Commit Message
`feat(interaction): add click/select system for constellation nodes`

---

### T-006: Extend ConstellationLines with graph edges

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-001, T-005
**Parallel:** [P] — can run in parallel with T-007, T-008

#### Objective
Extend `ConstellationLines.svelte` to render all edge types from the graph model: corner→core, product→corner, product→children, team→domain, and bridge connections. Different edge types have different opacity/color.

#### Acceptance Criteria
- [ ] Lines connect each corner to the core center
- [ ] Lines connect each product to its parent corner
- [ ] Lines connect parent products to their children
- [ ] Lines connect team members to their domain (corner or product)
- [ ] Bridge lines connect Arisce to both Taledom and RuneForge
- [ ] Hierarchy lines (corner→core) are subtle/dim
- [ ] Product lines use brand color at low opacity
- [ ] Team lines are the faintest
- [ ] All lines read from the graph model edges, not hardcoded

#### File Paths
- Modifies: `src/lib/components/three/ConstellationLines.svelte`

#### Constitution References
- Section 3 (Architecture): Data-driven rendering

#### Commit Message
`feat(constellation): extend lines with full graph edge types`

---

## Group 3: Interaction & UI

### T-007: Build NodeInfoPanel component

**Status:** Pending
**Complexity:** Large → split into content templates
**Dependencies:** T-005
**Parallel:** —

#### Objective
Create the floating glass panel that displays content for the selected node. Has three content templates: About (company info + contact), Team (member card), Product (product card). Positioned in viewport space near the selected node.

#### Implementation Phases
1. Panel shell — glass styling, close button, fade in/out
2. About template — company description, email with copy, address
3. Team template — photo, nickname, full name, title
4. Product template — name, description, status badge, image, visit link

#### Acceptance Criteria
- [ ] `NodeInfoPanel.svelte` renders when `selectedNode` is not null
- [ ] Panel has glass morphism styling (blur, translucent bg, subtle border)
- [ ] Panel has a close button/affordance
- [ ] Clicking outside the panel clears `selectedNode`
- [ ] About content includes company description, email with copy button, and address
- [ ] Team content shows photo (if available), nickname, full name, and title
- [ ] Product content shows name, description, status badge, image (if available), and visit link
- [ ] Panel appears/disappears with a smooth CSS transition (gated by `reducedMotion`)
- [ ] Panel is positioned near the center of the viewport (not at the edge)

#### File Paths
- Creates: `src/lib/components/NodeInfoPanel.svelte`

#### Constitution References
- Section 3 (Architecture): Component-driven, progressive enhancement
- Section 4 (Code Standards): Design tokens for all style values

#### Commit Message
`feat(ui): add floating glass NodeInfoPanel with content templates`

---

### T-008: Add constellation dim effect when panel is open

**Status:** Pending
**Complexity:** Small
**Dependencies:** T-005
**Parallel:** [P] — can run in parallel with T-006, T-007

#### Objective
When a node is selected and a panel is open, dim the constellation (reduce star brightness, fade lines and non-selected nodes) to focus attention. Un-dim when panel closes.

#### Acceptance Criteria
- [ ] When `selectedNode` is set, star field opacity reduces (via shader uniform)
- [ ] Non-selected corners and nodes dim
- [ ] The selected node remains at full brightness
- [ ] When `selectedNode` clears, everything returns to normal brightness
- [ ] Dim transition is smooth (gated by `reducedMotion`)

#### File Paths
- Modifies: `src/lib/components/three/StarField.svelte` (add dim uniform)
- Modifies: `src/lib/components/three/SixCorners.svelte` (dim non-selected)
- Modifies: `src/lib/components/three/TeamNodes.svelte` (dim non-selected)
- Modifies: `src/lib/components/three/ProductConstellations.svelte` (dim non-selected)

#### Constitution References
- Section 3 (Architecture): Motion with purpose

#### Commit Message
`feat(constellation): dim scene when info panel is open`

---

### T-009: Build ConstellationOverlay for hover labels and hints

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-007
**Parallel:** —

#### Objective
Create the HTML overlay layer that floats over the 3D canvas. Renders hover labels (team nicknames) and a first-visit interaction hint. Uses Three.js screen projection to position labels.

#### Acceptance Criteria
- [ ] `ConstellationOverlay.svelte` renders as a fixed HTML layer over the canvas
- [ ] When a team node is hovered, the member's nickname appears as a text label near the node
- [ ] Labels are positioned using Three.js world-to-screen projection
- [ ] On first visit, a subtle hint (e.g., "Explore the constellation") fades in and auto-dismisses after a few seconds
- [ ] Labels and hints respect `reducedMotion` (no fade, instant show/hide)

#### File Paths
- Creates: `src/lib/components/ConstellationOverlay.svelte`
- Creates: `src/lib/stores/hoveredNode.js`

#### Constitution References
- Section 3 (Architecture): Progressive enhancement
- Section 4 (Code Standards): Design tokens

#### Commit Message
`feat(ui): add constellation overlay with hover labels and interaction hint`

---

## Group 4: Layout Overhaul

### T-010: Strip old panel layout, make constellation primary

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-007, T-009
**Parallel:** —

#### Objective
Remove the 3-panel grid layout, mobile header, and all old panel components from `+layout.svelte`. The constellation becomes the full-viewport primary surface. Add NodeInfoPanel and ConstellationOverlay to the layout. Keep brand name/slogan as minimal overlay.

#### Acceptance Criteria
- [ ] `+layout.svelte` no longer imports or renders LeftPanelContent, CenterPanelContent, RightPanelContent
- [ ] The `.layout-grid`, `.panel`, `.mobile-header` CSS and HTML are removed
- [ ] Constellation is the full-viewport primary surface with no panels covering it
- [ ] Brand name and slogan remain visible as a non-obstructing overlay at the top
- [ ] `NodeInfoPanel` is rendered in the layout
- [ ] `ConstellationOverlay` is rendered in the layout
- [ ] `ConstellationScene` has pointer events enabled (not `pointer-events: none`)
- [ ] Copyright footer is visible somewhere in the interface
- [ ] `npm run build` succeeds

#### File Paths
- Modifies: `src/routes/+layout.svelte`
- Modifies: `src/lib/components/three/ConstellationScene.svelte`

#### Constitution References
- Section 3 (Architecture): Layered rendering
- Section 6 (Quality Gates): Build success

#### Commit Message
`feat(layout): replace panel grid with constellation-driven navigation`

---

### T-011: Build MobileContentDrawer and MobileNavBar

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-010
**Parallel:** —

#### Objective
Create the mobile bottom sheet drawer for node content and the compact bottom navigation bar. Drawer slides up on node tap, dismissible via swipe-down or tap-outside. Nav bar has About/Team/Products buttons.

#### Acceptance Criteria
- [ ] `MobileContentDrawer.svelte` slides up from the bottom when `selectedNode` is set on mobile
- [ ] Drawer displays the same content as `NodeInfoPanel` (About, Team, Product templates)
- [ ] Drawer can be dismissed by tapping outside or swiping down
- [ ] `MobileNavBar.svelte` is visible on mobile (< 960px) with About, Team, Products buttons
- [ ] Tapping a nav button opens the drawer with a filtered list (all team members, all products, or about info)
- [ ] Both components are hidden on desktop (>= 960px)
- [ ] On desktop, `NodeInfoPanel` is used instead

#### File Paths
- Creates: `src/lib/components/MobileContentDrawer.svelte`
- Creates: `src/lib/components/MobileNavBar.svelte`
- Modifies: `src/routes/+layout.svelte`

#### Constitution References
- Section 3 (Architecture): Mobile-first responsive

#### Commit Message
`feat(mobile): add content drawer and compact navigation bar`

---

## Group 5: Accessibility & Polish

### T-012: Add keyboard navigation and ARIA labels

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-011
**Parallel:** [P] — can run in parallel with T-013

#### Objective
Make the constellation keyboard-navigable. Tab cycles through interactive nodes, Enter/Space opens panels, Escape closes them. All nodes and panels have appropriate ARIA roles and labels.

#### Acceptance Criteria
- [ ] Tab key cycles through all interactive nodes in a logical order (core → corners → team → products)
- [ ] Enter or Space opens the info panel for the focused node
- [ ] Escape closes any open panel and returns focus to the node
- [ ] All interactive nodes have `role="button"` and `aria-label` with the node's name
- [ ] NodeInfoPanel has `role="dialog"` and `aria-label`
- [ ] MobileContentDrawer has `role="dialog"` and `aria-label`
- [ ] Screen reader can access all content that sighted users can

#### File Paths
- Modifies: `src/lib/components/ConstellationOverlay.svelte` (invisible tab targets)
- Modifies: `src/lib/components/NodeInfoPanel.svelte` (dialog role)
- Modifies: `src/lib/components/MobileContentDrawer.svelte` (dialog role)

#### Constitution References
- Section 3 (Architecture): Progressive enhancement
- NFR-003, NFR-004 from spec

#### Commit Message
`feat(a11y): add keyboard navigation and ARIA labels to constellation`

---

### T-013: Fix pointer events and camera interaction

**Status:** Pending
**Complexity:** Small
**Dependencies:** T-010
**Parallel:** [P] — can run in parallel with T-012

#### Objective
Ensure pointer events flow correctly: 3D raycasting works for node clicks, mouse parallax still works, but HTML panels receive pointer events for their buttons/links. Pause camera drift when a panel is open.

#### Acceptance Criteria
- [ ] Clicking a 3D node works (raycasting through canvas)
- [ ] Clicking buttons/links inside NodeInfoPanel works (not intercepted by canvas)
- [ ] Mouse parallax still works when no panel is open
- [ ] Camera drift pauses when a panel is open
- [ ] Camera drift resumes when the panel closes
- [ ] No pointer event conflicts between 3D canvas and HTML overlays

#### File Paths
- Modifies: `src/lib/components/three/CameraController.svelte`
- Modifies: `src/lib/components/three/ConstellationScene.svelte`
- Modifies: `src/lib/components/NodeInfoPanel.svelte`

#### Constitution References
- Section 8 (Performance): Pause when not needed

#### Commit Message
`fix(interaction): resolve pointer event layering and pause camera on panel open`

---

### T-014: Cleanup removed components and full verification

**Status:** Pending
**Complexity:** Small
**Dependencies:** T-012, T-013
**Parallel:** —

#### Objective
Delete all deprecated components and stores. Grep for remnants. Run full verification: build, visual check, mobile, reduced motion, keyboard.

#### Acceptance Criteria
- [ ] `LeftPanelContent.svelte` deleted
- [ ] `CenterPanelContent.svelte` deleted
- [ ] `RightPanelContent.svelte` deleted
- [ ] `ProductBranches.svelte` deleted (if not already in T-004)
- [ ] `ProductDrawer.svelte` deleted
- [ ] `ProductSpotlight.svelte` deleted
- [ ] `mobilePanel.js` store deleted
- [ ] `mobileDrawer.js` store deleted
- [ ] `spotlight.js` store deleted
- [ ] `grep -r "LeftPanelContent\|CenterPanelContent\|RightPanelContent\|ProductDrawer\|ProductSpotlight\|mobilePanel\|mobileDrawer\|spotlight" src/` returns zero results
- [ ] `npm run build` succeeds with zero errors
- [ ] Visual: full constellation visible on load, no panels
- [ ] Visual: 4 node types distinguishable (core, corners, team blips, product stars)
- [ ] Visual: clicking any node opens info panel with correct content
- [ ] Visual: mobile drawer works at 375px viewport
- [ ] Visual: mobile nav bar visible with 3 buttons
- [ ] Keyboard: Tab/Enter/Escape cycle works
- [ ] Reduced motion: all animations disabled, layout preserved
- [ ] All 5 team members accessible
- [ ] All products accessible (including Champion Trials, Genesis)
- [ ] About + Contact info accessible with email copy

#### File Paths
- Deletes: `src/lib/components/LeftPanelContent.svelte`
- Deletes: `src/lib/components/CenterPanelContent.svelte`
- Deletes: `src/lib/components/RightPanelContent.svelte`
- Deletes: `src/lib/components/ProductDrawer.svelte`
- Deletes: `src/lib/components/ProductSpotlight.svelte`
- Deletes: `src/lib/stores/mobilePanel.js`
- Deletes: `src/lib/stores/mobileDrawer.js`
- Deletes: `src/lib/stores/spotlight.js`

#### Constitution References
- Section 6 (Quality Gates): Build success, cross-browser, mobile, reduced motion

#### Commit Message
`chore(cleanup): remove deprecated panel components and stores`

---

## Convergence Milestone

**After Task:** T-014
**Description:** The site's navigation model has shifted from static panels to a spatial constellation interface. The map IS the site. All content is accessible through interactive nodes. The old panel layout is fully removed.

**Criteria:**
- [ ] Constellation is the full-viewport primary surface
- [ ] 4 interactive node types present and clickable
- [ ] All content accessible through node panels
- [ ] Mobile drawer + nav bar functional
- [ ] Keyboard accessible
- [ ] Reduced motion supported
- [ ] All deprecated components removed
- [ ] Build passes

---

## Coverage Verification

### Functional Requirements → Tasks

| Requirement | Covered By |
|-------------|-----------|
| FR-001 (rooted graph) | T-001 |
| FR-002 (weight-based sizing) | T-001, T-004 |
| FR-003 (mini-constellations) | T-004 |
| FR-004 (spatial proximity) | T-001, T-004 |
| FR-005 (connect to center) | T-006 |
| FR-006 (deterministic positions) | T-001 |
| FR-007 (core node) | T-002 |
| FR-008 (6 corners) | Existing + T-005 |
| FR-009 (team radar blips) | T-003 |
| FR-010 (product stars) | T-004 |
| FR-011 (visually distinguishable) | T-002, T-003, T-004 |
| FR-012 (full viewport, no panels) | T-010 |
| FR-013 (brand overlay) | T-010 |
| FR-014 (mouse parallax) | Existing + T-013 |
| FR-015 (interaction hint) | T-009 |
| FR-016 (center = About) | T-002, T-005 |
| FR-017 (About panel) | T-007 |
| FR-018 (panel near node) | T-007 |
| FR-019 (dismiss panel) | T-005, T-007 |
| FR-020 (one panel at a time) | T-005 |
| FR-021 (team positioned by domain) | T-001, T-003 |
| FR-022 (team connected to domain) | T-006 |
| FR-023 (hover nickname) | T-009 |
| FR-024 (click team → panel) | T-005, T-007 |
| FR-025 (product leaders at products) | T-001, T-003 |
| FR-026 (products clickable) | T-005 |
| FR-027 (product panel) | T-007 |
| FR-028 (Arisce bridges) | T-001, T-004, T-006 |
| FR-029 (children as smaller stars) | T-004 |
| FR-030 (mobile larger targets) | T-011 |
| FR-031 (mobile drawer) | T-011 |
| FR-032 (drawer dismiss) | T-011 |
| FR-033 (mobile nav bar) | T-011 |
| FR-034 (hover states) | T-003, T-004, T-005 |
| FR-035 (dim on panel open) | T-008 |
| FR-036 (close affordance) | T-007 |
| FR-037 (hexagonal skeleton visible) | Existing + T-006 |
| FR-038 (all content accessible) | T-007, T-014 |
| FR-039 (copyright footer) | T-010 |

### Acceptance Criteria → Task Criteria

| Spec AC | Task |
|---------|------|
| AC-001 (no panels on load) | T-010 |
| AC-002 (4 node types) | T-002, T-003, T-004, T-014 |
| AC-003 (click opens panel) | T-005, T-007 |
| AC-004 (one at a time) | T-005 |
| AC-005 (all content) | T-007, T-014 |
| AC-006 (Escape/click-outside) | T-005, T-007 |
| AC-007 (mobile drawer) | T-011 |
| AC-008 (mobile nav bar) | T-011 |
| AC-009 (hover states) | T-003, T-004, T-005 |
| AC-010 (nickname labels) | T-009 |
| AC-011 (keyboard nav) | T-012 |
| AC-012 (dim on panel) | T-008 |
| AC-013 (reduced motion) | T-003, T-008, T-014 |
| AC-014 (60fps) | T-014 |
| AC-015 (build success) | T-014 |
| AC-016 (product size by weight) | T-004 |
| AC-017 (constellation patterns) | T-004 |
| AC-018 (radar ping) | T-003 |
