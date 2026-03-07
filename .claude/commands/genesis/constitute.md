---
description: Create or update the project constitution
---

# Genesis Constitution

## Pre-flight

Read these files:
- `.genesis/discovery/context.md` (REQUIRED — refuse if missing: "Discovery not found. Run `/genesis:discover` first.")
- `.genesis/project-state.md`
- `.genesis/templates/constitution-template.md`

If `.genesis/constitution.md` already exists, ask: "A constitution already exists. Would you like to create a new one (replacing the current) or amend specific sections?"

## Process

1. **Read the discovery context** to understand the project thoroughly.

2. **Create `.genesis/constitution.md`** using the template as a starting structure.

3. **For Greenfield/Brownfield, populate these sections:**
   - **Project Mission** — One paragraph defining what this project exists to do
   - **Technology Stack** — EXPLICIT declaration of every language, framework, database, infrastructure component, key library with versions. This is LAW.
   - **Architecture Principles** — Modularity, dependency direction, state management, API patterns, error handling
   - **Code Standards** — Naming conventions, file structure, import organization, documentation requirements
   - **Testing Philosophy** — Coverage levels, approach (TDD/BDD/etc.), what must be tested
   - **Quality Gates** — What must be true before code is complete (linting, types, tests, review)
   - **Security & Compliance** — Auth patterns, data handling, secrets management, regulatory constraints
   - **Performance Expectations** — Response times, bundle size, resource constraints, scaling approach
   - **Documentation Requirements** — What, where, minimum quality
   - **Version Control Strategy** — Branching model, commit format, merge strategy, release process
   - **Amendment Process** — How to change the constitution (requires rationale, impact assessment, user approval)

4. **For Brownfield, add:**
   - **Legacy Handling** section — For each area of existing code that doesn't meet the constitution, specify: Immediate refactor, Progressive migration (with deadline), or Grandfather clause (with optional sunset)

5. **For Lowfield, adapt sections:**
   - "Technology Stack" → "Tools & Formats" (Markdown, apps, file formats, export targets)
   - "Architecture Principles" → "Organizational Principles" (hierarchy, naming, categorization, cross-referencing)
   - "Code Standards" → "Content Standards" (voice, tone, style guide, formatting rules, terminology)
   - "Testing Philosophy" → "Quality Standards" (accuracy, completeness, consistency, review process)
   - "Quality Gates" → "Completion Criteria" (what makes content "done")

6. **Present the complete constitution for user review.**
   Say: "This is your project's constitution. It governs everything built from here forward. Please review each section carefully. What would you like to change?"

7. **Iterate until the user explicitly approves.**

8. **Update `CLAUDE.md`** with project conventions extracted from the constitution:
   - Add project conventions section
   - Add Git strategy section
   - Update any placeholder content

9. **Update `.genesis/project-state.md`:**
   - Current Phase: "Constitution established"
   - Log key decisions from the constitution in the Key Decisions table

10. **Offer to generate git hooks:**
    Ask: "Would you like Genesis to generate git hooks that enforce constitutional standards? This includes:
    - **commit-msg hook:** Validates commit messages match your Version Control Strategy format
    - **pre-commit hook:** Checks for unconstitutional dependencies"

    If yes, create `.genesis/hooks/commit-msg` and `.genesis/hooks/pre-commit` based on the constitution:
    - Commit message hook validates the format declared in Section 10 (e.g., Conventional Commits)
    - Pre-commit hook checks package manifests for dependencies not in Section 2 (Tech Stack)
    - Tell the user: "Hooks created in `.genesis/hooks/`. To activate: `git config core.hooksPath .genesis/hooks`"

11. **Offer to generate GitHub Actions workflow:**
    Ask: "Would you like a GitHub Actions CI workflow that validates constitutional compliance on PRs?"

    If yes, create `.github/workflows/genesis-ci.yml`:
    - Validates commit message format per constitution
    - Checks for unconstitutional dependencies
    - Runs linting/formatting per constitutional standards (if tools declared)
    - Runs tests per constitutional testing philosophy (if test command declared)
    - Checks test coverage against constitutional minimum (if threshold declared)

12. **Git commit:** `genesis: establish project constitution`

## Amending an Existing Constitution

When the user requests an amendment (from this command or triggered by `/genesis:plan`, `/genesis:implement`, or `/genesis:review`):

1. Identify the specific section and current text to be changed.
2. Ask the user for the rationale.
3. Assess impact: what existing specs, plans, or tasks would be affected?
4. Present the proposed change, rationale, and impact for user approval.
5. If approved:
   a. Update the section in `.genesis/constitution.md`
   b. Add a row to the Amendment Log table in the constitution
   c. Add a row to the Constitutional Amendments table in `.genesis/project-state.md` with the amendment, rationale, and date
   d. If the Key Decisions table is relevant, add an entry there too
6. Git commit: `genesis: amend constitution — {brief description}`

## Critical Rules

- Every technology choice must come from the discovery context. Do not invent preferences the user didn't express.
- If the discovery context is ambiguous about a technology choice, ASK. Do not assume.
- The constitution must be specific enough to be enforceable. "Use good practices" is not a constitutional principle. "All functions must have JSDoc comments" is.
- The amendment process must always be included — the constitution is immutable by default but not unchangeable.

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_constitute` hooks and execute their instructions.
After completing: check for extensions with `after_constitute` hooks and execute their instructions.

## Next Step

Suggest: "Run `/genesis:design overview` to create the design overview, then `/genesis:design architecture` for architecture documentation."
