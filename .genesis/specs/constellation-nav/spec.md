# Specification: Constellation Navigation

**Feature:** constellation-nav
**Version:** 1.0
**Status:** Approved
**Created:** 2026-03-07
**Author:** Genesis

---

## Overview

The Constellation Navigation feature transforms the site from a traditional panel-based layout into a living, map-driven spatial interface. The 3D constellation — already implemented as a backdrop — becomes the primary navigation surface and the site's visual identity.

The constellation is a force-directed graph rooted at Natoken's core (center). The company core sits at the center of the hexagonal 6 Corners, surrounded by team member nodes. Products radiate outward from their parent leadership corners as mini-constellations — groups of stars connected by lines forming distinct shapes. As a product gains sub-products or children, its primary star grows larger and its constellation expands. The entire map grows organically as Natoken grows — add a product, the map expands; add a team member, a new blip appears.

Content that currently lives in three static panels (About, Team, Products) is accessed by interacting with nodes. Clicking a node opens a floating glass info panel anchored near it. The permanent panels are removed entirely — the map IS the site.

On mobile, the experience adapts with larger tap targets and a slide-up content drawer, plus a compact bottom nav for direct section access.

## Design Document References

- `.genesis/design/overview.md` — Sections 3 (Core Concepts), 4b (Target State), 5.3 (Team Constellation), 5.6 (Navigation)
- `.genesis/design/system.md` — Glass properties, color palette, motion patterns
- `.genesis/design/technical/architecture.md` — 4-layer rendering pipeline, component architecture
- `.genesis/specs/constellation/spec.md` — Foundation this feature builds on

## User Stories

### US-001: Explore the Constellation
As a **visitor**, I want to **see and explore the full constellation map** when I arrive at the site, so that I **immediately understand this is something different from a typical company page**.

### US-002: Discover Company Info
As a **visitor**, I want to **click on the central node to reveal information about Natoken** (about, contact details), so that I **can learn about the company without it being forced on me**.

### US-003: Meet the Team
As a **visitor**, I want to **see team members as interactive radar-blip nodes surrounding the core** and click them for details, so that I **understand who's behind Natoken and what they work on**.

### US-004: Browse Products
As a **visitor**, I want to **click on product constellations to see product details**, so that I **can explore what Natoken builds through the spatial interface**.

### US-005: Navigate on Mobile
As a **visitor on a phone**, I want to **tap on constellation nodes and get content in a smooth overlay**, so that I **get the same spatial feel without needing precise mouse control**.

### US-006: Orient Myself
As a **visitor**, I want to **always know what I can interact with and how to return to the full map view**, so that I **never feel lost in the interface**.

### US-007: See the Company Grow
As a **visitor**, I want to **see the constellation's structure reflect Natoken's actual organizational shape** — more products, bigger presence — so that I **intuitively understand the company's scope and ambition**.

## Functional Requirements

### Constellation Graph Model (US-007)

- **FR-001:** The constellation is structured as a rooted graph: Natoken core at the center, 6 Corners as the organizational skeleton, products radiating outward, team members positioned at their domains.
- **FR-002:** Every product is a node whose visual size (star brightness and radius) scales with the number of its children and descendants. A product with 3 sub-products has a visibly larger star than a product with none.
- **FR-003:** Products are rendered as mini-constellations — their star plus any child product stars, connected by lines forming a linked shape. Not particle clusters.
- **FR-004:** Parent-child product relationships create spatial proximity: children orbit near their parent, pulled toward it like gravitational attraction.
- **FR-005:** All product constellations connect back to the center (Natoken core) via lines through their parent leadership corner.
- **FR-006:** The graph layout is deterministic — same data always produces the same visual arrangement. Positions are derived from the data, not randomized.

### Visual Node Types

- **FR-007:** **Natoken Core** (center): A distinct, prominent node at the origin of the hexagon. Visually the anchor of the entire map. Clicking it reveals company info.
- **FR-008:** **6 Corners** (hexagonal ring): Leadership anchor points. Filled corners (CEO, CTO) glow with brand color. Unfilled corners are dim but visible, indicating open positions.
- **FR-009:** **Team Nodes** (radar blips): Each team member is a bright point with a thin ring outline and a periodic ping/blip animation radiating outward — like a sonar pulse. They surround the core and connect to their domain.
- **FR-010:** **Product Nodes** (constellation stars): Each product is a star connected by lines to its parent corner and to sibling/child products. The lines form a visible constellation shape. The star's size reflects its weight in the graph (children count).
- **FR-011:** All four node types are visually distinguishable from each other and from decorative background stars through differences in size, glow style, animation, and connectivity.

