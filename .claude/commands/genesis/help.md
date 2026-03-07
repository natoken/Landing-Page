---
description: Complete guide to all Genesis commands
---

# Project Genesis — Command Reference

## What is Genesis?

Genesis is a spec-driven project scaffolding and management system for Claude Code. It guides you through a structured, phased workflow that produces living markdown artifacts — from project discovery through design, specification, planning, implementation, and review.

Genesis supports three modes:
- **Greenfield** — New projects from scratch
- **Brownfield** — Existing projects needing structure
- **Lowfield** — Infinite-lifecycle projects (documentation, creative writing, research)

## Getting Started

Follow these phases in order:

### Phase 0: Initialize
**`/genesis:init`**
Sets up the Genesis directory structure, determines your project mode, installs all commands, and creates CLAUDE.md. This is always the first step.

### Phase 1: Discover
**`/genesis:discover`**
Guided conversation to gather everything about your project. Adapts to your mode:
- **Greenfield:** Vision, goals, scope, technology preferences, quality expectations
- **Brownfield:** Automated codebase scan + gap analysis + human context about pain points and priorities
- **Lowfield:** Domain understanding, content types, organizational structure, recurring workflows

### Phase 2: Constitute
**`/genesis:constitute`**
Creates the project constitution — your immutable principles, technology stack, coding standards, and quality gates. **This is LAW.** Everything else must comply. The tech stack declared here is non-negotiable.

### Phase 3: Design
**`/genesis:design [type] [name]`**
Creates design documentation — the project's permanent reference ("bible"). Can be invoked at any time.

| Usage | Creates |
|-------|---------|
| `/genesis:design overview` | System/project overview and vision |
| `/genesis:design feature {name}` | Detailed feature design |
| `/genesis:design journey {name}` | User experience flow map |
| `/genesis:design architecture` | Technical architecture |
| `/genesis:design data-model` | Data model specification |
| `/genesis:design api-contracts` | API/interface contracts |
| `/genesis:design integrations` | External integration specs |
| `/genesis:design system {name}` | Subsystem deep-dive |
| `/genesis:design glossary` | Project terminology and definitions |
| `/genesis:design decision {name}` | Architecture Decision Record (ADR) |
| `/genesis:design content-map` | Content inventory and relationships (lowfield) |

### Phase 4: Specify
**`/genesis:specify [feature-name]`**
Writes a feature specification: WHAT to build and WHY. Contains zero implementation details. Creates a Git feature branch.

### Phase 4.5: Clarify (Optional but Recommended)
**`/genesis:clarify [feature-name]`**
Resolves ambiguities, missing edge cases, and unstated assumptions in a spec before planning. Saves expensive rework later.

### Phase 5: Plan
**`/genesis:plan [feature-name]`**
Creates the technical implementation plan: HOW to build it. All decisions constrained by the constitution. Identifies research items and resolves unknowns.

### Phase 6: Tasks
**`/genesis:tasks [feature-name]`**
Breaks the plan into ordered, dependency-mapped work units with clear acceptance criteria, file paths, and commit messages.

### Phase 7: Implement
**`/genesis:implement [feature-name]`**
Executes tasks in dependency order, producing working code with Git commits per task. Pauses for review at logical milestones.

### Phase 8: Review
**`/genesis:review [feature-name]`**
Validates completed work against every acceptance criterion, constitutional section, and design document. Creates fix tasks if issues are found. Merges the feature branch when complete.

## Quality & Analysis Commands

| Command | Purpose |
|---------|---------|
| `/genesis:analyze [feature]` | Pre-implementation cross-artifact consistency analysis (6 dimensions) |
| `/genesis:analyze --coverage` | Spec coverage matrix across all features |
| `/genesis:analyze --drift` | Constitutional drift detection in completed implementations |
| `/genesis:analyze --deps` | Cross-feature dependency mapping and visualization |
| `/genesis:checklist [feature] [domain]` | Generate quality validation checklists for requirements |
| `/genesis:issues [feature]` | Create GitHub Issues from task breakdown |
| `/genesis:metrics` | Quantitative project health dashboard (pipeline, tasks, velocity) |

Domains for checklist: `general`, `ux`, `api`, `security`, `performance`, `data`

## Artifact Management Commands

