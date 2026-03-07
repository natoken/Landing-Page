# Project State: natoken-company-site
**Last Updated:** 2026-03-07
**Genesis Version:** 1.0.0
**Mode:** Brownfield
**Current Phase:** Constitution established

## Active Work
- **Feature:** constellation-nav
- **Phase:** tasks
- **Progress:** 12 of 14 tasks complete (T-009, T-012 deferred to polish)
- **Branch:** genesis/003-constellation-nav

## Completed Features
| Feature | Completed | Branch | Merged |
|---------|-----------|--------|--------|
| cloudflare-migration | 2026-03-07 | genesis/001-cloudflare-migration | Yes (squash to main) |

## Key Decisions
| Decision | Rationale | Date | Constitutional? |
|----------|-----------|------|-----------------|
| Svelte 5 (Runes) | Owner preference, already in use | 2026-03-07 | Yes |
| Cloudflare Pages | Clean domain, no base path hack | 2026-03-07 | Yes |
| Brand color #ed0049 | Official company color | 2026-03-07 | Yes |
| GSAP for animation | Industry-standard motion engine for premium interactions | 2026-03-07 | Yes |
| Threlte/Three.js for 3D | Constellation Terminal design — 3D star field backdrop | 2026-03-07 | Yes |
| mdsvex for blog | Markdown-in-Svelte for Genesis-managed blog posts | 2026-03-07 | Yes |
| Vanilla CSS only | No CSS frameworks — bespoke design system | 2026-03-07 | Yes |
| "Constellation Terminal" design | Sci-fi command deck with glass panels in star field | 2026-03-07 | Yes |
| Lucide Svelte icons | Clean, tree-shakeable icon system | 2026-03-07 | Yes |

## Constitutional Amendments
| Amendment | Rationale | Date |
|-----------|-----------|------|
| Added Lucide Svelte + JetBrains Mono | Icon system + terminal font | 2026-03-07 |

## Custom Phases
| Phase | Description | Last Run |
|-------|-------------|----------|
| — | — | — |

## Open Questions
- None

## Blockers
- None

## Session Log
### 2026-03-07
- Project Genesis initialized in Brownfield mode
- Discovery complete: codebase scan + owner interview. Vision: "Premium Deluxe" company site at natoken.dev. Key decisions: Svelte 5, Cloudflare Pages, #ed0049 brand, innovative frontend, hiring page, Genesis-managed blog.
- Constitution established: Tech stack locked (Svelte 5, GSAP, Threlte, mdsvex, vanilla CSS). Design language: "Constellation Terminal". Git strategy: feature branches, conventional commits, squash merge, auto-deploy.
- Design docs created: overview (site map, as-is/to-be, convergence path), design system (full token reference, motion patterns, component patterns), architecture (4-layer rendering pipeline, Threlte scene graph, GSAP integration, build pipeline), content model (all data schemas, relationships, migration plan).
- Spec approved: cloudflare-migration (migrate to Cloudflare Pages, remove base path hack, swap accent to #ed0049, add security headers, tear down GitHub Pages).
- Plan approved and tasks decomposed: 7 tasks (5 small, 2 medium). Critical path: T-001 → T-002 → T-006 → T-007. T-003/T-004/T-005 parallelizable.
- cloudflare-migration: All code tasks complete (T-001–T-006). Squash merged to main, pushed to trigger Cloudflare rebuild. T-007 (manual setup) complete.
- Spec approved: constellation (replace 2D particle renderer with Threlte 3D star field). Full viewport coverage, depth fog, 500+ stars, camera drift, reduced motion support, 2D fallback, async loading.
- Spec clarified: 6 Corners (hexagonal leadership anchors), product branches (RuneForge near CTO, Taledom near CEO), tiered star counts, glass panels, route persistence.
- Plan approved: constellation. 6 new components, 3 stores, 12-step build order. Threlte + Three.js lazy-loaded (~165KB). InstancedMesh for stars, shader twinkle, Three.js Fog.
- Tasks decomposed: 10 tasks (4 small, 5 medium, 1 large). Critical path: T-001 → T-002 → T-004 → T-005 → T-008 → T-009 → T-010. T-003/T-006/T-007 parallelizable.
- constellation: Implementation complete with bug fixes (fog shader crash, 2D→3D star distribution, mouse parallax, constellation lines). Pending review/merge.
- Spec approved: constellation-nav (map-driven spatial navigation replacing static panels). Constellation becomes primary interface: core node at center, team as radar blips, products as mini-constellations with size scaling, Obsidian-like graph layout.
