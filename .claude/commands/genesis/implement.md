---
description: Execute tasks and build the feature
argument-hint: "[feature-name]"
---

# Genesis Implementation

## Pre-flight

Read these files:
- `.genesis/tasks/{feature-name}/tasks.md` (REQUIRED — refuse if missing: "Tasks not found. Run `/genesis:tasks {feature-name}` first.")
- `.genesis/plans/{feature-name}/plan.md`
- `.genesis/specs/{feature-name}/spec.md`
- `.genesis/constitution.md`
- Relevant `.genesis/design/` documents

**Status gating:** Check the spec and plan `**Status:**` fields.
- If either is "Draft": "Cannot implement — the {spec|plan} for '{feature-name}' is still in Draft. All upstream artifacts must be Approved before implementation."
- Only proceed if both spec and plan are "Approved".

## Process

### Task Selection

1. Read the task list. Find the next task where:
   - Status is **"Pending"**
   - ALL dependencies have Status **"Complete"**
   - If multiple tasks qualify and are marked [P], note they can be done in parallel

2. If no tasks are eligible but incomplete tasks remain, check for blockers:
   - Tasks with Status "Blocked" — report blockers to user
   - Circular dependency — this should not happen but flag if detected

### Per-Task Execution

For each task:

1. **Announce:** "Working on T-{NNN}: {Title}"
   - State the objective
   - List acceptance criteria
   - List files to create/modify

2. **Read context:**
   - Relevant design doc sections
   - Relevant plan sections
   - Any existing code that will be modified
   - Constitution sections referenced in the task

3. **Implement the task:**
   - Create or modify files as specified
   - Follow constitutional standards (naming, style, structure, documentation)
   - Do NOT introduce dependencies outside the constitution's tech stack
   - Write tests as required by the task and constitution

4. **Verify each acceptance criterion:**
   - Check each box as it's met: `- [ ]` → `- [x]`
   - If a criterion cannot be met, explain why and ask for guidance

5. **Update task status:** `**Status:** Pending` → `**Status:** Complete`

6. **Update `.genesis/project-state.md`:**
   - Progress: "{X} of {Y} tasks complete"

7. **Git commit** using the task's specified commit message.

### Quality Gates

8. **After each logical group of tasks, pause:**
   "I've completed {group name} (tasks T-{NNN} through T-{NNN}). Would you like to review before I continue?"

9. **If a spec gap is discovered:**
   DO NOT improvise or guess. Flag it:
   "I've found a gap in the specification: {description}. This needs to be resolved before I can complete this task. Options:
   a) Update the spec to clarify
   b) Mark this task as Blocked and move to the next unblocked task"

10. **If a constitutional violation would be required:**
    STOP immediately. Explain the conflict:
    "Implementing this task as specified would violate the constitution (Section {N}: {title}). Specifically: {violation}. Options:
    a) Modify the approach to comply with the constitution
    b) Amend the constitution to allow this approach"

11. **If a task is blocked by an external dependency or unresolved question:**
    - Mark it `**Status:** Blocked` with a reason
    - Note the blocker in project-state.md
    - Move to the next unblocked task

### Completion

12. When all tasks are complete (or all remaining are blocked):
    - Summarize what was built
    - List any blocked tasks and their blockers
    - Recommend: "Run /genesis:review {feature-name} to validate the implementation."

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_implement` hooks and execute their instructions.
After completing: check for extensions with `after_implement` hooks and execute their instructions.
Before each task: check for extensions with `before_task` hooks and execute their instructions.
After each task: check for extensions with `after_task` hooks and execute their instructions.
