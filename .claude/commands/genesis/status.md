---
description: Show current project state, progress, and blockers
---

# Genesis Status

Read `.genesis/project-state.md` and display a formatted summary.

## Display Format

### Header
```
Project: {Project Name}
Mode: {Greenfield|Brownfield|Lowfield}
Phase: {Current Phase}
Genesis Version: {version}
```

### Active Features
If there are active features, display as a table:
```
| Feature | Phase | Progress | Branch |
|---------|-------|----------|--------|
| {feature-name} | {phase} | {X of Y tasks} | genesis/{NNN}-{name} |
```

If multiple features are active, list all. Highlight the most recently updated one.

If no active features:
```
No active features. Ready for next task.
```

### Completed Features
Display the completed features table if any entries exist.

### Key Decisions
Display the key decisions table if any entries exist. Highlight constitutional decisions.

### Open Questions
List any unresolved questions.

### Blockers
List any blockers preventing progress. For each blocker, suggest a resolution path.

### Recent Activity
Show the last 3-5 session log entries.

### Custom Phases
List custom phases and their last run dates, if any exist.

### Brownfield: Convergence Progress

If mode is Brownfield, display convergence tracking:
```
Convergence Progress: {percentage}%

| Category | Status | Notes |
|----------|--------|-------|
| Documented principles | {Present/Missing/Partial} | {was: Missing} |
| Design documentation | {Present/Missing/Partial} | {was: Missing} |
| Test coverage | {current}% / {target}% | {was: {original}%} |
| CI/CD pipeline | {Present/Missing/Partial} | {was: Missing} |
| Code standards compliance | {percentage}% | {was: {original}%} |
```

Also show technical debt summary if `.genesis/debt/` contains items:
```
Technical Debt: {N} open items ({critical} critical, {high} high)
```

### Lowfield: Content Metrics

If mode is Lowfield, display content-specific metrics based on the project type (inferred from constitution and design docs):

For **Novel/Creative Writing:**
```
Content: {N} chapters / {planned} planned
Words: {count} (target: {target})
Characters: {N} introduced
Unresolved plot threads: {N}
```

For **Research Project:**
```
Entries: {N} total
Sources cited: {N}
Research questions addressed: {N} / {total}
```

For **Knowledge Base:**
```
Topics: {N} total
Orphan entries: {N} (no cross-references)
Last updated: {date}
```

### Archived Features

If `.genesis/archive/` contains archived features, list them briefly:
```
Archived: {N} features (run /genesis:archive to manage)
```

## Next Steps

Based on the current state, suggest what to do next:

- If just initialized: "Run /genesis:discover to gather project information."
- If discovery complete: "Run /genesis:constitute to create your project constitution."
- If constitution established: "Run /genesis:design overview to start design documentation."
- If design docs exist but no specs: "Run /genesis:specify {feature} to specify your first feature."
- If spec exists but no plan: "Run /genesis:plan {feature} to create an implementation plan."
- If plan exists but no tasks: "Run /genesis:tasks {feature} to break down into tasks."
- If tasks exist: "Run /genesis:implement {feature} to start building."
- If implementation complete: "Run /genesis:review {feature} to validate the work."
- If review passed: "Feature complete! Specify the next feature with /genesis:specify {next-feature}."
