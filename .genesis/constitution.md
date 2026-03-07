# Constitution: natoken-company-site

**Established:** 2026-03-07
**Mode:** Brownfield
**Last Amended:** Never

---

## 1. Project Mission

Natoken's company site exists to be the boldest, most innovative company landing page on the internet — a living proof that Natoken builds exceptional digital products. It is not a marketing funnel or a corporate brochure. It is a statement piece. Every pixel, animation, and interaction must communicate: "these people know what they're doing." The site serves as company presence, product showcase, team introduction, hiring gateway, and eventually a blog — all wrapped in a frontend experience that makes every other company site look unimaginative.

## 2. Technology Stack

### Languages
- **JavaScript:** ES Modules (no TypeScript — JSDoc type annotations where useful)

### Frameworks
- **Svelte:** ^5.x (Svelte 5 with Runes — non-negotiable)
- **SvelteKit:** ^2.x (application framework)
- **Vite:** ^6.x (build tool, bundled with SvelteKit)

### Infrastructure
- **Hosting:** Cloudflare Pages (static deployment to `natoken.dev`)
- **Adapter:** `@sveltejs/adapter-static` (SSG, prerendered)
- **CI/CD:** GitHub Actions (build verification) + Cloudflare Pages (deploy)
- **Domain:** `natoken.dev` (no subpath, no base path hacks)

### Key Libraries
- **GSAP:** ^3.x (GreenSock Animation Platform — scroll-driven timelines, staggered reveals, magnetic cursor effects, page transitions, physics-based easing. The interaction engine.)
- **Threlte:** ^8.x (@threlte/core + @threlte/extras — Svelte-native Three.js. Powers the 3D constellation star field backdrop and spatial UI depth. The atmosphere engine.)
- **Three.js:** ^0.170.x (3D rendering, managed through Threlte — never used directly in components)
- **mdsvex:** ^0.12.x (Markdown-in-Svelte preprocessor — blog posts as `.svx` files with embedded Svelte components)
- Beyond these, keep dependencies minimal. Every new dependency requires constitutional justification.

### Styling
- **Vanilla CSS** with custom properties (design tokens)
- **No CSS frameworks** (no Tailwind, no Bootstrap — we write our own)
- **Font:** Nunito Sans (Google Fonts)

### Brand
- **Primary accent:** `#ed0049`
- **Theme:** Dark-first (background `#0d1117` family)
- **Design language:** "Constellation Terminal" — a sci-fi command deck aesthetic. Glass panels float in a 3D star field. Team members are constellation nodes. Products are systems to navigate. Glass morphism, spatial depth, rich GSAP-driven motion, `#ed0049` energy throughout.

## 3. Architecture Principles

- **Component-driven:** Every visual element is a self-contained Svelte component with colocated styles. No global style leaks.
- **Data as modules:** Content (products, team, announcements, jobs) lives in `src/lib/data/` as plain JS exports. No CMS, no external data fetching at build time.
- **State via Svelte stores:** Shared UI state (panels, drawers, spotlights) uses Svelte writable stores in `src/lib/stores/`.
- **Static-first:** The entire site is prerendered. No server-side logic, no API routes. If it can't be static, it doesn't belong here.
- **Progressive enhancement:** Core content is accessible without JavaScript. Animations and interactions enhance, not gate.
- **Mobile-first responsive:** Design for mobile, enhance for desktop. Panel switching on mobile, grid layout on desktop.
- **Motion with purpose:** Every animation must serve UX (guide attention, provide feedback, create delight). No animation for animation's sake. Respect `prefers-reduced-motion`.
- **Layered rendering:** Threlte handles the 3D background layer (constellation, star field, spatial depth). GSAP handles the 2D interaction layer (scroll animations, transitions, hover effects, cursor magnetism). Svelte transitions handle component-level enter/exit. These three layers never fight — they complement.
- **Graceful degradation:** If WebGL isn't available, the 3D layer falls back to a 2D particle/gradient alternative. The site must still look premium without 3D.

## 4. Code Standards

### Naming Conventions
- **Files:** `PascalCase.svelte` for components, `camelCase.js` for modules/stores/actions
- **Components:** PascalCase (e.g., `ProductDrawer`, `ParticleRenderer`)
- **Variables/functions:** camelCase
- **CSS custom properties:** `--kebab-case` with semantic prefixes (`--color-*`, `--text-*`, `--font-*`, `--radius-*`)
- **Data files:** Named after the content they hold (e.g., `products.js`, `team.js`)

### File Structure
```
src/
  app.css              — Design tokens + global base styles
  app.html             — HTML shell
  lib/
    actions/           — Svelte use: directives (scroll, cursor, magnetic)
    components/        — Reusable Svelte components
    components/three/  — Threlte 3D scene components (constellation, stars, etc.)
    data/              — Static content modules
    stores/            — Svelte writable stores
  routes/
    +layout.svelte     — Root layout
    +layout.js         — Prerender/trailing slash config
    +page.svelte       — Homepage
    hiring/            — Careers/hiring page
    blog/              — Blog listing + individual posts
  content/
    blog/              — Blog posts as .svx files (mdsvex)
static/
  [assets]             — Images, fonts, favicons
```

### Import Organization
1. Svelte/SvelteKit imports (`svelte`, `$app/*`)
2. Third-party imports (`gsap`, `@threlte/*`, `three`)
3. Component imports (`$lib/components/*`)
4. Data imports (`$lib/data/*`)
5. Store imports (`$lib/stores/*`)
6. Action imports (`$lib/actions/*`)

