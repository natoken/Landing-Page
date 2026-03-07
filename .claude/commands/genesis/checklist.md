---
description: Generate quality validation checklists for requirements
argument-hint: "[feature-name] [domain] — domains: ux, api, security, performance, data, general"
---

# Genesis Quality Checklist

## Purpose

Generate "unit tests for English" — checklists that validate the QUALITY of requirements themselves, not whether the implementation works. These catch specification problems before they become code problems.

## Pre-flight

Read these files:
- `.genesis/specs/{feature-name}/spec.md` (REQUIRED)
- `.genesis/constitution.md`
- `.genesis/plans/{feature-name}/plan.md` (if exists)
- Relevant `.genesis/design/` documents

## Argument Parsing

Parse $ARGUMENTS:
- `{feature-name}` — which feature's spec to validate (required)
- `{domain}` — which checklist domain(s) to generate (optional, default: auto-detect from spec)
  - `general` — Universal requirements quality
  - `ux` — User experience and interaction
  - `api` — API design and contracts
  - `security` — Security and authorization
  - `performance` — Performance and scalability
  - `data` — Data integrity and storage

If domain is not specified, auto-detect relevant domains from the spec content.

## Process

### 1. Generate Checklist Items

For each domain, generate checklist items that test whether the REQUIREMENTS are well-written, complete, and clear. Each item should:
- Reference a specific spec section (FR-*, NFR-*, AC-*, user story)
- Be answerable as Pass/Fail/N/A
- Test the requirement's quality, not its implementation

### 2. Checklist Categories

#### General (always included)
- [ ] Every functional requirement is testable (has clear pass/fail criteria)
- [ ] Every acceptance criterion is objectively verifiable (no "should be good")
- [ ] No implementation details in the spec (no file paths, function names, database tables)
- [ ] All user stories follow "As a / I want to / So that" format with concrete value
- [ ] Out-of-scope section explicitly addresses adjacent features
- [ ] No circular dependencies between requirements
- [ ] Every requirement has exactly one interpretation (no "and/or")
- [ ] Numeric targets are specific (not "fast" but "< 200ms")

#### UX Domain
- [ ] Every user-facing action has a defined success state
- [ ] Every user-facing action has a defined error state
- [ ] Empty states are defined (what shows when there's no data?)
- [ ] Loading states are defined (what shows while waiting?)
- [ ] Navigation flow is complete (how does the user get here? where can they go?)
- [ ] Accessibility requirements are explicit (keyboard nav, screen reader, contrast)
- [ ] Mobile/responsive behavior is defined (or explicitly out of scope)

#### API Domain
- [ ] Every endpoint has defined request/response shapes
- [ ] Error responses are standardized across all endpoints
- [ ] Authentication/authorization requirements are explicit per endpoint
- [ ] Rate limiting is addressed (or explicitly out of scope)
- [ ] Pagination is defined for list endpoints
- [ ] Versioning strategy is stated or referenced from constitution

#### Security Domain
- [ ] Authentication requirements are explicit (not assumed)
- [ ] Authorization rules are defined per feature/action
- [ ] Data sensitivity is classified (PII, credentials, public)
- [ ] Input validation requirements are stated
- [ ] Audit logging requirements are defined
- [ ] Session management behavior is specified

#### Performance Domain
- [ ] Response time targets are stated with specific numbers
- [ ] Concurrent user expectations are defined
- [ ] Data volume expectations are stated (how many records?)
- [ ] Caching strategy is addressed (or deferred to plan)
- [ ] Degradation behavior is defined (what happens under load?)

#### Data Domain
- [ ] Every entity has defined required vs. optional fields
- [ ] Validation rules are explicit (format, length, range)
- [ ] Uniqueness constraints are stated
- [ ] Deletion behavior is defined (cascade, soft delete, restrict)
- [ ] Data migration path is addressed (for schema changes)

### 3. Anti-Patterns to Flag

Flag these patterns in the spec as automatic failures:
- "The system should handle errors appropriately" — vague
- "Performance should be acceptable" — unmeasurable
- "Users can manage their data" — undefined ("manage" = CRUD? export? delete?)
- "Support standard authentication" — which standard?
- "Similar to [other product]" — external reference without specific requirements
- "As needed" / "Where applicable" — undefined scope

### 4. Traceability Check

Verify that 80%+ of checklist items reference specific spec sections. Items without references indicate gaps in the spec itself.

### 5. Present Results

```markdown
# Quality Checklist: {Feature Name}

**Domains:** {domains checked}
**Total Items:** {count}
**Pass:** {count} | **Fail:** {count} | **N/A:** {count}
**Traceability:** {percentage} of items reference spec sections

## General Quality
| # | Check | Status | Spec Reference | Notes |
|---|-------|--------|----------------|-------|
| 1 | {check description} | Pass/Fail/N/A | {FR-NNN or AC-NNN} | {notes} |

## {Domain} Quality
| # | Check | Status | Spec Reference | Notes |
|---|-------|--------|----------------|-------|

## Anti-Patterns Found
1. {quote from spec} — {why it's a problem} — {suggested fix}

## Recommendations
- {Priority-ordered actions to improve spec quality}
```

### 6. Spec Improvement (Optional)

If the user approves, update the spec to fix quality issues found. Re-run the checklist to verify improvements.

Git commit: `genesis: quality checklist for {feature-name}`

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_checklist` hooks and execute their instructions.
After completing: check for extensions with `after_checklist` hooks and execute their instructions.
