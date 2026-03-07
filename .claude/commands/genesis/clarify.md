---
description: Resolve ambiguities and gaps in a specification before planning
argument-hint: "[feature-name]"
---

# Genesis Clarification

## Pre-flight

Read these files:
- `.genesis/specs/{feature-name}/spec.md` (REQUIRED — refuse if missing: "No spec found for '{feature-name}'. Run /genesis:specify {feature-name} first.")
- `.genesis/constitution.md`
- Relevant files in `.genesis/design/`

## Process

1. **Determine feature name:**
   - If $ARGUMENTS provided, use it
   - If empty, check project-state.md for active feature
   - If no active feature, ask: "Which feature's spec would you like to clarify?"

2. **Run structured coverage scan** across 10 taxonomy categories:

   | Category | What to Check |
   |----------|--------------|
   | Functional Scope | Are all capabilities fully defined? Any "TBD" or vague behaviors? |
   | Domain / Data Model | Are all entities, relationships, and constraints clear? |
   | Interaction / UX | Are user flows complete? Entry points, success/error/empty states? |
   | Non-Functional Quality | Are performance, scalability, reliability targets specific and measurable? |
   | Integration / Dependencies | Are external system interactions fully specified? |
   | Edge Cases | Are failure modes, boundary conditions, and concurrent access covered? |
   | Constraints / Tradeoffs | Are limitations acknowledged? Are tradeoff decisions documented? |
   | Terminology | Are domain-specific terms defined consistently? |
   | Completion Signals | Can you objectively determine when each requirement is "done"? |
   | Assumptions | Are implicit assumptions surfaced and documented? |

   Rate each category: **Clear** / **Partial** / **Missing**

3. **Generate targeted questions (maximum 5):**
   - Prioritize by impact (highest impact first)
   - Focus on categories rated Partial or Missing
   - For each question, provide an AI-recommended answer with reasoning
   - Format:
     ```
     Coverage Scan Results:
     | Category | Status |
     |----------|--------|
     | Functional Scope | Clear |
     | Edge Cases | Partial |
     | ...

     I've identified {N} areas needing clarification (showing top 5):

     Q1: {Question}
     Recommended: {AI suggestion with reasoning}
     ```

4. **Collect answers one at a time.**
   - Present one question, get the answer, update the spec immediately
   - Then present the next question with context from previous answers
   - If an answer raises a new critical question, it can replace a lower-priority one
   - After each answer, confirm understanding before moving on

5. **Update the spec:**
   - Refine ambiguous requirements to be specific
   - Add missing edge cases to functional requirements
   - Document assumptions explicitly
   - Strengthen acceptance criteria
   - Remove resolved items from Open Questions
   - Add new acceptance criteria if answers revealed new testable behaviors

6. **Re-run constitution compliance check** if answers changed the spec's scope or shape.

7. **Present coverage summary** showing before/after status per category:

   ```
   Coverage Summary:
   | Category | Before | After |
   |----------|--------|-------|
   | Functional Scope | Clear | Clear |
   | Edge Cases | Partial | Clear |
   | Assumptions | Missing | Clear |
   | ... | ... | ... |
   ```

8. **Present the updated spec** for user confirmation.

9. **Git commit:** `genesis: clarify {feature-name} specification`

10. **Update project-state.md** with session log entry.

## Value Proposition

This phase prevents expensive rework. A 10-minute clarification session can save hours of re-planning and re-implementation. Encourage the user to take this step seriously.

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_clarify` hooks and execute their instructions.
After completing: check for extensions with `after_clarify` hooks and execute their instructions.

## Next Step

Suggest: "Run `/genesis:plan {feature-name}` to create a technical implementation plan."
