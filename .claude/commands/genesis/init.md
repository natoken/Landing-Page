---
description: Initialize Project Genesis scaffolding and determine project mode
---

# Genesis Initialization

## Process

1. **Check for existing Genesis installation:**
   - If `.genesis/` already exists, inform the user:
     "Genesis is already initialized in this project. Would you like to reinitialize (this will overwrite Genesis system files but preserve your project artifacts) or run an update instead?"
   - If reinitializing, preserve: constitution.md, project-state.md, discovery/, design/, specs/, plans/, tasks/, phases/
   - If updating, suggest `npx genesis-update`

2. **Scan the current directory:**
   - If empty (no files except .git): suggest **Greenfield** mode
   - If files exist: suggest **Brownfield** mode
   - Present all three options and let the user confirm:
     - **Greenfield** — New project from scratch
     - **Brownfield** — Existing project needing structure
     - **Lowfield** — Infinite-lifecycle project (docs, creative writing, research)

3. **Check for monorepo indicators:**
   - Look for: `packages/`, `libs/`, `apps/` directories
   - Look for: `pnpm-workspace.yaml`, `lerna.json`, `turbo.json`, `nx.json`
   - Look for: root `package.json` with `workspaces` field
   - If detected, note monorepo structure for directory setup

4. **Ask for project name** if not detectable from existing files (package.json, Cargo.toml, etc.)

5. **Create directory structure:**
   ```
   .genesis/
   ├── discovery/
   ├── design/
   │   ├── features/
   │   ├── user-journeys/
   │   ├── technical/
   │   └── systems/
   ├── specs/
   ├── plans/
   ├── tasks/
   ├── phases/
   └── templates/
   ```
   For monorepo, also create:
   ```
   .genesis/design/
   ├── shared-systems/
   └── apps/
   ```

6. **Copy all template files** into `.genesis/templates/`:
   - constitution-template.md
   - discovery-greenfield.md, discovery-brownfield.md, discovery-lowfield.md
   - design-overview-template.md, feature-design-template.md
   - user-journey-template.md, technical-spec-template.md
   - system-design-template.md, spec-template.md
   - plan-template.md, tasks-template.md
   - custom-phase-template.md

7. **Create `.claude/commands/genesis/`** with all Genesis command files.

8. **Create `.claude/commands/project/`** (empty directory for future custom commands).

9. **Generate `CLAUDE.md`** with:
   - Project name and description
   - Mode (Greenfield/Brownfield/Lowfield)
   - Command reference table
   - Instructions to read constitution and project state at session start
   - Placeholder sections for project conventions and Git strategy

10. **Create `.genesis/project-state.md`** with:
    - Project name, mode, Genesis version
    - Current phase: "Initialized"
    - Empty sections for: Active Features (table: Feature, Phase, Progress, Branch, Started), Completed Features, Key Decisions, Constitutional Amendments, Custom Phases, Open Questions, Blockers
    - Session log entry: "Project Genesis initialized in {mode} mode"

11. **Git operations:**
    - If no Git repo exists: `git init`, create appropriate `.gitignore`
    - If Git repo exists (brownfield): detect branching model, note in state
    - Stage all Genesis files and commit: `genesis: initialize project scaffolding`

12. **Display welcome message:**
    ```
    Project Genesis initialized in {mode} mode.

    Your project is ready. Here's what to do next:

    1. Run /genesis:discover to gather project information
    2. Run /genesis:constitute to create your project constitution
    3. Run /genesis:design to create design documentation
    4. Run /genesis:help for a complete command reference

    All Genesis commands start with /genesis:
    ```

## Extension Hooks

After completing: check `.genesis/extensions/` for extensions with `after_init` hooks and execute their instructions.
