# Design Overview: natoken-company-site

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Status:** Draft

---

## 1. Vision & Purpose

Natoken is a software company that builds platforms — RuneForge, Taledom, Champion Trials, Arisce, and Project Genesis. The company site at `natoken.dev` exists to prove that fact through its own design. It's not a brochure. It's a statement.

The site uses a design language called **"Constellation Terminal"** — a sci-fi command deck aesthetic where glass UI panels float in a 3D star field. Team members are nodes in a constellation network. Products are systems you navigate into. The whole experience feels like accessing Natoken's bridge — minimal text, maximum craft, `#ed0049` energy pulsing through everything.

The site serves as: company presence, product showcase, team introduction, hiring gateway, and blog. But above all, it exists to make visitors think: "these people know what they're doing."

## 2. Target Users

### Primary Users
- **Potential Collaborators / Hires:** Developers, designers, and creators who discover Natoken through word-of-mouth or product communities. They visit to understand what Natoken is, who's behind it, and whether they want to be part of it. They care about craft, not corporate speak.
- **Product Users:** People who use RuneForge, Taledom, or Arisce and want to know who's behind the platform. They arrive curious and should leave impressed.

### Secondary Users
- **Industry Peers:** Other developers and companies who encounter the site. The site itself is a portfolio piece — it should make them take notice.
- **Potential Partners:** Anyone evaluating Natoken for collaboration. The site replaces a pitch deck.

## 3. Core Concepts

| Concept | Definition |
|---------|------------|
| Constellation | The 3D star field backdrop — team members are stars/nodes connected by faint lines forming Natoken's network. The living background of the entire site. |
| Terminal | The UI layer — glass panels with spatial depth that float over the constellation. Inspired by sci-fi command interfaces. Clean, minimal, functional. |
| Node | A point in the constellation that represents a person or product. Nodes pulse with `#ed0049` on interaction. |
| System | A product in the Natoken ecosystem. Each system can be "accessed" — navigated into for a rich showcase. |
| Glass Panel | The primary UI container. Translucent, blurred backdrop, subtle border, floating in 3D space with depth. |
| Command Deck | The overall site metaphor — you're on the bridge of a ship, viewing Natoken's network and systems. |

## 4. System Overview

### 4a. Current State (As-Is)

A single-page SvelteKit static site with a 3-panel layout:

```
[Header: NATOKEN + slogan]
[Mobile tab bar: About | Team | Products]
[Left Panel: About + Contact] [Center Panel: Team grid] [Right Panel: Product cards]
[Canvas particle renderer at bottom]
[Product drawer overlay]
```

- **Layout:** CSS Grid, 3 columns on desktop, tab-switched on mobile
- **Styling:** Dark theme, glass morphism, hand-rolled CSS tokens
- **Animation:** Canvas 2D particle renderer, IntersectionObserver scroll reveals
- **Data:** 3 products, 5 team members, 1 announcement
- **Deploy:** GitHub Pages with `/Landing-Page` base path hack

**What works:** The component structure is clean. Dark theme is right. Svelte 5 Runes are in use. Dependency count is minimal.

**What doesn't:** The design is functional but forgettable. Panels feel static. Products are one-liners. The particle renderer is a placeholder. There's no depth, no narrative, no "wow."

### 4b. Target State (To-Be)

A multi-page site with the Constellation Terminal experience:

```
[3D Constellation backdrop — Threlte star field, always present]
  |
  +-- Homepage (Command Deck)
  |     [Floating glass panels with spatial depth]
  |     [Constellation nodes = team members, pulsing connections]
  |     [Product systems as navigable regions in the star field]
  |     [GSAP scroll-driven reveals, magnetic cursor, staggered text]
  |
  +-- Product Showcases (per-product deep dives)
  |     [Rich product pages with screenshots, features, tech]
  |     [Each product has its own visual identity within the brand]
  |
  +-- Hiring Page
  |     [Structured role listings with requirements]
  |     [Terminal-inspired aesthetic: "positions.available()"]
  |
  +-- Blog
        [mdsvex-powered posts]
        [Genesis-managed content workflow]
        [Terminal-aesthetic article layout]
```

**Rendering layers (bottom to top):**
1. **3D Layer (Threlte):** Constellation star field, ambient particles, depth fog, subtle camera drift
2. **UI Layer (Svelte + CSS):** Glass panels, content, navigation — floating above the stars
3. **Interaction Layer (GSAP):** Scroll triggers, hover effects, magnetic cursor, page transitions, text animations
4. **Transition Layer (Svelte):** Component enter/exit, route transitions

### 4c. Convergence Path

