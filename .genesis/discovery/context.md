# Discovery Context: natoken-company-site

**Date:** 2026-03-07
**Mode:** Brownfield
**Interviewer:** Claude (Genesis Discovery)
**Interviewee:** Nagi (Soren Thor Warnsdorf), CEO of Natoken

---

## Part 1: Automated Codebase Scan

### 1.1 Languages & Frameworks

| Technology | Version | Notes |
|-----------|---------|-------|
| JavaScript | ES Modules | Primary language |
| Svelte | ^5.51.0 | Svelte 5 with Runes |
| SvelteKit | ^2.52.0 | App framework |
| Vite | ^6.0.0 | Build tool |
| @sveltejs/adapter-static | ^3.0.8 | Static site generation |

- **Styling:** Vanilla CSS with custom properties (design tokens), glass morphism
- **Font:** Nunito Sans (Google Fonts)
- **No TypeScript** — JSDoc type annotations used in data files
- **No production dependencies** — devDependencies only (5 total)

### 1.2 Directory Structure

```
src/
  app.css                    — Global styles, design tokens, component classes
  app.html                   — HTML shell
  lib/
    actions/
      scrollReveal.js        — Intersection observer scroll animation
    components/
      AnnouncementBar.svelte — Top banner for announcements
      CenterPanelContent.svelte — Team display panel
      LeftPanelContent.svelte   — About/contact panel
      RightPanelContent.svelte  — Products panel
      NatokenLogo.svelte     — Logo component
      NatokenLogo.svg        — SVG logo source
      ParticleRenderer.svelte — Canvas particle effects
      ProductDrawer.svelte   — Slide-out product detail overlay
      ProductSpotlight.svelte — Product highlight component
      ScrollProgress.svelte  — Scroll progress indicator
    data/
      announcements.js       — Announcement content
      products.js            — Product catalog (3 products)
      team.js                — Team members (5 people)
    stores/
      mobileDrawer.js        — Mobile drawer state
      mobilePanel.js         — Active mobile panel state
      spotlight.js           — Product spotlight state
  routes/
    +layout.svelte           — Main layout (3-panel grid, mobile tabs)
    +layout.js               — Prerender config
    +page.svelte             — Page head only
static/
  favicon.svg
  Ignis.webp                 — RuneForge product image
  Nagi Profile.webp          — Team photo
  Natoken Logo.svg           — Company logo
  Void Profile.webp          — Team photo
```

- **Architecture:** Single-page, 3-panel layout (About | Team | Products)
- **Mobile:** Tab-based panel switching (one panel visible at a time)
- **Desktop:** CSS Grid with 3 columns
- **Total source files:** ~15 (excluding generated/build)

### 1.3 Test State

- **No tests** — zero test files, no test framework, no test config
- **No coverage tooling**

### 1.4 Dependency Health

- **5 devDependencies**, all current major versions
- **No production dependencies** — extremely lean
- **No known vulnerabilities** in lockfile
- **Health:** Excellent — minimal dependency surface

### 1.5 Configuration & Infrastructure

| Config | Status | Details |
|--------|--------|---------|
| CI/CD | Present | GitHub Actions: build + deploy to GitHub Pages |
| Docker | Missing | Not needed for static site |
| Linting | Missing | No ESLint, no Prettier |
| Formatting | Missing | No config |
| Environment | Partial | `.env` gitignored, no `.env.example` |
| Base path | Workaround | Hardcoded `/Landing-Page` for GitHub Pages subpath |

### 1.6 Git History

- **Total commits:** 3
- **Timespan:** Feb 17 – Mar 7, 2026 (~2.5 weeks)
- **Branches:** `main` only
- **Contributors:** 1 (Nagi)
- **Commit style:** Mixed (conventional for genesis, descriptive for fixes)
- **Activity:** Early stage, low volume

### 1.7 Documentation State

- **README:** Missing
- **Inline docs:** Minimal (JSDoc type annotations on data exports)
- **Architecture docs:** None (outside Genesis scaffolding)
- **API docs:** N/A (static site)

---

## Part 2: Human Context

### 2.1 Project Identity & Vision

- **Company:** Natoken LLC
- **Site purpose:** Company presence — "confirm we exist" — but make it the coolest company site on the internet
- **Philosophy:** "Show, don't tell. Be bold, not preachy."
- **Target vibe:** Premium Deluxe. Not a boring corporate page. Innovative frontend design that reflects a company that builds platforms and websites.
- **Brand color:** `#ed0049` (replacing current `#2563eb` blue accent)
- **Open to complete redesign** if something cooler emerges

### 2.2 Products (Full Roster)

| Product | Description | Status | URL | Public |
|---------|-------------|--------|-----|--------|
| RuneForge.dev | Game Modding Publishing Platform | Live | https://runeforge.dev | Yes |
| Taledom.com | Web Novel Writing & Publishing Platform | In Development | https://taledom.com | Yes |
| Champion Trials | League of Legends Challenge App | (New) | TBD | Yes |
| Project Genesis | Master Spec System for Claude Code | Active | Open Source | Yes |
| Arisce.com | Hytale Modding & Server Team | In Development | https://arisce.com | Yes |

