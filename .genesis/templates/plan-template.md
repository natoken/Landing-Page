# Implementation Plan: {Feature Name}

**Created:** {Date}
**Last Updated:** {Date}
**Version:** 1.0
**Status:** Draft | Approved
**Spec:** `.genesis/specs/{feature-name}/spec.md`
**Branch:** genesis/{NNN}-{feature-name}

---

## 1. Input References

- **Specification:** `.genesis/specs/{feature-name}/spec.md`
- **Constitution:** `.genesis/constitution.md`
- **Design Docs:**
  - {List relevant design documents}

## 2. Technical Context

<!-- GUIDANCE: Stack decisions constrained by constitution, specific library/version choices for this feature. -->

- **Language:** {from constitution}
- **Framework:** {from constitution}
- **Specific Libraries:** {additional libraries needed for this feature, all within constitutional bounds}

## 3. Constitution Compliance

<!-- GUIDANCE: Explicit verification that every architectural choice aligns with constitutional principles. -->

| Constitutional Section | How This Plan Complies | Tensions/Justifications |
|-----------------------|----------------------|------------------------|
| Technology Stack | {compliance detail} | {any borderline decisions} |
| Architecture Principles | {compliance detail} | |
| Code Standards | {compliance detail} | |
| Testing Philosophy | {compliance detail} | |
| Security & Compliance | {compliance detail} | |

## 4. Component Architecture

<!-- GUIDANCE: What components this feature introduces or modifies, their responsibilities, interaction with existing components. -->

### New Components
| Component | Responsibility | Location |
|-----------|---------------|----------|
| {component} | {what it does} | {file path} |

### Modified Components
| Component | Modification | Reason |
|-----------|-------------|--------|
| {component} | {what changes} | {why} |

### Component Interactions
{How new/modified components interact with each other and existing system}

## 5. Data Model Changes

<!-- GUIDANCE: Reference design/technical/data-model.md. Only describe changes needed for this feature. -->

### New Entities
{Entity definitions or "None"}

### Modified Entities
{Modifications or "None"}

### Migrations
{Migration approach}

## 6. API/Interface Design

<!-- GUIDANCE: Reference design/technical/api-contracts.md. Only describe new/changed endpoints for this feature. -->

### New Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| {method} | {path} | {purpose} |

### Modified Endpoints
{Modifications or "None"}

## 7. Implementation Strategy

<!-- GUIDANCE: Build order within this feature, integration approach, risk areas, fallback plans. -->

### Build Order
1. {What to build first and why}
2. {What to build next}
3. {Continue...}

### Risk Areas
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| {risk} | {H/M/L} | {H/M/L} | {mitigation} |

## 8. Research Items

<!-- GUIDANCE: Technical unknowns. Each needs a clear question and resolution criteria. If items exist, create research.md. -->

| ID | Question | Resolution Criteria | Status |
|----|----------|-------------------|--------|
| R-{NNN} | {question} | {what constitutes an answer} | {Open\|Resolved} |

## 9. Testing Strategy

<!-- GUIDANCE: Map spec acceptance criteria to specific test types and locations. -->

| Acceptance Criterion | Test Type | Test Location | Approach |
|---------------------|-----------|---------------|----------|
| AC-{NNN} | {Unit\|Integration\|E2E} | {file path} | {brief approach} |

## 10. Deployment Considerations

<!-- GUIDANCE: Database migrations, feature flags, backward compatibility, rollback plan. -->

- **Migrations:** {approach}
- **Feature Flags:** {if applicable}
- **Backward Compatibility:** {concerns}
- **Rollback Plan:** {how to undo if needed}


## 11. Integration with Existing Code

- **Existing Modules Touched:** {list}
- **Interfaces to Preserve:** {what must not break}
- **Data Migration:** {if existing data needs transformation}
- **Deprecation:** {what old code is being replaced and timeline}


## Changelog

<!-- GUIDANCE: Track revisions to this plan. Each entry: version, date, what changed, why. -->

| Version | Date | Change | Reason |
|---------|------|--------|--------|
| 1.0 | {Date} | Initial plan | — |