### Map as Primary Surface (US-001)

- **FR-012:** When the site loads, the constellation map occupies the full viewport with no permanent panels overlaying it.
- **FR-013:** The brand name and slogan remain visible as a minimal, non-obstructing overlay at the top of the viewport.
- **FR-014:** The map is explorable: the visitor can move their mouse to look around (parallax) and see depth in the star field.
- **FR-015:** On first visit, a brief visual hint communicates that the map is interactive (e.g., a subtle pulse on the core node, a "click to explore" indicator that fades after a few seconds).

### Company Info — Center Node (US-002)

- **FR-016:** The center of the hexagonal constellation serves as the "About" access point — a distinct node at the origin of the 6 Corners.
- **FR-017:** Clicking the center node opens a floating glass panel with company description and contact information (email with copy button, address).
- **FR-018:** The floating panel appears anchored near the clicked node's position in the viewport, not as a full-screen overlay.
- **FR-019:** The panel can be dismissed by clicking outside it, pressing Escape, or clicking a close control.
- **FR-020:** Only one content panel is open at a time. Opening a new one closes the previous.

### Team Constellation (US-003)

- **FR-021:** Each team member is represented as a radar-blip node, positioned near their associated domain: CEO and CTO at their filled corners, product leaders at their product nodes, other members near the corner of the leader they report to.
- **FR-022:** Team member nodes are visually connected to their domain via faint lines.
- **FR-023:** Hovering a team node shows the member's nickname as a text label near the node.
- **FR-024:** Clicking a team node opens a glass panel showing the member's photo (if available), nickname, full name, and title.
- **FR-025:** Team members who are CEOs of products (Void at Taledom, Scuttlecrab at Arisce) are positioned at their product's node, connected to both the product and its parent leadership corner.

### Product Exploration (US-004)

- **FR-026:** Product constellation stars are clickable.
- **FR-027:** Clicking a product star opens a glass panel with the product name, description, status badge, image (if available), and visit link.
- **FR-028:** The Arisce node is positioned bridging Taledom and RuneForge, linked to both, reflecting its dual relationship.
- **FR-029:** Product constellations that have children show the child nodes as smaller connected stars. Clicking a child opens its own panel.

### Mobile Experience (US-005)

- **FR-030:** On mobile viewports (below 960px), the constellation is visible with interactive nodes rendered as larger tap targets.
- **FR-031:** Tapping a node on mobile slides up a content drawer from the bottom rather than anchoring a floating panel.
- **FR-032:** The mobile drawer can be dismissed by swiping down or tapping outside.
- **FR-033:** A compact bottom navigation bar provides direct access to About, Team, and Products views for visitors who prefer not to navigate the map.

### Orientation & Wayfinding (US-006)

- **FR-034:** Interactive nodes show a hover state (glow intensification, scale increase, cursor change to pointer) to signal interactivity.
- **FR-035:** When a panel is open, the rest of the constellation dims slightly to focus attention on the active node.
- **FR-036:** A "close" or "back to map" affordance is always visible when a panel is open.
- **FR-037:** The hexagonal structure of the 6 Corners and their connecting lines remain subtly visible as the organizational skeleton.

### Content Preservation

- **FR-038:** All content currently in the three panels (About text, contact info with email copy, address, team cards, product cards with status badges and links) is accessible through the constellation interface.
- **FR-039:** The copyright footer remains visible in the interface.

## Non-Functional Requirements

- **NFR-001:** The constellation with all interactive nodes renders at 60fps on a mid-range desktop GPU.
- **NFR-002:** Opening and closing content panels completes within 300ms with smooth animation.
- **NFR-003:** The interface is keyboard-navigable: Tab cycles through interactive nodes, Enter/Space opens panels, Escape closes them.
- **NFR-004:** All content panels and interactive elements have appropriate ARIA roles and labels for screen readers.
- **NFR-005:** The constellation navigation works on viewports from 375px to 2560px wide.
- **NFR-006:** When `prefers-reduced-motion` is active, all hover/reveal/ping animations are instantaneous rather than animated, but the spatial layout and interactivity are preserved.
- **NFR-007:** First meaningful interaction (node clickable) is available within 3 seconds of page load on a 4G connection.
- **NFR-008:** The total additional bundle size for constellation-nav (beyond the existing constellation feature) does not exceed 15KB gzipped.

