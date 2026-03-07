# Content Model: natoken-company-site

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Status:** Draft

---

## 1. Content Principles

- **Show, don't tell.** No "we're the best" copy. The site proves it.
- **Minimal text, maximum impact.** Every word earns its place.
- **No corporate jargon.** If it sounds like a LinkedIn post, rewrite it.
- **Cool > professional.** We're unreachable, not approachable in a corporate sense.
- **Data-driven rendering.** All content lives in JS modules or `.svx` files — never hardcoded in components.

## 2. Data Schemas

### 2.1 Product

```js
/** @type {Product} */
{
  // Identity
  slug: 'runeforge',              // URL-safe identifier, used in /products/{slug}
  name: 'RuneForge.dev',          // Display name
  tagline: 'Forge your world.',   // One-liner hook (short, punchy)
  description: '...',             // 2-3 sentence overview

  // Status
  status: 'live',                 // 'live' | 'in-development' | 'coming-soon'

  // Visual
  image: 'runeforge-hero.webp',   // Hero image filename (in /static/products/)
  icon: 'runeforge-icon.svg',     // Small icon/logo (in /static/products/)
  accentColor: '#ed0049',         // Product-specific accent (optional, defaults to brand)

  // Links
  url: 'https://runeforge.dev',   // Primary external link
  discord: 'https://discord.gg/...', // Discord invite (optional)
  github: null,                   // GitHub repo URL (optional, for open source)

  // Showcase
  features: [
    {
      title: 'Mod Publishing',
      description: 'Upload, version, and distribute your mods.',
      icon: 'upload'              // Icon identifier for feature grid
    }
  ],

  // Constellation
  position: { x: 2, y: 0.5, z: -3 },  // 3D position in constellation
  starCount: 30,                        // Number of stars in product's nebula cluster

  // Meta
  team: ['nagi', 'crauzer'],     // Team member slugs who work on this product
  order: 1                        // Display order
}
```

### 2.2 Team Member

```js
/** @type {TeamMember} */
{
  // Identity
  slug: 'nagi',                   // URL-safe identifier
  nickname: 'Nagi',               // Display name (primary — the "cool" name)
  fullName: 'Soren Thor Warnsdorf', // Real name (shown smaller, secondary)
  title: 'CEO of Natoken',        // Role title

  // Visual
  image: 'nagi.webp',             // Profile photo filename (in /static/team/)

  // Constellation
  position: { x: 0, y: 1, z: 0 }, // 3D position in constellation
  connections: ['crauzer', 'martynas'], // Lines drawn to these team members

  // Meta
  products: ['runeforge', 'genesis', 'champion-trials'], // Products they work on
  order: 1                         // Display order
}
```

### 2.3 Job Listing

```js
/** @type {JobListing} */
{
  // Identity
  slug: 'runeforge-frontend-dev',
  title: 'Frontend Developer',
  product: 'runeforge',           // Product slug this role belongs to
  type: 'voluntary',              // 'voluntary' | 'paid' | 'contract'

  // Content
  description: '...',             // What this role is about (2-3 sentences)
  responsibilities: [
    'Build and maintain RuneForge UI components',
    'Implement responsive layouts and interactions'
  ],
  requirements: [
    'Proficiency in Svelte or React',
    'Strong CSS skills',
    'Understanding of REST APIs'
  ],
  niceToHave: [
    'Experience with game modding communities',
    'Familiarity with Hytale or Minecraft modding'
  ],

  // Contact
  applyMethod: 'discord',         // 'discord' | 'email'
  applyLink: 'https://discord.gg/...', // Where to apply

  // Meta
  active: true,                   // Whether the listing is currently open
  postedDate: '2026-03-07',
  order: 1
}
```

### 2.4 Announcement

```js
/** @type {Announcement} */
{
  id: 'taledom-dev-start',
  text: 'Taledom.com has started development!',
  href: '/products/taledom/',      // Optional link
  type: 'info',                    // 'info' | 'launch' | 'hiring'
  dismissible: false,
  active: true,
  date: '2026-03-07'
}
```

