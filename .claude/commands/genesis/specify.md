---
description: Create a feature specification defining what to build and why
argument-hint: "[feature-name]"
---

# Genesis Specification

## Pre-flight

Read these files:
- `.genesis/constitution.md` (REQUIRED)
- `.genesis/project-state.md`
- `.genesis/discovery/context.md`
- `.genesis/design/overview.md`
- All relevant files in `.genesis/design/`

If the constitution doesn't exist: "Constitution not found. Run `/genesis:constitute` first."
If design overview doesn't exist: "Consider running /genesis:design overview first for better context."

## Process

1. **Determine feature name:**
   - If $ARGUMENTS provided, use as feature name (kebab-case)
   - If empty, ask: "What feature would you like to specify?"

2. **Check for existing spec:**
   - If `.genesis/specs/{feature-name}/spec.md` exists: "A spec for '{feature-name}' already exists. Would you like to revise it or create a new version?"

3. **Create directory:** `.genesis/specs/{feature-name}/`

4. **Create `spec.md`** using `.genesis/templates/spec-template.md` as structure.

5. **Populate the specification:**

   **Overview** — What this feature does, in plain language. 1-3 paragraphs.

   **Design Document References** — Link to every relevant design doc.

   **User Stories** — "As a {role}, I want to {action} so that {value}." Each story is a distinct user need.

   **Functional Requirements** — Specific, testable behaviors organized by user story. Numbered (FR-001, FR-002, ...).

   **Non-Functional Requirements** — Performance, security, accessibility, compatibility. Numbered (NFR-001, ...).

   **Acceptance Criteria** — Testable statements defining "done." Every criterion must be verifiable. Numbered (AC-001, ...). Use checkboxes.

   **Out of Scope** — Explicitly what this spec does NOT cover.

   **Open Questions** — Unresolved items with checkboxes.

   **Constitution Compliance Check** — Table verifying compliance with each relevant constitutional section.

6. **CRITICAL: Zero implementation details.**
   - NO database names, table names, column names
   - NO framework-specific patterns or APIs
   - NO function signatures or class names
   - NO file paths or directory structures
   - NO "POST to /api/..." or "store in Redis"
   - If you catch yourself writing HOW, stop and rephrase as WHAT

7. **Run constitution compliance check:**
   - Verify no constitutional principles are violated
   - Verify no implicit technology assumptions
   - If a violation exists, flag it and resolve before proceeding

8. **If open questions exist:**
   Recommend: "There are {N} open questions. I recommend running /genesis:clarify {feature-name} before planning to resolve these."

9. **Self-validation pass (up to 3 iterations):**
   Re-read the spec you just wrote and check for these violations:
   - **Implementation leak:** Any mention of specific technologies, frameworks, database names, table schemas, file paths, API endpoints, class names, function signatures → rephrase as WHAT, not HOW
   - **Vague requirements:** "should be fast", "user-friendly", "scalable" without measurable targets → add specific metrics
   - **Missing acceptance criteria:** Any FR-* without a corresponding AC-* → add testable acceptance criteria
   - **Untestable criteria:** AC-* that cannot be objectively verified → rephrase to be verifiable
   - **Incomplete user stories:** Stories missing role, action, or value → complete them

   If violations found, fix them silently (no need to report each fix). After fixing, re-run the check. Maximum 3 iterations. On the final pass, report: "Spec self-validation passed ({N} issues auto-corrected)." or "Spec self-validation passed (clean)."

10. **Present for user review.** Iterate until approved.

11. **On approval:** Update the spec header: `**Status:** Approved`. If revising an existing spec, increment the version number and add a changelog entry.

12. **Create Git feature branch:**
    - Determine next branch number: check existing `genesis/*` branches
    - Create: `genesis/{NNN}-{feature-name}` (e.g., `genesis/001-user-auth`)
    - Switch to the new branch

13. **Git commit on feature branch:** `genesis: specify {feature-name}`

14. **Update `.genesis/project-state.md`:**
    - Active Feature: {feature-name}
    - Phase: specify
    - Branch: genesis/{NNN}-{feature-name}
    - Session log entry

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_specify` hooks and execute their instructions.
After completing: check for extensions with `after_specify` hooks and execute their instructions.

## Next Step

Suggest: "Run `/genesis:clarify {feature-name}` to resolve any ambiguities, or `/genesis:plan {feature-name}` if the spec is clear."
