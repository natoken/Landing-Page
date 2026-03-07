---
description: Formally amend the project constitution
argument-hint: "[section-number]"
---

# Genesis Constitutional Amendment

Formal process for amending the project constitution with impact analysis and audit trail.

## Pre-flight

Read these files:
- `.genesis/constitution.md` (REQUIRED — refuse if missing)
- `.genesis/project-state.md`

## Process

### 1. Identify Amendment Scope

If $ARGUMENTS provided, use as the section number to amend.
If empty, display the constitution's table of contents and ask: "Which section would you like to amend?"

### 2. Determine Amendment Tier

Assess the severity of the change:

| Tier | Sections | Requirements |
|------|----------|-------------|
| **Foundational** | 1 (Principles), 2 (Tech Stack), 3 (Architecture) | Full impact analysis, review all existing artifacts |
| **Standard** | 4-8, 10 (Standards, Testing, Security, etc.) | Impact analysis, spot-check recent artifacts |
| **Advisory** | 9 (Documentation), 11 (Amendments) | Justification only |

### 3. Draft the Amendment

Ask the user to describe the proposed change. Then draft the amendment:

```markdown
## Amendment #{NNN}

**Date:** {date}
**Section:** {section number and name}
**Tier:** {Foundational|Standard|Advisory}
**Proposed by:** {user}

### Current Text
{existing text of the affected section}

### Proposed Change
{new text}

### Rationale
{why this change is needed}
```

### 4. Impact Analysis

**For Foundational amendments:**
1. Search ALL specs (`.genesis/specs/*/spec.md`) for references to the affected section
2. Search ALL plans (`.genesis/plans/*/plan.md`) for technology/pattern references
3. Search ALL tasks (`.genesis/tasks/*/tasks.md`) for constitution references
4. Check all completed implementations for compliance with the NEW text
5. Present a concrete impact report:

```
Impact Analysis for Amendment #{NNN}:

AFFECTED ARTIFACTS:
  Specs: {list of specs referencing this section}
  Plans: {list of plans constrained by this section}
  Tasks: {list of tasks referencing this section}
  Completed implementations: {list of features that may need review}

CASCADING CHANGES REQUIRED: {count}
COMPLETED WORK AT RISK: {count}
RISK LEVEL: {Low|Medium|High|Critical}
```

**For Standard amendments:** Spot-check the 3 most recent artifacts.
**For Advisory amendments:** No impact analysis required.

### 5. User Approval

Present the full amendment with impact analysis. Ask: "Approve this constitutional amendment? The following downstream artifacts may need updates: {list}"

### 6. Apply Amendment

On approval:
1. Update `.genesis/constitution.md` with the new text
2. Add to the Amendment Log table in the constitution:
   ```
   | #{NNN} | {date} | S{section} | {summary} | {rationale} |
   ```
3. Update `.genesis/project-state.md`:
   - Add to Constitutional Amendments table
   - Session log entry

### 7. Propagation Guidance

If artifacts are affected, provide specific guidance:
- "Specs to review: {list} — check constitution compliance tables"
- "Plans to update: {list} — verify technical context still complies"
- "Tasks to re-evaluate: {list} — check constitution references"

### 8. Git Commit

`genesis: amend constitution section {N} — {summary}`

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_amend` hooks and execute their instructions.
After completing: check for extensions with `after_amend` hooks and execute their instructions.