### Documentation
- JSDoc `@type` annotations on all data exports
- No mandatory inline comments — code should be self-explanatory
- Complex animations or algorithms get a brief comment explaining intent

## 5. Testing Philosophy

- **Approach:** Build verification first, component tests as the site grows
- **Minimum Coverage:** No hard threshold — this is a showcase site, not a SaaS product
- **Required Tests:**
  - Build must succeed (`vite build` exits 0)
  - Prerender must complete without errors
  - No broken internal links in prerendered output
- **Optional Tests:**
  - Visual regression tests for key pages (future consideration)
  - Accessibility audits via Lighthouse CI

## 6. Quality Gates

Before any feature is considered complete:

- [ ] `npm run build` succeeds with zero errors and zero warnings
- [ ] Site renders correctly on Chrome, Firefox, and Safari (latest)
- [ ] Mobile layout works on 375px+ viewports
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No new dependencies added without constitutional amendment (GSAP, Threlte, Three.js, mdsvex are pre-approved)
- [ ] Design tokens used — no hardcoded colors, font sizes, or spacing outside `app.css`
- [ ] Commit messages follow the declared format (Section 10)

## 7. Security & Compliance

- **Authentication:** None (public static site)
- **Authorization:** None
- **Data Handling:** No user data collected. No cookies. No analytics (unless explicitly added via amendment).
- **Secrets Management:** `.env` files gitignored. No secrets needed for a static site. Cloudflare API tokens managed in GitHub Actions secrets.
- **Regulatory:** None currently. If analytics are added, GDPR/cookie consent required via amendment.
- **Content Security:** Cloudflare security headers (CSP, HSTS, X-Frame-Options) configured via `_headers` file in static output.

## 8. Performance Expectations

- **Lighthouse Score:** 90+ on Performance, Accessibility, Best Practices, SEO
- **First Contentful Paint:** < 1.5s on 4G
- **Total Bundle Size:** < 350KB gzipped (JS + CSS, excluding images — Three.js adds ~150KB but is lazy-loaded)
- **Images:** WebP format, appropriately sized, lazy-loaded where below the fold
- **Fonts:** `font-display: swap`, preconnected to Google Fonts
- **Animations:** 60fps on mid-range devices. Use `transform` and `opacity` — no layout-triggering properties in animations.

## 9. Documentation Requirements

- **README.md:** Project overview, setup instructions, deployment guide, architecture summary
- **CLAUDE.md:** Kept current with project conventions and Genesis state (auto-managed)
- **Inline Documentation:** Minimal — only where intent isn't obvious from code
- **Design Decisions:** Major design/UX decisions documented in `.genesis/design/`

## 10. Version Control Strategy

- **Branching Model:** Feature branches off `main`
- **Branch Naming:** `feature/{short-description}`, `fix/{short-description}`, `chore/{short-description}`
- **Commit Format:** Conventional-ish with scope: `type(scope): description`
  - Types: `feat`, `fix`, `style`, `refactor`, `chore`, `docs`, `genesis`
  - Scope: optional, component or area name
  - Examples: `feat(products): add rich product showcase`, `fix(mobile): panel switching flicker`
- **Merge Strategy:** Squash merge feature branches into `main`
- **Release Process:** Every push to `main` auto-deploys via Cloudflare Pages. No manual releases. `main` is always production.

## 11. Amendment Process

### Amendment Tiers

| Tier | Sections | Requirements |
|------|----------|-------------|
| **Foundational** | 1 (Mission), 2 (Tech Stack), 3 (Architecture) | Full impact analysis, review all existing artifacts |
| **Standard** | 4-8, 10 | Impact analysis, spot-check recent artifacts |
| **Advisory** | 9 (Documentation), 11 (Amendments) | Justification only |

### Amendment Procedure

To amend this constitution:
1. The user must explicitly request the amendment (or use `/genesis:amend`)
2. The amendment tier determines the review depth required
3. The rationale must be documented
4. Impact on existing artifacts must be assessed (per tier)
5. The user must approve the amendment
6. The amendment is logged below with date, rationale, and what changed
7. Precedents affected by the amendment should be reviewed (see `.genesis/design/precedents.md`)

### Review Schedule

**Review after every:** 3 completed features
**Last reviewed:** Never
**Next review due:** After feature #3

### Amendment Log

| # | Date | Section | Tier | Change | Rationale |
|---|------|---------|------|--------|-----------|
| — | — | — | — | — | — |

## 12. Legacy Handling

| Area | Strategy | Deadline | Notes |
|------|----------|----------|-------|
| GitHub Pages deploy workflow | Immediate | Before first Cloudflare deploy | Replace `.github/workflows/deploy.yml` with Cloudflare Pages config |
| Base path hack in `svelte.config.js` | Immediate | With Cloudflare migration | Remove `/Landing-Page` conditional base path |
| Blue accent color (`#2563eb`) | Immediate | First design pass | Replace all instances with `#ed0049` brand color |
| Missing linting/formatting | Progressive | Before feature #2 | Add ESLint + Prettier during first major feature work |
| Missing README | Progressive | Before feature #2 | Create during constitution or first feature |
| Product data structure | Progressive | During product showcase feature | Expand from basic to rich product objects |
| Team data structure | Progressive | During team showcase feature | Enhance as needed for new design |
| Canvas particle renderer | Progressive | During constellation feature | Replace `ParticleRenderer.svelte` with Threlte 3D constellation scene |
| Hand-rolled scroll animations | Progressive | During GSAP integration | Replace `scrollReveal.js` action with GSAP ScrollTrigger |
