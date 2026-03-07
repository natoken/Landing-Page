# Design System: natoken-company-site

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Status:** Draft

---

## 1. Design Philosophy

**"Constellation Terminal"** — A sci-fi command deck where glass UI panels float in a 3D star field. The aesthetic is: premium, minimal, alive. Every element should feel like it belongs on the bridge of a ship navigating through Natoken's network.

**Principles:**
- **Dark-first.** Light is precious — used for accent, emphasis, and energy. The void is the canvas.
- **Glass over solid.** Panels are translucent, not opaque. You can always sense the constellation behind them.
- **Motion is life.** Nothing is truly static. Stars drift. Panels breathe. Text arrives. But nothing screams.
- **Red is energy.** `#ed0049` is the lifeblood — used for focus, action, and identity. Not decoration.
- **Minimalism is confidence.** Say less. Show more. White space is power.

## 2. Color Palette

### Core Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0d1117` | Page background, the void |
| `--color-bg-soft` | `#161b22` | Elevated surfaces, subtle depth |
| `--color-surface` | `#1c2128` | Cards, panels, interactive surfaces |
| `--color-accent` | `#ed0049` | Primary brand accent — CTAs, focus, energy |
| `--color-accent-hover` | `#ff1a5e` | Accent on hover/active state |
| `--color-accent-glow` | `rgba(237, 0, 73, 0.3)` | Accent glow for 3D nodes, shadows |
| `--color-accent-subtle` | `rgba(237, 0, 73, 0.08)` | Accent tint for backgrounds |
| `--color-text` | `#e6edf3` | Primary text — high contrast on dark |
| `--color-text-muted` | `#7d8590` | Secondary text, labels, captions |
| `--color-text-faint` | `#484f58` | Tertiary text, disabled states |
| `--color-border` | `rgba(255, 255, 255, 0.06)` | Subtle borders, panel edges |
| `--color-border-strong` | `rgba(255, 255, 255, 0.12)` | Emphasized borders, hover states |
| `--color-success` | `#3fb950` | Live status, positive states |
| `--color-wip` | `#d29922` | In-development status, warning |
| `--color-star` | `#e6edf3` | Default star color in constellation |
| `--color-star-dim` | `rgba(230, 237, 243, 0.3)` | Distant/faded stars |

### Glass Properties

| Token | Value | Usage |
|-------|-------|-------|
| `--glass-bg` | `rgba(22, 27, 34, 0.6)` | Glass panel background |
| `--glass-bg-hover` | `rgba(22, 27, 34, 0.75)` | Glass panel on hover |
| `--glass-border` | `rgba(255, 255, 255, 0.05)` | Glass panel border |
| `--glass-border-hover` | `rgba(255, 255, 255, 0.1)` | Glass panel border on hover |
| `--glass-blur` | `12px` | Backdrop blur amount |
| `--glass-blur-heavy` | `20px` | Heavy blur for overlays |

### Accent Usage Rules
- `--color-accent` is used for: interactive elements, active states, team node highlights, brand marks, CTAs
- Never use accent for large background fills — it's an energy source, not a paint bucket
- Accent glows (`box-shadow`, `drop-shadow`) use `--color-accent-glow`
- Accent tint backgrounds use `--color-accent-subtle`

## 3. Typography

### Font Stack
```css
--font-sans: "Nunito Sans", system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", "Consolas", monospace;
```

`--font-mono` is added for the terminal aesthetic — used in hiring page, blog code blocks, and subtle UI accents where the "command deck" metaphor surfaces.

### Scale

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | `0.8125rem` (13px) | Badges, labels, fine print |
| `--text-sm` | `0.875rem` (14px) | Body secondary, captions, card descriptions |
| `--text-base` | `1rem` (16px) | Body primary |
| `--text-lg` | `1.125rem` (18px) | Card titles, emphasis |
| `--text-xl` | `1.25rem` (20px) | Section subtitles |
| `--text-2xl` | `1.5rem` (24px) | Section headings |
| `--text-3xl` | `1.875rem` (30px) | Page headings |
| `--text-4xl` | `2.25rem` (36px) | Hero text |
| `--text-display` | `clamp(2.5rem, 8vw, 5rem)` | Brand title "NATOKEN" — fluid, dominant |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-tight` | `1.2` | Headings, display text |
| `--leading-snug` | `1.35` | Card titles, UI labels |
| `--leading-normal` | `1.5` | Body text |
| `--leading-relaxed` | `1.65` | Long-form reading (blog) |

### Font Weight Usage
- `400` — Body text, descriptions
- `500` — UI labels, buttons, links
- `600` — Card titles, section headings, emphasis
- `700` — Page headings
- `900` — Brand title, team nicknames (display weight)

## 4. Spacing

### Scale
| Token | Value |
|-------|-------|
| `--space-1` | `0.25rem` (4px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.25rem` (20px) |
| `--space-6` | `1.5rem` (24px) |
| `--space-8` | `2rem` (32px) |
| `--space-10` | `2.5rem` (40px) |
| `--space-12` | `3rem` (48px) |
| `--space-16` | `4rem` (64px) |
| `--space-section` | `clamp(2.5rem, 6vw, 4rem)` | Section vertical padding |

### Layout Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--layout-gap` | `12px` | Gap between glass panels |
| `--layout-padding` | `12px` | Page edge padding |
| `--content-max` | `680px` | Max width for readable content |
| `--wide-max` | `920px` | Max width for wider layouts |

## 5. Radii & Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Buttons, badges, small elements |
| `--radius` | `10px` | Cards, panels, images |
| `--radius-lg` | `16px` | Large panels, modals |
| `--radius-full` | `9999px` | Pills, circular elements |