| Command | Purpose |
|---------|---------|
| `/genesis:amend [section]` | Formally amend the constitution with impact analysis and tier-based review |
| `/genesis:archive [feature]` | Archive a completed or abandoned feature to `.genesis/archive/` |
| `/genesis:rollback [artifact-path]` | Revert an artifact to a previous version using git history |
| `/genesis:reverse-specify [feature]` | Generate a retroactive spec from existing code (brownfield) |
| `/genesis:migrate` | Migrate existing project documentation into Genesis structure |

## Utility Commands

| Command | Purpose |
|---------|---------|
| `/genesis:status` | Show current project state, progress, and blockers |
| `/genesis:resume` | Resume work from where you left off (session recovery) |
| `/genesis:diff [artifact-path]` | Show downstream impact before modifying an artifact |
| `/genesis:phase create {name}` | Create a custom workflow phase |
| `/genesis:phase run {name}` | Execute a custom phase |
| `/genesis:phase list` | List all custom phases |
| `/genesis:help` | This guide |

## Project Commands

After lowfield setup (or manual creation), project-specific commands are available as `/project:{command}`. These live in `.claude/commands/project/` and are tailored to your project's constitution and workflow.

## Key Concepts

- **Constitution:** Immutable project principles. Everything must comply. Amended only with explicit rationale and approval.
- **Design Docs:** The project's permanent reference. Evolves over time. Not feature-scoped.
- **Specs:** Feature-scoped. Define WHAT and WHY. Zero implementation details.
- **Plans:** Feature-scoped. Define HOW. Constrained by constitution.
- **Tasks:** Executable work units with dependencies, acceptance criteria, and commit messages.

## File Locations

| What | Where |
|------|-------|
| Entry point | `CLAUDE.md` |
| Constitution | `.genesis/constitution.md` |
| Project state | `.genesis/project-state.md` |
| Discovery | `.genesis/discovery/context.md` |
| Design docs | `.genesis/design/` |
| Specifications | `.genesis/specs/{feature}/spec.md` |
| Plans | `.genesis/plans/{feature}/plan.md` |
| Tasks | `.genesis/tasks/{feature}/tasks.md` |
| Custom phases | `.genesis/phases/` |
| Templates | `.genesis/templates/` |
| Genesis commands | `.claude/commands/genesis/` |
| Project commands | `.claude/commands/project/` |
| Extensions | `.genesis/extensions/` |
| Archive | `.genesis/archive/` |
| Git hooks | `.genesis/hooks/` |

## Extensions

Genesis supports an extension system for adding custom behavior at hook points in the workflow. Extensions live in `.genesis/extensions/` and define their hooks in `extension.md` manifests.

Available hook points: `before_discover`, `after_discover`, `before_constitute`, `after_constitute`, `before_design`, `after_design`, `before_specify`, `after_specify`, `before_clarify`, `after_clarify`, `before_plan`, `after_plan`, `before_tasks`, `after_tasks`, `before_implement`, `after_implement`, `before_review`, `after_review`, `before_analyze`, `after_analyze`, `before_amend`, `after_amend`, `before_archive`, `after_archive`, `before_rollback`, `after_rollback`, `before_migrate`, `after_migrate`, `before_issues`, `after_issues`, `before_task`, `after_task`.

## Artifact Status Gating

Genesis enforces artifact approval before downstream phases can proceed:
- **Spec must be Approved** before `/genesis:plan` can run
- **Plan must be Approved** before `/genesis:tasks` can run
- **Both spec and plan must be Approved** before `/genesis:implement` can run

Artifacts are set to Approved automatically when the user approves them during the specify/plan workflow. This prevents building on unreviewed foundations.

## Artifact Versioning

All specs and plans include a `**Version:**` field and a Changelog section. When revising an existing artifact, the version is incremented and the change is logged. This provides a clear audit trail of how decisions evolved.

To create an extension, make a directory in `.genesis/extensions/{name}/` with an `extension.md` file defining which hooks to activate on and what instructions to execute.

## CLI Tools

| Command | Purpose |
|---------|---------|
| `npx @natoken/genesis-init` | Initialize Genesis in a project |
| `npx @natoken/genesis-update` | Update templates and commands (preserves artifacts) |
| `npx @natoken/genesis-validate` | Health check: validates directories, templates, state integrity |

## Git Hooks & CI Integration

During `/genesis:constitute`, Genesis can optionally generate:
- **Git hooks** (`.genesis/hooks/`) — Enforce commit message format and constitutional tech stack compliance
- **GitHub Actions workflow** (`.github/workflows/genesis-ci.yml`) — Validate constitutional compliance on PRs

Activate git hooks with: `git config core.hooksPath .genesis/hooks`
