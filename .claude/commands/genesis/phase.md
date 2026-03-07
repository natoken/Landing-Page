---
description: Create, list, or run custom phases
argument-hint: "[create|run|list] [phase-name]"
---

# Genesis Custom Phases

## Argument Parsing

Parse $ARGUMENTS:
- `create {name}` → Create a new custom phase
- `run {name}` → Execute a custom phase
- `run {name} {feature}` → Execute against a specific feature
- `list` → List all custom phases
- _(empty)_ → Show options: "Would you like to create, run, or list custom phases?"

## Creating a Phase (`create {name}`)

1. Check if `.genesis/phases/{name}.md` already exists.

2. Create the file using `.genesis/templates/custom-phase-template.md` as structure.

3. Guide the user through defining:
   - **Description:** What does this phase do? What value does it provide?
   - **When to Run:** After which standard phase? On a schedule? On demand?
   - **Prerequisites:** What must be true before running?
   - **Inputs:** What artifacts or files does this phase read?
   - **Process:** Step-by-step instructions (written as instructions to Claude Code)
   - **Output:** What artifacts does this phase produce?
   - **Gate:** What must be true for completion?

4. Add the phase to the Custom Phases table in `project-state.md`.

5. Git commit: `genesis: create custom phase '{name}'`

6. Inform the user: "Custom phase '{name}' created. Run it with /genesis:phase run {name}"

## Running a Phase (`run {name}` or `run {name} {feature}`)

1. Read `.genesis/phases/{name}.md`. If it doesn't exist: "Custom phase '{name}' not found. Use /genesis:phase list to see available phases, or /genesis:phase create {name} to create one."

2. Verify prerequisites defined in the phase.

3. Read all input artifacts defined in the phase.

4. Follow the process steps defined in the phase file.

5. Produce the output artifacts defined in the phase.

6. Verify the gate conditions.

7. Update project-state.md:
   - Custom Phases table: update Last Run date
   - Session log entry

8. Git commit if the phase produced file changes: `genesis: run custom phase '{name}'`

## Listing Phases (`list`)

1. Scan `.genesis/phases/` for all `.md` files.

2. Display a formatted list:
   ```
   Custom Phases:
   - {name}: {description} (Last run: {date or "Never"})
   - {name}: {description} (Last run: {date or "Never"})
   ```

3. If no phases exist: "No custom phases defined. Create one with /genesis:phase create {name}"

## Suggesting Phases

When Genesis identifies a project-specific need during any workflow step, it may suggest:
"Based on your project's {characteristic}, I recommend creating a custom phase for {purpose}. Would you like me to set that up?"

Common suggestions:
- **Security Audit** — For projects with auth, payments, or user data
- **Accessibility Check** — For web applications
- **Performance Benchmark** — For projects with explicit performance targets
- **Content Review** — For lowfield projects
- **Dependency Audit** — For projects with many dependencies
- **Lore Consistency Check** — For novel/worldbuilding lowfield projects