## 6. Shadows & Depth

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-panel` | `0 1px 0 var(--color-border)` | Subtle panel edge |
| `--shadow-elevated` | `0 4px 24px rgba(0, 0, 0, 0.4)` | Floating panels, overlays |
| `--shadow-glow` | `0 0 20px var(--color-accent-glow)` | Accent glow on focus/active |
| `--shadow-star` | `0 0 6px rgba(230, 237, 243, 0.5)` | Star bloom effect |

## 7. Motion

### Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Elements entering view — fast start, gentle land |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric transitions — hover, toggle |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot — magnetic cursor, bounce |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | General-purpose smooth |

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `100ms` | Hover color changes, cursor feedback |
| `--duration-fast` | `200ms` | Button state changes, small transitions |
| `--duration-normal` | `350ms` | Panel transitions, card reveals |
| `--duration-slow` | `600ms` | Section reveals, page transitions |
| `--duration-dramatic` | `1000ms` | Hero entrance, constellation reveal |

### GSAP Animation Patterns

| Pattern | Description | Trigger |
|---------|-------------|---------|
| **Staggered reveal** | Elements enter one-by-one with offset delays | ScrollTrigger enter viewport |
| **Text split** | Headlines animate word-by-word or char-by-char | ScrollTrigger or page load |
| **Magnetic cursor** | Elements subtly pull toward mouse position | Mouse proximity (desktop only) |
| **Parallax depth** | Layers move at different speeds on scroll | ScrollTrigger scrub |
| **Panel float** | Glass panels have subtle y-axis oscillation | Continuous, subtle |
| **Node pulse** | Constellation nodes glow on hover/focus | Mouse enter/focus |
| **Route morph** | Page transitions where elements reshape between routes | SvelteKit navigation |

### Reduced Motion
When `prefers-reduced-motion: reduce`:
- All GSAP timelines skip to end state
- Threlte constellation renders static (no drift, no pulse)
- CSS transitions set to `0ms`
- Content remains fully accessible and visible

## 8. Component Patterns

### Glass Panel
The primary container for all content. Floats over the constellation.
```
Background: var(--glass-bg)
Backdrop-filter: blur(var(--glass-blur))
Border: 1px solid var(--glass-border)
Border-radius: var(--radius)
Shadow: var(--shadow-panel)
Hover: border-color -> var(--glass-border-hover), bg -> var(--glass-bg-hover)
```

### Card
Content card within a panel. Slightly more opaque than the panel.
```
Background: var(--glass-bg)
Border: 1px solid var(--glass-border)
Border-radius: var(--radius)
Padding: var(--space-5) var(--space-5)
Hover: subtle lift (transform: translateY(-2px)), border brightens
```

### Badge
Status indicators — small, quiet, informational.
```
Padding: 0.15rem 0.5rem
Font: var(--text-xs), weight 600, uppercase, letter-spacing 0.05em
Border-radius: 4px
Variants:
  .badge-live: bg rgba(63, 185, 80, 0.15), color var(--color-success)
  .badge-wip: bg rgba(210, 153, 34, 0.15), color var(--color-wip)
  .badge-new: bg var(--color-accent-subtle), color var(--color-accent)
```

### Button
Compact, text-forward. Never loud.
```
Primary (.btn):
  Border: 1px solid var(--color-accent)
  Color: var(--color-accent)
  Background: transparent
  Hover: bg var(--color-accent-subtle), glow shadow

Ghost (.btn-ghost):
  Border: 1px solid var(--color-border)
  Color: var(--color-text-muted)
  Hover: border brightens, color -> var(--color-text)
```

### Team Node (Constellation)
Interactive point in the 3D star field representing a team member.
```
3D: Sphere or point light in Threlte scene
Default: var(--color-star), subtle glow
Hover: scale up, color -> var(--color-accent), glow intensifies
Connected: faint lines to related nodes (same product team)
Label: nickname appears on hover, minimal, floating
```

### Product System (Constellation)
Navigable region in the star field representing a product.
```
3D: Cluster of stars / nebula-like region with product color tint
Default: subtle ambient glow
Hover: region brightens, product name appears
Click: camera moves toward region, UI panel slides in with product details
```

## 9. Responsive Strategy

### Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| Mobile | < 640px | Single column, stacked panels, bottom nav |
| Tablet | 640px – 959px | Two-column where appropriate, compact constellation |
| Desktop | 960px+ | Full 3-column grid, full constellation, all effects |

### Mobile Adaptations
- **3D constellation:** Simplified — fewer stars, no camera drift, 2D fallback acceptable
- **Glass panels:** Full-width, stacked, swipe or tab navigation
- **GSAP effects:** Reduced — no magnetic cursor (no hover on touch), simpler scroll reveals
- **Navigation:** Bottom bar with micro-animations, not spatial
- **Team nodes:** Fall back to a compact grid with hover-glow effect
- **Typography:** Scale down display sizes, maintain readability

### Desktop Enhancements
- Full 3D constellation with camera drift and parallax
- Magnetic cursor effects
- Multi-column glass panel layout with depth
- Hover-driven interactions everywhere
- Spatial navigation through the star field

## 10. Accessibility

- **Color contrast:** All text meets WCAG AA (4.5:1 for body, 3:1 for large text) against dark backgrounds
- **Focus indicators:** `outline: 2px solid var(--color-accent-glow)` with `outline-offset: 2px`
- **Reduced motion:** Full support — all animation layers respect the preference
- **Keyboard navigation:** All interactive elements focusable and operable via keyboard
- **Screen readers:** 3D constellation has `aria-hidden="true"` — all content is in the HTML layer
- **Skip links:** "Skip to content" link for keyboard users to bypass the constellation
- **Alt text:** All meaningful images have descriptive alt text