1. **Foundation:** Migrate to Cloudflare Pages, swap brand color, remove base path hack
2. **Atmosphere:** Replace canvas particle renderer with Threlte constellation scene
3. **Interaction:** Integrate GSAP for scroll, hover, cursor, and transition effects
4. **Homepage redesign:** Rebuild the 3-panel layout as floating glass panels in the constellation
5. **Product showcases:** Rich per-product pages replacing the simple card + drawer
6. **Team constellation:** Team members as interactive nodes in the 3D field
7. **Hiring page:** Terminal-aesthetic role listings
8. **Blog:** mdsvex integration with Genesis workflow
9. **Polish:** Performance tuning, WebGL fallback, cross-browser QA

## 5. Key Features / Content Areas

### 5.1 Homepage — The Command Deck
The landing experience. Visitor arrives on the bridge. Stars drift. Glass panels fade in with staggered GSAP timelines. The constellation reveals team connections. Products glow as navigable systems. Everything breathes.

### 5.2 Product Showcases
Each product gets a dedicated deep-dive:
- **RuneForge.dev** — Live, flagship. Hero screenshot, key features, link to platform.
- **Taledom.com** — In development. Vision, progress, what makes it different.
- **Champion Trials** — New. Concept, planned features, coming soon energy.
- **Project Genesis** — Open source. GitHub link, what it does, how it's different.
- **Arisce.com** — In development. The Hytale modding vision.

### 5.3 Team Constellation
Team members as nodes in the star field. Minimal info — nickname + role. Hover reveals a subtle glow. Click or hover for more. Not a grid of cards — a spatial, connected network. Shows who works on what product through constellation lines.

### 5.4 Hiring Gateway
Structured role listings. Each role has: title, team/product, requirements, what you'll do, how to apply. Terminal-inspired aesthetic — not a boring HR page. Selective tone: "We're looking for the right people, not just any people."

### 5.5 Blog
Genesis-managed posts written in mdsvex (`.svx`). Minimal, clean article layout. Terminal-aesthetic code blocks. Posts about products, development, open source, and company direction. Scheduled releases via Genesis workflow.

### 5.6 Navigation
No traditional navbar. Navigation is spatial — part of the constellation experience on desktop. On mobile, a compact bottom bar or gesture-based panel switching. Route transitions feel like navigating between star systems.

## 6. External Dependencies

| Dependency | Provides | Reliability |
|-----------|----------|-------------|
| Cloudflare Pages | Hosting, CDN, DNS, security headers | Excellent — enterprise-grade global CDN |
| Google Fonts (Nunito Sans) | Typography | Excellent — preconnected, swap display |
| GitHub | Source control, CI/CD triggers | Excellent |
| Discord (product servers) | Contact/community links | External — linked only, not embedded |

## 7. Constraints & Boundaries

- **No user accounts or authentication** — this is a static showcase
- **No analytics by default** — if added, requires constitutional amendment + GDPR compliance
- **No CMS** — content lives in code (data modules, `.svx` files)
- **No client testimonials** — "show, don't tell" philosophy
- **No stock photography** — real team photos or no photos
- **No corporate jargon** — if it sounds like a LinkedIn post, rewrite it
- **No embedded third-party widgets** (chat, social feeds, etc.) — we control every pixel
- **WebGL not guaranteed** — must degrade gracefully to 2D

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Visitor reaction | "How did they make this?" — the site should provoke curiosity |
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 90+ |
| First Contentful Paint | < 1.5s on 4G |
| Bundle size (gzipped) | < 350KB (JS + CSS) |
| Mobile experience | Equally impressive on phone as desktop |
| Hiring inquiries | People apply because the site convinced them, not the job post |

## 9. Open Design Questions

- **Navigation model:** How does spatial navigation work on mobile? The constellation is a desktop experience — mobile needs an equally cool but touch-friendly approach. Options: gesture-based panels, swipe navigation, compact bottom bar with micro-animations.
- **Product page depth:** How deep do product showcases go? Single scroll page per product vs. tabbed sections vs. interactive terminal-style exploration?
- **Constellation density:** How many stars/particles before it feels cluttered vs. empty? Needs prototyping to find the sweet spot.
- **Blog integration with constellation:** Does the blog feel like part of the command deck, or is it a separate "zone" with its own aesthetic?
- **Loading experience:** The 3D scene needs time to initialize. What does the user see during load? A branded loading sequence could set the tone.

## 10. Site Map

```
natoken.dev/
|
+-- / ........................ Homepage (Command Deck)
|   |                         - Constellation backdrop
|   |                         - Brand intro (animated)
|   |                         - Team constellation (nodes)
|   |                         - Product systems (navigable)
|   |                         - About / Contact (glass panel)
|
+-- /products/ .............. Product index (or handled on homepage)
|   +-- /products/runeforge/   RuneForge deep dive
|   +-- /products/taledom/     Taledom deep dive
|   +-- /products/champion-trials/  Champion Trials deep dive
|   +-- /products/genesis/     Project Genesis deep dive
|   +-- /products/arisce/      Arisce deep dive
|
+-- /hiring/ ................ Careers & open roles
|
+-- /blog/ .................. Blog listing
    +-- /blog/{slug}/        Individual blog posts
```
