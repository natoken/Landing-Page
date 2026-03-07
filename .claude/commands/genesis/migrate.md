---
description: Migrate an existing project into Genesis structure
---

# Genesis Migrate

Convert an existing project with partial documentation into full Genesis structure. This goes beyond brownfield init — it maps existing artifacts to Genesis conventions.

## Pre-flight

Read these files (if they exist):
- `.genesis/project-state.md`
- `README.md`
- `CLAUDE.md`
- `CONTRIBUTING.md`
- `docs/` or `documentation/` directories
- Any existing spec, design, or architecture documents

## Process

### 1. Scan for Existing Documentation

Search the project for documentation artifacts:

| Pattern | Maps To |
|---------|---------|
| `README.md`, `docs/overview.*` | `.genesis/design/overview.md` |
| `ARCHITECTURE.md`, `docs/architecture.*` | `.genesis/design/technical/architecture.md` |
| `docs/api.*`, `API.md` | `.genesis/design/technical/api-contracts.md` |
| `docs/data-model.*`, `SCHEMA.md` | `.genesis/design/technical/data-model.md` |
| `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` | `.genesis/constitution.md` (partial) |
| `*.spec.md`, `specs/`, `requirements/` | `.genesis/specs/` |
| `ADR/`, `decisions/`, `docs/decisions/` | Constitution amendment log |
| `CHANGELOG.md` | Feature completion history |
| `TODO.md`, `ROADMAP.md` | Feature backlog candidates |

### 2. Present Migration Plan

Display what was found and how it maps:

```
Migration Plan:
  Found: README.md → Will inform design/overview.md
  Found: docs/architecture.md → Will migrate to design/technical/architecture.md
  Found: CONTRIBUTING.md → Will inform constitution sections 4, 9, 10
  Found: specs/auth.md → Will migrate to specs/auth/spec.md (needs reformatting)
  Not Found: Constitution (will need to create via /genesis:constitute)
  Not Found: Discovery context (will need to run /genesis:discover)
```

### 3. User Approval

Ask: "Proceed with migration? Existing files will NOT be deleted — Genesis artifacts will be created alongside them."

### 4. Initialize Genesis

If Genesis is not already initialized:
- Run the standard init process (directories, templates, commands)
- Set mode to Brownfield

### 5. Migrate Artifacts

For each found document:
1. Read the existing content
2. Create the Genesis equivalent using the appropriate template
3. Adapt content to fit the template structure
4. Mark migrated sections with: `<!-- Migrated from: {original-path} on {date} -->`
5. Flag content that doesn't fit neatly: "The following content from {path} does not map to any Genesis template section: {content summary}"

### 6. Generate Gap Report

```
Migration Complete:
  Migrated: {count} artifacts
  Gaps Identified:
    - No constitution exists — run /genesis:constitute
    - No discovery context — run /genesis:discover
    - Existing specs lack acceptance criteria — consider /genesis:clarify for each
    - No test strategy documented

  Recommended Next Steps:
    1. /genesis:discover (capture what existing docs don't cover)
    2. /genesis:constitute (formalize standards from CONTRIBUTING.md)
    3. Review migrated design docs for completeness
```

### 7. Update Project State

- Phase: "Migrated — Discovery Recommended"
- Session log entry with migration summary

### 8. Git Commit

`genesis: migrate existing documentation into Genesis structure`

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_migrate` hooks and execute their instructions.
After completing: check for extensions with `after_migrate` hooks and execute their instructions.