## Acceptance Criteria

- [ ] **AC-001:** On page load, the full constellation is visible with no permanent panels covering it. Only the brand name/slogan overlay is present.
- [ ] **AC-002:** Four visually distinct node types are present: core (center), corners (hexagonal ring), team (radar blips with ping), products (constellation stars with lines).
- [ ] **AC-003:** Clicking any interactive node opens a floating glass panel with relevant content near that node's viewport position.
- [ ] **AC-004:** Only one content panel is open at a time; opening a new one closes the previous.
- [ ] **AC-005:** All content from the current panels (About, Contact with email copy, address, Team cards, Product cards with status/links) is accessible through constellation nodes.
- [ ] **AC-006:** Pressing Escape or clicking outside a panel closes it and returns to the full map view.
- [ ] **AC-007:** On mobile (< 960px), tapping a node opens a bottom drawer with the content.
- [ ] **AC-008:** Mobile has a compact bottom nav bar for direct section access.
- [ ] **AC-009:** Interactive nodes have visible hover states (glow/scale) on desktop.
- [ ] **AC-010:** Team member nodes show nickname labels on hover.
- [ ] **AC-011:** Keyboard navigation works: Tab through nodes, Enter to open, Escape to close.
- [ ] **AC-012:** The constellation dims when a panel is open, refocuses when panel closes.
- [ ] **AC-013:** `prefers-reduced-motion` disables transition/ping animations while preserving layout and functionality.
- [ ] **AC-014:** The interface renders at 60fps on desktop during normal interaction.
- [ ] **AC-015:** `npm run build` succeeds with zero errors.
- [ ] **AC-016:** Product stars are visibly larger when they have more children/descendants than products with fewer.
- [ ] **AC-017:** Product constellations show connected star patterns (lines between product and children), not particle clusters.
- [ ] **AC-018:** Team radar-blip nodes show a periodic outward ping animation.

## Out of Scope

- **Product deep-dive pages** (per-product routes like `/products/runeforge`) — this spec covers node-level summary panels only.
- **Team member profile pages** — clicking a team node shows a summary panel, not a full profile.
- **Scroll-driven camera movement** (GSAP ScrollTrigger integration) — separate feature.
- **Drag-to-rotate or pinch-to-zoom 3D orbit** — camera is mouse-parallax + auto-drift only.
- **Blog integration** into the constellation.
- **Hiring page** integration into the constellation.
- **Real-time data** — all content is static data modules.
- **Force-directed physics simulation** — node positions are data-driven and deterministic, not physics-simulated at runtime.

## Open Questions

- [x] **OQ-001:** Mobile navigation is a compact bottom tab bar. *(Resolved)*
- [x] **OQ-002:** Product leaders (Void, Scuttlecrab) are positioned at their product nodes, connected to both the product and its parent leadership corner. *(Resolved)*
- [x] **OQ-003:** About/Contact lives at the center of the hexagonal constellation. *(Resolved)*

## Constitution Compliance Check

| Section | Requirement | Compliant | Notes |
|---------|------------|-----------|-------|
| 1 (Mission) | Site as statement piece | Yes | Living constellation map is bold and innovative |
| 2 (Tech Stack) | Svelte 5, Threlte, vanilla CSS only | Yes | No new dependencies needed |
| 3 (Architecture) | Component-driven, data as modules | Yes | Existing data modules extended with graph relationships |
| 3 (Architecture) | Mobile-first responsive | Yes | Mobile drawer + compact bottom nav |
| 3 (Architecture) | Motion with purpose, reduced motion | Yes | NFR-006, ping animation serves UX (signals interactivity) |
| 3 (Architecture) | Graceful degradation | Yes | Falls back to existing 2D fallback when WebGL unavailable |
| 3 (Architecture) | Progressive enhancement | Yes | Content accessible via mobile nav even without map interaction |
| 4 (Code Standards) | Naming, structure | Yes | No violations |
| 6 (Quality Gates) | Build success, cross-browser, mobile, motion | Yes | AC-015, NFR-005, NFR-006 |
| 8 (Performance) | 60fps, bundle budget | Yes | NFR-001, NFR-008 |
