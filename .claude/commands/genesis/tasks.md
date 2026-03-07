---
description: Break an implementation plan into ordered, executable tasks
argument-hint: "[feature-name]"
---

# Genesis Task Decomposition

## Pre-flight

Read these files:
- `.genesis/plans/{feature-name}/plan.md` (REQUIRED — refuse if missing: "Plan not found. Run `/genesis:plan {feature-name}` first.")
- `.genesis/specs/{feature-name}/spec.md`
- `.genesis/constitution.md`

**Status gating:** Check the plan's `**Status:**` field.
- If "Draft": "The plan for '{feature-name}' is still in Draft. It must be Approved before task decomposition. Review and approve it first."
- Only proceed if status is "Approved".

## Process

1. **Determine feature name:**
   - If $ARGUMENTS provided, use it
   - If empty, check project-state.md for active feature
   - If no active feature, ask

2. **Check for existing tasks:**
   - If `.genesis/tasks/{feature-name}/tasks.md` exists: "Tasks for '{feature-name}' already exist. Would you like to regenerate or modify?"

3. **Create directory:** `.genesis/tasks/{feature-name}/`

4. **Create `tasks.md`** using `.genesis/templates/tasks-template.md`.

5. **Break the plan into tasks.** Each task includes:
   - **ID:** T-001, T-002, etc.
   - **Title:** Clear, action-oriented
   - **Status:** Pending (all start as Pending)
   - **Complexity:** Small (~30 min), Medium (~1-2 hours), Large (consider splitting)
   - **Dependencies:** List of task IDs or "None"
   - **Parallel flag:** [P] if can execute simultaneously with other tasks whose deps are met
   - **Objective:** What this task produces (1-2 sentences)
   - **Acceptance Criteria:** Checkboxes, each testable
   - **File Paths:** Creates and/or Modifies
   - **Constitution References:** Which sections apply
   - **Commit Message:** Conventional commit format per constitution

6. **Choose task organization strategy.** Ask the user which approach they prefer:

   **Option A: Functional Grouping** (default — best when stories are tightly coupled)
   - Foundation (setup, scaffolding, infrastructure)
   - Core Logic (business logic, data layer)
   - Integration (API endpoints, UI, connecting pieces)
   - Testing (dedicated testing beyond inline tests)
   - Polish (documentation, cleanup, final touches)

   **Option B: User-Story Grouping** (best for incremental delivery — each story can be independently implemented, tested, and demoed)
   - Setup (shared scaffolding needed by all stories)
   - Story: US-{NNN} {title} (all tasks for one story: logic, API, UI, tests)
   - Story: US-{NNN} {title} (all tasks for next story)
   - Cross-Story Integration (tasks spanning multiple stories)
   - Polish (documentation, cleanup, final touches)

   With user-story grouping, each story section is independently deliverable. You can implement, test, and demo Story 1 before touching Story 2. Add a checkpoint after each story for review.

7. **Create dependency visualization** — ASCII graph showing task dependencies and parallel execution opportunities.

8. **For Brownfield:** Include a convergence milestone — the explicit task after which the project achieves structural parity with greenfield. Define convergence criteria.

9. **Run coverage verification:**
   - Every functional requirement (FR-*) in spec → at least one task
   - Every acceptance criterion (AC-*) in spec → at least one task's criteria
   - Testing strategy from plan → test tasks
   - Verify dependency chain is acyclic (no circular dependencies)
   - Verify at least one root node (task with no dependencies)

   Present the coverage verification tables.

10. **Task granularity check:**
    - Small: Single-file change, straightforward logic (~30 min)
    - Medium: Multiple files, some complexity (~1-2 hours)
    - Large: Should probably be split into subtasks
    - If any task is Large, suggest splitting it

11. **Present summary and full task list for user review:**
    - Total count, complexity distribution
    - Critical path
    - Estimated task groups
    - Full task definitions

12. **Git commit:** `genesis: decompose {feature-name} into tasks`

13. **Update project-state.md:**
    - Phase: tasks
    - Progress: 0 of {total} tasks complete
    - Session log entry

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_tasks` hooks and execute their instructions.
After completing: check for extensions with `after_tasks` hooks and execute their instructions.

## Next Step

Suggest: "Run `/genesis:implement {feature-name}` to start building, or `/genesis:issues {feature-name}` to create GitHub Issues first."
