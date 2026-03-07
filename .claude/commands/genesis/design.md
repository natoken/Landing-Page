---
description: Create or update design documentation
argument-hint: "[type] [name] — types: overview, feature, journey, architecture, data-model, api-contracts, integrations, system"
---

# Genesis Design Documentation

## Pre-flight

Read these files:
- `.genesis/constitution.md` (REQUIRED — refuse if missing: "Constitution not found. Run `/genesis:constitute` first.")
- `.genesis/discovery/context.md`
- `.genesis/project-state.md`
- All existing files in `.genesis/design/` for consistency

## Argument Parsing

Parse $ARGUMENTS to determine what to create:

| Argument | Output File |
|----------|-------------|
| `overview` | `.genesis/design/overview.md` |
| `feature {name}` | `.genesis/design/features/{name}.md` |
| `journey {name}` | `.genesis/design/user-journeys/{name}.md` |
| `architecture` | `.genesis/design/technical/architecture.md` |
| `data-model` | `.genesis/design/technical/data-model.md` |
| `api-contracts` | `.genesis/design/technical/api-contracts.md` |
| `integrations` | `.genesis/design/technical/integrations.md` |
| `system {name}` | `.genesis/design/systems/{name}.md` |
| `glossary` | `.genesis/design/glossary.md` |
| `decision {name}` | `.genesis/design/decisions/{name}.md` |
| `content-map` | `.genesis/design/content-map.md` |
| _(empty)_ | Ask what type of design document to create |

If the argument doesn't match any pattern, ask: "What type of design document would you like to create?" and present the options.

## Template Selection

| Type | Template |
|------|----------|
| overview | `.genesis/templates/design-overview-template.md` |
| feature | `.genesis/templates/feature-design-template.md` |
| journey | `.genesis/templates/user-journey-template.md` |
| architecture, data-model, api-contracts, integrations | `.genesis/templates/technical-spec-template.md` |
| system | `.genesis/templates/system-design-template.md` |
| glossary | `.genesis/templates/glossary-template.md` |
| decision | `.genesis/templates/adr-template.md` |
| content-map | `.genesis/templates/content-map-template.md` |

## Process

1. **Load the appropriate template** from `.genesis/templates/`.

2. **Read the constitution** for constraints, principles, and tech stack.

3. **Read all existing design docs** for consistency. Note terminology, patterns, and conventions already established.

4. **If the file already exists**, ask: "This design document already exists. Would you like to update it or start fresh?"

5. **Create or update the document:**
   - Use the template structure as a guide
   - Populate with project-specific content from discovery and constitution
   - For brownfield: include as-is and to-be states where relevant
   - For lowfield: adapt technical sections to content/domain equivalents
   - Omit sections that are genuinely not applicable (don't fill with "N/A")

6. **Cross-reference with other design docs:**
   - Check for contradictions with existing design docs
   - Ensure consistent terminology
   - Flag any inconsistencies: "This contradicts the architecture doc which states X. Which is correct?"

7. **Run constitution compliance check:**
   - Verify all technology references match the constitution's tech stack
   - Verify architectural decisions align with constitutional principles
   - If a violation is found: "This conflicts with your constitution (Section N: {title}). Would you like to modify the design to comply, or amend the constitution?"

8. **Present for user review.**

## Minimum Design Docs by Mode

Remind the user of what's recommended for their mode:

**Greenfield:**
- `design/overview.md` (required)
- Feature designs for all MVP features
- User journeys for primary flows
- `design/technical/architecture.md` (required)
- `design/technical/data-model.md` (if data persistence involved)

**Brownfield:**
- `design/overview.md` with as-is and to-be states (required)
- Gap analysis document
- Feature designs for planned improvements
- `design/technical/architecture.md` with current + target (required)

**Lowfield:**
- `design/overview.md` with domain overview and content strategy (required)
- `design/glossary.md` — project terminology and definitions
- `design/content-map.md` — content inventory and relationship tracking
- Content type definitions
- Content templates in `.genesis/templates/project/` (one per content type)
- Organizational structure
- Custom command specifications

## Lowfield: Content Template Generation

Before generating custom commands, generate content templates for each content type identified in the design overview:

1. **Identify content types** from the design overview (e.g., chapters, characters, research entries, etc.)

2. **For each content type**, create a template in `.genesis/templates/project/`:
   - Filename: `{content-type}-template.md` (kebab-case)
   - Include a standardized header with metadata fields
   - Include sections appropriate for the content type
   - Reference constitutional content standards (voice, tone, formatting)

3. **Common content template patterns:**
   - **Novel/Creative Writing:** `chapter-template.md`, `character-sheet-template.md`, `location-template.md`, `scene-template.md`
   - **Research Project:** `research-entry-template.md`, `source-template.md`, `finding-template.md`, `methodology-template.md`
   - **Knowledge Base:** `article-template.md`, `reference-template.md`, `how-to-template.md`

4. **Each template must include:**
   - Metadata header (title, status, date, related items)
   - Content sections appropriate for the type
   - Cross-reference section (for content map integration)
   - Quality checklist based on constitutional content standards

5. **Present templates for review** before generating custom commands.

## Lowfield: Custom Command Generation

After completing the minimum design docs for a Lowfield project, Genesis must generate project-specific slash commands. This is a critical step — it's what makes Lowfield projects operational.

1. **Identify content types** from the design overview and content type definitions.

2. **For each recurring workflow or content type**, generate a command file in `.claude/commands/project/`:
   - Filename: `{command-name}.md` (kebab-case)
   - Include YAML frontmatter with `description`
   - Include instructions tailored to the project's constitution and organizational structure
   - Reference the relevant design docs and content standards

3. **Common command patterns by project type:**
   - **Novel/Creative Writing:** `new-chapter.md`, `character.md`, `lore.md`, `outline.md`, `timeline.md`
   - **Research Project:** `new-entry.md`, `source.md`, `methodology.md`, `findings.md`, `literature-review.md`
   - **Knowledge Base:** `note.md`, `connect.md`, `review.md`, `index.md`
   - **Design System:** `component.md`, `pattern.md`, `guideline.md`, `changelog.md`

4. **Each generated command must:**
   - Read the constitution for content standards
   - Follow the organizational structure defined in the design docs
   - Use the correct naming conventions and file locations
   - Apply quality standards from the constitution
   - Create content in the appropriate directory with proper frontmatter/metadata

5. **Present the generated commands** to the user for review. They can customize or request additional commands.

6. **Inform the user:** "Your project commands are ready. Use `/project:{command}` to run them."

## State Update

Update `.genesis/project-state.md` with a session log entry describing what was created or updated.

Git commit: `genesis: create/update {type} design doc{: name if applicable}`

## Extension Hooks

Before starting: check `.genesis/extensions/` for extensions with `before_design` hooks and execute their instructions.
After completing: check for extensions with `after_design` hooks and execute their instructions.

## Next Step

Suggest: "When design is complete, run `/genesis:specify {feature-name}` to create a feature specification."
