# Architecture: natoken-company-site

**Created:** 2026-03-07
**Last Updated:** 2026-03-07
**Status:** Draft

---

## 1. Rendering Pipeline

The site has four rendering layers, composited bottom-to-top:

```
Layer 4: Transition Layer (Svelte)
  - Component enter/exit transitions
  - Route change animations
  - Coordinated with GSAP via callbacks

Layer 3: Interaction Layer (GSAP)
  - ScrollTrigger timelines
  - Magnetic cursor effects
  - Staggered reveals, text splits
  - Hover animations
  - Page transition orchestration

Layer 2: UI Layer (Svelte + CSS)
  - Glass panels, cards, content
  - Navigation elements
  - All semantic HTML and accessibility
  - Design token-driven styling

Layer 1: Atmosphere Layer (Threlte/Three.js)
  - 3D constellation star field
  - Team member nodes
  - Product region clusters
  - Ambient particle drift
  - Camera movement (slow drift, scroll-linked)
```

### Layer Communication
- **Threlte <-> GSAP:** GSAP can drive Three.js camera position via ScrollTrigger (scrubbed timeline controlling camera uniforms/positions exported from Threlte stores)
- **GSAP <-> Svelte:** GSAP targets DOM elements created by Svelte. Use `bind:this` to get element references, pass to GSAP in `$effect()` or `onMount()`.
- **Threlte <-> Svelte:** Threlte components are Svelte components — state flows naturally via props and stores.
- **All layers respect a shared `reducedMotion` store** that gates animation behavior globally.

## 2. Component Architecture

```
+layout.svelte (Root)
|
+-- ConstellationScene.svelte (Threlte Canvas — Layer 1)
|   |-- StarField.svelte (Procedural star particles)
|   |-- TeamConstellation.svelte (Team member nodes + connections)
|   |-- ProductRegions.svelte (Product cluster markers)
|   |-- CameraController.svelte (Drift, scroll-linked movement)
|   +-- WebGLFallback.svelte (2D gradient/particle fallback)
|
+-- SiteShell.svelte (UI container — Layer 2)
|   |-- Navigation.svelte (Spatial nav on desktop, bottom bar on mobile)
|   |-- PageTransition.svelte (Route transition wrapper — Layer 4)
|   +-- {route content}
|
+-- CursorEffect.svelte (Magnetic cursor — Layer 3, desktop only)
+-- ScrollEngine.svelte (GSAP ScrollTrigger init — Layer 3)
+-- ReducedMotionProvider.svelte (Motion preference detection)
```

### Route Components
```
routes/
  +page.svelte .............. Homepage (Command Deck)
  |-- HeroSection.svelte         Brand intro, animated entrance
  |-- TeamSection.svelte         Constellation node interactions
  |-- ProductsSection.svelte     Product system cards/previews
  |-- AboutSection.svelte        Company info, contact
  |
  products/
    [slug]/+page.svelte ..... Product deep dive
    |-- ProductHero.svelte       Product header, screenshot, status
    |-- ProductFeatures.svelte   Feature grid
    |-- ProductLinks.svelte      External links, Discord, etc.
  |
  hiring/+page.svelte ...... Careers page
  |-- RoleList.svelte            Role listings
  |-- RoleCard.svelte            Individual role card
  |
  blog/+page.svelte ........ Blog listing
  blog/[slug]/+page.svelte . Blog post (mdsvex rendered)
```

## 3. Threlte Scene Architecture

### Scene Graph
```
<Canvas>
  <T.PerspectiveCamera />        — Main camera, controlled by CameraController
  <T.AmbientLight />             — Subtle ambient, very low intensity
  |
  <StarField>                    — Instanced mesh, 500-2000 star points
  |  Uses InstancedMesh for performance
  |  Each star: position (random sphere), size (varied), opacity (varied)
  |  Subtle twinkle via shader uniform animation
  |
  <TeamConstellation>            — Interactive node group
  |  For each team member:
  |    <NodeSphere>              — Small glowing sphere at assigned position
  |    <NodeLabel>               — HTML overlay label (nickname) via <HTML> from @threlte/extras
  |    <ConnectionLine>          — Thin line geometry connecting team members on same product
  |  Hover detection via raycasting (onpointerenter/leave)
  |
  <ProductRegions>               — Volumetric markers for each product
  |  For each product:
  |    <RegionCloud>             — Cluster of faint particles forming a nebula shape
  |    <RegionLabel>             — Product name HTML overlay
  |  Click triggers navigation to /products/{slug}
  |
  <CameraController>
     Default: slow orbital drift (autoRotate-like)
     Scroll: camera z-position linked to scroll progress
     Navigation: smooth tween to product regions on click
     Mobile: static or minimal drift
</Canvas>
```

### Performance Strategy
- **InstancedMesh** for stars (single draw call for hundreds of points)
- **LOD (Level of Detail):** Reduce star count on mobile / low-end devices
- **Lazy initialization:** Threlte canvas mounts after initial HTML content is painted (no blocking FCP)
- **Offscreen detection:** Pause rendering when tab is hidden (`document.visibilityState`)
- **Shader-based animation:** Star twinkle via vertex shader, not JS updates per frame

