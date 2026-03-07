# Review Report: {Feature Name}

**Date:** {Date}
**Reviewer:** Claude (via /genesis:review)
**Spec:** `.genesis/specs/{feature-name}/spec.md`
**Branch:** genesis/{NNN}-{feature-name}

---

## 1. Acceptance Criteria Verification

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| AC-001 | {criterion text} | Pass/Fail/Partial | {details} |

**Summary:** {X} of {Y} criteria passed.

## 2. Constitution Compliance

| Section | Status | Notes |
|---------|--------|-------|
| Technology Stack | Pass/Fail | {Are all dependencies within the declared stack?} |
| Architecture Principles | Pass/Fail | {Do components follow declared patterns?} |
| Code Standards | Pass/Fail | {Naming, structure, documentation per constitution} |
| Testing Philosophy | Pass/Fail | {Coverage meets required levels?} |
| Quality Gates | Pass/Fail | {All quality gates satisfied?} |
| Security & Compliance | Pass/Fail | {Auth, data handling, secrets per constitution} |
| Documentation | Pass/Fail | {Required docs present and complete?} |

## 3. Design Consistency

| Design Document | Status | Deviations |
|-----------------|--------|------------|
| {design doc name} | Consistent/Deviated | {description of any deviations} |

## 4. Test Quality Assessment

- **Test Count:** {N} tests across {N} files
- **Coverage:** {percentage if available}
- **Edge Cases:** {Covered/Gaps identified}
- **Test Strategy Compliance:** {matches plan's testing strategy?}

## 5. Code Quality

| Check | Status | Details |
|-------|--------|---------|
| TODO/FIXME/HACK comments | {count found} | {locations} |
| Unused imports/dead code | {count found} | {locations} |
| Hardcoded values | {count found} | {locations} |
| Security concerns | {count found} | {descriptions} |
| Performance concerns | {count found} | {descriptions} |

## 6. Issues Found

| # | Severity | Issue | Location | Fix Required |
|---|----------|-------|----------|--------------|
| 1 | {Critical/High/Medium/Low} | {description} | {file:line} | {Yes/No} |

## 7. Recommendation

<!-- One of: -->
<!-- - All criteria pass. Feature is complete. -->
<!-- - {N} issues found. Create fix tasks and loop back to implementation. -->
<!-- - Major issues found. Requires spec/plan revision. -->

{recommendation}

## 8. Fix Tasks (if applicable)

<!-- Only populate if issues require fixes -->

| Task ID | Title | Addresses Issue # | Priority |
|---------|-------|--------------------|----------|
| T-{NNN} | {fix description} | #{issue number} | {High/Medium/Low} |
