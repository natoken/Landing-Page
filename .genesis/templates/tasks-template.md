# Tasks: {Feature Name}

**Created:** {Date}
**Last Updated:** {Date}
**Plan:** `.genesis/plans/{feature-name}/plan.md`
**Spec:** `.genesis/specs/{feature-name}/spec.md`
**Branch:** genesis/{NNN}-{feature-name}

---

## Summary

- **Total Tasks:** {count}
- **Complexity:** {N} Small, {N} Medium, {N} Large
- **Critical Path:** T-{NNN} → T-{NNN} → T-{NNN}
- **Progress:** {0} of {total} complete

## Dependency Graph

```
{ASCII dependency visualization}

Example:
T-001 (Setup) ──► T-002 (Models) ──► T-004 (Services)
                         │                    │
                         ▼                    ▼
                  T-003 (Schema)       T-005 (API) ──► T-007 (Integration Tests)
                                              │
                                       T-006 (UI) ──► T-008 (E2E Tests)
```

---

## Group 1: Foundation

<!-- GUIDANCE: Infrastructure, setup, and scaffolding tasks that other tasks depend on. -->

### T-001: {Title}

**Status:** Pending | In Progress | Complete | Blocked
**Complexity:** Small | Medium | Large
**Dependencies:** None
**Parallel:** {[P] if parallelizable}

#### Objective
{What this task produces — one to two sentences}

#### Acceptance Criteria
- [ ] {Testable criterion 1}
- [ ] {Testable criterion 2}

#### File Paths
- Creates: `{path}`
- Modifies: `{path}`

#### Constitution References
- Section {N} ({Name}): {What constitutional principle applies}

#### Commit Message
`{type}({scope}): {description}`

---

## Group 2: Core Logic

<!-- GUIDANCE: The main business logic and data layer tasks. -->

### T-002: {Title}

**Status:** Pending
**Complexity:** Medium
**Dependencies:** T-001

<!-- Continue pattern for each task -->

---

## Group 3: Integration

<!-- GUIDANCE: API endpoints, UI components, connecting pieces together. -->

---

## Group 4: Testing

<!-- GUIDANCE: Dedicated testing tasks beyond the tests written alongside implementation. -->

---

## Group 5: Polish

<!-- GUIDANCE: Documentation, cleanup, final touches. -->

---


## Convergence Milestone

**After Task:** T-{NNN}
**Description:** At this point, the project achieves structural parity with a greenfield project. All subsequent tasks operate as standard feature development.
**Criteria:**
- [ ] {Convergence criterion 1}
- [ ] {Convergence criterion 2}


## Coverage Verification

### Functional Requirements → Tasks
| Requirement | Covered By |
|-------------|-----------|
| FR-{NNN} | T-{NNN} |

### Acceptance Criteria → Task Criteria
| Spec AC | Task AC |
|---------|---------|
| AC-{NNN} | T-{NNN} criterion {N} |

### Testing Strategy → Test Tasks
| Plan Test | Task |
|-----------|------|
| {Test description} | T-{NNN} |
