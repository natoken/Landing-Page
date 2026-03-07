---
description: Archive a completed or abandoned feature
argument-hint: "[feature-name]"
---

# Genesis Archive

Move a feature's artifacts to the archive directory with a summary.

## Pre-flight

Read `.genesis/project-state.md` to verify the feature exists.

If $ARGUMENTS is empty, list all features (active and completed) and ask which to archive.

## Process

### 1. Verify Feature State

Check the feature's current status:
- **Completed (reviewed and merged):** Safe to archive. Proceed.
- **Active (in progress):** Warn: "Feature '{feature-name}' is still active at phase '{phase}'. Are you sure you want to archive it? This will mark it as abandoned."
- **Not found:** "No feature '{feature-name}' found in project state."

### 2. Create Archive Directory

Create `.genesis/archive/{feature-name}/`

### 3. Generate Archive Summary

Create `.genesis/archive/{feature-name}/summary.md`:

```markdown
# Archive: {Feature Name}

**Archived:** {date}
**Status:** {Completed|Abandoned}
**Original Branch:** genesis/{NNN}-{feature-name}
**Phases Completed:** {list of phases reached}

## Summary
{Brief description of what this feature was about}

## Artifacts Archived
- spec.md — {status at time of archive}
- plan.md — {status at time of archive, if exists}
- tasks.md — {progress at time of archive, if exists}

## Key Decisions
{Any notable decisions made during this feature's lifecycle}

## Reason for Archive
{If abandoned: why. If completed: standard post-completion archive.}
```

### 4. Move Artifacts

Move (not copy) these directories to the archive:
- `.genesis/specs/{feature-name}/` → `.genesis/archive/{feature-name}/specs/`
- `.genesis/plans/{feature-name}/` → `.genesis/archive/{feature-name}/plans/`
- `.genesis/tasks/{feature-name}/` → `.genesis/archive/{feature-name}/tasks/`

### 5. Update Project State

- Remove feature from Active Features table (if active)
- If abandoning: add to Completed Features as "Archived (Abandoned)" with date
- Session log entry: "Archived feature: {feature-name} ({status})"

### 6. Git Commit

`genesis: archive {feature-name}`

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_archive` hooks and execute their instructions.
After completing: check for extensions with `after_archive` hooks and execute their instructions.
