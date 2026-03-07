---
description: Pre-implementation cross-artifact consistency analysis
argument-hint: "[feature-name]"
---

# Genesis Cross-Artifact Analysis

## Purpose

Run a pre-implementation consistency check across all artifacts for a feature. Catches issues between spec, plan, tasks, design docs, and constitution BEFORE implementation — when fixes are cheap.

This is a non-destructive, read-only analysis. It reports findings but makes no changes.

## Pre-flight

Read these files:
- `.genesis/constitution.md` (REQUIRED)
- `.genesis/project-state.md`
- `.genesis/specs/{feature-name}/spec.md` (REQUIRED)
- `.genesis/plans/{feature-name}/plan.md` (if exists)
- `.genesis/tasks/{feature-name}/tasks.md` (if exists)
- All relevant files in `.genesis/design/`

## Process

1. **Determine feature name:**
   - If $ARGUMENTS provided, use it
   - If empty, check project-state.md for active feature
   - If no active feature, ask

2. **Run analysis across six dimensions:**

### 2.1 Duplication Detection
- Scan for overlapping or contradictory requirements across spec, plan, and tasks
- Check for duplicate acceptance criteria that might indicate copy-paste errors
- Flag requirements restated differently in spec vs. plan

### 2.2 Ambiguity Detection
- Identify vague language: "should," "might," "could," "appropriate," "relevant," "proper," "reasonable," "etc."
- Flag requirements without measurable criteria
- Identify acceptance criteria that aren't objectively testable
- Look for undefined terms not in the design docs' glossary

### 2.3 Underspecification
- Requirements referenced in the plan but not defined in the spec
- Tasks that reference behavior not covered by any requirement
- Edge cases mentioned in design docs but missing from spec
- Error scenarios without defined handling

### 2.4 Constitution Alignment
- Technology references in plan that aren't in the constitutional tech stack
- Architectural decisions that conflict with constitutional principles
- Testing approach that doesn't meet constitutional requirements
- Naming/structure conventions that diverge from constitutional standards

### 2.5 Coverage Gaps
- Functional requirements (FR-*) without corresponding tasks
- Acceptance criteria (AC-*) without corresponding task acceptance criteria
- User stories without functional requirements
- Plan components without tasks
- Testing strategy items without test tasks

### 2.6 Inconsistency Detection
- Data model in plan vs. data-model design doc
- API endpoints in plan vs. api-contracts design doc
- Component names in plan vs. architecture design doc
- File paths in tasks vs. actual project structure (if implementation has started)

3. **Rate each finding by severity:**
   - **Critical:** Will cause implementation failure or constitutional violation
   - **Warning:** May cause rework or confusion during implementation
   - **Info:** Minor inconsistency, low risk

4. **Present findings report:**

```markdown
# Analysis: {Feature Name}

**Artifacts Analyzed:** {list}
**Total Findings:** {count} ({critical} critical, {warning} warnings, {info} info)

## Critical Findings
1. **[Constitution Alignment]** Plan references Redis (not in tech stack)
   - Location: plans/{feature}/plan.md, Section 2
   - Impact: Constitutional violation will block implementation

## Warnings
1. **[Coverage Gap]** FR-003 has no corresponding task
   - Location: specs/{feature}/spec.md, FR-003
   - Impact: Requirement may not be implemented

## Info
1. **[Ambiguity]** AC-005 uses "appropriate error message" — not testable
   - Location: specs/{feature}/spec.md, AC-005
   - Suggestion: Specify exact error message text or format

## Recommendations
- {Prioritized list of actions to take before implementation}
```

5. **Do NOT modify any files.** This is read-only analysis. Recommend which commands to re-run to fix issues (e.g., "Re-run /genesis:clarify to resolve ambiguities" or "Update the plan to address coverage gaps").

## Special Modes

### No Feature Argument — Constitutional Self-Consistency

If no feature argument is provided AND no active feature exists, run a **constitutional self-consistency analysis**:
1. Read `.genesis/constitution.md`
2. Check each section against every other section for contradictions
3. Check for stale references (e.g., architecture says "microservices" but performance says "<50ms for all requests")
4. Check amendment log for contradictory amendments
5. Report tensions with severity ratings

### `--coverage` Flag — Spec Coverage Matrix

When run with `--coverage`, generate a cross-feature coverage matrix:

```
SPEC COVERAGE MATRIX
                    | User Stories | FRs | NFRs | ACs |
  auth              | 4            | 12  | 3    | 15  |
  search            | 3            | 8   | 2    | 10  |
  payments          | 5            | 15  | 4    | 20  |

GAPS:
  - search: US-002 has no functional requirements
  - payments: FR-012 has no acceptance criteria
```

### `--drift` Flag — Constitutional Drift Detection

When run with `--drift`, scan all completed implementations against the constitution:
1. Check every completed feature's code against constitutional tech stack
2. Verify naming conventions match constitutional standards
3. Check test coverage against constitutional minimums
4. Report drift:

```
CONSTITUTIONAL DRIFT REPORT

Section 2 (Tech Stack):
  - Feature 'auth': Uses bcrypt-js (not in constitution) — DRIFT
  - Feature 'search': All dependencies compliant — OK

Section 4 (Code Standards):
  - Feature 'auth': 2 files use camelCase instead of constitutional snake_case — DRIFT

Section 5 (Testing):
  - Feature 'search': Coverage 62% (constitutional minimum: 80%) — DRIFT
```

### `--deps` Flag — Cross-Feature Dependency Map

When run with `--deps`, analyze all features for inter-dependencies:
1. Scan all specs for references to other features
2. Scan all plans for shared component usage
3. Build a dependency graph:

```
CROSS-FEATURE DEPENDENCIES

auth ←── search (search uses auth middleware)
auth ←── payments (payments uses auth tokens)
search ─── payments (no dependency)

Shared Components:
  - database-client: used by auth, search, payments
  - error-handler: used by auth, search

Risk: auth is a critical dependency for 2 features.
  Modifying auth requires reviewing: search, payments
```

## When to Run

- After completing the plan (before task decomposition)
- After completing tasks (before implementation)
- Anytime you suspect artifact drift
- The `/genesis:implement` command should suggest running this first if the plan or tasks have been modified since analysis
- Periodically with `--drift` to catch constitutional drift in completed features
- With `--deps` when planning features that may share components

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_analyze` hooks and execute their instructions.
After completing: check for extensions with `after_analyze` hooks and execute their instructions.
