---
description: Gather project information through guided conversation
---

# Genesis Discovery

Read `.genesis/project-state.md` to determine the project mode and current state.

## Pre-flight Check

- Verify Phase 0 (Init) is complete. If not: "Genesis not initialized. Run `/genesis:init` first."
- If discovery already exists at `.genesis/discovery/context.md`, ask: "Discovery has already been completed. Would you like to redo it or refine specific sections?"

## Mode-Specific Discovery

### Greenfield Mode

Conduct a guided conversation — NOT a form. Adapt to the user's responses. Skip irrelevant questions, probe deeper on vague answers.

**Collect information in these areas:**

1. **Project Identity** — Name, description, core purpose, target users, problem being solved, differentiators
2. **Scope & Features** — Essential capabilities for MVP, out-of-scope items, post-MVP phases, the single most important capability
3. **Constraints** — Timeline/deadlines, team size and composition, budget, compliance/regulatory requirements, organizational constraints
4. **Technology Preferences** — Languages, frontend/backend frameworks, databases, infrastructure, deployment targets (these become constitutional candidates)
5. **Organizational Standards** — Code style, documentation expectations, version control practices, CI/CD preferences, package management, commit conventions
6. **Integration Points** — External APIs, services, data sources, authentication providers, systems this project provides APIs for
7. **Quality Expectations** — Performance targets, testing philosophy, accessibility requirements, security posture, monitoring needs

Use the questions from `.genesis/templates/discovery-greenfield.md` as a guide, but adapt conversationally.

### Brownfield Mode

Everything in Greenfield, PLUS a two-part process:

**Part 1: Automated Codebase Scan**
Run analysis of the existing codebase:
- Scan file extensions to identify languages and frameworks
- Analyze directory structure and file organization
- Check for test files, test configuration, and test frameworks
- Review package dependencies for health (outdated, vulnerabilities)
- Check for CI/CD, linting, formatting, Docker, and other configuration files
- Analyze Git history (commit count, branches, patterns, contributors)
- Assess documentation state (README, inline docs, external docs)

**Part 2: Human Context**
- Project history, major phases, pivotal decisions
- Current development practices (builds, tests, deploys, code review)
- Pain points (what's hard, slow, broken, confusing)
- Technical debt inventory
- What works well (don't fix what isn't broken)
- Improvement priorities (top 3 things to fix)

**Part 3: Gap Analysis**
Automatically generate a comparison:
- What a greenfield project at this stage would have vs. what exists
- Categorize each area as: Missing, Partial, or Present
- Create a priority-ordered convergence plan

Use `.genesis/templates/discovery-brownfield.md` as a guide.

### Lowfield Mode

Conduct a guided conversation focused on the domain:

1. **Domain & Purpose** — What the project is about, ongoing goal, audience, success definition
2. **Content Types** — What kinds of documents/artifacts, their structure, typical length, relationships
3. **Organizational Structure** — Hierarchy, naming conventions, tags/categories, cross-referencing
4. **Recurring Workflows** — Regular activities, content creation flow, review/editing cycles
5. **Reference Materials** — Existing materials, imports needed
6. **Tools & Formats** — Primary format, editor/platform, export needs
7. **Quality Standards** — What makes content "good," review process, common mistakes, style guidelines

Use `.genesis/templates/discovery-lowfield.md` as a guide.

## Output

Create `.genesis/discovery/context.md` with all gathered information, organized by category. Include:
- A structured summary of all information collected
- For brownfield: the complete codebase scan results and gap analysis
- For lowfield: content type definitions and workflow descriptions

End with a summary for user confirmation:
"Here's what I've gathered about your project. Please review and confirm, or let me know what needs correction."

## State Update

Update `.genesis/project-state.md`:
- Current Phase: "Discovery complete"
- Add session log entry summarizing what was gathered

Git commit: `genesis: complete project discovery`

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_discover` hooks and execute their instructions.
After completing: check for extensions with `after_discover` hooks and execute their instructions.

## Next Step

Suggest: "Run `/genesis:constitute` to create your project constitution."
