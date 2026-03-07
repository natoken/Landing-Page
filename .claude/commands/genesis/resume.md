---
description: Resume work from where you left off
---

# Genesis Resume

Recover context and continue from the last session.

## Process

### 1. Read Project State

Read `.genesis/project-state.md` and extract:
- Current phase
- Active feature (if any)
- Progress (e.g., "3 of 8 tasks complete")
- Any blockers
- Last session log entries (most recent 3)

### 2. Load Active Feature Context

If there is an active feature, read ALL of these (skip any that don't exist):
- `.genesis/specs/{feature}/spec.md`
- `.genesis/plans/{feature}/plan.md`
- `.genesis/tasks/{feature}/tasks.md`
- `.genesis/constitution.md`
- Relevant `.genesis/design/` documents referenced in the plan

### 3. Determine Resumption Point

Based on active work state:

| State | Resume Action |
|-------|---------------|
| No active feature | Display status and suggest next step |
| Phase: specify | Re-read spec draft, continue writing |
| Phase: clarify | Check for unresolved questions, continue clarification |
| Phase: plan | Re-read plan draft, continue planning |
| Phase: tasks | Check for incomplete task breakdown, continue |
| Phase: implement | Find next pending task with met dependencies, continue implementing |
| Phase: review | Continue review from where it left off |

### 4. For Implementation Resumption (Most Common)

If resuming mid-implementation:

1. Read the task list from `.genesis/tasks/{feature}/tasks.md`
2. Count completed vs total tasks
3. Identify the next eligible task (Pending + all dependencies Complete)
4. Check for any Blocked tasks and their reasons
5. Check git status for any uncommitted work from the previous session
6. Report:

```
Resuming: {feature-name}
Progress: {X} of {Y} tasks complete
Last completed: T-{NNN} — {title}
Next up: T-{NNN} — {title}
{Blocked tasks, if any}
{Uncommitted changes, if any}
```

7. Ask: "Ready to continue with T-{NNN}, or would you like to review the current state first?"

### 5. For Non-Implementation Resumption

If resuming a non-implementation phase:

1. Read the relevant artifact draft
2. Identify what's been completed and what remains
3. Summarize the current state
4. Continue from where the work left off

### 6. Session Log

Append to `.genesis/project-state.md` session log:
```
- [{date}] Resumed — {feature-name} at {phase}, {progress summary}
```

## Edge Cases

- **No project-state.md:** "No Genesis project found. Run /genesis:init first."
- **Corrupted state:** If project-state.md exists but is malformed, attempt to reconstruct state from existing artifacts (specs, plans, tasks, git log).
- **Multiple features in progress:** List all active features and ask which to resume.
- **Uncommitted changes detected:** Warn the user and ask whether to commit, stash, or discard before continuing.

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_resume` hooks and execute their instructions.
After completing: check for extensions with `after_resume` hooks and execute their instructions.