- Products deserve rich showcases — screenshots, feature highlights, not just one-liners
- Owner wants innovative product presentation suggestions

### 2.3 Team

| Name | Nickname | Title |
|------|----------|-------|
| Soren Thor Warnsdorf | Nagi | CEO of Natoken |
| Filip Quitko | Crauzer | CTO of Natoken |
| Martynas | Martynas | CCO of Natoken |
| Ismail Immi | Void | CEO of Taledom.com |
| Kerlos Youssef | Scuttlecrab | CEO of Arisce.com |

- **Style:** Minimal, cool, unreachable — nickname + role only
- "We don't need to say much. Our value speaks."
- Current photo + name + title format is fine, just make it look premium

### 2.4 Current Pain Points

- Site is a "cheap version" of the vision — functional but not impressive
- Base path hack (`/Landing-Page`) for GitHub Pages
- No linting/formatting enforcement
- 3-panel design is unique but underutilized — needs much more polish
- Product showcases are barebones
- No README or documentation

### 2.5 What Works Well

- Svelte 5 with Runes — owner loves it, non-negotiable
- Dark theme direction is right
- Particle effects are a good start
- Component structure is clean and modular
- Lean dependency set

### 2.6 Improvement Priorities

1. **Better team showcases** — premium, minimal, cool
2. **Better product marketing/introduction** — rich, innovative product pages
3. **World-class frontend design** — "feel like the most innovative frontend design in the world"

### 2.7 Planned Additions

| Feature | Priority | Notes |
|---------|----------|-------|
| Hiring/Careers page | High | Structured roles with descriptions & requirements (e.g., RuneForge devs) |
| Blog system | Medium | Genesis-managed via new `/genesis:blog` command; collaborative writing flow, scheduled releases |
| Cloudflare Pages deploy | High | Replace GitHub Pages; deploy to `natoken.dev` directly |
| Open source showcase | Low | Project Genesis is open source, can be highlighted |

### 2.8 Design Preferences

- **Minimalistic but rich** — clean doesn't mean boring
- **Heavy on motion** — slide-in/out animations, hover reveals, scroll-driven effects, micro-interactions
- **Push interactivity** as far as it makes sense without feeling gimmicky
- **No corporate cheese** — no testimonials, no "we're the best" copy, no stock photos
- **Show capability through the site itself** — the site IS the portfolio
- **Inspiration:** No specific reference sites; owner feels most company sites are "simple and unimaginative"

### 2.9 Infrastructure Decisions

- **Hosting:** Migrate from GitHub Pages to Cloudflare Pages
- **Domain:** `natoken.dev` (direct, no subpath)
- **Adapter:** Keep `adapter-static` (works with Cloudflare Pages)
- **Social/Contact:** Discord servers for each platform; word-of-mouth driven; no heavy social media presence

---

## Part 3: Gap Analysis

### Current State Assessment

| Area | Status | Notes |
|------|--------|-------|
| Documented principles | Missing | No constitution yet |
| Design documentation | Missing | No design docs, no style guide |
| Feature specifications | Missing | No specs for existing features |
| Test coverage | Missing | Zero tests |
| CI/CD | Present | GitHub Actions deploy (needs migration to Cloudflare) |
| Code quality tools | Missing | No linter, no formatter |
| Dependency health | Good | 5 deps, all current |
| Documentation | Missing | No README, minimal inline docs |
| Git practices | Partial | Single branch, inconsistent commit style |
| Security | Partial | .env gitignored, no secrets in repo; no CSP or headers config |

### Convergence Plan (Priority Order)

1. **Constitution** — Establish principles, tech stack (Svelte 5, Cloudflare Pages, `#ed0049` brand), and conventions
2. **Design system documentation** — Formalize the dark theme, typography, spacing, component patterns
3. **Cloudflare Pages migration** — Remove base path hack, deploy to `natoken.dev`
4. **Code quality tooling** — Add ESLint + Prettier with project conventions
5. **README** — Basic project docs for onboarding
6. **Feature specifications** — Retroactive specs for existing features, forward specs for new ones
7. **Git practices** — Branching strategy, commit conventions
8. **Testing foundation** — At minimum, build verification; stretch: component tests
9. **Security headers** — CSP, HSTS via Cloudflare
10. **Blog infrastructure** — Genesis-managed blog system with scheduled publishing

---

## Summary

Natoken is a small, ambitious team building multiple platforms. The company site is their digital identity — not a marketing funnel, but a statement piece. The current site is functional but "cheap" compared to the vision. The owner wants:

- **The coolest company site on the internet** — innovative, interactive, premium
- **Brand identity anchored in `#ed0049`** — bold and distinctive
- **Rich product showcases** — the site proves they build great things
- **Minimal team presentation** — cool, not corporate
- **Hiring page** — structured, selective
- **Blog via Genesis** — collaborative, scheduled, low-friction
- **Cloudflare Pages** — clean domain, no path hacks

The site itself should be the portfolio. If someone visits `natoken.dev` and doesn't think "these people know what they're doing," it's not done yet.