### WebGL Fallback
When WebGL is unavailable (`!window.WebGLRenderingContext` or context creation fails):
- Replace `ConstellationScene` with `FallbackBackground.svelte`
- Fallback renders: CSS radial gradients + subtle CSS-animated dots
- Still looks premium, just not 3D
- Detected once on mount, stored in a `webglAvailable` store

## 4. GSAP Integration Architecture

### Initialization
```
ScrollEngine.svelte (mounted in +layout.svelte)
  - Registers GSAP plugins: ScrollTrigger, SplitText (if used)
  - Sets global GSAP defaults (duration, ease)
  - Listens to reducedMotion store — if true, kills all timelines

CursorEffect.svelte (mounted in +layout.svelte, desktop only)
  - Tracks mouse position via pointermove
  - Elements with data-magnetic attribute get attracted
  - Uses GSAP.to() for smooth interpolation
```

### Per-Component Pattern
Components that need GSAP animations follow this pattern:
```svelte
<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { reducedMotion } from '$lib/stores/motion.js';

  let container = $state();

  $effect(() => {
    if ($reducedMotion || !container) return;

    const ctx = gsap.context(() => {
      gsap.from('.reveal-item', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%'
        }
      });
    }, container);

    return () => ctx.revert();
  });
</script>

<div bind:this={container}>
  <div class="reveal-item">...</div>
</div>
```

Key rules:
- Always use `gsap.context()` scoped to the component's root element
- Always clean up with `ctx.revert()` in the `$effect` cleanup
- Always check `$reducedMotion` before creating timelines
- Never animate layout-triggering properties (width, height, top, left) — use `transform` and `opacity`

### Page Transitions
Route changes are orchestrated by `PageTransition.svelte`:
1. Navigation triggered (link click or programmatic)
2. GSAP timeline animates current page out (opacity, transform)
3. On complete: SvelteKit performs the navigation
4. New page content mounts
5. GSAP timeline animates new page in (staggered reveal)

This is coordinated via SvelteKit's `onNavigate` lifecycle and a shared transition store.

## 5. Data Flow

```
src/lib/data/ (Static modules)
  |
  products.js -----> ProductsSection, ProductCards, Product pages
  team.js ---------> TeamSection, TeamConstellation (3D nodes)
  announcements.js > AnnouncementBar (if active)
  jobs.js ---------> RoleList, RoleCard (hiring page)
  blog metadata ---> Blog listing (from mdsvex frontmatter)

src/lib/stores/ (Reactive state)
  |
  motion.js -------> reducedMotion (boolean), detected from media query
  navigation.js ---> activeRoute, transitioning (boolean)
  constellation.js > hoveredNode, selectedProduct, cameraTarget
  ui.js -----------> mobilePanel, drawerOpen, etc.
```

### Data Flow Rules
- Data modules are **read-only imports** — no mutations
- Stores are the **single source of truth** for UI state
- Threlte scene reads from stores (constellation.js) to position nodes and respond to interactions
- GSAP reads from stores (motion.js) to gate animations
- Components never reach into other components' state — everything flows through stores

## 6. Build & Deploy Pipeline

```
Source (GitHub main branch)
  |
  v
GitHub Actions (genesis-ci.yml) — on PR
  - Validate commit messages
  - Check dependencies
  - Build (vite build)
  - Bundle size check
  |
  v
Cloudflare Pages — on push to main
  - npm ci
  - npm run build (vite build, adapter-static)
  - Deploy to natoken.dev
  - Security headers via static/_headers
  |
  v
Cloudflare CDN (global edge)
  - Cached static assets
  - Brotli compression
  - HTTP/3
  - Security headers (CSP, HSTS, X-Frame-Options)
```

### SvelteKit Config (Target)
```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [vitePreprocess(), mdsvex()],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    // No base path — deploying to root of natoken.dev
    prerender: {
      entries: ['*']
    }
  }
};
```

## 7. Performance Architecture

### Critical Rendering Path
1. **HTML shell** — `app.html` with inlined critical CSS (design tokens, base layout)
2. **Font preconnect** — Google Fonts loaded with `display: swap`
3. **Above-the-fold content** — Hero text and brand rendered by Svelte SSR (prerendered)
4. **3D scene** — Threlte canvas mounts async, after FCP
5. **GSAP** — Animations initialize after DOM is interactive
6. **Below-the-fold** — Content lazy-revealed via ScrollTrigger

### Code Splitting
- Threlte + Three.js are dynamically imported (`import('...')`) — not in the initial bundle
- Product pages are route-level code split (automatic via SvelteKit)
- Blog posts are individually split (one chunk per `.svx` file)
- GSAP loaded eagerly (small, needed immediately for hero animations)

### Asset Strategy
- **Images:** WebP, appropriately sized per breakpoint, lazy-loaded with `loading="lazy"`
- **3D assets:** No external model files — geometry is procedural (stars = points, nodes = spheres)
- **Fonts:** Preconnected, `display: swap`, subset if possible

## 8. Security Architecture

### Headers (static/_headers)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'
```

### Considerations
- No user input = minimal attack surface
- CSP allows inline styles/scripts (required by Svelte's SSR output)
- No external scripts beyond Google Fonts
- No analytics, tracking, or third-party embeds
