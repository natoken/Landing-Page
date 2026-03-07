---
description: Create a technical implementation plan for a feature
argument-hint: "[feature-name]"
---

# Genesis Plan

## Pre-flight

Read these files:
- `.genesis/constitution.md` (REQUIRED)
- `.genesis/project-state.md`
- `.genesis/specs/{feature-name}/spec.md` (REQUIRED — refuse if missing)
- All relevant files in `.genesis/design/`

If spec doesn't exist: "Specification not found for '{feature-name}'. Run `/genesis:specify {feature-name}` first."

**Status gating:** Check the spec's `**Status:**` field.
- If "Draft": "The spec for '{feature-name}' is still in Draft. It must be Approved before planning. Review and approve it first."
- If "In Review": "The spec for '{feature-name}' is In Review. Approve it before creating a plan."
- Only proceed if status is "Approved".

If spec has unresolved open questions: "The spec for '{feature-name}' has {N} open questions. Consider running /genesis:clarify {feature-name} first."

## Process

1. **Determine feature name:**
   - If $ARGUMENTS provided, use it
   - If empty, check project-state.md for active feature
   - If no active feature, ask

2. **Check for existing plan:**
   - If `.genesis/plans/{feature-name}/plan.md` exists: "A plan for '{feature-name}' already exists. Would you like to revise it or start fresh?"

3. **Create directory:** `.genesis/plans/{feature-name}/`

4. **Create `plan.md`** using `.genesis/templates/plan-template.md`.

5. **Populate the plan:**

   **Input References** — Links to spec, constitution, and relevant design docs.

   **Technical Context** — Stack from constitution, specific library/version choices for this feature. ALL choices must be within the constitutional tech stack.

   **Constitution Compliance** — Explicit table showing how each architectural choice aligns with constitutional principles. Document any tensions or borderline decisions with justification.

   **Component Architecture** — New components introduced, existing components modified, their responsibilities, how they interact.

   **Data Model Changes** — New entities, schema changes, migrations. Reference `design/technical/data-model.md`.

   **API/Interface Design** — New/modified endpoints, data shapes, auth requirements. Reference `design/technical/api-contracts.md`.

   **Implementation Strategy** — Build order, integration approach, risk areas with mitigation, fallback plans.

   **Research Items** — Technical unknowns. Each item: question, resolution criteria. If items exist, create `research.md`.

   **Testing Strategy** — Map every acceptance criterion from the spec to a test type and location.

   **Deployment Considerations** — Migrations, feature flags, backward compatibility, rollback plan.

6. **For Brownfield:** Add "Integration with Existing Code" section covering:
   - Existing modules touched
   - Interfaces that must be preserved
   - Data migration strategy
   - Deprecation timeline for replaced code

7. **Constitutional tech stack enforcement:**
   - ALL technical decisions MUST be within the constitution's declared stack
   - If the optimal solution requires a tool NOT in the constitution:
     - Do NOT use it
     - Flag it: "The optimal approach would use {X}, but the constitution specifies {Y}. Here's the best approach within constitutional constraints: ..."
     - OR suggest a constitutional amendment with full justification
   - Never silently introduce an unconstitutional dependency

8. **Research items:**
   - If any exist, create `.genesis/plans/{feature-name}/research.md`
   - Each item: ID, question, resolution criteria, findings (blank), decision (blank)
   - ALL research items must be resolved before the plan is approved
   - Conduct research and populate findings/decisions
   - Present research findings to the user

9. **Present the complete plan for user review.** Iterate until approved.

10. **On approval:** Update the plan header: `**Status:** Approved`. If revising an existing plan, increment the version number and add a changelog entry.

11. **Git commit on feature branch:** `genesis: plan {feature-name}`

12. **Update project-state.md:**
    - Phase: plan
    - Session log entry

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_plan` hooks and execute their instructions.
After completing: check for extensions with `after_plan` hooks and execute their instructions.

## Next Step

Suggest: "Run `/genesis:tasks {feature-name}` to break the plan into executable tasks, or `/genesis:analyze {feature-name}` to verify artifact consistency first."