### 2.5 Blog Post (mdsvex frontmatter)

```yaml
---
title: "Why We Built Project Genesis"
slug: "why-we-built-genesis"
date: "2026-03-15"
author: "nagi"                    # Team member slug
tags: ["genesis", "open-source", "development"]
excerpt: "How a spec system became our most important tool."
published: true                   # false = draft, won't be rendered
scheduledDate: null               # Future date for scheduled publishing
coverImage: "genesis-cover.webp"  # Optional hero image
---

Content goes here in Markdown with embedded Svelte components...
```

## 3. Content File Locations

```
src/lib/data/
  products.js          — Product[] export
  team.js              — TeamMember[] export
  jobs.js              — JobListing[] export (new)
  announcements.js     — Announcement[] export

src/content/blog/
  why-we-built-genesis.svx    — Blog post
  runeforge-launch-story.svx  — Blog post
  ...

static/
  team/
    nagi.webp
    void.webp
    ...
  products/
    runeforge-hero.webp
    runeforge-icon.svg
    ...
  blog/
    genesis-cover.webp
    ...
```

## 4. Content Relationships

```
Product ----< TeamMember     (many-to-many via product.team / member.products)
Product ----< JobListing     (one-to-many via job.product)
Product ----< BlogPost       (implied via tags)
TeamMember -- BlogPost       (one-to-many via post.author)
TeamMember -- TeamMember     (constellation connections via member.connections)
```

### Constellation Mapping
The 3D constellation visualizes these relationships:
- **Team nodes** are positioned at `member.position`
- **Connection lines** drawn between members listed in `member.connections`
- **Product regions** are clusters at `product.position`
- **Membership lines** (faint) connect team nodes to their product regions via `member.products`

## 5. Content Governance

### Who Creates Content
- **Product data:** Nagi (CEO) — updated when products change
- **Team data:** Nagi — updated when team changes
- **Job listings:** Product CEOs — each manages their own product's hiring
- **Blog posts:** Any team member via Genesis blog workflow
- **Announcements:** Nagi — for site-wide notices

### Content Workflow (Blog)
1. Author initiates via `/genesis:blog` command
2. Collaborative drafting session (author describes, Genesis writes)
3. Draft saved as `.svx` file with `published: false`
4. Review and editing pass
5. Set `published: true` and `date` (or `scheduledDate` for future)
6. Commit and push — auto-deploys via Cloudflare Pages

### Content Update Frequency
| Content Type | Update Frequency |
|-------------|-----------------|
| Products | When product status changes |
| Team | When team composition changes |
| Jobs | When positions open/close |
| Blog | As written — no fixed schedule |
| Announcements | Event-driven |

## 6. Content Migration (From Current)

### Products (current -> target)
```
Current:
  { name, description, status, url, image }

Migration:
  + slug (derived from name)
  + tagline (new — needs writing)
  + icon (new — needs creation)
  + features[] (new — needs definition per product)
  + discord, github links
  + constellation position
  + team connections
  + order

  Rename: image path -> static/products/
```

### Team (current -> target)
```
Current:
  { name, nickname, fullName, title, image }

Migration:
  + slug (derived from nickname, lowercase)
  + constellation position
  + connections[]
  + products[]
  + order

  Rename: image path -> static/team/
  Fix: URL-encoded filenames -> clean filenames
```

### New Content Needed
| Content | Needed For | Priority |
|---------|-----------|----------|
| Product taglines | Product showcase | High |
| Product features (per product) | Product pages | High |
| Product icons/logos | Product cards | Medium |
| Product hero images | Product pages | Medium |
| Champion Trials data | Product roster | Medium |
| Project Genesis data | Product roster | Medium |
| Job listings | Hiring page | High |
| Team constellation positions | 3D scene | Medium |
| Blog launch post | Blog system | Low |
