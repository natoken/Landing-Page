---
description: Validate completed work against spec, constitution, and design
argument-hint: "[feature-name]"
---

# Genesis Review

## Pre-flight

Read these files:
- `.genesis/specs/{feature-name}/spec.md` (REQUIRED)
- `.genesis/tasks/{feature-name}/tasks.md`
- `.genesis/plans/{feature-name}/plan.md`
- `.genesis/constitution.md`
- All relevant `.genesis/design/` documents
- The actual code produced (examine files listed in tasks)

## Process

### 1. Acceptance Criteria Verification

Walk through EVERY acceptance criterion from the spec (`AC-*`):

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| AC-001 | {criterion text} | Pass/Fail/Partial | {details} |

For each criterion:
- **Pass:** The implementation fully satisfies it
- **Fail:** The implementation does not satisfy it
- **Partial:** Partially met — explain what's missing

### 2. Constitution Compliance

Check each relevant constitutional section:

| Section | Status | Notes |
|---------|--------|-------|
| Technology Stack | Pass/Fail | Are all dependencies within the declared stack? |
| Architecture Principles | Pass/Fail | Do components follow the declared patterns? |
| Code Standards | Pass/Fail | Naming, structure, documentation per constitution |
| Testing Philosophy | Pass/Fail | Coverage meets required levels? Approach matches? |
| Quality Gates | Pass/Fail | All quality gates satisfied? |
| Security & Compliance | Pass/Fail | Auth, data handling, secrets per constitution |
| Documentation | Pass/Fail | Required docs present and complete? |

### 3. Design Consistency

Check implementation against design documents:
- Does the implementation match `design/technical/architecture.md`?
- Does the data model match `design/technical/data-model.md`?
- Do API endpoints match `design/technical/api-contracts.md`?
- Are there deviations from feature design docs?

Flag any inconsistencies — they may indicate the design docs need updating.

### 4. Test Quality Assessment

- Review test files created during implementation
- Check: Are tests meaningful (testing behavior, not implementation)?
- Check: Are edge cases covered?
- Check: Do tests match the testing strategy from the plan?
- Calculate coverage if tooling is available

### 5. Code Quality

- Check for TODO/FIXME/HACK comments left in code
- Check for unused imports or dead code
- Check for hardcoded values that should be configurable
- Check for potential security issues (injection, exposure, etc.)
- Check for performance concerns (N+1 queries, unnecessary re-renders, etc.)

### 6. Issue Report

Compile all findings:

```markdown
# Review: {Feature Name}

## Acceptance Criteria
| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
(from step 1)

## Constitution Compliance
| Section | Status | Notes |
|---------|--------|-------|
(from step 2)

## Design Consistency
(from step 3)

## Test Quality
(from step 4)

## Issues Found
1. {Issue}: {Description and severity}
2. {Issue}: {Description and severity}

## Recommendation
{One of:}
- All criteria pass. Feature is complete.
- {N} issues found. Create fix tasks and loop back to implementation.
- Major issues found. Requires spec/plan revision.
```

### 7. Resolution

**If issues found:**
- Create targeted fix tasks (append to tasks.md with new IDs continuing the sequence)
- Each fix task references the review finding it addresses
- Return to implementation phase for fixes
- After fixes, re-run review (can be scoped to just the fix areas)

**If all criteria pass:**
- Mark feature complete in project-state.md
- Update all completed acceptance criteria checkboxes in the spec
- Merge feature branch (per constitution's branching model):
  - Default: merge into main with commit `genesis: complete {feature-name}`
  - Or follow the branching strategy in the constitution
- Suggest next feature or area to work on

### 8. Constitutional Review Cycle Check

After marking a feature complete, check the constitution's Review Schedule:
- Count completed features since last constitutional review
- If the count meets or exceeds the threshold: "You have completed {N} features since the last constitutional review. Consider reviewing the constitution for relevance. Run `/genesis:amend` to review and update specific sections."

### 9. State Update

Update `.genesis/project-state.md`:
- If complete: Move feature to Completed Features table with date
- If fixes needed: Note in Active Work
- Session log entry with review summary

### 10. Lowfield Content Review

When mode is Lowfield, replace code-centric checks with content-centric checks:
- **Style consistency:** Does content match constitutional voice, tone, and style standards?
- **Terminology consistency:** Are terms used consistently with the glossary (`.genesis/design/glossary.md`)?
- **Organizational compliance:** Does content follow the structure defined in the constitution and design overview?
- **Cross-reference validity:** Check the content map (`.genesis/design/content-map.md`) for broken references, orphaned items, or contradictions
- **Completeness:** Does the content cover all planned items from the spec?

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_review` hooks and execute their instructions.
After completing: check for extensions with `after_review` hooks and execute their instructions.

## Next Step

If all criteria pass: "Feature complete! Run `/genesis:status` to see overall project state."
If fixes needed: "Run `/genesis:implement {feature-name}` to address the fix tasks."
