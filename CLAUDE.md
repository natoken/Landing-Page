# natoken-company-site

## Genesis System
This project uses Project Genesis for structured development.
- **Mode:** Brownfield
- **Current Phase:** Constitution established

## Before Every Interaction
1. Read `.genesis/project-state.md` for current state
2. Read `.genesis/constitution.md` for project principles and constraints
3. Read relevant design docs in `.genesis/design/` for context

## Constitution
The constitution at `.genesis/constitution.md` is LAW.
Every specification, plan, task, and line of code must comply.
The technology stack declared in the constitution is non-negotiable.

## Commands
Type `/genesis:help` for a complete guide to all commands.

| Command | Purpose |
|---------|---------|
| `/genesis:init` | Initialize Genesis (already done) |
| `/genesis:discover` | Gather project information and context |
| `/genesis:constitute` | Create the project constitution |
| `/genesis:design {type} {name}` | Create or update design documentation |
| `/genesis:specify {feature}` | Write a feature specification |
| `/genesis:clarify {feature}` | Resolve ambiguities in a spec |
| `/genesis:plan {feature}` | Create technical implementation plan |
| `/genesis:tasks {feature}` | Break plan into executable tasks |
| `/genesis:implement {feature}` | Execute tasks and build |
| `/genesis:review {feature}` | Validate work against spec & constitution |
| `/genesis:analyze {feature}` | Pre-implementation artifact consistency check |
| `/genesis:checklist {feature}` | Quality validation checklists for requirements |
| `/genesis:issues {feature}` | Create GitHub Issues from tasks |
| `/genesis:status` | Show current project state |
| `/genesis:phase {name}` | Create or run a custom phase |
| `/genesis:resume` | Resume work from where you left off |
| `/genesis:diff {artifact}` | Show downstream impact of changes |
| `/genesis:amend {section}` | Formally amend the constitution |
| `/genesis:archive {feature}` | Archive a completed or abandoned feature |
| `/genesis:rollback {artifact}` | Revert an artifact to a previous version |
| `/genesis:reverse-specify {feature}` | Generate retroactive spec from code |
| `/genesis:migrate` | Migrate existing docs into Genesis |
| `/genesis:metrics` | Quantitative project health dashboard |
| `/genesis:help` | Detailed guide to all commands |

## Project Conventions

### Tech Stack
- **Svelte 5** (Runes) + **SvelteKit 2** + **Vite 6** — non-negotiable
- **GSAP** — all UI animation (scroll, hover, transitions, cursor effects)
- **Threlte** (Three.js for Svelte) — 3D constellation backdrop
- **mdsvex** — blog posts as `.svx` files
- **Vanilla CSS** with design tokens — no CSS frameworks
- **Static adapter** — prerendered, deployed to Cloudflare Pages at `natoken.dev`

### Brand
- Accent: `#ed0049` | Dark theme: `#0d1117` family
- Design language: "Constellation Terminal" — sci-fi command deck, glass panels in 3D star field

### Code Style
- Components: `PascalCase.svelte` | Modules: `camelCase.js`
- CSS tokens: `--color-*`, `--text-*`, `--font-*`, `--radius-*`
- Imports: Svelte > Third-party > Components > Data > Stores > Actions
- JSDoc `@type` on data exports, minimal comments elsewhere
- No new dependencies without constitutional amendment

### Quality Gates
- `npm run build` must pass with zero errors/warnings
- Cross-browser (Chrome, Firefox, Safari), mobile 375px+
- All animations respect `prefers-reduced-motion`
- Design tokens only — no hardcoded colors/sizes

## Git Strategy
- **Branches:** `feature/*`, `fix/*`, `chore/*` off `main`
- **Commits:** `type(scope): description` (feat, fix, style, refactor, chore, docs, genesis)
- **Merge:** Squash merge to `main`
- **Deploy:** Auto on push to `main` via Cloudflare Pages
