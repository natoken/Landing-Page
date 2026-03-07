---
description: Generate a retroactive specification from existing code
argument-hint: "[feature-name]"
---

# Genesis Reverse Specify

Generate a specification from existing code — for brownfield projects that need to bring existing features under Genesis governance.

## Pre-flight

Read these files:
- `.genesis/constitution.md` (REQUIRED)
- `.genesis/project-state.md`
- `.genesis/discovery/context.md`

Verify the project is in Brownfield mode. If not, warn: "Reverse specification is designed for brownfield projects. For new features, use /genesis:specify instead."

## Process

### 1. Identify the Feature

If $ARGUMENTS provided, use as feature name (kebab-case).
If empty, ask: "What existing feature would you like to reverse-specify? Describe it or point to the relevant code directory/module."

### 2. Code Analysis

Scan the relevant code to extract:
- **Entry points:** Routes, API endpoints, exported functions, UI components
- **Data models:** Database schemas, type definitions, interfaces
- **Business logic:** Core algorithms, validation rules, state machines
- **External dependencies:** Third-party services, APIs, libraries used
- **Test coverage:** Existing tests, what they cover, what they miss
- **Configuration:** Environment variables, feature flags, settings

### 3. Generate Retroactive Spec

Create `.genesis/specs/{feature-name}/spec.md` using the standard spec template with these modifications:

**Header:** Set `**Status:** Retroactive` (indicating reverse-engineered, not forward-designed)

**Overview:** Describe what the feature currently does based on code analysis.

**User Stories:** Infer user stories from the code's behavior. Flag inferred stories: "(Inferred from code — verify with stakeholders)"

**Functional Requirements:** Extract from existing behavior. Each FR should note:
- Source: which file/function implements this requirement
- Confidence: High (clearly implemented) / Medium (partially implemented) / Low (unclear intent)

**Non-Functional Requirements:** Extract from existing implementation:
- Current performance characteristics (if measurable)
- Current security measures
- Current accessibility support

**Acceptance Criteria:** Derive from existing tests where possible. Flag gaps:
- `[x] AC-{NNN}: {criterion} — (verified by existing test in {file})`
- `[ ] AC-{NNN}: {criterion} — (NO existing test coverage)`

**Out of Scope:** Note related functionality that is NOT part of this feature.

**Open Questions:** List ambiguities discovered during analysis:
- Code with unclear intent
- Inconsistencies between implementation and any existing documentation
- Dead code or unused features

**Gap Analysis:**
- Features with no test coverage
- Implicit behavior not documented anywhere
- Potential bugs or inconsistencies discovered during analysis
- Constitutional compliance issues (tech stack, standards violations)

### 4. Present and Iterate

Present the retroactive spec for user review. The user should:
- Verify inferred user stories match actual intent
- Confirm or correct functional requirements
- Prioritize gaps for remediation
- Decide which acceptance criteria gaps need test coverage

### 5. On Approval

Update status to `**Status:** Approved (Retroactive)`.

### 6. Git Operations

- Create feature branch if not exists: `genesis/{NNN}-{feature-name}`
- Commit: `genesis: reverse-specify {feature-name}`

### 7. Update Project State

- Add to Active Features table
- Phase: specify (retroactive)
- Session log entry

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_specify` hooks and execute their instructions.
After completing: check for extensions with `after_specify` hooks and execute their instructions.

## Next Step

Suggest: "Run `/genesis:plan {feature-name}` to create an implementation plan for improvements, or `/genesis:clarify {feature-name}` to resolve the open questions first."
